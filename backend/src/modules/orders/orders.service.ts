import { Injectable, NotFoundException } from '@nestjs/common';
import { mockOrders } from '../../common/mock-data';

@Injectable()
export class OrdersService {
  findAll() {
    return mockOrders;
  }

  findById(id: string) {
    const order = mockOrders.find((item) => item.id === id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
