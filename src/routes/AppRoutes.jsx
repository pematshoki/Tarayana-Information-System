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
  AddNewProject as POAddNewProject
} from '../pages/programmeOfficer';

// Layouts (Moved to src/layouts)
import FieldOfficerLayoutNew from '../layouts/FieldOfficerLayout';
import ProgrammeOfficerLayoutNew from '../layouts/ProgrammeOfficerLayout';

import AdminLayout from '../layouts/AdminLayout';
import ManagementLayout from '../layouts/ManagementLayout';
import MrCdLayout from '../layouts/MrCdLayout';

// New Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUserManagement from '../pages/admin/UserManagement';
import AdminSettings from '../pages/admin/Settings';
import AdminAddUser from '../pages/admin/AddUser';
import AdminAnnualEvents from '../pages/admin/AnnualEvents';
import AdminDetailEvent from '../pages/admin/DetailEvent';
import AdminEvent from '../pages/admin/Event';
import AdminProgramme from '../pages/admin/Programme';
import AdminProgrammeDetail from '../pages/admin/ProgrammeDetail';
import AdminProjectDetail from '../pages/admin/ProjectDetail';
import AdminGenerateReport from '../pages/admin/GenerateReport';
import AdminReports from '../pages/admin/Reports';
import AdminBeneficiaries from '../pages/admin/Beneficiaries';

import ManagementDashboard from '../pages/management/Dashboard';
import ManagementProgrammes from '../pages/management/Programmes';
import ManagementProgrammeDetail from '../pages/management/ProgrammeDetail';
import ManagementProjectDetail from '../pages/management/ProjectDetail';
import ManagementReports from '../pages/management/Reports';
import ManagementGenerateReport from '../pages/management/GenerateReport';

// MR-CD Pages
import CdDashboard from '../pages/MR-CD/CdDashboard';
import MrDashboard from '../pages/MR-CD/MrDashboard';
import Archives from '../pages/MR-CD/Archives';
import CdReports from '../pages/MR-CD/CdReports';
import MrReports from '../pages/MR-CD/MrReports';
import CdGenerateReport from '../pages/MR-CD/CdGenerateReport';
import MrGenerateReport from '../pages/MR-CD/MrGenerateReport';
import ValidationQueue from '../pages/MR-CD/ValidationQueue';
import ValidationProjects from '../pages/MR-CD/ValidationProjects';
import ValidationDetails from '../pages/MR-CD/ValidationDetails';
import OfficerDetails from '../pages/MR-CD/OfficerDetails';
import MrCdProgramme from '../pages/MR-CD/MrCdProgramme';
import MrCdProjectDetails from '../pages/MR-CD/MrCdProjectDetails';

import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/roles';
import { useAuth } from '../context/AuthContext';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />

      {/* Field Officer Routes (Path-less layout) */}
      <Route element={
        <ProtectedRoute>
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
        <ProtectedRoute>
          <ProgrammeOfficerLayoutNew />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/po/dashboard" replace />} />
        <Route path="dashboard" element={<PODashboard />} />
        <Route path="programmes" element={<POProgrammes />} />
        <Route path="beneficiaries" element={<POBeneficiaries />} />
        <Route path="beneficiaries/register" element={<RegisterBeneficiary />} />
        <Route path="reports" element={<POReports />} />
        <Route path="reports/generate" element={<GenerateReport />} />
        <Route path="programmes/add" element={<POAddNewProject />} />
        <Route path="programmes/:type/:id" element={<ProjectDetail />} />
        <Route path="programmes/detail/:id" element={<SpecificProjectDetail />} />

      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserManagement />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="annual-events" element={<AdminAnnualEvents />} />
        <Route path="events/:id" element={<AdminDetailEvent />} />
        <Route path="event-management/:id" element={<AdminEvent />} />
        <Route path="programmes" element={<AdminProgramme />} />
        <Route path="programmes/:id" element={<AdminProgrammeDetail />} />
        <Route path="projects/:id" element={<AdminProjectDetail />} />
        <Route path="beneficiaries" element={<AdminBeneficiaries />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="generate-report" element={<AdminGenerateReport />} />
      </Route>

      {/* Direct routes captured from Admin pages navigation */}
      <Route path="/add-user" element={<AdminAddUser />} />

      {/* Management Routes */}
      <Route path="/mgmt" element={
        <ProtectedRoute>
          <ManagementLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/mgmt/dashboard" replace />} />
        <Route path="dashboard" element={<ManagementDashboard />} />
        <Route path="programmes" element={<ManagementProgrammes />} />
        <Route path="programmes/:id" element={<ManagementProgrammeDetail />} />
        <Route path="projects/:id" element={<ManagementProjectDetail />} />
        <Route path="reports" element={<ManagementReports />} />
        <Route path="generate-report" element={<ManagementGenerateReport />} />
        <Route path="annual-events" element={<AdminAnnualEvents />} />
      </Route>

      {/* CD Officer Routes */}
      <Route path="/cd" element={
        <ProtectedRoute>
          <MrCdLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/cd/dashboard" replace />} />
        <Route path="dashboard" element={<CdDashboard />} />
        <Route path="archives" element={<Archives />} />
        <Route path="reports" element={<CdReports />} />
        <Route path="generate-report" element={<CdGenerateReport />} />
        <Route path="validation-queue" element={<ValidationQueue />} />
        <Route path="validation-queue/:programme" element={<ValidationProjects />} />
        <Route path="validation-queue/project/:id" element={<ValidationDetails />} />
        <Route path="archives/officer/:officerName" element={<OfficerDetails />} />
        <Route path="archives/programme/:programmeName" element={<MrCdProgramme />} />
        <Route path="archives/programme/:programmeName/project/:projectName" element={<MrCdProjectDetails />} />
      </Route>
      <Route path="/mr" element={
        <ProtectedRoute>
          <MrCdLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/mr/dashboard" replace />} />
        <Route path="dashboard" element={<MrDashboard />} />
        <Route path="archives" element={<Archives />} />
        <Route path="reports" element={<MrReports />} />
        <Route path="generate-report" element={<MrGenerateReport />} />
        <Route path="archives/officer/:officerName" element={<OfficerDetails />} />
        <Route path="archives/programme/:programmeName" element={<MrCdProgramme />} />
        <Route path="archives/programme/:programmeName/project/:projectName" element={<MrCdProjectDetails />} />
      </Route>

      {/* Legacy MR-CD Routes (Redirects) */}
      <Route path="/mr-cd" element={<Navigate to="/cd/dashboard" replace />} />
      <Route path="/cddashboard" element={<Navigate to="/cd/dashboard" replace />} />
      <Route path="/mrdashboard" element={<Navigate to="/mr/dashboard" replace />} />
      <Route path="/cdarchives" element={<Navigate to="/cd/archives" replace />} />
      <Route path="/mrarchives" element={<Navigate to="/mr/archives" replace />} />
      <Route path="/cdreports" element={<Navigate to="/cd/reports" replace />} />
      <Route path="/mrreports" element={<Navigate to="/mr/reports" replace />} />
      <Route path="/cdgeneratereport" element={<Navigate to="/cd/generate-report" replace />} />
      <Route path="/mrgeneratereport" element={<Navigate to="/mr/generate-report" replace />} />
      <Route path="/validationqueue" element={<Navigate to="/cd/validation-queue" replace />} />
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
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
