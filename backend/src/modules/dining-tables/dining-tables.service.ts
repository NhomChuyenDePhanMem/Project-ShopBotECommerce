import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import { Reservation } from '../../database/entities/reservation.entity';
import { CreateDiningTableDto } from './dto/create-dining-table.dto';
import { UpdateDiningTableStatusDto } from './dto/update-dining-table-status.dto';

@Injectable()
export class DiningTablesService {
  constructor(
    @InjectRepository(DiningTable)
    private readonly tables: Repository<DiningTable>,
    @InjectRepository(Reservation)
    private readonly reservations: Repository<Reservation>,
  ) {}

  async findAll() {
    return this.tables.find({ order: { id: 'ASC' } });
  }

  async findById(id: string) {
    const table = await this.tables.findOne({
      where: { id: this.parseId(id) },
    });
    if (!table) throw new NotFoundException('Dining table not found');
    return table;
  }

  async create(dto: CreateDiningTableDto) {
    const code = dto.code.trim();
    if (!code) throw new BadRequestException('code is required');
    const exists = await this.tables.exist({ where: { code } });
    if (exists) throw new BadRequestException('Table code already exists');

    const created = this.tables.create({
      code,
      capacity: dto.capacity,
      status: 'available',
      note: dto.note?.trim() || null,
    });
    return this.tables.save(created);
  }

  async updateStatus(id: string, dto: UpdateDiningTableStatusDto) {
    const table = await this.findById(id);
    table.status = dto.status;
    return this.tables.save(table);
  }

  async remove(id: string) {
    const tableId = this.parseId(id);
    const activeReservation = await this.reservations.exist({
      where: { tableId, status: 'pending' },
    });
    if (activeReservation) {
      throw new BadRequestException(
        'Cannot delete table with active pending reservation',
      );
    }
    const target = await this.tables.findOne({ where: { id: tableId } });
    if (!target) throw new NotFoundException('Dining table not found');
    await this.tables.remove(target);
    return { deleted: true };
  }

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return id;
  }
}
