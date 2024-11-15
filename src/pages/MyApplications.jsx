import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaRegFile, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaMinusCircle, FaSpinner } from 'react-icons/fa';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      toast.error('Please login as a student to view applications');
      return;
    }
  }, [user, navigate]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/students/applications');
        console.log('Applications Response:', response.data); // Debug log

        if (response.data.success) {
          setApplications(response.data.data);
        } else {
          throw new Error('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError(error.response?.data?.message || 'Error fetching applications');
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'student') {
      fetchApplications();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'reviewing':
      case 'pending':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'withdrawn':
        return <FaMinusCircle className="text-gray-500" />;
      default:
        return <FaRegFile className="text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse h-8 w-48 bg-gray-200 rounded"></div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <motion.div
              className="flex flex-col items-center justify-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="relative w-16 h-16 mb-4"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 font-medium"
              >
                Loading your applications...
              </motion.p>
            </motion.div>

            {/* Loading Skeletons */}
            <div className="divide-y divide-gray-200">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="px-4 py-4 sm:px-6"
                >
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-3 bg-gray-200 rounded w-36"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/student-dashboard" className="text-blue-500 hover:text-blue-700">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Applications</h1>
          <Link to="/student-dashboard" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {applications.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {applications.map((application, index) => (
                <motion.li
                  key={application._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            {application.internship.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {application.internship.company.companyName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(application.status)}
                        <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <FaRegFile className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          Applied on {new Date(application.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">You haven't applied to any internships yet.</p>
            <Link
              to="/find-internships"
              className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              Find Internships
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;

