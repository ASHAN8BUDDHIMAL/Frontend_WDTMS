import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WorkerTasksAssigned = () => {
  const [tasks, setTasks] = useState([]);
  const [workerId, setWorkerId] = useState(null); // Store the worker ID
  const navigate = useNavigate();

  // Fetch worker ID from session/localStorage
  useEffect(() => {
    const savedId = localStorage.getItem('workerId');
    if (savedId) {
      setWorkerId(savedId);
    } else {
      console.error('❌ No worker ID found in storage/session');
    }
  }, []);

  // Fetch assigned tasks
  const fetchAssignedTasks = useCallback(async () => {
    if (!workerId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/task-status/${workerId}`, {
        withCredentials: true,
      });
      console.log('✅ Assigned tasks response:', res.data);
      setTasks(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch assigned tasks:', err);
    }
  }, [workerId]);

  useEffect(() => {
    if (workerId) {
      fetchAssignedTasks();
    }
  }, [workerId, fetchAssignedTasks]);

  // Accept or reject task
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axios.put('http://localhost:8080/api/task-status/update', {
        taskId,
        status: newStatus,
        workerId,
      }, {
        withCredentials: true,
      });
      fetchAssignedTasks(); // refresh the list
    } catch (err) {
      console.error(`❌ Failed to update task ${taskId} status to ${newStatus}:`, err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No assigned tasks found.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.taskId} className="border rounded-lg p-4 shadow bg-white">
              <h3 className="text-xl font-semibold mb-1">{task.title}</h3>
              <p className="text-sm mb-1">
                Client:{' '}
                <span
                  className="text-blue-600 hover:underline cursor-pointer"
                  onClick={() => navigate(`/user-profile/${task.userId}`)}
                >
                  {task.firstName} {task.lastName}
                </span>
              </p>
              <p className="text-sm mb-1">Status: <strong>{task.status}</strong></p>
              <p className="text-sm mb-2">Scheduled: {new Date(task.scheduledDate).toLocaleString()}</p>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleStatusUpdate(task.taskId, 'ACCEPTED')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  ✅ Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(task.taskId, 'REJECTED')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  ❌ Reject
                </button>
                <button
                  onClick={() => navigate(`/task-details/${task.taskId}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  👁️ View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerTasksAssigned;
