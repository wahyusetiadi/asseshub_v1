"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiHome, BiLogOut, BiSearch, BiTrendingUp, BiTrendingDown } from "react-icons/bi";
import { BsCheckCircle, BsXCircle, BsEye, BsCalendar, BsAward } from "react-icons/bs";

interface TestResult {
  id: number;
  testId: number;
  testTitle: string;
  testDescription: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: number;
  status: "passed" | "failed";
  completedAt: string;
}

export default function ResultsListPage() {
  const router = useRouter();
  const [results, setResults] = useState<TestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed">("all");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Fetch results
    fetchResults();
  }, [router]);

  useEffect(() => {
    // Filter results based on search and status
    let filtered = results;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((result) =>
        result.testTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((result) => result.status === filterStatus);
    }

    setFilteredResults(filtered);
  }, [searchQuery, filterStatus, results]);

  const fetchResults = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with API call
      // const response = await api.getMyResults();

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockResults: TestResult[] = [
        {
          id: 1001,
          testId: 1,
          testTitle: "Software Engineering Assessment",
          testDescription: "Test kemampuan programming dan problem solving",
          score: 85,
          totalQuestions: 50,
          correctAnswers: 42,
          duration: 78,
          status: "passed",
          completedAt: "2024-01-20T15:30:00Z",
        },
        {
          id: 1002,
          testId: 2,
          testTitle: "Product Management Test",
          testDescription: "Test untuk product manager",
          score: 92,
          totalQuestions: 30,
          correctAnswers: 28,
          duration: 55,
          status: "passed",
          completedAt: "2024-01-22T10:15:00Z",
        },
        {
          id: 1003,
          testId: 3,
          testTitle: "UI/UX Design Challenge",
          testDescription: "Test kemampuan design dan user experience",
          score: 65,
          totalQuestions: 40,
          correctAnswers: 26,
          duration: 110,
          status: "failed",
          completedAt: "2024-01-18T16:45:00Z",
        },
        {
          id: 1004,
          testId: 4,
          testTitle: "Data Analysis Skills Test",
          testDescription: "Test analytical thinking dan data interpretation",
          score: 78,
          totalQuestions: 35,
          correctAnswers: 27,
          duration: 68,
          status: "passed",
          completedAt: "2024-01-15T14:20:00Z",
        },
        {
          id: 1005,
          testId: 5,
          testTitle: "JavaScript Advanced Test",
          testDescription: "Test advanced JavaScript concepts",
          score: 58,
          totalQuestions: 45,
          correctAnswers: 26,
          duration: 85,
          status: "failed",
          completedAt: "2024-01-12T11:00:00Z",
        },
      ];

      setResults(mockResults);
      setFilteredResults(mockResults);
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleViewDetail = (resultId: number) => {
    router.push(`/result-exam/${resultId}`);
  };

  const getStatusBadge = (status: TestResult["status"]) => {
    return status === "passed"
      ? {
          style: "bg-green-100 text-green-700 border-green-300",
          icon: <BsCheckCircle size={16} />,
          label: "LULUS",
        }
      : {
          style: "bg-red-100 text-red-700 border-red-300",
          icon: <BsXCircle size={16} />,
          label: "TIDAK LULUS",
        };
  };

  const getScoreTrend = (score: number) => {
    if (score >= 85) {
      return {
        color: "text-green-600",
        icon: <BiTrendingUp size={20} />,
        label: "Excellent",
      };
    } else if (score >= 70) {
      return {
        color: "text-blue-600",
        icon: <BiTrendingUp size={20} />,
        label: "Good",
      };
    } else {
      return {
        color: "text-red-600",
        icon: <BiTrendingDown size={20} />,
        label: "Need Improvement",
      };
    }
  };

  // Calculate statistics
  const totalTests = results.length;
  const passedTests = results.filter((r) => r.status === "passed").length;
  const averageScore =
    totalTests > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalTests) : 0;
  const highestScore = totalTests > 0 ? Math.max(...results.map((r) => r.score)) : 0;

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
      {/* <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Riwayat Hasil Test</h1>
              <p className="text-sm text-gray-500">Lihat semua hasil test yang telah Anda kerjakan</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/exam"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <BiHome size={18} />
                Kembali ke Test
              </Link>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
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
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Test</p>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BsAward className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalTests}</p>
            <p className="text-xs text-gray-500 mt-1">Test yang diselesaikan</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Test Lulus</p>
              <div className="p-2 bg-green-100 rounded-lg">
                <BsCheckCircle className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600">{passedTests}</p>
            <p className="text-xs text-gray-500 mt-1">
              {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}% tingkat kelulusan
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Rata-rata Skor</p>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BiTrendingUp className="text-yellow-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{averageScore}</p>
            <p className="text-xs text-gray-500 mt-1">Dari 100</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Skor Tertinggi</p>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BsAward className="text-purple-600" size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600">{highestScore}</p>
            <p className="text-xs text-gray-500 mt-1">Pencapaian terbaik</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama test..."
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Semua ({results.length})
              </button>
              <button
                onClick={() => setFilterStatus("passed")}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
                  filterStatus === "passed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Lulus ({passedTests})
              </button>
              <button
                onClick={() => setFilterStatus("failed")}
                className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition ${
                  filterStatus === "failed"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tidak Lulus ({totalTests - passedTests})
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          {filteredResults.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="mb-2">Tidak ada hasil test ditemukan</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                >
                  Reset pencarian
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Test
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Skor
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Jawaban Benar
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Durasi
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredResults.map((result) => {
                    const statusBadge = getStatusBadge(result.status);
                    const scoreTrend = getScoreTrend(result.score);

                    return (
                      <tr key={result.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{result.testTitle}</p>
                            <p className="text-sm text-gray-500">{result.testDescription}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-1">
                              <span className={`text-2xl font-bold ${scoreTrend.color}`}>
                                {result.score}
                              </span>
                              {scoreTrend.icon}
                            </div>
                            <span className={`text-xs font-semibold ${scoreTrend.color}`}>
                              {scoreTrend.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-semibold text-gray-800">
                            {result.correctAnswers}/{result.totalQuestions}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-sm text-gray-600">{result.duration} menit</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.style}`}
                          >
                            {statusBadge.icon}
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <BsCalendar size={14} />
                              <span>{new Date(result.completedAt).toLocaleDateString("id-ID")}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(result.completedAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleViewDetail(result.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                          >
                            <BsEye size={16} />
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Note */}
        {filteredResults.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <span className="font-semibold">Info:</span> Hasil test ini sudah tersimpan dan
              dapat diakses kapan saja. Passing grade untuk lulus adalah <strong>70</strong>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
