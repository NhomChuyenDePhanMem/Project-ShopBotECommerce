import pypandoc  # pyre-ignore[21]
import os

docs_dir = r"d:\HuynhMinhTien\CHUYEN DE PHAT TRIEN PHAN MEM\Warehouse Simulation\docs"
filenames = [
    "../SShopBot_Design.md",
    "00_Requirement_Gathering_Analysis.md",
    "01_User_Stories.md",
    "02_Functional_Requirements.md",
    "03_Wireframes_User_Flows.md",
    "04_NonFunctional_Requirements.md",
    "05_Data_Dictionary_Traceability.md",
    "06_AI_System_Diagrams.md"
]

combined_list: list[str] = []
for f in filenames:
    path = os.path.join(docs_dir, f)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as file:
            content: str = str(file.read())
            # Fix pandoc YAML metadata issues by replacing '---' with '***' for horizontal rules
            content = content.replace('\n---\n', '\n***\n')
            if content.startswith('---\n'):
                content = content.replace('---\n', '***\n', 1)
            combined_list.append(content)

combined: str = "\n\n".join(combined_list)

# write combined md
combined_path = os.path.join(docs_dir, "SShopBot_Docs_TongHop.md")
with open(combined_path, "w", encoding="utf-8") as file:
    file.write(combined)

# convert to docx
output_path = os.path.join(docs_dir, "SShopBot_Docs_TongHop.docx")
pypandoc.convert_text(combined, 'docx', format='md', outputfile=output_path)
print("Done")
