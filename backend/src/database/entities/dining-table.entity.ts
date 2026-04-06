import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CustomerOrder } from './order.entity';
import { Reservation } from './reservation.entity';

export type DiningTableStatus = 'available' | 'occupied' | 'reserved';

@Entity({ name: 'dining_tables' })
export class DiningTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'table_code', type: 'varchar', length: 20, unique: true })
  tableCode: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'varchar', length: 20 })
  status: DiningTableStatus;

  @OneToMany(() => CustomerOrder, (order) => order.table)
  orders: CustomerOrder[];

  @OneToMany(() => Reservation, (reservation) => reservation.table)
  reservations: Reservation[];
}
