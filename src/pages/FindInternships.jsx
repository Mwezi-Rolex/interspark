import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaArrowLeft, FaSpinner, FaSortAmountDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import InternshipCard from '../components/InternshipCard';
import { useAuth } from '../contexts/AuthContext';

const FindInternships = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    isRemote: false,
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [internships, setInternships] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 9
  });

  // Categories list (you might want to fetch this from API)
  const categories = [
    'Technology',
    'Marketing',
    'Finance',
    'Design',
    'Engineering',
    'Business',
    'Healthcare'
  ];

  // Fetch internships from API
  const fetchInternships = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit: pagination.limit,
        ...filters.search && { search: filters.search },
        ...filters.category && { category: filters.category },
        ...filters.location && { location: filters.location },
        ...filters.isRemote && { isRemote: true },
        sortBy: filters.sortBy,
        order: filters.order
      });

      const response = await axios.get(`/students/internships?${params}`);

      if (response.data.success) {
        setInternships(response.data.internships);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching internships';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      isRemote: false,
      sortBy: 'createdAt',
      order: 'desc'
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchInternships();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchInternships(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [filters]);

  // Add handlePageChange function
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchInternships(newPage);
      // Scroll to top of results
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleBackNavigation = () => {
    if (user) {
      navigate('/student-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-4">
            <motion.button
              onClick={handleBackNavigation}
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaArrowLeft className="inline-block mr-2" />
              <span className="font-medium">
                {user ? 'Back to Dashboard' : 'Back to Home'}
              </span>
            </motion.button>
            {isLoggedIn && (
              <Link
                to="/student-dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Find Internships</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search internships..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <select
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <select
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">All Locations</option>
                  <option value="Nairobi">Nairobi</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('order', order);
                  }}
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="applicationDeadline-asc">Deadline (Soonest)</option>
                  <option value="applicationDeadline-desc">Deadline (Latest)</option>
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.isRemote}
                    onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remote Only</span>
                </label>
              </div>

              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && internships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 space-y-4"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-16 h-16"
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
              Finding internships...
            </motion.p>
          </motion.div>
        )}

        {/* Add loading overlay when fetching more results */}
        {loading && internships.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative w-16 h-16"
              >
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </motion.div>
              <p className="text-gray-700 font-medium">Updating results...</p>
            </motion.div>
          </motion.div>
        )}

        {/* Add loading skeletons for a smoother experience */}
        {loading && internships.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  <div className="animate-pulse space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && internships.length === 0 && (
          <div className="text-center text-red-600 p-4">
            <p>{error}</p>
            <button
              onClick={() => fetchInternships()}
              className="mt-2 text-blue-500 hover:text-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && internships.length === 0 && (
          <div className="text-center text-gray-600 p-4">
            <p>No internships found matching your criteria.</p>
          </div>
        )}

        {/* Internships Grid */}
        {internships.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {internships.map((internship, index) => (
                <motion.div
                  key={internship._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {internship.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(internship.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-700 font-medium">{internship.company.companyName}</p>
                        <p className="text-gray-600">{internship.location}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {internship.isRemote && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Remote
                          </span>
                        )}
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {internship.duration}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {internship.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {internship.tags.map(tag => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span>
                          {internship.applicantCount} applicant{internship.applicantCount !== 1 ? 's' : ''}
                        </span>
                        <span>
                          {internship.openings} opening{internship.openings !== 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Deadline: {new Date(internship.applicationDeadline).toLocaleDateString()}
                        </span>
                        <Link
                          to={`/internships/${internship._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-4 py-2 rounded ${
                    pagination.page === 1
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-700'
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`px-4 py-2 rounded ${
                    pagination.page === pagination.pages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FindInternships;
