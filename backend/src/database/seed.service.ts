import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

const DEFAULT_ROLES = ['admin', 'cashier', 'kitchen_staff'] as const;

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedRoles();
    await this.seedBootstrapAdmin();
  }

  private async seedRoles(): Promise<void> {
    for (const name of DEFAULT_ROLES) {
      const exists = await this.roles.exist({ where: { name } });
      if (!exists) {
        await this.roles.save(this.roles.create({ name }));
        this.logger.log(`Đã tạo role: ${name}`);
      }
    }
  }

  private async seedBootstrapAdmin(): Promise<void> {
    const adminRole = await this.roles.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      return;
    }
    const username = this.config.get<string>('SEED_ADMIN_USERNAME', 'admin01');
    const userCount = await this.users.count();
    if (userCount > 0) {
      return;
    }
    const plain = this.config.get<string>('SEED_ADMIN_PASSWORD', 'Admin@123');
    const passwordHash = await bcrypt.hash(plain, 10);
    await this.users.save(
      this.users.create({
        roleId: adminRole.id,
        fullName: this.config.get<string>(
          'SEED_ADMIN_FULL_NAME',
          'Quản trị (seed)',
        ),
        username,
        passwordHash,
        phone: null,
      }),
    );
    this.logger.log(
      `Đã tạo tài khoản seed: username=${username} (đổi mật khẩu sau lần đầu đăng nhập)`,
    );
  }
}
