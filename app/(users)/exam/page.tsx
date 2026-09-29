"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiTask, BiPlay, BiLogOut } from "react-icons/bi";
import { BsCheckCircle, BsClockHistory } from "react-icons/bs";
import examService from "@/app/api/services/examService";
import userService from "@/app/api/services/userService";
import { clearSession } from "@/helpers/auth";

interface UserProgress {
  user_id?: string;
  remaining_duration?: number;
  is_exam_ongoing?: boolean;
  status?: string;
  startedAt?: string;
  finishedAt?: string;
  score?: number;
}

interface ExamResponse {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startAt: string;
  endAt: string;
  category?: string;
  _count?: {
    questions: number;
  };
}

interface Test {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startAt: string;
  endAt: string;
  totalQuestions?: number;
  _count?: { questions: number };
  status: "not_started" | "in_progress" | "completed" | "expired";
  score?: number;
  userProgress?: UserProgress;
}

export default function ExamListPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [startingExam, setStartingExam] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.replace("/users");
      return;
    }
    setUser(JSON.parse(userData));
    fetchTests();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchTests();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const response = await examService.getAllExams();

      let exams: ExamResponse[] = [];
      if (Array.isArray(response)) {
        exams = response;
      } else if (response && typeof response === "object") {
        const responseData = response as {
          data?: { data?: ExamResponse[] } | ExamResponse[];
        };
        if (responseData.data) {
          if (Array.isArray(responseData.data)) {
            exams = responseData.data;
          } else if (
            responseData.data.data &&
            Array.isArray(responseData.data.data)
          ) {
            exams = responseData.data.data;
          }
        }
      }

      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;
      const userPosition = user?.position?.toLowerCase();

      if (userPosition) {
        exams = exams.filter(
          (exam) => exam.category?.toLowerCase() === userPosition
        );
      }

      const testsWithStatus = exams.map((exam: ExamResponse) => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        startAt: exam.startAt,
        endAt: exam.endAt,
        totalQuestions: exam._count?.questions || 0,
        status: "not_started" as const, 
      }));

      setTests(testsWithStatus);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = async (test: Test) => {
    const now = new Date();
    const startDate = new Date(test.startAt);
    const endDate = new Date(test.endAt);

    // Validasi waktu
    if (now > endDate) {
      alert("❌ Ujian ini sudah berakhir dan tidak dapat dikerjakan lagi.");
      return;
    }

    if (now < startDate) {
      alert(
        `❌ Ujian ini belum dimulai. Mulai pada: ${new Date(
          test.startAt
        ).toLocaleString("id-ID")}`
      );
      return;
    }

    if (startingExam !== null) return;

    setStartingExam(test.id);

    try {
      // Cek localStorage dulu
      const localProgress = localStorage.getItem(`exam_progress_${test.id}`);

      if (localProgress) {
        const progress = JSON.parse(localProgress);

        if (progress.completed) {
          alert("✅ Anda sudah menyelesaikan ujian ini.");
          setStartingExam(null);
          return;
        }

        // Jika ada progress tapi belum selesai, lanjutkan
        console.log("📝 Melanjutkan ujian yang sedang berjalan...");
        router.push(`/exam/${test.id}`);
        return;
      }

      // Jika belum ada di localStorage, cek ke backend
      console.log("🔍 Checking exam status from backend...");
      const statusCheck = await userService.checkStatus(test.id);
      const statusData = statusCheck?.data;

      if (statusData?.is_exam_ongoing) {
        // Sudah pernah start tapi tidak ada di localStorage (mungkin clear cache)
        alert(
          "⚠️ Anda sudah memulai ujian ini sebelumnya. Silakan hubungi administrator."
        );
        setStartingExam(null);
        return;
      }

      // Mulai ujian baru
      console.log("🚀 Starting new exam...");
      const response = await userService.startExam(test.id);
      const startData = response?.data?.data || response?.data;

      // Simpan ke localStorage
      const examProgress = {
        examId: test.id,
        progressId: startData?.id,
        startedAt: startData?.startedAt,
        status: startData?.status,
        answers: {},
        completed: false,
      };
      localStorage.setItem(
        `exam_progress_${test.id}`,
        JSON.stringify(examProgress)
      );

      console.log("✅ Exam started:", startData);

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log("➡️ Redirecting to exam page...");
      router.push(`/exam/${test.id}`);
    } catch (error) {
      console.error("❌ Error starting exam:", error);
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        err?.response?.data?.message || err?.message || "Gagal memulai ujian";
      alert(`❌ ${errorMessage}`);
      setStartingExam(null);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.replace("/users");
  };

  const getStatusBadge = (status: Test["status"]) => {
    const styles = {
      not_started: "bg-blue-100 text-blue-700",
      in_progress: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      expired: "bg-red-100 text-red-700",
    };
    const labels = {
      not_started: "Belum Mulai",
      in_progress: "Sedang Dikerjakan",
      completed: "Selesai",
      expired: "Kadaluarsa",
    };
    return { style: styles[status], label: labels[status] };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isExamAvailable = (test: Test) => {
    const now = new Date();
    const startDate = new Date(test.startAt);
    const endDate = new Date(test.endAt);
    return now >= startDate && now <= endDate && test.status !== "completed";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Memuat daftar ujian...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Ruang peserta</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Daftar ujian
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Pilih ujian untuk melihat detail dan mulai mengerjakan
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-700 sm:flex">
              {user?.name?.charAt(0)?.toUpperCase() || "P"}
            </div>
            <div className="max-w-40 text-right sm:max-w-none">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name}
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
            >
              <BiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-indigo-50 p-3">
                <BiTask className="text-indigo-600" size={21} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total ujian</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {tests.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 p-3">
                <BsClockHistory className="text-amber-600" size={21} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Dikerjakan</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {tests.filter((t) => t.status === "in_progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-emerald-50 p-3">
                <BsCheckCircle className="text-emerald-600" size={21} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Selesai</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {tests.filter((t) => t.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-rose-50 p-3">
                <BiTime className="text-rose-600" size={21} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Kadaluarsa</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                  {tests.filter((t) => t.status === "expired").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Daftar Anda</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">Ujian yang tersedia</h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
            {tests.length} ujian
          </span>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test) => {
            const statusBadge = getStatusBadge(test.status);
            const available = isExamAvailable(test);
            const isStarting = startingExam === test.id;

            return (
              <div
                key={test.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/[0.06] sm:p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-bold leading-6 text-slate-900 sm:text-lg">
                    {test.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${statusBadge.style}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                <p className="mb-5 text-sm leading-6 text-slate-500">{test.description}</p>

                {/* Exam Schedule */}
                <div className="mb-5 space-y-2 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500">
                  <div className="flex items-center justify-between gap-3">
                    <span>Mulai</span>
                    <span className="text-right font-semibold text-slate-700">
                      {formatDate(test.startAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Berakhir</span>
                    <span className="text-right font-semibold text-slate-700">
                      {formatDate(test.endAt)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 flex items-center gap-5 border-b border-slate-100 pb-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <BiTime className="text-indigo-500" size={16} />
                    <span>{test.durationMinutes} menit</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BiTask className="text-indigo-500" size={16} />
                    <span>{test.totalQuestions || 0} soal</span>
                  </div>
                </div>

                {test.status === "completed" && test.score !== undefined && (
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-sm font-semibold text-emerald-800">
                      Skor: {test.score}/100
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleStartTest(test)}
                  disabled={
                    !available || test.status === "expired" || isStarting
                  }
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                    isStarting
                      ? "cursor-wait bg-slate-400 text-white"
                      : test.status === "expired"
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : test.status === "completed"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : test.status === "in_progress"
                      ? "bg-amber-500 text-white hover:bg-amber-600"
                      : available
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "cursor-not-allowed bg-slate-100 text-slate-400"
                  }`}
                >
                  {isStarting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Memulai...</span>
                    </>
                  ) : (
                    <>
                      <BiPlay size={20} />
                      {test.status === "expired"
                        ? "Ujian Kadaluarsa"
                        : test.status === "completed"
                        ? "Lihat Hasil"
                        : test.status === "in_progress"
                        ? "Lanjutkan Test"
                        : available
                        ? "Mulai Test"
                        : "Belum Tersedia"}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {tests.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mb-4 flex justify-center text-indigo-200"><BiTask size={44} /></div>
            <p className="font-semibold text-slate-700">
              Belum ada test yang ditugaskan kepada Anda
            </p>
            <p className="mt-1 text-sm text-slate-400">Ujian yang ditugaskan akan muncul di halaman ini.</p>
          </div>
        )}
      </main>
    </div>
  );
}
