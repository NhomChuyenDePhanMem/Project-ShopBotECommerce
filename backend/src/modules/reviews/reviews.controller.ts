import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  @Post()
  create(
    @Body()
    body: {
      userId?: string;
      productId?: string;
      rating?: number;
      comment?: string;
    },
  ) {
    return this.reviewsService.create({
      userId: body.userId ?? 'u1',
      productId: body.productId ?? '',
      rating: body.rating ?? 5,
      comment: body.comment ?? '',
    });
  }
}
