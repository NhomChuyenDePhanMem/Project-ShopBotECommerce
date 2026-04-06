import { Injectable } from '@nestjs/common';
import { mockCategories, mockProducts } from '../../common/mock-data';

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
  listCategories() {
    return mockCategories;
  }

  findAll(query: ProductQuery) {
    return mockProducts.filter((item) => {
      const byCategory = query.category ? item.categoryId === query.category : true;
      const bySeller = query.sellerId ? item.sellerId === query.sellerId : true;
      const byBrand = query.brand
        ? item.brand.toLowerCase() === query.brand.toLowerCase()
        : true;
      const byKeyword = query.q
        ? `${item.name} ${item.description}`.toLowerCase().includes(query.q.toLowerCase())
        : true;
      const byMinPrice = query.minPrice ? item.price >= query.minPrice : true;
      const byMaxPrice = query.maxPrice ? item.price <= query.maxPrice : true;
      return byCategory && bySeller && byBrand && byKeyword && byMinPrice && byMaxPrice;
    });
  }

  findTopByBudget(budget: number) {
    return mockProducts
      .filter((item) => item.price <= budget)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }
}
