import { BiCheckCircle } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { Question } from "@/types/exam.types";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  selectedAnswer: string | undefined;
  isSaving?: boolean;
  onAnswerSelect: (questionId: string, optionId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function QuestionCard({
  question,
  questionIndex,
  selectedAnswer,
  isSaving = false,
  onAnswerSelect,
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  onSubmit,
  isSubmitting,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03] sm:rounded-3xl sm:p-8">
      <div className="mb-6">
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 ring-1 ring-indigo-100">
            Pertanyaan {String(questionIndex + 1).padStart(2, "0")}
          </span>
          {isSaving && (
            <span className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
              Menyimpan jawaban...
            </span>
          )}
        </div>
        <h2 className="mb-2 text-xl font-semibold leading-relaxed text-slate-900 sm:text-2xl">{question.text}</h2>
        <p className="text-sm text-slate-500">Pilih satu jawaban yang paling tepat.</p>
      </div>

      <div className="space-y-3.5">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(question.id, option.id)}
            disabled={isSaving}
            className={`w-full rounded-xl border p-4 text-left transition duration-150 sm:p-5 ${
              selectedAnswer === option.id
                ? "border-indigo-500 bg-indigo-50/70 shadow-sm shadow-indigo-950/[0.04] ring-2 ring-indigo-100"
                : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  selectedAnswer === option.id
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-300 bg-white text-slate-500"
                }`}
              >
                {selectedAnswer === option.id ? (
                  <BiCheckCircle size={17} />
                ) : String.fromCharCode(65 + index)}
              </div>
              <span className="font-medium leading-6 text-slate-700">
                {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:pt-6">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BsArrowLeft size={18} />
          Sebelumnya
        </button>

        {!isLastQuestion ? (
          <button
            onClick={onNext}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            Selanjutnya
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:bg-slate-400"
          >
            {isSubmitting ? "Mengirim..." : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
}
