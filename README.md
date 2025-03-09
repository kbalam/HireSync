
# HireSync - Resume Filtering Platform

HireSync is a powerful recruitment platform designed to help recruiters filter out resumes based on a matching score calculated using Cohere AI. 
The platform analyzes the job description (JD) and checks for relevant keywords present in the resume, generating a match score to identify the most suitable candidates.

---

## 🚀 Features
- AI-based Resume Matching using Cohere API
- Real-time match score calculation
- Candidate management with applied date and score
- Dashboard displaying highest score and candidate count
- Resume parsing for PDF and DOCX files

---

## 🛠️ Tech Stack
### **Frontend:**
- HTML, CSS, JavaScript
- Fetch API for communication with backend
- Local storage for state management

### **Backend:**
- Python (Flask framework)
- Cohere API for AI-based text analysis
- PDF and DOCX parsing (pdfplumber and docx)
- JSON-based data storage

---

## 📥 Setup Instructions
1. **Clone the repository**  
```bash
git clone https://github.com/kbalam/HireSync.git
```

2. **Navigate to the project directory**  
```bash
cd HireSync
```

3. **Create a virtual environment**  
```bash
python -m venv venv
```

4. **Activate the virtual environment**  
- For Windows:  
```bash
.venv\Scripts\activate
```
- For Linux/Mac:  
```bash
source venv/bin/activate
```

5. **Install dependencies**  
```bash
pip install -r requirements.txt
```

6. **Set up environment variables**  
Create a `.env` file in the root directory and add the following:  
```
COHERE_API_KEY = "your-cohere-api-key"
APP_SECRET_KEY = "your-secret-key"
```

7. **Run the application**  
```bash
python app.py
```

---

## 🎯 Usage
1. Upload the resume file (PDF or DOCX) using the file upload section.  
2. Provide the job description (JD) in the input field.  
3. Click on the "Upload" button to process the resume.  
4. The system will analyze the resume using Cohere AI and generate a match score.  
5. The candidate information (name, score, and applied date) will be saved in the candidate list.  
6. The dashboard will display:
   - Total number of candidates  
   - Highest match score  
7. Recruiters can view or delete candidate information directly from the table.  

---

## 🌐 API Integration
- Cohere API is used to analyze the resume and JD text.  
- The system checks the presence of JD keywords in the resume and calculates a match score.  
- This allows recruiters to efficiently filter out the most suitable candidates.  

---
