# Tài liệu dự án ShopBot — mục lục

**Đề tài đăng ký:** [de-tai/shopbot-summary.docx](de-tai/shopbot-summary.docx) — nhóm **6** thành viên (GV chấp nhận).  
**Code & chạy thử:** [README gốc](../README.md). **Bản đồ mã (FE/BE, RBAC):** [CODEMAP.md](CODEMAP.md).  
**Repo GitHub:** [NhomChuyenDePhanMem/Project-ShopBotECommerce](https://github.com/NhomChuyenDePhanMem/Project-ShopBotECommerce). **Video demo YouTube:** [youtu.be/DTYRb54n_kw](https://youtu.be/DTYRb54n_kw).

Trong repo, tên **SShopBot** là tên nền tảng dùng trong các file phân tích chi tiết; **ShopBot** là tên đề tài trên file đăng ký — cùng một hướng sản phẩm.

---

## Bài tập cuối kỳ — yêu cầu & checklist

| Mục | Mô tả |
|-----|--------|
| [cuoi-ky-de-bai.md](cuoi-ky-de-bai.md) | Cấu trúc báo cáo PDF, GitHub, YouTube, hạn nộp, gợi ý map tài liệu → chương |

---

## Đề tài đăng ký

| Mục | Mô tả |
|-----|--------|
| [de-tai/README.md](de-tai/README.md) | Giới thiệu ngắn + quy mô nhóm |
| [de-tai/shopbot-summary.docx](de-tai/shopbot-summary.docx) | File đề tài / tóm tắt nhóm |

---

## Tài liệu phân tích & thiết kế ShopBot (TMĐT + AI)

| Mục | Mô tả |
|-----|--------|
| [SShopBot_Design.md](SShopBot_Design.md) | Tóm tắt ý tưởng, phạm vi, tech stack |
| [00_Requirement_Gathering_Analysis.md](00_Requirement_Gathering_Analysis.md) … [06_AI_System_Diagrams.md](06_AI_System_Diagrams.md) | Thu thập yêu cầu, user story, FR/NFR, wireframe, data dictionary, sơ đồ AI |
| [SShopBot_Docs_TongHop.md](SShopBot_Docs_TongHop.md) | Bản gộp Markdown |
| [SShopBot_Docs_TongHop.docx](SShopBot_Docs_TongHop.docx) | Bản Word (xuất từ gộp) |
| [convert_docs.py](convert_docs.py) | Script gộp Markdown → TongHop (cần `pypandoc` nếu xuất DOCX) |

---

## Thiết kế CSDL & kiến trúc triển khai

Mô hình PostgreSQL và sơ đồ kiến trúc cho **ShopBot ecommerce** (catalog `menu_items` / đơn / thanh toán). Khớp `backend` TypeORM và script `npm run db:init`.

| Mục | Mô tả |
|-----|--------|
| [design/README.md](design/README.md) | Mục lục thư mục design |
| [design/system-architecture.md](design/system-architecture.md) | Kiến trúc 3-tier, module |
| [design/erd.dbml](design/erd.dbml) | ERD (dbdiagram.io) |
| [design/schema.sql](design/schema.sql) | PostgreSQL schema baseline |
| [design/design-patterns.md](design/design-patterns.md) | Design patterns tham chiếu |

---

## Công cụ & khác

| Mục | Mô tả |
|-----|--------|
| [generate-phan-cong-pdf.py](generate-phan-cong-pdf.py) | Sinh PDF phân công nhóm |
| [phan-cong-nhom.pdf](phan-cong-nhom.pdf) | Bảng phân công |
| [course/README.md](course/README.md) | Gợi ý lưu PDF đề bài môn (nếu cần) |
