import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useExamProtection(
  isExamFinished: React.MutableRefObject<boolean>,
  onForceExit: () => void
) {
  const router = useRouter();

  useEffect(() => {
    // Prevent page reload/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isExamFinished.current) {
        e.preventDefault();
        e.returnValue = "Ujian masih berlangsung. Yakin ingin keluar?";
        return e.returnValue;
      }
    };

    // Prevent back button
    const handlePopState = () => {
      if (!isExamFinished.current) {
        const confirmLeave = window.confirm(
          "Ujian masih berlangsung. Jika Anda keluar, ujian akan otomatis tersubmit. Yakin ingin keluar?"
        );

        if (!confirmLeave) {
          window.history.pushState(null, "", window.location.href);
        } else {
          onForceExit();
        }
      }
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "w" || e.key === "q")) ||
        (e.altKey && e.key === "F4")
      ) {
        if (!isExamFinished.current) {
          e.preventDefault();
          alert("Tidak dapat menutup tab saat ujian berlangsung!");
        }
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExamFinished, onForceExit]);
}