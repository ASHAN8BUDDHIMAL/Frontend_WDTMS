import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const SaveContact = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    phone: "", address: "", district: "", city: "", postalCode: "", userType: ""
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/reg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Registration successful!");
        navigate('/login');
      } else {
        setErrorMessage(result.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?technology')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-3xl">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Create Your Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text" name="firstName" value={formData.firstName}
                onChange={handleChange} placeholder="First Name" required
                className="px-3 py-2 border rounded-md w-full"
              />
              <input
                type="text" name="lastName" value={formData.lastName}
                onChange={handleChange} placeholder="Last Name" required
                className="px-3 py-2 border rounded-md w-full"
              />
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="Email" required
                className="px-3 py-2 border rounded-md w-full col-span-2"
              />
              <input
                type="tel" name="phone" value={formData.phone}
                onChange={handleChange} placeholder="Phone" required
                className="px-3 py-2 border rounded-md w-full col-span-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text" name="address" value={formData.address}
                onChange={handleChange} placeholder="Address" required
                className="px-3 py-2 border rounded-md w-full"
              />
              <input
                type="text" name="district" value={formData.district}
                onChange={handleChange} placeholder="District" required
                className="px-3 py-2 border rounded-md w-full"
              />
              <input
                type="text" name="city" value={formData.city}
                onChange={handleChange} placeholder="City" required
                className="px-3 py-2 border rounded-md w-full"
              />
              <input
                type="text" name="postalCode" value={formData.postalCode}
                onChange={handleChange} placeholder="Postal Code" required
                className="px-3 py-2 border rounded-md w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="Password" required
                className="px-3 py-2 border rounded-md w-full"
              />
              <input
                type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} placeholder="Confirm Password" required
                className="px-3 py-2 border rounded-md w-full"
              />
            </div>

            <div>
              <select
                name="userType" value={formData.userType}
                onChange={handleChange} required
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select User Type</option>
                <option value="customer">Customer</option>
                <option value="worker">Worker</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Register
              </button>
            </div>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaveContact;
