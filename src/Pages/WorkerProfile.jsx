import React, { useEffect, useState } from 'react';
import UserProfile from '../Components/UserProfile';
import Location from '../Components/Location';

const WorkerProfile = () => {
  const [worker, setWorker] = useState({
    skills: '',
    chargePerHour: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

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
          chargePerHour: data.chargePerHour || 0,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorker(prev => ({
      ...prev,
      [name]: name === 'chargePerHour' ? parseFloat(value) : value,
    }));
  };

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
        chargePerHour: worker.chargePerHour,
      }),
    });

    if (res.ok) {
      alert('Worker details updated successfully');

      const updatedRes = await fetch('http://localhost:8080/api/worker', {
        credentials: 'include',
      });

      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setWorker({
          skills: updatedData.skills || '',
          chargePerHour: updatedData.chargePerHour || 0,
        });
      }

      setIsEditing(false);
    } else {
      const errText = await res.text();
      alert('Failed to update worker details: ' + errText);
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-600 mt-10">Loading worker details...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 ">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-10">
          <UserProfile />
          <Location />

          <div className="space-y-5 border border-blue-200 rounded-xl p-5 bg-white">
            <h2 className="text-2xl font-extrabold text-black-800 border-b-2 border-blue-300 pb-2 mb-6">
              Editable Details
            </h2>

            {!isEditing ? (
              <div className="space-y-4 text-gray-700 ">
                <p>
                  <span className="font-semibold text-blue-700">Skills:</span>{' '}
                  {worker.skills || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold text-blue-700">Charge Per Hour:</span>{' '}
                  Rs. {worker.chargePerHour || 'N/A'}
                </p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-3 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                >
                  Edit Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={worker.skills}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="e.g. Plumbing, Electrical"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-800 mb-1">Charge Per Hour (Rs)</label>
                  <input
                    type="number"
                    name="chargePerHour"
                    value={worker.chargePerHour}
                    onChange={handleChange}
                    className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    min="0"
                    step="50"
                    placeholder="e.g. 1500"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow hover:from-green-600 hover:to-green-700 transition"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400 transition"
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
