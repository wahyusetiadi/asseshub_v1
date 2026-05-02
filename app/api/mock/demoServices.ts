import { getStoredUser, type SessionUser } from "@/helpers/auth";
import type { CandidateApi } from "@/types";
import type { Position } from "@/types/api/position.api";
import type { TestBase } from "@/types/testTypes";
import { ApiError } from "../utils/errorHandler";
import { demoDbUtils, getDemoDb, setDemoDb, type DemoDb, type DemoExam } from "./demoDb";
import { demoOk } from "./demoResponse";

const requireUser = (): SessionUser => {
  const user = getStoredUser();
  if (!user) throw new ApiError("Unauthorized", 401);
  return user;
};

const findExamOrThrow = (db: DemoDb, examId: string): DemoExam => {
  const exam = db.exams.find((e) => e.id === examId);
  if (!exam) throw new ApiError("Exam not found", 404);
  return exam;
};

const resolvePositionName = (db: DemoDb, positionId?: string): string => {
  if (!positionId) return "";
  return db.positions.find((p) => p.id === positionId)?.name ?? positionId;
};

const normalizeExamForList = (exam: DemoExam) => ({
  id: exam.id,
  title: exam.title,
  description: exam.description,
  durationMinutes: exam.durationMinutes,
  categoryId: exam.categoryId,
  category: exam.category,
  startAt: exam.startAt,
  endAt: exam.endAt,
  totalQuestions: exam.questions.length,
  _count: { questions: exam.questions.length },
  createdAt: exam.createdAt,
  updatedAt: exam.updatedAt,
});

const computeScore = (exam: DemoExam, answers: Record<string, string>) => {
  const total = exam.questions.length || 0;
  let correct = 0;
  for (const q of exam.questions) {
    const selected = answers[q.id];
    if (!selected) continue;
    const option = q.options.find((o) => o.id === selected);
    if (option?.isCorrect) correct += 1;
  }
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { score, correctCount: correct, totalQuestions: total };
};

