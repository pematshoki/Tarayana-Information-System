import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ChevronRight } from 'lucide-react';

const ManagementProgrammes = () => {
  const navigate = useNavigate();

  const programmes = [
    { id: 'social', title: 'Social Development Programmes', icon: <FileText size={24} /> },
    { id: 'economic', title: 'Economic Development Programmes', icon: <FileText size={24} /> },
    { id: 'environment', title: 'Environment & Climate', icon: <FileText size={24} /> },
    { id: 'research', title: 'Research', icon: <FileText size={24} /> },
    { id: 'advocacy', title: 'Advocacy & Network', icon: <FileText size={24} /> },
    { id: 'clubs', title: 'Tarayana Clubs', icon: <FileText size={24} /> },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Card */}
      <div className="max-w-sm">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Beneficiaries</p>
            <h3 className="text-2xl font-extrabold text-gray-800">12,000</h3>
          </div>
          <div className="bg-blue-100 text-blue-500 p-4 rounded-2xl shadow-inner shadow-blue-200/50">
            <Users size={26} />
          </div>
        </div>
      </div>

      {/* Programmes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((p) => (
          <div 
            key={p.id}
            onClick={() => navigate(`/mgmt/programmes/${p.id}`)}
            className="group bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-20 h-20 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner shadow-blue-100">
              {p.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementProgrammes;
