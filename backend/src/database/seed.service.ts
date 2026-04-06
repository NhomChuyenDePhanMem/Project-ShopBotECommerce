import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { DiningTable } from './entities/dining-table.entity';
import { MenuItem } from './entities/menu-item.entity';
import { Reservation } from './entities/reservation.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

const DEFAULT_ROLES = ['admin', 'cashier', 'kitchen_staff'] as const;
const DEFAULT_CATEGORIES = ['Mon chinh', 'Mon an nhe', 'Do uong'] as const;

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roles: Repository<Role>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(MenuItem)
    private readonly menuItems: Repository<MenuItem>,
    @InjectRepository(DiningTable)
    private readonly tables: Repository<DiningTable>,
    @InjectRepository(Reservation)
    private readonly reservations: Repository<Reservation>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedRoles();
    await this.seedBootstrapAdmin();
    await this.seedCatalogAndTables();
    await this.seedReservations();
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

  private async seedCatalogAndTables(): Promise<void> {
    const catCount = await this.categories.count();
    if (catCount === 0) {
      const categoryRows = DEFAULT_CATEGORIES.map((name) =>
        this.categories.create({ name }),
      );
      await this.categories.save(categoryRows);
      this.logger.log('Đã seed categories mặc định');
    }

    const tableCount = await this.tables.count();
    if (tableCount === 0) {
      await this.tables.save(
        this.tables.create([
          { tableCode: 'T01', capacity: 2, status: 'available' },
          { tableCode: 'T02', capacity: 4, status: 'available' },
          { tableCode: 'T03', capacity: 6, status: 'reserved' },
          { tableCode: 'T04', capacity: 4, status: 'available' },
        ]),
      );
      this.logger.log('Đã seed dining tables mặc định');
    }

    const itemCount = await this.menuItems.count();
    if (itemCount > 0) {
      return;
    }

    const categories = await this.categories.find();
    const catByName = new Map(categories.map((row) => [row.name, row.id]));
    const menu = [
      {
        category: 'Mon chinh',
        name: 'Com ga nuong',
        description: 'Com trang an kem ga nuong sot mat ong',
        price: '55000.00',
      },
      {
        category: 'Mon chinh',
        name: 'Bun bo Hue',
        description: 'Bun bo cay nhe, nhieu topping',
        price: '60000.00',
      },
      {
        category: 'Mon an nhe',
        name: 'Khoai tay chien',
        description: 'Khoai tay chien gion',
        price: '30000.00',
      },
      {
        category: 'Do uong',
        name: 'Tra dao cam sa',
        description: 'Tra dao tuoi kem cam sa',
        price: '35000.00',
      },
      {
        category: 'Do uong',
        name: 'Ca phe den',
        description: 'Ca phe den da',
        price: '25000.00',
      },
    ];
    const rows = menu
      .map((item) => {
        const categoryId = catByName.get(item.category);
        if (!categoryId) {
          return null;
        }
        return this.menuItems.create({
          categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          isAvailable: true,
        });
      })
      .filter((item): item is MenuItem => item !== null);
    if (rows.length > 0) {
      await this.menuItems.save(rows);
      this.logger.log('Đã seed menu items mặc định');
    }
  }

  private async seedReservations(): Promise<void> {
    const reservationCount = await this.reservations.count();
    if (reservationCount > 0) {
      return;
    }
    const tables = await this.tables.find({ order: { id: 'ASC' } });
    if (tables.length < 2) {
      return;
    }
    await this.reservations.save(
      this.reservations.create([
        {
          tableId: tables[0].id,
          customerName: 'Nguyen Van C',
          customerPhone: '0911222333',
          reservedTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
          partySize: Math.min(2, tables[0].capacity),
          status: 'booked',
        },
        {
          tableId: tables[1].id,
          customerName: 'Tran Thi D',
          customerPhone: '0944555666',
          reservedTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
          partySize: Math.min(4, tables[1].capacity),
          status: 'booked',
        },
      ]),
    );
    this.logger.log('Đã seed reservations mặc định');
  }
}
