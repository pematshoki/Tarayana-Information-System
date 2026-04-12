

import { useState } from "react";
import logo from "../assets/logo.png";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Calendar,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Programmes", path: "/programmes", icon: <FileText size={20} /> },
    { name: "Beneficiaries", path: "/beneficiaries", icon: <Users size={20} /> },
    { name: "Report & M&E", path: "/reports", icon: <BarChart3 size={20} /> },
    { name: "Annual Events", path: "/annualevents", icon: <Calendar size={20} /> },
    { name: "User Management", path: "/user-management", icon: <UserCog size={20} /> },
    { name: "Setting", path: "/setting", icon: <Settings size={20} /> },
  ];

  return (
    <div>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-screen bg-[#1E1E1E] text-white 
        transition-all duration-300
        ${collapsed ? "w-[75px]" : "w-[265px]"} 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-700">
          <img
            src={logo}
            alt="logo"
            className={`rounded-full transition-all duration-300 
              ${collapsed ? "w-9 h-9 mx-auto" : "w-11 h-11"}`}
          />

          {!collapsed && (
            <div className="leading-tight">
              <h1 className="text-[20px] font-bold">Tarayana</h1>
              <p className="text-[15px] text-gray-400">
                Information System
              </p>
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="flex-1 mt-4 space-y-1 px-2">
          {menuItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `relative group flex items-center ${
                  collapsed ? "justify-center" : ""
                } gap-3 px-4 py-3 rounded-lg text-[15px] font-semibold transition-all duration-300
                ${
                  isActive
                    ? "bg-[#2EA1F2] text-white"
                    : "text-gray-300 hover:bg-[#2A2A2A]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* LEFT ACTIVE LINE */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#2EA1F2] rounded-r-full"></span>
                  )}

                  {/* ICON */}
                  <span
                    className={`transition-all duration-300 ${
                      !isActive ? "group-hover:text-[#3B82F6]" : ""
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* TEXT */}
                  {!collapsed && (
                    <span
                      className={`transition-all duration-300 ${
                        !isActive ? "group-hover:text-[#2EA1F2]" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  )}

                  {/* TOOLTIP (only when collapsed) */}
                  {collapsed && (
                    <span className="absolute left-full ml-3 px-3 py-1 text-sm bg-gray-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-700 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-all duration-300">
            <LogOut size={18} className="text-red-400"  />
            {!collapsed && (
              <span
                onClick={() => (window.location.href = "/")}
                className="text-red-400"
              >
                Sign Out
              </span>
            )}
          </div>

          <div
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer hover:bg-[#2A2A2A] transition-all duration-300"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span>Collapse</span>}
          </div>
        </div>
      </div>

      {/* Mobile button */}
      <div className={`md:hidden fixed top-4 left-4 z-50 ${
    mobileOpen ? "hidden" : "block"
  }`}>
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;