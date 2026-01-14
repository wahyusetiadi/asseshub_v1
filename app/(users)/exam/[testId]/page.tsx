"use client";
import { useState, use, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import userService from "@/app/api/services/userService";
import { useExamData } from "@/hooks/useExamData";
import { useExamTimer } from "@/hooks/useExamTimer";
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionCard from "@/components/exam/QuestionCard";
import ExamSidebar from "@/components/exam/ExamSidebae";
import { useExamProtection } from "@/hooks/useExamProtection";
import { useExamSync } from "@/hooks/useExamSync";

const ENABLE_EXAM_PROTECTION = false;

export default function ExamExecutionPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const resolvedParams = use(params);
  const testId = resolvedParams.testId;
  const router = useRouter();

  // Constants
  const ANSWERS_STORAGE_KEY = `exam_answers_${testId}`;

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};

    try {
      const savedAnswers = localStorage.getItem(ANSWERS_STORAGE_KEY);
      if (savedAnswers) {
        const parsedAnswers = JSON.parse(savedAnswers);
        console.log("📦 Loaded answers from localStorage:", parsedAnswers);
        return parsedAnswers;
      }
    } catch (error) {
      console.error("Error parsing saved answers:", error);
      localStorage.removeItem(ANSWERS_STORAGE_KEY);
    }
    return {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Refs
  const hasAutoSubmitted = useRef(false);
  const isExamFinished = useRef(false);
  const hasCheckedInitialStatus = useRef(false);

  // Custom hooks
  const {
    exam,
    questions,
    isLoading,
    timeRemaining: initialTimeRemaining,
    setTimeRemaining: setInitialTimeRemaining,
  } = useExamData(testId);

  const { timeRemaining, formatTime } = useExamTimer(initialTimeRemaining);

  // Memoized functions
  const saveAnswerToStorage = useCallback(
    (updatedAnswers: Record<string, string>) => {
      try {
        localStorage.setItem(
          ANSWERS_STORAGE_KEY,
          JSON.stringify(updatedAnswers)
        );
        console.log("💾 Saved answer to localStorage");
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },
    [ANSWERS_STORAGE_KEY]
  );

  const redirectToDashboard = useCallback(() => {
    localStorage.removeItem(ANSWERS_STORAGE_KEY);
    router.push("/dashboard");

    // Fallback redirect
    setTimeout(() => {
      if (window.location.pathname !== "/dashboard") {
        console.log("⚠️ Router.push failed, using window.location");
        window.location.href = "/dashboard";
      }
    }, 1000);
  }, [ANSWERS_STORAGE_KEY, router]);

  const submitAllAnswers = useCallback(async () => {
    const answersArray = Object.entries(answers);

    if (answersArray.length === 0) {
      console.log("⚠️ No answers to submit");
      return true;
    }

    console.log(`📤 Submitting ${answersArray.length} answers to backend...`);

    const results = await Promise.allSettled(
      answersArray.map(([questionId, optionId]) =>
        userService.answerQuestion(testId, { questionId, optionId })
      )
    );

    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failCount = results.filter((r) => r.status === "rejected").length;

    console.log(
      `📊 Submit summary: ${successCount} success, ${failCount} failed`
    );

    if (failCount > 0) {
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(
            `❌ Failed to submit Q${answersArray[index][0]}:`,
            result.reason
          );
        }
      });

      return confirm(
        `⚠️ ${failCount} dari ${answersArray.length} jawaban gagal dikirim. Tetap lanjut submit ujian?`
      );
    }

    return true;
  }, [answers, testId]);

  const handleSubmit = useCallback(
    async (isManual: boolean = false) => {
      // Guard clauses
      if (isSubmitting) {
        console.log("⚠️ Already submitting, skipping...");
        return;
      }

      if (!isInitialized) {
        console.warn("⚠️ Prevented submit: Exam not initialized yet");
        return;
      }

      if (!isManual && hasAutoSubmitted.current) {
        console.log("⚠️ Already auto-submitted, skipping...");
        return;
      }

      if (!isManual && timeRemaining > 5) {
        console.warn(
          "⚠️ Prevented auto submit, time remaining:",
          timeRemaining
        );
        return;
      }

      // Manual submit confirmation
      if (isManual && timeRemaining > 0) {
        const unansweredCount = questions.length - Object.keys(answers).length;
        const message =
          unansweredCount > 0
            ? `Masih ada ${unansweredCount} soal yang belum dijawab. Apakah Anda yakin ingin submit?`
            : "Apakah Anda yakin ingin submit test?";

        if (!confirm(message)) return;
      }

      // Mark as submitted
      if (!isManual) hasAutoSubmitted.current = true;
      isExamFinished.current = true;
      setIsSubmitting(true);

      try {
        console.log("🚀 Step 1: Submitting answers...");
        const canProceed = await submitAllAnswers();

        if (!canProceed) {
          isExamFinished.current = false;
          if (!isManual) hasAutoSubmitted.current = false;
          setIsSubmitting(false);
          return;
        }

        console.log("🚀 Step 2: Finishing exam...");
        await userService.finishExam(testId);

        console.log("🚀 Step 3: Cleaning up and redirecting...");
        alert("✅ Ujian berhasil diselesaikan!");
        redirectToDashboard();
      } catch (error) {
        console.error("Error submitting exam:", error);
        isExamFinished.current = false;
        if (!isManual) hasAutoSubmitted.current = false;

        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Gagal mengirim jawaban";

        alert(`❌ ${errorMessage}`);
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      isInitialized,
      timeRemaining,
      questions.length,
      answers,
      testId,
      submitAllAnswers,
      redirectToDashboard,
    ]
  );

  const handleAnswerSelect = useCallback(
    (questionId: string, optionId: string) => {
      setAnswers((prev) => {
        const updatedAnswers = { ...prev, [questionId]: optionId };
        saveAnswerToStorage(updatedAnswers);
        console.log(`✍️ Answer selected: Q${questionId} -> ${optionId}`);
        return updatedAnswers;
      });
    },
    [saveAnswerToStorage]
  );

  // Exam protection hooks (conditional)
  if (ENABLE_EXAM_PROTECTION) {
    useExamProtection(isExamFinished, () => handleSubmit(false));

    useExamSync(
      testId,
      isInitialized,
      isExamFinished,
      (seconds) => setInitialTimeRemaining(seconds),
      () => {
        if (!hasAutoSubmitted.current) {
          handleSubmit(false);
        }
      }
    );
  }

  // Initialize exam
  useEffect(() => {
    if (
      !isLoading &&
      exam &&
      questions.length > 0 &&
      initialTimeRemaining > 0
    ) {
      const initTimer = setTimeout(() => {
        setIsInitialized(true);
        console.log("✅ Exam initialized");
      }, 2000);

      return () => clearTimeout(initTimer);
    }
  }, [isLoading, exam, questions.length, initialTimeRemaining]);

  // Check initial exam status
  useEffect(() => {
    if (
      hasCheckedInitialStatus.current ||
      isLoading ||
      initialTimeRemaining === null ||
      initialTimeRemaining === undefined
    ) {
      return;
    }

    const checkExamStatus = async () => {
      try {
        console.log("🔍 Running initial exam status check...");

        if (
          hasCheckedInitialStatus.current ||
          isLoading ||
          !exam ||
          questions.length === 0 ||
          initialTimeRemaining === null ||
          initialTimeRemaining === undefined ||
          initialTimeRemaining <= 0
        ) {
          return;
        }

        const statusResponse = await userService.checkStatus(testId);
        const statusData = statusResponse?.data?.data || statusResponse?.data;
        const { is_exam_ongoing, remaining_duration } = statusData || {};

        const remainingInSeconds = Math.floor((remaining_duration || 0) / 1000);
        console.log("📊 Initial status:", {
          is_exam_ongoing,
          remaining_duration_sec: remainingInSeconds,
        });

        hasCheckedInitialStatus.current = true;

        if (
          remainingInSeconds <= 0 &&
          initialTimeRemaining <= 0 &&
          hasCheckedInitialStatus.current
        ) {
          console.log("⚠️ Exam time is up");
          isExamFinished.current = true;
          hasAutoSubmitted.current = true;

          alert("⏰ Ujian ini sudah selesai atau waktu telah habis.");
          redirectToDashboard();
          return;
        }

        if (remainingInSeconds > 0) {
          setInitialTimeRemaining(remainingInSeconds);
        }
      } catch (error) {
        console.error("Error checking exam status:", error);
      }
    };

    const checkTimer = setTimeout(checkExamStatus, 1000);
    return () => clearTimeout(checkTimer);
  }, [
    testId,
    isLoading,
    initialTimeRemaining,
    exam,
    questions.length,
    setInitialTimeRemaining,
    redirectToDashboard,
  ]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Empty state
  if (!exam || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Tidak ada soal ujian</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-red-600 text-white py-2 px-6 text-center text-sm">
        ⚠️ Jangan meninggalkan halaman ini saat ujian berlangsung. Exam akan
        otomatis tersubmit jika Anda keluar!
      </div>

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
              onPrevious={() => setCurrentQuestionIndex((prev) => prev - 1)}
              onNext={() => setCurrentQuestionIndex((prev) => prev + 1)}
              isFirstQuestion={currentQuestionIndex === 0}
              isLastQuestion={currentQuestionIndex === questions.length - 1}
              onSubmit={() => handleSubmit(true)}
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
