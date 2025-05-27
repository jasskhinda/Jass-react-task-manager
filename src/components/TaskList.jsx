import React from "react";

function TaskList({ tasks, toggleTask, deleteTask }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <strong>{task.text}</strong>
              </div>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'white',
                  backgroundColor:
                    task.priority === 'High' ? '#e74c3c' :
                    task.priority === 'Medium' ? '#f39c12' : '#3498db'
                }}
              >
                {task.priority}
              </span>
            </div>
            {task.description && (
              <div style={{ fontSize: '0.9rem', marginTop: '4px', color: '#aaa' }}>
                {task.description}
              </div>
            )}
            <div style={{ fontSize: '0.8rem', marginTop: '2px', color: '#bbb' }}>
              📁 {task.category} {task.myDay ? "🌞" : ""}
            </div>
          </div>
          <button onClick={() => deleteTask(task.id)}>🗑</button>
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
