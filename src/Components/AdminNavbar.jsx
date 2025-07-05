import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const AdminNavbar = () => {
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
          {/* Logo */}
          <div className="text-xl font-bold text-indigo-700">AdminPanel</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/admin/manage-users" className="nav-link">Users</Link>
            <Link to="/admin/notice" className="nav-link">Notice</Link>
            <Link to="/admin/manage-tasks" className="nav-link">Manage Tasks</Link>
            <Link to="/admin/reports" className="nav-link">Reports</Link>
            <Link to="/admin/settings" className="nav-link">Settings</Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-2 text-white bg-indigo-600 px-3 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              <span>Admin</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <Link to="/admin/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 bg-white shadow-md space-y-2">
          <Link to="/admin/notice" className="block nav-link">Notice</Link>
          <Link to="/admin/manage-users" className="block nav-link">Manage Users</Link>
          <Link to="/admin/manage-tasks" className="block nav-link">Manage Tasks</Link>
          <Link to="/admin/reports" className="block nav-link">Reports</Link>
          <Link to="/admin/settings" className="block nav-link">Settings</Link>
          <button onClick={handleLogout} className="w-full text-left text-red-600 hover:underline">Logout</button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
