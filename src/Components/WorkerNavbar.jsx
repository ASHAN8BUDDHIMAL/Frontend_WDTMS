import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, MessageSquare } from "lucide-react";

const WorkerNavbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
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
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/worker/tasks-assigned" className="nav-link">Tasks</Link>
            <Link to="/worker/availability-calendar" className="nav-link">Availability</Link>
            {/* <Link to="/worker/completed-tasks" className="nav-link">Completed</Link> */}
            <Link to="/worker/worker-report" className="nav-link">Report</Link>
            <Link to="/worker/review-rating" className="nav-link">Reviews</Link>
            <Link to="/worker/worker-chat" className="nav-link flex items-center gap-1">
              <MessageSquare className="w-4 h-4" /> Chat
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 text-white bg-blue-600 px-3 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <span>Profile</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <Link to="/worker/worker-profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">My Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white shadow-md space-y-2">
          <Link to="/worker/tasks-assigned" className="block nav-link">Tasks</Link>
          <Link to="/worker/completed-tasks" className="block nav-link">Completed</Link>
          {/* <Link to="/worker/worker-report" className="nav-link">Report</Link> */}
      
          <Link to="/worker/review-rating" className="block nav-link">Reviews</Link>
          <Link to="/worker/worker-chat" className="block nav-link flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> Chat
          </Link>
          <Link to="/worker/worker-profile" className="block nav-link">My Profile</Link>
          <button onClick={handleLogout} className="w-full text-left text-red-600 hover:underline">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default WorkerNavbar;
