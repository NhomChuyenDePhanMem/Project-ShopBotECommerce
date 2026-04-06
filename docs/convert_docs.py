"""
Gộp các file Markdown SShopBot thành SShopBot_Docs_TongHop.md (và tùy chọn .docx).
Chạy từ bất kỳ đâu: py -3 docs/convert_docs.py
Cần pypandoc + pandoc nếu muốn xuất DOCX.
"""
from __future__ import annotations

import os

_docs_dir = os.path.dirname(os.path.abspath(__file__))

filenames = [
    "SShopBot_Design.md",
    "00_Requirement_Gathering_Analysis.md",
    "01_User_Stories.md",
    "02_Functional_Requirements.md",
    "03_Wireframes_User_Flows.md",
    "04_NonFunctional_Requirements.md",
    "05_Data_Dictionary_Traceability.md",
    "06_AI_System_Diagrams.md",
]


def main() -> None:
    combined_list: list[str] = []
    for name in filenames:
        path = os.path.join(_docs_dir, name)
        if not os.path.exists(path):
            print(f"Skip (missing): {name}")
            continue
        with open(path, encoding="utf-8") as f:
            content = f.read()
        content = content.replace("\n---\n", "\n***\n")
        if content.startswith("---\n"):
            content = content.replace("---\n", "***\n", 1)
        combined_list.append(content)

    combined = "\n\n".join(combined_list)
    md_out = os.path.join(_docs_dir, "SShopBot_Docs_TongHop.md")
    with open(md_out, "w", encoding="utf-8") as f:
        f.write(combined)
    print("Wrote:", md_out)

    try:
        import pypandoc  # type: ignore
    except ImportError:
        print("Skip DOCX: install pypandoc and pandoc to export .docx")
        return

    docx_out = os.path.join(_docs_dir, "SShopBot_Docs_TongHop.docx")
    pypandoc.convert_text(combined, "docx", format="md", outputfile=docx_out)
    print("Wrote:", docx_out)


if __name__ == "__main__":
    main()
