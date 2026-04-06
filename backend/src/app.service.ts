import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      project: 'ShopBot API',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
