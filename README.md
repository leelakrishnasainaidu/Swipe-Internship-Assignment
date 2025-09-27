# 🤖 AI-Powered Interview Assistant  

An **AI-powered interview platform** built with **Vite + React + Tailwind CSS** that simulates real interview experiences for candidates while giving interviewers a synchronized dashboard view.  

## ✨ Features  

### 🎯 Interviewee (Chat)  
- Upload resume (**PDF/DOCX**).  
- Auto-extract **Name, Email, Phone**.  
- Missing details? Chatbot collects them before starting.  
- **AI-driven interview flow** with 6 questions:  
  - 2 Easy (20s each)  
  - 2 Medium (60s each)  
  - 2 Hard (120s each)  
- Auto-submit answers when time runs out.  
- AI generates **final score + candidate summary**.  

### 🧑‍💼 Interviewer (Dashboard)  
- Candidate list with **scores + summaries**.  
- **Search & sort** candidates.  
- Click to view full profile:  
  - Name, Email, Phone  
  - Chat history (questions + answers)  
  - AI scoring breakdown  

### 💾 Data Persistence  
- **Zustand** state management.  
- Local storage saves all data, timers, and progress.  
- **Welcome Back modal** restores unfinished sessions.  

---

## 🛠️ Tech Stack  

- **Frontend:** React 19 + Vite  
- **Styling:** Tailwind CSS  
- **State Management:** Zustand  
- **Resume Parsing:**  
  - `pdf-parse` → PDF files  
  - `mammoth` → DOCX files  
- **Utilities:** `uuid` for candidate/session IDs  

---

## ⚙️ Installation & Setup  

Clone the repository:  
```bash
git clone https://github.com/leelakrishnasainaidu/Swipe-Internship-Assignment.git

Install dependencies: npm install
Run the development server: npm run dev
The application will be available at http://localhost:5173