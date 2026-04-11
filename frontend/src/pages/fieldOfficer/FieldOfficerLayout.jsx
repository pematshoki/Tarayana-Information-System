import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { cn } from '../../lib/utils';

const FieldOfficerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative overflow-x-hidden">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Sidebar 
        role="Field Officer"
        collapsed={collapsed} 
        setCollapsed={setCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <main 
        className={cn(
          "flex-1 w-full overflow-y-auto transition-all duration-300",
          !mobileMenuOpen && (collapsed ? "lg:ml-20" : "lg:ml-64")
        )}
      >
        <Header 
          setMobileMenuOpen={setMobileMenuOpen} 
        />

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FieldOfficerLayout;
