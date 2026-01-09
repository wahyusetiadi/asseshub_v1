"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiTask, BiPlay, BiLogOut } from "react-icons/bi";
import { BsCheckCircle, BsClockHistory } from "react-icons/bs";
import examService from "@/app/api/services/examService";
import userService from "@/app/api/services/userService";

interface UserProgress {
  user_id?: string;
  remaining_duration?: number; // dalam detik
  is_exam_ongoing?: boolean;
  status?: string; // fallback for old format
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
    // Check authentication
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch assigned tests
    fetchTests();
  }, [router]);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      // Fetch all exams
      const response = await examService.getAllExams();

      // Parse response to get array of exams
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

      // Check status for each exam
      const testsWithStatus = await Promise.all(
        exams.map(async (exam: ExamResponse) => {
          try {
            // Check exam status
            const statusResponse = await userService.checkStatus(exam.id);

            // Parse status data
            let statusData: UserProgress | null = null;
            if (statusResponse?.data) {
              // Format baru: {status: "success", data: {user_id, remaining_duration, is_exam_ongoing}}
              statusData = statusResponse.data;
            } else if (statusResponse && typeof statusResponse === "object") {
              // Fallback untuk format lama
              statusData = statusResponse as unknown as UserProgress;
            }

            return {
              id: exam.id,
              title: exam.title,
              description: exam.description,
              durationMinutes: exam.durationMinutes,
              startAt: exam.startAt,
              endAt: exam.endAt,
              totalQuestions: exam._count?.questions || 0,
              status: determineStatus(exam, statusData),
              userProgress: statusData || undefined,
              score: statusData?.score,
            };
          } catch (error) {
            console.error(`Error checking status for exam ${exam.id}:`, error);
            return {
              id: exam.id,
              title: exam.title,
              description: exam.description,
              durationMinutes: exam.durationMinutes,
              startAt: exam.startAt,
              endAt: exam.endAt,
              totalQuestions: exam._count?.questions || 0,
              status: "not_started" as const,
            };
          }
        })
      );

      setTests(testsWithStatus);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const determineStatus = (
    exam: ExamResponse,
    statusData: UserProgress | null
  ): "not_started" | "in_progress" | "completed" | "expired" => {
    const now = new Date();
    const startDate = new Date(exam.startAt);
    const endDate = new Date(exam.endAt);

    // Check if exam period has expired
    if (now > endDate) {
      return statusData?.is_exam_ongoing === false &&
        statusData?.remaining_duration === 0
        ? "completed"
        : "expired";
    }

    // Check if exam hasn't started yet
    if (now < startDate) {
      return "not_started";
    }

    // 👇 Gunakan is_exam_ongoing dari backend
    if (statusData) {
      // Jika exam tidak ongoing dan remaining duration 0, berarti completed
      if (!statusData.is_exam_ongoing && statusData.remaining_duration === 0) {
        return "completed";
      }

      // Jika exam ongoing, berarti in_progress
      if (statusData.is_exam_ongoing && statusData.remaining_duration! > 0) {
        return "in_progress";
      }
    }

    return "not_started";
  };

  const handleStartTest = async (test: Test) => {
    // Validations
    const now = new Date();
    const startDate = new Date(test.startAt);
    const endDate = new Date(test.endAt);

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

    if (test.status === "completed") {
      alert("✅ Anda sudah menyelesaikan ujian ini.");
      return;
    }

    if (startingExam !== null) return;

    setStartingExam(test.id);

    try {
      if (test.status === "not_started") {
        console.log("🚀 Starting exam...");

        const response = await userService.startExam(test.id);

        // 👇 Parse response dengan benar
        const startData = response?.data?.data || response?.data;

        console.log("✅ Exam started:", {
          progressId: startData?.id,
          startedAt: startData?.startedAt,
          status: startData?.status,
        });

        // 👇 Verify dengan checkStatus
        const statusCheck = await userService.checkStatus(test.id);
        console.log("📊 Status check:", statusCheck?.data);

        // Tunggu 1 detik untuk memastikan backend ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

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
