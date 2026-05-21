import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaTrash, FaBan } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';
import { getList, getMessage } from '../../utils/apiResponse';

const Users = () => {
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = searchParams.get('role') || 'buyer';

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get(`/founder/users?role=${role}`);
      setUsers(getList(response, ['users']));
    } catch (error) {
      toast.error(getMessage(error, 'Failed to load users'));
    } finally {
      setLoading(false);
    }
  };

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const secondaryText = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen ${bgColor} py-12`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Manage {role === 'buyer' ? 'Buyers' : 'Vendors'}</h1>

        {loading ? (
          <p className={textColor}>Loading users...</p>
        ) : users.length === 0 ? (
          <div className={`${cardBg} shadow rounded-lg p-8 text-center`}>
            <p className={textColor}>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full ${cardBg}`}>
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Name</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Email</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Phone</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Joined</th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${textColor}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`px-6 py-4 ${textColor}`}>{user.fullName}</td>
                    <td className={`px-6 py-4 ${secondaryText}`}>{user.email}</td>
                    <td className={`px-6 py-4 ${secondaryText}`}>{user.phone}</td>
                    <td className={`px-6 py-4 ${secondaryText}`}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className={`px-6 py-4 flex gap-2`}>
                      <button className="text-yellow-600 hover:underline flex items-center gap-1">
                        <FaBan /> Suspend
                      </button>
                      <button className="text-red-600 hover:underline flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;