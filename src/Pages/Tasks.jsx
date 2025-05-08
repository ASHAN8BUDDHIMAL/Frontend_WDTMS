import React, { useState, useEffect } from 'react';

// Placeholder for real API call
const fetchTasks = async () => {
  // Replace with your actual API call
  return [];
};

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const loadTasks = async () => {
      const data = await fetchTasks();
      setTasks(data);
    };
    loadTasks();
  }, []);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setFormVisible(true);
  };

  const handleDelete = (taskID) => {
    setTasks(tasks.filter((task) => task.TaskID !== taskID));
  };

  const handleSave = (task) => {
    if (task.TaskID) {
      setTasks(tasks.map((t) => (t.TaskID === task.TaskID ? task : t)));
    } else {
      setTasks([...tasks, { ...task, TaskID: Date.now() }]);
    }
    setFormVisible(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 pt-24">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Available Tasks</h1>
        {!formVisible ? (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setFormVisible(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create New Task
              </button>
            </div>
            {tasks.length > 0 ? (
              <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />
            ) : (
              <p className="text-center text-gray-500">No tasks available.</p>
            )}
          </>
        ) : (
          <TaskForm
            task={selectedTask}
            onSave={handleSave}
            onCancel={() => setFormVisible(false)}
          />
        )}
      </div>
    </div>
  );
};

const TaskList = ({ tasks, onEdit, onDelete }) => (
  <div>
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">All Tasks</h2>
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li
          key={task.TaskID}
          className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-medium text-blue-800">{task.title}</h3>
              <p className="text-sm text-gray-600">Date: {task.ScheduledDate}</p>
              <p className="text-sm text-gray-600">Location: {task.location}</p>
              <p className="text-sm text-gray-600">Amount: ${task.AllocatedAmount}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.TaskID)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formState, setFormState] = useState(
    task || {
      title: '',
      description: '',
      ScheduledDate: '',
      location: '',
      AllocatedAmount: '',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        {task ? 'Edit Task' : 'Create Task'}
      </h2>
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formState.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          name="description"
          value={formState.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Scheduled Date</label>
        <input
          type="date"
          name="ScheduledDate"
          value={formState.ScheduledDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={formState.location}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Allocated Amount</label>
        <input
          type="number"
          name="AllocatedAmount"
          value={formState.AllocatedAmount}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskPage;
