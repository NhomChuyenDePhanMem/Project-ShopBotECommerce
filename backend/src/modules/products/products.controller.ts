import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('categories')
  listCategories() {
    return this.productsService.listCategories();
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('sellerId') sellerId?: string,
    @Query('brand') brand?: string,
    @Query('q') q?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    return this.productsService.findAll({
      category,
      sellerId,
      brand,
      q,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  }
}