export const demoExamService = {
  getAllExams: async () => {
    const db = getDemoDb();
    return demoOk(db.exams.map(normalizeExamForList));
  },

  getExamDetail: async (id: string) => {
    const db = getDemoDb();
    const exam = findExamOrThrow(db, id);
    return demoOk(normalizeExamForList(exam));
  },

  createExam: async (data: TestBase) => {
    const db = getDemoDb();
    const now = new Date().toISOString();
    const id = demoDbUtils.genId("exam");
    const categoryId = data.categoryId ?? "";
    const category = resolvePositionName(db, categoryId) || "General";

    const nextExam: DemoExam = {
      id,
      title: data.title,
      description: data.description,
      durationMinutes: data.durationMinutes,
      categoryId,
      category,
      startAt: data.startAt,
      endAt: data.endAt,
      createdAt: now,
      updatedAt: now,
      questions: [],
    };

    const nextDb = { ...db, exams: [nextExam, ...db.exams] };
    setDemoDb(nextDb);

    return demoOk({ id });
  },

  updateExam: async (id: string, data: TestBase) => {
    const db = getDemoDb();
    const exam = findExamOrThrow(db, id);
    const now = new Date().toISOString();
    const categoryId = data.categoryId ?? exam.categoryId;
    const category = resolvePositionName(db, categoryId) || exam.category;

    const updated: DemoExam = {
      ...exam,
      title: data.title,
      description: data.description,
      startAt: data.startAt,
      endAt: data.endAt,
      durationMinutes: data.durationMinutes,
      categoryId,
      category,
      updatedAt: now,
    };

    setDemoDb({
      ...db,
      exams: db.exams.map((e) => (e.id === id ? updated : e)),
    });

    return demoOk(normalizeExamForList(updated));
  },

  deleteExam: async (id: string) => {
    const db = getDemoDb();
    setDemoDb({
      ...db,
      exams: db.exams.filter((e) => e.id !== id),
      progresses: db.progresses.filter((p) => p.examId !== id),
      invitations: db.invitations.filter((i) => i.examId !== id),
    });
    return demoOk({ id });
  },

  getQuestion: async (examId: string) => {
    const db = getDemoDb();
    const exam = findExamOrThrow(db, examId);

    return demoOk({
      id: exam.id,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      questions: exam.questions.map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options.map((o) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.isCorrect,
        })),
      })),
    });
  },

  createQuestion: async (examId: string, text: string) => {
    const db = getDemoDb();
    const exam = findExamOrThrow(db, examId);
    const now = new Date().toISOString();
    const questionId = demoDbUtils.genId("q");

    const updatedExam: DemoExam = {
      ...exam,
      updatedAt: now,
      questions: [
        ...exam.questions,
        { id: questionId, text, options: [] },
      ],
    };

    setDemoDb({
      ...db,
      exams: db.exams.map((e) => (e.id === examId ? updatedExam : e)),
    });

    return demoOk({ id: questionId });
  },

  updateQuestion: async (questionId: string, text: string) => {
    const db = getDemoDb();
    let found = false;
    const nextExams = db.exams.map((exam) => {
      const idx = exam.questions.findIndex((q) => q.id === questionId);
      if (idx === -1) return exam;
      found = true;
      const nextQuestions = exam.questions.slice();
      nextQuestions[idx] = { ...nextQuestions[idx], text };
      return { ...exam, questions: nextQuestions, updatedAt: new Date().toISOString() };
    });

    if (!found) throw new ApiError("Question not found", 404);
    setDemoDb({ ...db, exams: nextExams });
    return demoOk({ id: questionId });
  },

  createOptions: async (
    questionId: string,
    data: { text: string; isCorrect: boolean }
  ) => {
    const db = getDemoDb();
    const optionId = demoDbUtils.genId("opt");
    let found = false;

    const nextExams = db.exams.map((exam) => {
      const idx = exam.questions.findIndex((q) => q.id === questionId);
      if (idx === -1) return exam;
      found = true;
      const nextQuestions = exam.questions.slice();
      const q = nextQuestions[idx];
      nextQuestions[idx] = {
        ...q,
        options: [...q.options, { id: optionId, text: data.text, isCorrect: data.isCorrect }],
      };
      return { ...exam, questions: nextQuestions, updatedAt: new Date().toISOString() };
    });

    if (!found) throw new ApiError("Question not found", 404);
    setDemoDb({ ...db, exams: nextExams });
    return demoOk({ id: optionId });
  },

  updateOption: async (
    optionId: string,
    data: { text: string; isCorrect?: boolean }
  ) => {
    const db = getDemoDb();
    let found = false;

    const nextExams = db.exams.map((exam) => {
      const nextQuestions = exam.questions.map((q) => {
        const optIdx = q.options.findIndex((o) => o.id === optionId);
        if (optIdx === -1) return q;
        found = true;
        const nextOptions = q.options.slice();
        nextOptions[optIdx] = {
          ...nextOptions[optIdx],
          text: data.text ?? nextOptions[optIdx].text,
          isCorrect:
            typeof data.isCorrect === "boolean"
              ? data.isCorrect
              : nextOptions[optIdx].isCorrect,
        };
        return { ...q, options: nextOptions };
      });
      if (!found) return exam;
      return { ...exam, questions: nextQuestions, updatedAt: new Date().toISOString() };
    });

    if (!found) throw new ApiError("Option not found", 404);
    setDemoDb({ ...db, exams: nextExams });
    return demoOk({ id: optionId });
  },

  deleteQuestion: async (questionId: string) => {
    const db = getDemoDb();
    let found = false;
    const nextExams = db.exams.map((exam) => {
      if (!exam.questions.some((q) => q.id === questionId)) return exam;
      found = true;
      return {
        ...exam,
        questions: exam.questions.filter((q) => q.id !== questionId),
        updatedAt: new Date().toISOString(),
      };
    });

    if (!found) throw new ApiError("Question not found", 404);
    setDemoDb({ ...db, exams: nextExams });
    return demoOk({ id: questionId });
  },

  resultsExam: async () => {
    const db = getDemoDb();
    const results = db.progresses
      .filter((p) => p.status === "COMPLETED" && p.submittedAt)
      .map((p) => {
        const exam = db.exams.find((e) => e.id === p.examId);
        const candidate = db.candidates.find((c) => c.id === p.userId);
        const summary = exam ? computeScore(exam, p.answers) : { score: 0, correctCount: 0, totalQuestions: 0 };
        return {
          id: p.id,
          name: candidate?.name ?? p.userId,
          exam: exam?.title ?? p.examId,
          startedAt: p.startedAt,
          submittedAt: p.submittedAt ?? "",
          score: summary.score,
          correctCount: summary.correctCount,
          totalQuestions: summary.totalQuestions,
          status: "SUBMITTED",
        };
      });

    return demoOk(results);
  },
};

