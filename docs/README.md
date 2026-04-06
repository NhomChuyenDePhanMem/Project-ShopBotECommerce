# Tài liệu dự án — mục lục

## Thiết kế môn / mini project — **Quản lý quán ăn**

| Mục | Mô tả |
|-----|--------|
| [design/system-architecture.md](design/system-architecture.md) | Kiến trúc 3-tier, module Auth / Menu / Order / Table / Payment |
| [design/erd.dbml](design/erd.dbml) | ERD (dbdiagram.io) |
| [design/schema.sql](design/schema.sql) | PostgreSQL schema + seed |
| [design/design-patterns.md](design/design-patterns.md) | Repository, Service, Strategy, … |
| [design/README.md](design/README.md) | Deliverables tuần 4 |

**Ghi chú:** Đây là định hướng **bài tập / đề tài quán ăn** (thu ngân, bếp, đặt bàn). Phần backend hiện **mới khớp trực tiếp** với schema này ở module **Auth + users/roles**; các API mock còn lại đang theo mô hình TMĐT (xem dưới).

---

## Tài liệu **SShopBot** (TMĐT + AI)

| Mục | Mô tả |
|-----|--------|
| [SShopBot_Design.md](SShopBot_Design.md) | Tóm tắt ý tưởng nền tảng e-commerce + chatbot |
| `00_` … `06_*.md` | Thu thập yêu cầu, user story, NFR, data dictionary, AI diagrams |
| [SShopBot_Docs_TongHop.md](SShopBot_Docs_TongHop.md) | Bản gộp Markdown |
| `SShopBot_Docs_TongHop.docx` | Bản Word xuất từ gộp |
| [convert_docs.py](convert_docs.py) | Script gộp Markdown → TongHop (cần `pypandoc` nếu xuất DOCX) |

---

## Công cụ & khác

| Mục | Mô tả |
|-----|--------|
| [generate-phan-cong-pdf.py](generate-phan-cong-pdf.py) | Sinh PDF phân công nhóm |
| [phan-cong-nhom.pdf](phan-cong-nhom.pdf) | Bảng phân công |
| `Doc1.docx` | Tài liệu đính kèm (nếu dùng) |
