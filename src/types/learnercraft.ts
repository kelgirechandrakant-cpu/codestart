// LearnerCraft Types — Core data models for the learning OS

// ============================================================
// User Profile
// ============================================================

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  college?: string;
  year?: string; // "1st Year", "2nd Year", etc.
  goal?: string; // "GATE prep", "Learn DSA", "Get a job"
  preferredLanguage?: 'C' | 'Python' | 'JavaScript';
  createdAt: number;
  updatedAt: number;
}

// ============================================================
// Mock Exam
// ============================================================

export type ExamDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';

export type ExamSubject =
  | 'C Programming'
  | 'Python'
  | 'Data Structures'
  | 'Algorithms'
  | 'Operating Systems'
  | 'Database Management'
  | 'Computer Networks'
  | 'Object Oriented Programming'
  | 'Custom (from PDF)';

export interface ExamConfig {
  subject: ExamSubject;
  numQuestions: number; // 5, 10, 15, 20, 30
  difficulty: ExamDifficulty;
  timeLimitMinutes: number; // 0 = no limit
  pdfContext?: string; // base64 PDF data for custom exams
}

export interface MockExamQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
  difficulty: ExamDifficulty;
}

export interface ExamAttempt {
  id: string;
  config: ExamConfig;
  questions: MockExamQuestion[];
  userAnswers: (number | null)[]; // index of selected option, null = unanswered
  score: number;
  totalQuestions: number;
  timeTakenSeconds: number;
  topicBreakdown: TopicScore[];
  completedAt: number;
}

export interface TopicScore {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

// ============================================================
// Study Plan
// ============================================================

export interface StudyPlanConfig {
  goal: string;
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  hoursPerDay: number;
  deadlineWeeks: number;
  previousAttempts?: string;
  focusAreas?: string[];
}

export interface DailyTask {
  day: string; // "Monday", "Tuesday", etc.
  tasks: string[];
  estimatedHours: number;
}

export interface StudyPlanWeek {
  weekNumber: number;
  title: string;
  objective: string;
  dailyTasks: DailyTask[];
  milestone: string;
}

export interface StudyPlan {
  id: string;
  config: StudyPlanConfig;
  title: string;
  overview: string;
  weeks: StudyPlanWeek[];
  tips: string[];
  createdAt: number;
}

// ============================================================
// Progress & Analytics
// ============================================================

export interface ProgressData {
  totalXP: number;
  problemsSolved: number;
  streakDays: number;
  longestStreak: number;
  examsTaken: number;
  averageExamScore: number;
  studyPlansCreated: number;
  totalStudyHours: number;
  topicAccuracy: TopicScore[];
  weeklyActivity: WeeklyActivity[];
}

export interface WeeklyActivity {
  week: string; // "2026-W35"
  problemsSolved: number;
  examsTaken: number;
  studyHours: number;
  xpEarned: number;
}

export interface ActivityLogEntry {
  type: 'problem_solved' | 'exam_completed' | 'study_plan_created' | 'ai_chat' | 'resource_viewed';
  title: string;
  xpEarned: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}
