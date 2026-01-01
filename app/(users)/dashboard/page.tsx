"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiLogOut, BiTime, BiTask, BiPlay } from "react-icons/bi";
import { BsCheckCircle, BsClockHistory } from "react-icons/bs";
import { api } from "@/helpers/lib/api";
import { Test } from "@/types/api";

interface TestAssignment {
  id: number;
  test: Test;
  status: "not_started" | "in_progress" | "completed";
  startedAt?: string;
  completedAt?: string;
  score?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [assignments, setAssignments] = useState<TestAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch assigned tests (mock data)
    fetchAssignments();
  }, [router]);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await api.getMyTests();

      // Mock data
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockAssignments: TestAssignment[] = [
        {
          id: 1,
          test: {
            id: 1,
            title: "Software Engineering Assessment",
            description: "Test kemampuan programming dan problem solving",
            duration: 90,
            questions: 50,
            passingScore: 70,
            status: "active",
            createdAt: "2024-01-10T08:00:00Z",
          },
          status: "not_started",
        },
        {
          id: 2,
          test: {
            id: 2,
            title: "Product Management Test",
            description: "Test untuk product manager",
            duration: 60,
            questions: 30,
            passingScore: 75,
            status: "active",
            createdAt: "2024-01-12T10:00:00Z",
          },
          status: "in_progress",
          startedAt: "2024-01-20T14:30:00Z",
        },
        {
          id: 3,
          test: {
            id: 3,
            title: "UI/UX Design Challenge",
            description: "Test kemampuan design dan user experience",
            duration: 120,
            questions: 40,
            passingScore: 70,
            status: "active",
            createdAt: "2024-01-15T09:00:00Z",
          },
          status: "completed",
          completedAt: "2024-01-18T16:45:00Z",
          score: 85,
        },
      ];

      setAssignments(mockAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleStartTest = (testId: number) => {
    router.push(`/exam/${testId}`);
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
      <main className="max-w-7xl px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-2">
            Selamat Datang, {user?.name}! 👋
          </h2>
          <p className="text-blue-100">
            Anda memiliki{" "}
            {assignments.filter((a) => a.status === "not_started").length} test
            yang belum dikerjakan.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Test yang Tersedia
          </h3>

          {assignments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border">
              <p className="text-gray-500">Belum ada test yang ditugaskan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments.map((assignment) => {
                const statusBadge = getStatusBadge(assignment.status);
                return (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800 mb-1">
                          {assignment.test.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {assignment.test.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.style}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <BiTime size={16} />
                        <span>{assignment.test.duration} menit</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BiTask size={16} />
                        <span>{assignment.test.questions} soal</span>
                      </div>
                    </div>

                    {assignment.status === "completed" &&
                      assignment.score !== undefined && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            <span className="font-semibold">Skor Anda:</span>{" "}
                            {assignment.score}/100
                          </p>
                        </div>
                      )}

                    {assignment.status === "not_started" && (
                      <button
                        onClick={() => handleStartTest(assignment.test.id)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        <BiPlay size={20} />
                        Mulai Test
                      </button>
                    )}

                    {assignment.status === "in_progress" && (
                      <button
                        onClick={() => handleContinueTest(assignment.test.id)}
                        className="w-full flex items-center justify-center gap-2 bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition"
                      >
                        <BiPlay size={20} />
                        Lanjutkan Test
                      </button>
                    )}

                    {assignment.status === "completed" && (
                      <button
                        onClick={() => handleViewResult(assignment.id)}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        <BsCheckCircle size={18} />
                        Lihat Hasil
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
