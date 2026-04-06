import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Roles('admin', 'cashier', 'kitchen_staff')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'cashier', 'kitchen_staff')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  @Roles('admin', 'cashier')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Post(':id/items')
  @Roles('admin', 'cashier')
  addItem(@Param('id') id: string, @Body() dto: AddOrderItemDto) {
    return this.ordersService.addItem(id, dto);
  }

  @Patch(':id/items/:itemId')
  @Roles('admin', 'cashier')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.ordersService.updateItem(id, itemId, dto);
  }

  @Delete(':id/items/:itemId')
  @Roles('admin', 'cashier')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.ordersService.removeItem(id, itemId);
  }

  @Patch(':id/kitchen/accept')
  @Roles('kitchen_staff')
  kitchenAccept(@Param('id') id: string) {
    return this.ordersService.kitchenAccept(id);
  }

  @Patch(':id/kitchen/serve')
  @Roles('kitchen_staff')
  kitchenServe(@Param('id') id: string) {
    return this.ordersService.kitchenServe(id);
  }

  @Patch(':id/cashier/pay')
  @Roles('cashier', 'admin')
  cashierPay(@Param('id') id: string) {
    return this.ordersService.cashierPay(id);
  }

  @Patch(':id/cashier/cancel')
  @Roles('cashier', 'admin')
  cashierCancel(@Param('id') id: string) {
    return this.ordersService.cashierCancel(id);
  }

  @Patch(':id/status')
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
