import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Loading from '../../components/Layout/Loading';
import apiClient, { founderAPI } from '../../api/apiClient'; // Fixed central import setup

const FounderBuyers = () => {
  const { isDark } = useTheme();

  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // --- REWIRED AXIOS FETCH VIA FOUNDER API UTILITIES ---
  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const response = await founderAPI.getUsers('Buyer');
      console.log("RAW BUYERS BACKEND RESPONSE:", response);

      // Extract array safely from response nested data or direct array structures
      const extractedBuyers = response?.data?.users || response?.data || [];
      
      if (Array.isArray(extractedBuyers)) {
        setBuyers(extractedBuyers);
      } else {
        console.error("Expected an array payload but received:", extractedBuyers);
        setBuyers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Fetch buyers registry error:", err);
      setError("Failed to load platform buyer metrics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  // --- REWIRED METRICS MODIFIER VIA CENTRAL AXIOS INSTANCE ---
  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === 'Active' ? 'suspend' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this buyer account?`)) return;

    try {
      // Using direct base instance client matching your route patterns
      await apiClient.patch(`/founder/users/${id}/${action}`);
      const updatedStatus = action === 'activate' ? 'Active' : 'Suspended';
      
      setBuyers(prev => prev.map(b => b.id === id ? { ...b, status: updatedStatus } : b));
      if (selectedBuyer?.id === id) {
        setSelectedBuyer(prev => ({ ...prev, status: updatedStatus }));
      }
    } catch (err) {
      console.error("Failed to update status dynamically:", err);
      alert(`Could not process account action change to ${action}.`);
    }
  };

  // Safe check filter pattern using optional chaining values
  const filteredBuyers = (buyers || []).filter(b => 
    b?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b?.id?.toString().includes(searchTerm)
  );

  if (loading) {
    return <Loading text="Loading Buyers..." />;
  }
  // JSX Return
  return (
    <div className={`min-h-screen ${bgColor} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Buyer Management</h1>

        <div className={`${cardBg} p-4 rounded-xl shadow-md border ${borderColor} mb-6`}>
          <input
            type="text"
            placeholder="Search buyers by name, school email, profile token ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${borderColor} bg-transparent ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className={`lg:col-span-2 ${cardBg} shadow-md rounded-xl border ${borderColor} overflow-hidden`}>
            <div className="overflow-x-auto">
              {loading ? (
                <div className={`py-12 text-center text-sm ${subTextColor}`}>
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mb-2"></div>
                  <p>Streaming core customer data registries...</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
                      <th className={`p-4 text-sm font-semibold ${textColor}`}>Buyer Info</th>
                      <th className={`p-4 text-sm font-semibold ${textColor}`}>Platform Spend</th>
                      <th className={`p-4 text-sm font-semibold text-right ${textColor}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredBuyers.length > 0 ? (
                      filteredBuyers.map((buyer) => (
                        <tr key={buyer?.id || Math.random()} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="p-4">
                            <div className={`font-bold ${textColor}`}>{buyer?.name || 'Anonymous Student'}</div>
                            <div className={`text-xs ${subTextColor}`}>{buyer?.email || 'No Linked Email'}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-bold text-emerald-600">₦{Number(buyer?.totalSpend || 0).toLocaleString()}</div>
                            <div className={`text-xs ${subTextColor}`}>{buyer?.totalOrders || 0} total orders placed</div>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedBuyer(buyer)}
                              className="text-xs font-semibold px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md"
                            >
                              Track Metrics
                            </button>
                            <button
                              onClick={() => handleToggleStatus(buyer.id, buyer.status)}
                              className={`text-xs font-semibold px-2.5 py-1.5 rounded-md text-white transition-colors ${
                                buyer?.status === 'Suspended' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-orange-500 hover:bg-orange-600'
                              }`}
                            >
                              {buyer?.status === 'Suspended' ? 'Activate' : 'Suspend'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className={`p-8 text-center text-sm ${subTextColor}`}>
                          No buyer records match your active search filter parameters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div>
            {selectedBuyer ? (
              <div className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor} space-y-6`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-lg font-bold ${textColor}`}>{selectedBuyer?.name} Details</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedBuyer?.status === 'Suspended' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                    }`}>
                      {selectedBuyer?.status || 'Active'}
                    </span>
                  </div>
                  <p className={`text-xs ${subTextColor}`}>Account ID reference: {selectedBuyer?.id}</p>
                </div>
                <hr className={borderColor} />

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Recent Purchase History Queue
                  </h4>
                  {selectedBuyer?.recentPurchases && selectedBuyer.recentPurchases.length > 0 ? (
                    <ul className="space-y-2">
                      {selectedBuyer.recentPurchases.map((item, index) => (
                        <li 
                          key={index} 
                          className={`text-xs p-2 rounded border ${borderColor} bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300`}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-xs italic ${subTextColor}`}>This consumer account has not cleared any marketplace checkout streams yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${cardBg} p-6 rounded-xl border-2 border-dashed ${borderColor} text-center ${subTextColor} p-8`}>
                Select a shopper record to extract order telemetry files and control profile permissions parameters instantly.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FounderBuyers;