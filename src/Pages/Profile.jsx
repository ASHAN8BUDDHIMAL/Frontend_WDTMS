
import React from 'react';
import UserProfile from '../Components/UserProfile'; // ✅ corrected import path

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="max-w-6xl mx-auto px-2 mt-10">
        <div className="bg-white shadow-2xl rounded-2xl p-10 space-y-2">
      <UserProfile />
    </div>
    </div>
   </div>
  );
};

export default Profile;
