import React, { useState, useContext } from "react";
import { CategoryContext } from "../context/CategoryContext";

function TaskInput({ addTask, inputRef }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("None");
  const { categories } = useContext(CategoryContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTask({
        id: Date.now(),
        text,
        completed: false,
        category,
      });
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a task..."
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}

export default TaskInput;
