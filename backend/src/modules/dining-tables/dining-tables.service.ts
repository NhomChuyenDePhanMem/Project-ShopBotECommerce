import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import { CreateDiningTableDto } from './dto/create-dining-table.dto';
import { UpdateDiningTableStatusDto } from './dto/update-dining-table-status.dto';

@Injectable()
export class DiningTablesService {
  constructor(
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

  async findAll(status?: DiningTable['status']) {
    const rows = await this.tables.find({
      where: status ? { status } : {},
      order: { id: 'ASC' },
    });
    return rows;
  }

  async findById(id: string) {
    const row = await this.tables.findOne({ where: { id: this.parseId(id) } });
    if (!row) {
      throw new NotFoundException('Dining table not found');
    }
    return row;
  }

  async create(dto: CreateDiningTableDto) {
    const exists = await this.tables.exist({
      where: { tableCode: dto.tableCode.trim() },
    });
    if (exists) {
      throw new ConflictException('tableCode đã tồn tại');
    }

    const created = await this.tables.save(
      this.tables.create({
        tableCode: dto.tableCode.trim(),
        capacity: dto.capacity,
        status: dto.status ?? 'available',
      }),
    );
    return created;
  }

  async updateStatus(id: string, dto: UpdateDiningTableStatusDto) {
    const table = await this.findById(id);
    table.status = dto.status;
    return this.tables.save(table);
  }
}
