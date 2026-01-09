import { BiTime } from "react-icons/bi";
import { ExamData } from "@/types/exam.types";

interface ExamHeaderProps {
  exam: ExamData;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
  progress: number;
}

export default function ExamHeader({
  exam,
  currentQuestionIndex,
  totalQuestions,
  timeRemaining,
  formatTime,
  progress,
}: ExamHeaderProps) {
  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
            <p className="text-sm text-gray-500">
              Soal {currentQuestionIndex + 1} dari {totalQuestions}
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
              timeRemaining < 300
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <BiTime size={20} />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
