import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/solid';

const NoticeAdminPanel = () => {
  const [notices, setNotices] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentNotice, setCurrentNotice] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  const fetchNotices = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/notices/Show');
      setNotices(response.data || []); // Ensure we always have an array
    } catch (error) {
      showSnackbar('Failed to fetch notices');
      setNotices([]); // Set to empty array on error
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreateDialog = () => {
    setCurrentNotice(null);
    setFormData({
      title: '',
      message: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (notice) => {
    setCurrentNotice(notice);
    setFormData({
      title: notice.title || '',
      message: notice.message || ''
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentNotice) {
        await axios.put(`http://localhost:8080/api/notices/${currentNotice.id}`, formData);
        showSnackbar('Notice updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/notices/create', formData);
        showSnackbar('Notice created successfully');
      }
      fetchNotices();
      setOpenDialog(false);
    } catch (error) {
      showSnackbar('Error saving notice');
    }
  };

  const handleDeleteClick = (notice) => {
    setCurrentNotice(notice);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/notices/${currentNotice.id}`);
      showSnackbar('Notice deleted successfully');
      fetchNotices();
      setOpenDeleteDialog(false);
    } catch (error) {
      showSnackbar('Error deleting notice');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Helper function to safely display message content
  const displayMessage = (message) => {
    if (!message) return 'No content';
    return message.length > 100 ? `${message.substring(0, 100)}...` : message;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
   <div className="min-h-screen bg-gray-100"> 
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mt-12">
        <div className="flex justify-between items-center mb-6 ">
          <h1 className="text-2xl font-bold text-gray-800">Notice Management</h1>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleOpenCreateDialog}
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            New Notice
          </button>
        </div>

        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{notice.title || 'Untitled Notice'}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {displayMessage(notice.message)}
                  </p>
                  <div className="text-gray-500 text-xs mt-2">
                    <p>Created: {formatDate(notice.createdDate)}</p>
                    {notice.updatedDate && (
                      <p>Updated: {formatDate(notice.updatedDate)}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenEditDialog(notice)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(notice)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Dialog */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {currentNotice ? 'Edit Notice' : 'Create New Notice'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
                <button
                  onClick={() => setOpenDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <CheckIcon className="h-5 w-5 mr-1" />
                  {currentNotice ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {openDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="mb-6">
                Are you sure you want to delete the notice "{currentNotice?.title || 'Untitled Notice'}"?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setOpenDeleteDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar for notifications */}
        {snackbarOpen && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md flex items-center shadow-lg z-50">
            <span>{snackbarMessage}</span>
            <button
              onClick={handleSnackbarClose}
              className="ml-4 text-gray-300 hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default NoticeAdminPanel;