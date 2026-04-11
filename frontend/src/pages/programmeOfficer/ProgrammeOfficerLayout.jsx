import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { cn } from '../../lib/utils';

const ProgrammeOfficerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] relative overflow-x-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        role="Programme Officer"
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 w-full",
          !mobileMenuOpen && (collapsed ? "lg:ml-20" : "lg:ml-64")
        )}
      >
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
          <Header 
            userRole="Programme Officer" 
            userName="Pema Tshoki" 
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <div className="mt-4 lg:mt-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgrammeOfficerLayout;
