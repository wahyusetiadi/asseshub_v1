// hooks/useExamTimer.ts
import { useEffect, useReducer } from "react";

type TimerState = {
  timeRemaining: number;
  isTimeUp: boolean;
};

type TimerAction =
  | { type: "SET"; payload: number }
  | { type: "TIME_UP" };

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
    if (!endTime) return;

    const tick = () => {
      const remainingSeconds = Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
      );

      dispatch({ type: "SET", payload: remainingSeconds });

      if (remainingSeconds <= 0) {
        dispatch({ type: "TIME_UP" });
      }
    };

    tick(); // initial
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return h > 0
      ? `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      : `${m.toString().padStart(2, "0")}:${s
          .toString()
          .padStart(2, "0")}`;
  };

  return {
    timeRemaining: state.timeRemaining,
    isTimeUp: state.isTimeUp,
    formatTime,
  };
};
