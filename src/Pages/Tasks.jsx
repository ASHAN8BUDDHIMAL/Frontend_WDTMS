import React, { useState } from 'react';
import axios from 'axios';
import Location from '../Components/Location';
const TaskPage = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    minRating: '',
    scheduledDate: '',
    allocatedAmount: ''
  });

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    axios.post('http://localhost:8080/api/task', newTask, { withCredentials: true })
      .then(res => {
        alert('Task created');
        setNewTask({
          title: '',
          description: '',
          requiredSkills: '',
          minRating: '',
          scheduledDate: '',
          allocatedAmount: ''
        });
      })
      .catch(() => alert('Failed to create task'));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto pt-20">
      <h1 className="text-3xl font-bold mb-6">Create New Task</h1>

      <div className="mb-8 p-4 border rounded shadow">
        <input
          name="title"
          placeholder="Title"
          value={newTask.title}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          name="requiredSkills"
          placeholder="Required Skills"
          value={newTask.requiredSkills}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          step="0.01"
          name="allocatedAmount"
          placeholder="Allocated Amount"
          value={newTask.allocatedAmount}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="number"
          name="minRating"
          placeholder="Min Rating"
          value={newTask.minRating}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="datetime-local"
          name="scheduledDate"
          value={newTask.scheduledDate}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Task
        </button>
      </div>
      <Location/>
    </div>
  );
};

export default TaskPage;
