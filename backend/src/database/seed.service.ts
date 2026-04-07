import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';

const DEFAULT_ROLES = ['admin', 'seller', 'customer'] as const;
const DEFAULT_CATEGORIES = ['Phone', 'Laptop', 'Accessory'] as const;

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
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedRoles();
    await this.seedBootstrapAdmin();
    await this.seedCatalog();
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
    const roleRows = await this.roles.find();
    const roleByName = new Map(roleRows.map((r) => [r.name, r]));
    const defaults = [
      {
        role: 'admin',
        username: this.config.get<string>('SEED_ADMIN_USERNAME', 'admin01'),
        password: this.config.get<string>('SEED_ADMIN_PASSWORD', 'Admin@123'),
        fullName: this.config.get<string>(
          'SEED_ADMIN_FULL_NAME',
          'Quản trị (seed)',
        ),
      },
      {
        role: 'seller',
        username: this.config.get<string>('SEED_SELLER_USERNAME', 'seller01'),
        password: this.config.get<string>('SEED_SELLER_PASSWORD', 'Seller@123'),
        fullName: this.config.get<string>(
          'SEED_SELLER_FULL_NAME',
          'Người bán (seed)',
        ),
      },
      {
        role: 'customer',
        username: this.config.get<string>(
          'SEED_CUSTOMER_USERNAME',
          'customer01',
        ),
        password: this.config.get<string>(
          'SEED_CUSTOMER_PASSWORD',
          'Customer@123',
        ),
        fullName: this.config.get<string>(
          'SEED_CUSTOMER_FULL_NAME',
          'Khách hàng (seed)',
        ),
      },
    ];

    for (const row of defaults) {
      const role = roleByName.get(row.role);
      if (!role) continue;
      const exists = await this.users.exist({
        where: { username: row.username },
      });
      if (exists) continue;
      const passwordHash = await bcrypt.hash(row.password, 10);
      await this.users.save(
        this.users.create({
          roleId: role.id,
          fullName: row.fullName,
          username: row.username,
          passwordHash,
          phone: null,
        }),
      );
      this.logger.log(
        `Đã tạo tài khoản seed: username=${row.username} role=${row.role}`,
      );
    }
  }

  private async seedCatalog(): Promise<void> {
    const catCount = await this.categories.count();
    if (catCount === 0) {
      const categoryRows = DEFAULT_CATEGORIES.map((name) =>
        this.categories.create({ name }),
      );
      await this.categories.save(categoryRows);
      this.logger.log('Đã seed categories mặc định');
    }

    const itemCount = await this.products.count();
    if (itemCount > 0) {
      return;
    }

    const categories = await this.categories.find();
    const catByName = new Map(categories.map((row) => [row.name, row.id]));
    const catalog = [
      {
        category: 'Phone',
        name: 'iPhone 15 128GB',
        description: 'Flagship Apple, camera dep, hieu nang on dinh',
        price: '18990000.00',
      },
      {
        category: 'Phone',
        name: 'Samsung Galaxy S24',
        description: 'Android cao cap, man hinh dep, pin tot',
        price: '17990000.00',
      },
      {
        category: 'Laptop',
        name: 'MacBook Air M3',
        description: 'Nhe, pin lau, phu hop hoc tap va cong viec',
        price: '26990000.00',
      },
      {
        category: 'Laptop',
        name: 'Asus ROG Zephyrus G14',
        description: 'Laptop hieu nang cao cho gaming va sang tao',
        price: '32990000.00',
      },
      {
        category: 'Accessory',
        name: 'AirPods Pro 2',
        description: 'Tai nghe chong on, ket noi nhanh',
        price: '5390000.00',
      },
    ];
    const rows = catalog
      .map((item) => {
        const categoryId = catByName.get(item.category);
        if (!categoryId) {
          return null;
        }
        return this.products.create({
          categoryId,
          name: item.name,
          description: item.description,
          price: item.price,
          isAvailable: true,
        });
      })
      .filter((item): item is Product => item !== null);
    if (rows.length > 0) {
      await this.products.save(rows);
      this.logger.log('Đã seed products mặc định');
    }
  }
}
