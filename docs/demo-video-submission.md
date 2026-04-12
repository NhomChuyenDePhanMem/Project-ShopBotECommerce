# Demo video — ShopBot E-Commerce

## 1) Thông tin nộp bài

- Tên dự án: ShopBot E-Commerce (TMĐT + chatbot AI)
- Nhóm: 6 thành viên
- Môn: Chuyên đề phát triển phần mềm
- GitHub repo: [https://github.com/NhomChuyenDePhanMem/Project-ShopBotECommerce](https://github.com/NhomChuyenDePhanMem/Project-ShopBotECommerce)
- YouTube video demo: [https://youtu.be/DTYRb54n_kw](https://youtu.be/DTYRb54n_kw)

## 2) Chuẩn bị trước khi quay (checklist)

- [ ] Docker Desktop đang chạy
- [ ] Trong root repo: `docker compose up -d`
- [ ] Trong `backend/`: `npm install && npm run db:init && npm run start:dev`
- [ ] Trong `frontend/`: `npm install && npm run dev`
- [ ] Mở trình duyệt tại `http://localhost:5173` (hoặc cổng Vite hiển thị)
- [ ] Kiểm tra backend: `http://localhost:3000/api`
- [ ] (Tuỳ chọn) Chatbot dùng AI thật — kiểm tra biến môi trường API key

## 3) Kịch bản gợi ý (7–10 phút)

### Phần A — Giới thiệu (30–45 giây)

1. Tên đề tài, mục tiêu: nền tảng TMĐT + tư vấn mua sắm bằng chatbot.
2. Stack: React + Vite, NestJS, PostgreSQL, Docker; AI (OpenAI/Gemini nếu có).

### Phần B — Kiến trúc & cài đặt (45–60 giây)

1. Cấu trúc `frontend/`, `backend/`, `docs/`.
2. Docker Compose, `.env`, cách chạy local.

### Phần C — Luồng nghiệp vụ (4–6 phút)

1. **Khách (`customer`)**: đăng nhập, xem catalog, lọc sản phẩm, thêm giỏ, checkout (tạo đơn + thanh toán), xem đơn.
2. **Người bán / quản trị (`seller` / `admin`)**: xác nhận đơn (confirm), chuyển giao hàng (ship) nếu demo được.
3. **Admin**: quản lý user (tạo / xóa) nếu có trên UI.
4. **Thanh toán**: chọn phương thức (COD / VNPay / Momo / Stripe — theo UI/API thực tế).

### Phần D — Chatbot AI (1–2 phút)

1. Gửi câu hỏi tư vấn sản phẩm / ngân sách.
2. Nêu rõ có dùng provider AI hay chế độ fallback (nếu có).

### Phần E — Kết (30 giây)

1. Tóm tắt kết quả.
2. Hướng mở rộng (tồn kho thật, cổng thanh toán live, dashboard).

## 4) Mẫu mô tả YouTube

```
ShopBot E-Commerce — Demo TMĐT + chatbot AI

Nội dung:
- Đăng nhập theo vai trò (customer / seller / admin)
- Catalog, giỏ hàng, đơn hàng, thanh toán
- Chatbot tư vấn mua sắm
- Kiến trúc React + NestJS + PostgreSQL

Nhóm 6 thành viên — Chuyên đề phát triển phần mềm
```

## 5) Checklist trước khi nộp

- [ ] Âm thanh rõ, màn hình đọc được
- [ ] Frontend và backend chạy thật trong video
- [ ] Demo đủ luồng khách + ít nhất một luồng seller/admin phù hợp đề
- [ ] Có đoạn chatbot (nếu là yêu cầu đề tài)
- [ ] Link YouTube public hoặc unlisted
- [ ] Đã cập nhật link vào mục "Thông tin nộp bài"
