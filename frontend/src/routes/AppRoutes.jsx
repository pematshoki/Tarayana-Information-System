import { BrowserRouter, Routes, Route } from "react-router-dom";


import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import OTP from "../pages/auth/OTP"
import ConfirmPassword from "../pages/auth/ConfirmPassword";
// import DashboardLayout from "../components/DashboardLayout";
import Dashboard from "../pages/auth/Dashboard";
import Programme from "../pages/auth/Programme";
import ProgrammeDetail from "../pages/auth/ProgrammeDetail";
import ProjectDetail from "../pages/auth/ProjectDetail";
import Beneficiaries from "../pages/auth/Beneficiaries";
import Report from "../pages/auth/Report";
import GenerateReport from "../pages/auth/GenerateReport";
import AnnualEvents from "../pages/auth/AnnualEvents";
import Event from "../pages/auth/Event";
import DetailEvent from "../pages/auth/DetailEvent";
import UserManagement from "../pages/auth/UserManagement"
import Setting from "../pages/auth/Setting"
import AddUser from "../pages/auth/AddUser"




const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/confirmpassword" element={<ConfirmPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/programmes" element={<Programme />} />
        <Route path="/programmes/:id" element={<ProgrammeDetail />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />

        <Route path="/beneficiaries" element={<Beneficiaries />} />
        <Route path="/reports" element={<Report />} />
        <Route path="/generatereport" element={<GenerateReport />} />
        <Route path="/annualevents" element={<AnnualEvents />} />
    <Route path="/events/:id" element={<Event />} />
<Route path="/event-detail" element={<DetailEvent />} />
<Route path="/user-management" element={<UserManagement />} />
<Route path="/setting" element={<Setting />} />
<Route path="/add-user" element={<AddUser />} />


        {/* Dashboard Routes */}
        {/* <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        /> */}

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;