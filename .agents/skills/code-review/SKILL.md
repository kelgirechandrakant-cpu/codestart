---
name: code-review
description: Pre-commit code review for StatSarthi. Checks React patterns, Firebase safety, Gemini prompt quality, TypeScript strictness, and component structure. Use when asked to review code or before merging.
---

# Code Review — StatSarthi

## When to Use
Before committing. When asked "review this code" or "is this good?"

---

## Review Checklist

### 1. React Patterns
- [ ] No direct DOM manipulation — use React state
- [ ] `useEffect` has correct dependency arrays (no missing deps, no infinite loops)
- [ ] Components are not re-rendering unnecessarily (check expensive computations)
- [ ] Lazy loading used for route-level pages (`lazy(() => import(...))`)
- [ ] Error boundaries wrap AI-dependent components
- [ ] Forms use controlled components with proper validation

### 2. TypeScript Strictness
- [ ] No `any` types for competency data, gap reports, or quiz structures
- [ ] Interfaces defined in `src/types/statsarthi.ts` for all new data models
- [ ] Original types in `src/types/coding.ts` are NOT modified
- [ ] Function return types explicitly declared

### 3. Firebase Safety
- [ ] Firebase config in `src/integrations/firebase/config.ts` — uses env vars
- [ ] Auth checks via `useFirebaseAuth()` hook before protected operations
- [ ] Firestore Security Rules restrict user data access (users read/write own data)
- [ ] Firebase Storage rules restrict upload access
- [ ] No Firebase Admin SDK in client code
- [ ] Original Supabase code in `src/integrations/supabase/` is NOT modified

### 4. Gemini AI Quality
- [ ] Prompts are specific to MoSPI domain (not generic)
- [ ] Structured output uses `responseMimeType: "application/json"` with `responseSchema`
- [ ] Error handling for Gemini API failures (rate limits, malformed responses)
- [ ] JSON parse wrapped in try/catch with fallback
- [ ] Temperature set appropriately (0.3-0.5 for assessments, 0.7 for explanations)
- [ ] New methods added alongside existing ones (not replacing)

### 5. UI/UX Consistency
- [ ] Uses government theme colors (primary blue, not orange/rust)
- [ ] Cards use `bg-white border shadow-sm` pattern
- [ ] Text is readable (minimum 14px body, proper contrast)
- [ ] Mobile responsive (tested at 375px)
- [ ] Loading states shown during AI operations
- [ ] Empty states are informative, not blank

### 6. Dual-Mode Architecture
- [ ] New StatSarthi pages are in `src/pages/statsarthi/`
- [ ] New StatSarthi components are in `src/components/statsarthi/`
- [ ] No original EduResources files were modified unnecessarily
- [ ] Original routes are commented out in App.tsx (not deleted)
- [ ] Original nav links are commented out in Navbar.tsx (not deleted)

---

## Review Format

For each issue found, report:
```
**[SEVERITY]** File:Line — Description
Fix: What to change
```

Severity levels:
- 🔴 **BLOCKER** — Breaks functionality or security
- 🟡 **WARNING** — Works but problematic (tech debt, bad pattern)
- 🔵 **SUGGESTION** — Style, readability, or minor improvement
