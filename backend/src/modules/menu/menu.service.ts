import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(MenuItem)
    private readonly menuItems: Repository<MenuItem>,
    @InjectRepository(OrderItem)
    private readonly orderItems: Repository<OrderItem>,
  ) {}

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return id;
  }

  private async getCategoryEntity(id: number): Promise<Category> {
    const row = await this.categories.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Category not found');
    }
    return row;
  }

  private async getMenuItemEntity(id: number): Promise<MenuItem> {
    const row = await this.menuItems.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!row) {
      throw new NotFoundException('Menu item not found');
    }
    return row;
  }

  findAllCategories() {
    return this.categories.find({ order: { id: 'ASC' } });
  }

  async findCategoryById(id: string) {
    return this.getCategoryEntity(this.parseId(id));
  }

  async createCategory(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    const exists = await this.categories.exist({ where: { name } });
    if (exists) {
      throw new BadRequestException('Category name already exists');
    }
    return this.categories.save(this.categories.create({ name }));
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const row = await this.getCategoryEntity(this.parseId(id));
    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (name !== row.name) {
        const exists = await this.categories.exist({ where: { name } });
        if (exists) {
          throw new BadRequestException('Category name already exists');
        }
      }
      row.name = name;
    }
    return this.categories.save(row);
  }

  async removeCategory(id: string) {
    const categoryId = this.parseId(id);
    await this.getCategoryEntity(categoryId);
    const inUse = await this.menuItems.exist({ where: { categoryId } });
    if (inUse) {
      throw new BadRequestException('Category has menu items, cannot delete');
    }
    await this.categories.delete(categoryId);
    return { message: 'Deleted category successfully' };
  }

  async findAllMenuItems(categoryId?: string, isAvailable?: string) {
    const where: { categoryId?: number; isAvailable?: boolean } = {};
    if (categoryId !== undefined) {
      where.categoryId = this.parseId(categoryId);
    }
    if (isAvailable !== undefined) {
      if (isAvailable !== 'true' && isAvailable !== 'false') {
        throw new BadRequestException('isAvailable must be true or false');
      }
      where.isAvailable = isAvailable === 'true';
    }
    return this.menuItems.find({
      where,
      relations: ['category'],
      order: { id: 'ASC' },
    });
  }

  async findMenuItemById(id: string) {
    return this.getMenuItemEntity(this.parseId(id));
  }

  async createMenuItem(dto: CreateMenuItemDto) {
    await this.getCategoryEntity(dto.categoryId);
    const payload = this.menuItems.create({
      categoryId: dto.categoryId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      price: dto.price.toFixed(2),
      isAvailable: dto.isAvailable ?? true,
    });
    return this.menuItems.save(payload);
  }

  async updateMenuItem(id: string, dto: UpdateMenuItemDto) {
    const row = await this.getMenuItemEntity(this.parseId(id));
    if (dto.categoryId !== undefined) {
      await this.getCategoryEntity(dto.categoryId);
      row.categoryId = dto.categoryId;
    }
    if (dto.name !== undefined) {
      row.name = dto.name.trim();
    }
    if (dto.description !== undefined) {
      row.description = dto.description.trim() || null;
    }
    if (dto.price !== undefined) {
      row.price = dto.price.toFixed(2);
    }
    if (dto.isAvailable !== undefined) {
      row.isAvailable = dto.isAvailable;
    }
    return this.menuItems.save(row);
  }

  async removeMenuItem(id: string) {
    const menuItemId = this.parseId(id);
    await this.getMenuItemEntity(menuItemId);
    const inUse = await this.orderItems.exist({ where: { menuItemId } });
    if (inUse) {
      throw new BadRequestException(
        'Menu item is used in order items, cannot delete',
      );
    }
    await this.menuItems.delete(menuItemId);
    return { message: 'Deleted menu item successfully' };
  }
}
