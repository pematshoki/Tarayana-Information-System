import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  MapPin, 
  DollarSign, 
  Clock,
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';

const ManagementProgrammeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const programmeInfo = {
    title: 'Social Development',
    projectsCount: 5,
    kpis: [
      { label: 'Beneficiaries', value: '4,294', icon: <Users size={20} />, color: 'bg-blue-100 text-blue-500' },
      { label: 'Projects', value: '12', icon: <FileText size={20} />, color: 'bg-green-100 text-green-500' },
      { label: 'Dzongkhags', value: '15', icon: <MapPin size={20} />, color: 'bg-orange-100 text-orange-500' },
      { label: 'Budget', value: 'Nu. 42,000', icon: <DollarSign size={20} />, color: 'bg-purple-100 text-purple-500' },
    ],
    projects: [
      { id: '1', name: 'Climate & Disaster Resilient Housing Improvement', po: 'Phuntsho Wangmo', fo: 'Sangay Choden', beneficiaries: '1,200' },
      { id: '2', name: 'Climate Resilient WASH', po: 'Phuntsho Wangmo', fo: 'Tempel Gyeltshen', beneficiaries: '800' },
      { id: '3', name: 'Sustainable Food Systems', po: 'Sangay Wangmo', fo: 'Sangay Choden', beneficiaries: '500' },
      { id: '4', name: 'Scholarships and Learning Opportunities', po: 'Phuntsho Choden', fo: 'Sangay Lhamo', beneficiaries: '1,000' },
      { id: '5', name: 'Surgical Camps', po: 'Phuntsho Wangmo', fo: 'Sangay Choden', beneficiaries: '1,050' },
    ]
  };

  return (
    <div className="space-y-8">
      {/* Back Button & Title */}
      <div className="space-y-6">
        <button 
          onClick={() => navigate('/mgmt/programmes')}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Programmes
        </button>

        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-500 shadow-inner shadow-blue-200/50">
            <Layers size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{programmeInfo.title}</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">{programmeInfo.projectsCount} Projects</p>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {programmeInfo.kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className={`${kpi.color} p-3 rounded-xl`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-lg font-extrabold text-gray-800 leading-tight">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-black text-gray-800 tracking-tight">Projects</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Under this programme</p>
        </div>

        <div className="space-y-3">
          {programmeInfo.projects.map((project) => (
            <div 
              key={project.id}
              onClick={() => navigate(`/mgmt/projects/${project.id}`)}
              className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-lg hover:border-blue-50 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 text-blue-400 rounded-lg group-hover:scale-110 transition-transform shadow-inner shadow-blue-100">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800 tracking-tight">{project.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">PO {project.po}, FO {project.fo}</p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-0 border-gray-50 pt-3 sm:pt-0">
                <p className="text-lg font-black text-gray-800 leading-none">{project.beneficiaries}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mt-1">Beneficiaries</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagementProgrammeDetail;
