---
name: adapt-gemini
description: How to adapt the existing geminiService.ts by ADDING new methods for MoSPI competency assessment and MCQ generation. All existing methods are preserved untouched.
---

# Adapt Gemini Service — Add MoSPI Competency Methods

## When to Use
After running `strip-and-fork`. This adds new methods to `geminiService.ts` without modifying any existing ones.

---

## Step 1: Read the Existing Service
Read `src/services/geminiService.ts` completely. Understand these existing methods (ALL are preserved):
- `createChat()` — Creates a streaming chat with optional PDF grounding
- `sendMessageStream()` — Sends messages with comprehension modes
- `generateQuizQuestion()` — Generates structured quiz JSON
- `generateSocraticFAQ()` — Generates Q&A pairs from PDF
- `evaluateAnswer()` — Grades student answers
- `generateDeepDiveGuide()` — Creates study guides from PDF
- `generateNotebookLMPodcast()` — Creates podcast scripts

> **IMPORTANT:** Do NOT modify or rename any existing method. Only ADD new methods.

## Step 2: Add New System Instruction for StatSarthi Chat Sessions

Add a new method `createStatSarthiChat()` alongside the existing `createChat()`:

```typescript
public async createStatSarthiChat(history: Message[] = [], pdfData?: string): Promise<void> {
  // Same logic as createChat() but with StatSarthi system instruction:
  const systemInstruction = `You are StatSarthi AI, an expert in India's Official Statistical System,
  competency-based capacity building, and the iGOT Karmayogi framework. You help MoSPI officials
  identify skill gaps, recommend training, and generate assessments.

  Guidelines:
  1. Use formal, professional language appropriate for government officials.
  2. Reference MoSPI terminology: NSSTA, SQAF, FRAC, Official Statistical System.
  3. When generating MCQs, tag each question with Bloom's Taxonomy level.
  4. Support 4 competency domains with 28+ areas:
     - Statistical: Survey Design, Sampling, National Accounts, Price Statistics, Labour Statistics,
       Agricultural Statistics, Industrial Statistics, SDG Indicators, Metadata Standards, Data Quality (SQAF)
     - Technical: Python, R, SQL, Stata, SPSS, SAS, GIS, Data Visualization, AI/ML, Cloud Computing, APIs, Open Data
     - Digital Governance: Cybersecurity, Data Privacy, Digital Signatures, Government Cloud, Digital Public Infrastructure
     - Behavioural & Managerial: Leadership, Communication, Project Management, Ethics, Decision Making, Change Management
  5. When grading assessments, map scores to competency levels (1-5 scale).`;
  // ... rest of chat initialization
}
```

## Step 3: Add New Methods

### `generateDiagnosticQuestions()`
Generates diagnostic assessment questions for a given competency area.

```typescript
public async generateDiagnosticQuestions(
  competencyArea: string,
  subCompetencies: string[],
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  count: number = 5
): Promise<DiagnosticQuestion[]>
```

**Output schema (use Gemini's `responseSchema`):**
```typescript
interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];           // 4 options
  correctIndex: number;        // 0-3
  competencyArea: string;
  subCompetency: string;
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  difficulty: string;
  explanation: string;
}
```

### `generateMCQsFromDocument()`
Takes PDF content and generates MCQs from it. This is the hero feature.

```typescript
public async generateMCQsFromDocument(
  pdfData: string,
  options: {
    count: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    bloomsLevels: string[];
    competencyArea?: string;
  }
): Promise<GeneratedMCQ[]>
```

**Output schema:**
```typescript
interface GeneratedMCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  bloomsLevel: string;
  difficulty: string;
  sourceReference: string;     // Which section of the document
}
```

### `evaluateCompetency()`
Takes answers and produces a competency score.

```typescript
public async evaluateCompetency(
  questions: DiagnosticQuestion[],
  userAnswers: number[],
  competencyArea: string
): Promise<CompetencyScore>
```

**Output:**
```typescript
interface CompetencyScore {
  competencyArea: string;
  score: number;               // 0-100
  level: 1 | 2 | 3 | 4 | 5;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}
```

## Step 4: Summary of Changes

| Method | Action | Notes |
|---|---|---|
| `createChat()` | ✅ KEEP | Original CS tutor chat — untouched |
| `sendMessageStream()` | ✅ KEEP | Streaming with modes — untouched |
| `generateQuizQuestion()` | ✅ KEEP | Original quiz gen — untouched |
| `generateSocraticFAQ()` | ✅ KEEP | FAQ generation — untouched |
| `evaluateAnswer()` | ✅ KEEP | Answer grading — untouched |
| `generateDeepDiveGuide()` | ✅ KEEP | Study guide gen — untouched |
| `generateNotebookLMPodcast()` | ✅ KEEP | Podcast gen — untouched |
| `createStatSarthiChat()` | ➕ ADD | New StatSarthi-specific chat |
| `generateDiagnosticQuestions()` | ➕ ADD | Competency assessment questions |
| `generateMCQsFromDocument()` | ➕ ADD | PDF → MCQ generation |
| `evaluateCompetency()` | ➕ ADD | Competency scoring |

## Step 5: Add New Types

Create `src/types/statsarthi.ts` with all new interfaces:
- `DiagnosticQuestion`
- `GeneratedMCQ`
- `CompetencyScore`
- `CompetencyArea`
- `RoleProfile`
- `GapReport`
- `IGOTCourse`
- `LearningPathway`
- `PathwayStep`

## Step 6: Verify
Test each new method by calling it from a temporary page or browser console. Ensure Gemini returns valid JSON matching the schemas.
