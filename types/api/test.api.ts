export interface TestApi {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  startAt: string;
  endAt: string;
  totalQuestions: number;
}

export interface TestDetail extends TestApi {
  createdAt: string;
  updatedAt: string;
}
