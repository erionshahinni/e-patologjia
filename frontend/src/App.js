// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Landing Page & Home Redirect
import LandingPage from './components/LandingPage';
import HomeRedirect from './components/HomeRedirect';

// Auth Components
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import NoAccess from './components/NoAccess';
import ResetPassword from './components/ResetPassword';
import VerifyEmail from './components/VerifyEmail';
import PinResetForm from './components/admin/PinResetForm';


// Main Components
import Dashboard from './components/Dashboard/index';
import PatientForm from './components/PatientForm/index';
import EditPatient from './components/EditPatient/index'; // Updated import path
import ViewPatient from './components/ViewPatient/index';
import StatisticsDashboard from './components/Statistics/index';
// Report Related Components

import ReportForm from './components/ReportForm/index';
import ViewReport from './components/ViewReport/index';
import EditReport from './components/EditReport/index';

// Template Related Components
import TemplateForm from './components/TemplateForm/index';
import ViewTemplates from './components/ViewTemplates/index';
import EditTemplate from './components/EditTemplate/index';

// Admin Components
import AdminPanel from './components/admin/AdminPanel';
import EditUserForm from './components/admin/EditUserForm';
import Profile from './components/Profile';


// Healthcare Related Components
import HealthcareInstitutions from './components/HealthcareInstitutions/index';
import ReferringDoctors from './components/ReferringDoctors/index';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing Page - Public */}
          <Route path="/home" element={<LandingPage />} />
          
          {/* Public Routes - Outside Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<NoAccess />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-pin" element={<PinResetForm />} />

          {/* Root route - Shows landing page or redirects to dashboard */}
          <Route path="/" element={<HomeRedirect />} />
          
          {/* Protected Routes - Inside Layout */}
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute roles={["admin", "doctor"]}>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <AdminPanel />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/admin/users/:id/edit" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <EditUserForm />
                </PrivateRoute>
              } 
            />

            {/* Patient Routes */}
            <Route 
              path="/add-patient" 
              element={
                <PrivateRoute roles={["admin", "doctor"]}>
                  <PatientForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/edit-patient/:id" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <EditPatient />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/view-patient/:id" 
              element={
                <PrivateRoute roles={["admin", "doctor"]}>
                  <ViewPatient />
                </PrivateRoute>
              } 
            />

            {/* Report Routes */}
            <Route 
              path="/add-report/:id" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <ReportForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/view-report/:id" 
              element={
                <PrivateRoute roles={["admin", "doctor"]}>
                  <ViewReport />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/edit-report/:id" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <EditReport />
                </PrivateRoute>
              } 
            />

            {/* Template Routes */}
            <Route 
              path="/add-template" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <TemplateForm />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/templates" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <ViewTemplates />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/edit-template/:id" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <EditTemplate />
                </PrivateRoute>
              } 
            />

            {/* Healthcare Institution Routes */}
            <Route 
              path="/healthcare-institutions" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <HealthcareInstitutions />
                </PrivateRoute>
              } 
            />

            {/* Referring Doctors Routes */}
            <Route 
              path="/referring-doctors" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <ReferringDoctors />
                </PrivateRoute>
              } 
            />
            
            {/* Statistics Route - Now properly inside Layout */}
            <Route 
              path="/statistics" 
              element={
                <PrivateRoute roles={["admin"]}>
                  <StatisticsDashboard />
                </PrivateRoute>
              } 
            />
          </Route>

          {/* Catch all route - Redirect to landing page for unauthenticated users */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;