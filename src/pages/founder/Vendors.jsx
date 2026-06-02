import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FounderVendors = () => {
  const { isDark } = useTheme();

  // Styling helpers
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // --- TABS STATE ---
  const [activeTab, setActiveTab] = useState('Pending'); // Pending | Approved | Rejected
  const [selectedVendor, setSelectedVendor] = useState(null);

  // --- PHASE 1 MOCK VENDORS ---
  const [vendors, setVendors] = useState([
    { 
      id: 'V-201', 
      storeName: 'Unilag Tech Hub', 
      owner: 'Emeka Okafor', 
      status: 'Approved', 
      category: 'Electronics', 
      joinedDate: '2026-05-10',
      products: [
        { name: 'HP EliteBook 840 G5', price: '₦320,000', stock: 3 },
        { name: 'Rechargeable Desk Fan', price: '₦18,500', stock: 12 }
      ]
    },
    { 
      id: 'V-202', 
      storeName: 'Campus Bookstore', 
      owner: 'Tunde Bakare', 
      status: 'Approved', 
      category: 'Books & Stationery', 
      joinedDate: '2026-05-01',
      products: [
        { name: 'Engineering Mathematics Vol 2', price: '₦8,500', stock: 45 },
        { name: 'Scientific Calculator fx-991EX', price: '₦15,000', stock: 10 }
      ]
    },
    { 
      id: 'V-203', 
      storeName: 'Kofa Groceries', 
      owner: 'Zainab Bello', 
      status: 'Pending', 
      category: 'Food & Groceries', 
      joinedDate: '2026-05-28',
      products: [] 
    },
    { 
      id: 'V-204', 
      storeName: 'Smart Fashion', 
      owner: 'David Kola', 
      status: 'Pending', 
      category: 'Clothing', 
      joinedDate: '2026-05-29',
      products: [] 
    },
    { 
      id: 'V-205', 
      storeName: 'Cheap Grills', 
      owner: 'Samson Akpan', 
      status: 'Rejected', 
      category: 'Food & Groceries', 
      joinedDate: '2026-04-12',
      products: [] 
    }
  ]);

  // --- ACTION CONTROLLERS ---
  const handleApprove = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: 'Approved' } : v));
    if (selectedVendor?.id === id) setSelectedVendor({ ...selectedVendor, status: 'Approved' });
  };

  const handleReject = (id) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: 'Rejected' } : v));
    if (selectedVendor?.id === id) setSelectedVendor({ ...selectedVendor, status: 'Rejected' });
  };

  const handleSuspend = (id) => {
    if (window.confirm("Suspend this vendor's shop and listings permanently?")) {
      setVendors(vendors.map(v => v.id === id ? { ...v, status: 'Suspended' } : v));
      if (selectedVendor?.id === id) setSelectedVendor({ ...selectedVendor, status: 'Suspended' });
    }
  };

  // Filter based on selected UI Tab status selection
  const filteredVendors = vendors.filter(v => v.status === activeTab);

  return (
    <div className={`min-h-screen ${bgColor} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Vendor Management</h1>

        {/* Dynamic Status Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 space-x-4">
          {['Pending', 'Approved', 'Rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedVendor(null); }}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all px-2 ${
                activeTab === tab 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} Approvals ({vendors.filter(v => v.status === tab).length})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main List Table Area */}
          <div className={`lg:col-span-2 ${cardBg} shadow-md rounded-xl border ${borderColor} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`border-b ${borderColor} ${isDark ? 'bg-gray-900/50' : 'bg-gray-100'}`}>
                    <th className={`p-4 text-sm font-semibold ${textColor}`}>Store Details</th>
                    <th className={`p-4 text-sm font-semibold ${textColor}`}>Category</th>
                    <th className={`p-4 text-sm font-semibold text-right ${textColor}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-4">
                          <div className={`font-bold ${textColor}`}>{vendor.storeName}</div>
                          <div className={`text-xs ${subTextColor}`}>Owner: {vendor.owner} • ID: {vendor.id}</div>
                        </td>
                        <td className="p-4 text-sm">
                          <span className={textColor}>{vendor.category}</span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="text-xs font-semibold px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:opacity-90"
                          >
                            Inspect View
                          </button>
                          
                          {vendor.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(vendor.id)}
                                className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(vendor.id)}
                                className="text-xs font-semibold px-2.5 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {vendor.status === 'Approved' && (
                            <button
                              onClick={() => handleSuspend(vendor.id)}
                              className="text-xs font-semibold px-2.5 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                            >
                              Suspend Shop
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={`p-8 text-center text-sm ${subTextColor}`}>
                        No vendors inside the "{activeTab}" records view block.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Detailed & Product Inspection Column Side Widget */}
          <div>
            {selectedVendor ? (
              <div className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor} space-y-6`}>
                <div>
                  <h3 className={`text-lg font-bold ${textColor}`}>{selectedVendor.storeName} Profile</h3>
                  <p className={`text-xs ${subTextColor}`}>Registered Date: {selectedVendor.joinedDate}</p>
                </div>
                <hr className={borderColor} />

                {/* Vendor Live Inventory List */}
                <div>
                  <h4 className={`text-sm font-semibold uppercase tracking-wider text-emerald-600 mb-3`}>
                    Listed Products ({selectedVendor.products.length})
                  </h4>
                  {selectedVendor.products.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedVendor.products.map((p, i) => (
                        <div key={i} className={`p-2.5 rounded-lg border ${borderColor} bg-gray-50/50 dark:bg-gray-900/30 flex justify-between items-center text-xs`}>
                          <div>
                            <p className={`font-semibold ${textColor}`}>{p.name}</p>
                            <p className={subTextColor}>Available Stock: {p.stock} units</p>
                          </div>
                          <span className={`font-bold text-emerald-600`}>{p.price}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-xs italic ${subTextColor}`}>This account vendor currently doesn't have any products uploaded to the platform marketplace structure.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${cardBg} p-6 rounded-xl border-2 border-dashed ${borderColor} text-center ${subTextColor} p-8`}>
                Click "Inspect View" on any vendor row record to process action credentials and map their catalog parameters directly.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default FounderVendors;