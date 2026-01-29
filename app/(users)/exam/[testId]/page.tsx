"use client";

import { useState, use, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import userService from "@/app/api/services/userService";
import { useExamData } from "@/hooks/useExamData";
import { useExamTimer } from "@/hooks/useExamTimer";
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionCard from "@/components/exam/QuestionCard";
import ExamSidebar from "@/components/exam/ExamSidebae";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ExamExecutionPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const resolvedParams = use(params);
  const testId = resolvedParams.testId;
  const router = useRouter();

  /* =======================
     CONSTANTS
  ======================= */
  const ANSWERS_STORAGE_KEY = `exam_answers_${testId}`;
  const END_TIME_KEY = `exam_end_time_${testId}`;

  /* =======================
     STATE
  ======================= */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(ANSWERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  /* =======================
     REFS
  ======================= */
  const hasAutoSubmitted = useRef(false);
  const isExamFinished = useRef(false);

  /* =======================
     DATA & TIMER
  ======================= */
  const { exam, questions, isLoading, endTime } = useExamData(testId);
  const { timeRemaining, isTimeUp, formatTime } = useExamTimer(endTime);

  /* =======================
     EFFECTS
  ======================= */

  // Init exam
  useEffect(() => {
    if (!isLoading && exam && questions.length > 0 && endTime) {
      setIsInitialized(true);
      console.log("✅ Exam initialized");
    }
  }, [isLoading, exam, questions.length, endTime]);

  // Auto submit when time is up (NO MODAL)
  useEffect(() => {
    if (isTimeUp && isInitialized && !hasAutoSubmitted.current) {
      console.log("⏰ Time is up → auto submit");
      hasAutoSubmitted.current = true;
      handleSubmit(false);
    }
  }, [isTimeUp, isInitialized]);

  /* =======================
     HANDLERS
  ======================= */

  const saveAnswerToStorage = useCallback(
    (updated: Record<string, string>) => {
      localStorage.setItem(ANSWERS_STORAGE_KEY, JSON.stringify(updated));
    },
    [ANSWERS_STORAGE_KEY],
  );

  const handleAnswerSelect = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => {
        const updated = { ...prev, [questionId]: optionId };
        saveAnswerToStorage(updated);
        return updated;
      });
    },
    [saveAnswerToStorage],
  );

  const redirectToDashboard = useCallback(() => {
    localStorage.removeItem(ANSWERS_STORAGE_KEY);
    localStorage.removeItem(END_TIME_KEY);
    router.push("/dashboard");
  }, [router, ANSWERS_STORAGE_KEY, END_TIME_KEY]);

  const submitAllAnswers = useCallback(async () => {
    const entries = Object.entries(answers);
    if (entries.length === 0) return true;

    const results = await Promise.allSettled(
      entries.map(([questionId, optionId]) =>
        userService.answerQuestion(testId, { questionId, optionId }),
      ),
    );

    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      setToast({
        message: `⚠️ ${failed.length} jawaban gagal dikirim`,
        type: "warning",
      });
    }

    return true;
  }, [answers, testId]);

  const handleSubmit = useCallback(
    async (isManual: boolean) => {
      if (isSubmitting || !isInitialized) return;

      setIsSubmitting(true);
      isExamFinished.current = true;

      try {
        const canProceed = await submitAllAnswers();
        if (!canProceed) {
          setIsSubmitting(false);
          isExamFinished.current = false;
          return;
        }

        await userService.finishExam(testId);

        setToast({
          message: "✅ Ujian berhasil diselesaikan",
          type: "success",
        });

        setTimeout(() => {
          redirectToDashboard();
        }, 1500);
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Gagal mengirim ujian";

        setToast({
          message: `❌ ${msg}`,
          type: "error",
        });

        setIsSubmitting(false);
        isExamFinished.current = false;
      }
    },
    [
      isSubmitting,
      isInitialized,
      submitAllAnswers,
      redirectToDashboard,
      testId,
    ],
  );

  /* =======================
     UI STATES
  ======================= */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Kembali
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const unansweredCount = questions.length - Object.keys(answers).length;

  /* =======================
     RENDER
  ======================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Submit Modal */}
      <ConfirmModal
        open={showConfirmSubmit}
        timeRemaining={timeRemaining}
        unansweredCount={unansweredCount}
        totalQuestions={questions.length}
        loading={isSubmitting}
        onCancel={() => setShowConfirmSubmit(false)}
        onConfirm={() => {
          setShowConfirmSubmit(false);
          handleSubmit(true);
        }}
      />

      <ExamHeader
        exam={exam}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
        progress={progress}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswerSelect={handleAnswerSelect}
              onPrevious={() => setCurrentQuestionIndex((p) => p - 1)}
              onNext={() => setCurrentQuestionIndex((p) => p + 1)}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              onSubmit={() => setShowConfirmSubmit(true)}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="lg:col-span-1">
            <ExamSidebar
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              timeRemaining={timeRemaining}
              onQuestionSelect={setCurrentQuestionIndex}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
