import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/solid';

const TermsAdminPanel = () => {
  const [terms, setTerms] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentTerm, setCurrentTerm] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const fetchTerms = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/terms');
      setTerms(response.data ? [response.data] : []); // Convert to array for consistency
    } catch (error) {
      showSnackbar('Failed to fetch terms');
      setTerms([]);
    }
  }, []);

  useEffect(() => {
    fetchTerms();
  }, [fetchTerms]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCreateDialog = () => {
    setCurrentTerm(null);
    setFormData({
      title: 'Terms and Conditions',
      content: ''
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (term) => {
    setCurrentTerm(term);
    setFormData({
      title: term.title || 'Terms and Conditions',
      content: term.content || ''
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (currentTerm) {
        await axios.put(`http://localhost:8080/api/terms/${currentTerm.id}`, formData);
        showSnackbar('Terms updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/terms', formData);
        showSnackbar('Terms created successfully');
      }
      fetchTerms();
      setOpenDialog(false);
    } catch (error) {
      showSnackbar('Error saving terms');
    }
  };

  const handleDeleteClick = (term) => {
    setCurrentTerm(term);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/terms/${currentTerm.id}`);
      showSnackbar('Terms deleted successfully');
      fetchTerms();
      setOpenDeleteDialog(false);
    } catch (error) {
      showSnackbar('Error deleting terms');
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setTimeout(() => setSnackbarOpen(false), 3000);
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-600" />
              Terms and Conditions Management
            </h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              onClick={handleOpenCreateDialog}
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              {terms.length > 0 ? 'Update Terms' : 'Create Terms'}
            </button>
          </div>

          <div className="space-y-6">
            {terms.length > 0 ? (
              terms.map((term) => (
                <div key={term.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{term.title}</h3>
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {term.content}
                      </div>
                      <div className="text-gray-500 text-sm mt-4">
                        <p>Last updated: {formatDate(term.lastUpdated)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleOpenEditDialog(term)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(term)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No terms and conditions found</p>
              </div>
            )}
          </div>

          {/* Create/Edit Dialog */}
          {openDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="p-6 overflow-y-auto">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-600" />
                    {currentTerm ? 'Edit Terms' : 'Create New Terms'}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use double newlines (press Enter twice) to separate sections
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3 border-t border-gray-200">
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
                    {currentTerm ? 'Update' : 'Create'}
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
                  Are you sure you want to delete the terms and conditions?
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
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md flex items-center shadow-lg z-50 animate-fade-in-up">
              <span>{snackbarMessage}</span>
              <button
                onClick={() => setSnackbarOpen(false)}
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

export default TermsAdminPanel;