export const demoAdminService = {
  getAllPositions: async () => {
    const db = getDemoDb();
    return demoOk(db.positions);
  },

  generatePositions: async (name: string) => {
    const db = getDemoDb();
    const position: Position = { id: demoDbUtils.genId("pos"), name };
    setDemoDb({ ...db, positions: [position, ...db.positions] });
    return demoOk(position);
  },

  getAllCandicates: async () => {
    const db = getDemoDb();
    return demoOk(db.candidates);
  },

  getAccountById: async (id: string) => {
    const db = getDemoDb();
    const candidate = db.candidates.find((c) => c.id === id);
    if (!candidate) throw new ApiError("Candidate not found", 404);
    return demoOk(candidate);
  },

  generateAccount: async (name: string, email: string, positionId?: string) => {
    const db = getDemoDb();
    const username = email.split("@")[0] || `user${db.candidates.length + 1}`;
    const password = `demo${Math.floor(1000 + Math.random() * 9000)}`;
    const position = resolvePositionName(db, positionId) || "Frontend";

    const candidate: CandidateApi = {
      id: demoDbUtils.genId("cand"),
      username,
      password,
      name,
      email,
      position,
    };

    setDemoDb({ ...db, candidates: [candidate, ...db.candidates] });
    return demoOk(candidate);
  },

  updatedAccount: async (
    id: string,
    name?: string,
    email?: string,
    positionIdOrName?: string
  ) => {
    const db = getDemoDb();
    const nextCandidates = db.candidates.map((c) => {
      if (c.id !== id) return c;
      const position =
        positionIdOrName && positionIdOrName.startsWith("pos_")
          ? resolvePositionName(db, positionIdOrName)
          : positionIdOrName ?? c.position;
      return {
        ...c,
        name: name ?? c.name,
        email: email ?? c.email,
        position,
      };
    });

    if (!nextCandidates.some((c) => c.id === id)) {
      throw new ApiError("Candidate not found", 404);
    }

    setDemoDb({ ...db, candidates: nextCandidates });
    return demoOk({ id });
  },

  deleteAccount: async (id: string) => {
    const db = getDemoDb();
    setDemoDb({
      ...db,
      candidates: db.candidates.filter((c) => c.id !== id),
      progresses: db.progresses.filter((p) => p.userId !== id),
      invitations: db.invitations.map((inv) => ({
        ...inv,
        userIds: inv.userIds.filter((u) => u !== id),
      })),
    });
    return demoOk({ id });
  },

  sendInvitation: async (data: { examId: string; userIds: string[] }) => {
    const db = getDemoDb();
    findExamOrThrow(db, data.examId);
    const now = new Date().toISOString();
    const invitation = {
      id: demoDbUtils.genId("inv"),
      examId: data.examId,
      userIds: data.userIds,
      sentAt: now,
    };
    setDemoDb({ ...db, invitations: [invitation, ...db.invitations] });
    return demoOk(invitation);
  },
};

