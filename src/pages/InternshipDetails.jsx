import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaUsers, FaBriefcase, FaCalendarAlt, FaGraduationCap, FaChevronLeft, FaInfoCircle, FaPaperPlane, FaUser, FaEnvelope, FaPhone, FaUniversity, FaFileAlt, FaTimes, FaSpinner, FaMoneyBillWave } from 'react-icons/fa';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext'; // Adjust the import path as needed

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  console.log('Auth State:', { user, isAuthenticated });

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    coverLetter: '',
    attachments: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileErrors, setFileErrors] = useState([]);

  // Fetch internship data
  useEffect(() => {
    const fetchInternship = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/students/internships/${id}`);
        console.log('API Response:', response.data);
        console.log('Internship Data:', response.data.internship);

        if (response.data.success) {
          setInternship(response.data.internship);
        } else {
          setError('Failed to fetch internship details');
          toast.error('Failed to fetch internship details');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.response?.data?.message || 'Error fetching internship details');
        toast.error(error.response?.data?.message || 'Error fetching internship details');
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  // Also log the current internship state when it changes
  useEffect(() => {
    console.log('Current Internship State:', internship);
  }, [internship]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/find-internships')}
          className="text-blue-500 hover:text-blue-700"
        >
          Back to Internships
        </button>
      </div>
    );
  }

  // Show not found state
  if (!internship) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Internship not found</p>
        <button
          onClick={() => navigate('/find-internships')}
          className="text-blue-500 hover:text-blue-700"
        >
          Back to Internships
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      coverLetter: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: Array.from(e.target.files)
    }));
  };

  const validateFiles = (files) => {
    const errors = [];
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 5;

    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return errors;
    }

    Array.from(files).forEach(file => {
      const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

      if (!allowedTypes.includes(extension)) {
        errors.push(`${file.name}: Invalid file type. Only PDF, DOC, DOCX allowed`);
      }

      if (file.size > maxSize) {
        errors.push(`${file.name}: File size exceeds 5MB limit`);
      }
    });

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFileErrors([]);

    // Validate files
    const errors = validateFiles(formData.attachments);
    if (errors.length > 0) {
      setFileErrors(errors);
      return;
    }

    // Validate cover letter
    if (!formData.coverLetter.trim()) {
      toast.error('Cover letter is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();

      // Add cover letter
      formDataToSend.append('coverLetter', formData.coverLetter);

      // Add files
      formData.attachments.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      const response = await axios.post(
        `/students/internships/${id}/apply`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );

      if (response.data.success) {
        toast.success('Application submitted successfully!');
        navigate('/student-dashboard/my-applications');
      }
    } catch (error) {
      console.error('Application Error:', error);

      if (error.response?.status === 400) {
        toast.error('You have already applied for this internship');
      } else if (error.response?.status === 413) {
        toast.error('Files are too large. Maximum size is 5MB per file');
      } else {
        toast.error('Failed to submit application. Please try again');
      }
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setIsApplyModalOpen(false);
      setFormData({
        coverLetter: '',
        attachments: []
      });
    }
  };

  const closeModal = () => {
    setIsApplyModalOpen(false);
    setCurrentStep(1);
    setFormData({
      coverLetter: '',
      attachments: []
    });
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Education</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700">University</label>
                <input
                  type="text"
                  name="university"
                  id="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">Expected Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  id="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Application Documents</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                  Resume (PDF, DOC, DOCX - Max 5MB)
                </label>
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  required
                />
                {fileErrors.length > 0 && (
                  <div className="mt-2">
                    {fileErrors.map((error, index) => (
                      <p key={index} className="text-red-500 text-sm">{error}</p>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">Cover Letter</label>
                <textarea
                  name="coverLetter"
                  id="coverLetter"
                  rows="4"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                ></textarea>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/find-internships" className="flex items-center text-white hover:text-blue-200 transition-colors">
            <FaChevronLeft className="mr-2" />
            <span className="font-medium">Back to Internships</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-right"
          >
            <h1 className="text-3xl font-bold text-white mb-1 shadow-text">
              {internship.title}
            </h1>
            <p className="text-blue-200 text-sm font-medium">
              at {internship.company.name}
            </p>
          </motion.div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Only render the content if internship data exists */}
        {internship && (
          <div className="px-4 py-6 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{internship.company.name}</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{internship.location}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaBriefcase className="mr-2 text-blue-500" /> Type
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{internship.category}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaClock className="mr-2 text-blue-500" /> Duration
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{internship.duration}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-2 text-red-500" /> Application Deadline
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(internship.applicationDeadline).toLocaleDateString()}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaUsers className="mr-2 text-purple-500" /> Applicants
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{internship.applicantCount}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <FaGraduationCap className="mr-2 text-yellow-500" /> Positions
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{internship.positions}</dd>
                  </div>
                </dl>
              </div>

              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Description</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{internship.description}</p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {internship.responsibilities?.map((responsibility, index) => (
                    <li key={index} className="text-sm text-gray-500">{responsibility}</li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {internship.requirements?.map((requirement, index) => (
                    <li key={index} className="text-sm text-gray-500">{requirement}</li>
                  ))}
                </ul>
              </div>
              {internship.benefits && internship.benefits.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {internship.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-500">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* For tags section */}
              {internship.tags && internship.tags.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {internship.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Now section at the bottom */}
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Ready to start your journey?</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Apply now and take the first step towards your dream career!
                    </p>
                  </div>
                  {user?.role === 'student' ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => setIsApplyModalOpen(true)}
                    >
                      <FaPaperPlane className="mr-2" />
                      Apply Now
                    </motion.button>
                  ) : (
                    <div className="text-center">
                      <Link
                        to="/login"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaUser className="mr-2" />
                        Login to Apply
                      </Link>
                      <p className="mt-2 text-sm text-gray-500">
                        You must be logged in as a student to apply for this internship.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && internship && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-10 inset-0 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              >
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={closeModal}
                  >
                    <span className="sr-only">Close</span>
                    <FaTimes className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaPaperPlane className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Apply for {internship.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Please fill out the application form below. We'll review your application and get back to you soon.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                          Cover Letter <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="coverLetter"
                          name="coverLetter"
                          rows="4"
                          value={formData.coverLetter}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                          placeholder="Explain why you're applying for this position..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Attachments (Resume, etc.) - Max 5 files, 5MB each
                        </label>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          multiple
                          accept=".pdf,.doc,.docx"
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                        {fileErrors.length > 0 && (
                          <div className="mt-2">
                            {fileErrors.map((error, index) => (
                              <p key={index} className="text-red-500 text-sm">{error}</p>
                            ))}
                          </div>
                        )}
                        {formData.attachments.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              Selected files ({formData.attachments.length}/5):
                            </p>
                            <ul className="list-disc pl-5">
                              {formData.attachments.map((file, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {isSubmitting && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm ${
                          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InternshipDetails;
