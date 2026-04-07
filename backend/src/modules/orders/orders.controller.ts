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
  @Roles('admin', 'seller', 'customer')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'seller', 'customer')
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post()
  @Roles('admin', 'customer')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Post(':id/items')
  @Roles('admin', 'customer')
  addItem(@Param('id') id: string, @Body() dto: AddOrderItemDto) {
    return this.ordersService.addItem(id, dto);
  }

  @Patch(':id/items/:itemId')
  @Roles('admin', 'customer')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateOrderItemDto,
  ) {
    return this.ordersService.updateItem(id, itemId, dto);
  }

  @Delete(':id/items/:itemId')
  @Roles('admin', 'customer')
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.ordersService.removeItem(id, itemId);
  }

  @Patch(':id/seller/confirm')
  @Roles('seller', 'admin')
  sellerConfirm(@Param('id') id: string) {
    return this.ordersService.sellerAdvanceToConfirmed(id);
  }

  @Patch(':id/seller/ship')
  @Roles('seller', 'admin')
  sellerShip(@Param('id') id: string) {
    return this.ordersService.sellerAdvanceToShipping(id);
  }

  @Patch(':id/customer/complete')
  @Roles('customer', 'admin')
  customerComplete(@Param('id') id: string) {
    return this.ordersService.customerMarkOrderDone(id);
  }

  @Patch(':id/customer/cancel')
  @Roles('customer', 'admin')
  customerCancel(@Param('id') id: string) {
    return this.ordersService.customerMarkOrderCancelled(id);
  }

  @Patch(':id/status')
  @Roles('admin', 'seller')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
