import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

// Add DeleteConfirmationModal component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, jobTitle, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <FaExclamationTriangle className="h-12 w-12" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Internship</h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete "{jobTitle}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`px-4 py-2 text-white text-sm font-medium rounded-md ${
                isDeleting
                  ? 'bg-red-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const JobsContent = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    jobId: null,
    jobTitle: '',
    isDeleting: false
  });

  // Fetch jobs from API
  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`/companies/internships?page=${page}&limit=${pagination.limit}&status=open`);

      if (response.data.success) {
        setJobs(response.data.internships);
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

  useEffect(() => {
    fetchJobs();
  }, []);

  // Update handleDeleteJob
  const handleDeleteJob = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }));
    try {
      await axios.delete(`/companies/internships/${deleteModal.jobId}`);
      toast.success('Internship deleted successfully');
      fetchJobs(pagination.page); // Refresh the list
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '', isDeleting: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting internship';
      toast.error(errorMessage);
      setDeleteModal(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Add openDeleteModal function
  const openDeleteModal = (job) => {
    setDeleteModal({
      isOpen: true,
      jobId: job.id,
      jobTitle: job.title,
      isDeleting: false
    });
  };

  // Add closeDeleteModal function
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      jobId: null,
      jobTitle: '',
      isDeleting: false
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchJobs(newPage);
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <button
          onClick={() => fetchJobs()}
          className="mt-2 text-blue-500 hover:text-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Posted Jobs</h2>
        <Link
          to="/company-dashboard/create-job"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No internships posted yet.</p>
          <Link
            to="/company-dashboard/create-job"
            className="text-blue-500 hover:text-blue-700 mt-2 inline-block"
          >
            Post your first internship
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {job.applications?.length || 0} applications
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(job.applicationDeadline).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        new Date(job.applicationDeadline) > new Date()
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {new Date(job.applicationDeadline) > new Date() ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/company-dashboard/edit-job/${job.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FaEdit className="inline w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(job)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        <FaTrash className="inline w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className={`px-3 py-1 rounded ${
                  pagination.page === 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-700'
                }`}
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className={`px-3 py-1 rounded ${
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

      {/* Add DeleteConfirmationModal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteJob}
        jobTitle={deleteModal.jobTitle}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
};

export default JobsContent;
