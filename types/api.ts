// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

// Candidate Types
export interface Candidate {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  username: string;
  password?: string;
  status: "pending" | "sent" | "opened" | "completed";
  createdAt: string;
}

export interface CreateCandidateRequest {
  fullName: string;
  email: string;
  phone?: string;
  position?: string;
  password?: string;
}

export interface UpdateCandidateRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  position?: string;
  status?: "pending" | "sent" | "opened" | "completed";
}

export interface ImportCandidatesRequest {
  file: File;
}

// Test Types
export interface Test {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions: number;
  passingScore: number;
  status: "active" | "inactive" | "draft";
  createdAt: string;
}

export interface CreateTestRequest {
  title: string;
  description: string;
  duration: number;
  questions: number;
  passingScore: number;
}

// Invitation Types
export interface SendInvitationRequest {
  candidateIds: number[];
  testId: number;
  scheduleDate?: string;
  scheduleTime?: string;
}

export interface Invitation {
  candidateId: number;
  testId: number;
  sentAt: string;
  scheduledFor: string | null;
  status: "sent" | "pending" | "expired";
}

// Result Types
export interface TestResult {
  id: number;
  candidateId: number;
  candidateName: string;
  testId: number;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: number;
  status: "completed" | "in_progress" | "not_started";
  completedAt: string;
}

export interface GetResultsParams {
  testId?: number;
  candidateId?: number;
}

export interface GetCandidatesParams {
  search?: string;
  page?: number;
  limit?: number;
}
