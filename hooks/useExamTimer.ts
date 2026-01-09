import { useReducer, useEffect, useRef } from "react";

type TimerState = {
  timeRemaining: number;
  isTimeUp: boolean;
};

type TimerAction =
  | { type: "SYNC"; payload: number }
  | { type: "TICK" }
  | { type: "TIME_UP" };

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case "SYNC":
      return {
        timeRemaining: action.payload,
        isTimeUp: action.payload <= 0,
      };
    case "TICK":
      const newTime = state.timeRemaining - 1;
      return {
        timeRemaining: Math.max(0, newTime),
        isTimeUp: newTime <= 0,
      };
    case "TIME_UP":
      return {
        ...state,
        isTimeUp: true,
      };
    default:
      return state;
  }
};

export const useExamTimer = (initialTime: number) => {
  const [state, dispatch] = useReducer(timerReducer, {
    timeRemaining: initialTime,
    isTimeUp: initialTime <= 0,
  });

  const prevInitialTimeRef = useRef(initialTime);

  // ✅ Sync dengan backend
  useEffect(() => {
    if (prevInitialTimeRef.current !== initialTime) {
      console.log("⏱️ Timer synced:", prevInitialTimeRef.current, "→", initialTime);
      prevInitialTimeRef.current = initialTime;
      dispatch({ type: "SYNC", payload: initialTime });
    }
  }, [initialTime]);

  // ✅ Countdown timer
  useEffect(() => {
    if (state.timeRemaining <= 0) {
      if (!state.isTimeUp) {
        dispatch({ type: "TIME_UP" });
      }
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.timeRemaining, state.isTimeUp]);

  // ✅ Format waktu
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return {
    timeRemaining: state.timeRemaining,
    setTimeRemaining: (value: number) => dispatch({ type: "SYNC", payload: value }),
    formatTime,
    isTimeUp: state.isTimeUp,
  };
};
