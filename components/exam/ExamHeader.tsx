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
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">Ujian berlangsung</p>
            <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{exam.title}</h1>
            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
              Soal {currentQuestionIndex + 1} dari {totalQuestions}
            </p>
          </div>
          <div
            className={`flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-base font-bold tabular-nums ring-1 ${
              timeRemaining < 300
                ? "bg-red-50 text-red-700 ring-red-200"
                : "bg-indigo-50 text-indigo-700 ring-indigo-100"
            }`}
          >
            <BiTime size={20} />
            {formatTime(timeRemaining)}
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </header>
  );
}
