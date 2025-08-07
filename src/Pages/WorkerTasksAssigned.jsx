import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShowNotice from '../Components/ShowNotice';

const WorkerTasksAssigned = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [activeTab, setActiveTab] = useState('ASSIGNED');

  const fetchAssignedTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/task-status/my', {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch assigned tasks:', err);
    }
  };

  useEffect(() => {
    fetchAssignedTasks();
  }, []);

  const handleStatusUpdate = async (taskId, newStatus) => {
    if (!taskId || !newStatus) return;

    try {
      setUpdatingTaskId(taskId);

      await axios.put(
        'http://localhost:8080/api/task-status/worker-update',
        { taskId, status: newStatus },
        { withCredentials: true }
      );

      alert(`✅ Task ${newStatus.toLowerCase()} successfully!`);
      await fetchAssignedTasks();
      setSelectedTask(null);
    } catch (err) {
      console.error(`❌ Failed to update task ${taskId}:`, err);
      alert('❌ Failed to update task status.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'ASSIGNED') return task.status === 'ASSIGNED';
    if (activeTab === 'CONFIRMED') return task.status === 'CONFIRMED';
    if (activeTab === 'COMPLETED') return task.status === 'COMPLETED';
    if (activeTab === 'INCOMPLETED') return task.status === 'INCOMPLETED';
    return false;
  });

  // Count tasks for each tab
  const taskCounts = {
    ASSIGNED: tasks.filter(t => t.status === 'ASSIGNED').length,
    CONFIRMED: tasks.filter(t => t.status === 'CONFIRMED').length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length,
    INCOMPLETED: tasks.filter(t => t.status === 'INCOMPLETED').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="max-w-6xl mx-auto px-4 mt-10">
        <div className="bg-white shadow-1xl rounded-2xl p-8 space-y-6 w-4xl">
          <ShowNotice />
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h2>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('ASSIGNED')}
              className={`py-2 px-4 font-medium text-sm focus:outline-none flex items-center ${
                activeTab === 'ASSIGNED'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Assigned
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {taskCounts.ASSIGNED}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('CONFIRMED')}
              className={`py-2 px-4 font-medium text-sm focus:outline-none flex items-center ${
                activeTab === 'CONFIRMED'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Confirmed
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {taskCounts.CONFIRMED}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('COMPLETED')}
              className={`py-2 px-4 font-medium text-sm focus:outline-none flex items-center ${
                activeTab === 'COMPLETED'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completed
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {taskCounts.COMPLETED}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('INCOMPLETED')}
              className={`py-2 px-4 font-medium text-sm focus:outline-none flex items-center ${
                activeTab === 'INCOMPLETED'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Incompleted
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {taskCounts.INCOMPLETED}
              </span>
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No {activeTab.toLowerCase()} tasks found.</p>
          ) : (
            <div className="space-y-4 p-4">
              {filteredTasks.map(task => (
                <div
                  key={task.taskId}
                  className="bg-white/90 backdrop-blur-sm border border-gray-500/50 rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Client Name */}
                    <div className="w-full sm:w-1/6">
                      {task.userId ? (
                        <span className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 text-sm sm:text-base">
                          {task.firstName} {task.lastName}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm sm:text-base">
                          Client not available
                        </span>
                      )}
                    </div>

                    {/* Task Details */}
                    <div className="w-full sm:w-2/6 text-sm text-gray-700 space-y-1">
                      <p><span className="font-medium">Task:</span> {task.title}</p>
                      <p><span className="font-medium">Skills:</span> {task.requiredSkills}</p>
                      <p><span className="font-medium">Scheduled:</span> {new Date(task.scheduledDate).toLocaleString()}</p>
                    </div>

                    {/* Status */}
                    <div className="w-full sm:w-1/6 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'ASSIGNED' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800' // For INCOMPLETED
                      }`}>
                        {task.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full sm:w-2/6 flex items-center justify-end gap-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedTask(selectedTask?.taskId === task.taskId ? null : task)}
                          className="px-4 py-2 rounded font-medium text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
                        >
                          {selectedTask?.taskId === task.taskId ? 'Hide' : 'View'}
                        </button>
                        
                        {/* Only show Accept/Reject for ASSIGNED tasks */}
                        {activeTab === 'ASSIGNED' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(task.taskId, 'ACCEPTED')}
                              className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-300 ${
                                updatingTaskId === task.taskId
                                  ? 'bg-green-300 text-gray-800 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
                              }`}
                              disabled={updatingTaskId === task.taskId}
                            >
                              {updatingTaskId === task.taskId ? 'Accepting...' : 'Accept'}
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(task.taskId, 'REJECTED')}
                              className={`px-4 py-2 rounded font-medium text-sm transition-colors duration-300 ${
                                updatingTaskId === task.taskId
                                  ? 'bg-red-300 text-gray-800 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600'
                              }`}
                              disabled={updatingTaskId === task.taskId}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Details Panel */}
                  {selectedTask?.taskId === task.taskId && (
                    <div className="mt-4 p-4 border-t border-gray-200 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3 text-gray-800">Task Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                          <p><span className="font-medium">Description:</span> {task.description}</p>
                          <p><span className="font-medium">Skills Required:</span> {task.requiredSkills}</p>
                        </div>
                        <div>
                          <p><span className="font-medium">Minimum Rating:</span> {task.minRating || 'Not specified'}</p>
                          <p><span className="font-medium">Allocated Amount:</span> ${task.allocatedAmount || '0'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerTasksAssigned;