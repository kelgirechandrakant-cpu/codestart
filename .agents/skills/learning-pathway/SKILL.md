---
name: learning-pathway
description: Build the personalized iGOT Karmayogi learning pathway recommender (Pillar 2 of StatSarthi). Maps competency gaps to curated iGOT courses with progress tracking.
---

# Learning Pathway — Pillar 2 (Learn)

## When to Use
After `gap-finder`. This takes the gap report and recommends iGOT courses.

---

## What This Feature Does

1. Reads the official's competency gap report
2. Cross-references gaps against a curated iGOT course catalog
3. Generates a prioritized learning pathway (weakest areas first)
4. Tracks progress as official marks courses complete
5. Deep-links to iGOT Karmayogi portal for actual course content

---

## Step 1: Course Catalogs (CRITICAL GROUNDING RULES)

**DO NOT invent fake courses or hallucinate APIs. Use the following strict guidelines:**

1. **NSSTA Courses (`src/data/nsstaCourses.ts`)**
   - This file **is already seeded** with 15 real courses from the published NSSTA Training Calendar FY 2021-22.
   - **DO NOT OVERWRITE OR HALLUCINATE** new NSSTA courses. Treat this file as read-only source of truth.
   - These are real titles, durations, and partner institutes.

2. **iGOT Courses (`src/data/igotCourses.ts`)**
   - **NO public API or course catalog exists** for iGOT Karmayogi.
   - **DO NOT invent specific iGOT course titles as if they are real.**
   - Instead, create generic placeholder courses framed as "Representative iGOT-style course" (e.g., "Illustrative Module: Survey Principles").
   - Use the **Sunbird schema** (the open-source stack iGOT runs on) for the data shape.
   - Every iGOT course MUST have `isIllustrative: true`.
   - Frame the UI as "ecosystem-ready for iGOT API integration when available".

Create `src/data/igotCourses.ts` following these rules:

```typescript
export interface IGOTCourse {
  id: string;
  title: string;
  url: string;                     // Use '#' for illustrative courses
  competencyTags: string[];        // Which competency areas this covers
  duration: string;                // "2 hours", "4 weeks"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  provider: string;                // e.g. "iGOT Karmayogi Network"
  description: string;
  karmaPoints: number;             // iGOT gamification
  isIllustrative: boolean;         // MUST BE TRUE
}

export const igotCourses: IGOTCourse[] = [
  {
    id: 'igot-illustrative-1',
    title: 'Illustrative Module: Survey Design Principles',
    url: '#',
    competencyTags: ['survey-design'],
    duration: '4 hours',
    difficulty: 'beginner',
    provider: 'iGOT Karmayogi Network',
    description: 'Representative course shaped after Sunbird schema. Demonstrates how real iGOT modules will map to this gap.',
    karmaPoints: 50,
    isIllustrative: true
  },
  // Add a few more illustrative courses covering the 4 domains
];
```

## Step 2: Build the Recommendation Engine

Create `src/services/recommendationEngine.ts`:

```typescript
import { igotCourses, type IGOTCourse } from '../data/igotCourses';
import { nsstaCourses, type NSSTACourse } from '../data/nsstaCourses';

export function generateLearningPathway(gapReport: GapReport): LearningPathway {
  // Sort gaps by size (largest gap first = highest priority)
  const sortedGaps = [...gapReport.gaps]
    .filter(g => g.gap > 0)
    .sort((a, b) => b.gap - a.gap);

  const pathway: PathwayStep[] = sortedGaps.map((gap, index) => {
    const matchingCourses = igotCourses
      .filter(c => c.competencyTags.includes(gap.competencyId))
      .sort((a, b) => {
        const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });

    return {
      priority: index + 1,
      competencyArea: gap.competencyId,
      currentLevel: gap.currentLevel,
      targetLevel: gap.requiredLevel,
      gap: gap.gap,
      recommendedCourses: matchingCourses.slice(0, 3),
      completed: false
    };
  });

  return {
    userId: gapReport.userId,
    steps: pathway,
    createdAt: new Date().toISOString()
  };
}
```

## Step 3: Create Learning Pathway Page

Create `src/pages/statsarthi/LearningPathway.tsx`:
- Overall progress bar (X/Y steps completed)
- Priority-ordered cards for each competency gap
- Each card contains:
  - Competency name + gap indicator (color coded)
  - Current level → Target level
  - Recommended iGOT courses (as `CourseCard` components)
  - "Open on iGOT →" deep link button

Create `src/components/statsarthi/CourseCard.tsx`:
- Course title, provider badge, duration, difficulty badge
- Karma Points indicator
- "Mark Complete" checkbox
- "Open on iGOT" external link button

## Step 4: Progress Tracking with Firebase

```typescript
import { db } from '@/integrations/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

async function markCourseComplete(userId: string, courseId: string) {
  const progressRef = doc(db, 'learning_progress', `${userId}_${courseId}`);
  await setDoc(progressRef, {
    userId,
    courseId,
    completed: true,
    completedAt: new Date().toISOString()
  });
}
```

## Step 5: Route (in App.tsx)
```tsx
<Route path="/pathway" element={<LearningPathway />} />
```

---

## Testing
1. Complete a diagnostic assessment (from gap-finder)
2. Navigate to learning pathway
3. Verify courses are sorted by gap priority
4. Click "Open on iGOT" — should open external link
5. Mark a course complete — verify progress bar updates
6. Verify progress persists in Firestore
