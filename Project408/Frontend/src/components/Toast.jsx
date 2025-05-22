import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!onClose) return;
    
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    if (type === 'success') return <FaCheckCircle className="text-green-500" size={18} />;
    if (type === 'error') return <FaExclamationCircle className="text-red-500" size={18} />;
    return null;
  };

  const getColorClass = () => {
    if (type === 'success') return 'border-l-4 border-green-500';
    if (type === 'error') return 'border-l-4 border-red-500';
    return '';
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center bg-white shadow-lg rounded-md px-4 py-3 ${getColorClass()}`}>
      {getIcon()}
      <span className="mx-3 text-gray-800">{message}</span>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <FaTimes size={14} />
        </button>
      )}
    </div>
  );
};

export default Toast;
