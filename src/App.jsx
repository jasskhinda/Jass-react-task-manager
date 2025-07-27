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
import Login from "./components/Login";
import Signup from "./components/Signup";
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
  const [authUser, setAuthUser] = useLocalStorage("authUser", null);
  const [showSignup, setShowSignup] = useState(false);

  const { categories, addCategory, deleteCategory } = useContext(CategoryContext) || {
    categories: [],
    addCategory: () => {},
    deleteCategory: () => {}
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

  // Logout handler
  const handleLogout = () => {
    setAuthUser(null);
  };

  // Auth screens
  if (!authUser) {
    return showSignup ? (
      <Signup
        onSignup={username => {
          setAuthUser(username);
          setShowSignup(false);
        }}
        switchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <Login
        onLogin={username => setAuthUser(username)}
        switchToSignup={() => setShowSignup(true)}
      />
    );
  }

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
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowMyDay(false);
                      }}
                    >
                      <span>{cat}</span>
                      {cat !== 'None' && cat !== 'All' && (
                        <button
                          style={{ marginLeft: 8, background: 'none', color: '#e74c3c', border: 'none', cursor: 'pointer', fontSize: '1.1em' }}
                          onClick={e => {
                            e.stopPropagation();
                            deleteCategory(cat);
                            if (selectedCategory === cat) setSelectedCategory('All');
                          }}
                          title={`Delete ${cat}`}
                        >
                          🗑
                        </button>
                      )}
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
                <button onClick={handleLogout}>⏏ Logout</button>
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
