import React, { useState } from 'react';
import { FaTachometerAlt, FaUsers, FaBriefcase, FaChartBar, FaCog, FaSignOutAlt, FaHandHoldingUsd } from 'react-icons/fa';
import AdminOverview from '../components/AdminDashboard/AdminOverview';
import UserManagement from '../components/AdminDashboard/UserManagement';
import JobManagement from '../components/AdminDashboard/JobManagement';
// import Analytics from '../components/AdminDashboard/Analytics';
// import Settings from '../components/AdminDashboard/Settings';
import SponsorshipManagement from '../components/AdminDashboard/SponsorshipManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <UserManagement />;
      case 'jobs':
        return <JobManagement />;
    //   case 'analytics':
    //     return <Analytics />;
    //   case 'settings':
    //     return <Settings />;
      case 'sponsorships':
        return <SponsorshipManagement />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white">
        <div className="p-6">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          {[
            { name: 'Overview', icon: FaTachometerAlt, tab: 'overview' },
            { name: 'Users', icon: FaUsers, tab: 'users' },
            { name: 'Jobs', icon: FaBriefcase, tab: 'jobs' },
            { name: 'Sponsorships', icon: FaHandHoldingUsd, tab: 'sponsorships' },
            { name: 'Analytics', icon: FaChartBar, tab: 'analytics' },
            { name: 'Settings', icon: FaCog, tab: 'settings' },
          ].map((item) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center px-6 py-3 text-gray-100 hover:bg-indigo-700 transition-colors duration-200 ${
                activeTab === item.tab ? 'bg-indigo-700' : ''
              }`}
              onClick={() => setActiveTab(item.tab)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </a>
          ))}
        </nav>
        <div className="absolute bottom-0 w-64 p-6">
          <a
            href="#"
            className="flex items-center text-gray-100 hover:text-gray-300 transition-colors duration-200"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
