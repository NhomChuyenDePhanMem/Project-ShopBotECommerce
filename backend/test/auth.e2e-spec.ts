import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2eApp } from './setup-app';

/**
 * Cần PostgreSQL đang chạy (vd: `docker compose up -d` ở root repo)
 * và file backend/.env khớp DB (mặc định giống docker-compose).
 */
describe('Auth & users (e2e)', () => {
  let app: INestApplication<App>;

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
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: adminUser, password: 'wrong-password-xyz' })
      .expect(401);
  });

  it('POST /api/auth/login — 200 và accessToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: adminUser, password: adminPass })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user?.username).toBe(adminUser);
    expect(res.body.user?.role).toBe('admin');
  });

  it('GET /api/users/me — cần Bearer', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: adminUser, password: adminPass })
      .expect(200);

    const token = login.body.accessToken as string;

    const me = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(me.body.username).toBe(adminUser);
    expect(me.body.role).toBe('admin');
  });

  it('GET /api/users/roles — admin thấy admin, cashier, kitchen_staff', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: adminUser, password: adminPass })
      .expect(200);

    const token = login.body.accessToken as string;

    const roles = await request(app.getHttpServer())
      .get('/api/users/roles')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(roles.body)).toBe(true);
    const names = roles.body.map((r: { name: string }) => r.name);
    expect(names).toEqual(
      expect.arrayContaining(['admin', 'cashier', 'kitchen_staff']),
    );
  });
});
