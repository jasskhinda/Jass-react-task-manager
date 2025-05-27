import React, {
  useReducer, useEffect, useMemo,
  useCallback, useRef, useLayoutEffect,
  useState, useContext
} from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { TaskStatsProvider } from "./context/TaskStatsContext";
import { CategoryProvider, CategoryContext } from "./context/CategoryContext";
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showMyDay, setShowMyDay] = useState(false);
  const inputRef = useRef(null);

  const { categories, addCategory } = useContext(CategoryContext) || {
    categories: [],
    addCategory: () => {}
  };

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

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const categoryMatch = selectedCategory === "All" || task.category === selectedCategory;
      const myDayMatch = !showMyDay || task.myDay === true;
      return !task.completed && categoryMatch && myDayMatch;
    });
  }, [tasks, selectedCategory, showMyDay]);

  return (
    <ThemeProvider>
      <CategoryProvider>
        <TaskStatsProvider tasks={tasks}>
          <div className="layout">
            <aside className="sidebar">
              <div className="logo">✔️ TaskPro</div>
              <nav>
                <ul>
                  <li onClick={() => { setShowMyDay(true); setSelectedCategory("All"); }}>
                    🌞 My Day
                  </li>
                  <li onClick={() => { setShowMyDay(false); setSelectedCategory("All"); }}>
                    All Tasks
                  </li>
                  {categories.map(cat => (
                    <li
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowMyDay(false);
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              </nav>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const newCat = prompt("Enter new category:");
                  if (newCat) addCategory(newCat);
                }}
              >
                <button type="submit">+ New Category</button>
              </form>
              <div className="bottom-links">
                <button>⚙ Settings</button>
                <button>⏏ Logout</button>
              </div>
            </aside>
            <main className="main-panel">
              <h1>{showMyDay ? "My Day" : selectedCategory === "All" ? "All your tasks" : selectedCategory}</h1>
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
