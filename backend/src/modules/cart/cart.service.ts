import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from '../products/products.service';

type CartItem = {
  productId: string;
  quantity: number;
};

@Injectable()
export class CartService {
  /** Không bền vững qua restart tiến trình */
  private readonly carts = new Map<string, CartItem[]>();

  constructor(private readonly productsService: ProductsService) {}

  private normalizeUserId(userId: string) {
    const value = userId.trim();
    if (!value) throw new BadRequestException('userId is required');
    return value;
  }

  private async productMap() {
    const products = await this.productsService.findAll({});
    return new Map(products.map((p) => [p.id, p]));
  }

  async getCart(userId: string) {
    const id = this.normalizeUserId(userId);
    const items = this.carts.get(id) ?? [];
    const productById = await this.productMap();

    const normalized = items.map((item) => {
      const product = productById.get(item.productId);
      const unitPrice = product?.price ?? 0;
      return {
        productId: item.productId,
        quantity: item.quantity,
        productName: product?.name ?? 'Unknown product',
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    });

    return {
      userId: id,
      items: normalized,
      total: normalized.reduce((sum, row) => sum + row.lineTotal, 0),
    };
  }

  async addItem(userId: string, productId: string, quantity: number) {
    const id = this.normalizeUserId(userId);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity must be positive integer');
    }

    const products = await this.productsService.findAll({});
    const found = products.find((p) => p.id === productId);
    if (!found) throw new NotFoundException('Product not found');

    const items = [...(this.carts.get(id) ?? [])];
    const existing = items.find((row) => row.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }
    this.carts.set(id, items);
    return this.getCart(id);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const id = this.normalizeUserId(userId);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity must be positive integer');
    }
    const items = [...(this.carts.get(id) ?? [])];
    const row = items.find((item) => item.productId === productId);
    if (!row) throw new NotFoundException('Cart item not found');
    row.quantity = quantity;
    this.carts.set(id, items);
    return this.getCart(id);
  }

  async removeItem(userId: string, productId: string) {
    const id = this.normalizeUserId(userId);
    const items = [...(this.carts.get(id) ?? [])].filter(
      (item) => item.productId !== productId,
    );
    this.carts.set(id, items);
    return this.getCart(id);
  }

  async clearCart(userId: string) {
    const id = this.normalizeUserId(userId);
    this.carts.delete(id);
    return this.getCart(id);
  }
}
