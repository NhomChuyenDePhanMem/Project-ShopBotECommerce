import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { createE2eApp } from './setup-app';

/**
 * Luồng nghiệp vụ: sản phẩm, giỏ, đơn (customer → seller → customer), thanh toán.
 * Cần PostgreSQL + seed (docker compose + backend khởi động seed).
 */
describe('Commerce flow (e2e)', () => {
  let app: INestApplication;

  const customerUser = process.env.SEED_CUSTOMER_USERNAME ?? 'customer01';
  const customerPass = process.env.SEED_CUSTOMER_PASSWORD ?? 'Customer@123';
  const sellerUser = process.env.SEED_SELLER_USERNAME ?? 'seller01';
  const sellerPass = process.env.SEED_SELLER_PASSWORD ?? 'Seller@123';

  jest.setTimeout(60_000);

  beforeAll(async () => {
    app = await createE2eApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  async function tokenFor(username: string, password: string) {
    const server = app.getHttpServer() as unknown as App;
    const res = await request(server)
      .post('/api/auth/login')
      .send({ username, password })
      .expect(200);
    return {
      token: (res.body as { accessToken: string }).accessToken,
      userId: (res.body as { user: { id: number } }).user.id,
    };
  }

  it('GET /api/products/categories và GET /api/products', async () => {
    const server = app.getHttpServer() as unknown as App;
    const cat = await request(server)
      .get('/api/products/categories')
      .expect(200);
    const catBody = cat.body as unknown[];
    expect(Array.isArray(catBody)).toBe(true);

    const prod = await request(server).get('/api/products').expect(200);
    const prodBody = prod.body as Array<{ id: string | number }>;
    expect(Array.isArray(prodBody)).toBe(true);
    expect(prodBody.length).toBeGreaterThan(0);
  });

  it('giỏ hàng: thêm — cập nhật — xóa item — clear', async () => {
    const server = app.getHttpServer() as unknown as App;
    const { userId } = await tokenFor(customerUser, customerPass);
    const prod = await request(server).get('/api/products').expect(200);
    const prodBody = prod.body as Array<{ id: string | number }>;
    const p1 = String(prodBody[0]?.id);
    const p2 =
      (prodBody[1]?.id != null ? String(prodBody[1].id) : undefined) ?? p1;

    await request(server)
      .post(`/api/cart/${userId}/items`)
      .send({ productId: p1, quantity: 1 })
      .expect(201);

    await request(server)
      .post(`/api/cart/${userId}/items`)
      .send({ productId: p2, quantity: 2 })
      .expect(201);

    await request(server)
      .patch(`/api/cart/${userId}/items/${p1}`)
      .send({ quantity: 3 })
      .expect(200);

    await request(server).delete(`/api/cart/${userId}/items/${p2}`).expect(200);

    const cart = await request(server).get(`/api/cart/${userId}`).expect(200);
    const cartBody = cart.body as { items: Array<{ quantity: number }> };
    expect(cartBody.items.length).toBe(1);
    expect(cartBody.items[0]?.quantity).toBe(3);

    await request(server).delete(`/api/cart/${userId}`).expect(200);
    const empty = await request(server).get(`/api/cart/${userId}`).expect(200);
    const emptyBody = empty.body as { items: unknown[] };
    expect(emptyBody.items.length).toBe(0);
  });

  it('đơn hàng: tạo → seller xác nhận → giao → khách hoàn tất', async () => {
    const server = app.getHttpServer() as unknown as App;
    const { token: custTok, userId: customerId } = await tokenFor(
      customerUser,
      customerPass,
    );
    const prod = await request(server).get('/api/products').expect(200);
    const prodBody = prod.body as Array<{ id: string | number }>;
    const productIdNum = Number(prodBody[0]?.id);

    const created = await request(server)
      .post('/api/orders')
      .set('Authorization', `Bearer ${custTok}`)
      .send({
        createdBy: customerId,
        orderType: 'shipping',
        items: [{ productId: productIdNum, quantity: 1 }],
      })
      .expect(201);

    const createdBody = created.body as { id: number; status: string };
    const orderId = createdBody.id;
    expect(createdBody.status).toBe('pending');

    const { token: sellTok } = await tokenFor(sellerUser, sellerPass);

    const afterConfirm = await request(server)
      .patch(`/api/orders/${orderId}/seller/confirm`)
      .set('Authorization', `Bearer ${sellTok}`)
      .expect(200);
    expect((afterConfirm.body as { status: string }).status).toBe('confirmed');

    const afterShip = await request(server)
      .patch(`/api/orders/${orderId}/seller/ship`)
      .set('Authorization', `Bearer ${sellTok}`)
      .expect(200);
    expect((afterShip.body as { status: string }).status).toBe('shipping');

    const afterDone = await request(server)
      .patch(`/api/orders/${orderId}/customer/complete`)
      .set('Authorization', `Bearer ${custTok}`)
      .expect(200);
    expect((afterDone.body as { status: string }).status).toBe('done');
  });

  it('thanh toán COD thành công đưa đơn về done', async () => {
    const server = app.getHttpServer() as unknown as App;
    const { token: custTok, userId: customerId } = await tokenFor(
      customerUser,
      customerPass,
    );
    const prod = await request(server).get('/api/products').expect(200);
    const prodBody = prod.body as Array<{ id: string | number }>;
    const productIdNum = Number(prodBody[0]?.id);

    const created = await request(server)
      .post('/api/orders')
      .set('Authorization', `Bearer ${custTok}`)
      .send({
        createdBy: customerId,
        orderType: 'pickup',
        items: [{ productId: productIdNum, quantity: 2 }],
      })
      .expect(201);

    const createdBody = created.body as { id: number; total: number };
    const orderId = createdBody.id;
    const total = createdBody.total;

    await request(server)
      .post('/api/payments')
      .send({
        orderId,
        paymentMethod: 'cod',
        amount: total,
        status: 'success',
      })
      .expect(201);

    const view = await request(server)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${custTok}`)
      .expect(200);
    const viewBody = view.body as { status: string; payment: unknown };
    expect(viewBody.status).toBe('done');
    expect(viewBody.payment).not.toBeNull();
  });
});
