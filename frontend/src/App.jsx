import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
} from './pages/fieldOfficer';

import {
  ProgrammeOfficerLayout,
  Dashboard as PODashboard,
  Programmes as POProgrammes,
  Beneficiaries as POBeneficiaries,
  Reports as POReports,
  AddNewProject as POAddNewProject
} from './pages/programmeOfficer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Field Officer Routes */}
        <Route path="/" element={<FieldOfficerLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
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
        <Route path="/po" element={<ProgrammeOfficerLayout />}>
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

        {/* Fallback for unhandled routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
