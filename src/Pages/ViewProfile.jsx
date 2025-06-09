import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const WorkerProfileView = () => {
  const { userId } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading worker profile...</p>;
  if (!worker) return <p className="text-center mt-10 text-red-600">Worker not found.</p>;

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

//   const imageUrl = worker.profilePictureBase64
//     ? `data:image/jpeg;base64,${worker.profilePictureBase64}`
//     : 'https://via.placeholder.com/150x150?text=No+Image';
//  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
//       <div className="max-w-4xl mx-auto px-4 mt-10">
//         <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6"></div>

 return (
  <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-4">
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 space-y-6 mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-12">Worker Profile</h1>

      <div className="flex flex-col md:flex-row items-start gap-12">
        {/* Left: Profile Picture */}
        <div className="flex flex-col items-center md:items-start w-1/3 pl-20">
          <img
            src={`data:image/jpeg;base64,${worker.profilePictureBase64}`}
            alt="Worker"
            className="w-40 h-40 rounded-full object-cover border-4 border-blue-400"
          />

          <div className="mt-4 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{worker.fullName}</h2>
            <div className="flex items-center justify-center md:justify-start mt-1">
              {renderStars(worker.averageRating)}
              <span className="ml-2 text-sm text-gray-600">
                ({worker.averageRating?.toFixed(1) || '0.0'})
              </span>
            </div>
          </div>
        </div>

        {/* Right: Worker Details */}
        <div className="flex-1 space-y-6 text-gray-800 p-6 w-2/3 pr-6">
          <p><span className="font-semibold">📞 Phone:</span> {worker.phone || 'N/A'}</p>
          <p><span className="font-semibold">🛠️ Skills:</span> {worker.skills || 'N/A'}</p>
          <p><span className="font-semibold">💰 Charge Per Hour:</span> Rs. {worker.chargePerHour || 'N/A'}</p>
          <p><span className="font-semibold">📍 City:</span> {worker.city || 'N/A'}</p>
        </div>
      </div>

      {/* Map */}
      {worker.latitude && worker.longitude && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">Location</h2>
          <iframe
            title="worker-location"
            src={`https://maps.google.com/maps?q=${worker.latitude},${worker.longitude}&z=15&output=embed`}
            width="100%"
            height="300"
            className="rounded-lg border border-gray-300"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      )}
    </div>
  </div>
);

};

export default WorkerProfileView;
