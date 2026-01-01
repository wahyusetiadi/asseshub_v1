"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { BiHome, BiXCircle } from "react-icons/bi";
import { BsTrophy, BsCheckCircle } from "react-icons/bs";

interface ResultData {
  id: number;
  testTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
}

export default function ResultDetailPage({
  params,
}: {
  params: Promise<{ resultId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchResult(resolvedParams.resultId);
  }, [resolvedParams.resultId]);

  const fetchResult = async (resultId: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with API call
      // const response = await api.getResult(resultId);

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockResult: ResultData = {
        id: Number(resultId),
        testTitle: "Software Engineering Assessment",
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        completedAt: new Date().toISOString(),
      };

      setResult(mockResult);
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToExams = () => {
    router.push("/exam");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Result not found</p>
          <button
            onClick={handleBackToExams}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  const isPassed = result.score >= 70;
  const percentage =
    result.totalQuestions > 0
      ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-12 text-center">
        {/* Icon */}
        <div className="mb-6">
          {isPassed ? (
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <BsTrophy className="text-green-600" size={48} />
            </div>
          ) : (
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <BiXCircle className="text-red-600" size={48} />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {isPassed ? "Selamat! 🎉" : "Mohon Maaf"}
        </h1>
        <p className="text-gray-600 mb-2">{result.testTitle}</p>
        <p className="text-sm text-gray-500 mb-8">
          {isPassed
            ? "Anda telah berhasil menyelesaikan test dengan baik!"
            : "Anda belum mencapai nilai minimum kelulusan"}
        </p>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-8 mb-8">
          <p className="text-sm opacity-90 mb-2">Skor Anda</p>
          <p className="text-6xl font-bold mb-2">{result.score}</p>
          <p className="text-sm opacity-90">dari 100</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <p className={`font-bold text-lg ${isPassed ? "text-green-600" : "text-red-600"}`}>
              {isPassed ? "LULUS" : "TIDAK LULUS"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Jawaban Benar</p>
            <p className="font-bold text-lg text-gray-800">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Passing Grade</p>
            <p className="font-bold text-lg text-gray-800">70</p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Persentase Kebenaran</span>
            <span className="text-sm font-bold text-blue-900">{percentage}%</span>
          </div>
          <div className="w-full h-3 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Message */}
        {isPassed ? (
          <div className="flex items-center gap-2 justify-center mb-8 text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
            <BsCheckCircle size={20} />
            <p className="font-semibold text-sm">
              Anda lulus dengan nilai {result.score}. Hasil ini akan dikirim ke tim rekrutmen.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center mb-8 text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
            <BiXCircle size={20} />
            <p className="font-semibold text-sm">
              Nilai minimum untuk lulus adalah 70. Tetap semangat untuk kesempatan berikutnya!
            </p>
          </div>
        )}

        {/* Actions */}
        <button
          onClick={handleBackToExams}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
        >
          <BiHome size={20} />
          Kembali ke Daftar Test
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Result ID: {result.id} • Completed: {new Date(result.completedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
