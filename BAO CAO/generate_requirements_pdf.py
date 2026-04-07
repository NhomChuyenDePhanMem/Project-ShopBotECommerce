from pathlib import Path

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


def draw_wrapped_text(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    line_height: float,
    font_name: str,
) -> float:
    words = text.split()
    line = ""
    for word in words:
        candidate = f"{line} {word}".strip()
        if c.stringWidth(candidate, font_name, 11) <= max_width:
            line = candidate
        else:
            c.drawString(x, y, line)
            y -= line_height
            line = word
    if line:
        c.drawString(x, y, line)
        y -= line_height
    return y


def main() -> None:
    base_dir = Path(__file__).resolve().parent
    output_path = base_dir / "Yeu_cau_bao_cao_cuoi_ky.pdf"

    font_path = Path("C:/Windows/Fonts/times.ttf")
    if not font_path.exists():
        font_path = Path("C:/Windows/Fonts/Times New Roman.ttf")
    if not font_path.exists():
        font_path = Path("C:/Windows/Fonts/DejaVuSans.ttf")
    pdfmetrics.registerFont(TTFont("MainFont", str(font_path)))

    c = canvas.Canvas(str(output_path), pagesize=A4)
    width, height = A4
    margin_left = 3.5 * cm
    margin_right = 2.0 * cm
    margin_top = 2.5 * cm
    margin_bottom = 2.5 * cm
    margin_x = margin_left
    y = height - 2.5 * cm
    max_width = width - margin_left - margin_right
    line_h = 16

    c.setFont("MainFont", 16)
    c.drawString(margin_x, y, "BAO CAO CUOI KY - DE TAI SHOPBOT E-COMMERCE")
    y -= 1.1 * cm

    c.setFont("MainFont", 11)
    intro = (
        "Tai lieu tong hop yeu cau va noi dung bao cao cho de tai ShopBot E-Commerce "
        "(nen tang thuong mai dien tu ket hop chatbot AI), bao gom phan nop GitHub, PDF, "
        "video demo YouTube va ghi nhan dong gop thanh vien."
    )
    y = draw_wrapped_text(c, intro, margin_x, y, max_width, line_h, "MainFont")
    y -= 0.3 * cm

    sections = [
        (
            "1) Thong tin de tai",
            [
                "- Ten de tai: ShopBot E-Commerce (AI-Powered E-Commerce Platform).",
                "- Muc tieu: xay dung he thong mua sam full-stack co chatbot AI ho tro tu van san pham.",
                "- Cong nghe chinh: React + Vite (frontend), NestJS (backend), PostgreSQL (database).",
                "- Doi tuong nguoi dung: customer, seller, admin.",
            ],
        ),
        (
            "2) San pham can nop",
            [
                "- GitHub repository: source code day du, co the chay duoc theo README.",
                "- Bao cao PDF: toi thieu 20 trang, khuyen nghi 50-70 trang.",
                "- Video demo YouTube: public hoac unlisted.",
                "- Phu luc bao cao phai co link GitHub va link YouTube.",
            ],
        ),
        (
            "3) Cau truc chi tiet cua bao cao",
            [
                "- Trang bia chinh: truong, khoa, ten de tai, GVHD, sinh vien thuc hien.",
                "- Cac trang thu tuc: Loi cam doan, nhan xet cua giang vien huong dan.",
                "- Muc luc va danh muc: tu viet tat, bang bieu, hinh anh/do thi.",
                "- Noi dung bao cao: Mo dau, cac chuong chinh, ket luan va kien nghi.",
                "- Tai lieu tham khao.",
                "- Phu luc: ma nguon/chuc nang bo tro, huong dan su dung, link GitHub, link YouTube.",
            ],
        ),
        (
            "4) Cau truc noi dung de xuat theo de tai",
            [
                "- Chuong 1: Gioi thieu de tai (muc tieu, pham vi, cong nghe).",
                "- Chuong 2: Phan tich yeu cau (User Stories, Use Cases, Wireframe).",
                "- Chuong 3: Thiet ke he thong (Kien truc, ERD, Database, schema).",
                "- Chuong 4: Phat trien (Frontend, Backend, API, chatbot, hinh anh minh hoa).",
                "- Chuong 5: Kiem thu (lint/test/build, test cases, ket qua thuc te).",
                "- Chuong 6: Ket qua, han che va huong phat trien.",
            ],
        ),
        (
            "5) Quy chuan trinh bay",
            [
                "- Dinh dang van ban: Times New Roman, co chu 13-14, dan dong 1.15-1.5.",
                "- Canh le: tren 2.5cm, duoi 2.5cm, trai 3.5cm, phai 2.0cm.",
                "- Danh so trang: bat dau tu phan noi dung chinh.",
                "- Bang bieu dat tieu de phia tren; hinh anh dat tieu de phia duoi.",
            ],
        ),
        (
            "6) Noi dung bat buoc trong bao cao",
            [
                "- Mo ta ro quy trinh xay dung he thong ShopBot tu phan tich den trien khai.",
                "- Co anh chup cho tung chuc nang chinh: dang nhap, menu/san pham, gio hang, dat hang, admin, chatbot.",
                "- Trinh bay API docs (Swagger) va so do CSDL (ERD/schema).",
                "- Dau moi chuong ghi ro thanh vien tham gia va cong viec.",
            ],
        ),
        (
            "7) Yeu cau GitHub repository",
            [
                "- README mo ta du an, huong dan cai dat/chay backend + frontend.",
                "- Commit history phan anh qua trinh phat trien.",
                "- Cau truc thu muc ro rang (frontend, backend, docs, assignments).",
                "- Co .gitignore loai bo file khong can thiet.",
            ],
        ),
        (
            "8) Yeu cau video demo YouTube",
            [
                "- Mo dau: gioi thieu nhom va de tai ShopBot E-Commerce.",
                "- Demo cac luong chinh: dang nhap theo role, mua hang, quan ly don, thanh toan, chatbot.",
                "- Neu co, demo Swagger endpoint va ket qua test he thong.",
                "- Chen link YouTube vao Phu luc bao cao PDF.",
            ],
        ),
        (
            "9) Ghi nhan dong gop thanh vien",
            [
                "- Phan dau bao cao: bang tong quan Ho ten + MSSV + cong viec chinh.",
                "- Dau moi chuong: ghi ro thanh vien tham gia (vi du: Chuong 4 - Nguyen A: Backend API, Tran B: Frontend UI).",
                "- Thanh vien khong dong gop thi khong ghi ten vao phan dong gop.",
            ],
        ),
        (
            "10) Thong tin can dien khi nop",
            [
                "- Link GitHub repository: ........................................",
                "- Link YouTube demo: .............................................",
                "- Truong / Mon hoc / GV huong dan: ...............................",
                "- Danh sach thanh vien + MSSV: ...................................",
            ],
        ),
    ]

    for title, bullets in sections:
        if y < margin_bottom + 1.5 * cm:
            c.showPage()
            c.setFont("MainFont", 11)
            y = height - margin_top
        c.setFont("MainFont", 12)
        c.drawString(margin_x, y, title)
        y -= 0.6 * cm
        c.setFont("MainFont", 11)
        for bullet in bullets:
            y = draw_wrapped_text(
                c,
                bullet,
                margin_x + 0.2 * cm,
                y,
                max_width - 0.2 * cm,
                line_h,
                "MainFont",
            )
        y -= 0.2 * cm

    c.setFont("MainFont", 10)
    c.drawString(
        margin_x,
        1.8 * cm,
        "Tai lieu duoc cap nhat theo yeu cau moi trong thu muc BAO CAO.",
    )
    c.save()

    print(str(output_path))


if __name__ == "__main__":
    main()

