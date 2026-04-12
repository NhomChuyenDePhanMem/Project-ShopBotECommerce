# Bài tập cuối kỳ — Yêu cầu & checklist (theo đề bài môn)

> Trích và hệ thống hóa từ *Thông tin bài tập Giữa kỳ và Cuối kỳ* (PDF). Dùng file này để đối chiếu trước khi nộp.

## 1. Yêu cầu tổng quan

| Hạng mục | Nội dung |
|----------|-----------|
| **Quy mô nhóm** | Đề bài môn ghi **3–5**; nhóm này **6** thành viên — **giảng viên đã chấp nhận**. |
| **Đề tài** | Theo file đăng ký: [de-tai/shopbot-summary.docx](de-tai/shopbot-summary.docx) (cùng các tài liệu trong `docs/`). |
| **Nộp** | (1) GitHub repo đủ source, chạy được · (2) **Báo cáo PDF** · (3) **Video demo YouTube** |

### Liên kết nộp bài (nhóm — cập nhật)

| Nội dung | URL |
|----------|-----|
| **GitHub** | [https://github.com/NhomChuyenDePhanMem/Project-ShopBotECommerce](https://github.com/NhomChuyenDePhanMem/Project-ShopBotECommerce) |
| **Video demo YouTube** | [https://youtu.be/DTYRb54n_kw](https://youtu.be/DTYRb54n_kw) |

### Hạn nộp (theo đề)

| Bài | Hạn |
|-----|-----|
| Giữa kỳ (cá nhân) | Trước **04/04/2026** |
| **Cuối kỳ (nhóm)** | Trước **10/04/2026** — PDF + GitHub + YouTube |

*Bài trễ có thể bị trừ điểm.*

---

## 2. Cấu trúc báo cáo PDF (đề xuất)

| STT | Nội dung |
|-----|-----------|
| 1 | Trang bìa (trường, môn, nhóm, đề tài) |
| 2 | Danh sách thành viên (họ tên, MSSV) + **phân công tổng quan** |
| 3 | Mục lục |
| 4 | **Chương 1:** Giới thiệu đề tài (mục tiêu, phạm vi, công nghệ) |
| 5 | **Chương 2:** Phân tích yêu cầu (User Stories, Use Cases, Wireframe) |
| 6 | **Chương 3:** Thiết kế (kiến trúc, ERD, CSDL) |
| 7 | **Chương 4:** Phát triển (Frontend, Backend — ảnh chụp, trích code) |
| 8 | **Chương 5:** Kiểm thử (test case, kết quả) |
| 9 | **Chương 6:** Kết quả & hướng phát triển |
| 10 | Tài liệu tham khảo |
| 11 | **Phụ lục:** link GitHub, link YouTube demo (dùng đúng URL trong mục *Liên kết nộp bài* phía trên) |

### Yêu cầu PDF

- **Tối thiểu:** ≥ **20 trang**  
- **Phù hợp:** khoảng **50–70 trang** (gồm mục lục, ảnh, bảng)  
- **Nội dung:** mô tả rõ sản phẩm, cách làm, kết quả; **ảnh màn hình** theo chức năng  
- **Đầu mỗi chương:** ghi **thành viên tham gia** và việc đã làm  

### Ghi nhận đóng góp

- Đầu báo cáo: bảng **tên + công việc chính**  
- Đầu mỗi chương: ai làm phần nào (ví dụ: *Chương 4 — Nguyễn A: Backend API, Trần B: Frontend UI*)  
- **Không ghi tên** thành viên không đóng góp chương đó  

---

## 3. GitHub Repository

- [ ] Source **đầy đủ**, **chạy được** trên máy sạch (kèm hướng dẫn)  
- [ ] **README.md:** mô tả dự án + **cài đặt & chạy** (root + `backend/README.md` nếu cần)  
- [ ] **Commit history** thể hiện quá trình (nhiều commit có ý nghĩa, tránh 1 commit khổng lồ duy nhất)  
- [ ] **Cấu trúc thư mục** rõ ràng (xem `README.md` gốc + `docs/README.md`)  
- [ ] **`.gitignore`** loại `node_modules`, `.env`, build, IDE…  
- [ ] **Phụ lục báo cáo:** dán **link repo**  

---

## 4. Video demo YouTube

- [ ] Quay demo **phần mềm chạy thật**  
- [ ] Upload **public** hoặc **unlisted**  
- [ ] Nội dung gợi ý: giới thiệu nhóm + đề tài; demo **các chức năng chính**  
- [ ] **Phụ lục báo cáo:** dán **link YouTube**  

---

## 5. Gợi ý map tài liệu có sẵn → các chương báo cáo

**Đề tài chính:** ShopBot — `docs/de-tai/shopbot-summary.docx` + `docs/SShopBot_Design.md` + `docs/0x_*.md`. **CSDL & kiến trúc:** `docs/design/*` (ERD, `schema.sql`, sơ đồ module ecommerce; Auth khớp `users` / `roles` trong `schema.sql`).

| Chương | Có thể tái sử dụng / bổ sung từ repo |
|--------|--------------------------------------|
| 1 | `docs/de-tai/shopbot-summary.docx`, `docs/SShopBot_Design.md` (mục tiêu, phạm vi, công nghệ); có thể trích `docs/design/system-architecture.md` nếu mô tả kiến trúc tổng thể |
| 2 | `docs/01_User_Stories.md`, `docs/03_Wireframes_User_Flows.md`, `docs/02_Functional_Requirements.md` |
| 3 | ShopBot: sơ đồ trong `docs/06_AI_System_Diagrams.md`; CSDL: `docs/design/erd.dbml`, `docs/design/schema.sql`, `design-patterns.md` |
| 4 | Ảnh Postman/Swagger, màn hình React, trích code Auth / API demo |
| 5 | `backend/test/*.e2e-spec.ts`, bảng test case thủ công + kết quả chạy |
| Phụ lục | [GitHub nhóm](https://github.com/NhomChuyenDePhanMem/Project-ShopBotECommerce) · [YouTube demo](https://youtu.be/DTYRb54n_kw) |

---

## 6. Checklist nhanh trước khi nộp

- [ ] PDF đủ trang, đủ chương, có ảnh, có phân công đầu chương  
- [ ] Repo public (hoặc cấp quyền GV) + README chạy được  
- [ ] Link GitHub + YouTube trong phụ lục  
- [ ] Đúng hạn **10/04/2026** (theo đề)  

---

*File PDF đề bài môn có thể đặt trong `docs/course/` (xem [course/README.md](course/README.md)) để cả nhóm cùng tham chiếu.*
