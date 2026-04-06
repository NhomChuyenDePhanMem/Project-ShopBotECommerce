# -*- coding: utf-8 -*-
"""
Generates docs/phan-cong-nhom.pdf — bảng phân công nhóm.
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
        "Đề tài: Hệ thống Quản lý Quán ăn (REST API + Web)",
        font="ArialUni",
        style="",
        size=10,
        align="C",
        wrapmode=WrapMode.WORD,
    )
    pdf.ln(2)

    safe_multi_cell(
        pdf,
        w,
        4.5,
        "Gợi ý công nghệ: PostgreSQL, backend REST (NestJS hoặc tương đương), frontend React/Vite. "
        "Phân công có thể điều chỉnh theo tiến độ nhóm.",
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
        "1 — 1721031099 — Vũ Đình Mạnh — DevOps/DB, API bàn & đặt bàn (dining_tables, reservations).",
        "2 — 1721031693 — Huỳnh Minh Tiến — Auth (JWT/bcrypt), roles, users.",
        "3 — 1721031203 — Nguyễn Tiến Đạt — Menu: categories, menu_items (CRUD).",
        "4 — 1721031524 — Nguyễn Viết Quốc Anh — Đơn: orders, order_items, trạng thái đơn.",
        "5 — 1721031448 — Nguyễn Mai Quốc Khánh — payments + giao diện thu ngân.",
        "6 — 1721031423 — Trần Quang Huy — FE quản lý/bếp/đặt bàn, README & demo.",
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
                "DevOps & nền tảng: Docker Compose, PostgreSQL, khởi tạo cấu trúc repo (backend/frontend).",
                "Chạy migration/seed từ docs/design/schema.sql; hướng dẫn môi trường chạy trên máy nhóm.",
                "Phát triển API quản lý bàn và đặt bàn: dining_tables, reservations.",
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
                "Module Menu: API categories và menu_items (CRUD).",
                "Xử lý trường is_available; liên kết với order_items khi tạo đơn.",
            ],
        ),
        (
            "4. MSSV 1721031524 — Nguyễn Viết Quốc Anh",
            [
                "Module Đơn hàng: API orders + order_items, giao dịch DB (transaction).",
                "Chuyển trạng thái đơn: pending → processing → served → paid/cancelled.",
                "Phối hợp luồng bếp / thu ngân (theo nghiệp vụ đã thiết kế).",
            ],
        ),
        (
            "5. MSSV 1721031448 — Nguyễn Mai Quốc Khánh",
            [
                "Module Thanh toán: API payments (cash, card, transfer, e_wallet) gắn với order.",
                "Frontend khu vực thu ngân: tạo đơn, chọn món, thanh toán, trạng thái bàn.",
            ],
        ),
        (
            "6. MSSV 1721031423 — Trần Quang Huy",
            [
                "Frontend quản lý: menu/danh mục, người dùng (nếu có màn hình).",
                "Màn hình bếp: danh sách đơn theo trạng thái; màn hình đặt bàn / bàn.",
                "README hướng dẫn cài đặt & chạy; hỗ trợ slide / kịch bản demo.",
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
        "• Kiểm thử luồng nghiệp vụ: đặt món → bếp → thanh toán; sửa lỗi tập thể.",
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
    print("Đã tạo:", OUT_PDF)


if __name__ == "__main__":
    main()
