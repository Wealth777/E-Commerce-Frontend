import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const FounderBuyers = () => {
  const { isDark } = useTheme();

  // Styling helpers
  const bgColor = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // --- PHASE 1 MOCK BUYERS DATA ---
  const [buyers, setBuyers] = useState([
    { 
      id: 'B-901', 
      name: 'Aisha Yusuf', 
      email: 'aisha.y@campus.edu', 
      status: 'Active', 
      totalOrders: 14, 
      totalSpend: '₦84,500',
      recentPurchases: ['Scientific Calculator fx-991EX', 'Engineering Notebook']
    },
    { 
      id: 'B-902', 
      name: 'Chioma Nnaji', 
      email: 'chioma1@campus.edu', 
      status: 'Suspended', 
      totalOrders: 2, 
      totalSpend: '₦12,000',
      recentPurchases: ['Rechargeable Desk Fan']
    },
    { 
      id: 'B-903', 
      name: 'Musa Ibrahim', 
      email: 'musa.ib@campus.edu', 
      status: 'Active', 
      totalOrders: 27, 
      totalSpend: '₦194,200',
      recentPurchases: ['HP EliteBook 840 G5', 'Laptop Stand']
    },
    { 
      id: 'B-904', 
      name: 'Kunle Adebayo', 
      email: 'kunle.ade@campus.edu', 
      status: 'Active', 
      totalOrders: 0, 
      totalSpend: '₦0',
      recentPurchases: []
    }
  ]);

  // Toggle user restriction status state
  const handleToggleStatus = (id) => {
    setBuyers(buyers.map(b => {
      if (b.id === id) {
        const updatedStatus = b.status === 'Active' ? 'Suspended' : 'Active';
        if (selectedBuyer?.id === id) setSelectedBuyer({ ...selectedBuyer, status: updatedStatus });
        return { ...b, status: updatedStatus };
      }
      return b;
    }));
  };

  const filteredBuyers = buyers.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${bgColor} py-12 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Buyer Management</h1>

        {/* Search Engine Controller */}
        <div className={`${cardBg} p-4 rounded-xl shadow-md border ${borderColor} mb-6`}>
          <input
            type="text"
            placeholder="Search buyers by name, school email, profile token ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${borderColor} bg-transparent ${textColor} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Buyers Data Feed */}
          <div className={`lg:col-span-2 ${cardBg} shadow-md rounded-xl border ${borderColor} overflow-hidden`}>
            <div className="overflow-x-auto">
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
                      <tr key={buyer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-4">
                          <div className={`font-bold ${textColor}`}>{buyer.name}</div>
                          <div className={`text-xs ${subTextColor}`}>{buyer.email}</div>
                        </td>
                        <td className="p-4">
                          <div className={`text-sm font-bold text-emerald-600`}>{buyer.totalSpend}</div>
                          <div className={`text-xs ${subTextColor}`}>{buyer.totalOrders} total orders placed</div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => setSelectedBuyer(buyer)}
                            className="text-xs font-semibold px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md"
                          >
                            Track Metrics
                          </button>
                          <button
                            onClick={() => handleToggleStatus(buyer.id)}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md text-white ${
                              buyer.status === 'Active' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-emerald-600 hover:bg-emerald-700'
                            }`}
                          >
                            {buyer.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={`p-8 text-center text-sm ${subTextColor}`}>
                        No buyer account accounts match your active filter key parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column Metric Trace Profile Summary */}
          <div>
            {selectedBuyer ? (
              <div className={`${cardBg} p-6 rounded-xl shadow-md border ${borderColor} space-y-6`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-lg font-bold ${textColor}`}>{selectedBuyer.name} Details</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      selectedBuyer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>{selectedBuyer.status}</span>
                  </div>
                  <p className={`text-xs ${subTextColor}`}>Account ID reference: {selectedBuyer.id}</p>
                </div>
                <hr className={borderColor} />

                {/* Purchase Stream Audit */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Recent Purchase History Queue
                  </h4>
                  {selectedBuyer.recentPurchases.length > 0 ? (
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