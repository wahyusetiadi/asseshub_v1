import { useEffect, useRef } from "react";
import userService from "@/app/api/services/userService";

export function useExamSync(
  testId: string,
  isInitialized: boolean,
  isExamFinished: React.MutableRefObject<boolean>,
  onTimeSync: (seconds: number) => void,
  onTimeUp: () => void
) {
  const hasAutoSubmitted = useRef(false);

  // Sync timer setiap 30 detik
  useEffect(() => {
    if (!isInitialized || isExamFinished.current) return;

    const syncInterval = setInterval(async () => {
      try {
        console.log("🔄 Syncing timer with backend...");

        const statusResponse = await userService.checkStatus(testId);
        const statusData = statusResponse?.data?.data || statusResponse?.data;
        const remaining_ms = statusData?.remaining_duration;

        if (typeof remaining_ms !== "number") {
          console.warn("⚠️ Invalid remaining_duration, skipping sync");
          return;
        }

        const remaining = Math.floor(remaining_ms / 1000);
        console.log("📊 Sync result:", { remaining_sec: remaining });

        onTimeSync(remaining);

        if (remaining <= 0 && !hasAutoSubmitted.current) {
          console.log("⚠️ Time is up from backend sync");
          hasAutoSubmitted.current = true;
          onTimeUp();
        }
      } catch (error) {
        console.error("❌ Error syncing timer:", error);
      }
    }, 30000);

    return () => clearInterval(syncInterval);
  }, [testId, isInitialized, isExamFinished, onTimeSync, onTimeUp]);

  // Visibility change detection
  useEffect(() => {
    if (isExamFinished.current) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        console.log("👁️ Tab became visible, checking exam status...");

        try {
          const statusResponse = await userService.checkStatus(testId);
          const statusData = statusResponse?.data?.data || statusResponse?.data;
          const remaining_ms = statusData?.remaining_duration || 0;
          const remaining = Math.floor(remaining_ms / 1000);

          console.log("🔍 Status after tab visible:", { remaining_sec: remaining });

          if (remaining <= 0) {
            alert("⏰ Waktu ujian telah habis saat Anda tidak aktif.");
            onTimeUp();
          } else {
            onTimeSync(remaining);
          }
        } catch (error) {
          console.error("Error checking status on visibility change:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [testId, isExamFinished, onTimeSync, onTimeUp]);
}