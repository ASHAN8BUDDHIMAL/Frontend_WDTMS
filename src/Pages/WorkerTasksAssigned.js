import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WorkerTasksAssigned = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your backend endpoint and worker ID (e.g., from session or token)
    axios.get('http://localhost:8080/api/tasks/assigned/worker/123')
      .then(response => {
        setTasks(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching assigned tasks:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <div className="grid gap-4">
          {tasks.map(task => (
            <div key={task.id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Date:</strong> {task.date}</p>
              <p><strong>Time:</strong> {task.time}</p>
              <p><strong>Status:</strong> {task.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerTasksAssigned;
