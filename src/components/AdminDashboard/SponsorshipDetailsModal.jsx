import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const SponsorshipDetailsModal = ({ sponsorship, package: sponsorshipPackage, onClose, onUpdateStatus }) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [newStatus, setNewStatus] = useState(sponsorship.status);

  const handleSubmitReview = () => {
    onUpdateStatus(sponsorship.id, newStatus, reviewNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Sponsorship Application Details</h3>
          <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4">
            <FaTimes className="text-gray-500 hover:text-gray-700" />
          </button>
          <div className="mt-2 px-7 py-3">
            <div className="grid grid-cols-2 gap-4">
              <p className="text-sm text-gray-500"><strong>Student:</strong> {sponsorship.student}</p>
              <p className="text-sm text-gray-500"><strong>Company:</strong> {sponsorship.company}</p>
              <p className="text-sm text-gray-500"><strong>Position:</strong> {sponsorship.position}</p>
              <p className="text-sm text-gray-500"><strong>Package:</strong> {sponsorshipPackage.name}</p>
              <p className="text-sm text-gray-500"><strong>Amount:</strong> KES {sponsorshipPackage.amount}</p>
              <p className="text-sm text-gray-500"><strong>Duration:</strong> {sponsorshipPackage.duration}</p>
              <p className="text-sm text-gray-500"><strong>Status:</strong> {sponsorship.status}</p>
              <p className="text-sm text-gray-500"><strong>Application Date:</strong> {sponsorship.applicationDate}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-900">Student Statement</h4>
              <p className="text-sm text-gray-500 mt-1">{sponsorship.studentStatement}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-900">Company Recommendation</h4>
              <p className="text-sm text-gray-500 mt-1">{sponsorship.companyRecommendation}</p>
            </div>
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-900">Review Application</h4>
              <textarea
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                rows="3"
                placeholder="Enter review notes..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
              ></textarea>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">Update Status</label>
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="More Information Needed">More Information Needed</option>
                </select>
              </div>
              <button
                onClick={handleSubmitReview}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipDetailsModal;
