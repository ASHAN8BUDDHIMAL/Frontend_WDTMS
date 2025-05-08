import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [editing, setEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [userData, setUserData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  // Get email from sessionStorage and fetch user
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (email) {
      fetch(`http://localhost:8080/api/users/email/${email}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((err) => console.error("Error loading user:", err));
    }
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("phone", userData.phone);
      formData.append("address", userData.address);
      if (profilePhoto) {
        formData.append("photo", profilePhoto); // backend must handle this
      }

      const response = await fetch(`http://localhost:8080/api/users/${userData.id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setEditing(false);
        setProfilePhoto(null);
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleChangePassword = () => {
    // Redirect or open modal for changing password
    alert("Redirect to change password page (implement separately)");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">My Profile</h1>

        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={
                previewPhoto ||
                userData.photoUrl ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
                <input type="file" className="hidden" onChange={handlePhotoChange} />
                ✎
              </label>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            {editing ? (
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <p className="text-gray-800">{userData.email}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Phone</label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Address</label>
            {editing ? (
              <textarea
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            ) : (
              <p className="text-gray-800">{userData.address}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center flex-wrap gap-4">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <button
                onClick={handleChangePassword}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Change Password
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
