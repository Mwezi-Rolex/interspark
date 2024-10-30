import React from 'react';
import { FaUsers, FaBriefcase, FaUserGraduate, FaBuilding, FaHandHoldingUsd, FaFileAlt, FaHandshake } from 'react-icons/fa';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
    <div className={`rounded-full p-2 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="ml-3 overflow-hidden">
      <h3 className="text-sm font-semibold text-gray-700 truncate">{title}</h3>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Users" value="5,678" icon={FaUsers} color="bg-blue-500" />
        <StatCard title="Active Jobs" value="1,234" icon={FaBriefcase} color="bg-green-500" />
        <StatCard title="Students" value="4,321" icon={FaUserGraduate} color="bg-yellow-500" />
        <StatCard title="Companies" value="987" icon={FaBuilding} color="bg-purple-500" />
        <StatCard title="Sponsors" value="52" icon={FaHandshake} color="bg-indigo-500" />
        <StatCard title="Pending Sponsorships" value="42" icon={FaHandHoldingUsd} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <ul className="space-y-4">
            {[
              { icon: FaBriefcase, color: 'text-green-500', user: 'Safaricom', action: 'posted a new job:', job: 'Software Engineer Intern' },
              { icon: FaBuilding, color: 'text-purple-500', user: 'Twiga Foods', action: 'signed up as a new company' },
              { icon: FaHandHoldingUsd, color: 'text-red-500', user: 'John Muthomi', action: 'applied for sponsorship:', job: 'Data Analyst Intern at Equity Bank' },
              { icon: FaHandshake, color: 'text-indigo-500', user: 'Kenya Commercial Bank', action: 'registered as a new sponsor' },
              { icon: FaBriefcase, color: 'text-green-500', user: 'Nation Media Group', action: 'posted a new job:', job: 'Marketing Assistant' },
              { icon: FaHandHoldingUsd, color: 'text-red-500', user: 'Jane Wanjiru', action: 'applied for sponsorship:', job: 'UX Designer Intern at Ushahidi' },
              { icon: FaHandshake, color: 'text-indigo-500', user: 'M-PESA Foundation', action: 'approved sponsorship for', job: '5 interns' },
              { icon: FaFileAlt, color: 'text-blue-500', user: 'Bob Ochieng', action: 'submitted an application for', job: 'Software Developer at Andela Kenya' },
            ].map((activity, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <activity.icon className={`w-5 h-5 mr-3 ${activity.color}`} />
                <span className="font-semibold">{activity.user}</span>
                <span className="mx-1">{activity.action}</span>
                {activity.job && <span className="font-semibold">{activity.job}</span>}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-rows-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sponsorship Summary</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Total Applications</span>
                <span className="font-semibold">156</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Approved</span>
                <span className="font-semibold text-green-600">98</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">42</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">16</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sponsor Overview</h3>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Total Sponsors</span>
                <span className="font-semibold">52</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Active Sponsors</span>
                <span className="font-semibold text-green-600">38</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Total Sponsored Interns</span>
                <span className="font-semibold text-blue-600">245</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-600">Sponsorship Funds</span>
                <span className="font-semibold text-indigo-600">KES 98,000,000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
