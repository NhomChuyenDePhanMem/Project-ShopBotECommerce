# Design patterns (tham chiếu)

## 1) Repository pattern

- **Mục đích**: Tách truy cập dữ liệu khỏi nghiệp vụ.
- **Áp dụng**: TypeORM `Repository<T>` inject trong `ProductsService`, `OrdersService`, `UsersService`, v.v.
- **Lợi ích**: Dễ thay đổi persistence, hỗ trợ test.

## 2) Service layer

- **Mục đích**: Nghiệp vụ nằm trong service, controller mỏng.
- **Áp dụng**: `OrdersService`, `PaymentsService`, `ProductsService`, `AuthService`.
- **Lợi ích**: Tái sử dụng logic, dễ đọc.

## 3) Strategy / factory (thanh toán — mở rộng)

- **Mục đích**: Chuẩn hóa xử lý theo `payment_method` (`cod`, `vnpay`, `momo`, `stripe`).
- **Áp dụng**: Có thể bổ sung lớp xử lý theo từng cổng; hiện tại ghi nhận thanh toán qua `PaymentsService`.
- **Lợi ích**: Mở rộng cổng thanh toán ít đụng code cũ.

## 4) Observer / events (tùy chọn)

- **Mục đích**: Thông báo khi đơn đổi trạng thái.
- **Áp dụng**: Có thể dùng `@nestjs/event-emitter` hoặc queue sau này.
- **Lợi ích**: Giảm coupling giữa orders và notifications.
