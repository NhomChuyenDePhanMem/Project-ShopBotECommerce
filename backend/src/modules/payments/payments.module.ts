import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiningTable } from '../../database/entities/dining-table.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { CustomerOrder } from '../../database/entities/order.entity';
import { Payment } from '../../database/entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, CustomerOrder, OrderItem, DiningTable]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
