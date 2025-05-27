import React from "react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";

function Timer() {
  const { timeLeft, start, stop, reset } = usePomodoroTimer();

  return (
    <div>
      <h2>Pomodoro Timer</h2>
      <p>{timeLeft} seconds left</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Timer;
