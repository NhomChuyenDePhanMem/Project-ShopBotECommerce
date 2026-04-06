import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2eApp } from './setup-app';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  jest.setTimeout(90_000);

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api — health JSON', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          project: 'ShopBot API',
          status: 'ok',
        });
        expect(res.body.timestamp).toBeDefined();
      });
  });
});
