import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { Product } from '../../database/entities/product.entity';

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
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
  ) {}

  async listCategories() {
    const rows = await this.categories.find({ order: { id: 'ASC' } });
    return rows.map((c) => ({
      id: String(c.id),
      name: c.name,
      parentId: null,
    }));
  }

  private toProductView(item: Product) {
    const price = Number(item.price);
    const text = `${item.name} ${item.description ?? ''}`.toLowerCase();
    const brand =
      text.includes('iphone') || text.includes('airpods')
        ? 'Apple'
        : text.includes('samsung')
          ? 'Samsung'
          : text.includes('asus')
            ? 'Asus'
            : 'ShopBot';
    return {
      id: String(item.id),
      name: item.name,
      brand,
      categoryId: String(item.categoryId),
      sellerId: 's1',
      price,
      rating: item.isAvailable ? 4.5 : 0,
      stockQty: item.isAvailable ? 99 : 0,
      description: item.description ?? '',
      isAvailable: item.isAvailable,
      createdAt: item.createdAt,
    };
  }

  async findAll(query: ProductQuery) {
    const qb = this.products
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .orderBy('p.id', 'ASC');

    if (query.category?.trim()) {
      const categoryId = Number.parseInt(query.category, 10);
      if (!Number.isNaN(categoryId)) {
        qb.andWhere('p.categoryId = :categoryId', { categoryId });
      }
    }
    const kw = query.q?.trim();
    if (kw) {
      const like = `%${kw.toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(p.name) LIKE :like OR LOWER(COALESCE(p.description, :empty)) LIKE :like)',
        { like, empty: '' },
      );
    }
    if (query.minPrice !== undefined && !Number.isNaN(query.minPrice)) {
      qb.andWhere('CAST(p.price AS DECIMAL) >= :minPrice', {
        minPrice: query.minPrice,
      });
    }
    if (query.maxPrice !== undefined && !Number.isNaN(query.maxPrice)) {
      qb.andWhere('CAST(p.price AS DECIMAL) <= :maxPrice', {
        maxPrice: query.maxPrice,
      });
    }

    const rows = await qb.getMany();
    const normalized = rows.map((row) => this.toProductView(row));
    return normalized.filter((item) => {
      const bySeller = query.sellerId ? item.sellerId === query.sellerId : true;
      const byBrand = query.brand
        ? item.brand.toLowerCase() === query.brand.toLowerCase()
        : true;
      return bySeller && byBrand;
    });
  }

  async findTopByBudget(budget: number) {
    const list = await this.findAll({ maxPrice: budget });
    return list.sort((a, b) => b.rating - a.rating).slice(0, 3);
  }
}
