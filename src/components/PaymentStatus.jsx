import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PaymentStatus = ({ status, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg p-8 flex flex-col items-center max-w-sm mx-4 w-full"
      >
        {status === 'processing' && (
          <div className="relative w-24 h-24 mb-4">
            <motion.div
              className="absolute inset-0 border-4 border-blue-200 rounded-full"
            />
            <motion.div
              className="absolute inset-0 border-4 border-blue-600 rounded-full"
              style={{ borderRightColor: 'transparent', borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <FaCheck className="text-4xl text-green-600" />
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4"
          >
            <FaTimes className="text-4xl text-red-600" />
          </motion.div>
        )}

        <p className="text-center text-gray-800 text-lg font-medium mb-2">
          {status === 'processing' && 'Processing Payment...'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'error' && 'Payment Failed'}
        </p>

        <p className="text-center text-gray-600">
          {message}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PaymentStatus;
