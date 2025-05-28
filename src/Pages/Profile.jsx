
import React from 'react';
import UserProfile from '../Components/UserProfile'; // ✅ corrected import path

const Profile = () => {
  return (
    <div className="p-4 space-y-6">
      <UserProfile />
    </div>
  );
};

export default Profile;
