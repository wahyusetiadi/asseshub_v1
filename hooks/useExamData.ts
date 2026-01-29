// hooks/useExamData.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import userService from "@/app/api/services/userService";
import examService from "@/app/api/services/examService";
import { ApiError, ExamData, Question, UserProgress } from "@/types/exam.types";

export const useExamData = (testId: string) => {
  const router = useRouter();

  const [exam, setExam] = useState<ExamData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [endTime, setEndTime] = useState<number | null>(null);

  const END_TIME_KEY = `exam_end_time_${testId}`;

  useEffect(() => {
    let isMounted = true;

    const fetchWithRetry = async <T,>(
      fn: () => Promise<T>,
      retries = 5,
      delay = 1000
    ): Promise<T> => {
      try {
        return await fn();
      } catch (error) {
        const apiError = error as ApiError;
        const is403 =
          apiError?.status === 403 ||
          apiError?.message?.includes("belum memulai");

        if (!is403 || retries <= 0) throw error;

        await new Promise((r) => setTimeout(r, delay));
        return fetchWithRetry(fn, retries - 1, delay);
      }
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 1️⃣ exam detail
        const examRes = await examService.getExamDetail(testId);
        const examData =
          examRes?.data?.data || examRes?.data || examRes;

        if (!isMounted) return;
        setExam(examData);

        // 2️⃣ questions
        const qRes = await fetchWithRetry(() =>
          userService.getQuestion(testId)
        );

        const qData =
          qRes?.data?.data?.questions || qRes?.data || qRes;

        if (!isMounted) return;
        setQuestions(Array.isArray(qData) ? qData : []);

        // 3️⃣ check status
        const statusRes = await userService.checkStatus(testId);
        const status: UserProgress | null =
          statusRes?.data?.data || statusRes?.data || null;

        if (!status?.is_exam_ongoing) {
          alert("⏰ Ujian sudah selesai atau belum dimulai");
          router.push("/dashboard");
          return;
        }

        // 🔑 END TIME LOGIC (INTI PERBAIKAN)
        const storedEndTime = localStorage.getItem(END_TIME_KEY);

        if (storedEndTime) {
          setEndTime(Number(storedEndTime));
        } else {
          const calculatedEndTime =
            Date.now() + status.remaining_duration_ms;

          localStorage.setItem(
            END_TIME_KEY,
            String(calculatedEndTime)
          );
          setEndTime(calculatedEndTime);
        }
      } catch (error) {
        console.error("❌ Load exam error:", error);
        alert("Gagal memuat ujian");
        router.push("/dashboard");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [testId, router]);

  return {
    exam,
    questions,
    isLoading,
    endTime,
  };
};
