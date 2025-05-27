import React, { useState, useContext } from "react";
import { CategoryContext } from "../context/CategoryContext";

function TaskInput({ addTask, inputRef }) {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("None");
  const [priority, setPriority] = useState("Medium");
  const [myDay, setMyDay] = useState(false);
  const { categories } = useContext(CategoryContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTask({
        id: Date.now(),
        text,
        description,
        category,
        priority,
        myDay,
        completed: false,
      });
      setText("");
      setDescription("");
      setMyDay(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Task title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="High">🔥 High</option>
        <option value="Medium">⭐ Medium</option>
        <option value="Low">🌀 Low</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={myDay}
          onChange={(e) => setMyDay(e.target.checked)}
        />
        Add to My Day
      </label>
      <button type="submit">Add</button>
    </form>
  );
}

export default TaskInput;
