import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Search } from "lucide-react";

const programmes = [
  { name: "Social Development", count: 12 },
  { name: "Economic Development", count: 12 },
  { name: "Environment & Climate", count: 12 },
  { name: "Research", count: 12 },
  { name: "Advocacy & Network", count: 12 },
  { name: "Tarayana Clubs", count: 12 },
];

const ValidationQueue = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const rootPath = pathname.split('/')[1];
  const userRole = rootPath === 'mr' ? 'MR Officer' : 'CD Officer';
  const user = { name: "Pema Tshoki", role: userRole };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          Validation Queue
        </h1>
        <p className="text-xs sm:text-[13px] text-gray-500 font-medium">
          Validate Quantities for Key Activities
        </p>
      </header>

      {/* SEARCH BAR */}
      <div className="relative mb-6 w-full sm:max-w-sm">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {programmes.map((p, i) => (
          <div
            key={i}
            onClick={() => navigate(`/${rootPath}/validation-queue/${p.name}`)}
            className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-transparent hover:border-blue-200 transition-all cursor-pointer group"
          >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 sm:p-2.5 bg-blue-50 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <FileText size={18} />
                  </div>

                  <span className="text-[9px] sm:text-[10px] font-bold bg-gray-50 text-gray-400 px-2 py-1 rounded-md uppercase tracking-tight">
                    {p.count} projects
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors break-words">
                  {p.name}
                </h3>
              </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationQueue;