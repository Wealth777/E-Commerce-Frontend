import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: <FiCheckCircle className="h-5 w-5 text-green-500" />,
    error: <FiXCircle className="h-5 w-5 text-red-500" />,
    warning: <FiAlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <FiInfo className="h-5 w-5 text-blue-500" />
  };
  
  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/200 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/200 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/200 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/200 border-blue-200 dark:border-blue-800'
  };
  
  return (
    <div className={`flex items-center p-4 mb-2 rounded-lg border ${bgColors[type]} animate-slide-down`}>
      {icons[type]}
      <p className="ml-3 text-sm font-medium text-gray-900 dark:text-black">
        {message}
      </p>
      <button
        onClick={onClose}
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 text-gray-400 hover:text-gray-900 dark:hover:text-black"
      >
        <span className="sr-only">Close</span>
        <FiXCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;