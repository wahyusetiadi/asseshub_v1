"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiTask, BiPlay, BiLogOut } from "react-icons/bi";
import { BsCheckCircle, BsClockHistory } from "react-icons/bs";

interface Test {
  id: number;
  title: string;
  description: string;
  duration: number;
  questions: number;
  status: "not_started" | "in_progress" | "completed";
  startedAt?: string;
  score?: number;
}

export default function ExamListPage() {
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );

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
      // TODO: Replace with API call
      // const response = await api.getMyTests();

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockTests: Test[] = [
        {
          id: 1,
          title: "Software Engineering Assessment",
          description: "Test kemampuan programming dan problem solving",
          duration: 90,
          questions: 50,
          status: "not_started",
        },
        {
          id: 2,
          title: "Product Management Test",
          description: "Test untuk product manager",
          duration: 60,
          questions: 30,
          status: "in_progress",
          startedAt: "2024-01-20T14:30:00Z",
        },
        {
          id: 3,
          title: "UI/UX Design Challenge",
          description: "Test kemampuan design dan user experience",
          duration: 120,
          questions: 40,
          status: "completed",
          score: 85,
        },
      ];

      setTests(mockTests);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTest = (testId: number) => {
    router.push(`/exam/${testId}`);
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
      {/* Header
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
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const statusBadge = getStatusBadge(test.status);
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

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-1">
                    <BiTime size={16} />
                    <span>{test.duration} menit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BiTask size={16} />
                    <span>{test.questions} soal</span>
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
                  onClick={() => handleStartTest(test.id)}
                  disabled={test.status === "completed"}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                    test.status === "completed"
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : test.status === "in_progress"
                      ? "bg-yellow-600 text-white hover:bg-yellow-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <BiPlay size={20} />
                  {test.status === "completed"
                    ? "Test Selesai"
                    : test.status === "in_progress"
                    ? "Lanjutkan Test"
                    : "Mulai Test"}
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
