import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Reservation } from './reservation.entity';

export type DiningTableStatus =
  | 'available'
  | 'reserved'
  | 'occupied'
  | 'inactive';

@Entity({ name: 'dining_tables' })
export class DiningTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 40, unique: true })
  code: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'varchar', length: 20, default: 'available' })
  status: DiningTableStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations: Reservation[];
}
