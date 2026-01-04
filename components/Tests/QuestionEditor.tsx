"use client";
import { Question } from "@/types/testTypes";
import { BiPlusCircle } from "react-icons/bi";
import { BsTrash2 } from "react-icons/bs";

interface Props {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
}

export default function QuestionEditor({ questions, setQuestions }: Props) {
  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectChange = (qIndex: number, oIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correct = oIndex;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: "", options: ["", "", "", ""], correct: 0 },
    ]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1)
      setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md text-sm">
          Step 2
        </span>
        Susun Pertanyaan
      </h2>

      {questions.map((q, qIndex) => (
        <div
          key={q.id}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Pertanyaan #{qIndex + 1}
            </span>
            <button
              onClick={() => removeQuestion(q.id)}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <BsTrash2 size={18} />
            </button>
          </div>

          <textarea
            value={q.text}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Tuliskan butir soal di sini..."
            rows={3}
          />

          <div className="grid gap-3">
            {q.options.map((option, oIndex) => (
              <div key={oIndex} className="flex gap-3 items-center group">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correct === oIndex}
                  onChange={() => handleCorrectChange(qIndex, oIndex)}
                  className="w-4 h-4 text-blue-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  placeholder={`Pilihan ${String.fromCharCode(65 + oIndex)}`}
                  className="flex-1 p-2 bg-white border border-gray-200 rounded-md text-sm focus:border-blue-500 outline-none"
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 italic">
            * Pilih radio button untuk menentukan kunci jawaban.
          </p>
        </div>
      ))}

      <button
        onClick={addQuestion}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 flex items-center justify-center gap-2 transition-all"
      >
        <BiPlusCircle size={20} /> Tambah Pertanyaan
      </button>
    </div>
  );
}
