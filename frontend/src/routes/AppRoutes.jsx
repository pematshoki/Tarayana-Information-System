import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { 
  FieldOfficerLayout, 
  Dashboard, 
  Projects, 
  Beneficiaries, 
  RegisterBeneficiary, 
  Reports, 
  GenerateReport, 
  Events,
  ProjectDetail,
  SpecificProjectDetail
} from '../pages/fieldOfficer';

import {
  ProgrammeOfficerLayout,
  Dashboard as PODashboard,
  Programmes as POProgrammes,
  Beneficiaries as POBeneficiaries,
  Reports as POReports,
  AddNewProject as POAddNewProject,
  RegisterBeneficiary as PORegisterBeneficiary,
} from '../pages/programmeOfficer';
import POSpecificProjectDetail from '../pages/programmeOfficer/SpecificProjectDetail';

// Layouts (Moved to src/layouts)
import FieldOfficerLayoutNew from '../layouts/FieldOfficerLayout';
import ProgrammeOfficerLayoutNew from '../layouts/ProgrammeOfficerLayout';

import AdminLayout from '../layouts/AdminLayout';
import ManagementLayout from '../layouts/ManagementLayout';

// New Pages
import AdminDashboard from '../pages/admin/Dashboard';


import ManagementDashboard from '../pages/management/Dashboard';


import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/roles';
import { useAuth } from '../context/AuthContext';

const RootRedirect = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/auth/login" replace />;
  
  switch (user.role) {
    case ROLES.ADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    case ROLES.PROGRAMME_OFFICER:
      return <Navigate to="/po/dashboard" replace />;
    case ROLES.MANAGEMENT:
      return <Navigate to="/mgmt/dashboard" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Field Officer Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={[ROLES.FIELD_OFFICER]}>
          <FieldOfficerLayoutNew />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:type/:id" element={<ProjectDetail />} />
        <Route path="projects/detail/:id" element={<SpecificProjectDetail />} />
        <Route path="beneficiaries" element={<Beneficiaries />} />
        <Route path="beneficiaries/register" element={<RegisterBeneficiary />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/generate" element={<GenerateReport />} />
        <Route path="events" element={<Events />} />
      </Route>

      {/* Programme Officer Routes */}
      <Route path="/po" element={
        <ProtectedRoute allowedRoles={[ROLES.PROGRAMME_OFFICER]}>
          <ProgrammeOfficerLayoutNew />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/po/dashboard" replace />} />
        <Route path="dashboard" element={<PODashboard />} />
        <Route path="programmes" element={<POProgrammes />} />
        <Route path="beneficiaries" element={<POBeneficiaries />} />
        <Route path="beneficiaries/register" element={<PORegisterBeneficiary />} />
        <Route path="reports" element={<POReports />} />
        <Route path="reports/generate" element={<GenerateReport />} />
        <Route path="programmes/add" element={<POAddNewProject />} />
        <Route path="programmes/:type/:id" element={<ProjectDetail />} />
        <Route path="programmes/detail/:id" element={<POSpecificProjectDetail />} />
        
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      Management Routes
      <Route path="/mgmt" element={
        <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
          <ManagementLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/mgmt/dashboard" replace />} />
        <Route path="dashboard" element={<ManagementDashboard />} />

      </Route>

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">403 - Unauthorized</h1>
            <p className="text-gray-600 mb-8">You do not have permission to access this page.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      } />

      {/* Fallback for unhandled routes */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
