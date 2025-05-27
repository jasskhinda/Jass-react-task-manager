import React, { createContext, useMemo } from "react";

export const TaskStatsContext = createContext();

export const TaskStatsProvider = ({ children, tasks }) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    return { total, completed };
  }, [tasks]);

  return (
    <TaskStatsContext.Provider value={stats}>
      {children}
    </TaskStatsContext.Provider>
  );
};
