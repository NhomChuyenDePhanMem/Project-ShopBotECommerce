# THU THẬP & PHÂN TÍCH YÊU CẦU PHẦN MỀM (Requirement Gathering & Analysis)
**Tên dự án:** Nâng cấp Hệ thống Warehouse Simulation (Tích hợp Trí tuệ Nhân tạo - Smart Warehouse)

Tài liệu này trình bày quy trình chuẩn mực của bộ môn Kỹ thuật Phần mềm (Software Engineering) trong việc Thu thập Yêu cầu (Requirements Elicitation) và Phân tích Yêu cầu (Requirements Analysis). Mục tiêu là tìm ra các "Pain points" (Nỗi đau/Vấn đề) thực tế của hệ thống cũ và đưa ra quyết định nâng cấp tính năng chính xác.

---

## 1. Phương Pháp Thu Thập Yêu Cầu (Elicitation Techniques)

Để đảm bảo các chức năng nâng cấp thực sự giải quyết được bài toán quản lý kho, nhóm thực hiện đã áp dụng các phương pháp quy chuẩn sau đối với những bên liên quan (Stakeholders):

1. **Phỏng vấn trực tiếp (Interviews) với Quản lý kho & Nhân viên thao tác:**
   *   *Phát hiện:* Nhân viên kho tốn nhiều thời gian học thuộc các dòng lệnh Terminal cũ hoặc phải click qua nhiều Form UI phức tạp chỉ để xuất/nhập 1 đơn vị hàng.
   *   *Phát hiện:* Quản lý kho gặp khó khăn trong việc dự đoán số lượng hàng sắp cạn kiệt vì hệ thống chỉ báo khi bằng 0.

2. **Quan sát quy trình hiện tại (Observation / Shadowing):**
   *   *Theo dõi thực tế:* Thời gian trung bình để tìm kiếm thủ công một mặt hàng trong kho có 1000+ sản phẩm mất từ 3-5 phút do sắp xếp hàng chưa có quy luật tối ưu.

3. **Phân tích tài liệu & Biểu mẫu cũ (Document Analysis):**
   *   Xem xét các phiếu nhập/xuất kho cũ, sổ sách Excel... từ đó cấu trúc lại thành mô hình CSDL quy chuẩn (Data Dictionary).

---

## 2. Phân Tích Bài Toán: Cũ (As-Is) vs. Đề Xuất (To-Be)

Dựa trên dữ liệu thu thập, giai đoạn Phân tích khoảng cách (Gap Analysis) được lập ra nhằm khẳng định giá trị của bản Nâng cấp lần này. Dưới đây là sơ đồ so sánh quy trình làm việc (BPMN/Activity Flow) trước và sau khi có AI:

### Sơ đồ Quy trình: Hệ thống Hiện tại (As-Is) vs Hệ thống Tương lai (To-Be)
```mermaid
flowchart TD
    subgraph Quy trình Warehouse As-Is (Thủ công)
        A1[Nhân viên nhận yêu cầu Xuất/Nhập] --> B1[Gõ lệnh Terminal dài / Click qua 4 step UI]
        B1 --> C1{Nhớ sai mã lệnh/vị trí?}
        C1 -- Có --> D1[Tra cứu lại sổ sách/danh sách] --> B1
        C1 -- Không --> E1[Hệ thống ghi nhận vào DB]
        E1 --> F1(Hoàn thành 1 quy trình tốn 5 phút)
    end

    subgraph Quy trình Smart Warehouse To-Be (Có AI)
        A2[Nhân viên gõ/nói yêu cầu tự nhiên] --> B2[AI NLP phân tích Text -> API Command]
        B2 --> C2[AI tự động tối ưu đường đi hàng hóa]
        C2 --> E2[Hệ thống tự động ghi nhận vào DB]
        E2 --> F2(Hoàn thành tốn 10 giây)
    end
    
    %% Style highlights
    style F1 fill:#ffcdd2,stroke:#ef5350,color:#b71c1c
    style F2 fill:#c8e6c9,stroke:#66bb6a,color:#1b5e20
```

