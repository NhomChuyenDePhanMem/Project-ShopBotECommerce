import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from '../../database/entities/role.entity';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
  ) {}

  async listRoles(): Promise<{ id: number; name: string }[]> {
    const rows = await this.roles.find({
      order: { id: 'ASC' },
      select: ['id', 'name'],
    });
    return rows.map((r) => ({ id: r.id, name: r.name }));
  }

  toSafeUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      roleId: user.roleId,
      role: user.role?.name ?? null,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  async findAll(): Promise<ReturnType<UsersService['toSafeUser']>[]> {
    const list = await this.users.find({
      relations: ['role'],
      order: { id: 'ASC' },
    });
    return list.map((u) => this.toSafeUser(u));
  }

  async findOne(id: number): Promise<ReturnType<UsersService['toSafeUser']>> {
    const user = await this.users.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng #${id}`);
    }
    return this.toSafeUser(user);
  }

  async create(dto: CreateUserDto): Promise<ReturnType<UsersService['toSafeUser']>> {
    const exists = await this.users.exist({
      where: { username: dto.username.trim() },
    });
    if (exists) {
      throw new ConflictException('Username đã tồn tại');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = this.users.create({
      fullName: dto.fullName.trim(),
      username: dto.username.trim(),
      passwordHash,
      roleId: dto.roleId,
      phone: dto.phone?.trim() || null,
    });
    try {
      const saved = await this.users.save(user);
      const withRole = await this.users.findOne({
        where: { id: saved.id },
        relations: ['role'],
      });
      return this.toSafeUser(withRole!);
    } catch {
      throw new ConflictException('Không thể tạo người dùng (kiểm tra roleId)');
    }
  }

  async update(
    id: number,
    dto: UpdateUserDto,
  ): Promise<ReturnType<UsersService['toSafeUser']>> {
    const user = await this.users.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng #${id}`);
    }
    if (dto.fullName !== undefined) {
      user.fullName = dto.fullName.trim();
    }
    if (dto.phone !== undefined) {
      user.phone = dto.phone.trim() || null;
    }
    if (dto.roleId !== undefined) {
      user.roleId = dto.roleId;
    }
    if (dto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    try {
      await this.users.save(user);
    } catch {
      throw new ConflictException('Cập nhật thất bại (kiểm tra roleId)');
    }
    const refreshed = await this.users.findOne({
      where: { id },
      relations: ['role'],
    });
    return this.toSafeUser(refreshed!);
  }

  async remove(id: number): Promise<void> {
    const res = await this.users.delete(id);
    if (!res.affected) {
      throw new NotFoundException(`Không tìm thấy người dùng #${id}`);
    }
  }
}
