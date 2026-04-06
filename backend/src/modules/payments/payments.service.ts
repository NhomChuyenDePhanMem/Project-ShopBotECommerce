import { Injectable, NotFoundException } from '@nestjs/common';
import { mockPayments } from '../../common/mock-data';

@Injectable()
export class PaymentsService {
  findAll() {
    return mockPayments;
  }

  findByOrderId(orderId: string) {
    return mockPayments.filter((item) => item.orderId === orderId);
  }

  markPaid(paymentId: string) {
    const payment = mockPayments.find((item) => item.id === paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = 'paid';
    payment.paidAt = new Date().toISOString();
    return payment;
  }
}
