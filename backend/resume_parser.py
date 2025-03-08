import pdfplumber
from docx import Document

def extract_text(file):
    if file.filename.endswith(".pdf"):
        with pdfplumber.open(file) as pdf:
            return "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
    elif file.filename.endswith(".docx"):
        doc = Document(file)
        return "\n".join(para.text for para in doc.paragraphs)
    else:
        return "Unsupported file format"
