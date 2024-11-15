import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaLinkedin,
  FaUniversity,
  FaBook
} from 'react-icons/fa';
import { studentSignup } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    university: '',
    course: '',
    yearOfStudy: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'yearOfStudy' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await studentSignup(formData);

      // Store the token in localStorage
      localStorage.setItem('token', response.token);

      // Set the user in context
      setUser({
        id: response.student.id,
        email: response.student.email,
        firstName: response.student.firstName,
        lastName: response.student.lastName,
        role: response.student.role
      });

      // Show success message
      toast.success('Registration successful!');

      // Navigate to dashboard
      navigate('/student-dashboard');
    } catch (err) {
      console.error('Signup Error:', err);
      setError(err.response?.data?.message || 'Failed to signup');
      toast.error(err.response?.data?.message || 'Failed to signup');
    } finally {
      setLoading(false);
    }
  };

  const BackToHomeButton = () => (
    <motion.button
      onClick={() => navigate('/')}
      className="absolute top-4 left-4 flex items-center text-white hover:text-blue-200 transition-colors duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaArrowLeft className="mr-2" />
      <span>Back to Home</span>
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <BackToHomeButton />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your student account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="sr-only">First Name<span className="text-red-500 ml-1">*</span></label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="First Name*"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Last Name*"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address*"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Phone Number* (+254...)"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="sr-only">University</label>
              <input
                id="university"
                name="university"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="University*"
                value={formData.university}
                onChange={handleChange}
              />
            </div>

            {/* Course */}
            <div>
              <label htmlFor="course" className="sr-only">Course</label>
              <input
                id="course"
                name="course"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Course*"
                value={formData.course}
                onChange={handleChange}
              />
            </div>

            {/* Year of Study */}
            <div>
              <label htmlFor="yearOfStudy" className="sr-only">Year of Study</label>
              <select
                id="yearOfStudy"
                name="yearOfStudy"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={formData.yearOfStudy}
                onChange={handleChange}
              >
                <option value="">Select Year of Study*</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password*"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`
                group relative w-full flex justify-center py-3 px-4
                border border-transparent text-sm font-medium rounded-md
                text-white bg-blue-600 hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                transition-all duration-300 ease-in-out
                ${loading ? 'bg-blue-400 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating your account...</span>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>Create Account</span>
                </motion.div>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
