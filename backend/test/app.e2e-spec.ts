import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2eApp } from './setup-app';

describe('AppController (e2e)', () => {
  let app: INestApplication;

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
    const server = app.getHttpServer() as unknown as App;

    return request(server)
      .get('/api')
      .expect(200)
      .expect((res) => {
        const body = res.body as {
          project: string;
          status: string;
          database: string;
          timestamp?: string;
        };

        expect(body).toMatchObject({
          project: 'ShopBot API',
          status: 'ok',
          database: 'up',
        });
        expect(body.timestamp).toBeDefined();
      });
  });
});
