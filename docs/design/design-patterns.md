# Design Patterns se ap dung

## 1) Repository Pattern
- **Muc dich**: Tach phan truy cap du lieu khoi business logic.
- **Ap dung**: `UserRepository`, `MenuRepository`, `OrderRepository`.
- **Loi ich**: De thay doi DB engine va de viet unit test.

## 2) Service Layer Pattern
- **Muc dich**: Chua nghiep vu trong service thay vi dat trong controller.
- **Ap dung**: `OrderService`, `PaymentService`, `ReservationService`.
- **Loi ich**: Controller gon, de bao tri, de tai su dung logic.

## 3) Factory Method Pattern
- **Muc dich**: Tao doi tuong xu ly thanh toan theo loai phuong thuc.
- **Ap dung**: `PaymentProcessorFactory` tra ve `CashProcessor`, `CardProcessor`, `TransferProcessor`.
- **Loi ich**: Mo rong phuong thuc thanh toan ma khong sua nhieu code cu.

## 4) Strategy Pattern
- **Muc dich**: Dong goi cac thuat toan tinh phi/khuyen mai.
- **Ap dung**: `DiscountStrategy` (khong giam, voucher %, voucher tien mat).
- **Loi ich**: Doi chinh sach khuyen mai linh hoat.

## 5) Singleton Pattern (co kiem soat)
- **Muc dich**: Dam bao mot diem khoi tao ket noi DB/config.
- **Ap dung**: `DatabaseConnection` hoac `ConfigManager`.
- **Loi ich**: Tranh tao nhieu ket noi khong can thiet.

## 6) Observer Pattern
- **Muc dich**: Dong bo su kien thay doi trang thai don hang.
- **Ap dung**: Khi don chuyen `processing -> served -> paid`, gui thong bao cho UI bep/thu ngan.
- **Loi ich**: Giam phu thuoc truc tiep giua cac module.
