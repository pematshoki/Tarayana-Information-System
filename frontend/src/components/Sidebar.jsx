import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  BarChart3, 
  Calendar, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  X,
  Settings,
  Shield,
  PieChart,
  ClipboardList,
  FileText
} from 'lucide-react';
import { cn } from '../lib/utils';

const SidebarItem = ({ icon, label, to, collapsed, className, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
      isActive 
        ? "bg-[#3498db] text-white shadow-lg shadow-blue-200" 
        : "text-gray-400 hover:bg-gray-800 hover:text-white",
      collapsed && "justify-center px-0",
      className
    )}
  >
    <div className="shrink-0">
      {icon}
    </div>
    {!collapsed && <span className="font-bold text-sm">{label}</span>}
    {collapsed && (
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    )}
  </NavLink>
);

const Sidebar = ({ role = 'Field Officer', collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }) => {
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const menuConfigs = {
    'Field Officer': [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/dashboard' },
      { icon: <Briefcase size={20} />, label: 'Projects', to: '/projects' },
      { icon: <Users size={20} />, label: 'Beneficiaries', to: '/beneficiaries' },
      { icon: <BarChart3 size={20} />, label: 'Report & M&E', to: '/reports' },
      { icon: <Calendar size={20} />, label: 'Annual Events', to: '/events' },
    ],
    'Programme Officer': [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/po/dashboard' },
      { icon: <FileText size={20} />, label: 'Programmes', to: '/po/programmes' },
      { icon: <Users size={20} />, label: 'Beneficiaries', to: '/po/beneficiaries' },
      { icon: <BarChart3 size={20} />, label: 'Report & M&E', to: '/po/reports' },
    ],
    'C&D': [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/cd/dashboard' },
      { icon: <ClipboardList size={20} />, label: 'Compliance', to: '/cd/compliance' },
      { icon: <FileText size={20} />, label: 'Documentation', to: '/cd/docs' },
      { icon: <BarChart3 size={20} />, label: 'Audit Reports', to: '/cd/reports' },
    ],
    'Admin': [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', to: '/admin/dashboard' },
      { icon: <Users size={20} />, label: 'User Management', to: '/admin/users' },
      { icon: <Shield size={20} />, label: 'Security', to: '/admin/security' },
      { icon: <Settings size={20} />, label: 'System Settings', to: '/admin/settings' },
    ],
    'Management': [
      { icon: <LayoutDashboard size={20} />, label: 'Overview', to: '/mgmt/dashboard' },
      { icon: <PieChart size={20} />, label: 'Analytics', to: '/mgmt/analytics' },
      { icon: <BarChart3 size={20} />, label: 'Strategic Reports', to: '/mgmt/reports' },
      { icon: <Users size={20} />, label: 'Impact Assessment', to: '/mgmt/impact' },
    ]
  };

  const menuItems = menuConfigs[role] || menuConfigs['Field Officer'];

  return (
    <aside 
      className={cn(
        "bg-[#1A1A1A] text-white transition-all duration-300 flex flex-col fixed top-0 h-screen z-50",
        collapsed ? "w-20" : "w-64",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0 overflow-hidden border-2 border-[#3498db]">
            <img 
              src="https://picsum.photos/seed/tarayana/100/100" 
              alt="Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg leading-tight truncate">Tarayana</h1>
              <p className="text-xs text-gray-500 truncate">Information System</p>
            </div>
          )}
        </div>
        <button 
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item, index) => (
          <SidebarItem 
            key={index}
            icon={item.icon}
            label={item.label}
            to={item.to}
            collapsed={collapsed}
            onClick={closeMobileMenu}
          />
        ))}
      </nav>

      <div className="px-4 pb-6 space-y-2">
        <SidebarItem 
          icon={<LogOut size={20} />} 
          label="Sign Out" 
          to="/logout"
          collapsed={collapsed}
          className="text-red-400 hover:bg-red-500/10 hover:text-red-500"
          onClick={closeMobileMenu}
        />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden lg:flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-400 hover:bg-gray-800 hover:text-white",
            collapsed && "justify-center px-0"
          )}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          {!collapsed && <span className="font-bold text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
