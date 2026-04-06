import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiningTable } from './dining-table.entity';

export type ReservationStatus =
  | 'booked'
  | 'checked_in'
  | 'cancelled'
  | 'completed';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_id', type: 'int' })
  tableId: number;

  @ManyToOne(() => DiningTable, (table) => table.reservations)
  @JoinColumn({ name: 'table_id' })
  table: DiningTable;

  @Column({ name: 'customer_name', type: 'varchar', length: 120 })
  customerName: string;

  @Column({ name: 'customer_phone', type: 'varchar', length: 20 })
  customerPhone: string;

  @Column({ name: 'reserved_time', type: 'timestamp' })
  reservedTime: Date;

  @Column({ name: 'party_size', type: 'int' })
  partySize: number;

  @Column({ type: 'varchar', length: 20 })
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
