import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://localhost:8080/api/admin/users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchText, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      alert('Failed to fetch users');
      setLoading(false);
    }
  };

  const searchUsers = async (keyword) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/search?keyword=${keyword}`);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      alert('Failed to search users');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    try {
      await axios.delete(`http://localhost:8080/api/admin/users/delete/${id}`);
      alert('User deleted successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      alert(`Failed to delete user: ${error.response?.data?.message || error.message}`);
    }
  }
};

  const toggleStatus = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus ? 'deactivate' : 'activate';
      await axios.put(`${API_BASE_URL}/${id}/${endpoint}`);
      alert(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      alert(`Failed to ${currentStatus ? 'deactivate' : 'activate'} user`);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    const updatedUser = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      userType: e.target.userType.value,
      address: e.target.address.value,
      district: e.target.district.value,
      city: e.target.city.value,
      postalCode: e.target.postalCode.value,
      active: selectedUser.active, // include this if needed
      password: selectedUser.password // only if password is required for update
    };

    await axios.put(
      `http://localhost:8080/api/admin/users/update/${selectedUser.id}`,
      updatedUser,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    alert('User updated successfully');
    setIsModalOpen(false);
    fetchUsers(); // refresh the list
  } catch (error) {
    console.error('Update error:', error.response?.data || error.message);
    alert(`Failed to update user: ${error.response?.data?.message || error.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 pt-16"> {/* Added pt-16 for nav bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-3xl text-gray-600">User Management</h2>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              {/* <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search users..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              /> */}
              <input
                  type="text"
                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchText}
                  onChange={(e) => {
                    const keyword = e.target.value;
                    setSearchText(keyword);
                    searchUsers(keyword); // 🔥 Call the function!
                  }}
                  placeholder="Search users..."
                />

            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <ArrowPathIcon className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {user.profilePicture ? (
                                <img className="h-10 w-10 rounded-full" src={`data:image/jpeg;base64,${user.profilePicture}`} alt="" />
                              ) : (
                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.userType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setEditMode(true);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => toggleStatus(user.id, user.active)}
                              className={user.active ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"}
                            >
                              {user.active ? (
                                <XMarkIcon className="h-5 w-5" />
                              ) : (
                                <CheckIcon className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {editMode ? 'Edit User' : 'User Details'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex-shrink-0 h-24 w-24">
                        {file ? (
                          <img className="h-24 w-24 rounded-full" src={URL.createObjectURL(file)} alt="" />
                        ) : selectedUser.profilePicture ? (
                          <img className="h-24 w-24 rounded-full" src={`data:image/jpeg;base64,${selectedUser.profilePicture}`} alt="" />
                        ) : (
                          <UserCircleIcon className="h-24 w-24 text-gray-400" />
                        )}
                      </div>
                      {editMode && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Profile photo</label>
                          <div className="mt-1 flex items-center">
                            <label
                              htmlFor="file-upload"
                              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <ArrowUpTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
                              Change
                            </label>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          defaultValue={selectedUser.firstName}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          defaultValue={selectedUser.lastName}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          defaultValue={selectedUser.email}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          defaultValue={selectedUser.phone}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                          User Type
                        </label>
                        <select
                          id="userType"
                          name="userType"
                          defaultValue={selectedUser.userType}
                          disabled={!editMode}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="CUSTOMER">Customer</option>
                          <option value="WORKER">Worker</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          defaultValue={selectedUser.address}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          defaultValue={selectedUser.city}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                          District
                        </label>
                        <input
                          type="text"
                          name="district"
                          id="district"
                          defaultValue={selectedUser.district}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          id="postalCode"
                          defaultValue={selectedUser.postalCode}
                          disabled={!editMode}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {editMode && (
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;