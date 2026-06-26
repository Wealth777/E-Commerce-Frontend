import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../api/apiClient'; // Switched to central Axios client

const FounderVendors = () => {
  const { isDark } = useTheme();

  // --- LIVE BACKEND STATE ---
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTab, setFilterTab] = useState('Pending'); // Options: 'Pending', 'Approved', 'All'

  // Theme Helpers
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // --- FETCH VENDORS FROM API ---
  const fetchVendors = async () => {
    try {
      setLoading(true);
      // Connects to your partner's vendor query path
      const response = await API.get('/api/founder/vendors');
      setVendors(response.data.vendors || response.data);
      setError(null);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setError("Failed to retrieve the vendor applications directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // --- APPROVAL / REJECTION ACTIONS ---
  const handleApproveVendor = async (id) => {
    if (window.confirm("Approve this vendor application? They will gain full market permissions immediately.")) {
      try {
        await API.patch(`/api/founder/vendors/${id}/approve`);
        
        // Smoothly update state locally
        setVendors(vendors.map(v => v.id === id ? { ...v, verificationStatus: 'Approved' } : v));
      } catch (err) {
        console.error("Approval request failed:", err);
        alert("Could not process vendor approval.");
      }
    }
  };

  const handleRejectVendor = async (id) => {
    const reason = window.prompt("Enter reason for rejection (this will be sent to the student):");
    if (reason === null) return; // Cancelled prompt

    try {
      await API.patch(`/api/founder/vendors/${id}/reject`, { reason });
      
      // Update state locally
      setVendors(vendors.map(v => v.id === id ? { ...v, verificationStatus: 'Rejected' } : v));
    } catch (err) {
      console.error("Rejection request failed:", err);
      alert("Could not process vendor rejection.");
    }
  };

  // Filter Logic based on active Tab
  const filteredVendors = vendors.filter(vendor => {
    if (filterTab === 'All') return true;
    return vendor.verificationStatus === filterTab;
  });

   if (loading) {
      return <Loading text="Loading Registered Vendors..." />;
    }

  return (
    <div className={`min-h-screen ${bgColor} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className={`text-3xl font-bold ${textColor} mb-2`}>Vendor Verification Hub</h1>
        <p className={`${subTextColor} mb-8`}>Review student business applications and manage storefront selling privileges.</p>

        {/* Tab Switcher Controller */}
        <div className="flex border-b ${borderColor} mb-6 gap-6">
          {['Pending', 'Approved', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                filterTab === tab ? 'text-emerald-500' : subTextColor
              }`}
            >
              {tab} Requests
              {filterTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Vendors Grid / List Workspace */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full py-12 text-center text-sm ${subTextColor}">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mb-2"></div>
              <p>Syncing verification channels...</p>
            </div>
          ) : filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <div key={vendor.id} className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor} flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-bold ${textColor}`}>{vendor.shopName || vendor.name}</h3>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      vendor.verificationStatus === 'Approved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
                        : vendor.verificationStatus === 'Rejected'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 animate-pulse'
                    }`}>
                      {vendor.verificationStatus}
                    </span>
                  </div>
                  <p className={`text-xs ${subTextColor} mb-4`}>Owner: {vendor.ownerName} ({vendor.email})</p>
                  
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'} text-sm ${textColor} mb-4`}>
                    <p className="text-xs text-gray-400 font-medium uppercase mb-1">Declared Inventory Catalog</p>
                    {vendor.description || "No description catalog supplied by applicant."}
                  </div>
                </div>

                {/* Conditional Action Controls Panel */}
                {vendor.verificationStatus === 'Pending' && (
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleApproveVendor(vendor.id)}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Approve Merchant
                    </button>
                    <button
                      onClick={() => handleRejectVendor(vendor.id)}
                      className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-700 text-gray-800 dark:text-white rounded-lg font-semibold text-sm transition-colors"
                    >
                      Decline Request
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={`col-span-full p-12 text-center text-sm border-2 border-dashed ${borderColor} rounded-xl ${subTextColor}`}>
              No {filterTab.toLowerCase()} merchant requests listed in local queue registries.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FounderVendors;