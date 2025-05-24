import React, { useState, useEffect } from "react";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    city: "",
    postalCode: "",
    userType: "",
  });

  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("User not logged in.");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        fetchProfilePicture(data.email);
      })
      .catch((err) => {
        console.error(err);
        alert("Please log in to view your profile.");
      });
  }, []);

  const fetchProfilePicture = (email) => {
    fetch(`http://localhost:8080/api/profilePic?email=${email}`)
      .then((res) => {
        if (res.ok) return res.blob();
        throw new Error("No profile picture found.");
      })
      .then((imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        setProfilePicUrl(imageUrl);
      })
      .catch(() => setProfilePicUrl(null));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = () => {
    if (!selectedFile || !userData.id) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`http://localhost:8080/api/${userData.id}/uploadProfilePic`, {
      method: "POST",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload failed");
        alert("Profile picture uploaded!");
        fetchProfilePicture(userData.email);
      })
      .catch(() => alert("Error uploading image"));
  };
 

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 pt-24">
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
      <div className="rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3">
           {/* Profile Picture */}
            <div className="bg-teal-600 text-white flex flex-col items-center justify-center p-6 rounded-bl-xl">
              <div className="mb-4">
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg transition duration-300"
                  />
                ) : profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg transition duration-300"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-lg font-semibold shadow-lg">
                    No Image
                  </div>
                )}
              </div>

              <label className="cursor-pointer text-sm font-semibold bg-white text-green-600 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100 transition">
               Edit Profile
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className={`mt-3 px-4 py-2 rounded-full text-sm font-semibold transition ${
                  selectedFile
                    ? "bg-white text-green-600 hover:bg-gray-100"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Update
              </button>
            </div>


            {/* Profile Info */}
            <div className="col-span-2 p-8 space-y-6">
              <h2 className="text-3xl font-extrabold text-teal-600 tracking-wide outline-4">My Profile</h2>

              <ProfileField label="Name" value={`${userData.firstName} ${userData.lastName}`} />
              <ProfileField label="Email" value={userData.email} />
              <ProfileField label="Phone" value={userData.phone} />
              <ProfileField label="User Type" value={userData.userType} />

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Address</h3>
                <p className="text-gray-700 mt-1">
                  {userData.address}<br />
                  {userData.city}, {userData.district}<br />
                  {userData.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{label}</h3>
    <p className="text-gray-700 mt-1">{value || "—"}</p>
  </div>
);

export default UserProfile;
