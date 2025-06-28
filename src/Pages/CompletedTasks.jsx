import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaRegStar, FaCheck, FaTimes } from 'react-icons/fa';

const ClientAllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    taskId: null,
    workerId: null,
    rating: 0,
    comment: '',
    status: 'COMPLETED' // default to COMPLETED, can be changed to INCOMPLETED
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: '',
    message: '',
    taskId: null,
    workerId: null,
    action: null // 'confirm', 'complete', 'incomplete'
  });

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
  }, []);

  const showConfirmation = (taskId, workerId, action) => {
    let title, message;
    switch (action) {
      case 'confirm':
        title = 'Confirm Task';
        message = 'Are you sure you want to confirm this task? This will notify the worker.';
        break;
      case 'complete':
        title = 'Mark as Completed';
        message = 'Are you sure this task is completed? You will be able to rate the worker afterwards.';
        break;
      case 'incomplete':
        title = 'Mark as Incompleted';
        message = 'Are you sure this task is not completed? Please provide feedback to the worker if possible.';
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

      // Prepare review data for both completed and incomplete tasks
      if (action === 'complete' || action === 'incomplete') {
        setReviewData({
          taskId,
          workerId,
          rating: action === 'complete' ? 0 : null, // No rating for incomplete tasks
          comment: '',
          status
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

  const handleReviewSubmit = async () => {
    try {
  
      // Prepare the payload
      const payload = {
        rating: reviewData.status === 'COMPLETED' ? reviewData.rating : null,
        text: reviewData.comment,
        status: reviewData.status
      };

      await axios.post(
        `http://localhost:8080/api/reviews/task/${reviewData.taskId}/worker/${reviewData.workerId}`,
        payload,
        {
          withCredentials: true,
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Feedback submitted successfully!');
      setShowReviewModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Review submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const handleRatingChange = (rating) => {
    setReviewData({...reviewData, rating});
  };

  // Separate tasks by status
  const acceptedTasks = tasks.filter(task => task.status === 'ACCEPTED');
  const confirmedTasks = tasks.filter(task => task.status === 'CONFIRMED');
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED');
  const incompletedTasks = tasks.filter(task => task.status === 'INCOMPLETED');

  // Function to check if a task has a review
  const hasReview = (task) => {
    return task.reviewId !== null && task.reviewId !== undefined;
  };

  const renderTaskCard = (task) => (
    <div
      key={task.taskId}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 mb-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
        {/* Worker Name */}
        <div className="sm:col-span-1">
          {task.workerId ? (
            <Link
              to={`/worker-profile/${task.workerId}`}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-300 text-sm sm:text-base hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {task.workerFirstName} {task.workerLastName}
            </Link>
          ) : (
            <span className="text-gray-500">Worker not assigned</span>
          )}
        </div>

        {/* Task Details */}
        <div className="sm:col-span-1 text-sm text-gray-700 space-y-1">
          <p><span className="font-medium text-gray-500">Task:</span> {task.title}</p>
          <p><span className="font-medium text-gray-500">Skills:</span> {task.requiredSkills}</p>
        </div>

        {/* Time */}
        <div className="sm:col-span-1 text-sm text-gray-500">
          <p><span className="font-medium">Time:</span></p>
          <p>{new Date(task.acceptedTime || task.updatedAt).toLocaleString()}</p>
        </div>

        {/* Status */}
        <div className="sm:col-span-1">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            task.status === 'ACCEPTED' ? 'bg-yellow-100 text-yellow-800' :
            task.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
            task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {task.status}
          </span>
          
          {/* Show rating if completed and reviewed */}
          {(task.status === 'COMPLETED' || task.status === 'INCOMPLETED') && hasReview(task) && (
            <div className="mt-1">
              {task.status === 'COMPLETED' && task.rating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    i < task.rating ? 
                      <FaStar key={i} className="text-yellow-400 text-xs" /> : 
                      <FaRegStar key={i} className="text-yellow-400 text-xs" />
                  ))}
                </div>
              )}
              {task.comment && (
                <p className="text-xs text-gray-500 mt-1 truncate" title={task.comment}>
                  "{task.comment}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sm:col-span-1 flex items-center justify-end gap-2">
          {task.status === 'ACCEPTED' && (
            <button
              onClick={() => showConfirmation(task.taskId, task.workerId, 'confirm')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
                updatingTaskId === task.taskId
                  ? 'bg-green-300 text-gray-800 cursor-not-allowed flex items-center gap-2'
                  : 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600'
              }`}
              disabled={updatingTaskId === task.taskId}
            >
              {updatingTaskId === task.taskId ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Confirming...
                </>
              ) : 'Confirm'}
            </button>
          )}
          
          {task.status === 'CONFIRMED' && (
            <div className="flex gap-2">
              <button
                onClick={() => showConfirmation(task.taskId, task.workerId, 'complete')}
                className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
              >
                <FaCheck size={12} /> Complete
              </button>
              <button
                onClick={() => showConfirmation(task.taskId, task.workerId, 'incomplete')}
                className="px-3 py-1.5 bg-red-100 text-red-800 text-xs font-medium rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1"
              >
                <FaTimes size={12} /> Incomplete
              </button>
            </div>
          )}
          
          {(task.status === 'COMPLETED' || task.status === 'INCOMPLETED') && !hasReview(task) && (
            <button
              onClick={() => {
                setReviewData({
                  taskId: task.taskId,
                  workerId: task.workerId,
                  rating: task.status === 'COMPLETED' ? 0 : null,
                  comment: '',
                  status: task.status
                });
                setShowReviewModal(true);
              }}
              className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-lg hover:bg-blue-200 transition-colors"
            >
              Add Feedback
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-8 w-full">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Accepted Tasks Section */}
              <section>
                <h2 className="text-xl text-gray-800 mb-4 text-left border-b pb-2">
                  Awaiting Confirmation ({acceptedTasks.length})
                </h2>
                {acceptedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {acceptedTasks.map(renderTaskCard)}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No tasks awaiting confirmation
                  </p>
                )}
              </section>

              {/* Confirmed Tasks Section */}
              <section>
                <h2 className="text-xl text-gray-800 mb-4 text-left border-b pb-2">
                  Confirmed Tasks ({confirmedTasks.length})
                </h2>
                {confirmedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {confirmedTasks.map(renderTaskCard)}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No confirmed tasks yet
                  </p>
                )}
              </section>

              {/* Completed Tasks Section */}
              <section>
                <h2 className="text-xl text-gray-800 mb-4 text-left border-b pb-2">
                  Completed Tasks ({completedTasks.length})
                </h2>
                {completedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {completedTasks.map(renderTaskCard)}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No completed tasks yet
                  </p>
                )}
              </section>

              {/* Incompleted Tasks Section */}
              <section>
                <h2 className="text-xl text-gray-800 mb-4 text-left border-b pb-2">
                  Incompleted Tasks ({incompletedTasks.length})
                </h2>
                {incompletedTasks.length > 0 ? (
                  <div className="space-y-4">
                    {incompletedTasks.map(renderTaskCard)}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No incompleted tasks
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-semibold mb-3">{confirmationModal.title}</h3>
            <p className="text-gray-600 mb-6">{confirmationModal.message}</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmationModal({ ...confirmationModal, show: false })}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleConfirmedAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaCheck /> Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-semibold mb-4">
              {reviewData.status === 'COMPLETED' ? 'Rate Your Experience' : 'Provide Feedback'}
            </h3>
            
            {reviewData.status === 'COMPLETED' && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      className="text-2xl mr-1 focus:outline-none"
                    >
                      {star <= reviewData.rating ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                {reviewData.status === 'COMPLETED' ? 'Review' : 'Feedback'}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                placeholder={reviewData.status === 'COMPLETED' ? 'Share your experience...' : 'Provide feedback about why the task wasn\'t completed...'}
                value={reviewData.comment}
                onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                required
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                disabled={!reviewData.comment || (reviewData.status === 'COMPLETED' && reviewData.rating === 0)}
                className={`px-4 py-2 rounded-lg text-white transition-colors flex items-center gap-2 ${
                  (!reviewData.comment || (reviewData.status === 'COMPLETED' && reviewData.rating === 0))
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <FaCheck /> Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAllTasks;