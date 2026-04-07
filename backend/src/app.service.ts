import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async getHealth() {
    const timestamp = new Date().toISOString();
    const base = {
      project: 'ShopBot API',
      timestamp,
    };
    try {
      await this.dataSource.query('SELECT 1');
      return {
        ...base,
        status: 'ok',
        database: 'up' as const,
      };
    } catch {
      return {
        ...base,
        status: 'degraded',
        database: 'down' as const,
      };
    }
  }
}
