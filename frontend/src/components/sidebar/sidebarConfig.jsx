
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Calendar,
  UserCog,
  Settings,
  ClipboardList,
  PieChart,
  Shield
} from "lucide-react";

export const menuConfigs = {
  'Field Officer': [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", path: "/projects", icon: <FileText size={20} /> },
    { name: "Beneficiaries", path: "/beneficiaries", icon: <Users size={20} /> },
    { name: "Report & M&E", path: "/reports", icon: <BarChart3 size={20} /> },
    { name: "Annual Events", path: "/events", icon: <Calendar size={20} /> },
  ],
  'Programme Officer': [
    { name: "Dashboard", path: "/po/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Programmes", path: "/po/programmes", icon: <FileText size={20} /> },
    { name: "Beneficiaries", path: "/po/beneficiaries", icon: <Users size={20} /> },
    { name: "Report & M&E", path: "/po/reports", icon: <BarChart3 size={20} /> },
  ],
  'Admin': [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "User Management", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Security", path: "/admin/security", icon: <Shield size={20} /> },
    { name: "System Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ],
  'Management': [
    { name: "Overview", path: "/mgmt/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Analytics", path: "/mgmt/analytics", icon: <PieChart size={20} /> },
    { name: "Strategic Reports", path: "/mgmt/reports", icon: <BarChart3 size={20} /> },
    { name: "Impact Assessment", path: "/mgmt/impact", icon: <Users size={20} /> },
  ],
};
