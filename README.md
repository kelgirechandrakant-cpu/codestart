# LearnerCraft 🚀

![LearnerCraft Banner](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop)

**LearnerCraft** is an AI-powered personalized learning platform. It replaces generic study resources with an interactive, adaptive ecosystem that acts as your personal tutor, examiner, and study planner. 

Built with a frictionless **"Try First, Sign Up Later"** philosophy, users can jump straight into learning, earn XP, and optionally create an account later to sync their progress to the cloud.

---

## ✨ Core Features

*   **🤖 AI Study Mentor:** Upload your syllabus or PDF notes, and get a context-aware AI tutor (powered by Gemini 2.5 Flash) to answer questions, explain concepts, and quiz you.
*   **📝 Dynamic Mock Exams:** Generate timed, graded multiple-choice exams for any subject. Features instant feedback and a detailed topic-accuracy radar chart.
*   **📅 AI Study Planner:** Tell the AI your goal, current level, and deadline. It generates a personalized day-by-day learning schedule.
*   **💻 Practice Arena:** A gamified coding practice environment with 65+ curated problems across C, Python, and JavaScript. Earn XP and maintain learning streaks.
*   **🔄 Seamless Cloud Sync:** Start learning immediately as a guest. When you finally sign up via Google or Email, your local XP, streak, and progress are securely ported to the cloud.

---

## 🛠️ Tech Stack

*   **Frontend:** React 18, TypeScript, Vite
*   **Styling & UI:** TailwindCSS, shadcn/ui, Recharts, Lucide Icons
*   **Backend & Database:** Firebase (Authentication & Firestore)
*   **AI Engine:** Google Gemini (`@google/genai` SDK)
*   **Deployment:** Vercel (Frontend) + Firebase (Backend)

---

## 🚀 Local Development Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/kelgirechandrakant-cpu/codestart.git
cd codestart
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys in the `.env` file:
*   **Firebase:** Create a project at [Firebase Console](https://console.firebase.google.com/) and paste your web config keys.
*   **Gemini:** Get an API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Start the development server
```bash
npm run dev
```
The app will be running at `http://localhost:5173`.

---

## 🔒 Security & Privacy
*   **No Hardcoded Keys:** All sensitive API keys are injected via environment variables.
*   **Firestore Rules:** Strict security rules guarantee that users can only read and write their own encrypted profile and progress data.
*   **No Vendor Lock-in:** Designed following Jamstack principles, separating the React frontend from the Backend-as-a-Service.

---

*Designed and engineered with strict anti-slop, premium UI/UX guidelines.*
