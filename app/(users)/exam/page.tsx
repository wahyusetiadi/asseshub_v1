"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiTask, BiPlay, BiLogOut } from "react-icons/bi";
import { BsCheckCircle, BsClockHistory } from "react-icons/bs";
import examService from "@/app/api/services/examService";
import userService from "@/app/api/services/userService";

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
      router.push("/login");
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Test yang Tersedia
            </h1>
            <p className="text-sm text-gray-500">
              Pilih test untuk mulai mengerjakan
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <BiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BiTask className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Test</p>
                <p className="text-2xl font-bold text-gray-800">
                  {tests.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BsClockHistory className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Sedang Dikerjakan</p>
                <p className="text-2xl font-bold text-gray-800">
                  {tests.filter((t) => t.status === "in_progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BsCheckCircle className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Selesai</p>
                <p className="text-2xl font-bold text-gray-800">
                  {tests.filter((t) => t.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <BiTime className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Kadaluarsa</p>
                <p className="text-2xl font-bold text-gray-800">
                  {tests.filter((t) => t.status === "expired").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const statusBadge = getStatusBadge(test.status);
            const available = isExamAvailable(test);
            const isStarting = startingExam === test.id;

            return (
              <div
                key={test.id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {test.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.style}`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{test.description}</p>

                {/* Exam Schedule */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Mulai:</span>
                    <span className="font-semibold">
                      {formatDate(test.startAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Berakhir:</span>
                    <span className="font-semibold">
                      {formatDate(test.endAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-1">
                    <BiTime size={16} />
                    <span>{test.durationMinutes} menit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BiTask size={16} />
                    <span>{test.totalQuestions || 0} soal</span>
                  </div>
                </div>

                {test.status === "completed" && test.score !== undefined && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-semibold">
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
                      ? "bg-gray-400 text-white cursor-wait"
                      : test.status === "expired"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : test.status === "completed"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : test.status === "in_progress"
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : available
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
          <div className="bg-white rounded-xl p-12 text-center border">
            <p className="text-gray-500">
              Belum ada test yang ditugaskan kepada Anda
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
