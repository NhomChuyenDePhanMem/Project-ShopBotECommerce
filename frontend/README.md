# Frontend - ShopBot Restaurant Dashboard (React + TypeScript + Vite)

Frontend hien tai la dashboard van hanh nha hang, goi API tu backend NestJS.

## Tinh nang man hinh

- `Menu & Danh muc`: CRUD danh muc + them/xoa menu item.
- `Man hinh bep`: hien thi don theo trang thai (`pending`, `processing`, `served`, `paid`, `cancelled`) va doi trang thai don.
- `Ban & Dat ban`: danh sach ban + doi trang thai ban + tao/doi trang thai dat ban.
- `Nguoi dung`: dang nhap admin de goi `users API`, tao user, xoa user.

## Chay local

```bash
npm install
npm run dev
```

Mac dinh goi API tai `http://localhost:3000/api`.

```bash
# Windows PowerShell
$env:VITE_API_BASE_URL="http://localhost:3000/api"; npm run dev
```

## Build va lint

```bash
npm run build
npm run lint
```
