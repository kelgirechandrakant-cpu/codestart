# LearnerCraft - Your AI Learning OS

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E.svg)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_2.5_Flash-blue.svg)](https://deepmind.google/technologies/gemini/)

> *Your AI study team. Not a chatbot -- a learning OS.*

## Overview

LearnerCraft is an AI-powered learning operating system that gives every student and professional a personal team of AI specialists -- a tutor, examiner, mentor, and study planner -- all working together.

### Core Features

1. **AI Study Companion** -- Upload syllabus PDFs, get AI-powered explanations, podcast scripts, deep-dive study guides, and Socratic FAQs (4 comprehension modes including Feynman, Step-by-Step, and Exam Precision).
2. **Interactive Coding Arena** -- 65+ C and Python problems with gamified XP, lives, daily streaks, and an embedded AI coding mentor.
3. **Study Resources Hub** -- Browse, preview, and download notes, PYQs, assignments, and syllabus documents.
4. **Multi-Provider AI** -- Smart routing across Gemini, Groq, Cerebras, and Mistral free tiers for zero-cost AI.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite 5, Tailwind CSS, shadcn/ui
- **AI Engine**: Google Gemini 2.5 Flash + multi-provider fallback
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Math**: KaTeX rendering via rehype-katex
- **Charts**: Recharts for progress visualization

## Getting Started

1. **Install dependencies:**
   ```
   npm install
   ```

2. **Configure environment:**
   Create a `.env` file with your Supabase and Gemini API keys.

3. **Start development server:**
   ```
   npm run dev
   ```
   Open http://localhost:8080

## License

MIT

---
*Built by students, for learners everywhere.*
