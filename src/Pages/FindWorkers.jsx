import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiEdit, FiTrash2, FiSearch, FiSend, FiUser, FiX, FiCheck, FiDollarSign, FiCalendar, FiStar, FiTool } from 'react-icons/fi';

const FindWorker = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [matchedWorkers, setMatchedWorkers] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tasks');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/task', {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
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
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/match/workers/${task.id}`,
        { withCredentials: true }
      );
      
      // Sort workers by score in descending order
      const sortedWorkers = response.data.sort((a, b) => b.score - a.score);
      
      setMatchedWorkers(sortedWorkers);
      setSelectedTaskId(task.id);
      setActiveTab('workers');
    } catch (err) {
      console.error('Error finding matched workers:', err);
    } finally {
      setIsLoading(false);
    }
};


  const handleSendTask = async (worker) => {
    const workerId = worker.userId;
    const taskId = selectedTaskId;

    if (!taskId || !workerId) {
      return alert('❌ Missing task or worker ID.');
    }

    try {
      await axios.put(
        'http://localhost:8080/api/task-status/update',
        { taskId, workerId, status: 'ASSIGNED' },
        { withCredentials: true }
      );
      alert('✅ Task assigned successfully!');
      setMatchedWorkers(matchedWorkers.filter(w => w.userId !== workerId));
    } catch (err) {
      console.error(err);
      alert('❌ Assignment failed. Please try again.');
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

   return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 mt-12">
          <p className="mt-3 text-xl text-gray-500">
            Find the perfect worker for your tasks
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('tasks')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 'tasks' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                aria-current={activeTab === 'tasks' ? 'page' : undefined}
              >
                <FiTool className="h-5 w-5" />
                <span>My Tasks</span>
              </button>
              <button
                onClick={() => setActiveTab('workers')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center space-x-2 ${activeTab === 'workers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                disabled={matchedWorkers.length === 0}
                aria-current={activeTab === 'workers' ? 'page' : undefined}
              >
                <FiUser className="h-5 w-5" />
                <span>Matched Workers ({matchedWorkers.length})</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      aria-label="Search tasks"
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <FiTool className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Try a different search term' : 'Get started by creating a new task'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <div key={task.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                <FiStar className="mr-1" /> Rating: {task.minRating || 'Any'}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FiDollarSign className="mr-1" /> ${task.allocatedAmount}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <FiCalendar className="mr-1" /> {new Date(task.scheduledDate).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditTask(task)}
                              className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-full"
                              title="Edit"
                              aria-label="Edit task"
                            >
                              <FiEdit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full"
                              title="Delete"
                              aria-label="Delete task"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleFindWorkers(task)}
                              className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-full"
                              title="Find Workers"
                              aria-label="Find workers for this task"
                            >
                              <FiSearch className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

               {/* Workers Tab */}
            {activeTab === 'workers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Matched Workers</h2>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back to Tasks
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : matchedWorkers.length === 0 ? (
                  <div className="text-center py-12">
                    <FiUser className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No workers matched</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your task requirements or check back later
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {matchedWorkers.map((worker) => (
                      <div key={worker.userId} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="p-6">
                          <div className="flex justify-start mb-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              worker.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {worker.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                              <FiUser className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-lg font-medium text-gray-900">{worker.fullName}</h3>
                              <p className="text-sm text-indigo-600">{worker.skills}</p>
                              <div className="mt-1 flex items-center">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((rating) => (
                                    <FiStar
                                      key={rating}
                                      className={`h-4 w-4 ${rating <= Math.floor(worker.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill={rating <= Math.floor(worker.rating || 0) ? 'currentColor' : 'none'}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {worker.rating?.toFixed(1) || 'No ratings'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {worker.bio || 'No bio available'}
                            </p>
                          </div>
                          
                          <div className="mt-6 flex justify-between space-x-3">
                            <button
                              onClick={() => navigate(`/view-profile/${worker.userId}`)}
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiUser className="mr-2 h-4 w-4" />
                              View Profile
                            </button>
                            <button
                              onClick={() => handleSendTask(worker)}
                              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <FiSend className="mr-2 h-4 w-4" />
                              Assign Task
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Edit Task Modal */}
        {editTask && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Task</h3>
                    <button
                      onClick={() => setEditTask(null)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      aria-label="Close modal"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        id="title"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={editTask.title}
                        onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="description"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={editTask.description}
                        onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Required Skills</label>
                      <input
                        id="skills"
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={editTask.requiredSkills}
                        onChange={(e) => setEditTask({ ...editTask, requiredSkills: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="minRating" className="block text-sm font-medium text-gray-700">Minimum Rating</label>
                        <input
                          id="minRating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editTask.minRating}
                          onChange={(e) => setEditTask({ ...editTask, minRating: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Budget ($)</label>
                        <input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editTask.allocatedAmount}
                          onChange={(e) => setEditTask({ ...editTask, allocatedAmount: parseFloat(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">Scheduled Date</label>
                      <input
                        id="date"
                        type="datetime-local"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={editTask.scheduledDate ? editTask.scheduledDate.slice(0, 16) : ''}
                        onChange={(e) => setEditTask({ ...editTask, scheduledDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    <FiCheck className="mr-2 h-5 w-5" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTask(null)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindWorker;