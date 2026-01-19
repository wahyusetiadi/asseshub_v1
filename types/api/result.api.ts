type StatusResult = "SUBMITTED" | null;

export interface ResultApi {
  id: string;
  userId: string;
  testId: string;
  startedAt: string;
  submittedAt: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  status: StatusResult;
  createdAt: string;
  updatedAt: string;
}
