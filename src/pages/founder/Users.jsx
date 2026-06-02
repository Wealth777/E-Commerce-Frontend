import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FounderUsers = () => {
  const { isDark } = useTheme();

  // Theme Helpers
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // --- PHASE 1 MOCK USERS DATA ---
  const [users, setUsers] = useState([
    { id: 'U-101', name: 'Emeka Okafor', email: 'emeka@campus.edu', role: 'Vendor', status: 'Active', joined: '2026-05-10' },
    { id: 'U-102', name: 'Aisha Yusuf', email: 'aisha.y@campus.edu', role: 'Buyer', status: 'Active', joined: '2026-04-18' },
    { id: 'U-103', name: 'Chioma Nnaji', email: 'chioma1@campus.edu', role: 'Buyer', status: 'Suspended', joined: '2026-02-14' },
    { id: 'U-104', name: 'Tunde Bakare', email: 'tunde@gadgets.ng', role: 'Vendor', status: 'Active', joined: '2026-05-01' },
    { id: 'U-105', name: 'Musa Ibrahim', email: 'musa.ib@campus.edu', role: 'Buyer', status: 'Active', joined: '2026-05-22' },
  ]);

  // State for Searching, Filtering, and Selected Details View
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);

  // --- USER ACTIONS ---
  const handleToggleStatus = (id) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
        // If updating the currently viewed user modal, update it live too
        if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, status: newStatus });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
      if (selectedUser?.id === id) setSelectedUser(null);
    }
  };

  // Filter & Search Logic
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className={`min-h-screen ${bgColor} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>User Management</h1>

        {/* Search and Filters Controller */}
        <div className={`${cardBg} p-4 rounded-xl shadow-md border ${borderColor} mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} bg-transparent ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${subTextColor}`}>Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${borderColor} bg-transparent ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <option value="All" className={isDark ? 'bg-gray-800' : 'bg-white'}>All Roles</option>
              <option value="Buyer" className={isDark ? 'bg-gray-800' : 'bg-white'}>Buyers</option>
              <option value="Vendor" className={isDark ? 'bg-gray-800' : 'bg-white'}>Vendors</option>
            </select>
          </div>
        </div>

        {/* Main Section: Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* User Data Table Panel */}
          <div className={`lg:col-span-2 ${cardBg} shadow-md rounded-xl border ${borderColor} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
                    <th className={`p-4 text-sm font-semibold ${textColor}`}>User Info</th>
                    <th className={`p-4 text-sm font-semibold ${textColor}`}>Role</th>
                    <th className={`p-4 text-sm font-semibold ${textColor}`}>Status</th>
                    <th className={`p-4 text-sm font-semibold text-right ${textColor}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-4">
                          <div className={`font-medium ${textColor}`}>{user.name}</div>
                          <div className={`text-xs ${subTextColor}`}>{user.email}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            user.role === 'Vendor' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' 
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-200 hover:opacity-80"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`text-xs font-semibold px-2 py-1 rounded text-white ${
                              user.status === 'Active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {user.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-xs font-semibold px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={`p-8 text-center text-sm ${subTextColor}`}>
                        No matching users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column Side Panel: User Details Display Mode */}
          <div>
            {selectedUser ? (
              <div className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor} sticky top-6`}>
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`text-xl font-bold ${textColor}`}>User Profile Details</h3>
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className={`text-sm px-2 py-0.5 rounded border ${borderColor} ${subTextColor} hover:bg-gray-100 dark:hover:bg-gray-700`}
                  >
                    Close
                  </button>
                </div>
                <hr className={`mb-4 ${borderColor}`} />
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block font-medium uppercase">User ID</label>
                    <span className={`text-sm font-semibold ${textColor}`}>{selectedUser.id}</span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block font-medium uppercase">Full Name</label>
                    <span className={`text-sm font-semibold ${textColor}`}>{selectedUser.name}</span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block font-medium uppercase">Email Address</label>
                    <span className={`text-sm ${textColor}`}>{selectedUser.email}</span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block font-medium uppercase">Assigned Role</label>
                    <span className={`text-sm font-medium ${textColor}`}>{selectedUser.role}</span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block font-medium uppercase">Current Status</label>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedUser.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>{selectedUser.status}</span>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block font-medium uppercase">Registration Date</label>
                    <span className={`text-sm ${subTextColor}`}>{selectedUser.joined}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${cardBg} p-6 rounded-xl border-2 border-dashed ${borderColor} text-center ${subTextColor} p-8`}>
                Select a user row action to view full account profile details card context panel.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default FounderUsers;