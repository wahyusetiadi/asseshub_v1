// hooks/useExamTimer.ts
import { useEffect, useReducer, useCallback } from "react";

type TimerState = {
  timeRemaining: number;
  isTimeUp: boolean;
};

type TimerAction = { type: "SET"; payload: number } | { type: "TIME_UP" };

const reducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case "SET":
      return {
        timeRemaining: action.payload,
        isTimeUp: action.payload <= 0,
      };
    case "TIME_UP":
      return {
        timeRemaining: 0,
        isTimeUp: true,
      };
    default:
      return state;
  }
};

export const useExamTimer = (endTime: number | null) => {
  const [state, dispatch] = useReducer(reducer, {
    timeRemaining: 0,
    isTimeUp: false,
  });

  useEffect(() => {
    if (!endTime) {
      console.warn("⚠️ No endTime provided to timer");
      return;
    }

    const tick = () => {
      const now = Date.now();
      const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000));

      // Logging untuk debugging (hapus di production)
      if (remainingSeconds <= 60 && remainingSeconds % 10 === 0) {
        console.log(`⏰ ${remainingSeconds} seconds remaining`);
      }

      dispatch({ type: "SET", payload: remainingSeconds });

      if (remainingSeconds <= 0) {
        console.log("⏰ TIME IS UP!");
        dispatch({ type: "TIME_UP" });
      }
    };

    // Initial tick
    tick();

    // Update every second
    const interval = setInterval(tick, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [endTime]);

  const formatTime = useCallback((seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return h > 0
      ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, []);

  return {
    timeRemaining: state.timeRemaining,
    isTimeUp: state.isTimeUp,
    formatTime,
  };
};
