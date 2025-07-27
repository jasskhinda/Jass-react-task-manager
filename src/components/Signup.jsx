import React, { useState } from "react";

function Signup({ onSignup, switchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find(u => u.username === username)) {
      setError("Username already exists");
      return;
    }
    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));
    onSignup(username);
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <button onClick={switchToLogin} style={{marginTop: 10}}>Already have an account? Login</button>
    </div>
  );
}

export default Signup; 