---
name: quiz-generator
description: Build the AI Quiz/MCQ Generator from uploaded learning materials (Pillar 3 of StatSarthi). This is the hero feature for SIH judges. Copies the AITutor PDF upload pattern without modifying the original.
---

# Quiz Generator — Pillar 3 (Assess)

## When to Use
After running `strip-and-fork` and `adapt-gemini`. This builds the most impressive demo feature: upload a PDF → AI generates MCQs.

---

## What This Feature Does

1. Training coordinator uploads a PDF (e.g., "Survey Methodology Guidelines 2025.pdf")
2. System extracts text via Gemini's PDF grounding (same pattern as AITutor.tsx)
3. AI generates MCQs at multiple Bloom's Taxonomy levels
4. Questions are displayed in an editable UI
5. Coordinator can approve, edit, delete questions
6. Export to PDF/CSV or assign as an assessment
7. Track who took the quiz and their scores

---

## Step 1: Create the Page

Create `src/pages/statsarthi/QuizGenerator.tsx` (do NOT modify original AITutor.tsx).

### UI Layout
```
┌─────────────────────────────────────────────────┐
│  📄 Upload Learning Material                     │
│  [Drop PDF here or click to upload]              │
│                                                  │
│  Settings:                                       │
│  Number of Questions: [10 ▼]                     │
│  Difficulty: [Mixed ▼]                           │
│  Bloom's Levels: [✓ Remember] [✓ Understand]     │
│                  [✓ Apply] [✓ Analyze]           │
│  Competency Area: [Survey Design ▼] (optional)   │
│                                                  │
│  [🚀 Generate MCQs]                              │
├─────────────────────────────────────────────────┤
│  Generated Questions (20)          [Export PDF]  │
│                                                  │
│  Q1. What is stratified sampling?    [Edit][Del] │
│  ○ A) Random selection from strata               │
│  ○ B) Cluster-based selection        ← Correct   │
│  ○ C) Systematic sampling                        │
│  ○ D) Convenience sampling                       │
│  Bloom's: Remember | Source: Page 12, Section 3  │
└─────────────────────────────────────────────────┘
```

## Step 2: Copy the PDF Upload Pattern

Copy the PDF upload logic from `AITutor.tsx` (do NOT modify original):
- File input accepts `.pdf`
- Convert to base64 using `FileReader.readAsDataURL()`
- Store in state as `uploadedPdfData`

Extract into a reusable hook:
```typescript
// src/hooks/usePdfUpload.ts
export function usePdfUpload() {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPdfData(e.target?.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return { pdfData, fileName, handleUpload, clearPdf: () => setPdfData(null) };
}
```

## Step 3: Call the Gemini Method

Use `geminiService.generateMCQsFromDocument()` (created in `adapt-gemini` skill):

```typescript
const questions = await geminiService.generateMCQsFromDocument(pdfData, {
  count: questionCount,
  difficulty: selectedDifficulty,
  bloomsLevels: selectedBloomsLevels,
  competencyArea: selectedCompetency
});
```

## Step 4: Build the Question Editor

Create `src/components/statsarthi/QuizCard.tsx`:
- Display question text with inline editing
- Radio options with correct answer highlight
- Bloom's taxonomy badge + difficulty badge
- Edit/Delete action buttons

Use shadcn/ui `Card`, `RadioGroup`, `Input`, `Button`, `Badge` components.

## Step 5: Export Functionality

### PDF Export
Use `window.print()` with a print-friendly layout.

### CSV Export
```typescript
const csvContent = questions.map(q =>
  `"${q.question}","${q.options.join('","')}","${q.options[q.correctIndex]}","${q.bloomsLevel}"`
).join('\n');
```

## Step 6: Save to Firebase Firestore

```typescript
import { db } from '@/integrations/firebase/config';
import { doc, setDoc, collection } from 'firebase/firestore';

const quizRef = doc(collection(db, 'quizzes'));
await setDoc(quizRef, {
  title: quizTitle,
  sourceDocument: fileName,
  competencyArea: selectedCompetency,
  questions: generatedQuestions,
  createdBy: user.uid,
  createdAt: new Date().toISOString()
});
```

## Step 7: Route (in App.tsx)
```tsx
<Route path="/quiz-generator" element={<QuizGenerator />} />
```

---

## Testing
1. Upload a real MoSPI training PDF (or any statistics textbook PDF)
2. Generate 10 MCQs
3. Verify questions are relevant to the uploaded content
4. Edit a question, delete one, export to CSV
5. Verify Bloom's taxonomy tags make sense
6. Verify data saves to Firestore
