import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

const SponsorshipApplication = ({ onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    reason: '',
    financialNeed: '',
    academicPerformance: '',
    careerGoals: '',
    attachments: null
  });

  const sponsorshipPackages = [
    {
      id: 1,
      name: 'Basic Package',
      amount: 'KES 50,000',
      duration: '3 months',
      benefits: [
        'Monthly stipend of KES 15,000',
        'Transport allowance',
        'Basic insurance coverage'
      ]
    },
    {
      id: 2,
      name: 'Standard Package',
      amount: 'KES 100,000',
      duration: '6 months',
      benefits: [
        'Monthly stipend of KES 20,000',
        'Transport allowance',
        'Comprehensive insurance coverage',
        'Laptop allowance'
      ]
    },
    {
      id: 3,
      name: 'Premium Package',
      amount: 'KES 200,000',
      duration: '12 months',
      benefits: [
        'Monthly stipend of KES 25,000',
        'Transport allowance',
        'Comprehensive insurance coverage',
        'Laptop allowance',
        'Professional development courses',
        'Mentorship program'
      ]
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({ selectedPackage, formData });
    // Close the modal after submission
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sponsorship Application</h2>

        {step === 1 ? (
          <div>
            <p className="text-gray-600 mb-6">
              Select a sponsorship package that best suits your needs. Each package offers different benefits and support levels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {sponsorshipPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-300 ${
                    selectedPackage?.id === pkg.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:border-gray-400'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{pkg.name}</h3>
                  <p className="text-xl font-bold text-blue-600 mb-2">{pkg.amount}</p>
                  <p className="text-gray-600 mb-3">Duration: {pkg.duration}</p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {pkg.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {selectedPackage && (
              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue with {selectedPackage.name}
              </button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you applying for this sponsorship?
              </label>
              <textarea
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your financial need
              </label>
              <textarea
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={formData.financialNeed}
                onChange={(e) => setFormData({ ...formData, financialNeed: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Performance (Current GPA and achievements)
              </label>
              <textarea
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={formData.academicPerformance}
                onChange={(e) => setFormData({ ...formData, academicPerformance: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Career Goals and Aspirations
              </label>
              <textarea
                required
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={formData.careerGoals}
                onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents (Transcripts, recommendation letters, etc.)
              </label>
              <input
                type="file"
                multiple
                className="w-full border rounded-lg p-3"
                onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Packages
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default SponsorshipApplication;
