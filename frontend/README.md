# Frontend — ShopBot E-Commerce (React + TypeScript + Vite)

Giao diện web cho nền tảng **ShopBot** (TMĐT + chatbot). Đề tài: [docs/de-tai/shopbot-summary.docx](../docs/de-tai/shopbot-summary.docx). Chạy cả dự án: [README gốc](../README.md).

## Chạy local

```bash
npm install
npm run dev
```

Mặc định gọi API tại `http://localhost:3000/api`. Đổi bằng biến môi trường:

```bash
# Windows PowerShell
$env:VITE_API_BASE_URL="http://localhost:3000/api"; npm run dev
```

## Build

```bash
npm run build
npm run preview   # xem bản build
```

## Lint

```bash
npm run lint
```

---

Template gốc: [Vite + React](https://vite.dev/). Cấu hình ESLint mở rộng: xem [ESLint React](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md).
