// components/admin/QuestionCard.tsx
"use client";

import { useState } from "react";
import { BsTrash2 } from "react-icons/bs";
import { BiSave } from "react-icons/bi";
import { HiChevronDown } from "react-icons/hi";
import InputField from "../ui/InputFieled";
import Button from "../ui/Button";

export interface Question {
  id: number;
  dbId?: string;
  text: string;
  options: { id?: string; text: string; isCorrect: boolean }[];
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onUpdateText: (id: number, text: string) => void;
  onUpdateOption: (questionId: number, optIndex: number, text: string) => void;
  onSetCorrect: (questionId: number, optIndex: number) => void;

  onAddOption: (questionId: number) => void; // ➕
  onRemoveOption: (questionId: number, optIndex: number) => void; // ❌

  onDelete: (question: Question) => void;
  onSave: (question: Question) => void;
  isSaving: boolean;
}

export default function QuestionCard({
  question,
  index,
  onUpdateText,
  onUpdateOption,
  onSetCorrect,
  onAddOption,
  onRemoveOption,
  onDelete,
  onSave,
  isSaving,
}: QuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white mt-4 rounded-xl border border-slate-300 shadow-sm shadow-slate-300 overflow-hidden">
      {/* Header */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-5 border-b border-slate-300 bg-linear-to-r from-gray-50 to-blue-50 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>

          <div>
            <h3 className="font-bold text-gray-800">Pertanyaan #{index + 1}</h3>
            {question.dbId && (
              <span className="text-xs text-green-600 font-semibold">
                ✓ Tersimpan
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Delete */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(question);
            }}
            leftIcon={<BsTrash2 size={18} className="text-slate-400 hover:text-red-500" />}
            tooltip="Hapus Soal"
          />

          {/* Collapse Icon */}
          <HiChevronDown
            className={`w-6 h-6 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-5 space-y-4 animate-fadeIn">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Teks Pertanyaan
            </label>
            <textarea
              value={question.text}
              onChange={(e) => onUpdateText(question.id, e.target.value)}
              rows={3}
              placeholder="Tulis pertanyaan Anda di sini..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition resize-none"
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
                  <input
                    type="radio"
                    name={`correct-${question.id}`}
                    checked={option.isCorrect}
                    onChange={() => onSetCorrect(question.id, optIndex)}
                    className="w-5 h-5 text-green-600 cursor-pointer"
                  />
                  <InputField
                    type="text"
                    size="lg"
                    value={option.text}
                    onChange={(e) =>
                      onUpdateOption(question.id, optIndex, e.target.value)
                    }
                    placeholder={`Opsi ${String.fromCharCode(65 + optIndex)}`}
                  />

                  <span className="text-xs font-bold text-gray-400 w-6">
                    {String.fromCharCode(65 + optIndex)}
                  </span>

                  {/* {question.options.length > 2 && (
                    <button
                      onClick={() => onRemoveOption(question.id, optIndex)}
                      className="text-red-500 hover:text-red-700"
                      title="Hapus opsi"
                    >
                      <BsTrash2 size={16} />
                    </button>
                  )} */}
                </div>
              ))}
            </div>

            {question.options.length < 5 && (
              <button
                onClick={() => onAddOption(question.id)}
                className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
              >
                + Tambah Opsi
              </button>
            )}
          </div>

          {/* Save */}
          <Button
            onClick={() => onSave(question)}
            disabled={isSaving}
            variant="primary"
            size="lg"
            className="w-full"
            leftIcon={<BiSave size={20} />}
            title={
              isSaving
                ? "Menyimpan..."
                : question.dbId
                ? "Update Soal"
                : "Simpan Soal"
            }
          />
        </div>
      )}
    </div>
  );
}
