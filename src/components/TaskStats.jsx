import React, { useContext } from "react";
import { TaskStatsContext } from "../context/TaskStatsContext";

function TaskStats() {
  const { total, completed } = useContext(TaskStatsContext);
  return (
    <div>
      <p>Total Tasks: {total}</p>
      <p>Completed Tasks: {completed}</p>
    </div>
  );
}

export default TaskStats;
