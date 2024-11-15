import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import SponsorshipDetailsModal from './SponsorshipDetailsModal';
import axios from '../../config/axios';
import { toast } from 'react-toastify';

const SponsorshipManagement = () => {
  const [sponsorshipPackages, setSponsorshipPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [sponsorships, setSponsorships] = useState([
    {
      id: 1,
      student: 'John Muthomi',
      company: 'Safaricom',
      position: 'Software Engineer Intern',
      packageId: 1,
      status: 'Pending',
      applicationDate: '2023-05-15',
      studentStatement: 'I am passionate about technology and eager to learn...',
      companyRecommendation: 'John has shown great potential during the interview process...'
    },
    // ... add more sponsorship applications with similar details
  ]);

  const [newPackage, setNewPackage] = useState({
    name: '',
    amount: '',
    duration: '',
    benefits: ['Monthly transport allowance', 'Lunch allowance', 'Internet stipend']
  });

  const [selectedSponsorship, setSelectedSponsorship] = useState(null);

  const [sponsorshipApplications, setSponsorshipApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const response = await axios.get('/admin/sponsorship-packages');
        if (response.data.success) {
          setSponsorshipPackages(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch sponsorship packages');
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  const handleAddPackage = async () => {
    try {
      if (!newPackage.name || !newPackage.amount || !newPackage.duration) {
        toast.error('Please fill in all required fields');
        return;
      }

      const packageData = {
        ...newPackage,
        amount: Number(newPackage.amount)
      };

      const response = await axios.post('/admin/sponsorship-packages', packageData);

      if (response.data.success) {
        toast.success(response.data.message);
        setSponsorshipPackages([...sponsorshipPackages, response.data.sponsorshipPackage]);
        setNewPackage({
          name: '',
          amount: '',
          duration: '',
          benefits: ['Monthly transport allowance', 'Lunch allowance', 'Internet stipend']
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create package');
    }
  };

  const handleDeletePackage = (id) => {
    setSponsorshipPackages(sponsorshipPackages.filter(p => p._id !== id));
  };

  const handleViewDetails = (sponsorship) => {
    setSelectedSponsorship(sponsorship);
  };

  const handleCloseModal = () => {
    setSelectedSponsorship(null);
  };

  const handleUpdateStatus = async (applicationId, newStatus, reviewNotes = '') => {
    try {
      const response = await axios.patch(
        `/admin/sponsorship-applications/${applicationId}/status`,
        {
          status: newStatus,
          reviewNotes: reviewNotes
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setSponsorshipApplications(prev =>
          prev.map(app =>
            app._id === applicationId
              ? {
                  ...app,
                  status: response.data.application.status,
                  reviewNotes: response.data.application.reviewNotes,
                  reviewedAt: response.data.application.reviewedAt
                }
              : app
          )
        );
        setSelectedSponsorship(null);
        fetchApplications(currentPage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${newStatus} application`);
    }
  };

  const handleBenefitChange = (index, value) => {
    const updatedBenefits = [...newPackage.benefits];
    updatedBenefits[index] = value;
    setNewPackage({ ...newPackage, benefits: updatedBenefits });
  };

  const addBenefit = () => {
    setNewPackage({
      ...newPackage,
      benefits: [...newPackage.benefits, '']
    });
  };

  const removeBenefit = (index) => {
    const updatedBenefits = newPackage.benefits.filter((_, i) => i !== index);
    setNewPackage({ ...newPackage, benefits: updatedBenefits });
  };

  const fetchApplications = async (page = 1) => {
    try {
      setLoadingApplications(true);
      const response = await axios.get(`/admin/sponsorship-applications?page=${page}&limit=10`);
      if (response.data.success) {
        setSponsorshipApplications(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setCurrentPage(response.data.pagination.page);
      }
    } catch (error) {
      toast.error('Failed to fetch sponsorship applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sponsorship Packages</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loadingPackages ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (KES)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sponsorshipPackages.map((pkg) => (
                  <tr key={pkg._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.amount.toLocaleString()} {pkg.currency}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{pkg.currentStudents}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-2">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeletePackage(pkg._id)} className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4 space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Package Name"
              value={newPackage.name}
              onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
              className="flex-1 border rounded px-2 py-1"
            />
            <input
              type="number"
              placeholder="Amount (KES)"
              value={newPackage.amount}
              onChange={(e) => setNewPackage({...newPackage, amount: e.target.value})}
              className="flex-1 border rounded px-2 py-1"
            />
            <input
              type="text"
              placeholder="Duration"
              value={newPackage.duration}
              onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
              className="flex-1 border rounded px-2 py-1"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Benefits</label>
              <button
                type="button"
                onClick={addBenefit}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Benefit
              </button>
            </div>
            {newPackage.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleBenefitChange(index, e.target.value)}
                  placeholder="Enter benefit"
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleAddPackage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Package
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sponsorship Applications</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loadingApplications ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sponsorshipApplications.map((application) => (
                    <tr key={application._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {`${application.student.firstName} ${application.student.lastName}`}
                        </div>
                        <div className="text-sm text-gray-500">{application.student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.student.university}</div>
                        <div className="text-sm text-gray-500">{application.student.course}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.sponsorshipPackage.name}</div>
                        <div className="text-sm text-gray-500">
                          {application.sponsorshipPackage.amount.toLocaleString()} KES
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {application.academicPerformance.gpa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleViewDetails(application)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-6 py-3 flex justify-between items-center border-t border-gray-200">
                <button
                  onClick={() => fetchApplications(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => fetchApplications(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedSponsorship && (
        <SponsorshipDetailsModal
          sponsorship={selectedSponsorship}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default SponsorshipManagement;
