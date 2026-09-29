"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiTask, BiPlay } from "react-icons/bi";
import { BsCheckCircle, BsClockHistory } from "react-icons/bs";

import examService from "@/app/api/services/examService";
import { ExamData } from "@/types/exam.types";
import userService from "@/app/api/services/userService";
import { Test } from "@/types/testTypes";
import { ApiError } from "@/app/api/utils/errorHandler";

interface TestAssignment {
  id: number;
  test: Test;
  status: "not_started" | "in_progress" | "completed";
  startedAt?: string;
  completedAt?: string;
  score?: number;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number | undefined;
}

interface UserData {
  id: string;
  username: string;
  role: string;
  position: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [assignments, setAssignments] = useState<TestAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/users");
      return;
    }

    if (userData) {
      try {
        const parsed: UserData = JSON.parse(userData);
        setUser(parsed);
      } catch (error) {
        console.error("Gagal parse data user:", error);
      }
    }

    // Fetch assigned tests (mock data)
    fetchAssignments();
  }, [router]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await examService.getAllExams();

      let exams: ExamData[] = [];

      // Normalisasi response API
      if (Array.isArray(response)) {
        exams = response;
      } else if (response && typeof response === "object") {
        const responseData = response as {
          data?: { data?: ExamData[] } | ExamData[];
        };

        if (Array.isArray(responseData.data)) {
          exams = responseData.data;
        } else if (
          responseData.data &&
          "data" in responseData.data &&
          Array.isArray(responseData.data.data)
        ) {
          exams = responseData.data.data;
        }
      }

      // Ambil user dari localStorage
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userPosition = user?.position?.toLowerCase();

      // Filter berdasarkan position === category
      if (userPosition) {
        exams = exams.filter(
          (exam) => exam.category?.toLowerCase() === userPosition,
        );
      }

      // 🔁 MAP ExamData → TestAssignment
      const mappedAssignments: TestAssignment[] = exams.map((exam, index) => ({
        id: index + 1, // sementara (idealnya dari backend assignment id)
        test: exam as unknown as Test, // atau sesuaikan jika ExamData ≈ Test
        status: "not_started",
        title: exam.title,
        description: exam.description ?? "",
        durationMinutes: exam.durationMinutes ?? 0,
        totalQuestions: exam.totalQuestions ?? 0,
      }));

      setAssignments(mappedAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = async (testId: string) => {
    try {
      console.log("🚀 Starting exam...");

      await userService.startExam(testId);

      console.log("✅ Exam session created, redirecting...");
      router.push(`/exam/${testId}`);
    } catch (error: unknown) {
      const message =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : "Gagal memulai test";

      setErrorMessage(message);

      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleContinueTest = (testId: number) => {
    router.push(`/exam/${testId}`);
  };

  const handleViewResult = (assignmentId: number) => {
    router.push(`/result/${assignmentId}`);
  };

  const getStatusBadge = (status: TestAssignment["status"]) => {
    const styles = {
      not_started: "bg-blue-100 text-blue-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
    };
    const labels = {
      not_started: "Belum Mulai",
      in_progress: "Sedang Dikerjakan",
      completed: "Selesai",
    };
    return { style: styles[status], label: labels[status] };
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Memuat ujian Anda...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {errorMessage && (
  <div className="fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex items-start justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700 shadow-lg">
    <span className="text-sm font-medium">{errorMessage}</span>
    <button
      onClick={() => setErrorMessage(null)}
      className="text-red-500 hover:text-red-700"
    >
      ✕
    </button>
  </div>
)}

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* Welcome Section */}
        <div className="relative mb-8 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-8 text-white shadow-xl shadow-indigo-950/10 sm:p-10">
          <h2 className="text-3xl font-bold mb-2">
            Selamat Datang, {user?.username}! 👋
          </h2>
          <p className="text-blue-100">
            Anda memiliki{" "}
            {assignments.filter((a) => a.status === "not_started").length} test
            yang belum dikerjakan.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-50 p-3">
                <BiTask className="text-indigo-600" size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total ujian</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {assignments.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 p-3">
                <BsClockHistory className="text-amber-600" size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Sedang dikerjakan</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {assignments.filter((a) => a.status === "in_progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3">
                <BsCheckCircle className="text-emerald-600" size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Selesai</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {assignments.filter((a) => a.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test List */}
        <div>
          <h3 className="mb-4 text-xl font-bold text-slate-900">
            Test yang Tersedia
          </h3>

          {assignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
              <div className="mb-4 flex justify-center text-indigo-200">
                <BiTask size={44} />
              </div>
              <p className="font-semibold text-slate-700">
                Belum ada test yang tersedia untuk posisi Anda.
              </p>
              <p className="mt-1 text-sm text-slate-400">Ujian yang ditugaskan akan muncul di sini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/[0.06]"
                >
                  <div className="p-6 flex-1">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <BiTask size={22} />
                    </div>
                    <h4 className="mb-2 text-lg font-bold leading-tight text-slate-900">
                      {assignment.title}
                    </h4>
                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-slate-500">
                      {assignment.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
                        <BiTime className="text-indigo-500" size={16} />
                        <span>{assignment.durationMinutes} menit</span>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2">
                        <BiTask className="text-indigo-500" size={16} />
                        <span>{assignment.totalQuestions} soal</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 p-4">
                    <button
                      onClick={() =>
                        handleStartTest(String(assignment.test.id))
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-sm shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98]"
                    >
                      <BiPlay size={22} />
                      Mulai Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
