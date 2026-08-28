# AGENTS.md — StatSarthi (SIH26101)

> Project-scoped rules for AI agents working in this codebase.

---

## 1. Project Overview

**StatSarthi** is built on top of EduResources Pro (preserved intact), transformed into an AI-powered capacity building platform for MoSPI (Ministry of Statistics & Programme Implementation) for **SIH 2026** (Problem Statement SIH26101).

**Dual-Mode Architecture:** Original EduResources pages are hidden from routes (not deleted). All StatSarthi code lives in `src/pages/statsarthi/` and `src/components/statsarthi/`. After SIH, restore original routes by uncommenting in `App.tsx`.

What it does:
- Identifies competency gaps in MoSPI officials via AI diagnostic assessments
- Recommends personalized iGOT Karmayogi training courses based on gaps
- Generates quizzes and MCQs from uploaded learning materials using Gemini AI

Stack: TypeScript, React 18, Vite 5, TailwindCSS 3, shadcn/ui, **Firebase** (Auth + Firestore + Storage), Google Gemini 2.5 Flash (`@google/genai`), Recharts.

---

## 2. Architecture

### Dual-Mode File Structure

```
src/
├── pages/
│   ├── [Original EduResources pages]  ← PRESERVED, hidden from routes
│   └── statsarthi/                    ← ALL new StatSarthi pages
│       ├── Landing.tsx
│       ├── DiagnosticAssessment.tsx
│       ├── GapReport.tsx
│       ├── LearningPathway.tsx
│       ├── QuizGenerator.tsx
│       ├── AdminDashboard.tsx
│       └── Login.tsx
├── components/
│   ├── [Original components]          ← PRESERVED
│   └── statsarthi/                    ← ALL new StatSarthi components
│       ├── CompetencyRadar.tsx
│       ├── RoleSelector.tsx
│       ├── CourseCard.tsx
│       └── QuizCard.tsx
├── integrations/
│   ├── supabase/                      ← PRESERVED (unused during SIH)
│   └── firebase/                      ← NEW Firebase config
│       ├── config.ts
│       └── auth.ts
├── data/
│   ├── codingQuestions.ts             ← PRESERVED
│   ├── competencyFramework.ts         ← NEW (4 domains, 28+ areas)
│   ├── roleProfiles.ts               ← NEW (FRAC levels: Aware/Apply/Advise/Expert/Ustad)
│   ├── igotCourses.ts                ← NEW (⚠️ ILLUSTRATIVE — no real iGOT catalog exists)
│   └── nsstaCourses.ts               ← NEW (✅ REAL — from NSSTA FY2021-22 training calendar)
└── types/
    ├── coding.ts                      ← PRESERVED
    └── statsarthi.ts                  ← NEW (includes FRACLevel type)
```

### The 3 Pillars

Every feature maps to one of these pillars:

| Pillar | Name | Core Files |
|---|---|---|
| **1** | Competency Gap Finder | `statsarthi/DiagnosticAssessment.tsx`, `statsarthi/GapReport.tsx`, competency data |
| **2** | iGOT Pathway Recommender | `statsarthi/LearningPathway.tsx`, iGOT course catalog |
| **3** | AI Quiz/MCQ Generator | `statsarthi/QuizGenerator.tsx`, `geminiService.ts` |

### Existing Code to Reuse

