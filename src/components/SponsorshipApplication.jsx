import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import axios from '../config/axios';
import { toast } from 'react-toastify';

const PackageSelectionUI = ({ onPackageSelected, packages, loadingPackages, selectedPackage, setSelectedPackage }) => {
  if (loadingPackages) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {packages.map((pkg) => (
        <div
          key={pkg._id}
          onClick={() => setSelectedPackage(pkg)}
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
            selectedPackage?._id === pkg._id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{pkg.name}</h3>
            <span className="text-lg font-medium text-blue-600">
              {pkg.amount.toLocaleString()} {pkg.currency}
            </span>
          </div>

          <p className="text-gray-600 mb-4">Duration: {pkg.duration}</p>

          <div className="space-y-2">
            {pkg.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-2 text-gray-700">
                <span className="text-green-500 mt-1">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (selectedPackage?._id === pkg._id) {
                onPackageSelected();
              } else {
                setSelectedPackage(pkg);
              }
            }}
            className={`w-full mt-6 px-4 py-2 rounded-full flex items-center justify-center transition duration-300 ${
              selectedPackage?._id === pkg._id
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {selectedPackage?._id === pkg._id ? (
              <>
                <FaMoneyBillWave className="mr-2" />
                Apply for Package
              </>
            ) : (
              'Select Package'
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

const SponsorshipApplication = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: Package Selection, 2: Application Form
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    reasonForApplying: '',
    financialNeed: '',
    academicPerformance: {
      gpa: '',
      achievements: ['']
    },
    careerGoals: '',
    transcript: null,
    recommendation: [],
    other: []
  });

  // Add achievement field
  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      academicPerformance: {
        ...prev.academicPerformance,
        achievements: [...prev.academicPerformance.achievements, '']
      }
    }));
  };

  // Handle achievement change
  const handleAchievementChange = (index, value) => {
    const newAchievements = [...formData.academicPerformance.achievements];
    newAchievements[index] = value;
    setFormData(prev => ({
      ...prev,
      academicPerformance: {
        ...prev.academicPerformance,
        achievements: newAchievements
      }
    }));
  };

  // Handle file uploads
  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      [field]: field === 'transcript' ? files[0] : files
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPackage) return;

    try {
      setSubmitting(true);
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append('reasonForApplying', formData.reasonForApplying);
      formDataToSend.append('financialNeed', formData.financialNeed);
      formDataToSend.append('gpa', formData.academicPerformance.gpa);
      formDataToSend.append('achievements', formData.academicPerformance.achievements.filter(a => a.trim()).join(', '));
      formDataToSend.append('careerGoals', formData.careerGoals);

      // Append files
      if (formData.transcript) {
        formDataToSend.append('transcript', formData.transcript);
      }

      // Append multiple recommendation files
      formData.recommendation.forEach(file => {
        formDataToSend.append('recommendation', file);
      });

      // Append other files
      formData.other.forEach(file => {
        formDataToSend.append('other', file);
      });

      const response = await axios.post(
        `/students/sponsorship-packages/${selectedPackage._id}/apply`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Application submitted successfully!');
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  // Render application form
  const renderApplicationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason for Applying
        </label>
        <textarea
          required
          value={formData.reasonForApplying}
          onChange={(e) => setFormData(prev => ({ ...prev, reasonForApplying: e.target.value }))}
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Financial Need
        </label>
        <textarea
          required
          value={formData.financialNeed}
          onChange={(e) => setFormData(prev => ({ ...prev, financialNeed: e.target.value }))}
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GPA
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="4.0"
          required
          value={formData.academicPerformance.gpa}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            academicPerformance: { ...prev.academicPerformance, gpa: e.target.value }
          }))}
          className="w-full p-2 border rounded-md"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Academic Achievements
          </label>
          <button
            type="button"
            onClick={addAchievement}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Achievement
          </button>
        </div>
        {formData.academicPerformance.achievements.map((achievement, index) => (
          <input
            key={index}
            type="text"
            value={achievement}
            onChange={(e) => handleAchievementChange(index, e.target.value)}
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Enter achievement"
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Career Goals
        </label>
        <textarea
          required
          value={formData.careerGoals}
          onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
          className="w-full p-2 border rounded-md"
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Transcript
          </label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'transcript')}
            className="w-full"
            accept=".pdf,.doc,.docx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendation Letters
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, 'recommendation')}
            className="w-full"
            accept=".pdf,.doc,.docx"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Other Supporting Documents
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => handleFileChange(e, 'other')}
            className="w-full"
            accept=".pdf,.doc,.docx"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </form>
  );

  // Add useEffect to fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoadingPackages(true);
        const response = await axios.get('/admin/sponsorship-packages');
        if (response.data.success) {
          setPackages(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch sponsorship packages');
      } finally {
        setLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []); // Empty dependency array means this runs once when component mounts

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              {step === 1 ? 'Choose Sponsorship Package' : 'Complete Application'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <PackageSelectionUI
              packages={packages}
              loadingPackages={loadingPackages}
              selectedPackage={selectedPackage}
              setSelectedPackage={setSelectedPackage}
              onPackageSelected={() => setStep(2)}
            />
          ) : (
            renderApplicationForm()
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorshipApplication;
