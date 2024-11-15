import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import FindInternships from './pages/FindInternships';
import StudentDashboard from './pages/StudentDashboard';
import SavedInternships from './pages/SavedInternships';
import MyApplications from './pages/MyApplications';
import ProfilePage from './pages/ProfilePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InternshipDetails from './pages/InternshipDetails';
import OrganizationDetails from './pages/OrganizationDetails';
import Companies from './pages/Companies';
import Sponsors from './pages/Sponsors';
import CompanySignup from './pages/CompanySignup';
import OrganizationDashboard from './pages/OrganizationDashboard';
import CreateJob from './pages/CreateJob';
import AdminDashboard from './pages/AdminDashboard';
import BecomeSponsor from './pages/BecomeSponsor';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CompanyLogin from './pages/CompanyLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find-internships" element={<FindInternships />} />
          <Route path="/internships/:id" element={<InternshipDetails />} />
          <Route path="/organization/:id" element={<OrganizationDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/company-signup" element={<CompanySignup />} />
          <Route path="/become-sponsor" element={<BecomeSponsor />} />
          <Route path="/company-login" element={<CompanyLogin />} />

          {/* Protected student dashboard routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/saved-internships"
            element={
              <ProtectedRoute>
                <SavedInternships />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/my-applications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* Protected company dashboard routes */}
          <Route path="/company-dashboard" element={<OrganizationDashboard />} />
          <Route path="/company-dashboard/create-job" element={<CreateJob />} />

          {/* Protected admin routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