| What | File | Adapt How |
|---|---|---|
| Gemini AI service | `src/services/geminiService.ts` | Add new methods, keep all existing |
| PDF upload pattern | `AITutor.tsx` | Copy pattern into `QuizGenerator.tsx` (don't modify original) |
| Quiz generation | `geminiService.generateQuizQuestion()` | Keep, add `generateCompetencyMCQs()` alongside |
| Answer evaluation | `geminiService.evaluateAnswer()` | Keep, add `evaluateCompetency()` alongside |
| UI components | `src/components/ui/` | Keep all shadcn/ui primitives |

### Code to HIDE (Not Delete)

- Comment out routes in `App.tsx` for: `/practice`, `/pyqs`, `/notes`, `/assignments`, `/resources`
- Comment out nav links in `Navbar.tsx` for above routes
- Remove `<StudyAssistant />` from `App.tsx` layout (it calls Supabase Edge Functions)

---

## 3. Data Grounding Rules (CRITICAL — Prevents Hallucination)

### iGOT Karmayogi Courses
- **NO public API or course catalog exists** — the platform is entirely behind official login
- **Do NOT invent specific iGOT course titles as if they are real**
- Use **illustrative courses** shaped after Sunbird's content schema (the open-source stack iGOT runs on)
- Mark each course with `isIllustrative: true`
- In UI, show as "Representative iGOT-style course" or similar
- Frame integration as "ecosystem-ready for iGOT API integration when available"

### NSSTA TPAC Training Programmes
- **15 real courses already seeded** in `src/data/nsstaCourses.ts`
- Source: NSSTA Training Calendar FY 2021-22 PDF from `mospi.gov.in`
- Real titles, real durations, real delivery partners (IIT Kanpur, IIM Ahmedabad, C.R. Rao AIMSC, etc.)
- `url` fields point to the actual calendar PDF — NOT guessed nssta.gov.in deep links
- nssta.gov.in blocks scraping entirely (robots disallowed)

### FRAC Competency Levels
- Use FRAC's actual 5-level labels (iGOT uses these exact labels):
  - Level 1: **Aware** | Level 2: **Apply** | Level 3: **Advise** | Level 4: **Expert** | Level 5: **Ustad**
- Display these labels in UI alongside numeric levels
- `FRACLevel` type and `FRAC_LEVEL_LABELS` constant defined in `src/types/statsarthi.ts`

### SQAF
- Real: MoSPI's Statistical Quality Assessment Framework, built on UN's NQAF 2019
- Verified source: `mospi.gov.in/sites/default/files/Statistical-Quality-Assessment-Framework-Guidelines.pdf`

---

## 4. Code Quality Rules

### Gemini API Key
- Key comes from `VITE_GEMINI_API_KEY` env var or localStorage fallback
- For SIH demo, localStorage fallback is acceptable (judges enter their own key)
- Never hardcode keys in source

### Firebase
- Config in `src/integrations/firebase/config.ts`
- Auth via `useFirebaseAuth()` hook
- Firestore for gap reports, quiz results, learning progress
- Storage for uploaded training materials
- Security Rules must restrict user data access

### Supabase (Preserved)
- Original Supabase code stays in `src/integrations/supabase/` — DO NOT modify
- Original hooks (`useHierarchyData`, `useChatPersistence`) stay — DO NOT modify
- These are unused during SIH but needed for post-hackathon EduResources restoration

### UI Theme
- Government professional theme: clean whites, blues (#1a56db), saffron accent
- Original orange/rust theme preserved as CSS comments in `index.css`
- Keep shadcn/ui primitives, update HSL variables only

### TypeScript
- Strict types for all data models in `src/types/statsarthi.ts`
- No `any` for competency/assessment data structures
- Original `src/types/coding.ts` preserved untouched

---

## 5. Voice

- Government-appropriate language. No slang, no emoji overload.
- Professional but not robotic. Clear, direct sentences.
- Use MoSPI terminology: "competency gaps", "capacity building", "Official Statistical System"
- Reference iGOT Karmayogi, FRAC framework, NSSTA by name — judges notice domain knowledge.

---

## 6. Key Context Files

```
SIH26101_CONTEXT.md               → Full problem statement, solution architecture, data models
PROJECT_CONTEXT.md                → Original EduResources architecture (preserved reference)
src/services/geminiService.ts     → AI engine (add new methods, keep existing)
src/pages/AITutor.tsx             → PDF upload pattern reference (copy, don't modify)
src/integrations/firebase/        → New Firebase config (SIH mode)
src/integrations/supabase/        → Original Supabase config (preserved for post-SIH)
```

---

## 7. Restoring EduResources After SIH

1. `App.tsx`: Uncomment EduResources routes, comment out StatSarthi routes
2. `index.css`: Swap commented color blocks (restore orange theme)
3. `Navbar.tsx`: Uncomment original nav links, comment out StatSarthi links

---

## 8. Strictly No Assumptions (User Global Rule)
- **NEVER ASSUME OR GUESS:** Do not guess version numbers, system states, or configuration variables based on external docs if the code is currently functioning.
- **VERIFY FIRST:** Trust the working code over outdated READMEs. Always verify the actual state (e.g., via \cat\ or \git log\) before making sweeping changes.
- **ASK IF NEEDED:** If there is any ambiguity, underspecified requirement, or missing context, **ASK** the user for clarification rather than making assumptions.
