"use client";
import { useState, use, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import userService from "@/app/api/services/userService";
import { useExamData } from "@/hooks/useExamData";
import { useExamTimer } from "@/hooks/useExamTimer";
import ExamHeader from "@/components/exam/ExamHeader";
import QuestionCard from "@/components/exam/QuestionCard";
import ExamSidebar from "@/components/exam/ExamSidebae";

export default function ExamExecutionPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const resolvedParams = use(params);
  const testId = resolvedParams.testId;
  const router = useRouter();

  // 🔑 LocalStorage key untuk menyimpan jawaban
  const ANSWERS_STORAGE_KEY = `exam_answers_${testId}`;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // ✅ FIX 1: Gunakan lazy initialization untuk load dari localStorage
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
  const hasAutoSubmitted = useRef(false);
  const isExamFinished = useRef(false);
  const hasCheckedInitialStatus = useRef(false);
  const isFirstLoad = useRef(true);

  const {
    exam,
    questions,
    isLoading,
    timeRemaining: initialTimeRemaining, // Ini dari backend
    setTimeRemaining: setInitialTimeRemaining,
    shouldAutoSubmit,
  } = useExamData(testId);

  const { timeRemaining, formatTime, isTimeUp } =
    useExamTimer(initialTimeRemaining);

  // ✅ Fungsi untuk menyimpan jawaban ke localStorage
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

  // ✅ FIX 2: Pisahkan fungsi submitAllAnswers dari useCallback
  const submitAllAnswers = useCallback(async () => {
    const answersArray = Object.entries(answers);

    if (answersArray.length === 0) {
      console.log("⚠️ No answers to submit");
      return true;
    }

    console.log(`📤 Submitting ${answersArray.length} answers to backend...`);

    let successCount = 0;
    let failCount = 0;

    for (const [questionId, optionId] of answersArray) {
      try {
        await userService.answerQuestion(testId, {
          questionId,
          optionId,
        });
        successCount++;
        console.log(`✅ Answer submitted: Q${questionId} -> ${optionId}`);
      } catch (error) {
        failCount++;
        console.error(`❌ Failed to submit answer for Q${questionId}:`, error);
      }
    }

    console.log(
      `📊 Submit summary: ${successCount} success, ${failCount} failed`
    );

    if (failCount > 0) {
      const shouldContinue = confirm(
        `⚠️ ${failCount} dari ${answersArray.length} jawaban gagal dikirim. Tetap lanjut submit ujian?`
      );
      return shouldContinue;
    }

    return true;
  }, [answers, testId]);

  // ✅ FIX 3: Tambahkan submitAllAnswers ke dependency array
  const handleSubmit = useCallback(
    async (isManual: boolean = false) => {
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

      const unansweredCount = questions.length - Object.keys(answers).length;

      if (isManual && timeRemaining > 0) {
        if (unansweredCount > 0) {
          if (
            !confirm(
              `Masih ada ${unansweredCount} soal yang belum dijawab. Apakah Anda yakin ingin submit?`
            )
          ) {
            return;
          }
        } else {
          if (!confirm("Apakah Anda yakin ingin submit test?")) {
            return;
          }
        }
      }

      if (!isManual) {
        hasAutoSubmitted.current = true;
      }

      setIsSubmitting(true);

      try {
        // 🔥 STEP 1: Submit semua jawaban ke backend
        console.log("🚀 Step 1: Submitting answers...");
        const canProceed = await submitAllAnswers();

        if (!canProceed) {
          setIsSubmitting(false);
          if (!isManual) {
            hasAutoSubmitted.current = false;
          }
          return;
        }

        // 🔥 STEP 2: Finish exam
        console.log("🚀 Step 2: Finishing exam...");
        await userService.finishExam(testId);

        // 🔥 STEP 3: Clear localStorage dan redirect
        localStorage.removeItem(ANSWERS_STORAGE_KEY);
        isExamFinished.current = true;
        alert("✅ Ujian berhasil diselesaikan!");
        router.push("/exam");
      } catch (error) {
        console.error("Error submitting exam:", error);
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

        if (!isManual) {
          hasAutoSubmitted.current = false;
        }
      }
    },
    [
      isSubmitting,
      isInitialized,
      timeRemaining,
      questions.length,
      answers,
      testId,
      router,
      ANSWERS_STORAGE_KEY,
      submitAllAnswers, // ✅ Tambahkan ini
    ]
  );

  // ✅ Set initialized setelah data siap
  useEffect(() => {
    if (
      !isLoading &&
      exam &&
      questions.length > 0 &&
      initialTimeRemaining > 0
    ) {
      const initTimer = setTimeout(() => {
        setIsInitialized(true);
        isFirstLoad.current = false;
        console.log("✅ Exam initialized, auto-submit enabled");
      }, 2000);

      return () => clearTimeout(initTimer);
    }
  }, [isLoading, exam, questions.length, initialTimeRemaining]);

  // ✅ CHECK STATUS saat component mount
  useEffect(() => {
    if (hasCheckedInitialStatus.current || isLoading || !initialTimeRemaining) {
      return;
    }

    const checkExamStatus = async () => {
      try {
        console.log("🔍 Running initial exam status check...");

        const statusResponse = await userService.checkStatus(testId);
        const statusData = statusResponse?.data?.data || statusResponse?.data;
        const { is_exam_ongoing, remaining_duration } = statusData || {};

        // ✅ Konversi milidetik ke detik
        const remainingInSeconds = Math.floor((remaining_duration || 0) / 1000);

        console.log("📊 Initial status:", {
          is_exam_ongoing,
          remaining_duration_ms: remaining_duration,
          remaining_duration_sec: remainingInSeconds,
          initialTimeRemaining,
        });

        hasCheckedInitialStatus.current = true;

        // ✅ Hanya redirect jika waktu BENAR-BENAR habis
        if (remainingInSeconds <= 0) {
          console.log("⚠️ Exam time is up (remaining <= 0)");
          localStorage.removeItem(ANSWERS_STORAGE_KEY);
          alert("⏰ Ujian ini sudah selesai atau waktu telah habis.");
          router.push("/exam");
          return;
        }

        // ✅ Sync waktu jika masih ada remaining
        if (remainingInSeconds > 0) {
          console.log(
            "✅ Exam still ongoing, syncing time:",
            remainingInSeconds,
            "seconds"
          );
          setInitialTimeRemaining(remainingInSeconds);
        }
      } catch (error) {
        console.error("Error checking exam status:", error);
      }
    };

    const checkTimer = setTimeout(() => {
      checkExamStatus();
    }, 1000);

    return () => clearTimeout(checkTimer);
  }, [
    testId,
    isLoading,
    initialTimeRemaining,
    router,
    setInitialTimeRemaining,
    ANSWERS_STORAGE_KEY,
  ]);

  // ✅ Prevent navigation saat exam berlangsung
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isExamFinished.current) {
        e.preventDefault();
        e.returnValue = "Ujian masih berlangsung. Yakin ingin keluar?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ✅ Prevent browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (!isExamFinished.current) {
        const confirmLeave = window.confirm(
          "Ujian masih berlangsung. Jika Anda keluar, ujian akan otomatis tersubmit. Yakin ingin keluar?"
        );

        if (!confirmLeave) {
          window.history.pushState(null, "", window.location.href);
        } else {
          handleSubmit(false);
        }
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleSubmit]);

  // ✅ Prevent keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "w" || e.key === "q")) ||
        (e.altKey && e.key === "F4")
      ) {
        if (!isExamFinished.current) {
          e.preventDefault();
          alert("Tidak dapat menutup tab saat ujian berlangsung!");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ✅ Auto submit when time is up
  useEffect(() => {
    if (
      isInitialized &&
      (isTimeUp || shouldAutoSubmit) &&
      !isSubmitting &&
      !hasAutoSubmitted.current &&
      questions.length > 0 &&
      timeRemaining <= 0
    ) {
      console.log("🚨 Auto submit will be triggered:", {
        isTimeUp,
        shouldAutoSubmit,
        timeRemaining,
      });

      const submitTimer = setTimeout(() => {
        handleSubmit(false);
      }, 100);

      return () => clearTimeout(submitTimer);
    }
  }, [
    isTimeUp,
    shouldAutoSubmit,
    isSubmitting,
    questions.length,
    isInitialized,
    timeRemaining,
    handleSubmit,
  ]);

  // ✅ Sync timer dengan backend setiap 30 detik
  useEffect(() => {
    if (!exam || isLoading || !isInitialized) return;

    const syncInterval = setInterval(async () => {
      try {
        console.log("🔄 Syncing timer with backend...");

        const statusResponse = await userService.checkStatus(testId);
        const statusData = statusResponse?.data?.data || statusResponse?.data;
        const remaining_ms = statusData?.remaining_duration;
        const isOngoing = statusData?.is_exam_ongoing;

        // ✅ Validasi response
        if (typeof remaining_ms !== "number") {
          console.warn("⚠️ Invalid remaining_duration, skipping sync");
          return;
        }

        // ✅ Konversi milidetik ke detik
        const remaining = Math.floor(remaining_ms / 1000);

        console.log("📊 Sync result:", {
          remaining_ms,
          remaining_sec: remaining,
          isOngoing,
          currentLocalTime: timeRemaining,
        });

        // ✅ Sync waktu dari backend
        console.log(`🔄 Updating time: ${timeRemaining}s → ${remaining}s`);
        setInitialTimeRemaining(remaining);

        // ✅ Hanya auto-submit jika remaining_duration <= 0
        if (remaining <= 0) {
          if (!hasAutoSubmitted.current && !isExamFinished.current) {
            console.log(
              "⚠️ Time is up from backend sync, triggering auto-submit..."
            );
            hasAutoSubmitted.current = true;
            await handleSubmit(false);
          }
        }
      } catch (error) {
        console.error("❌ Error syncing timer:", error);
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [
    exam,
    isLoading,
    testId,
    isInitialized,
    setInitialTimeRemaining,
    timeRemaining,
    handleSubmit,
  ]);

  // ✅ Visibility change detection
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (isFirstLoad.current || isExamFinished.current) {
        console.log(
          "⏭️ Skipping visibility check (first load or exam finished)"
        );
        return;
      }

      if (document.visibilityState === "visible") {
        console.log("👁️ Tab became visible, checking exam status...");

        try {
          const statusResponse = await userService.checkStatus(testId);
          const statusData = statusResponse?.data?.data || statusResponse?.data;
          const remaining_ms = statusData?.remaining_duration || 0;
          const isOngoing = statusData?.is_exam_ongoing;

          // ✅ Konversi milidetik ke detik
          const remaining = Math.floor(remaining_ms / 1000);

          console.log("🔍 Status after tab visible:", {
            remaining_ms,
            remaining_sec: remaining,
            isOngoing,
          });

          // ✅ Hanya redirect jika waktu benar-benar habis
          if (remaining <= 0) {
            alert("⏰ Waktu ujian telah habis saat Anda tidak aktif.");
            localStorage.removeItem(ANSWERS_STORAGE_KEY);
            isExamFinished.current = true;
            router.push("/exam");
          } else if (remaining > 0) {
            console.log("✅ Syncing time from backend:", remaining, "seconds");
            setInitialTimeRemaining(remaining);
          }
        } catch (error) {
          console.error("Error checking status on visibility change:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [testId, router, setInitialTimeRemaining, ANSWERS_STORAGE_KEY]);

  // ✅ Handle answer select dengan simpan ke localStorage
  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      const updatedAnswers = { ...prev, [questionId]: optionId };

      // 💾 Simpan ke localStorage
      saveAnswerToStorage(updatedAnswers);

      console.log(`✍️ Answer selected: Q${questionId} -> ${optionId}`);
      return updatedAnswers;
    });
  };

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
        <div className="text-center">
          <p className="text-gray-500 mb-4">Tidak ada soal ujian</p>
          <button
            onClick={() => router.push("/exam")}
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
