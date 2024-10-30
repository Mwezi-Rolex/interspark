import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaHandHoldingHeart, FaChartLine, FaUsers, FaFileAlt, FaArrowLeft, FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BecomeSponsor = () => {
  const navigate = useNavigate();
  const [sponsorshipType, setSponsorshipType] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mpesa');

  const predefinedAmounts = ['5000', '10000', '25000', '50000'];

  const handleDonationSubmit = (e) => {
    e.preventDefault();
    // Handle one-time donation payment processing
    console.log('Processing donation:', donationAmount || customAmount);
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    // Handle sponsor registration
    console.log('Processing registration:', e.target.elements);
  };

  const handleBackToOptions = () => {
    setSponsorshipType(null);
    setShowRegistrationForm(false);
    setDonationAmount('');
    setCustomAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-200 transition-colors duration-300 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaArrowLeft className="mr-2" />
            <span className="font-medium">Back</span>
          </motion.button>

          {/* Hero Content */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Difference</h1>
            <p className="text-xl">Choose how you want to support aspiring interns</p>
          </div>
        </div>
      </section>

      {/* Sponsorship Options */}
      {!sponsorshipType && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSponsorshipType('one-time')}
                className="bg-white rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <FaHandHoldingHeart className="text-5xl text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold mb-4">One-Time Donation</h2>
                <p className="text-gray-600 mb-4">Make a single contribution to support our internship program</p>
                <ul className="text-gray-600 space-y-2">
                  <li>✓ Quick and easy process</li>
                  <li>✓ Choose your donation amount</li>
                  <li>✓ Immediate impact</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onClick={() => {
                  setSponsorshipType('regular');
                  setShowRegistrationForm(true);
                }}
                className="bg-white rounded-lg shadow-md p-8 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <FaUserPlus className="text-5xl text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Become a Regular Sponsor</h2>
                <p className="text-gray-600 mb-4">Register as a sponsor and support multiple interns</p>
                <ul className="text-gray-600 space-y-2">
                  <li>✓ Track sponsored students' progress</li>
                  <li>✓ Regular updates and reports</li>
                  <li>✓ Direct impact on students' careers</li>
                  <li>✓ Tax benefits and recognition</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* One-Time Donation Form */}
      {sponsorshipType === 'one-time' && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Make a Donation</h2>
                <button
                  onClick={handleBackToOptions}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  <span>Back to Options</span>
                </button>
              </div>
              <form onSubmit={handleDonationSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDonationAmount(amount)}
                      className={`p-4 border rounded-lg text-center ${
                        donationAmount === amount
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      KES {amount}
                    </button>
                  ))}
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Custom Amount (KES)</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setDonationAmount('');
                    }}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('mpesa')}
                      className={`p-4 border rounded-lg flex items-center justify-center space-x-2 ${
                        selectedPaymentMethod === 'mpesa'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      <FaMoneyBillWave className="text-xl" />
                      <span>M-Pesa</span>
                    </button>
                    <button
                      type="button"
                      disabled
                      className="p-4 border rounded-lg flex items-center justify-center space-x-2 bg-gray-100 cursor-not-allowed"
                    >
                      <FaCreditCard className="text-xl" />
                      <span>Card Payment</span>
                      <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">Coming Soon</span>
                    </button>
                  </div>
                </div>

                {selectedPaymentMethod === 'mpesa' && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">M-Pesa Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g., 254712345678"
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                      pattern="^254[0-9]{9}$"
                      title="Please enter a valid Kenyan phone number starting with 254"
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter phone number in format: 254XXXXXXXXX</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedPaymentMethod === 'mpesa' ? 'Pay with M-Pesa' : 'Proceed to Payment'}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* Regular Sponsor Registration Form */}
      {showRegistrationForm && (
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Sponsor Registration</h2>
                <button
                  onClick={handleBackToOptions}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FaArrowLeft className="mr-2" />
                  <span>Back to Options</span>
                </button>
              </div>
              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Organization Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Contact Person</label>
                    <input
                      type="text"
                      required
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Organization Description</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Preferred Sponsorship Areas</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['Technology', 'Business', 'Engineering', 'Healthcare', 'Education', 'Other'].map((area) => (
                      <label key={area} className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox" />
                        <span>{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Registration
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Sponsorship</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <FaChartLine className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor the development and success of sponsored interns</p>
            </div>
            <div className="text-center">
              <FaUsers className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Impact</h3>
              <p className="text-gray-600">Make a real difference in students' lives and careers</p>
            </div>
            <div className="text-center">
              <FaFileAlt className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Regular Updates</h3>
              <p className="text-gray-600">Receive detailed reports on your sponsorship impact</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeSponsor;
