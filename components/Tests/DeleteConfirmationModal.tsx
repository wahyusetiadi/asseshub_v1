// components/admin/DeleteConfirmationModal.tsx
"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <FiAlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Hapus Soal?</h3>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Soal ini akan dihapus secara permanen. Lanjutkan?
          </p>
        </div>
        <div className="p-4 bg-gray-50 flex gap-3 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-sm font-bold text-gray-600 bg-white border rounded-lg hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
