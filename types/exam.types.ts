export interface Options {
  id: string;
  text: string;
  questionId: string;
}

export interface Question {
  id: string;
  text: string;
  examId: string;
  options: Options[];
}

export interface ExamData {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startAt: string;
  endAt: string;
  category?: string;
  totalQuestions?: number;
  _count?: {
    questions: number;
  };
}

export interface UserProgress {
  user_id: string;
  remaining_duration: number; // dalam detik
  is_exam_ongoing: boolean;
}

export interface CheckStatusResponse {
  status: string;
  data: UserProgress;
}

export interface ExamProgress {
  id: string;
  userId: string;
  testId: string;
  startedAt: string;
  submittedAt: string | null;
  score: number;
  correctCount: number;
  totalQuestions: number;
  status: "ONGOING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

export interface StartExamResponse {
  status: string;
  data: ExamProgress;
}

export interface ApiError {
  status?: number;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}
