import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMoneyBill } from 'react-icons/fa';
import axios from '../config/axios';
import { toast } from 'react-toastify';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    duration: '',
    location: '',
    isRemote: false,
    positions: 1,
    startDate: '',
    applicationDeadline: '',
    category: '',
    stipend: {
      amount: 20000,
      currency: 'KES',
      period: 'monthly'
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleStipendChange = (e) => {
    const { name, value } = e.target;
    setJobData(prev => ({
      ...prev,
      stipend: {
        ...prev.stipend,
        [name]: value
      }
    }));
  };

  const handleArrayChange = (index, field, value) => {
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setJobData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    if (jobData[field].length === 1) {
      toast.warning(`At least one ${field.slice(0, -1)} is required`);
      return;
    }
    setJobData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'duration', 'location', 'startDate', 'applicationDeadline', 'category'];
    const emptyFields = requiredFields.filter(field => !jobData[field]);

    if (emptyFields.length > 0) {
      toast.error(`Please fill in: ${emptyFields.join(', ')}`);
      return false;
    }

    if (jobData.requirements.some(req => !req.trim())) {
      toast.error('Please fill in all requirements or remove empty ones');
      return false;
    }

    if (jobData.responsibilities.some(resp => !resp.trim())) {
      toast.error('Please fill in all responsibilities or remove empty ones');
      return false;
    }

    const start = new Date(jobData.startDate);
    const deadline = new Date(jobData.applicationDeadline);
    const today = new Date();

    if (deadline < today) {
      toast.error('Application deadline cannot be in the past');
      return false;
    }

    if (start < deadline) {
      toast.error('Start date must be after application deadline');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formattedData = {
      ...jobData,
      positions: Number(jobData.positions),
      stipend: {
        ...jobData.stipend,
        amount: Number(jobData.stipend.amount)
      }
    };

    setLoading(true);
    try {
      const response = await axios.post('/companies/internships', formattedData);
      if (response.data.success) {
        toast.success('Internship created successfully!');
        navigate('/company-dashboard');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error creating internship';
      toast.error(errorMessage);
      console.error('API Error Response:', error.response?.data);
      console.error('Error creating internship:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Create New Internship</h1>
          <button
            onClick={() => navigate('/company-dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                name="category"
                value={jobData.category}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Application Deadline<span className="text-red-500 ml-1">*</span></label>
              <input
                type="date"
                name="applicationDeadline"
                value={jobData.applicationDeadline}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date<span className="text-red-500 ml-1">*</span></label>
              <input
                type="date"
                name="startDate"
                value={jobData.startDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Duration and Location */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                name="duration"
                value={jobData.duration}
                onChange={handleChange}
                placeholder="e.g., 3 months"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location<span className="text-red-500 ml-1">*</span></label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Remote Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isRemote"
              checked={jobData.isRemote}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Remote Work Available</label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description<span className="text-red-500 ml-1">*</span></label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {/* Requirements and Responsibilities */}
          {['requirements', 'responsibilities'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
              {jobData[field].map((item, index) => (
                <div key={index} className="flex mt-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleArrayChange(index, field, e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField(field, index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField(field)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                Add {field.slice(0, -1)}
              </button>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {loading ? 'Creating...' : 'Create Internship'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateJob;
