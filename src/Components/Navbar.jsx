import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo with Image and Text */}
        <Link to="/" className="flex items-center space-x-2">
          {/* Replace '/logo.png' with your actual logo image path */}
          <img 
            src="/images/FindWorkerLogo.png" 
            alt="findWorker Logo" 
            className="h-10 w-10 object-contain" 
          />
          <span className="text-2xl font-bold text-blue-600">findWorker</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-blue-600 transition">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-blue-600 transition">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-blue-600 transition">
            <Link to="/services">Services</Link>
          </li>
          <li className="hover:text-blue-600 transition">
            <Link to="/help">Help</Link>
          </li>
        </ul>

        {/* Right Aligned Auth Links */}
        <div className="flex space-x-4">
          <Link
            to="/registration"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-300 transition"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
