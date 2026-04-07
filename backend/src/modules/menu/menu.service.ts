import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { Product } from '../../database/entities/product.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Product)
    private readonly items: Repository<Product>,
  ) {}

  listCategories() {
    return this.categories.find({ order: { id: 'ASC' } });
  }

  async createCategory(dto: CreateCategoryDto) {
    const name = dto.name.trim();
    if (!name) throw new BadRequestException('name is required');
    const exists = await this.categories.exist({ where: { name } });
    if (exists) throw new BadRequestException('Category already exists');
    return this.categories.save(this.categories.create({ name }));
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await this.findCategory(id);
    if (dto.name !== undefined) {
      category.name = dto.name.trim();
    }
    return this.categories.save(category);
  }

  async deleteCategory(id: string) {
    const categoryId = this.parseId(id);
    const linked = await this.items.exist({ where: { categoryId } });
    if (linked) {
      throw new BadRequestException(
        'Cannot delete category while menu items still exist',
      );
    }
    const category = await this.findCategory(id);
    await this.categories.remove(category);
    return { deleted: true };
  }

  async listItems(category?: string) {
    const qb = this.items
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.category', 'category')
      .orderBy('item.id', 'ASC');
    if (category?.trim()) {
      const categoryId = Number.parseInt(category, 10);
      if (!Number.isNaN(categoryId))
        qb.andWhere('item.categoryId = :categoryId', { categoryId });
    }
    return qb.getMany();
  }

  async createItem(dto: CreateMenuItemDto) {
    await this.assertCategoryExists(dto.categoryId);
    const item = this.items.create({
      categoryId: dto.categoryId,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      price: dto.price.toFixed(2),
      isAvailable: dto.isAvailable ?? true,
    });
    return this.items.save(item);
  }

  async updateItem(id: string, dto: UpdateMenuItemDto) {
    const item = await this.findItem(id);
    if (dto.categoryId !== undefined) {
      await this.assertCategoryExists(dto.categoryId);
      item.categoryId = dto.categoryId;
    }
    if (dto.name !== undefined) item.name = dto.name.trim();
    if (dto.description !== undefined)
      item.description = dto.description.trim() || null;
    if (dto.price !== undefined) item.price = dto.price.toFixed(2);
    if (dto.isAvailable !== undefined) item.isAvailable = dto.isAvailable;
    return this.items.save(item);
  }

  async deleteItem(id: string) {
    const item = await this.findItem(id);
    await this.items.remove(item);
    return { deleted: true };
  }

  private async findCategory(id: string) {
    const category = await this.categories.findOne({
      where: { id: this.parseId(id) },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  private async findItem(id: string) {
    const item = await this.items.findOne({ where: { id: this.parseId(id) } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  private async assertCategoryExists(categoryId: number) {
    const exists = await this.categories.exist({ where: { id: categoryId } });
    if (!exists) throw new BadRequestException('categoryId not found');
  }

  private parseId(raw: string): number {
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('Invalid id');
    }
    return id;
  }
}
