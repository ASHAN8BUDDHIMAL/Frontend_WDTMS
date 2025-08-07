import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskLocation from '../Components/TaskLocation';
import ShowNotice from '../Components/ShowNotice';

const TaskPage = ({ taskId = null }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    allocatedTime: '',
    scheduledDate: '',
    allocatedAmount: ''
  });

  const [isEditing] = useState(!!taskId);
  const [taskCreated, setTaskCreated] = useState(false);
  const [locationSaved, setLocationSaved] = useState(false);

  // Load task if editing
  useEffect(() => {
    if (isEditing && taskId) {
      axios.get(`http://localhost:8080/api/task/${taskId}`, { withCredentials: true })
        .then((res) => {
          setTask(res.data);
          setTaskCreated(true);
        })
        .catch((err) => {
          console.error('Failed to load task:', err);
          alert('Failed to load task');
        });
    }
  }, [isEditing, taskId]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    axios.post('http://localhost:8080/api/task', task, { withCredentials: true })
      .then((res) => {
        alert('Task created! Now set the location.');
        setTaskCreated(true);
        setTask(res.data);
      })
      .catch(() => alert('Failed to create task'));
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:8080/api/task/${task.id}`, task, { withCredentials: true })
      .then(() => {
        alert('Task updated successfully!');
      })
      .catch(() => alert('Failed to update task'));
  };

  const handleLocationSaved = () => {
    setLocationSaved(true);
    alert('Location saved successfully!');
  };

  return (
   <div
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ 
       backgroundImage: "url('https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')",
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-gray-900/60"></div>
      
      <div className="relative z-10 py-10">
        <div className="max-w-6xl mx-auto px-4 mt-10">
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 space-y-6">
            <ShowNotice />
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
              {isEditing ? 'Edit Task' : taskCreated ? 'Task Created - Set Location' : 'Create New Task'}
            </h1>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="title"
                placeholder="Title"
                value={task.title}
                onChange={handleChange}
                disabled={taskCreated && !isEditing}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                name="requiredSkills"
                placeholder="Required Skills"
                value={task.requiredSkills}
                onChange={handleChange}
                disabled={taskCreated && !isEditing}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                name="description"
                placeholder="Description"
                value={task.description}
                onChange={handleChange}
                disabled={taskCreated && !isEditing}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none md:col-span-2"
              />
              <input
                type="number"
                step="0.01"
                name="allocatedAmount"
                placeholder="Allocated Amount"
                value={task.allocatedAmount}
                onChange={handleChange}
                disabled={taskCreated && !isEditing}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="number"
                name="allocatedTime"
                placeholder="Task Duration (Hours)"
                value={task.allocatedTime}
                onChange={handleChange}
                disabled={taskCreated && !isEditing}
                className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="md:col-span-2">
                <label htmlFor="scheduledDate" className="block font-semibold mb-2 text-gray-700">Schedule Date and Time</label>
                <input
                  type="datetime-local"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={task.scheduledDate}
                  onChange={handleChange}
                  disabled={taskCreated && !isEditing}
                  className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Button */}
            {!taskCreated && !isEditing && (
              <div className="text-center">
                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-lg mt-6 shadow-lg hover:shadow-xl transition-all"
                >
                  Create Task
                </button>
              </div>
            )}

            {isEditing && (
              <div className="text-center">
                <button
                  onClick={handleUpdate}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg mt-6 shadow-lg hover:shadow-xl transition-all"
                >
                  Update Task
                </button>
              </div>
            )}

            {/* Location Section */}
            {taskCreated && (
              <div className="mt-8">
                <TaskLocation taskId={task.id} onLocationSaved={handleLocationSaved} />
              </div>
            )}

            {locationSaved && (
              <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg font-semibold">
                ✅ Task location saved successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;