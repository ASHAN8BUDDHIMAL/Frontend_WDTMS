import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskLocation from '../Components/TaskLocation';
import ShowNotice from '../Components/ShowNotice';

const TaskPage = ({ taskId = null }) => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    minRating: '',
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
          setTaskCreated(true); // since the task already exists
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
        setTask(res.data); // save task ID if returned
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
           <ShowNotice />
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
            {isEditing ? 'Edit Task' : taskCreated ? 'Task Created - Set Location' : 'Create New Task'}
          </h1>

          {/* Form Fields */}
          <input
            name="title"
            placeholder="Title"
            value={task.title}
            onChange={handleChange}
            disabled={taskCreated && !isEditing}
            className="border p-3 rounded w-full"
          />
          <input
            name="description"
            placeholder="Description"
            value={task.description}
            onChange={handleChange}
            disabled={taskCreated && !isEditing}
            className="border p-3 rounded w-full"
          />
          <input
            name="requiredSkills"
            placeholder="Required Skills"
            value={task.requiredSkills}
            onChange={handleChange}
            disabled={taskCreated && !isEditing}
            className="border p-3 rounded w-full"
          />
          <input
            type="number"
            step="0.01"
            name="allocatedAmount"
            placeholder="Allocated Amount"
            value={task.allocatedAmount}
            onChange={handleChange}
            disabled={taskCreated && !isEditing}
            className="border p-3 rounded w-full"
          />
          <input
            type="number"
            name="minRating"
            placeholder="Min Rating"
            value={task.minRating}
            onChange={handleChange}
            disabled={taskCreated && !isEditing}
            className="border p-3 rounded w-full"
          />
          <div>
            <label htmlFor="scheduledDate" className="block font-semibold mb-1">Schedule Date and Time</label>
            <input
              type="datetime-local"
              id="scheduledDate"
              name="scheduledDate"
              value={task.scheduledDate}
              onChange={handleChange}
              disabled={taskCreated && !isEditing}
              className="border p-3 rounded w-full"
            />
          </div>

          {/* Action Button */}
          {!taskCreated && !isEditing && (
            <div className="text-center">
              <button
                onClick={handleCreate}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg mt-4"
              >
                Create Task
              </button>
            </div>
          )}

          {isEditing && (
            <div className="text-center">
              <button
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg mt-4"
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
            <div className="text-green-700 text-center font-semibold">✅ Task location saved successfully!</div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TaskPage;
