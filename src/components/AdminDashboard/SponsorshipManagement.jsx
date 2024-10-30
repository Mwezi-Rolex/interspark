import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEye, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import SponsorshipDetailsModal from './SponsorshipDetailsModal';

const SponsorshipManagement = () => {
  const [sponsorshipPackages, setSponsorshipPackages] = useState([
    { id: 1, name: 'Basic Package', amount: 50000, duration: '3 months' },
    { id: 2, name: 'Standard Package', amount: 100000, duration: '6 months' },
    { id: 3, name: 'Premium Package', amount: 200000, duration: '12 months' },
  ]);

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

  const [newPackage, setNewPackage] = useState({ name: '', amount: '', duration: '' });

  const [selectedSponsorship, setSelectedSponsorship] = useState(null);

  const handleApprove = (id) => {
    setSponsorships(sponsorships.map(s => s.id === id ? {...s, status: 'Approved'} : s));
  };

  const handleReject = (id) => {
    setSponsorships(sponsorships.map(s => s.id === id ? {...s, status: 'Rejected'} : s));
  };

  const handleAddPackage = () => {
    if (newPackage.name && newPackage.amount && newPackage.duration) {
      setSponsorshipPackages([...sponsorshipPackages, { ...newPackage, id: Date.now() }]);
      setNewPackage({ name: '', amount: '', duration: '' });
    }
  };

  const handleDeletePackage = (id) => {
    setSponsorshipPackages(sponsorshipPackages.filter(p => p.id !== id));
  };

  const handleViewDetails = (sponsorship) => {
    setSelectedSponsorship(sponsorship);
  };

  const handleCloseModal = () => {
    setSelectedSponsorship(null);
  };

  const handleUpdateStatus = (id, newStatus, reviewNotes) => {
    setSponsorships(sponsorships.map(s =>
      s.id === id ? {...s, status: newStatus, reviewNotes: reviewNotes} : s
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sponsorship Packages</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (KES)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sponsorshipPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{pkg.duration}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeletePackage(pkg.id)} className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex space-x-4">
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
          <button onClick={handleAddPackage} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            <FaPlus className="inline mr-2" /> Add Package
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sponsorship Applications</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sponsorships.map((sponsorship) => (
                <tr key={sponsorship.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{sponsorship.student}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sponsorship.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sponsorship.position}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sponsorshipPackages.find(p => p.id === sponsorship.packageId)?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sponsorship.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      sponsorship.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      sponsorship.status === 'More Information Needed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sponsorship.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleApprove(sponsorship.id)} className="text-green-600 hover:text-green-900 mr-2">
                      <FaCheck />
                    </button>
                    <button onClick={() => handleReject(sponsorship.id)} className="text-red-600 hover:text-red-900 mr-2">
                      <FaTimes />
                    </button>
                    <button onClick={() => handleViewDetails(sponsorship)} className="text-blue-600 hover:text-blue-900">
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSponsorship && (
        <SponsorshipDetailsModal
          sponsorship={selectedSponsorship}
          package={sponsorshipPackages.find(p => p.id === selectedSponsorship.packageId)}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default SponsorshipManagement;
