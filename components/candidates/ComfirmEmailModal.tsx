"use client";

import { BiX } from "react-icons/bi";
import { FiAlertCircle } from "react-icons/fi";
import { RiMvAiLine } from "react-icons/ri";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
  isSending: boolean;
}

export default function ConfirmEmailModal({ isOpen, onClose, onConfirm, count, isSending }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <RiMvAiLine size={18} className="text-blue-600" /> Konfirmasi Pengiriman
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><BiX size={20} /></button>
        </div>

        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {isSending ? (
               <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            ) : (
              <FiAlertCircle size={32} />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Kirim Kredensial?</h2>
          <p className="text-gray-500 text-sm">
            Anda akan mengirimkan email login ke <span className="font-bold text-gray-800">{count} kandidat</span>. Proses ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="p-4 bg-gray-50 flex gap-3">
          <button 
            disabled={isSending}
            onClick={onClose} 
            className="flex-1 py-2.5 border bg-white rounded-xl text-sm font-semibold hover:bg-gray-100 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button 
            disabled={isSending}
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            {isSending ? "Mengirim..." : "Ya, Kirim Sekarang"}
          </button>
        </div>
      </div>
    </div>
  );
}