| Vấn đề Nghiệp vụ | Hệ thống cũ hiện hành (As-Is) | Giải pháp Nâng cấp (To-Be: Smart Warehouse) |
| :--- | :--- | :--- |
| **1. Thao tác Lệnh / Giao diện** | Gõ cú pháp Terminal cứng ngắc, dễ sai lỗi chính tả / Form nhập liệu rườm rà. | Tích hợp **AI NLP (Claude)**: Gõ lệnh bằng ngôn ngữ tự nhiên: "Mai xuất 10 thùng sữa cho kho 2", AI tự hiểu và mapping ra lệnh tương ứng. |
| **2. Tối ưu Quy hoạch kho** | Các mặt hàng rỗng được xếp thủ công, lung tung, khó đi lại. | Cung cấp thuật toán / AI phân tích các mặt hàng bán chạy ra gần cửa (Smart Placement). |
| **3. Kiểm soát Tồn kho** | Tới khi số lượng = 0 thì mới biết để gọi hàng. | **Phân tích Dự báo (Stock Prediction):** Hệ thống tự động cảnh báo mã hàng nào có tốc độ bán nhanh và gợi ý số lượng cần Restock. |
| **4. Lập Báo cáo & Tra cứu** | Mất thời gian xuất file CSV rồi tự vẽ số liệu bằng tay. | Chatbot Data Analytics: Gõ "Vẽ cho tôi báo cáo nhập kho tuần này", hệ thống tự động sinh biểu đồ ngay trên UI. |

---

## 5. Phân Tích Người Dùng & Bên liên quan (Stakeholder Analysis)

*   **Người sử dụng hệ thống trực tiếp (Warehouse Staff / Terminal User):**
    *   *Mục tiêu:* Tối giản hóa công việc, muốn một công cụ "Hiểu ý mình" thay vì mình phải "Nhớ lệnh". 
    *   *Nhu cầu:* Cần giao diện chat/terminal có AI để tiết kiệm số lần thao tác (Click/Type).
*   **Người Quản lý / Điều hành (Manager / Admin):**
    *   *Mục tiêu:* Giám sát bức tranh toàn cảnh của dòng chảy hàng hóa mà không tốn sức truy vấn DB phức tạp.
    *   *Nhu cầu:* Cần các chỉ số Cảnh báo sớm (Early Warnings) và Báo cáo trực quan siêu nhanh.

---

## 6. Xác Định Giải Pháp Cốt Lõi (Requirements Extraction)

Từ quá trình phân tích nỗi đau hiện trạng của kho hàng, chúng ta chính thức chốt lại các Yêu Cầu Nâng Cấp (Target Requirements) làm nền tảng đưa vào tài liệu Yêu cầu Chức năng (Functional Requirements) và Use Cases như sau:

**A. Core System Extensions (Nâng cấp Cốt lõi):**
*   Yêu cầu cấu trúc hóa Vị trí Kho bãi (Zone, Shelf, Bin) vào CSDL thay vì chỉ lưu số lượng thuần túy.
*   Theo dõi biến động hàng tồn (Audit Logs) Real-time ở mức chi tiết.

**B. Smart Integrations (Tính năng AI Thông Minh mấu chốt):**
*   **Module Natural Language Command:** (Trọng tâm) Chuyển lời thoại văn bản thành API thông qua Claude LLM.
*   **Module Predictive Analytics:** Động cơ cảnh báo hết hàng dựa trên biến động dữ liệu giao dịch 7/14 ngày qua.
*   **Smart Routing Controller:** Gợi ý cách phân bổ/vận chuyển lưu kho để đi được quãng đường ngắn nhất.

---
**Kết luận quá trình Phân tích:** 
Quy trình "Thu thập và Phân tích" này đã định hình rõ ràng chân dung dự án. Việc đưa AI vào hệ thống Warehouse Simulation không phải là "gắn cho oách" mà là một Cần-thiết-khách-quan để giải quyết triệt để sự cồng kềnh, thủ công của hệ thống As-Is. Nó trực tiếp bổ trợ cho việc thiết kế Sơ đồ Use Case và System Architecture phía sau.
