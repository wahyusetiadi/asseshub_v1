import { Question } from "@/types/exam.types";

interface ExamSidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  onQuestionSelect: (index: number) => void;
}

export default function ExamSidebar({
  questions,
  currentQuestionIndex,
  answers,
  timeRemaining,
  onQuestionSelect,
}: ExamSidebarProps) {
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24">
      <h3 className="font-bold text-gray-800 mb-4">Navigasi Soal</h3>
      <p className="text-sm text-gray-500 mb-4">
        {answeredCount} dari {questions.length} soal terjawab
      </p>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(index)}
            className={`aspect-square rounded-lg font-semibold text-sm transition ${
              currentQuestionIndex === index
                ? "bg-blue-600 text-white"
                : answers[question.id] !== undefined
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          💡 <span className="font-semibold">Tips:</span> Pastikan semua soal sudah terjawab sebelum submit.
        </p>
      </div>

      {timeRemaining < 300 && timeRemaining > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800 font-semibold">
            ⚠️ Waktu hampir habis! Segera selesaikan ujian Anda.
          </p>
        </div>
      )}
    </div>
  );
}
