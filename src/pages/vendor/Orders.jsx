import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/apiClient';

const Orders = () => {
  const { isDark } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/vendor/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
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
        <h1 className={`text-3xl font-bold ${textColor} mb-8`}>Sales Orders</h1>

        {loading ? (
          <p className={textColor}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className={`${cardBg} shadow rounded-lg p-8 text-center`}>
            <p className={textColor}>No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className={`${cardBg} shadow rounded-lg p-6`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Order ID</p>
                    <p className={`text-lg font-semibold ${textColor}`}>{order.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Buyer</p>
                    <p className={textColor}>{order.buyerName}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Date</p>
                    <p className={textColor}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${secondaryText}`}>Amount</p>
                    <p className="font-semibold text-green-600">₦{order.total?.toLocaleString()}</p>
                  </div>
                  <button className="text-red-600 hover:underline">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;