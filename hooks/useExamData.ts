import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import userService from "@/app/api/services/userService";
import examService from "@/app/api/services/examService";
import { ApiError, ExamData, Question, UserProgress } from "@/types/exam.types";

export const useExamData = (testId: string) => {
  const router = useRouter();
  const [exam, setExam] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchExamData = async () => {
      if (!isMounted) return;
      setIsLoading(true);

      try {
        // Fetch exam detail
        const examResponse = await examService.getExamDetail(testId);
        const examData =
          examResponse?.data?.data || examResponse?.data || examResponse;

        if (!isMounted) return;
        setExam(examData);

        // Fetch questions with retry
        const questionsResponse = await fetchWithRetry(
          () => userService.getQuestion(testId),
          5,
          1000
        );

        console.log("question response:", questionsResponse);

        const questionsData =
          questionsResponse?.data?.data?.questions ||
          questionsResponse?.data ||
          questionsResponse;

        if (!isMounted) return;
        setQuestions(Array.isArray(questionsData) ? questionsData : []);

        // Check status to get remaining duration
        const statusResponse = await userService.checkStatus(testId);
        console.log("📊 Status Response:", statusResponse?.data);

        const statusData: UserProgress | null = statusResponse?.data || null;

        if (!isMounted) return;

        // ✅ Logic untuk set timer dari backend
        if (statusData) {
          const { is_exam_ongoing, remaining_duration } = statusData;

          console.log("⏱️ Exam Status:", {
            is_exam_ongoing,
            remaining_duration,
          });

          // ✅ FIX: Konversi milidetik ke detik
          const remainingInSeconds = Math.floor(remaining_duration / 1000);

          console.log("🔄 Converted:", {
            fromBackend: remaining_duration,
            unit: "milliseconds",
            converted: remainingInSeconds,
            unit: "seconds",
          });

          // ✅ Gunakan remaining_duration sebagai sumber kebenaran
          if (
            typeof remaining_duration === "number" &&
            remaining_duration > 0
          ) {
            console.log(
              "✅ Using remaining time from backend:",
              remainingInSeconds,
              "seconds"
            );
            setTimeRemaining(remainingInSeconds); // ✅ Set dalam detik
            setShouldAutoSubmit(false);
          }
          // ✅ Waktu habis
          else if (remaining_duration <= 0) {
            console.log("⏰ Time is up from backend!");
            setTimeRemaining(0);
            setShouldAutoSubmit(true);
          }
          // ✅ Fallback ke durasi exam
          else {
            console.log("🤔 No valid remaining_duration, using exam duration");
            const duration = examData?.durationMinutes * 60 || 0;
            setTimeRemaining(duration);
            setShouldAutoSubmit(false);
          }
        } else {
          // Jika tidak ada status data, gunakan durasi exam
          console.log("📝 No status data, using exam duration");
          const duration = examData?.durationMinutes * 60 || 0;
          setTimeRemaining(duration);
          setShouldAutoSubmit(false);
        }

        if (!isMounted) return;
        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching exam:", error);

        // 👇 Type assertion dengan proper interface
        const apiError = error as ApiError;
        const errorMessage =
          apiError?.response?.data?.message ||
          apiError?.message ||
          "Gagal memuat soal ujian";

        alert(`❌ ${errorMessage}`);
        router.push("/exam");
      }
    };

    // Helper retry function dengan proper typing
    const fetchWithRetry = async <T>(
      fn: () => Promise<T>,
      retries = 5,
      delay = 1000
    ): Promise<T> => {
      try {
        return await fn();
      } catch (error) {
        // 👇 Type assertion dengan proper interface
        const apiError = error as ApiError;
        const is403Error =
          apiError?.status === 403 ||
          apiError?.message?.includes("belum memulai");

        if (retries <= 0 || !is403Error) {
          throw error;
        }

        console.log(
          `⏳ Waiting for exam to start... (${retries} retries left)`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(fn, retries - 1, delay);
      }
    };

    fetchExamData();
    return () => {
      isMounted = false;
    };
  }, [testId, router]);

  return {
    exam,
    questions,
    isLoading,
    timeRemaining,
    setTimeRemaining,
    shouldAutoSubmit,
  };
};
