import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaSpinner } from 'react-icons/fa';
import axios from '../../config/axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const ApplicationsContent = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [internshipFilter, setInternshipFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/companies/applications');
        if (response.data.success) {
          setApplications(response.data.applications);
        }
      } catch (error) {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Get unique internships for filter
  const internships = ['all', ...new Set(applications.map(app => app.internship.title))];

  // Filtering
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || (
      app.internship.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesInternship = internshipFilter === 'all' || app.internship._id === internshipFilter;

    return matchesSearch && matchesStatus && matchesInternship;
  });

  // Update application status
  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      const response = await axios.patch(`/companies/applications/${applicationId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        setApplications(applications.map(app =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        ));
        toast.success('Application status updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  // Application Modal Component
  const ApplicationModal = ({ application, onClose, onUpdateStatus }) => {
    const [newStatus, setNewStatus] = useState(application.status);
    const [isExpanded, setIsExpanded] = useState(false);
    const baseUrl = 'http://localhost:3000'; // Backend URL

    // Function to handle CV file opening
    const handleFileOpen = (fileUrl) => {
      const fullUrl = `${baseUrl}/${fileUrl}`;
      window.open(fullUrl, '_blank');
    };

    // Function to truncate text with word boundaries
    const truncateText = (text, maxLength = 200) => {
      if (text.length <= maxLength) return text;
      const truncated = text.slice(0, maxLength);
      // Find the last space before the cutoff
      const lastSpace = truncated.lastIndexOf(' ');
      return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="relative p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white mx-4"
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
        >
          <div className="mt-3">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Application Details
            </h3>
            <div className="space-y-4">
              {/* Student Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Student Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <p><span className="font-medium">Name:</span> {application.student?.firstName} {application.student?.lastName}</p>
                  <p><span className="font-medium">Email:</span> {application.student?.email}</p>
                  <p><span className="font-medium">University:</span> {application.student?.university}</p>
                  <p><span className="font-medium">Course:</span> {application.student?.course}</p>
                  <p><span className="font-medium">Year:</span> {application.student?.yearOfStudy}</p>
                </div>
              </div>

              {/* Position and Date */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><span className="font-medium">Position:</span> {application.internship.title}</p>
                <p><span className="font-medium">Applied:</span> {new Date(application.applicationDate).toLocaleDateString()}</p>
              </div>

              {/* Cover Letter - Updated styling */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Cover Letter</h4>
                <div className="prose max-w-none">
                  <div
                    className={`bg-white p-4 rounded border ${
                      isExpanded ? 'max-h-[600px]' : 'max-h-[200px]'
                    } overflow-y-auto`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm text-gray-600" style={{ maxWidth: '100%' }}>
                      {isExpanded ? application.coverLetter : truncateText(application.coverLetter)}
                    </p>
                  </div>
                  {application.coverLetter.length > 200 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-blue-600 hover:text-blue-800 mt-2 text-sm flex items-center"
                    >
                      {isExpanded ? (
                        <>
                          <span>Show Less</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Read More</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Attachments */}
              {application.attachments && application.attachments.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
                  <ul className="space-y-2">
                    {application.attachments.map((attachment, index) => (
                      <li key={index} className="flex items-center">
                        <button
                          onClick={() => handleFileOpen(attachment.url)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                          </svg>
                          {attachment.originalFilename}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status Update */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  className="w-full border rounded-md p-2"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(application._id, newStatus);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Pagination
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Internship Applications</h2>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by internship title..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <div className="relative">
            <select
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <FaFilter className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative">
        <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
          <thead>
            <tr className="text-left">
              <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Position</th>
              <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Date</th>
              <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Status</th>
              <th className="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-3 text-gray-600 font-bold tracking-wider uppercase text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentApplications.map((application) => (
              <tr key={application._id}>
                <td className="border-dashed border-t border-gray-200 px-6 py-4">
                  {application.internship.title}
                </td>
                <td className="border-dashed border-t border-gray-200 px-6 py-4">
                  {new Date(application.applicationDate).toLocaleDateString()}
                </td>
                <td className="border-dashed border-t border-gray-200 px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      application.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'}`}
                  >
                    {application.status}
                  </span>
                </td>
                <td className="border-dashed border-t border-gray-200 px-6 py-4">
                  <button
                    onClick={() => setSelectedApplication(application)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(filteredApplications.length / applicationsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default ApplicationsContent;
