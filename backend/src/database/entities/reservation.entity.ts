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
  | 'pending'
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_id', type: 'int' })
  tableId: number;

  @ManyToOne(() => DiningTable, (table) => table.reservations, { eager: true })
  @JoinColumn({ name: 'table_id' })
  table: DiningTable;

  @Column({ name: 'customer_name', type: 'varchar', length: 120 })
  customerName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'party_size', type: 'int' })
  partySize: number;

  @Column({ name: 'reserved_at', type: 'timestamp', nullable: true })
  reservedAt: Date | null;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: ReservationStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
