import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import { Reservation } from '../../database/entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Reservation)
    private readonly reservations: Repository<Reservation>,
    @InjectRepository(DiningTable)
    private readonly tables: Repository<DiningTable>,
  ) {}

  async findAll() {
    return this.reservations.find({ order: { id: 'DESC' } });
  }

  async findById(id: string) {
    const reservation = await this.reservations.findOne({
      where: { id: this.parseId(id) },
    });
    if (!reservation) throw new NotFoundException('Reservation not found');
    return reservation;
  }

  async create(dto: CreateReservationDto) {
    return this.dataSource.transaction(async (manager) => {
      const table = await manager.findOne(DiningTable, {
        where: { id: dto.tableId },
      });
      if (!table) throw new BadRequestException('tableId not found');
      if (table.capacity < dto.partySize) {
        throw new BadRequestException('Party size exceeds table capacity');
      }
      if (table.status === 'inactive' || table.status === 'occupied') {
        throw new BadRequestException('Table is not available for reservation');
      }

      const reservation = manager.create(Reservation, {
        tableId: dto.tableId,
        customerName: dto.customerName.trim(),
        phone: dto.phone?.trim() || null,
        partySize: dto.partySize,
        reservedAt: new Date(dto.reservedAt),
        status: 'pending',
        note: dto.note?.trim() || null,
      });
      const created = await manager.save(Reservation, reservation);

      table.status = 'reserved';
      await manager.save(DiningTable, table);
      return created;
    });
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto) {
    const reservationId = this.parseId(id);
    return this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(Reservation, {
        where: { id: reservationId },
      });
      if (!reservation) throw new NotFoundException('Reservation not found');

      reservation.status = dto.status;
      const saved = await manager.save(Reservation, reservation);

      const table = await manager.findOne(DiningTable, {
        where: { id: reservation.tableId },
      });
      if (!table) return saved;

      if (dto.status === 'seated') table.status = 'occupied';
      if (dto.status === 'completed' || dto.status === 'cancelled') {
        table.status = 'available';
      }
      if (dto.status === 'confirmed') table.status = 'reserved';
      await manager.save(DiningTable, table);
      return saved;
    });
  }

  async remove(id: string) {
    const reservationId = this.parseId(id);
    return this.dataSource.transaction(async (manager) => {
      const reservation = await manager.findOne(Reservation, {
        where: { id: reservationId },
      });
      if (!reservation) throw new NotFoundException('Reservation not found');
      const table = await manager.findOne(DiningTable, {
        where: { id: reservation.tableId },
      });
      await manager.delete(Reservation, reservation.id);
      if (table && table.status !== 'inactive') {
        table.status = 'available';
        await manager.save(DiningTable, table);
      }
      return { deleted: true };
    });
  }

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return id;
  }
}
