export type Language = 'C' | 'Python' | 'JavaScript' | 'Java' | 'C++';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Topic = 'Variables' | 'Conditions' | 'Loops' | 'Functions' | 'Basic Syntax' | 'Data Types' | 'Data Structures' | 'Algorithms';
export type QuestionType = 'Output Prediction' | 'Find Syntax Error' | 'Fill Missing Code' | 'Full Coding Challenge';

export interface Question {
  id: number;
  language: Language;
  difficulty: Difficulty;
  topic: Topic;
  type: QuestionType;
  question: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  example: string;
  testCases?: { input: string; expectedOutput: string }[];
  startingCode?: string;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  imageData?: string; // base64 string for Gemini API
  imagePreview?: string; // Object URL for previewing in chat
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: number;
}

export enum ExamTopic {
  C_PROGRAMMING = 'C Programming',
  PYTHON = 'Python',
  JAVA = 'Java',
  DATA_STRUCTURES = 'Data Structures',
  ALGORITHMS = 'Algorithms',
  SYSTEM_DESIGN = 'System Design'
}

export interface QuizQuestion {
  id: string;
  title: string;
  problemStatement: string;
  exampleInputOutput: string;
  startingCode?: string;
}

export interface QuizResult {
  isCorrect: boolean;
  feedback: string;
  explanation: string;
}
