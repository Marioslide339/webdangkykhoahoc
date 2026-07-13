export interface Activity {
  title: string;
  type: string; // 'video' | 'reading' | 'quiz' | 'exercise' | string;
  description: string;
}

export interface Lesson {
  title: string;
  description: string;
  duration: string;
  activities?: Activity[];
}

export interface QuizItem {
  id: string;
  question: string;
  type: 'multiple-choice' | 'matching' | 'fill-in-the-blank';
  options?: string[]; // for multiple choice
  pairs?: { key: string; value: string }[]; // for matching
  answer: string;
  helperText: string;
}

export interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
  quizSuggestions?: QuizItem[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  duration: string;
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  rating: number;
  studentsCount: number;
  imageUrl: string;
  modules: Module[];
}

export interface ApiEndpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

export interface DBField {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  refTable?: string;
}

export interface DBTable {
  name: string;
  description: string;
  fields: DBField[];
  x: number; // visual coordinates for diagram
  y: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

