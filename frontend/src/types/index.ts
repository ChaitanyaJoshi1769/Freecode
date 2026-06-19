export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum Language {
  PYTHON = 'PYTHON',
  JAVASCRIPT = 'JAVASCRIPT',
  TYPESCRIPT = 'TYPESCRIPT',
  JAVA = 'JAVA',
  CPP = 'CPP',
  CSHARP = 'CSHARP',
  GOLANG = 'GOLANG',
  RUST = 'RUST',
  RUBY = 'RUBY'
}

export enum SubmissionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  ACCEPTED = 'ACCEPTED',
  WRONG_ANSWER = 'WRONG_ANSWER',
  TIME_LIMIT_EXCEEDED = 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  COMPILATION_ERROR = 'COMPILATION_ERROR',
  RUNTIME_ERROR = 'RUNTIME_ERROR'
}

export enum ProblemStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  SOLVED = 'SOLVED',
  ATTEMPTED = 'ATTEMPTED'
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  topics: string[];
  companies: string[];
  acceptanceRate: number;
  totalSubmissions: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProblemDetail extends Problem {
  examples: string;
  constraints: string;
  hints: string[];
  isPublished: boolean;
  isPremium: boolean;
}

export interface TestCase {
  id: string;
  input: string;
  output: string;
  isPublic: boolean;
  explanation?: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: Language;
  status: SubmissionStatus;
  error?: string;
  stdout?: string;
  stderr?: string;
  executionTime?: number;
  memoryUsed?: number;
  testResults: any[];
  passedTests: number;
  totalTests: number;
  createdAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  problemId: string;
  status: ProblemStatus;
  attempts: number;
  lastSubmissionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalSolved: number;
  totalAttempts: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  acceptanceRate: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  problemId: string;
  problem: {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    acceptanceRate: number;
  };
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
