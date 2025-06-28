import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FindWorker = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [matchedWorkers, setMatchedWorkers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/task', {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/task/${id}`, {
        withCredentials: true,
      });
      fetchTasks();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      const { location, latitude, longitude, ...taskWithoutLocation } = editTask;
      await axios.put(
        `http://localhost:8080/api/task/${editTask.id}`,
        taskWithoutLocation,
        { withCredentials: true }
      );
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleFindWorkers = async (task) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/match/workers/${task.id}`,
        { withCredentials: true }
      );
      setMatchedWorkers(response.data);
      setSelectedTaskId(task.id);
    } catch (err) {
      console.error('Error finding matched workers:', err);
    }
  };

const handleSendTask = async (worker) => {
  const workerId = worker.userId;      // Assuming worker.userId is correct
  const taskId = selectedTaskId;       // Selected task ID

  if (!taskId || !workerId) {
    return alert('❌ Missing task or worker ID.');
  }

  try {
    // Use PUT (not POST) to match your backend mapping
    await axios.put(
      'http://localhost:8080/api/task-status/update',
      { taskId, workerId, status: 'ASSIGNED' },
      { withCredentials: true }
    );

    alert('✅ Task assigned!');
  } catch (err) {
    console.error(err);
    alert('❌ Assignment failed—see console.');
  }
};





  return (
    <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-7xl mx-auto px-4">
      <div className="flex gap-6 mt-16">
        {/* Left side - Task List & Edit Form */}
        <div className="w-2/4">
          <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li key={task.id} className="border p-4 rounded shadow flex justify-between items-center">
                <span className="font-medium">{task.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTask(task)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleFindWorkers(task)}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    Find Workers
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Edit Task Form */}
         {editTask && (
  <div className="mt-6 border p-4 rounded shadow">
    <h3 className="text-lg font-semibold mb-2">Edit Task</h3>

    {/* Title */}
    <input
      className="w-full border p-2 mb-2 rounded"
      type="text"
      value={editTask.title}
      onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
      placeholder="Title"
    />

    {/* Description */}
    <textarea
      className="w-full border p-2 mb-2 rounded"
      value={editTask.description}
      onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
      placeholder="Description"
    />

    {/* Required Skills */}
    <input
      className="w-full border p-2 mb-2 rounded"
      type="text"
      value={editTask.requiredSkills}
      onChange={(e) => setEditTask({ ...editTask, requiredSkills: e.target.value })}
      placeholder="Required Skills"
    />

    {/* Minimum Rating */}
    <input
      className="w-full border p-2 mb-2 rounded"
      type="number"
      step="0.1"
      value={editTask.minRating}
      onChange={(e) => setEditTask({ ...editTask, minRating: parseFloat(e.target.value) })}
      placeholder="Minimum Rating"
    />

    {/* Scheduled Date */}
    <input
      className="w-full border p-2 mb-2 rounded"
      type="datetime-local"
      value={editTask.scheduledDate ? editTask.scheduledDate.slice(0, 16) : ''}
      onChange={(e) => setEditTask({ ...editTask, scheduledDate: e.target.value })}
    />

    {/* Allocated Amount */}
    <input
      className="w-full border p-2 mb-2 rounded"
      type="number"
      step="0.01"
      value={editTask.allocatedAmount}
      onChange={(e) => setEditTask({ ...editTask, allocatedAmount: parseFloat(e.target.value) })}
      placeholder="Allocated Amount"
    />

    {/* Buttons */}
    <button
      onClick={handleUpdate}
      className="bg-green-600 text-white px-4 py-2 rounded mr-2"
    >
      Save
    </button>
    <button
      onClick={() => setEditTask(null)}
      className="px-4 py-2 border rounded"
    >
      Cancel
    </button>
  </div>
)}
        </div>

        {/* Right side - Matched Workers */}
        <div className="w-2/4 bg-gray-100 border p-4 rounded shadow h-fit">
          <h2 className="text-xl font-bold mb-3">Matched Workers</h2>
          {matchedWorkers.length === 0 ? (
            <p>No workers matched.</p>
          ) : (
            <ul className="space-y-3">
              {matchedWorkers.map((workerItem) => (
                <li key={workerItem.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{workerItem.fullName}</p>
                    <p className="text-sm text-gray-600">{workerItem.skills}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/view-profile/${workerItem.userId}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleSendTask(workerItem)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Send Task
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindWorker;
