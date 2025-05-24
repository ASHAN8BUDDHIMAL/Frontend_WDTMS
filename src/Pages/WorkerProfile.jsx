import React, { useState, useEffect } from "react";

const UserProfile = () => {
  // userData holds basic profile info
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

  // workerData holds the worker-specific details
  const [workerData, setWorkerData] = useState({
    skills: "",
    city: "",
    rating: "",
  });

  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditingWorker, setIsEditingWorker] = useState(false);
  const [isWorkerExist, setIsWorkerExist] = useState(false);

  // On mount: fetch profile, picture, and worker details if userType === 'worker'
  useEffect(() => {
    fetch("http://localhost:8080/api/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        fetchProfilePicture(data.email);
        if (data.userType === "worker") {
          fetchWorkerInfo();
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Please log in to view your profile.");
      });
  }, []);

  // Fetch profile picture blob and convert to URL
  const fetchProfilePicture = (email) => {
    fetch(`http://localhost:8080/api/profilePic?email=${email}`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.blob();
        throw new Error("No profile picture");
      })
      .then((blob) => {
        setProfilePicUrl(URL.createObjectURL(blob));
      })
      .catch(() => setProfilePicUrl(null));
  };

  // Fetch worker info from /api/worker
  const fetchWorkerInfo = () => {
    fetch("http://localhost:8080/api/worker", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 404) {
          setIsWorkerExist(false);
          return null;
        }
        if (!res.ok) throw new Error("Worker info not found");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setWorkerData({
            skills: data.skills || "",
            city: data.workCity || "",
            rating: data.rating != null ? data.rating.toString() : "",
          });
          setIsWorkerExist(true);
        }
      })
      .catch(console.error);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload profile picture
  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(`http://localhost:8080/api/${userData.id}/uploadProfilePic`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Upload failed");
        alert("Profile picture uploaded!");
        fetchProfilePicture(userData.email);
      })
      .catch((err) => {
        console.error(err);
        alert("Error uploading image");
      });
  };

  // Create or update worker info
  const handleWorkerUpdate = () => {
    const payload = {
      skills: workerData.skills,
      workCity: workerData.city,           // must match your entity
      rating: parseFloat(workerData.rating),
    };

    fetch("http://localhost:8080/api/worker", {
      method: isWorkerExist ? "PUT" : "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) return res.text().then((txt) => { throw new Error(txt || res.status); });
        alert("Worker info saved!");
        setIsEditingWorker(false);
        setIsWorkerExist(true);
      })
      .catch((err) => {
        console.error("Save worker error:", err);
        alert("Error saving worker info: " + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 pt-24">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Profile Picture Panel */}
          <div className="bg-teal-600 text-white flex flex-col items-center justify-center p-6 rounded-bl-xl">
            <div className="mb-4">
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Profile"
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-lg font-semibold shadow-lg">
                  No Image
                </div>
              )}
            </div>
            <label className="cursor-pointer text-sm font-semibold bg-white text-green-600 px-4 py-2 rounded-full shadow-sm hover:bg-gray-100">
              Change Picture
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`mt-3 px-4 py-2 rounded-full text-sm font-semibold ${
                selectedFile
                  ? "bg-white text-green-600 hover:bg-gray-100"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Upload
            </button>
          </div>

          {/* Profile & Worker Details */}
          <div className="col-span-2 p-8 space-y-6">
            <h2 className="text-3xl font-extrabold text-teal-600">My Profile</h2>
            <ProfileField label="Name" value={`${userData.firstName} ${userData.lastName}`} />
            <ProfileField label="Email" value={userData.email} />
            <ProfileField label="Phone" value={userData.phone} />
            <ProfileField label="User Type" value={userData.userType} />
            <ProfileField
              label="Address"
              value={`${userData.address}, ${userData.city}, ${userData.district} ${userData.postalCode}`}
            />

            {userData.userType === "worker" && (
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-teal-600">Worker Details</h3>
                  <button
                    onClick={() => setIsEditingWorker(!isEditingWorker)}
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {isEditingWorker ? "Cancel" : isWorkerExist ? "Edit" : "Add"}
                  </button>
                </div>

                {isEditingWorker ? (
                  <div className="mt-4 space-y-4">
                    <InputField
                      label="Skills"
                      value={workerData.skills}
                      onChange={(val) => setWorkerData({ ...workerData, skills: val })}
                    />
                    <InputField
                      label="City"
                      value={workerData.city}
                      onChange={(val) => setWorkerData({ ...workerData, city: val })}
                    />
                    <InputField
                      label="Rating"
                      type="number"
                      value={workerData.rating}
                      onChange={(val) => setWorkerData({ ...workerData, rating: val })}
                    />
                    <button
                      onClick={handleWorkerUpdate}
                      className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <ProfileField label="Skills" value={workerData.skills} />
                    <ProfileField label="City" value={workerData.city} />
                    <ProfileField label="Rating" value={workerData.rating} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-500 uppercase">{label}</h3>
    <p className="text-gray-700 mt-1">{value || "—"}</p>
  </div>
);

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
    />
  </div>
);

export default UserProfile;
