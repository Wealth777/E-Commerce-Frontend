import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import apiClient, { founderAPI } from '../../api/apiClient'; // Switched to central Axios client

const FounderUsers = () => {
  const { isDark } = useTheme();

  // --- SYSTEM STATES ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Theme Helpers
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // --- AXIOS FETCH USERS ---
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await founderAPI.getUsers();
      // Safely check common backend structural response keys
      setUsers(response.data.users || response.data);
      setError(null);
    } catch (err) {
      console.error("Fetch user registry error:", err);
      setError("Failed to load user registry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- AXIOS PATCH STATUS CHANGES ---
  const toggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus === 'Suspended' ? 'activate' : 'suspend';
    if (!window.confirm(`Are you sure you want to ${action} this user account?`)) return;

    try {
      await apiClient.patch(`/founder/users/${userId}/${action}`);
      
      const updatedStatus = action === 'activate' ? 'Active' : 'Suspended';
      // Update locally
      setUsers(users.map(u => u.id === userId ? { ...u, status: updatedStatus } : u));
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, status: updatedStatus });
      }
    } catch (err) {
      console.error(`Failed to update user status:`, err);
      alert(`Could not change user status to ${action}.`);
    }
  };

  // --- AXIOS DELETE HANDLING ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("CRITICAL WARNING: Permanently delete this account? This removes all storefront/buyer access entirely and cannot be undone.")) return;

    try {
      await apiClient.delete(`/founder/users/${userId}`);
      
      // Clear from local array
      setUsers(users.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(null);
    } catch (err) {
      console.error("Deletion sequence rejected:", err);
      alert("Backend rejected account deletion request.");
    }
  };

  // Search Filter logic
  const filteredUsers = users.filter(u => 
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id?.toString().includes(searchTerm)
  );

  return (
    <div className={`min-h-screen ${bgColor} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>User Management Registry</h1>

        {/* Search Bar Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-4 rounded-xl border ${borderColor} ${cardBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Dynamic Data Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className={`${cardBg} shadow-md rounded-xl border ${borderColor} overflow-hidden`}>
              {loading ? (
                <div className="py-12 text-center text-sm text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-2"></div>
                  <p>Streaming secure server directory...</p>
                </div>
              ) : filteredUsers.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/40' : 'bg-gray-50'} text-xs font-bold uppercase ${subTextColor}`}>
                      <th className="p-4">User Info</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${borderColor} text-sm ${textColor}`}>
                    {filteredUsers.map((u) => (
                      <tr 
                        key={u.id} 
                        onClick={() => setSelectedUser(u)}
                        className={`cursor-pointer transition-colors ${selectedUser?.id === u.id ? (isDark ? 'bg-gray-700/40' : 'bg-emerald-50/50') : (isDark ? 'hover:bg-gray-800/60' : 'hover:bg-gray-50')}`}
                      >
                        <td className="p-4">
                          <div className="font-semibold">{u.fullName}</div>
                          <div className={`text-xs ${subTextColor}`}>{u.email}</div>
                        </td>
                        <td className="p-4 capitalize">{u.role || 'Buyer'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${u.status === 'Suspended' ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'}`}>
                            {u.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => toggleUserStatus(u.id, u.status)}
                              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${u.status === 'Suspended' ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white' : 'border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white'}`}
                            >
                              {u.status === 'Suspended' ? 'Activate' : 'Suspend'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="px-3 py-1 text-xs font-semibold rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={`p-12 text-center text-sm ${subTextColor}`}>No matching users found.</div>
              )}
            </div>
          </div>

          {/* Right Sidebar Inspector View */}
          <div>
            <div className={`${cardBg} shadow-md rounded-xl p-6 border ${borderColor} sticky top-6`}>
              <h3 className={`text-xl font-bold ${textColor} mb-4`}>User Details Panel</h3>
              {selectedUser ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className={`text-xs font-bold ${subTextColor} uppercase block mb-1`}>Unique ID</label>
                    <div className={`${textColor} font-mono bg-gray-100 dark:bg-gray-900/50 p-2 rounded-lg text-xs`}>{selectedUser.id}</div>
                  </div>
                  <div>
                    <label className={`text-xs font-bold ${subTextColor} uppercase block mb-1`}>Full Name</label>
                    <div className={textColor}>{selectedUser.fullName}</div>
                  </div>
                  <div>
                    <label className={`text-xs font-bold ${subTextColor} uppercase block mb-1`}>Email Address</label>
                    <div className={textColor}>{selectedUser.email}</div>
                  </div>
                  <div>
                    <label className={`text-xs font-bold ${subTextColor} uppercase block mb-1`}>System Priority Access</label>
                    <div className="capitalize font-semibold text-emerald-500">{selectedUser.role || 'Buyer'}</div>
                  </div>
                  <div>
                    <label className={`text-xs font-bold ${subTextColor} uppercase block mb-1`}>Current Condition</label>
                    <div className={`font-bold ${selectedUser.status === 'Suspended' ? 'text-red-500' : 'text-green-500'}`}>{selectedUser.status || 'Active'}</div>
                  </div>
                </div>
              ) : (
                <p className={`${subTextColor} text-center py-12 border-2 border-dashed ${borderColor} rounded-xl`}>Select a profile record from the list registry to run real-time checks.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FounderUsers;