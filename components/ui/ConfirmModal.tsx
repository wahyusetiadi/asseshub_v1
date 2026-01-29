"use client";

import { useEffect } from "react";
import { BsExclamationTriangle } from "react-icons/bs";
import { BiTime } from "react-icons/bi";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;

  // 🔥 CBT context
  timeRemaining: number; // seconds
  unansweredCount: number;
  totalQuestions: number;

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title = "Konfirmasi Submit Ujian",
  description,
  confirmText = "Ya, Submit Ujian",
  cancelText = "Kembali",
  loading = false,
  timeRemaining,
  unansweredCount,
  totalQuestions,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-slate-300 border-b">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <BsExclamationTriangle
              className="text-yellow-600"
              size={24}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Setelah ujian disubmit, jawaban tidak dapat diubah.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Time remaining */}
          <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-gray-50 px-3 py-2">
            <BiTime className="text-blue-600" size={18} />
            <span className="text-sm text-gray-700">
              Sisa waktu:
              <strong className="ml-1">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </strong>
            </span>
          </div>

          {/* Unanswered warning */}
          {unansweredCount > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700 font-medium">
                ⚠️ {unansweredCount} dari {totalQuestions} soal
                belum dijawab.
              </p>
              <p className="text-xs text-red-600 mt-1">
                Soal yang belum dijawab akan dianggap salah.
              </p>
            </div>
          )}

          {/* Optional description */}
          {description && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-slate-300 border-t p-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="font-semibold px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="font-semibold px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] transition disabled:opacity-60"
          >
            {loading ? "Mengirim Jawaban..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
