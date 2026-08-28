---
name: strip-and-fork
description: Step-by-step guide to hide unused EduResources routes and prepare the StatSarthi SIH project alongside the original code. Run this first before any other skill. Original files are preserved — not deleted.
---

# Hide & Fork — Prepare StatSarthi Alongside EduResources

## When to Use
Run this skill FIRST when starting work on the SIH26101 project. It hides unused routes, creates the StatSarthi directory structure, and sets up Firebase — all without deleting any original files.

---

## Step 1: Read Context
1. Read `SIH26101_CONTEXT.md` in the project root for full problem statement and architecture.
2. Read `PROJECT_CONTEXT.md` for the original EduResources architecture.

## Step 2: Create StatSarthi Directory Structure
Create new directories (do NOT modify existing ones):
```
mkdir src/pages/statsarthi
mkdir src/components/statsarthi
mkdir src/integrations/firebase
```

## Step 3: Comment Out Unused Routes in App.tsx
Do NOT delete any lazy imports. Comment them out with a clear label:
```tsx
// ============================================
// EDURESOURCES MODE (Post-Hackathon) — Commented Out
// ============================================
// const Notes = lazy(() => import("./pages/Notes"));
// const Assignments = lazy(() => import("./pages/Assignments"));
// const PYQs = lazy(() => import("./pages/PYQs"));
// const Resources = lazy(() => import("./pages/Resources"));
// const PracticeDirectory = lazy(() => import("./pages/PracticeDirectory"));
// const ProblemArena = lazy(() => import("./pages/ProblemArena"));
// const AITutor = lazy(() => import("./pages/AITutor"));
// const Admin = lazy(() => import("./pages/Admin"));

// ============================================
// STATSARTHI MODE (SIH 2026) — Active
// ============================================
const Landing = lazy(() => import("./pages/statsarthi/Landing"));
const DiagnosticAssessment = lazy(() => import("./pages/statsarthi/DiagnosticAssessment"));
const GapReport = lazy(() => import("./pages/statsarthi/GapReport"));
const LearningPathway = lazy(() => import("./pages/statsarthi/LearningPathway"));
const QuizGenerator = lazy(() => import("./pages/statsarthi/QuizGenerator"));
const AdminDashboard = lazy(() => import("./pages/statsarthi/AdminDashboard"));
const Login = lazy(() => import("./pages/statsarthi/Login"));
```

Similarly, comment out the Route elements for EduResources pages and add StatSarthi routes:
```tsx
// StatSarthi Routes
<Route path="/" element={<Landing />} />
<Route path="/assess" element={<DiagnosticAssessment />} />
<Route path="/report" element={<GapReport />} />
<Route path="/pathway" element={<LearningPathway />} />
<Route path="/quiz-generator" element={<QuizGenerator />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/login" element={<Login />} />
```

Also comment out the `<StudyAssistant />` component from the layout (it calls Supabase Edge Functions).

## Step 4: Update Navbar (Preserve Original)
In `Navbar.tsx`, comment out old nav links and add StatSarthi links:
- Assess (→ /assess)
- Learning Path (→ /pathway)
- Quiz Generator (→ /quiz-generator)
- Admin (→ /admin)

Change branding from "EduResources" to "StatSarthi". Keep original branding in comments.

## Step 5: Set Up Firebase
Create `src/integrations/firebase/config.ts` with Firebase initialization.
Create `src/integrations/firebase/auth.ts` with auth hooks.
Run: `npm install firebase`
Do NOT uninstall `@supabase/supabase-js` — it stays for post-hackathon.

## Step 6: Update .env (Append, Don't Replace)
Add Firebase env vars below the existing Supabase ones. Keep both.

## Step 7: Update index.html
Change `<title>` to "StatSarthi — AI Capacity Building for India's Statistical System".
Update og:title, og:description. Keep originals as HTML comments.

## Step 8: Update package.json Name
```json
{
  "name": "statsarthi",
  "description": "AI-powered capacity building platform for India's Official Statistical System (SIH26101)"
}
```

## Step 9: Verify Build
```bash
npm run build
```
Fix any import errors. The build should succeed even with commented-out routes — the original page files still exist, they're just not imported.

---

## What NOT to Touch
- `src/services/geminiService.ts` — Adapted in the `adapt-gemini` skill (add methods, don't modify existing)
- `src/pages/AITutor.tsx` — Keep as-is. Copy its PDF upload pattern into QuizGenerator.
- `src/pages/Admin.tsx` — Keep as-is. Build new `statsarthi/AdminDashboard.tsx`.
- `src/components/ui/` — Keep all shadcn/ui components
- `src/integrations/supabase/` — Keep untouched for post-hackathon
- `src/hooks/useHierarchyData.ts`, `useChatPersistence.ts` — Keep untouched
- `src/data/codingQuestions.ts` — Keep untouched
- `src/types/coding.ts` — Keep untouched
