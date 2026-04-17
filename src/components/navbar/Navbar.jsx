import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  User, 
  ChevronDown, 
  LogOut, 
  Key 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ setMobileMenuOpen, userRole = "Field Officer", userName = "Phuntsho Wangmo" }) => {
  const { logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const getPageInfo = () => {
    const path = location.pathname;
    // Field Officer Routes
    if (path.startsWith('/dashboard')) return { title: 'Dashboard', desc: 'Overview of all operations' };
    if (path.startsWith('/projects/')) return { title: 'Projects', desc: 'Manage projects' };
    if (path.startsWith('/projects')) return { title: 'Projects', desc: 'Manage projects' };
    if (path.startsWith('/beneficiaries')) return { title: 'Beneficiaries', desc: 'Beneficiary records & households' };
    if (path.startsWith('/reports')) return { title: 'Report & M&E', desc: 'Recent reports & exports' };
    if (path.startsWith('/events')) return { title: 'Annual Events', desc: 'Manage annual events' };
    
    // Programme Officer Routes
    if (path.startsWith('/po/dashboard')) return { title: 'Dashboard', desc: 'Overview of all operations' };
    if (path.startsWith('/po/programmes')) return { title: 'Programmes', desc: 'Manage programmes & projects' };
    if (path.startsWith('/po/beneficiaries')) return { title: 'Beneficiaries', desc: 'Beneficiary records & households' };
    if (path.startsWith('/po/reports')) return { title: 'Report & M&E', desc: 'Recent reports & exports' };
    
    // Admin Routes
    if (path.startsWith('/admin')) return { title: 'Admin Panel', desc: 'System management' };
    
    // CD Routes
    if (path.startsWith('/cd')) return { title: 'CD Dashboard', desc: 'Compliance & Documentation' };
    
    // MR Routes
    if (path.startsWith('/mr')) return { title: 'MR Dashboard', desc: 'Monitoring & Reporting' };
    
    // Management Routes
    if (path.startsWith('/mgmt')) return { title: 'Management', desc: 'Strategic Overview' };
    
    // Viewer Routes
    if (path.startsWith('/viewer')) return { title: 'Data Viewer', desc: 'Read-only access' };
    
    return { title: 'Tarayana', desc: 'Information System' };
  };

  const { title, desc } = getPageInfo();

  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h2>
          <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider font-medium">
            {desc}
          </p>
        </div>
      </div>
      <div className="relative">
        <button 
          className="flex items-center gap-3 hover:bg-gray-50 p-1 rounded-xl transition-all"
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-blue-100 transition-all">
            <User size={24} className="text-gray-400" />
          </div>
          <ChevronDown size={16} className={cn("text-gray-400 transition-transform", profileDropdownOpen && "rotate-180")} />
        </button>

        {/* Profile Dropdown */}
        {profileDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setProfileDropdownOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
            >
              <div className="px-4 py-3 border-b border-gray-50 mb-1">
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-400">12220080.gcit@rub.edu.bt</p>
              </div>
              
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <User size={18} />
                <span>Profile View</span>
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Key size={18} />
                <span>Change Password</span>
              </button>
              
              <div className="h-px bg-gray-50 my-1" />
              
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all">
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </motion.div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
