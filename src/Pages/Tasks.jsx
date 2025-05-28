import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    location: '',
    minRating: '',
    scheduledDate: '',
    allocatedAmount: ''
  });
  const [matchedWorkers, setMatchedWorkers] = useState([]);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8080/api/task', { withCredentials: true })
      .then(res => setTasks(res.data))
      .catch(err => alert('Failed to fetch tasks'));
  };

  // Handle input change
  const handleChange = (e, setFunc, obj) => {
    setFunc({ ...obj, [e.target.name]: e.target.value });
  };

  // Submit new task
  const handleCreate = () => {
    axios.post('http://localhost:8080/api/task', newTask, { withCredentials: true })
      .then(res => {
        setTasks([...tasks, res.data]);
        setNewTask({
          title: '',
          description: '',
          requiredSkills: '',
          location: '',
          minRating: '',
          scheduledDate: '',
          allocatedAmount: ''
        });
        alert('Task created');
      })
      .catch(() => alert('Failed to create task'));
  };

  // Submit updated task
  const handleUpdate = () => {
    axios.put(`http://localhost:8080/api/task/${editTask.id}`, editTask, { withCredentials: true })
      .then(res => {
        setTasks(tasks.map(t => (t.id === res.data.id ? res.data : t)));
        setEditTask(null);
        alert('Task updated');
      })
      .catch(() => alert('Failed to update task'));
  };

  // Delete task
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8080/api/task/${id}`, { withCredentials: true })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
        alert('Task deleted');
      })
      .catch(() => alert('Failed to delete task'));
  };

  // Find matched workers
  const handleFindWorkers = (task) => {
    axios.post(`http://localhost:8080/api/find/matched-workers`, task, { withCredentials: true })
      .then(res => setMatchedWorkers(res.data))
      .catch(() => alert('Failed to find workers'));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pt-20">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>

      {/* Create Task Form */}
      <div className="mb-8 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Create New Task</h2>
        {['title', 'description', 'requiredSkills', 'location', 'allocatedAmount'].map(field => (
          <input
            key={field}
            name={field}
            placeholder={field}
            value={newTask[field]}
            onChange={(e) => handleChange(e, setNewTask, newTask)}
            className="border p-2 mb-2 w-full"
          />
        ))}
        <input
          type="number"
          name="minRating"
          placeholder="Min Rating"
          value={newTask.minRating}
          onChange={(e) => handleChange(e, setNewTask, newTask)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="datetime-local"
          name="scheduledDate"
          value={newTask.scheduledDate}
          onChange={(e) => handleChange(e, setNewTask, newTask)}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Task
        </button>
      </div>

      {/* Task list */}
      <ul className="space-y-3 mb-6">
        {tasks.map(task => (
          <li key={task.id} className="p-4 border rounded shadow flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{task.title}</h2>
                <p>{task.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => setEditTask(task)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                  onClick={() => handleFindWorkers(task)}
                >
                  Find Workers
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Task Form */}
      {editTask && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Edit Task</h2>
          {['title', 'description', 'requiredSkills', 'location', 'allocatedAmount'].map(field => (
            <input
              key={field}
              name={field}
              value={editTask[field]}
              onChange={(e) => handleChange(e, setEditTask, editTask)}
              placeholder={field}
              className="border p-2 mb-2 w-full"
            />
          ))}
          <input
            type="number"
            name="minRating"
            value={editTask.minRating}
            onChange={(e) => handleChange(e, setEditTask, editTask)}
            placeholder="Min Rating"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="datetime-local"
            name="scheduledDate"
            value={editTask.scheduledDate ? editTask.scheduledDate.substring(0, 16) : ''}
            onChange={(e) => handleChange(e, setEditTask, editTask)}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditTask(null)}
            className="ml-2 px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Matched Workers List */}
      {matchedWorkers.length > 0 && (
        <div className="mt-10 border p-4 rounded shadow bg-gray-100">
          <h2 className="text-xl font-bold mb-3">Matched Workers</h2>
          <ul className="list-disc pl-5">
            {matchedWorkers.map(worker => (
              <li key={worker.id} className="mb-2">
                <strong>{worker.name}</strong> — {worker.skill}, {worker.location}, ⭐ {worker.rating}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskPage;
