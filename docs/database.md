# Cơ sở dữ liệu PostgreSQL — bảo mật, hiệu năng, sẵn sàng, mở rộng

Tài liệu này bám theo các yếu tố cần đảm bảo cho **database** trong dự án ShopBot (PostgreSQL + NestJS). Phần lớn kiểm soát truy cập dữ liệu nhạy cảm thực hiện ở **tầng ứng dụng** (JWT, phân quyền, không trả `password_hash` ra API); phần vận hành CSDL nằm ở **PostgreSQL + hạ tầng**.

## 1. Bảo mật

| Hướng | Thực hiện gợi ý |
|--------|------------------|
| **Quyền truy cập DB** | Tạo user PostgreSQL **chỉ cho ứng dụng** (`GRANT CONNECT`, `USAGE` schema, `SELECT/INSERT/UPDATE/DELETE` trên bảng cần thiết), **không** dùng `SUPERUSER` cho app. Tách user đọc báo cáo (read-only) nếu có. |
| **Mật khẩu & mạng** | Đặt `POSTGRES_PASSWORD` mạnh trong production; **không** publish cổng `5432` ra Internet nếu không cần. Chỉ cho phép backend (VPC / Docker network / firewall). |
| **Dữ liệu cá nhân** | Trường như `users.full_name`, `phone`, `customer_name` trong `orders`: hạn chế hiển thị/log; tuân thủ chính sách nội bộ / PDPA. API không trả hash mật khẩu. |
| **Mã hóa đường truyền** | Production: kết nối app ↔ DB qua TLS (`sslmode=require` / chứng chỉ CA) nếu DB managed cloud yêu cầu. |
| **Ứng dụng** | Xem thêm `backend/README.md` (JWT, CORS, `TYPEORM_SYNC=false` trên production). |

## 2. Tốc độ (performance)

| Hướng | Trong repo |
|--------|------------|
| **Index** | `docs/design/schema.sql` tạo index trên `menu_items(category_id)`, `orders(created_by)`, `orders(status)`, `order_items(order_id)`, `order_items(menu_item_id)` — khớp truy vấn danh mục và đơn hàng. |
| **Truy vấn** | Backend lọc sản phẩm (`category`, `q`, giá) bằng SQL (QueryBuilder), tránh tải full bảng. |
| **Pool kết nối** | Biến `DB_POOL_MAX` trong `.env` backend (giới hạn đồng thời hợp lý theo CPU/RAM). |
| **Theo dõi** | Production: bật `log_min_duration_statement`, dùng `EXPLAIN (ANALYZE)` cho câu chậm; cân nhắc **pg_stat_statements**. |

## 3. Tính sẵn sàng & sao lưu

| Hướng | Gợi ý |
|--------|--------|
| **Backup logic** | `pg_dump` định kỳ (full hoặc schema+data). Managed DB: bật automated backup theo nhà cung cấp. |
| **Khôi phục** | Giữ bản dump ở storage tách biệt (S3, blob, NAS); **thử restore** định kỳ lên môi trường staging. |
| **Docker Compose** | Volume `shopbot_pgdata` lưu dữ liệu bền; backup = dump từ container hoặc snapshot volume (tùy hạ tầng). |
| **Health** | `GET /api` trên backend kiểm tra `SELECT 1` tới PostgreSQL (`database: up` / `down`). |

### Ví dụ backup / restore (CLI)

Thay `user`, `db`, host/port` cho đúng môi trường.

**Sao lưu (custom format, nén tốt, restore linh hoạt):**

```bash
pg_dump -h localhost -p 5432 -U postgres -d sshopbot -F c -f shopbot_backup.dump
```

**Khôi phục (tạo DB trống trước nếu cần):**

```bash
pg_restore -h localhost -p 5432 -U postgres -d sshopbot --clean --if-exists shopbot_backup.dump
```

**PowerShell (Docker, tên container như trong `docker-compose.yml`):**

```powershell
docker exec -t shopbot-postgres pg_dump -U postgres -d sshopbot -F c > shopbot_backup.dump
```

## 4. Khả năng mở rộng

| Giai đoạn | Hành động |
|-----------|-----------|
| **Tăng dữ liệu trên một máy** | Nâng CPU/RAM ổ đĩa cho PostgreSQL; theo dõi kích thước bảng/index; `VACUUM` / autovacuum mặc định. |
| **Tách read** | Khi tải đọc lớn: **read replica** (managed) + route đọc báo cáo sang replica (ứng dụng hoặc proxy). |
| **Sharding** | Chỉ cân nhắc khi quy mô rất lớn; thường không cần cho MVP. |
| **Giới hạn “dung lượng”** | PostgreSQL không cố định “giới hạn website” — giới hạn thực tế là **đĩa + hiệu năng truy vấn**; mở rộng đĩa và tối ưu index/query là bước đầu. |

---

**Liên quan:** `docs/design/schema.sql`, `docs/design/README.md`, `docker-compose.yml`, `backend/README.md`.
