# -*- coding: utf-8 -*-
"""
Generates docs/phan-cong-nhom.pdf — bảng phân công nhóm ShopBot E-Commerce.
Requires: pip install fpdf2
"""
from pathlib import Path

from fpdf import FPDF
from fpdf.enums import MethodReturnValue, WrapMode, XPos, YPos

ROOT = Path(__file__).resolve().parent
OUT_PDF = ROOT / "phan-cong-nhom.pdf"
FONT = Path(r"C:\Windows\Fonts\arial.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\arialbd.ttf")
if not FONT.exists():
    FONT = Path(r"C:\Windows\Fonts\ARIAL.TTF")
if not FONT_BOLD.exists():
    FONT_BOLD = Path(r"C:\Windows\Fonts\ARIALBD.TTF")


class PDF(FPDF):
    def footer(self):
        self.set_y(-14)
        self.set_font("ArialUni", "", 8)
        self.set_text_color(90, 90, 90)
        self.cell(0, 7, f"Trang {self.page_no()}/{{nb}}", align="C")


def safe_multi_cell(
    pdf: FPDF,
    width: float,
    line_height: float,
    text: str,
    *,
    font: str,
    style: str,
    size: int,
    align: str = "L",
    wrapmode: WrapMode = WrapMode.CHAR,
) -> None:
    """multi_cell + xuống trang trước khi vẽ; luôn reset x về lề trái sau mỗi khối.

    fpdf2 mặc định new_x=RIGHT khiến lần multi_cell tiếp theo bắt đầu từ mép phải,
    tràn khỏi trang và bị cắt chữ (đúng ảnh bạn gửi).
    """
    pdf.set_x(pdf.l_margin)
    pdf.set_font(font, style, size)
    mc_kw = dict(
        w=width,
        h=line_height,
        text=text,
        align=align,
        new_x=XPos.LMARGIN,
        new_y=YPos.NEXT,
        wrapmode=wrapmode,
    )
    need = pdf.multi_cell(
        **mc_kw,
        dry_run=True,
        output=MethodReturnValue.HEIGHT,
    )
    if pdf.will_page_break(float(need) + 3):
        pdf.add_page()
        pdf.set_x(pdf.l_margin)
        pdf.set_font(font, style, size)
    pdf.multi_cell(**mc_kw)


