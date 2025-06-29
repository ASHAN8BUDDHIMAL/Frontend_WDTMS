import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaStar, 
  FaRegStar, 
  FaUser, 
  FaEllipsisV, 
  FaTrash, 
  FaFlag, 
  FaFilter,
  FaInfoCircle,
  FaExpand,
  FaTimes
} from 'react-icons/fa';

const WorkerReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/reviews/worker/reviews',
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (response.data.status === 'success') {
          setReviews(response.data.reviews);
        } else {
          setError(response.data.message || 'Failed to load reviews');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const toggleDropdown = (reviewId) => {
    setActiveDropdown(activeDropdown === reviewId ? null : reviewId);
  };

  const filterByRating = (rating) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };

  const filteredReviews = selectedRating 
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  const getStatusColor = (rating) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-blue-100 text-blue-800';
    if (rating >= 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const ReviewImage = ({ base64Image }) => {
    if (!base64Image) return null;

    return (
      <div className="mt-3">
        <div 
          className="relative w-32 h-24 cursor-pointer group"
          onClick={() => setExpandedImage(base64Image)}
        >
          <img
            src={`data:image/jpeg;base64,${base64Image}`}
            alt="Review attachment"
            className="rounded-lg border border-gray-200 w-full h-full object-cover hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg">
            <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm max-w-md w-full">
          <p className="font-medium">Error loading reviews</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-sm max-w-md w-full">
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm mt-1">Your reviews will appear here once clients submit feedback.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      {/* Full Screen Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={`data:image/jpeg;base64,${expandedImage}`}
              alt="Enlarged review"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(null);
              }}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto ">
        {/* Header */}
        <div className="text-center mb-12 mt-12">
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Feedback from clients you've worked with
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
            </h2>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Filter by rating:</h3>
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => filterByRating(rating)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${
                      selectedRating === rating 
                        ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="flex mr-1">
                      {[...Array(rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-xs" />
                      ))}
                    </div>
                    {rating} star{rating !== 1 ? 's' : ''}
                  </button>
                ))}
                {selectedRating && (
                  <button
                    onClick={() => setSelectedRating(null)}
                    className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div 
              key={review.id} 
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="px-6 py-5">
                <div className="flex items-start justify-between">
                  {/* User Info */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="bg-blue-100 rounded-full p-3 text-blue-600">
                        <FaUser className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium text-gray-900 truncate">
                        {review.userName || 'Anonymous Client'}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            i < review.rating ? 
                              <FaStar key={i} className="text-yellow-400" /> : 
                              <FaRegStar key={i} className="text-yellow-400" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(review.rating)}`}>
                          {review.rating >= 4 ? 'Excellent' : review.rating >= 3 ? 'Good' : review.rating >= 1 ? 'Fair' : 'No Rating'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown(review.id)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <FaEllipsisV className="h-5 w-5" />
                    </button>

                    {activeDropdown === review.id && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <FaFlag className="mr-2 text-gray-500" />
                            Report
                          </button>
                          <button
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          >
                            <FaTrash className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="mt-4">
                  <p className="text-gray-700 whitespace-pre-line">{review.text}</p>
                </div>

                {/* Review Image Thumbnail */}
                <ReviewImage base64Image={review.base64Image} />

                {/* Review Meta */}
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <FaInfoCircle className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <p>
                    Reviewed on {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkerReviewsPage;