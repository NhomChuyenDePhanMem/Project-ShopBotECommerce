import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import {
  Reservation,
  ReservationStatus,
} from '../../database/entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationStatusDto } from './dto/update-reservation-status.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservations: Repository<Reservation>,
    @InjectRepository(DiningTable)
    private readonly tables: Repository<DiningTable>,
  ) {}

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return id;
  }

  private async findReservationEntity(id: number): Promise<Reservation> {
    const row = await this.reservations.findOne({
      where: { id },
      relations: ['table'],
    });
    if (!row) {
      throw new NotFoundException('Reservation not found');
    }
    return row;
  }

  private async syncTableStatusByReservation(
    tableId: number,
    status: ReservationStatus,
  ): Promise<void> {
    if (status === 'checked_in') {
      await this.tables.update(tableId, { status: 'occupied' });
      return;
    }
    if (status === 'booked') {
      await this.tables.update(tableId, { status: 'reserved' });
      return;
    }
    await this.tables.update(tableId, { status: 'available' });
  }

  async findAll(activeOnly?: boolean) {
    const rows = await this.reservations.find({
      where: activeOnly ? { reservedTime: MoreThan(new Date()) } : {},
      relations: ['table'],
      order: { reservedTime: 'ASC' },
    });
    return rows;
  }

  async findById(id: string) {
    return this.findReservationEntity(this.parseId(id));
  }

  async create(dto: CreateReservationDto) {
    const table = await this.tables.findOne({ where: { id: dto.tableId } });
    if (!table) {
      throw new BadRequestException('tableId không tồn tại');
    }
    if (dto.partySize > table.capacity) {
      throw new BadRequestException('partySize vượt quá sức chứa của bàn');
    }
    if (table.status === 'occupied') {
      throw new BadRequestException('Bàn đang occupied');
    }

    const reservedAt = new Date(dto.reservedTime);
    const rangeStart = new Date(reservedAt.getTime() - 2 * 60 * 60 * 1000);
    const rangeEnd = new Date(reservedAt.getTime() + 2 * 60 * 60 * 1000);
    const overlaps = await this.reservations
      .createQueryBuilder('r')
      .where('r.table_id = :tableId', { tableId: dto.tableId })
      .andWhere('r.status IN (:...statuses)', {
        statuses: ['booked', 'checked_in'],
      })
      .andWhere('r.reserved_time BETWEEN :start AND :end', {
        start: rangeStart,
        end: rangeEnd,
      })
      .getCount();
    if (overlaps > 0) {
      throw new BadRequestException('Khung giờ này đã có đặt bàn gần kề');
    }

    const created = await this.reservations.save(
      this.reservations.create({
        tableId: dto.tableId,
        customerName: dto.customerName.trim(),
        customerPhone: dto.customerPhone.trim(),
        reservedTime: reservedAt,
        partySize: dto.partySize,
        status: dto.status ?? 'booked',
      }),
    );
    await this.syncTableStatusByReservation(created.tableId, created.status);
    return this.findReservationEntity(created.id);
  }

  async updateStatus(id: string, dto: UpdateReservationStatusDto) {
    const reservation = await this.findReservationEntity(this.parseId(id));
    reservation.status = dto.status;
    const saved = await this.reservations.save(reservation);
    await this.syncTableStatusByReservation(saved.tableId, saved.status);
    return this.findReservationEntity(saved.id);
  }
}
