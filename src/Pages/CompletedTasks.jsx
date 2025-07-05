import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaStar,
  FaRegStar,
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaUser,
  FaCalendarAlt,
  FaTools,
  FaClipboardCheck,
  FaHistory,
  FaSpinner,
  FaPaperclip,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    taskId: null,
    workerId: null,
    rating: 0,
    comment: '',
    status: 'COMPLETED',
    imageFile: null
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: '',
    message: '',
    taskId: null,
    workerId: null,
    action: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('accepted');
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/task-status/client-tasks', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeTab]);  // **Important:** Add `activeTab` to the dependency array

  const showConfirmation = (taskId, workerId, action) => {
    let title, message;
    switch (action) {
      case 'confirm':
        title = 'Confirm Task Assignment';
        message = 'Are you sure you want to confirm this worker for the task?';
        break;
      case 'cancel':
        title = 'Cancel Task Assignment';
        message = 'Are you sure you want to cancel this task assignment?';
        break;
      case 'complete':
        title = 'Mark Task as Completed';
        message = 'Confirm this task is fully completed to your satisfaction?';
        break;
      case 'incomplete':
        title = 'Report Task Issues';
        message = 'Are you reporting issues with this task?';
        break;
      default:
        return;
    }

    setConfirmationModal({
      show: true,
      title,
      message,
      taskId,
      workerId,
      action
    });
  };

  const handleConfirmedAction = async () => {
    const { taskId, workerId, action } = confirmationModal;

    try {
      setUpdatingTaskId(taskId);
      setConfirmationModal({ ...confirmationModal, show: false });

      let status;
      switch (action) {
        case 'confirm':
          status = 'CONFIRMED';
          break;
        case 'cancel':
          status = 'CANCELLED';
          break;
        case 'complete':
          status = 'COMPLETED';
          break;
        case 'incomplete':
          status = 'INCOMPLETED';
          break;
        default:
          return;
      }

      await axios.put(
        `http://localhost:8080/api/task-status/${taskId}/status/${workerId}`,
        { status },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(`Task status updated to ${status.toLowerCase()}!`);

      if (action === 'complete' || action === 'incomplete') {
        setReviewData({
          taskId,
          workerId,
          rating: action === 'complete' ? 5 : null,
          comment: '',
          status,
          imageFile: null
        });
        setShowReviewModal(true);
      }

      fetchTasks();
    } catch (error) {
      console.error('Action error:', error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Failed to update task status';
      toast.error(errorMessage);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const openReviewModalForTask = (task) => {
    setReviewData({
      taskId: task.taskId,
      workerId: task.workerId,
      rating: task.status === 'COMPLETED' ? 5 : null,
      comment: '',
      status: task.status,
      imageFile: null,
    });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async () => {
    try {
      // 1. Check if review already exists
      const task = tasks.find(t => t.taskId === reviewData.taskId);
      if (task && task.reviewId) {
        alert('You have already submitted feedback for this task.');
        setShowReviewModal(false);
        return;
      }

      // 2. Validate required inputs
      if (!reviewData.taskId || !reviewData.workerId) {
        alert('Missing Task or Worker Information');
        return;
      }

      if (!reviewData.comment.trim()) {
        alert('Please enter your feedback comment');
        return;
      }

      if (
        reviewData.status === 'COMPLETED' &&
        (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5)
      ) {
        alert('Please provide a valid rating between 1 and 5 stars');
        return;
      }

      if (reviewData.imageFile && reviewData.imageFile.size > 5 * 1024 * 1024) {
        alert('Image size exceeds 5MB. Please upload a smaller file.');
        return;
      }

      // 3. Prepare form data
      const formData = new FormData();

      if (reviewData.status === 'COMPLETED') {
        formData.append('rating', reviewData.rating);
      }

      formData.append('text', reviewData.comment.trim());

      if (reviewData.imageFile) {
        formData.append('image', reviewData.imageFile);
      }

      // 4. Submit review
      await axios.post(
        `http://localhost:8080/api/reviews/task/${reviewData.taskId}/worker/${reviewData.workerId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Feedback submitted successfully!');
      setShowReviewModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Review submission error:', error);

      let errorMsg = 'Failed to submit feedback.';

      if (error.response) {
        if (error.response.status === 401) {
          errorMsg = 'Unauthorized access. Please login again.';
        } else if (error.response.data) {
          errorMsg =
            error.response.data.message ||
            error.response.data.error ||
            'An error occurred while submitting feedback.';
        } else {
          errorMsg = `Server responded with status ${error.response.status}`;
        }
      } else if (error.request) {
        errorMsg = 'No response from server. Please check your internet connection.';
      } else if (error.message) {
        errorMsg = error.message;
      }

      alert(errorMsg);
    }
  };


  const handleRatingChange = (rating) => {
    setReviewData({ ...reviewData, rating });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setReviewData({ ...reviewData, imageFile: e.target.files[0] });
    }
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.workerFirstName + ' ' + task.workerLastName).toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab =
      (activeTab === 'accepted' && task.status === 'ACCEPTED') ||
      (activeTab === 'confirmed' && task.status === 'CONFIRMED') ||
      (activeTab === 'completed' && task.status === 'COMPLETED') ||
      (activeTab === 'incompleted' && task.status === 'INCOMPLETED');

    return matchesSearch && matchesTab;
  });

  const hasReview = (task) => {
    return task.reviewId !== null && task.reviewId !== undefined;
  };

  const tabClasses = (tabName) =>
    `flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
    activeTab === tabName
      ? 'border-blue-500 text-blue-600'
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  const renderTaskCard = (task) => (
    <div key={task.taskId} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        {/* Worker Name as Main Title */}
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <FaUser className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {task.workerFirstName} {task.workerLastName}
            </h2>
            <p className="text-sm text-gray-500">{task.title}</p>
          </div>
        </div>

        {/* Task Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <FaTools className="mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">{task.requiredSkills}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            <span className="text-sm text-gray-600">
              {new Date(task.acceptedTime || task.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            task.status === 'ACCEPTED' ? 'bg-yellow-100 text-yellow-800' :
              task.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
            }`}>
            {task.status}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {task.status === 'ACCEPTED' && (
            <>
              <button
                onClick={() => showConfirmation(task.taskId, task.workerId, 'confirm')}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  updatingTaskId === task.taskId
                    ? 'bg-green-200 text-gray-800 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                  } flex items-center justify-center gap-2 flex-1 min-w-[120px]`}
                disabled={updatingTaskId === task.taskId}
              >
                {updatingTaskId === task.taskId ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <FaCheck /> Confirm
                  </>
                )}
              </button>
              <button
                onClick={() => showConfirmation(task.taskId, task.workerId, 'cancel')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 flex-1 min-w-[120px] shadow-md"
              >
                <FaTimes /> Cancel
              </button>
            </>
          )}

          {task.status === 'CONFIRMED' && (
            <>
              <button
                onClick={() => showConfirmation(task.taskId, task.workerId, 'complete')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 flex-1 min-w-[120px] shadow-md"
              >
                <FaCheck /> Complete
              </button>
              <button
                onClick={() => showConfirmation(task.taskId, task.workerId, 'incomplete')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 flex-1 min-w-[120px] shadow-md"
              >
                <FaTimes /> Incomplete
              </button>
            </>
          )}

          {(task.status === 'COMPLETED' || task.status === 'INCOMPLETED') && (
            <button
              onClick={() => openReviewModalForTask(task)}
              disabled={hasReview(task)}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 flex-1 min-w-full ${
                hasReview(task)
                  ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
            >
              <FaClipboardCheck />
              {hasReview(task) ? 'Feedback Submitted' : 'Add Feedback'}
            </button>
          )}
        </div>

        {/* Review section if exists */}
        {(task.status === 'COMPLETED' || task.status === 'INCOMPLETED') && hasReview(task) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <div className="bg-gray-50 p-2 rounded-lg">
                {task.status === 'COMPLETED' && task.rating ? (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      i < task.rating ?
                        <FaStar key={i} className="text-yellow-400 text-sm" /> :
                        <FaRegStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                    <span className="ml-1 text-xs text-gray-500">{task.rating.toFixed(1)}</span>
                  </div>
                ) : (
                  <FaHistory className="text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-700">{task.comment}</p>
                {task.reviewImage && (
                  <div className="mt-2">
                    <img
                      src={task.reviewImage}
                      alt="Review attachment"
                      className="h-20 rounded-md object-cover border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="mb-8 mt-12">
          {/* <h1 className="text-3xl font-bold text-gray-900">Task Management Dashboard</h1> */}
          <p className="mt-2 text-gray-600">Manage all your assigned tasks in one place</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search tasks or workers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FaFilter className="text-gray-500" />
                <span>Filters</span>
                {filterOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </button>

              {filterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200 p-3">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option>Most Recent</option>
                      <option>Oldest</option>
                      <option>Highest Rating</option>
                      <option>Lowest Rating</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Apply Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('accepted')}
              className={tabClasses('accepted')}
            >
              Awaiting Confirmation
              <span className="bg-yellow-100 text-yellow-800 ml-2 py-0.5 px-2 rounded-full text-xs">
                {tasks.filter(t => t.status === 'ACCEPTED').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('confirmed')}
              className={tabClasses('confirmed')}
            >
              In Progress
              <span className="bg-blue-100 text-blue-800 ml-2 py-0.5 px-2 rounded-full text-xs">
                {tasks.filter(t => t.status === 'CONFIRMED').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={tabClasses('completed')}
            >
              Completed
              <span className="bg-green-100 text-green-800 ml-2 py-0.5 px-2 rounded-full text-xs">
                {tasks.filter(t => t.status === 'COMPLETED').length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('incompleted')}
              className={tabClasses('incompleted')}
            >
              Issues
              <span className="bg-red-100 text-red-800 ml-2 py-0.5 px-2 rounded-full text-xs">
                {tasks.filter(t => t.status === 'INCOMPLETED').length}
              </span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-b-xl shadow-sm p-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search or filters' : `You have no ${activeTab} tasks`}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {filteredTasks.map(renderTaskCard)}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl animate-fade-in">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{confirmationModal.title}</h3>
            <p className="text-gray-600 mb-6">{confirmationModal.message}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmationModal({ ...confirmationModal, show: false })}
                className="px-4 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleConfirmedAction}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
              >
                <FaCheck /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {reviewData.status === 'COMPLETED' ? 'Rate Your Experience' : 'Provide Feedback'}
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            {reviewData.status === 'COMPLETED' && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                <div className="flex justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      className="text-3xl mx-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      {star <= reviewData.rating ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="text-center mt-1 text-sm text-gray-500">
                  {reviewData.rating === 1 && 'Poor'}
                  {reviewData.rating === 2 && 'Fair'}
                  {reviewData.rating === 3 && 'Good'}
                  {reviewData.rating === 4 && 'Very Good'}
                  {reviewData.rating === 5 && 'Excellent'}
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {reviewData.status === 'COMPLETED' ? 'Share your experience' : 'What went wrong?'}
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                placeholder={reviewData.status === 'COMPLETED'
                  ? 'Tell us about your experience with this worker...'
                  : 'Please describe any issues you encountered...'}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPaperclip className="inline mr-1" />
                Attach Image (Optional)
              </label>
              <div className="flex items-center">
                <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-600 rounded-lg border border-blue-300 cursor-pointer hover:bg-blue-50">
                  <span className="text-sm font-medium">Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
                {reviewData.imageFile && (
                  <span className="ml-3 text-sm text-gray-600 truncate max-w-xs">
                    {reviewData.imageFile.name}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Max file size: 5MB</p>
            </div>

            <button
              onClick={handleReviewSubmit}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md font-medium"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;