import { Injectable } from '@nestjs/common';
import { mockReviews, Review } from '../../common/mock-data';

@Injectable()
export class ReviewsService {
  findByProduct(productId: string) {
    return mockReviews.filter((item) => item.productId === productId);
  }

  create(input: { userId: string; productId: string; rating: number; comment: string }) {
    const review: Review = {
      id: `r${mockReviews.length + 1}`,
      userId: input.userId,
      productId: input.productId,
      rating: Math.max(1, Math.min(5, input.rating)),
      comment: input.comment,
      createdAt: new Date().toISOString(),
    };
    mockReviews.unshift(review);
    return review;
  }
}
