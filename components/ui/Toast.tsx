"use client";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning";
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  const styles = {
    success: "bg-green-50 border-green-300 text-green-700",
    error: "bg-red-50 border-red-300 text-red-700",
    warning: "bg-yellow-50 border-yellow-300 text-yellow-700",
  };

  return (
    <div
      className={`fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl 
      -translate-x-1/2 flex items-start justify-between gap-3 
      rounded-lg border px-4 py-3 shadow-lg ${styles[type]}`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
