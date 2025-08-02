import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCommentAlt, FaUpload, FaUserCircle } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker, HiOutlineIdentification } from 'react-icons/hi';

const Profile = ({ currentUserId }) => {
  const [user, setUser] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/profile", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          
          sessionStorage.setItem('userId', data.id);
          sessionStorage.setItem('userName', `${data.firstName} ${data.lastName}`);
          
          fetchProfilePic(data.email);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const fetchProfilePic = async (email) => {
    try {
      const res = await fetch(`http://localhost:8080/api/profilePic?email=${email}`, {
        credentials: "include",
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setProfilePicUrl(url);
        sessionStorage.setItem('userAvatar', url);
      } else {
        setProfilePicUrl(null);
      }
    } catch (error) {
      console.error("Error loading profile picture:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`http://localhost:8080/api/${user.id}/uploadProfilePic`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-md shadow-lg animate-fade-in';
        notification.textContent = 'Profile picture updated successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.classList.add('animate-fade-out');
          setTimeout(() => notification.remove(), 500);
        }, 3000);
        
        fetchProfilePic(user.email);
      } else {
        alert("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleMessageClick = () => {
    if (!currentUserId || !user) return;
    
    navigate('/chat', { 
      state: { 
        predefinedRecipient: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: profilePicUrl
        }
      } 
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-red-600 mb-2">User not found</h2>
        <p className="text-gray-600">We couldn't retrieve your profile information. Please try again later.</p>
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{`${user.firstName} ${user.lastName}`}</h1>
              <p className="text-blue-100 capitalize">{user.userType}</p>
            </div>
            {/* <button 
              onClick={handleMessageClick}
              className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
              title="Send Message"
            >
              <FaCommentAlt className="text-white text-xl" />
            </button> */}
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center">
              <div className="relative group">
                {profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-white -mt-16 group-hover:opacity-90 transition-all duration-300"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center -mt-16 border-4 border-white">
                    <FaUserCircle className="text-gray-400 text-6xl" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full -mt-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <label htmlFor="file-upload" className="cursor-pointer bg-black/50 rounded-full p-3">
                    <FaUpload className="text-white text-xl" />
                  </label>
                </div>
              </div>

              <div className="mt-6 w-full space-y-4">
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full px-4 py-2 text-center bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors duration-300"
                >
                  Choose Image
                </label>
                {selectedFile && (
                  <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
                )}
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                    !selectedFile || uploading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="w-full md:w-2/3 lg:w-3/4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                    <HiOutlineIdentification className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="text-lg font-semibold text-gray-800">{`${user.firstName} ${user.lastName}`}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg text-green-600">
                    <HiOutlineMail className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-lg font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                    <HiOutlinePhone className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-lg font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                    <HiOutlineIdentification className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">User Type</h3>
                    <p className="text-lg font-semibold text-gray-800 capitalize">{user.userType}</p>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-start space-x-4">
                  <div className="p-3 bg-red-100 rounded-lg text-red-600">
                    <HiOutlineLocationMarker className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="text-lg font-semibold text-gray-800">
                      {user.address ? `${user.address}, ${user.city}, ${user.district}, ${user.postalCode}` : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;