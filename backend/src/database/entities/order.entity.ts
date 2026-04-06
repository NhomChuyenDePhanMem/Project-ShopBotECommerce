import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiningTable } from './dining-table.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';
import { User } from './user.entity';

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';
export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'served'
  | 'paid'
  | 'cancelled';

@Entity({ name: 'orders' })
export class CustomerOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_id', type: 'int', nullable: true })
  tableId: number | null;

  @ManyToOne(() => DiningTable, (table) => table.orders, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'table_id' })
  table: DiningTable | null;

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
