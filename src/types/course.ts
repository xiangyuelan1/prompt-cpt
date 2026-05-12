// 课程相关类型定义

export interface Course {
  id: string;
  title: string;
  description: string;
  category: '基础课程' | '进阶课程' | '专家课程';
  difficulty: '入门' | '进阶' | '高级';
  coverImage: string;
  chapters: Chapter[];
  students: number;
  duration: string; // e.g., "12小时"
  price: number;
  isFree: boolean;
  isFeatured: boolean;
  rating: number;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  content: string;
  videoUrl?: string;
  duration: string; // e.g., "15分钟"
  resources: Resource[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'link' | 'image';
  url: string;
}

// 学习进度类型
export interface LearningProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLessonId: string;
  totalLessons: number;
  completedAt: Date | null;
}

// 测验类型
export interface Quiz {
  id: string;
  chapterId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string | string[]>;
  score: number;
  completedAt: Date;
}

// 证书类型
export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: Date;
}
