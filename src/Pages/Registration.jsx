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

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Password validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(formData.password)) {
      setErrorMessage(
        "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

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
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gray-900/70"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl mt-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Join FindWorker</h2>
            <p className="text-gray-600 mt-2">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text" name="firstName" value={formData.firstName}
                  onChange={handleChange} placeholder="First Name" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text" name="lastName" value={formData.lastName}
                  onChange={handleChange} placeholder="Last Name" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="Email Address" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <input
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="Phone Number" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text" name="address" value={formData.address}
                  onChange={handleChange} placeholder="Street Address" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text" name="district" value={formData.district}
                  onChange={handleChange} placeholder="District" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text" name="city" value={formData.city}
                  onChange={handleChange} placeholder="City" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text" name="postalCode" value={formData.postalCode}
                  onChange={handleChange} placeholder="Postal Code" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="Password" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="password" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Confirm Password" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <select
                name="userType" value={formData.userType}
                onChange={handleChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select Account Type</option>
                <option value="customer">I need services (Client)</option>
                <option value="worker">I provide services (Worker)</option>
              </select>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
              >
                Register Now
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveContact;