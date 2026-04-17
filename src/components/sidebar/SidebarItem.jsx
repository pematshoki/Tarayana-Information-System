import React from 'react';
import { NavLink } from 'react-router-dom';

const SidebarItem = ({ item, collapsed }) => {
  return (
    <NavLink
      to={item.path}
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
            <span className="absolute left-full ml-3 px-3 py-1 text-sm bg-gray-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50">
              {item.name}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
