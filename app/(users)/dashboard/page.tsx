"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiTask, BiPlay } from "react-icons/bi";
import { BsCheckCircle, BsClockHistory } from "react-icons/bs";

import examService from "@/app/api/services/examService";
import { ExamData } from "@/types/exam.types";
import userService from "@/app/api/services/userService";
import { Test } from "@/types/testTypes";

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

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
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
          (exam) => exam.category?.toLowerCase() === userPosition
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
    } catch (error) {
      console.error("❌ Failed to start exam:", error);
      alert("Gagal memulai ujian. Silakan coba lagi.");
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="w-full px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
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
        <div className="hidden grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BiTask className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Test</p>
                <p className="text-2xl font-bold text-gray-800">
                  {assignments.length}
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
                  {assignments.filter((a) => a.status === "in_progress").length}
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
                  {assignments.filter((a) => a.status === "completed").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test List */}
        <div>
          <h3 className="hidden text-xl font-bold text-gray-800 mb-4">
            Test yang Tersedia
          </h3>

          {assignments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border shadow-sm">
              <div className="flex justify-center mb-4 text-gray-300">
                <BiTask size={48} />
              </div>
              <p className="text-gray-500 font-medium">
                Belum ada test yang tersedia untuk posisi Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {assignment.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <BiTime className="text-blue-500" size={16} />
                        <span>{assignment.durationMinutes} menit</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <BiTask className="text-blue-500" size={16} />
                        <span>{assignment.totalQuestions} soal</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-slate-300 rounded-b-xl">
                    <button
                      onClick={() =>
                        handleStartTest(String(assignment.test.id))
                      }
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all"
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
