import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import {
  CustomerOrder,
  OrderStatus,
  OrderType,
} from '../../database/entities/order.entity';
import { User } from '../../database/entities/user.entity';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CustomerOrder)
    private readonly orders: Repository<CustomerOrder>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private readonly menuItems: Repository<MenuItem>,
    @InjectRepository(DiningTable)
    private readonly tables: Repository<DiningTable>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  private toOrderView(order: CustomerOrder) {
    const items = (order.items ?? []).map((item) => ({
      id: item.id,
      orderId: item.orderId,
      menuItemId: item.menuItemId,
      menuItemName: item.menuItem?.name ?? null,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.unitPrice) * item.quantity,
      itemNote: item.itemNote,
    }));
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
      id: order.id,
      tableId: order.tableId,
      tableCode: order.table?.tableCode ?? null,
      createdBy: order.createdBy,
      createdByUsername: order.createdByUser?.username ?? null,
      customerName: order.customerName,
      orderType: order.orderType,
      status: order.status,
      orderedAt: order.orderedAt,
      note: order.note,
      items,
      total,
      payment: order.payment
        ? {
            id: order.payment.id,
            method: order.payment.paymentMethod,
            amount: Number(order.payment.amount),
            status: order.payment.status,
            paidAt: order.payment.paidAt,
          }
        : null,
    };
  }

  private async findOrderEntity(id: number): Promise<CustomerOrder> {
    const order = await this.orders.findOne({
      where: { id },
      relations: [
        'items',
        'items.menuItem',
        'payment',
        'table',
        'createdByUser',
      ],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return id;
  }

  async findAll() {
    const list = await this.orders.find({
      relations: [
        'items',
        'items.menuItem',
        'payment',
        'table',
        'createdByUser',
      ],
      order: { id: 'DESC' },
    });
    return list.map((order) => this.toOrderView(order));
  }

  async findById(id: string) {
    const order = await this.findOrderEntity(this.parseId(id));
    return this.toOrderView(order);
  }

  async create(dto: CreateOrderDto) {
    const createdId = await this.dataSource.transaction(async (manager) => {
      const creator = await manager.findOne(User, { where: { id: dto.createdBy } });
      if (!creator) {
        throw new BadRequestException('createdBy không hợp lệ');
      }

      const tableId: number | null = dto.tableId ?? null;
      if (dto.orderType === 'dine_in' && !tableId) {
        throw new BadRequestException('Đơn dine_in bắt buộc có tableId');
      }
      if (tableId) {
        const table = await manager.findOne(DiningTable, { where: { id: tableId } });
        if (!table) {
          throw new BadRequestException('tableId không tồn tại');
        }
        if (table.status === 'occupied') {
          throw new ConflictException('Bàn hiện đang occupied');
        }
      }

      const menuIds = Array.from(new Set(dto.items.map((item) => item.menuItemId)));
      const menuRows = await manager.find(MenuItem, { where: { id: In(menuIds) } });
      if (menuRows.length !== menuIds.length) {
        throw new BadRequestException('Có menu item không tồn tại');
      }
      const menuMap = new Map<number, MenuItem>(menuRows.map((row) => [row.id, row]));

      for (const item of dto.items) {
        const menu = menuMap.get(item.menuItemId);
        if (!menu) {
          throw new BadRequestException(`Menu item #${item.menuItemId} không tồn tại`);
        }
        if (!menu.isAvailable) {
          throw new BadRequestException(`Menu item #${item.menuItemId} đang tạm ngưng`);
        }
      }

      const order = await manager.save(
        CustomerOrder,
        manager.create(CustomerOrder, {
          tableId,
          createdBy: dto.createdBy,
          customerName: dto.customerName?.trim() || null,
          orderType: dto.orderType as OrderType,
          status: 'pending',
          note: dto.note?.trim() || null,
        }),
      );

      const entities = dto.items.map((item) => {
        const menu = menuMap.get(item.menuItemId)!;
        return manager.create(OrderItem, {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          unitPrice: menu.price,
          itemNote: item.itemNote?.trim() || null,
        });
      });
      await manager.save(OrderItem, entities);

      if (tableId) {
        await manager.update(DiningTable, tableId, { status: 'occupied' });
      }

      return order.id;
    });

    const created = await this.findOrderEntity(createdId);
    return this.toOrderView(created);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const updatedId = await this.transitionOrderStatus(
      this.parseId(id),
      dto.status as OrderStatus,
    );
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async kitchenAccept(id: string) {
    const updatedId = await this.transitionOrderStatus(this.parseId(id), 'processing');
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async kitchenServe(id: string) {
    const updatedId = await this.transitionOrderStatus(this.parseId(id), 'served');
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async cashierPay(id: string) {
    const updatedId = await this.transitionOrderStatus(this.parseId(id), 'paid');
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async cashierCancel(id: string) {
    const updatedId = await this.transitionOrderStatus(this.parseId(id), 'cancelled');
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async addItem(orderId: string, dto: AddOrderItemDto) {
    const parsedOrderId = this.parseId(orderId);
    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(CustomerOrder, {
        where: { id: parsedOrderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (!this.isOrderEditable(order.status)) {
        throw new BadRequestException('Không thể sửa item ở trạng thái hiện tại');
      }

      const menu = await manager.findOne(MenuItem, {
        where: { id: dto.menuItemId },
      });
      if (!menu) {
        throw new BadRequestException('menuItemId không tồn tại');
      }
      if (!menu.isAvailable) {
        throw new BadRequestException('Món ăn đang tạm ngưng');
      }

      const existed = await manager.findOne(OrderItem, {
        where: { orderId: order.id, menuItemId: dto.menuItemId },
      });
      if (existed) {
        existed.quantity += dto.quantity;
        if (dto.itemNote !== undefined) {
          existed.itemNote = dto.itemNote.trim() || null;
        }
        await manager.save(OrderItem, existed);
        return;
      }

      await manager.save(
        OrderItem,
        manager.create(OrderItem, {
          orderId: order.id,
          menuItemId: dto.menuItemId,
          quantity: dto.quantity,
          unitPrice: menu.price,
          itemNote: dto.itemNote?.trim() || null,
        }),
      );
    });
    return this.findById(String(parsedOrderId));
  }

  async updateItem(orderId: string, itemId: string, dto: UpdateOrderItemDto) {
    const parsedOrderId = this.parseId(orderId);
    const parsedItemId = this.parseId(itemId);

    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(CustomerOrder, {
        where: { id: parsedOrderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (!this.isOrderEditable(order.status)) {
        throw new BadRequestException('Không thể sửa item ở trạng thái hiện tại');
      }

      const item = await manager.findOne(OrderItem, {
        where: { id: parsedItemId, orderId: order.id },
      });
      if (!item) {
        throw new NotFoundException('Order item not found');
      }

      if (dto.menuItemId !== undefined && dto.menuItemId !== item.menuItemId) {
        const menu = await manager.findOne(MenuItem, {
          where: { id: dto.menuItemId },
        });
        if (!menu) {
          throw new BadRequestException('menuItemId không tồn tại');
        }
        if (!menu.isAvailable) {
          throw new BadRequestException('Món ăn đang tạm ngưng');
        }
        item.menuItemId = dto.menuItemId;
        item.unitPrice = menu.price;
      }
      if (dto.quantity !== undefined) {
        item.quantity = dto.quantity;
      }
      if (dto.itemNote !== undefined) {
        item.itemNote = dto.itemNote.trim() || null;
      }
      await manager.save(OrderItem, item);
    });

    return this.findById(String(parsedOrderId));
  }

  async removeItem(orderId: string, itemId: string) {
    const parsedOrderId = this.parseId(orderId);
    const parsedItemId = this.parseId(itemId);

    await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(CustomerOrder, {
        where: { id: parsedOrderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (!this.isOrderEditable(order.status)) {
        throw new BadRequestException('Không thể sửa item ở trạng thái hiện tại');
      }

      const item = await manager.findOne(OrderItem, {
        where: { id: parsedItemId, orderId: order.id },
      });
      if (!item) {
        throw new NotFoundException('Order item not found');
      }

      const count = await manager.count(OrderItem, { where: { orderId: order.id } });
      if (count <= 1) {
        throw new BadRequestException('Đơn hàng phải còn tối thiểu 1 món');
      }

      await manager.delete(OrderItem, item.id);
    });

    return this.findById(String(parsedOrderId));
  }

  private isOrderEditable(status: OrderStatus): boolean {
    return status === 'pending' || status === 'processing';
  }

  private async transitionOrderStatus(
    orderId: number,
    next: OrderStatus,
  ): Promise<number> {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      pending: ['processing', 'cancelled'],
      processing: ['served', 'cancelled'],
      served: ['paid', 'cancelled'],
      paid: [],
      cancelled: [],
    };

    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(CustomerOrder, { where: { id: orderId } });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (!transitions[order.status].includes(next)) {
        throw new BadRequestException(
          `Không thể chuyển trạng thái từ ${order.status} sang ${next}`,
        );
      }

      order.status = next;
      await manager.save(CustomerOrder, order);

      if ((next === 'paid' || next === 'cancelled') && order.tableId) {
        await manager.update(DiningTable, order.tableId, { status: 'available' });
      }
      return order.id;
    });
  }
}
