import { Controller, Get, Param, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get('order/:orderId')
  findByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrderId(orderId);
  }

  @Patch(':id/paid')
  markPaid(@Param('id') id: string) {
    return this.paymentsService.markPaid(id);
  }
}
