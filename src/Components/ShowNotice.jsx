import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const NoticeViewer = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notices from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/notices/Show');
        setNotices(response.data);
      } catch (err) {
        setError('Failed to load notices');
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
        <p>No notices available at this time.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Notice Header - Red */}
            <div className="bg-red-100 px-6 py-3 border-b border-red-200">
              <div className="flex items-center">
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full mr-3">
                  NOTICE
                </span>
                <span className="text-sm text-red-800">
                  {format(new Date(notice.createdAt), 'MMMM do, yyyy')}
                </span>
              </div>
            </div>

            {/* Notice Content */}
            <div className="p-6">
              {/* Title - Blue */}
              <h2 className="text-2xl font-bold text-blue-700 mb-3">
                {notice.title}
              </h2>

              {/* Content - Black */}
              <div className="prose text-black">
                {notice.message}
              </div>
            </div>

            {/* Footer with update info */}
            {notice.updatedAt && (
              <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t border-gray-200">
                Last updated: {format(new Date(notice.updatedAt), 'MMMM do, yyyy h:mm a')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeViewer;