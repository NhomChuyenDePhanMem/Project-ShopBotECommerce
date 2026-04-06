import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerOrder } from './order.entity';

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'e_wallet';
export type PaymentStatus = 'success' | 'failed' | 'refunded';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'int', unique: true })
  orderId: number;

  @OneToOne(() => CustomerOrder, (order) => order.payment, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'order_id' })
  order: CustomerOrder;

  @Column({ name: 'payment_method', type: 'varchar', length: 20 })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @CreateDateColumn({ name: 'paid_at', type: 'timestamp' })
  paidAt: Date;

  @Column({ type: 'varchar', length: 20 })
  status: PaymentStatus;

  @Column({
    name: 'transaction_ref',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  transactionRef: string | null;
}
