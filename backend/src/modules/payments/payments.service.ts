import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../../database/entities/order-item.entity';
import { CustomerOrder } from '../../database/entities/order.entity';
import { Payment } from '../../database/entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly payments: Repository<Payment>,
    @InjectRepository(CustomerOrder)
    private readonly orders: Repository<CustomerOrder>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
  ) {}

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return id;
  }

  private toView(payment: Payment) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      paymentMethod: payment.paymentMethod,
      amount: Number(payment.amount),
      paidAt: payment.paidAt,
      status: payment.status,
      transactionRef: payment.transactionRef,
    };
  }

  async findAll() {
    const rows = await this.payments.find({ order: { id: 'DESC' } });
    return rows.map((row) => this.toView(row));
  }

  async findByOrderId(orderId: string) {
    const id = this.parseId(orderId);
    const payment = await this.payments.findOne({ where: { orderId: id } });
    return payment ? [this.toView(payment)] : [];
  }

  private async orderTotal(orderId: number): Promise<number> {
    const items = await this.orderItems.find({ where: { orderId } });
    return items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0,
    );
  }

  async create(dto: CreatePaymentDto) {
    const order = await this.orders.findOne({ where: { id: dto.orderId } });
    if (!order) {
      throw new BadRequestException('orderId không tồn tại');
    }
    if (order.status === 'cancelled') {
      throw new BadRequestException('Không thể thanh toán đơn đã hủy');
    }
    if (order.status === 'done') {
      throw new ConflictException('Đơn hàng đã hoàn tất');
    }

    const exists = await this.payments.exist({
      where: { orderId: dto.orderId },
    });
    if (exists) {
      throw new ConflictException('Đơn hàng này đã có payment');
    }

    const total = await this.orderTotal(dto.orderId);
    if (Math.abs(total - dto.amount) > 0.01) {
      throw new BadRequestException(`Amount không khớp tổng đơn (${total})`);
    }

    const payment = await this.payments.save(
      this.payments.create({
        orderId: dto.orderId,
        paymentMethod: dto.paymentMethod,
        amount: dto.amount.toFixed(2),
        status: dto.status ?? 'success',
        transactionRef: dto.transactionRef?.trim() || null,
      }),
    );

    if (payment.status === 'success') {
      order.status = 'done';
      await this.orders.save(order);
    }

    return this.toView(payment);
  }

  async markPaid(paymentId: string) {
    const payment = await this.payments.findOne({
      where: { id: this.parseId(paymentId) },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = 'success';
    payment.paidAt = new Date();
    const saved = await this.payments.save(payment);

    const order = await this.orders.findOne({ where: { id: saved.orderId } });
    if (order && order.status !== 'done') {
      order.status = 'done';
      await this.orders.save(order);
    }

    return this.toView(saved);
  }
}
