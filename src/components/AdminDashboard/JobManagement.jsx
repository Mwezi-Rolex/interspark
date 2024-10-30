import React, { useState } from 'react';
import { FaSearch, FaEye, FaTrash } from 'react-icons/fa';

const JobManagement = () => {
  const [internships, setInternships] = useState([
    { id: 1, title: 'Software Engineer Intern', company: 'Safaricom', location: 'Nairobi', duration: '3 months', stipend: 'KES 20,000/month' },
    { id: 2, title: 'Data Analyst Intern', company: 'Equity Bank', location: 'Mombasa', duration: '6 months', stipend: 'KES 25,000/month' },
    { id: 3, title: 'Marketing Intern', company: 'Nation Media Group', location: 'Kisumu', duration: '4 months', stipend: 'KES 18,000/month' },
    { id: 4, title: 'UX Design Intern', company: 'Ushahidi', location: 'Nairobi', duration: '3 months', stipend: 'KES 22,000/month' },
    { id: 5, title: 'Business Development Intern', company: 'Twiga Foods', location: 'Nakuru', duration: '5 months', stipend: 'KES 23,000/month' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInternship, setSelectedInternship] = useState(null);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (id) => {
    setInternships(internships.filter(internship => internship.id !== id));
  };

  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
  };

  const handleCloseModal = () => {
    setSelectedInternship(null);
  };

  const filteredInternships = internships.filter(internship =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search internships..."
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInternships.map((internship) => (
              <tr key={internship.id}>
                <td className="px-6 py-4 whitespace-nowrap">{internship.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{internship.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">{internship.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{internship.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleViewDetails(internship)} className="text-blue-600 hover:text-blue-900 mr-2">
                    <FaEye />
                  </button>
                  <button onClick={() => handleDelete(internship.id)} className="text-red-600 hover:text-red-900">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInternship && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedInternship.title}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  <strong>Company:</strong> {selectedInternship.company}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Location:</strong> {selectedInternship.location}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Duration:</strong> {selectedInternship.duration}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Stipend:</strong> {selectedInternship.stipend}
                </p>
                {/* Add more details as needed */}
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
