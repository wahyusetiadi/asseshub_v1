import type { CandidateApi } from "@/types";
import type { Position } from "@/types/api/position.api";

export type DemoOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type DemoQuestion = {
  id: string;
  text: string;
  options: DemoOption[];
};

export type DemoExam = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  categoryId: string;
  category: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  questions: DemoQuestion[];
};

export type DemoExamProgress = {
  id: string;
  userId: string;
  examId: string;
  testId?: string;
  startedAt: string;
  submittedAt: string | null;
  status: "ONGOING" | "COMPLETED";
  answers: Record<string, string>;
  score?: number;
  correctCount?: number;
  totalQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type DemoInvitation = {
  id: string;
  examId: string;
  userIds: string[];
  sentAt: string;
};

export type DemoAdminUser = {
  id: string;
  username: string;
  password: string;
  role: "ADMIN";
  name: string;
  email: string;
};

export type DemoDb = {
  version: 1;
  positions: Position[];
  candidates: CandidateApi[];
  admins: DemoAdminUser[];
  exams: DemoExam[];
  progresses: DemoExamProgress[];
  invitations: DemoInvitation[];
};

const STORAGE_KEY = "asseshub_demo_db_v1";

const isClient = (): boolean => typeof window !== "undefined";

const genId = (prefix: string): string => {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${random}`;
};

const toIso = (d: Date): string => d.toISOString();

const seedDb = (): DemoDb => {
  const now = new Date();
  const startAt = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const endAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const positions: Position[] = [
    { id: "pos_frontend", name: "Frontend" },
    { id: "pos_backend", name: "Backend" },
    { id: "pos_uiux", name: "UI/UX" },
  ];

  const candidates: CandidateApi[] = [
    {
      id: "cand_demo_1",
      username: "demo.user",
      password: "demo123",
      name: "Demo User",
      email: "demo.user@asseshub.local",
      position: "Frontend",
    },
    {
      id: "cand_demo_2",
      username: "backend.user",
      password: "demo123",
      name: "Backend Demo",
      email: "backend.user@asseshub.local",
      position: "Backend",
    },
  ];

  const admins: DemoAdminUser[] = [
    {
      id: "admin_demo_1",
      username: "arisbara",
      password: "arisbara",
      role: "ADMIN",
      name: "Demo Admin",
      email: "admin@asseshub.local",
    },
  ];

  const exams: DemoExam[] = [
    {
      id: "exam_frontend_1",
      title: "Frontend Assessment (Demo)",
      description: "Demo test untuk posisi Frontend.",
      durationMinutes: 30,
      categoryId: "pos_frontend",
      category: "Frontend",
      startAt: toIso(startAt),
      endAt: toIso(endAt),
      createdAt: toIso(now),
      updatedAt: toIso(now),
      questions: [
        {
          id: "q_fe_1",
          text: "Apa fungsi utama React?",
          options: [
            { id: "q_fe_1_a", text: "Library UI", isCorrect: true },
            { id: "q_fe_1_b", text: "Database", isCorrect: false },
            { id: "q_fe_1_c", text: "Web server", isCorrect: false },
            { id: "q_fe_1_d", text: "OS", isCorrect: false },
          ],
        },
        {
          id: "q_fe_2",
          text: "Apa itu 'state' di React?",
          options: [
            { id: "q_fe_2_a", text: "Data internal komponen", isCorrect: true },
            { id: "q_fe_2_b", text: "URL endpoint", isCorrect: false },
            { id: "q_fe_2_c", text: "File config", isCorrect: false },
            { id: "q_fe_2_d", text: "DB schema", isCorrect: false },
          ],
        },
        {
          id: "q_fe_3",
          text: "Tailwind CSS adalah ...",
          options: [
            { id: "q_fe_3_a", text: "Utility-first CSS framework", isCorrect: true },
            { id: "q_fe_3_b", text: "Testing framework", isCorrect: false },
            { id: "q_fe_3_c", text: "Backend framework", isCorrect: false },
            { id: "q_fe_3_d", text: "Database", isCorrect: false },
          ],
        },
      ],
    },
    {
      id: "exam_backend_1",
      title: "Backend Assessment (Demo)",
      description: "Demo test untuk posisi Backend.",
      durationMinutes: 30,
      categoryId: "pos_backend",
      category: "Backend",
      startAt: toIso(startAt),
      endAt: toIso(endAt),
      createdAt: toIso(now),
      updatedAt: toIso(now),
      questions: [
        {
          id: "q_be_1",
          text: "HTTP status 401 artinya ...",
          options: [
            { id: "q_be_1_a", text: "Unauthorized", isCorrect: true },
            { id: "q_be_1_b", text: "Not Found", isCorrect: false },
            { id: "q_be_1_c", text: "OK", isCorrect: false },
            { id: "q_be_1_d", text: "Bad Gateway", isCorrect: false },
          ],
        },
        {
          id: "q_be_2",
          text: "REST API umumnya menggunakan ...",
          options: [
            { id: "q_be_2_a", text: "HTTP method (GET/POST/PUT/DELETE)", isCorrect: true },
            { id: "q_be_2_b", text: "SMTP", isCorrect: false },
            { id: "q_be_2_c", text: "FTP", isCorrect: false },
            { id: "q_be_2_d", text: "POP3", isCorrect: false },
          ],
        },
      ],
    },
  ];

  const progresses: DemoExamProgress[] = [];
  const invitations: DemoInvitation[] = [];

  return {
    version: 1,
    positions,
    candidates,
    admins,
    exams,
    progresses,
    invitations,
  };
};

export const getDemoDb = (): DemoDb => {
  if (!isClient()) return seedDb();

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const seeded = seedDb();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const parsed = JSON.parse(raw) as DemoDb;
    if (!parsed || parsed.version !== 1) {
      const seeded = seedDb();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return parsed;
  } catch {
    const seeded = seedDb();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  }
};

export const setDemoDb = (next: DemoDb): void => {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const resetDemoDb = (): DemoDb => {
  const seeded = seedDb();
  if (isClient()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  }
  return seeded;
};

export const demoDbUtils = {
  genId,
};
