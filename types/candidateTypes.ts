// types/candidateTypes.ts
export interface Candidate {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  position: string;
  status?: "pending" | "sent" | "opened" | "completed"; // Optional field
}

export interface Position {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Test {
  id: string;
  title: string;
  duration: number;
  questions: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SendInvitationRequest {
  examId: string;
  userIds: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}