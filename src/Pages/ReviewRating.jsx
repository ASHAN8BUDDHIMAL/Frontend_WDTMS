import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, UploadCloud } from 'lucide-react';

const ReviewRating = ({ workerId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [image, setImage] = useState(null); // stores File object
  const [imagePreview, setImagePreview] = useState(null); // stores preview URL
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/reviews/worker/${workerId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (workerId) {
      fetchReviews();
    }
  }, [workerId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0 || reviewText.length < 10) {
      alert('Please provide a rating and at least 10 characters for the review.');
      return;
    }

    try {
      // Prepare form data for image upload along with other review info
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('text', reviewText);
      formData.append('workerId', workerId);
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:8080/api/reviews', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh reviews after successful post
      const response = await axios.get(`http://localhost:8080/api/reviews/${workerId}`);
      setReviews(response.data);

      // Reset form
      setRating(0);
      setHoverRating(0);
      setReviewText('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="mb-6 mt-14 max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Write a Review</h2>

          {/* Star Rating */}
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`w-8 h-8 cursor-pointer transition ${
                  (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill={(hoverRating || rating) >= star ? '#facc15' : 'none'}
              />
            ))}
          </div>

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share details of your experience..."
              className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Image Upload */}
            <label className="flex items-center space-x-2 cursor-pointer text-indigo-600 hover:underline">
              <UploadCloud className="w-5 h-5" />
              <span>Attach photo (optional)</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {/* Preview Image */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Uploaded Preview"
                className="w-32 h-32 object-cover mt-2 rounded border"
              />
            )}

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
            >
              Submit
            </button>
          </form>

          {/* Reviews List */}
          {reviews.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
              {reviews.map((rev) => (
                <div key={rev.id} className="mb-6 p-4 border rounded shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-gray-800">
                      {rev.userName || 'Anonymous'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(rev.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-2">{rev.text}</p>
                  {rev.image && (
                    <img
                      src={`data:image/jpeg;base64,${rev.image}`} // assuming backend returns base64 encoded images
                      alt="Review"
                      className="w-40 h-40 object-cover rounded border"
                    />
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

export default ReviewRating;
