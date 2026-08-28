---
name: plan-review
description: Architecture and engineering review before building new features. Locks data flow, edge cases, and component structure before coding. Use before building new pillars or making structural changes.
---

# Plan Review — Architecture Check

## When to Use
"Should we architect it this way?" Before building any new pillar or major feature.

---

## Forcing Questions

Before writing code, answer these:

### 1. Data Flow
- Where does the data come from? (Firestore? Gemini? Static file? User input?)
- Where does it go? (State? Firestore? Export?)
- What's the shape? (Define the TypeScript interface in `src/types/statsarthi.ts`)
- Who can access it? (Firebase Security Rule needed?)

### 2. Component Boundaries
- Which component owns the state?
- What props flow down?
- Which components are reusable vs. page-specific?
- Does this need a custom hook? (`useAssessment`, `useGapReport`, etc.)
- Does the new component go in `src/components/statsarthi/`?

### 3. AI Integration Points
- What prompt goes to Gemini?
- What structured output schema do we expect?
- What happens if Gemini returns garbage? (Fallback?)
- How long will this take? (Streaming needed?)

### 4. Edge Cases
- What if the user has no internet during AI generation?
- What if the PDF is too large (> 10MB)?
- What if Gemini rate-limits us?
- What if the user closes the tab mid-assessment?
- What if there are 0 gaps (perfect score)?
- What if there are 0 iGOT courses for a competency area?

### 5. User Flow
- What screen leads to this feature?
- What screen follows?
- Can the user go back?
- What data must persist between screens? (URL params? React state? Firestore?)

### 6. Dual-Mode Check
- Does this change modify any original EduResources file?
- If yes, can it be done without modifying the original? (New file in `statsarthi/` instead)
- Will commenting this out in App.tsx cleanly restore EduResources mode?

---

## Plan Document Template

```markdown
# Feature: [Name]

## What It Does
One paragraph.

## Data Model
TypeScript interfaces (in src/types/statsarthi.ts).

## Component Tree
ParentPage (src/pages/statsarthi/)
├── HeaderSection
├── MainContent (src/components/statsarthi/)
│   ├── InputForm
│   └── ResultDisplay
└── ActionButtons

## Gemini Integration
- Method: geminiService.[newMethod]()
- Output schema: [interface]
- Error handling: [fallback]

## Firebase Collections
- Collection name, document structure, Security Rules

## Edge Cases Handled
1. ...

## Estimated Time
X hours
```
