// export interface Question {
//   id: number;
//   text: string;
//   options: string[];
//   correct: number;
// }

export interface Question {
  id: string;
  text: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface TestBase {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  categoryId?: string;
  category?: string;
}

export interface Test extends TestBase {
  id: string;
  totalQuestions?: number;
  _count?: { questions: number };
  createdAt: string;
  updatedAt: string;
}

export interface TestWithQuestions
  extends Pick<Test, "id" | "title" | "durationMinutes"> {
  questions: Array<{
    id: string;
    text: string;
    options: QuestionOption[];
  }>;
}

export type TestPayload = Partial<TestBase>;

export interface CreateTestReponse {
  data?: {
    data?: {
      id: string;
    };
    id?: string;
  };
}
