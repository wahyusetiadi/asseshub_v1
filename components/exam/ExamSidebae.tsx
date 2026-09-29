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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:sticky lg:top-36">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-bold text-slate-900">Navigasi soal</h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">{questions.length}</span>
      </div>
      <p className="mb-4 text-sm text-slate-500">
        {answeredCount} dari {questions.length} soal terjawab
      </p>

      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-medium text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-600" />
          Aktif
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Terjawab
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          Kosong
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2.5">
        {questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(index)}
            className={`aspect-square rounded-lg font-semibold text-sm transition ${
              currentQuestionIndex === index
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-100"
                : answers[question.id] !== undefined
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
        <p className="text-xs leading-5 text-indigo-800">
          💡 <span className="font-semibold">Tips:</span> Pastikan semua soal sudah terjawab sebelum submit.
        </p>
      </div>

      {timeRemaining < 300 && timeRemaining > 0 && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold leading-5 text-red-800">
            ⚠️ Waktu hampir habis! Segera selesaikan ujian Anda.
          </p>
        </div>
      )}
    </div>
  );
}
