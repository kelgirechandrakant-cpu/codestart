# EduResources Pro: Comprehensive Project Context & AI Handover Document

Welcome! This document provides complete architectural context, tech stack details, routing structure, data models, and recent development history for **EduResources Pro** (`eduresources-main`). Anyone (developer or AI assistant) working in this repository should read this document first to understand the system.

---

## 🚀 Project Overview & Vision
**EduResources Pro** is an all-in-one university Learning Management System (LMS) and interactive study portal built with **Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui, and Supabase**.

Originally created as a centralized platform for university engineering students to upload, preview, and download **Previous Year Question Papers (PYQs)**, **Study Notes**, **Assignments**, and **Syllabus Resources**, the platform has been upgraded into a comprehensive **Practice & AI Study Ecosystem** by merging two specialized companion applications into it:
1. **Codestart (`codestart`)**: An interactive coding bank with 65+ C and Python problems, gamified XP, lives, and daily streaks.
2. **ExamPro AI Tutor (`exampro-ai-tutor`)**: An intelligent AI study companion powered by Google Gemini 2.5 Flash (`@google/genai`) capable of reading PDF syllabus documents inline and explaining math/code screenshots via KaTeX OCR.

---

## 🛠️ Technology Stack & Dependencies

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 (`react-router-dom` v6) | Single Page Application with `Suspense` & `lazy()` route splitting (`App.tsx`) |
| **Build Tool & Bundler**| Vite (`vite.config.ts`) | Fast HMR dev server (runs on `http://localhost:8080` by default) |
| **Styling & UI Kit** | Tailwind CSS (`tailwind.config.ts`) & `shadcn/ui` | Dark-mode Slate/Cyan/Emerald aesthetics with responsive layout |
| **Icons & Animations** | `lucide-react` & `framer-motion` | Micro-animations and modern iconography (`<Code2 />`, `<Bot />`, `<Flame />`) |
| **Backend & Storage** | Supabase (`@supabase/supabase-js`) | Authentication, PostgreSQL database tables, and secure signed document storage (`/resources`) |
| **AI & LLM Engine** | Google GenAI SDK (`@google/genai`) | `geminiService.ts` running `gemini-2.5-flash` with streaming (`sendMessageStream`) |
| **Math & Markdown** | `react-markdown`, `remark-math`, `rehype-katex` | KaTeX math equation rendering (`katex/dist/katex.min.css`) |

---

## 📁 Core Directory Architecture (`src/`)

```
eduresources-main/
├── src/
│   ├── assets/               # Static images & logos (logo.jpg)
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.tsx        # Main navigation header (Desktop & Mobile sheet with Practice & AI links)
│   │   ├── Footer.tsx        # Footer bar
│   │   ├── ResourceCard.tsx  # Document card with inline preview and quick "Ask AI" button
│   │   ├── DocumentViewer.tsx# Inline PDF/document viewer using Supabase signed storage URLs
│   │   ├── StudyAssistant.tsx# Floating global AI quick helper widget
│   │   ├── practice/         # Dedicated components for Coding Arena
│   │   │   └── CodeEditor.tsx# Syntax-styled editor with Tab indentation, test runner, and console
│   │   └── ui/               # shadcn/ui primitives (Button, Card, Badge, Tabs, Input, Sheet, etc.)
│   ├── data/                 # Static databases & mock banks
│   │   └── codingQuestions.ts# 65+ coding challenges categorized by language, difficulty, and topic
│   ├── integrations/
│   │   └── supabase/         # Supabase client and auto-generated database types
│   │       ├── client.ts     # Supabase initializer
│   │       └── types.ts      # Database schema definitions
│   ├── pages/                # Route views (Lazy-loaded inside App.tsx)
│   │   ├── Index.tsx         # Landing / Hero home page
│   │   ├── Resources.tsx     # Department & Subject resource catalog
│   │   ├── Notes.tsx         # Study notes directory
│   │   ├── PYQs.tsx          # Previous Year Question Papers directory
│   │   ├── Assignments.tsx   # Assignments tracking & uploads
│   │   ├── PracticeDirectory.tsx # (/practice) Filterable coding catalog with XP/Lives header
│   │   ├── ProblemArena.tsx  # (/practice/:problemId) Dual-pane code editor + AI mentor tab
│   │   ├── AITutor.tsx       # (/ai-tutor) PDF syllabus upload + KaTeX math chat session
│   │   ├── Admin.tsx         # (/admin) Admin dashboard for uploading documents to Supabase
│   │   ├── Auth.tsx / OTPAuth.tsx # User login, sign up, and OTP authentication
│   │   └── NotFound.tsx      # 404 fallback page
│   ├── services/
│   │   └── geminiService.ts  # Google GenAI wrapper supporting API key persistence & PDF/image attachment
│   ├── types/
│   │   └── coding.ts         # TypeScript definitions (`Question`, `Message`, `ExamTopic`, `QuizResult`)
│   ├── App.tsx               # Root router and React Query provider
│   ├── index.css             # Tailwind base & custom design token styles
│   └── main.tsx              # Application entry point
├── package.json              # NPM scripts & dependencies
├── tsconfig.json             # TypeScript compiler configuration
└── vite.config.ts            # Vite bundler options & path alias (@/* -> src/*)
```

