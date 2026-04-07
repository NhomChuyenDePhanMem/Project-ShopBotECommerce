# 6. Tích hợp AI trong ShopBot E-Commerce

Tài liệu mô tả cách **ShopBot** tích hợp LLM (OpenAI, Google Gemini hoặc chế độ rule-based) để tư vấn mua sắm trong phạm vi TMĐT. **Không gọi API key từ trình duyệt** — mọi luồng đi qua `ChatbotModule` (NestJS); có thể bổ sung dữ liệu catalog từ `ProductsService` vào prompt.

**Nhóm thực hiện:** 6 thành viên; module chatbot phối hợp với nhóm frontend (UI) và DevOps (cấu hình env).

---

## 6.1 Sơ đồ kiến trúc (tổng quan)

```mermaid
flowchart LR
    U[Người dùng\nBuyer / Seller / Admin] --> R[React SPA]
    R -->|REST + JWT| B[NestJS API]
    B --> P[(PostgreSQL\ncatalog / orders)]
    B -->|HTTPS| L[LLM Provider\nOpenAI / Gemini]
```

👉 Backend giữ bí mật API key; có thể giới hạn context / token và rate limit (Throttler) để kiểm soát chi phí.

---

## 6.2 Luồng sequence (tư vấn theo ngân sách)

```mermaid
sequenceDiagram
    autonumber
    actor U as Khách hàng
    participant FE as React UI
    participant API as ChatbotController
    participant S as ProductsService
    participant LLM as LLM API

    U->>FE: Nhập câu hỏi + (tuỳ chọn) sessionId
    FE->>API: POST /api/chatbot/messages
    API->>S: Lấy danh sách sản phẩm gợi ý (vd. theo budget)
    S-->>API: Top sản phẩm / catalog snippet
    API->>LLM: Prompt hệ thống + ngữ cảnh sản phẩm
    LLM-->>API: Nội dung trả lời
    API-->>FE: JSON { text, sessionId, fallbackUsed, ... }
    FE-->>U: Hiển thị câu trả lời
```

---

## 6.3 Use case AI (TMĐT)

```mermaid
usecaseDiagram
    actor Buyer as Khách hàng
    package "Chatbot ShopBot" {
        usecase "Tư vấn sản phẩm theo nhu cầu / ngân sách" as UC1
        usecase "Giải thích chính sách giao hàng / đổi trả (trong phạm vi cho phép)" as UC2
        usecase "Gợi ý sản phẩm liên quan từ catalog" as UC3
    }
    Buyer --> UC1
    Buyer --> UC2
    Buyer --> UC3
```

👉 **Giá trị gia tăng:** giảm thời gian tìm kiếm, tăng tính tương tác; có thể mở rộng thêm moderation nội dung và log phiên phục vụ báo cáo.
