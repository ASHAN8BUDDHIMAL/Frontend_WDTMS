import React, { useEffect, useState } from 'react';
import { useParams, useNavigate,  useLocation } from 'react-router-dom';

const WorkerProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Get the previous route from location state
  const previousRoute = location.state?.from || '/find-workers'; // default fallback

  useEffect(() => {
    // Fetch worker profile
    fetch(`http://localhost:8080/api/view-profile/${userId}`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch worker profile');
        return res.json();
      })
      .then(data => {
        setWorker(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);
  

const fetchReviews = () => {
  setReviewsLoading(true);
  fetch(`http://localhost:8080/api/reviews/worker/${userId}`, {
    credentials: 'include',
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    })
    .then(data => {
      setReviews(data.reviews || []);  // Access the reviews array from the response
      setReviewsLoading(false);
    })
    .catch(err => {
      console.error(err);
      setReviews([]);  // Set empty array on error
      setReviewsLoading(false);
    });
};

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab, userId]);

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i <= roundedRating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading worker profile...</p>;
  if (!worker) return <p className="text-center mt-10 text-red-600">Worker not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-8 space-y-6 mt-10">

        {/* Modified back button that goes to matched workers list */}
        <button 
          onClick={() => navigate(previousRoute)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Matched Workers
        </button>
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">Worker Profile</h1>

        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left: Profile Picture */}
          <div className="flex flex-col items-center md:items-start w-1/3 pl-8">
            <img
              src={`data:image/jpeg;base64,${worker.profilePictureBase64}`}
              alt="Worker"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-400"
            />

            <div className="mt-4 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">{worker.fullName}</h2>
              {/* <div className="flex items-center justify-center md:justify-start mt-1">
                {renderStars(worker.averageRating)}
                <span className="ml-2 text-sm text-gray-600">
                  ({worker.averageRating?.toFixed(1) || '0.0'})
                </span>
              </div> */}
            </div>
          </div>

          {/* Right: Tabs */}
          <div className="flex-1 w-2/3 pr-6">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                onClick={() => setActiveTab('details')}
              >
                User Details
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews & Ratings
              </button>
              <button
                className={`py-2 px-4 font-medium ${activeTab === 'location' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                onClick={() => setActiveTab('location')}
              >
                Location
              </button>
            </div>

            {/* Tab Content */}
            <div className="py-6">
              {activeTab === 'details' && (
                <div className="space-y-4 text-gray-800">
                  <p><span className="font-semibold">📞 Phone:</span> {worker.phone || 'N/A'}</p>
                  <p><span className="font-semibold">🛠️ Skills:</span> {worker.skills || 'N/A'}</p>
                  <p><span className="font-semibold">💰 Charge Per Hour:</span> Rs. {worker.chargePerHour || 'N/A'}</p>
                  <p><span className="font-semibold">📍 City:</span> {worker.city || 'N/A'}</p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {reviewsLoading ? (
                    <p className="text-center text-gray-600">Loading reviews...</p>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-4">
                   {reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center mb-2">
                        <div className="font-semibold">{review.userName || 'Anonymous'}</div>
                        <div className="ml-2 flex">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600">No reviews yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'location' && (
                <div>
                  {worker.latitude && worker.longitude ? (
                    <>
                      <p className="mb-4"><span className="font-semibold">📍 Location:</span> {worker.city || 'N/A'}</p>
                      <iframe
                        title="worker-location"
                        src={`https://maps.google.com/maps?q=${worker.latitude},${worker.longitude}&z=15&output=embed`}
                        width="100%"
                        height="300"
                        className="rounded-lg border border-gray-300"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </>
                  ) : (
                    <p className="text-center text-gray-600">Location not available.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfileView;