# Tài liệu dự án ShopBot — mục lục

**Đề tài đăng ký:** [de-tai/shopbot-summary.docx](de-tai/shopbot-summary.docx) — nhóm **6** thành viên (GV chấp nhận).  
**Code & chạy thử:** [README gốc](../README.md).

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

## Phụ lục — mini project *Quản lý quán ăn*

Dùng cho bài tập tuần / thiết kế CSDL nghiệp vụ quán (bàn, menu, đơn, thanh toán). **Backend Auth** hiện dùng `users` / `roles` khớp `schema.sql` dưới đây.

| Mục | Mô tả |
|-----|--------|
| [design/README.md](design/README.md) | Danh sách deliverables & link ERD |
| [design/system-architecture.md](design/system-architecture.md) | Kiến trúc 3-tier, module |
| [design/erd.dbml](design/erd.dbml) | ERD (dbdiagram.io) |
| [design/schema.sql](design/schema.sql) | PostgreSQL schema + seed |
| [design/design-patterns.md](design/design-patterns.md) | Design patterns áp dụng |

---

## Công cụ & khác

| Mục | Mô tả |
|-----|--------|
| [generate-phan-cong-pdf.py](generate-phan-cong-pdf.py) | Sinh PDF phân công nhóm |
| [phan-cong-nhom.pdf](phan-cong-nhom.pdf) | Bảng phân công |
| [course/README.md](course/README.md) | Gợi ý lưu PDF đề bài môn (nếu cần) |
| `Doc1.docx` | Tài liệu đính kèm (nếu dùng) |
