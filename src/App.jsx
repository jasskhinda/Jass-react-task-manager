import React, { useReducer, useEffect, useMemo, useCallback, useRef, useLayoutEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { TaskStatsProvider } from "./context/TaskStatsContext";
import { CategoryProvider } from "./context/CategoryContext"; // ✅ you imported this, now we'll use it
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import TaskStats from "./components/TaskStats";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./App.css";

const initialState = [];

function taskReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.task];
    case "TOGGLE":
      return state.map(task =>
        task.id === action.id ? { ...task, completed: !task.completed } : task
      );
    case "DELETE":
      return state.filter(task => task.id !== action.id);
    default:
      return state;
  }
}

function App() {
  const [storedTasks, setStoredTasks] = useLocalStorage("tasks", initialState);
  const [tasks, dispatch] = useReducer(taskReducer, storedTasks);
  const inputRef = useRef(null);

  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks]);

  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [tasks]);

  const addTask = useCallback(task => {
    dispatch({ type: "ADD", task });
  }, []);

  const toggleTask = useCallback(id => {
    dispatch({ type: "TOGGLE", id });
  }, []);

  const deleteTask = useCallback(id => {
    dispatch({ type: "DELETE", id });
  }, []);

  const filteredTasks = useMemo(() => tasks.filter(task => !task.completed), [tasks]);

  return (
    <ThemeProvider>
      <CategoryProvider>
        <TaskStatsProvider tasks={tasks}>
          <div className="layout">
            <aside className="sidebar">
              <div className="logo">✔️ TaskPro</div>
              <nav>
                <ul>
                  <li>All Tasks</li>
                  <li>Home</li>
                  <li>School</li>
                  <li>Shopping</li>
                </ul>
              </nav>
              <div className="bottom-links">
                <button>⚙ Settings</button>
                <button>⏏ Logout</button>
              </div>
            </aside>
            <main className="main-panel">
              <h1>All your tasks</h1>
              <TaskInput addTask={addTask} inputRef={inputRef} />
              <TaskList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
              <TaskStats />
            </main>
          </div>
        </TaskStatsProvider>
      </CategoryProvider>
    </ThemeProvider>
  );
}

export default App;
