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
  const END_TIME_KEY = `exam_end_time_${testId}`;

  /* =======================
     STATE
  ======================= */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFetchingAnswers, setIsFetchingAnswers] = useState(false); // ✅ New

  const [savingQuestions, setSavingQuestions] = useState<Set<string>>(
    new Set(),
  );

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // ✅ Answers state
  const [answers, setAnswers] = useState<Record<string, string>>({});

  /* =======================
     REFS
  ======================= */
  const hasAutoSubmitted = useRef(false);
  const isExamFinished = useRef(false);
  const hasFetchedAnswers = useRef(false); // ✅ Prevent double fetch

  /* =======================
     DATA & TIMER
  ======================= */
  const { exam, questions, isLoading, endTime } = useExamData(testId);
  const { timeRemaining, isTimeUp, formatTime } = useExamTimer(endTime);

  /* =======================
     EFFECTS
  ======================= */

  // ✅ Fetch saved answers from server
  // ✅ Fetch saved answers from server
  useEffect(() => {
    const fetchSavedAnswers = async () => {
      if (
        hasFetchedAnswers.current ||
        isFetchingAnswers ||
        isLoading ||
        questions.length === 0
      ) {
        return;
      }

      hasFetchedAnswers.current = true;
      setIsFetchingAnswers(true);

      try {
        console.log("📥 Fetching saved answers from server...");
        const response = await userService.getQuestionAnswers(testId);

        // Parse response based on your API structure
        const savedAnswers = response?.data?.data || response?.data || [];

        // ✅ Transform to { questionId: optionId } format
        const answersMap: Record<string, string> = {};

        if (Array.isArray(savedAnswers)) {
          savedAnswers.forEach((answer: any) => {
            // ✅ FIX: Use camelCase (questionId, optionId) instead of snake_case
            if (answer.questionId && answer.optionId) {
              answersMap[answer.questionId] = answer.optionId;
            }
          });
        }

        setAnswers(answersMap);
        console.log(
          `✅ Loaded ${Object.keys(answersMap).length} saved answers`,
        );
        console.log("📋 Answers map:", answersMap);
      } catch (error: any) {
        console.error("❌ Failed to fetch saved answers:", error);
        // Don't show error to user, just start fresh
      } finally {
        setIsFetchingAnswers(false);
      }
    };

    fetchSavedAnswers();
  }, [testId, isLoading, questions.length, isFetchingAnswers]);

  // Init exam
  useEffect(() => {
    if (
      !isLoading &&
      exam &&
      questions.length > 0 &&
      endTime &&
      !isFetchingAnswers
    ) {
      setIsInitialized(true);
      console.log("✅ Exam initialized");
    }
  }, [isLoading, exam, questions.length, endTime, isFetchingAnswers]);

  // Auto submit when time is up
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

  const handleAnswerSelect = useCallback(
    async (questionId: string, optionId: string) => {
      // Optimistic update
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

      // Mark as saving
      setSavingQuestions((prev) => new Set(prev).add(questionId));

      try {
        await userService.answerQuestion(testId, { questionId, optionId });
        console.log(`✅ Answer saved: Q${questionId} = ${optionId}`);
      } catch (error: any) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Gagal menyimpan jawaban";

        setToast({ message: `⚠️ ${msg}`, type: "warning" });

        // Rollback on failure
        setAnswers((prev) => {
          const rollback = { ...prev };
          delete rollback[questionId];
          return rollback;
        });
      } finally {
        setSavingQuestions((prev) => {
          const next = new Set(prev);
          next.delete(questionId);
          return next;
        });
      }
    },
    [testId],
  );

  const redirectToDashboard = useCallback(() => {
    localStorage.removeItem(END_TIME_KEY);
    router.push("/dashboard");
  }, [router, END_TIME_KEY]);

  const handleSubmit = useCallback(
    async (isManual: boolean) => {
      if (isSubmitting || !isInitialized) return;

      setIsSubmitting(true);
      isExamFinished.current = true;

      try {
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
    [isSubmitting, isInitialized, redirectToDashboard, testId],
  );

  /* =======================
     UI STATES
  ======================= */

  if (isLoading || isFetchingAnswers) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-[3px] border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            {isFetchingAnswers
              ? "Memuat jawaban tersimpan..."
              : "Memuat ujian..."}
          </p>
        </div>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
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

      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
          <div className="min-w-0">
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentQuestionIndex}
              selectedAnswer={answers[currentQuestion.id]}
              isSaving={savingQuestions.has(currentQuestion.id)}
              onAnswerSelect={handleAnswerSelect}
              onPrevious={() => setCurrentQuestionIndex((p) => p - 1)}
              onNext={() => setCurrentQuestionIndex((p) => p + 1)}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              onSubmit={() => setShowConfirmSubmit(true)}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="min-w-0">
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
