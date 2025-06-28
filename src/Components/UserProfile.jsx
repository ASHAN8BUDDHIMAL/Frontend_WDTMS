import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCommentAlt } from 'react-icons/fa';

const Profile = ({ currentUserId }) => {
  const [user, setUser] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
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
          
          // Store user ID and name in session storage
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
        
        // Store profile picture URL in session storage
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

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(`http://localhost:8080/api/${user.id}/uploadProfilePic`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        alert("Uploaded successfully!");
        fetchProfilePic(user.email);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <div className="text-center mt-10 text-red-600">User not found.</div>;

  return (
    <div className="max-w-10xl mx-auto p-6 mt-10 space-y-5 border border-blue-200 rounded-xl p-5 bg-white relative">
      <button 
        onClick={handleMessageClick}
        className="absolute top-4 right-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition"
        title="Send Message"
      >
        <FaCommentAlt className="text-blue-600 text-xl" />
      </button>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="text-center">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-blue-300"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              No Image
            </div>
          )}

          <div className="mt-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-sm file-input-bordered"
            />
            <button
              onClick={handleUpload}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Upload
            </button>
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User Type</p>
              <p className="font-medium capitalize">{user.userType}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{`${user.address}, ${user.city}, ${user.district}, ${user.postalCode}`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;