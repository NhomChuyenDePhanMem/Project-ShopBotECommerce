import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2eApp } from './setup-app';

describe('Chatbot (e2e)', () => {
  let app: INestApplication;
  const originalForceDown = process.env.CHATBOT_FORCE_DOWN;
  const originalProvider = process.env.CHATBOT_PROVIDER;

  jest.setTimeout(30_000);

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    process.env.CHATBOT_FORCE_DOWN = originalForceDown;
    process.env.CHATBOT_PROVIDER = originalProvider;
    if (app) {
      await app.close();
    }
  });

  it('POST /api/chatbot/messages — reject empty message', async () => {
    const server = app.getHttpServer() as unknown as App;
    const res = await request(server)
      .post('/api/chatbot/messages')
      .send({ message: '   ' })
      .expect(201);

    const body = res.body as { text: string };
    expect(body.text).toBe('Noi dung tin nhan khong duoc de trong.');
  });

  it('POST /api/chatbot/messages — fallback when force down', async () => {
    process.env.CHATBOT_PROVIDER = 'openai';
    process.env.CHATBOT_FORCE_DOWN = 'true';

    const server = app.getHttpServer() as unknown as App;
    const res = await request(server)
      .post('/api/chatbot/messages')
      .send({
        sessionId: 'e2e-chatbot-force-down',
        message: 'Tu van san pham cho 2 nguoi duoi 300k',
      })
      .expect(201);

    const body = res.body as {
      sessionId: string;
      fallbackUsed: boolean;
      products: unknown[];
    };
    expect(body.sessionId).toBeDefined();
    expect(body.fallbackUsed).toBe(true);
    expect(Array.isArray(body.products)).toBe(true);
  });
});
