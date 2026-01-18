// src/hooks/useAlert.ts
import { AlertState } from "@/types/alert.types";
import { useEffect, useState } from "react";

export function useAlert(autoCloseMs = 3000) {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    variant: "info",
    title: "",
    message: "",
  });

  const showAlert = (payload: Omit<AlertState, "show">) => {
    setAlert({ ...payload, show: true });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, show: false }));
  };

  useEffect(() => {
    if (!alert.show) return;
    const timer = setTimeout(closeAlert, autoCloseMs);
    return () => clearTimeout(timer);
  }, [alert.show, autoCloseMs]);

  return { alert, showAlert, closeAlert };
}
