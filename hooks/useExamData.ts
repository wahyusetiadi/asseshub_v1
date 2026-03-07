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
  const ANSWERS_KEY = `exam_answers_${testId}`;

  useEffect(() => {
    let isMounted = true;

    // 🧹 Clean up old exam data from other exams
    const cleanupOldExamData = () => {
      const allKeys = Object.keys(localStorage);
      const currentExamKeys = [END_TIME_KEY, ANSWERS_KEY];

      allKeys.forEach((key) => {
        if (
          (key.startsWith("exam_end_time_") ||
            key.startsWith("exam_answers_")) &&
          !currentExamKeys.includes(key)
        ) {
          localStorage.removeItem(key);
          console.log(`🧹 Cleaned old exam data: ${key}`);
        }
      });
    };

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

        // Clean old data first
        cleanupOldExamData();

        // 1️⃣ Get exam detail
        const examRes = await examService.getExamDetail(testId);
        const examData = examRes?.data?.data || examRes?.data || examRes;

        if (!isMounted) return;
        setExam(examData);

        // 2️⃣ Get questions with retry
        const qRes = await fetchWithRetry(() =>
          userService.getQuestion(testId)
        );

        const qData = qRes?.data?.data?.questions || qRes?.data || qRes;

        if (!isMounted) return;
        setQuestions(Array.isArray(qData) ? qData : []);

        // 3️⃣ Check exam status
        const statusRes = await userService.checkStatus(testId);
        const status: UserProgress | null =
          statusRes?.data?.data || statusRes?.data || null;

        if (!status?.is_exam_ongoing) {
          // Clear data if exam not ongoing
          localStorage.removeItem(END_TIME_KEY);
          localStorage.removeItem(ANSWERS_KEY);

          alert("⏰ Ujian sudah selesai atau belum dimulai");
          router.push("/dashboard");
          return;
        }

        // 🔑 END TIME VALIDATION LOGIC (BEST PRACTICE)
        const now = Date.now();
        const storedEndTime = localStorage.getItem(END_TIME_KEY);

        if (storedEndTime) {
          const storedTime = Number(storedEndTime);

          // ✅ Validate: is stored endTime still valid?
          if (storedTime > now) {
            const remainingMs = storedTime - now;
            const remainingMinutes = Math.floor(remainingMs / 60000);

            console.log(
              `✅ Using valid stored endTime: ${new Date(storedTime).toLocaleTimeString()}`
            );
            console.log(`⏱️ Remaining time: ${remainingMinutes} minutes`);

            setEndTime(storedTime);
          } else {
            // ⚠️ Stored endTime expired - recalculate from server
            console.warn("⚠️ Stored endTime expired, recalculating...");

            const calculatedEndTime = now + status.remaining_duration_ms;

            // Double check if server says time is still available
            if (status.remaining_duration_ms > 0) {
              localStorage.setItem(END_TIME_KEY, String(calculatedEndTime));
              setEndTime(calculatedEndTime);

              console.log(
                `🔄 New endTime: ${new Date(calculatedEndTime).toLocaleTimeString()}`
              );
            } else {
              // Server says no time remaining
              console.error("❌ No remaining time from server");
              localStorage.removeItem(END_TIME_KEY);
              localStorage.removeItem(ANSWERS_KEY);

              alert("⏰ Waktu ujian telah habis");
              router.push("/dashboard");
              return;
            }
          }
        } else {
          // 🆕 First time - calculate from server data
          const calculatedEndTime = now + status.remaining_duration_ms;

          if (status.remaining_duration_ms > 0) {
            localStorage.setItem(END_TIME_KEY, String(calculatedEndTime));
            setEndTime(calculatedEndTime);

            const durationMinutes = Math.floor(
              status.remaining_duration_ms / 60000
            );
            console.log(
              `🆕 First time - endTime: ${new Date(calculatedEndTime).toLocaleTimeString()}`
            );
            console.log(`⏱️ Duration: ${durationMinutes} minutes`);
          } else {
            console.error("❌ No time available from server");
            alert("⏰ Waktu ujian tidak tersedia");
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("❌ Load exam error:", error);

        // Clear data on error
        localStorage.removeItem(END_TIME_KEY);
        localStorage.removeItem(ANSWERS_KEY);

        alert("Gagal memuat ujian. Silakan coba lagi.");
        router.push("/dashboard");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [testId, router, END_TIME_KEY, ANSWERS_KEY]);

  return {
    exam,
    questions,
    isLoading,
    endTime,
  };
};
