import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2eApp } from './setup-app';

/**
 * Cần PostgreSQL đang chạy (vd: `docker compose up -d` ở root repo)
 * và file backend/.env khớp DB (mặc định giống docker-compose).
 */
describe('Auth & users (e2e)', () => {
  let app: INestApplication;

  const adminUser = process.env.SEED_ADMIN_USERNAME ?? 'admin01';
  const adminPass = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@123';

  jest.setTimeout(30_000);

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('POST /api/auth/login — 401 khi sai mật khẩu', () => {
    const server = app.getHttpServer() as unknown as App;

    return request(server)
      .post('/api/auth/login')
      .send({ username: adminUser, password: 'wrong-password-xyz' })
      .expect(401);
  });

  it('POST /api/auth/login — 200 và accessToken', async () => {
    const server = app.getHttpServer() as unknown as App;
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username: adminUser, password: adminPass })
      .expect(200);

    const body = res.body as {
      accessToken: string;
      user?: { id: number; username: string; role: string };
    };

    expect(body.accessToken).toBeDefined();
    expect(body.user?.username).toBe(adminUser);
    expect(body.user?.role).toBe('admin');
  });

  it('GET /api/users/me — cần Bearer', async () => {
    const server = app.getHttpServer() as unknown as App;
    const login = await request(server)
      .post('/api/auth/login')
      .send({ username: adminUser, password: adminPass })
      .expect(200);

    const token = (login.body as { accessToken: string }).accessToken;

    const me = await request(server)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const meBody = me.body as { username: string; role: string };
    expect(meBody.username).toBe(adminUser);
    expect(meBody.role).toBe('admin');
  });

  it('GET /api/users/roles — admin thấy admin, seller, customer', async () => {
    const server = app.getHttpServer() as unknown as App;
    const login = await request(server)
      .post('/api/auth/login')
      .send({ username: adminUser, password: adminPass })
      .expect(200);

    const token = (login.body as { accessToken: string }).accessToken;

    const roles = await request(server)
      .get('/api/users/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const rolesBody = roles.body as Array<{ name: string }>;
    expect(Array.isArray(rolesBody)).toBe(true);
    const names = rolesBody.map((r) => r.name);
    expect(names).toEqual(
      expect.arrayContaining(['admin', 'seller', 'customer']),
    );
  });
});
