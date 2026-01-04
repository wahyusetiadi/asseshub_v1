// components/admin/QuestionCard.tsx
"use client";

import { BsTrash2 } from "react-icons/bs";
import { BiSave } from "react-icons/bi";

export interface Question {
  id: number; // Local ID untuk UI
  dbId?: string; // Database ID dari BE
  text: string;
  options: { id?: string; text: string; isCorrect: boolean }[];
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdateText: (id: number, text: string) => void;
  onUpdateOption: (
    questionId: number,
    optIndex: number,
    text: string
  ) => void;
  onSetCorrect: (questionId: number, optIndex: number) => void;
  onDelete: (id: number) => void;
  onSave: (question: Question) => void;
  isSaving: boolean;
}

export default function QuestionCard({
  question,
  index,
  onUpdateText,
  onUpdateOption,
  onSetCorrect,
  onDelete,
  onSave,
  isSaving,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Question Header */}
      <div className="p-5 border-b bg-linear-to-r from-gray-50 to-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">
              Pertanyaan #{index + 1}
            </h3>
            {question.dbId && (
              <span className="text-xs text-green-600 font-semibold">
                ✓ Tersimpan
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(question.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Hapus Soal"
        >
          <BsTrash2 size={18} />
        </button>
      </div>

      {/* Question Content */}
      <div className="p-5 space-y-4">
        {/* Question Text */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Teks Pertanyaan
          </label>
          <textarea
            value={question.text}
            onChange={(e) => onUpdateText(question.id, e.target.value)}
            placeholder="Tulis pertanyaan Anda di sini..."
            rows={3}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          />
        </div>

        {/* Options */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            Pilihan Jawaban
          </label>
          <div className="space-y-3">
            {question.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-3">
                {/* Radio Button */}
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={option.isCorrect}
                  onChange={() => onSetCorrect(question.id, optIndex)}
                  className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer"
                  title="Tandai sebagai jawaban benar"
                />

                {/* Option Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) =>
                      onUpdateOption(question.id, optIndex, e.target.value)
                    }
                    placeholder={`Opsi ${String.fromCharCode(65 + optIndex)}`}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition ${
                      option.isCorrect
                        ? "border-green-500 bg-green-50 focus:ring-green-500"
                        : "focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                </div>

                {/* Label */}
                <span className="text-xs font-bold text-gray-400 w-8">
                  {String.fromCharCode(65 + optIndex)}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Pilih opsi yang benar dengan klik radio button
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={() => onSave(question)}
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <BiSave size={20} />
          {isSaving
            ? "Menyimpan..."
            : question.dbId
            ? "💾 Update Soal"
            : "💾 Simpan Soal"}
        </button>
        {question.dbId && (
          <p className="text-xs text-gray-400 text-center">
            ⚠️ Fitur update belum tersedia. Hapus dan buat ulang jika perlu
            update.
          </p>
        )}
      </div>
    </div>
  );
}