---

## 🗺️ Route Map (`App.tsx`)

| Route Path | Page Component | Purpose |
| :--- | :--- | :--- |
| `/` | `<Index />` | Main landing page with recent uploads and departmental highlights |
| `/resources` | `<Resources />` | Filterable repository of all general academic resources |
| `/notes` | `<Notes />` | Dedicated study notes repository |
| `/pyqs` | `<PYQs />` | Previous Year Question Papers archive |
| `/assignments`| `<Assignments />`| Student assignment guidelines and submissions |
| `/practice` | `<PracticeDirectory />` | Interactive coding problems (`Coddy` + `LeetCode` style) with stats header |
| `/practice/:problemId` | `<ProblemArena />` | Split-screen coding workspace with live test cases and AI mentor tab |
| `/ai-tutor` | `<AITutor />` | Dedicated AI Study Companion where students attach PDF notes or math screenshots |
| `/admin` | `<Admin />` | Secure admin dashboard for teachers/admins to upload resources to Supabase |
| `/login` | `<OTPAuth />` | User authentication entrance |

---

## 💡 Key Feature Implementations

### 1. The Interactive Coding Practice Arena (`/practice` & `/practice/:problemId`)
- **Data Source**: Loaded directly from `src/data/codingQuestions.ts` (`codingQuestions` array).
- **Gamified State (`localStorage`)**:
  - `codeStart_score`: Total Experience Points (`score`). Solving a problem grants **+50 XP**.
  - `codeStart_dailyStreak`: Consecutive daily practice count (`streak`).
  - `codeStart_lives`: Student health points (`lives`). Incorrect submissions deduct 1 life.
- **Dual-Pane Arena (`ProblemArena.tsx`)**:
  - **Left Pane (`<Tabs />`)**:
    - `Statement`: Problem description, example input/output, and reference starting code.
    - `Hint & Theory`: Guided pedagogical explanation and multiple-choice concept checks.
    - `AI Coding Mentor`: A streaming chat tab pre-prompted with the exact problem title, language, and logic constraints so students can ask for subtle hints without leaving the code editor.
  - **Right Pane (`<CodeEditor />`)**:
    - Custom textarea with `Tab` interception (inserts 4 spaces).
    - `Run Test`: Executes code against pre-defined test cases (`testCaseResults`).
    - `Submit Code`: Calls `geminiService.evaluateAnswer(question, userCode)` to analyze time/space complexity (`Big O`) and check correctness.

### 2. The AI Study Companion & Syllabus Grounding (`/ai-tutor`)
- **Service (`geminiService.ts`)**:
  - Uses `@google/genai` with model `gemini-2.5-flash`.
  - API Key is fetched in order from: `import.meta.env.VITE_GEMINI_API_KEY` -> `import.meta.env.VITE_API_KEY` -> `localStorage.getItem('gemini_api_key')`.
- **PDF Syllabus Grounding**:
  - When a user uploads a `.pdf` file (`handlePdfUpload`), it converts to base64 and injects into the Gemini chat history with instructions: *"Here are my study notes/syllabus. Please base all future answers, hints, and code practice exclusively on this material."*
- **KaTeX & Math OCR**:
  - Users can upload images (`selectedImage`) of math equations or handwritten code.
  - Responses are parsed through `remark-math` and `rehype-katex` so mathematical expressions render cleanly.
- **Direct Resource Integration (`ResourceCard.tsx`)**:
  - Every resource card has an `Ask AI` button next to `Access Document`.
  - Clicking it navigates to `/ai-tutor` with React Router navigation state (`{ state: { resourceTitle: title, subject } }`).

---

## 🗄️ Database & Storage (`Supabase`)
- **Client Configuration**: `src/integrations/supabase/client.ts`
- **Authentication**: Managed via Supabase Auth (`supabase.auth.getSession()` inside `Navbar.tsx`).
- **Storage Buckets**: Documents are stored securely inside the `'resources'` storage bucket. When previewing (`DocumentViewer.tsx`), the frontend generates a temporary signed URL (`createSignedUrl(filePath, 3600)`) valid for 1 hour.

---

## ⚡ Quick Start & Commands for Developers / AI

Whenever you start working in this folder (`C:\Users\CHANDRAKANT\Downloads\eduresources\eduresources-main`), follow these commands:

```powershell
# 1. Navigate into the main application directory
cd C:\Users\CHANDRAKANT\Downloads\eduresources\eduresources-main

# 2. Start the fast local development server (Hot Module Replacement enabled)
npm run dev
# -> Server accessible at: http://localhost:8080/ (or http://localhost:5173/)

# 3. Check for TypeScript or Build errors before committing changes
npm run build
```

---

## 📌 Guidelines for Next AI Chat Sessions
If the user asks for further features or modifications inside this repository, remember:
1. **Always use specific tools**: Use `grep_search` instead of bash commands for file search, and `view_file` / `replace_file_content` for editing.
2. **Maintain existing UI aesthetics**: Use dark-mode Slate/Cyan/Emerald classes with glassmorphic borders (`bg-slate-900/80 border-slate-800`).
3. **Preserve LMS integrity**: Never modify or remove the core Supabase authentication (`/login`), Admin document uploader (`/admin`), or signed URL document previews (`ResourceCard.tsx`).