export const demoUserService = {
  getQuestion: async (examId: string) => {
    const db = getDemoDb();
    const exam = findExamOrThrow(db, examId);
    const questions = exam.questions.map((q) => ({
      id: q.id,
      text: q.text,
      examId: exam.id,
      options: q.options.map((o) => ({
        id: o.id,
        text: o.text,
        questionId: q.id,
      })),
    }));

    return demoOk({ questions });
  },

  getQuestionAnswers: async (examId: string) => {
    const user = requireUser();
    const db = getDemoDb();
    const progress = db.progresses.find(
      (p) => p.examId === examId && p.userId === user.id
    );
    const answers = progress
      ? Object.entries(progress.answers).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        }))
      : [];

    return demoOk(answers);
  },

  checkStatus: async (examId: string) => {
    const user = requireUser();
    const db = getDemoDb();
    const exam = findExamOrThrow(db, examId);
    const progress = db.progresses.find(
      (p) => p.examId === examId && p.userId === user.id
    );

    if (!progress || progress.status !== "ONGOING") {
      const ms = exam.durationMinutes * 60_000;
      return {
        data: {
        user_id: user.id,
        remaining_duration_ms: ms,
        remaining_duration: ms,
        is_exam_ongoing: false,
        },
        status: 200,
        message: "OK",
      };
    }

    const startedAtMs = new Date(progress.startedAt).getTime();
    const elapsed = Date.now() - startedAtMs;
    const remainingMs = Math.max(0, exam.durationMinutes * 60_000 - elapsed);
    const isOngoing = remainingMs > 0;

    // auto-finish jika waktu habis
    if (!isOngoing) {
      const submittedAt = new Date().toISOString();
      const nextProgresses = db.progresses.map((p) =>
        p.id === progress.id
          ? { ...p, status: "COMPLETED" as const, submittedAt }
          : p
      );
      setDemoDb({ ...db, progresses: nextProgresses });
    }

    return {
      data: {
        user_id: user.id,
        remaining_duration_ms: remainingMs,
        remaining_duration: remainingMs,
        is_exam_ongoing: isOngoing,
      },
      status: 200,
      message: "OK",
    };
  },

  startExam: async (examId: string) => {
    const user = requireUser();
    const db = getDemoDb();
    const exam = findExamOrThrow(db, examId);

    const existing = db.progresses.find(
      (p) => p.examId === examId && p.userId === user.id
    );

    if (existing?.status === "COMPLETED") {
      throw new ApiError("Anda sudah menyelesaikan ujian ini.", 409);
    }

    if (existing?.status === "ONGOING") {
      return demoOk(existing);
    }

    const now = new Date().toISOString();
    const progress = {
      id: demoDbUtils.genId("prog"),
      userId: user.id,
      testId: examId,
      examId,
      startedAt: now,
      submittedAt: null as string | null,
      score: 0,
      correctCount: 0,
      totalQuestions: exam.questions.length,
      status: "ONGOING" as const,
      createdAt: now,
      updatedAt: now,
      answers: {} as Record<string, string>,
    };

    setDemoDb({ ...db, progresses: [progress, ...db.progresses] });
    return demoOk(progress);
  },

  finishExam: async (examId: string) => {
    const user = requireUser();
    const db = getDemoDb();
    const exam = findExamOrThrow(db, examId);
    const progress = db.progresses.find(
      (p) => p.examId === examId && p.userId === user.id
    );
    if (!progress) throw new ApiError("Exam belum dimulai.", 400);

    const submittedAt = new Date().toISOString();
    const summary = computeScore(exam, progress.answers);

    const nextProgresses = db.progresses.map((p) =>
      p.id === progress.id
        ? {
            ...p,
            submittedAt,
            status: "COMPLETED" as const,
            score: summary.score,
            correctCount: summary.correctCount,
            totalQuestions: summary.totalQuestions,
            updatedAt: submittedAt,
          }
        : p
    );
    setDemoDb({ ...db, progresses: nextProgresses });

    return demoOk({
      ...progress,
      submittedAt,
      status: "COMPLETED",
      score: summary.score,
      correctCount: summary.correctCount,
      totalQuestions: summary.totalQuestions,
    });
  },

  answerQuestion: async (
    examId: string,
    data: { questionId: string; optionId: string }
  ) => {
    const user = requireUser();
    const db = getDemoDb();
    findExamOrThrow(db, examId);
    const progress = db.progresses.find(
      (p) => p.examId === examId && p.userId === user.id
    );
    if (!progress || progress.status !== "ONGOING") {
      throw new ApiError("Exam belum dimulai.", 400);
    }

    const nextProgresses = db.progresses.map((p) =>
      p.id === progress.id
        ? { ...p, answers: { ...p.answers, [data.questionId]: data.optionId } }
        : p
    );
    setDemoDb({ ...db, progresses: nextProgresses });
    return demoOk({ ok: true });
  },
};
