import { BiCheckCircle } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { Question } from "@/types/exam.types";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  selectedAnswer: string | undefined;
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
  onAnswerSelect,
  onPrevious,
  onNext,
  isFirstQuestion,
  isLastQuestion,
  onSubmit,
  isSubmitting,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-8">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
          Pertanyaan #{questionIndex + 1}
        </span>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{question.text}</h2>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={option.id}
            onClick={() => onAnswerSelect(question.id, option.id)}
            className={`w-full text-left p-4 rounded-lg border-2 transition ${
              selectedAnswer === option.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedAnswer === option.id
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selectedAnswer === option.id && (
                  <BiCheckCircle className="text-white" size={16} />
                )}
              </div>
              <span className="font-medium text-gray-700">
                {String.fromCharCode(65 + index)}. {option.text}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button
          onClick={onPrevious}
          disabled={isFirstQuestion}
          className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <BsArrowLeft size={18} />
          Sebelumnya
        </button>

        {!isLastQuestion ? (
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Selanjutnya
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {isSubmitting ? "Mengirim..." : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
}
