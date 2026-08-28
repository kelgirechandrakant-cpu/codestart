---
name: gap-finder
description: Build the Competency Gap Finder with diagnostic assessment and radar chart visualization (Pillar 1 of StatSarthi). Includes role selection, FRAC data model, timed quiz, and gap report dashboard.
---

# Competency Gap Finder — Pillar 1 (Diagnose)

## When to Use
After `strip-and-fork` and `adapt-gemini`. This builds the assessment → gap identification → radar chart flow.

---

## What This Feature Does

1. Official selects their role (designation + department + level)
2. System loads FRAC competency requirements for that role
3. Official takes an AI-generated diagnostic assessment (15-20 MCQs across competency areas)
4. System scores responses and maps to competency levels (1-5)
5. Gap Report Dashboard shows a radar chart: current levels vs. required levels

---

## Step 1: Create the Competency Data

Create `src/data/competencyFramework.ts` with the **4-domain framework from the official PS**:

```typescript
// src/data/competencyFramework.ts
export interface CompetencyDomain {
  id: string;
  name: 'Statistical' | 'Technical' | 'Digital Governance' | 'Behavioural & Managerial';
  icon: string;
  areas: CompetencyArea[];
}

export interface CompetencyArea {
  id: string;
  domainId: string;
  name: string;
  description: string;
  subCompetencies: string[];
}

export const competencyDomains: CompetencyDomain[] = [
  {
    id: 'statistical',
    name: 'Statistical',
    icon: 'BarChart3',
    areas: [
      { id: 'survey-design', domainId: 'statistical', name: 'Survey Design & Sampling', ... },
      { id: 'national-accounts', domainId: 'statistical', name: 'National Accounts & GDP', ... },
      { id: 'price-statistics', domainId: 'statistical', name: 'Price Statistics', ... },
      { id: 'labour-statistics', domainId: 'statistical', name: 'Labour Statistics', ... },
      // ... 9 areas total
    ]
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: 'Code',
    areas: [
      { id: 'python-r', domainId: 'technical', name: 'Python & R Programming', ... },
      // ... 8 areas total
    ]
  },
  {
    id: 'digital-governance',
    name: 'Digital Governance',
    icon: 'Shield',
    areas: [
      { id: 'cybersecurity', domainId: 'digital-governance', name: 'Cybersecurity', ... },
      // ... 5 areas total
    ]
  },
  {
    id: 'behavioural',
    name: 'Behavioural & Managerial',
    icon: 'Users',
    areas: [
      { id: 'leadership', domainId: 'behavioural', name: 'Leadership', ... },
      // ... 6 areas total
    ]
  }
];
```

```typescript
// src/data/roleProfiles.ts
export interface RoleProfile {
  id: string;
  designation: string;
  department: string;
  level: 'junior' | 'mid' | 'senior';
  requiredCompetencies: {
    competencyId: string;
    requiredLevel: 1 | 2 | 3 | 4 | 5;
  }[];
}

export const roleProfiles: RoleProfile[] = [
  {
    id: 'aso-cso',
    designation: 'Assistant Statistical Officer',
    department: 'Central Statistical Office',
    level: 'junior',
    requiredCompetencies: [
      { competencyId: 'survey-design', requiredLevel: 3 },
      { competencyId: 'data-collection', requiredLevel: 4 },
      { competencyId: 'statistical-analysis', requiredLevel: 3 },
    ]
  },
  // ... add 5-8 role profiles
];
```

## Step 2: Create Role Selection Component

Create `src/components/statsarthi/RoleSelector.tsx`:
- Designation dropdown
- Department dropdown
- Experience level radio group (Junior / Mid / Senior)
- Shows required competency levels preview when role is selected

Use shadcn/ui `Select`, `RadioGroup`, `Progress` components.

## Step 3: Create Diagnostic Assessment Page

Create `src/pages/statsarthi/DiagnosticAssessment.tsx`:

### Flow:
1. Receive role profile from navigation state or URL params
2. For each required competency area, call `geminiService.generateDiagnosticQuestions()` to get 3-4 questions
3. Display questions in a clean quiz UI with:
   - Progress bar (Question 3 of 18)
   - Timer (optional — 30 min)
   - Single question per screen with 4 radio options
   - Next/Previous navigation
4. On submit, calculate scores per competency area

### Scoring Logic:
```typescript
function calculateCompetencyLevel(
  correctAnswers: number,
  totalQuestions: number
): 1 | 2 | 3 | 4 | 5 {
  const percentage = (correctAnswers / totalQuestions) * 100;
  if (percentage >= 90) return 5;
  if (percentage >= 75) return 4;
  if (percentage >= 55) return 3;
  if (percentage >= 35) return 2;
  return 1;
}
```

## Step 4: Create Gap Report Dashboard

Create `src/pages/statsarthi/GapReport.tsx`:

### The Radar Chart (Hero Visual)
Create `src/components/statsarthi/CompetencyRadar.tsx` using Recharts:

```tsx
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

const data = competencyAreas.map(area => ({
  competency: area.name,
  required: requiredLevel,    // From role profile
  current: assessedLevel,     // From diagnostic results
}));

<RadarChart width={500} height={400} data={data}>
  <PolarGrid />
  <PolarAngleAxis dataKey="competency" />
  <PolarRadiusAxis domain={[0, 5]} />
  <Radar name="Required Level" dataKey="required" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
  <Radar name="Your Level" dataKey="current" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
  <Legend />
</RadarChart>
```

### Gap Summary Cards
Create `src/components/statsarthi/GapBreakdownTable.tsx`:
- Green card if current >= required (no gap)
- Red/amber card if current < required (gap exists)
- Each card shows: competency name, gap size, recommended action

## Step 5: Save to Firebase Firestore

```typescript
import { db } from '@/integrations/firebase/config';
import { doc, setDoc, collection } from 'firebase/firestore';

const reportRef = doc(collection(db, 'gap_reports'));
await setDoc(reportRef, {
  userId: user.uid,
  roleProfileId: selectedRole.id,
  scores: competencyScores,
  overallScore: calculateOverallScore(competencyScores),
  createdAt: new Date().toISOString()
});
```

## Step 6: Routes (in App.tsx)

These routes are added during the `strip-and-fork` phase:
```tsx
<Route path="/assess" element={<DiagnosticAssessment />} />
<Route path="/report" element={<GapReport />} />
```

---

## Testing
1. Select a role profile
2. Complete the diagnostic assessment
3. Verify radar chart displays correctly
4. Verify gap cards show meaningful recommendations
5. Verify data saves to Firestore
