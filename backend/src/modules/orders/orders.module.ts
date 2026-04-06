import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import { MenuItem } from '../../database/entities/menu-item.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { CustomerOrder } from '../../database/entities/order.entity';
import { User } from '../../database/entities/user.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerOrder,
      OrderItem,
      MenuItem,
      DiningTable,
      User,
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
