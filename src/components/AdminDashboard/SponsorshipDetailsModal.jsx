import React, { useState } from 'react';
import { FaTimes, FaDownload, FaCheck, FaBan, FaExclamationTriangle } from 'react-icons/fa';
import { format } from 'date-fns';

const SponsorshipDetailsModal = ({ sponsorship, onClose, onUpdateStatus }) => {
  const [reviewNotes, setReviewNotes] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'transcript': return 'Academic Transcript';
      case 'recommendation': return 'Recommendation Letter';
      case 'other': return 'Other Supporting Document';
      default: return type;
    }
  };

  const handleDownload = (url, filename) => {
    const fullUrl = `${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}/${url}`;

    const link = document.createElement('a');
    link.href = fullUrl;
    link.target = '_blank';
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add confirmation dialog component
  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <FaExclamationTriangle className="text-yellow-500 text-2xl mr-3" />
          <h3 className="text-lg font-semibold">
            Confirm {pendingAction === 'approved' ? 'Approval' : 'Rejection'}
          </h3>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to {pendingAction === 'approved' ? 'approve' : 'reject'} this sponsorship application?
          This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowConfirmation(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              setIsSubmitting(true);
              await onUpdateStatus(sponsorship._id, pendingAction, reviewNotes);
              setIsSubmitting(false);
              setShowConfirmation(false);
            }}
            className={`px-4 py-2 rounded-md flex items-center ${
              pendingAction === 'approved'
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                {pendingAction === 'approved' ? <FaCheck className="mr-2" /> : <FaBan className="mr-2" />}
                Confirm {pendingAction === 'approved' ? 'Approval' : 'Rejection'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Sponsorship Application Details
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Student Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{`${sponsorship.student.firstName} ${sponsorship.student.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{sponsorship.student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">University</p>
                <p className="font-medium">{sponsorship.student.university}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-medium">{sponsorship.student.course}</p>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Package Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Package Name</p>
                <p className="font-medium">{sponsorship.sponsorshipPackage.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">{sponsorship.sponsorshipPackage.amount.toLocaleString()} KES</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{sponsorship.sponsorshipPackage.duration} months</p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Application Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Reason for Applying</p>
                <p className="mt-1">{sponsorship.reasonForApplying}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Financial Need</p>
                <p className="mt-1">{sponsorship.financialNeed}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Career Goals</p>
                <p className="mt-1">{sponsorship.careerGoals}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">GPA</p>
                <p className="mt-1">{sponsorship.academicPerformance.gpa}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <ul className="list-disc pl-5 mt-1">
                  {sponsorship.academicPerformance.achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Supporting Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Supporting Documents</h3>
            <div className="space-y-3">
              {sponsorship.supportingDocuments.map((doc) => (
                <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{getDocumentTypeLabel(doc.type)}</p>
                    <p className="text-sm text-gray-600">{doc.originalFilename}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded on: {format(new Date(doc.uploadDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={`${process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000'}/${doc.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 px-3 py-1"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDownload(doc.url, doc.originalFilename)}
                      className="text-green-600 hover:text-green-800 px-3 py-1"
                    >
                      <FaDownload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {sponsorship.status === 'pending' && (
            <>
              {/* Review Notes Input */}
              <div>
                <label htmlFor="reviewNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Review Notes
                </label>
                <textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Add your review notes here..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setPendingAction('rejected');
                    setShowConfirmation(true);
                  }}
                  className="px-4 py-2 text-red-600 hover:text-red-700 flex items-center"
                >
                  <FaBan className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    setPendingAction('approved');
                    setShowConfirmation(true);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                >
                  <FaCheck className="mr-2" />
                  Approve
                </button>
              </div>
            </>
          )}

          {/* Show confirmation dialog when needed */}
          {showConfirmation && <ConfirmationDialog />}

          {/* Display Review Notes if application is not pending */}
          {sponsorship.status !== 'pending' && sponsorship.reviewNotes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Review Notes</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-700">{sponsorship.reviewNotes}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Reviewed on: {format(new Date(sponsorship.reviewedAt), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipDetailsModal;
