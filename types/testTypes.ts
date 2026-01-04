export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

export interface TestData {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
}
