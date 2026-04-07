import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from '../../database/entities/product.entity';
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

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['packing', 'shipping', 'cancelled'],
  packing: ['shipping', 'cancelled'],
  shipping: ['done', 'cancelled'],
  done: [],
  cancelled: [],
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CustomerOrder)
    private readonly orders: Repository<CustomerOrder>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  private toOrderView(order: CustomerOrder) {
    const items = (order.items ?? []).map((item) => ({
      id: item.id,
      orderId: item.orderId,
      productId: item.productId,
      productName: item.product?.name ?? null,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.unitPrice) * item.quantity,
      itemNote: item.itemNote,
    }));
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);

    return {
      id: order.id,
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
      relations: ['items', 'items.product', 'payment', 'createdByUser'],
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
      relations: ['items', 'items.product', 'payment', 'createdByUser'],
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
      const creator = await manager.findOne(User, {
        where: { id: dto.createdBy },
      });
      if (!creator) {
        throw new BadRequestException('createdBy không hợp lệ');
      }

      const productIds = Array.from(
        new Set(dto.items.map((item) => item.productId)),
      );
      const productRows = await manager.find(Product, {
        where: { id: In(productIds) },
      });
      if (productRows.length !== productIds.length) {
        throw new BadRequestException('Có sản phẩm không tồn tại');
      }
      const productMap = new Map<number, Product>(
        productRows.map((row) => [row.id, row]),
      );

      for (const item of dto.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new BadRequestException(
            `Sản phẩm #${item.productId} không tồn tại`,
          );
        }
        if (!product.isAvailable) {
          throw new BadRequestException(
            `Sản phẩm #${item.productId} đang tạm ngưng`,
          );
        }
      }

      const order = await manager.save(
        CustomerOrder,
        manager.create(CustomerOrder, {
          createdBy: dto.createdBy,
          customerName: dto.customerName?.trim() || null,
          orderType: dto.orderType as OrderType,
          status: 'pending',
          note: dto.note?.trim() || null,
        }),
      );

      const entities = dto.items.map((item) => {
        const product = productMap.get(item.productId)!;
        return manager.create(OrderItem, {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          itemNote: item.itemNote?.trim() || null,
        });
      });
      await manager.save(OrderItem, entities);

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

  async sellerAdvanceToConfirmed(id: string) {
    const updatedId = await this.transitionOrderStatus(
      this.parseId(id),
      'confirmed',
    );
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async sellerAdvanceToPacking(id: string) {
    const updatedId = await this.transitionOrderStatus(
      this.parseId(id),
      'packing',
    );
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async sellerAdvanceToShipping(id: string) {
    const updatedId = await this.transitionOrderStatus(
      this.parseId(id),
      'shipping',
    );
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async customerMarkOrderDone(id: string) {
    const updatedId = await this.transitionOrderStatus(
      this.parseId(id),
      'done',
    );
    const updated = await this.findOrderEntity(updatedId);
    return this.toOrderView(updated);
  }

  async customerMarkOrderCancelled(id: string) {
    const updatedId = await this.transitionOrderStatus(
      this.parseId(id),
      'cancelled',
    );
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
        throw new BadRequestException(
          'Không thể sửa item ở trạng thái hiện tại',
        );
      }

      const product = await manager.findOne(Product, {
        where: { id: dto.productId },
      });
      if (!product) {
        throw new BadRequestException('productId không tồn tại');
      }
      if (!product.isAvailable) {
        throw new BadRequestException('Sản phẩm đang tạm ngưng');
      }

      const existed = await manager.findOne(OrderItem, {
        where: { orderId: order.id, productId: dto.productId },
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
          productId: dto.productId,
          quantity: dto.quantity,
          unitPrice: product.price,
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
        throw new BadRequestException(
          'Không thể sửa item ở trạng thái hiện tại',
        );
      }

      const item = await manager.findOne(OrderItem, {
        where: { id: parsedItemId, orderId: order.id },
      });
      if (!item) {
        throw new NotFoundException('Order item not found');
      }

      if (dto.productId !== undefined && dto.productId !== item.productId) {
        const product = await manager.findOne(Product, {
          where: { id: dto.productId },
        });
        if (!product) {
          throw new BadRequestException('productId không tồn tại');
        }
        if (!product.isAvailable) {
          throw new BadRequestException('Sản phẩm đang tạm ngưng');
        }
        item.productId = dto.productId;
        item.unitPrice = product.price;
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
        throw new BadRequestException(
          'Không thể sửa item ở trạng thái hiện tại',
        );
      }

      const item = await manager.findOne(OrderItem, {
        where: { id: parsedItemId, orderId: order.id },
      });
      if (!item) {
        throw new NotFoundException('Order item not found');
      }

      const count = await manager.count(OrderItem, {
        where: { orderId: order.id },
      });
      if (count <= 1) {
        throw new BadRequestException('Đơn hàng phải còn tối thiểu 1 sản phẩm');
      }

      await manager.delete(OrderItem, item.id);
    });

    return this.findById(String(parsedOrderId));
  }

  private isOrderEditable(status: OrderStatus): boolean {
    return status === 'pending' || status === 'confirmed';
  }

  private async transitionOrderStatus(
    orderId: number,
    next: OrderStatus,
  ): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(CustomerOrder, {
        where: { id: orderId },
      });
      if (!order) {
        throw new NotFoundException('Order not found');
      }
      if (!ORDER_STATUS_TRANSITIONS[order.status].includes(next)) {
        throw new BadRequestException(
          `Không thể chuyển trạng thái từ ${order.status} sang ${next}`,
        );
      }

      order.status = next;
      await manager.save(CustomerOrder, order);
      return order.id;
    });
  }
}