def main():
    if not FONT.exists():
        raise SystemExit(f"Không tìm thấy font Arial: {FONT}")
    if not FONT_BOLD.exists():
        raise SystemExit(f"Không tìm thấy font Arial Bold: {FONT_BOLD}")

    pdf = PDF(orientation="P", unit="mm", format="A4")
    pdf.alias_nb_pages()
    # Lề dưới lớn để không đè lên vùng footer (trang bị “cắt” nội dung).
    pdf.set_auto_page_break(auto=True, margin=36)
    pdf.set_margins(16, 16, 16)

    pdf.add_font("ArialUni", "", str(FONT))
    pdf.add_font("ArialUni", "B", str(FONT_BOLD))
    pdf.add_page()

    w = pdf.epw

    safe_multi_cell(
        pdf,
        w,
        8,
        "BẢNG PHÂN CÔNG CÔNG VIỆC",
        font="ArialUni",
        style="B",
        size=14,
        align="C",
        wrapmode=WrapMode.WORD,
    )
    safe_multi_cell(
        pdf,
        w,
        6,
        "Môn: Chuyên đề Phát triển phần mềm",
        font="ArialUni",
        style="",
        size=10,
        align="C",
        wrapmode=WrapMode.WORD,
    )
    safe_multi_cell(
        pdf,
        w,
        6,
        "Đề tài: ShopBot E-Commerce (REST API + Web + Chatbot AI)",
        font="ArialUni",
        style="",
        size=10,
        align="C",
        wrapmode=WrapMode.WORD,
    )
    safe_multi_cell(
        pdf,
        w,
        6,
        "Quy mô nhóm: 6 thành viên (theo đề đăng ký). File đề chính: docs/de-tai/shopbot-summary.docx",
        font="ArialUni",
        style="",
        size=9,
        align="C",
        wrapmode=WrapMode.WORD,
    )
    pdf.ln(2)

    safe_multi_cell(
        pdf,
        w,
        4.5,
        "Công nghệ: PostgreSQL, NestJS (REST), React/Vite, Docker Compose; tài liệu thiết kế CSDL: docs/design/schema.sql. "
        "Chi tiết từng MSSV: assignments/<MSSV>/SCOPE.txt. Phân công có thể điều chỉnh theo tiến độ nhóm.",
        font="ArialUni",
        style="",
        size=8,
    )
    pdf.ln(2)

    safe_multi_cell(
        pdf,
        w,
        5,
        "Tóm tắt phân công (STT — MSSV — Họ tên — Hạng mục chính)",
        font="ArialUni",
        style="B",
        size=9,
        wrapmode=WrapMode.WORD,
    )
    summary_lines = [
        "1 — 1721031099 — Vũ Đình Mạnh — DevOps/DB: Docker Compose, PostgreSQL, db:init + schema.sql.",
        "2 — 1721031693 — Huỳnh Minh Tiến — Auth (JWT/bcrypt), roles, users.",
        "3 — 1721031203 — Nguyễn Tiến Đạt — Catalog: categories + products (bảng menu_items).",
        "4 — 1721031524 — Nguyễn Viết Quốc Anh — Đơn: orders, order_items, luồng trạng thái giao hàng.",
        "5 — 1721031448 — Nguyễn Mai Quốc Khánh — payments + giao diện checkout / thanh toán.",
        "6 — 1721031423 — Trần Quang Huy — FE React: catalog, giỏ, đơn, admin user, README & demo.",
    ]
    for s in summary_lines:
        safe_multi_cell(
            pdf,
            w,
            4.5,
            s,
            font="ArialUni",
            style="",
            size=8,
        )

    pdf.ln(3)
    pdf.set_x(pdf.l_margin)
    pdf.set_font("ArialUni", "B", 9)
    pdf.cell(0, 6, "Chi tiết theo thành viên", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    members = [
        (
            "1. MSSV 1721031099 — Vũ Đình Mạnh",
            [
                "DevOps & nền tảng: Docker Compose, PostgreSQL, cấu trúc repo (backend/frontend).",
                "Khởi tạo DB từ docs/design/schema.sql (npm run db:init); hướng dẫn môi trường nhóm.",
                "Đảm bảo README root và docker-compose chạy được trên máy cả nhóm.",
            ],
        ),
        (
            "2. MSSV 1721031693 — Huỳnh Minh Tiến",
            [
                "Xây dựng module Auth: JWT, bcrypt, đăng nhập/đăng xuất.",
                "Phân quyền theo bảng roles; middleware bảo vệ endpoint theo vai trò.",
                "API/CRUD người dùng (users) theo quyền admin nếu có trong phạm vi đề tài.",
            ],
        ),
        (
            "3. MSSV 1721031203 — Nguyễn Tiến Đạt",
            [
                "Catalog: API /products và categories (dữ liệu bảng menu_items, entity Product).",
                "is_available; liên kết order_items qua productId (FK menu_item_id).",
            ],
        ),
        (
            "4. MSSV 1721031524 — Nguyễn Viết Quốc Anh",
            [
                "Module đơn hàng: API orders + order_items, transaction khi tạo đơn.",
                "Luồng trạng thái: pending → confirmed → packing → shipping → done / cancelled.",
                "Phối hợp seller (confirm/ship) và customer (complete/cancel) qua REST.",
            ],
        ),
        (
            "5. MSSV 1721031448 — Nguyễn Mai Quốc Khánh",
            [
                "Module thanh toán: API payments (cod, vnpay, momo, stripe) gắn với order.",
                "Frontend: checkout, chọn phương thức thanh toán sau khi tạo đơn.",
            ],
        ),
        (
            "6. MSSV 1721031423 — Trần Quang Huy",
            [
                "Frontend React: catalog, giỏ hàng, đơn, chatbot, quản trị user (seller/admin).",
                "README hướng dẫn cài đặt & chạy; hỗ trợ slide / kịch bản demo video.",
            ],
        ),
    ]

    for title, bullets in members:
        safe_multi_cell(
            pdf,
            w,
            5.5,
            title,
            font="ArialUni",
            style="B",
            size=9,
            wrapmode=WrapMode.WORD,
        )
        for b in bullets:
            safe_multi_cell(
                pdf,
                w,
                4.5,
                f"    • {b}",
                font="ArialUni",
                style="",
                size=8,
                wrapmode=WrapMode.CHAR,
            )
        pdf.ln(1)

    pdf.ln(2)
    safe_multi_cell(
        pdf,
        w,
        5.5,
        "Công việc chung cả nhóm",
        font="ArialUni",
        style="B",
        size=9,
        wrapmode=WrapMode.WORD,
    )
    for line in [
        "• Thống nhất stack, convention code, quy tắc Git (branch, PR, code review).",
        "• Họp định kỳ: đồng bộ API và giao diện; cập nhật tài liệu nếu lệch thiết kế.",
        "• Kiểm thử luồng TMĐT: xem hàng → giỏ → đơn → thanh toán → chatbot; sửa lỗi tập thể.",
        "• Hoàn thiện báo cáo, slide, video demo (nếu giảng viên yêu cầu).",
    ]:
        safe_multi_cell(
            pdf,
            w,
            4.5,
            line,
            font="ArialUni",
            style="",
            size=8,
        )

    pdf.output(str(OUT_PDF))
    # ASCII-only: Windows cp1258 console may fail on Vietnamese print()
    print("OK wrote:", OUT_PDF.resolve())


if __name__ == "__main__":
    main()
