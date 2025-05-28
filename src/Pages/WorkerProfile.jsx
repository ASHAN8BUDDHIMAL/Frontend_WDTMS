import React, { useEffect, useState } from 'react';
import UserProfile from '../Components/UserProfile';
import Location from '../Components/Location';

const WorkerProfile = () => {
  const [worker, setWorker] = useState({
    skills: '',
    workCity: '',
    rating: 0
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch worker data from backend
  useEffect(() => {
    fetch('http://localhost:8080/api/worker', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch worker');
        return res.json();
      })
      .then(data => {
        setWorker({
          skills: data.skills || '',
          workCity: data.workCity || '',
          rating: data.rating || 0
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorker(prev => ({ ...prev, [name]: value }));
  };

  // Save updates
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/api/worker', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        skills: worker.skills,
        workCity: worker.workCity,
        rating: Number(worker.rating)
      }),
    });

    if (res.ok) {
      alert('Worker details updated successfully');
      setIsEditing(false);
    } else {
      const errText = await res.text();
      alert('Failed to update worker details: ' + errText);
    }
  };

  if (loading) {
    return <p className="text-center mt-6">Loading worker details...</p>;
  }

  return (
        <div className="min-h-screen bg-gray-200">
          <div className="max-w-4xl mx-auto p-4  ">
            <div className="bg-white shadow rounded p-6 space-y-8 ">
              {/* User Profile and Worker Details together */}
              <UserProfile />
              <Location/>
              <div>
                <h2 className="text-2xl font-bold mb-6">Editable Details</h2>

                {!isEditing ? (
                  <div className="space-y-3">
                    <p><strong>Skills:</strong> {worker.skills || 'N/A'}</p>
                    <p><strong>City:</strong> {worker.workCity || 'N/A'}</p>
                    <p><strong>Rating:</strong> {worker.rating ?? 'N/A'}</p>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit Details
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block font-medium mb-1">Skills</label>
                      <input
                        type="text"
                        name="skills"
                        value={worker.skills}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="e.g. Plumbing, Electrical"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Work City</label>
                      <input
                        type="text"
                        name="workCity"
                        value={worker.workCity}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        value={worker.rating}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="0 to 5"
                      />
                    </div>

                    <div className="flex space-x-4 mt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                    
                  </form>
                )}
              </div>
            </div>
                       
      </div>
      
   </div>
  );
};

export default WorkerProfile;
