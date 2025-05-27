import { useState, useRef, useCallback } from "react";

export function usePomodoroTimer(initialTime = 1500) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    if (intervalRef.current !== null) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setTimeLeft(initialTime);
  }, [initialTime, stop]);

  return { timeLeft, start, stop, reset };
}
