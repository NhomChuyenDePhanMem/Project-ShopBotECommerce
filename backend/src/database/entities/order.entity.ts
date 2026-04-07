import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderItem } from './order-item.entity';

import { Payment } from './payment.entity';

import { User } from './user.entity';

export type OrderType = 'shipping' | 'pickup';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'packing'
  | 'shipping'
  | 'done'
  | 'cancelled';

@Entity({ name: 'orders' })
@Index(['createdBy'])
@Index(['status'])
export class CustomerOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'created_by', type: 'int' })
  createdBy: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @Column({
    name: 'customer_name',

    type: 'varchar',

    length: 120,

    nullable: true,
  })
  customerName: string | null;

  @Column({ name: 'order_type', type: 'varchar', length: 20 })
  orderType: OrderType;

  @Column({ type: 'varchar', length: 20 })
  status: OrderStatus;

  @CreateDateColumn({ name: 'ordered_at', type: 'timestamp' })
  orderedAt: Date;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment | null;
}
