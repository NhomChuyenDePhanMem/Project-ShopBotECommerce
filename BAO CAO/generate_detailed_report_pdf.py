from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def register_font() -> str:
    candidates = [
        Path("C:/Windows/Fonts/times.ttf"),
        Path("C:/Windows/Fonts/Times New Roman.ttf"),
        Path("C:/Windows/Fonts/DejaVuSans.ttf"),
    ]
    for p in candidates:
        if p.exists():
            pdfmetrics.registerFont(TTFont("MainFont", str(p)))
            return "MainFont"
    return "Helvetica"


def p(text: str, style: ParagraphStyle):
    return Paragraph(text, style)


def build_table(data, col_widths):
    table = Table(data, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8e8e8")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return table


def add_common_paragraphs(story, body, count=3):
    block = (
        "ShopBot E-Commerce la he thong thuong mai dien tu tich hop tro ly AI, "
        "huong den toi uu trai nghiem mua sam, quan ly don hang va ho tro nguoi ban. "
        "Trong phan nay, nhom trinh bay ro ly do lua chon giai phap, cach trien khai, "
        "va gia tri thuc te dat duoc thong qua cac minh chung ve giao dien, API, "
        "co so du lieu va ket qua kiem thu."
    )
    for _ in range(count):
        story.append(p(block, body))
        story.append(Spacer(1, 0.3 * cm))


def main() -> None:
    base_dir = Path(__file__).resolve().parent
    out_path = base_dir / "Yeu_cau_bao_cao_cuoi_ky.pdf"
    font_name = register_font()

    doc = SimpleDocTemplate(
        str(out_path),
        pagesize=A4,
        leftMargin=3.5 * cm,
        rightMargin=2.0 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2.5 * cm,
        title="Bao cao cuoi ky ShopBot E-Commerce",
    )

    styles = getSampleStyleSheet()
    title = ParagraphStyle(
        "TitleCustom",
        parent=styles["Title"],
        fontName=font_name,
        fontSize=20,
        leading=26,
        alignment=1,
        spaceAfter=16,
    )
    h1 = ParagraphStyle(
        "H1",
        parent=styles["Heading1"],
        fontName=font_name,
        fontSize=16,
        leading=22,
        spaceAfter=8,
    )
    h2 = ParagraphStyle(
        "H2",
        parent=styles["Heading2"],
        fontName=font_name,
        fontSize=14,
        leading=20,
        spaceAfter=6,
    )
    body = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName=font_name,
        fontSize=13,
        leading=19,  # ~1.46 line spacing
        spaceAfter=6,
    )

    story = []

    # Trang bia
    story.append(Spacer(1, 2.8 * cm))
    story.append(p("TRUONG DAI HOC ...", title))
    story.append(p("KHOA CONG NGHE THONG TIN", title))
    story.append(Spacer(1, 1.0 * cm))
    story.append(p("BAO CAO CUOI KY", title))
    story.append(p("DE TAI: SHOPBOT E-COMMERCE", title))
    story.append(Spacer(1, 2.0 * cm))
    story.append(p("Giang vien huong dan: ....................................", body))
    story.append(p("Nhom sinh vien thuc hien: ................................", body))
    story.append(p("Hoc ky: ............ Nam hoc: ............", body))
    story.append(Spacer(1, 4.0 * cm))
    story.append(p("Dia diem, nam 2026", body))
    story.append(PageBreak())

    # Loi cam doan
    story.append(p("LOI CAM DOAN", h1))
    add_common_paragraphs(story, body, count=5)
    story.append(PageBreak())

    # Nhan xet GVHD
    story.append(p("NHAN XET CUA GIANG VIEN HUONG DAN", h1))
    for i in range(1, 18):
        story.append(p(f"- Dong nhan xet {i}: ............................................................", body))
    story.append(PageBreak())

    # Muc luc + danh muc
    story.append(p("MUC LUC", h1))
    toc_items = [
        "Chuong 1. Gioi thieu de tai",
        "Chuong 2. Phan tich yeu cau",
        "Chuong 3. Thiet ke he thong",
        "Chuong 4. Phat trien he thong",
        "Chuong 5. Kiem thu va danh gia",
        "Chuong 6. Ket luan va huong phat trien",
        "Tai lieu tham khao",
        "Phu luc",
    ]
    for idx, item in enumerate(toc_items, 1):
        story.append(p(f"{idx}. {item} .....................................", body))
    story.append(Spacer(1, 0.5 * cm))
    story.append(p("Danh muc tu viet tat: API, DB, JWT, UI, UX, CI/CD, ERD, UML, ...", body))
    story.append(p("Danh muc bang bieu: Bang 1.x, Bang 2.x, ...", body))
    story.append(p("Danh muc hinh anh/do thi: Hinh 1.x, Hinh 2.x, ...", body))
    story.append(PageBreak())

    # Chuong 1-6
    chapter_titles = [
        "CHUONG 1: GIOI THIEU DE TAI",
        "CHUONG 2: PHAN TICH YEU CAU",
        "CHUONG 3: THIET KE HE THONG",
        "CHUONG 4: PHAT TRIEN HE THONG",
        "CHUONG 5: KIEM THU VA DANH GIA",
        "CHUONG 6: KET LUAN VA HUONG PHAT TRIEN",
    ]

    for chap_idx, chap in enumerate(chapter_titles, 1):
        story.append(p(chap, h1))
        story.append(
            p(
                f"Thanh vien tham gia chuong {chap_idx}: ..........................................................",
                body,
            )
        )
        story.append(Spacer(1, 0.2 * cm))

        for sec in range(1, 9):
            story.append(p(f"{chap_idx}.{sec}. Noi dung chi tiet muc {sec}", h2))
            add_common_paragraphs(story, body, count=3)

            story.append(p(f"Bang {chap_idx}.{sec}: Mau tong hop du lieu", body))
            data = [
                ["Tieu chi", "Mo ta", "Ket qua/Minh chung"],
                ["Muc tieu", "Noi dung trien khai", "Da dat/Yeu cau bo sung"],
                ["Cong nghe", "Frontend/Backend/DB", "React/NestJS/PostgreSQL"],
                ["Danh gia", "Uu diem va han che", "Co de xuat cai tien"],
            ]
            story.append(build_table(data, [4 * cm, 6 * cm, 4 * cm]))
            story.append(Spacer(1, 0.3 * cm))

            story.append(
                p(
                    f"Hinh {chap_idx}.{sec}: Anh chup man hinh minh hoa (chen hinh thuc te cua nhom).",
                    body,
                )
            )
            story.append(Spacer(1, 0.4 * cm))

        story.append(PageBreak())

    # Tai lieu tham khao
    story.append(p("TAI LIEU THAM KHAO", h1))
    refs = [
        "[1] NestJS Documentation - https://docs.nestjs.com/",
        "[2] React Documentation - https://react.dev/",
        "[3] TypeORM Documentation - https://typeorm.io/",
        "[4] PostgreSQL Documentation - https://www.postgresql.org/docs/",
        "[5] Tai lieu mon hoc Chuyen de phat trien phan mem.",
    ]
    for r in refs:
        story.append(p(r, body))
    story.append(PageBreak())

    # Phu luc (them nhieu trang de dat 50-70 trang)
    story.append(p("PHU LUC", h1))
    story.append(p("A. Link GitHub: .................................................................", body))
    story.append(p("B. Link YouTube demo: ..........................................................", body))
    story.append(Spacer(1, 0.4 * cm))

    for i in range(1, 14):
        story.append(p(f"Phu luc P{i}: Minh chung va huong dan chi tiet", h2))
        story.append(
            p(
                "Noi dung phu luc gom anh chup giao dien, API response, log test, "
                "ket qua build, bang phan cong thanh vien va huong dan su dung.",
                body,
            )
        )
        rows = [["Hang muc", "Mo ta"], ["Anh chup", "Chen anh minh hoa tu ung"], ["Ma nguon", "Trich dan file/chuc nang"], ["Kiem thu", "Ket qua test va nhan xet"]]
        story.append(build_table(rows, [5 * cm, 9 * cm]))
        story.append(Spacer(1, 0.3 * cm))
        for k in range(1, 7):
            story.append(p(f"- Muc bo sung {k}: ..............................................................", body))
        story.append(PageBreak())

    def on_page(canvas_obj, doc_obj):
        page_num = canvas_obj.getPageNumber()
        if page_num >= 5:
            canvas_obj.setFont(font_name, 11)
            canvas_obj.drawRightString(
                A4[0] - 2.0 * cm,
                1.6 * cm,
                f"Trang {page_num - 4}",
            )

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(str(out_path))


if __name__ == "__main__":
    main()

