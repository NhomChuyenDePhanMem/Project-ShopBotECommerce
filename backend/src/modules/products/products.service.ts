import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';

type ProductQuery = {
  category?: string;
  sellerId?: string;
  brand?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(MenuItem)
    private readonly menuItems: Repository<MenuItem>,
  ) {}

  async listCategories() {
    const rows = await this.categories.find({ order: { id: 'ASC' } });
    return rows.map((c) => ({
      id: String(c.id),
      name: c.name,
      parentId: null,
    }));
  }

  private toProductView(item: MenuItem) {
    const price = Number(item.price);
    return {
      id: String(item.id),
      name: item.name,
      brand: 'Kitchen',
      categoryId: String(item.categoryId),
      sellerId: 'internal',
      price,
      rating: item.isAvailable ? 4.5 : 0,
      stockQty: item.isAvailable ? 99 : 0,
      description: item.description ?? '',
      isAvailable: item.isAvailable,
      createdAt: item.createdAt,
    };
  }

  async findAll(query: ProductQuery) {
    const rows = await this.menuItems.find({
      relations: ['category'],
      order: { id: 'ASC' },
    });

    const normalized = rows.map((row) => this.toProductView(row));
    return normalized.filter((item) => {
      const byCategory = query.category
        ? item.categoryId === query.category
        : true;
      const bySeller = query.sellerId ? item.sellerId === query.sellerId : true;
      const byBrand = query.brand
        ? item.brand.toLowerCase() === query.brand.toLowerCase()
        : true;
      const byKeyword = query.q
        ? `${item.name} ${item.description}`
            .toLowerCase()
            .includes(query.q.toLowerCase())
        : true;
      const byMinPrice =
        query.minPrice !== undefined ? item.price >= query.minPrice : true;
      const byMaxPrice =
        query.maxPrice !== undefined ? item.price <= query.maxPrice : true;
      return (
        byCategory &&
        bySeller &&
        byBrand &&
        byKeyword &&
        byMinPrice &&
        byMaxPrice
      );
    });
  }

  async findTopByBudget(budget: number) {
    const list = await this.findAll({ maxPrice: budget });
    return list.sort((a, b) => b.rating - a.rating).slice(0, 3);
  }
}
