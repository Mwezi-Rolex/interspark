import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaRegBookmark, FaRegFile, FaRegBell, FaChevronRight, FaUserCircle, FaBriefcase, FaMoneyBillWave, FaSignOutAlt } from 'react-icons/fa';
import ProfileSection from '../components/ProfileSection';
import SponsorshipApplication from '../components/SponsorshipApplication';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../services/authService';
import axios from '../config/axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [showSponsorshipModal, setShowSponsorshipModal] = useState(false);
  const { setUser } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [loadingActions, setLoadingActions] = useState({});
  const [currentInternship, setCurrentInternship] = useState(null);
  const [loadingInternship, setLoadingInternship] = useState(true);
  const [sponsorshipApplications, setSponsorshipApplications] = useState([]);
  const [loadingSponsorships, setLoadingSponsorships] = useState(true);

  const recommendedInternships = [
    { id: 1, title: 'Software Engineer Intern', company: 'Safaricom', location: 'Nairobi', logo: '/images/safaricom-logo.png' },
    { id: 2, title: 'Marketing Assistant', company: 'KCB Bank', location: 'Mombasa', logo: '/images/kcb-logo.png' },
    { id: 3, title: 'Data Analyst Intern', company: 'Equity Bank', location: 'Kisumu', logo: '/images/equity-logo.png' },
  ];


  // Get user from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userDisplayName = `${storedUser.firstName} ${storedUser.lastName}`;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const handleSponsorshipClick = () => {
    setShowSponsorshipModal(true);
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoadingOffers(true);
        const response = await axios.get('/students/applications/accepted');
        if (response.data.success) {
          setOffers(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch offers:', error);
      } finally {
        setLoadingOffers(false);
      }
    };

    fetchOffers();
  }, []);

  const handleOfferAction = async (applicationId, action) => {
    try {
      setLoadingActions(prev => ({ ...prev, [applicationId]: true }));

      const response = await axios.post(`/students/applications/${applicationId}/offer`, {
        action: action
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Update the offers list to reflect the new status
        setOffers(prevOffers =>
          prevOffers.map(offer =>
            offer._id === applicationId
              ? { ...offer, status: response.data.application.status }
              : offer
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process offer action');
    } finally {
      setLoadingActions(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  useEffect(() => {
    const fetchCurrentInternship = async () => {
      try {
        setLoadingInternship(true);
        const response = await axios.get('/students/active-internships');
        if (response.data.success && response.data.data.length > 0) {
          setCurrentInternship(response.data.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch current internship:', error);
      } finally {
        setLoadingInternship(false);
      }
    };

    fetchCurrentInternship();
  }, []);

  useEffect(() => {
    const fetchSponsorshipApplications = async () => {
      try {
        setLoadingSponsorships(true);
        const response = await axios.get('/students/sponsorship-applications');
        if (response.data.success) {
          setSponsorshipApplications(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch sponsorship applications:', error);
      } finally {
        setLoadingSponsorships(false);
      }
    };

    fetchSponsorshipApplications();
  }, []);

  const canApplyForSponsorship = () => {
    if (!currentInternship) return false;

    const hasActiveOrPendingApplication = sponsorshipApplications.some(
      app => ['pending', 'active'].includes(app.status)
    );

    return !hasActiveOrPendingApplication;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Karibu, {storedUser.firstName}!</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaRegBell className="text-2xl cursor-pointer hover:text-yellow-400 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </div>
            <div className="relative" ref={dropdownRef}>
              <FaUserCircle
                className="text-3xl cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
              />
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <div className="font-medium">{userDisplayName}</div>
                    <div className="text-gray-500 text-xs">{storedUser.email}</div>
                  </div>
                  <Link
                    to="/student-dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {showProfile ? (
          <ProfileSection user={storedUser} />
        ) : (
          <>
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md mb-8"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: <FaSearch />, text: 'Find Internships', color: 'bg-blue-600', link: '/find-internships' },
                  { icon: <FaRegBookmark />, text: 'Saved Internships', color: 'bg-green-500', link: '/student-dashboard/saved-internships' },
                  { icon: <FaRegFile />, text: 'My Applications', color: 'bg-yellow-500', link: '/student-dashboard/my-applications' },
                ].map((action, index) => (
                  <Link key={index} to={action.link}>
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                      whileTap={{ scale: 0.95 }}
                      className={`${action.color} p-4 rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer transition-all duration-300 text-white`}
                    >
                      <span className="text-2xl mb-2">{action.icon}</span>
                      <span className="text-sm font-medium text-center">{action.text}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Current Internship and Sponsorship */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Current Internship & Sponsorship</h2>
                {loadingInternship || loadingSponsorships ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Current Internship Details */}
                    {currentInternship ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-lg text-gray-800">
                              {currentInternship.internship.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {currentInternship.company.companyName} - {currentInternship.company.location}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                            Active
                          </span>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p className="mb-1">
                            <span className="font-medium">Duration:</span> {currentInternship.internship.duration}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Period:</span> {new Date(currentInternship.startDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} - {new Date(currentInternship.endDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Industry:</span> {currentInternship.company.industry}
                          </p>
                        </div>

                        {/* Sponsorship Status */}
                        <div className="mt-6 border-t pt-4">
                          <h3 className="text-lg font-semibold mb-3">Sponsorship Status</h3>
                          {sponsorshipApplications.length > 0 ? (
                            <div className="space-y-3">
                              {sponsorshipApplications.map(app => (
                                <div key={app._id} className="bg-gray-50 p-4 rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium">{app.sponsorshipPackage.name}</h4>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      app.status === 'active' ? 'bg-green-100 text-green-800' :
                                      app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Amount: {app.sponsorshipPackage.amount.toLocaleString()} KES
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : canApplyForSponsorship() ? (
                            <button
                              onClick={handleSponsorshipClick}
                              className="w-full px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 flex items-center justify-center transition duration-300"
                            >
                              <FaMoneyBillWave className="mr-2" />
                              Apply for Sponsorship Package
                            </button>
                          ) : (
                            <p className="text-gray-600">
                              You need an active internship to apply for sponsorship
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        You don't have an active internship at the moment.
                      </p>
                    )}
                  </>
                )}
              </motion.div>

              {/* Recommended Internships */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Recommended Internships</h2>
                <ul className="space-y-6">
                  {recommendedInternships.map((internship) => (
                    <li key={internship.id} className="flex items-center space-x-4 hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                      <img src={internship.logo} alt={internship.company} className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-800">{internship.title}</h3>
                        <p className="text-sm text-gray-600">{internship.company} - {internship.location}</p>
                      </div>
                      <FaBriefcase className="text-blue-600" />
                    </li>
                  ))}
                </ul>
                <button className="mt-6 text-blue-600 font-medium flex items-center hover:text-blue-800 transition-colors">
                  View All Recommendations
                  <FaChevronRight className="ml-2" />
                </button>
              </motion.div>
            </div>

            {/* Offers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Offers</h2>
              {loadingOffers ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : offers.length > 0 ? (
                <ul className="space-y-6">
                  {offers.map((offer) => (
                    <motion.li
                      key={offer._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gradient-to-r from-blue-50 to-white p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-800">
                          {offer.internship.title}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Offered
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Company:</span> {offer.internship.company.companyName}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Location:</span> {offer.internship.location}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            <span className="font-medium">Duration:</span> {offer.internship.duration}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Start Date:</span> {new Date(offer.internship.startDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {offer.status !== 'offer_accepted' && (
                        <div className="mt-4 flex justify-end space-x-3">
                          <button
                            onClick={() => handleOfferAction(offer._id, 'decline')}
                            disabled={loadingActions[offer._id]}
                            className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleOfferAction(offer._id, 'accept')}
                            disabled={loadingActions[offer._id]}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                          >
                            {loadingActions[offer._id] ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </>
                            ) : (
                              'Accept Offer'
                            )}
                          </button>
                        </div>
                      )}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <FaBriefcase className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500">No offers available at the moment</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </main>

      {showSponsorshipModal && (
        <SponsorshipApplication onClose={() => setShowSponsorshipModal(false)} />
      )}
    </div>
  );
};

export default StudentDashboard;
