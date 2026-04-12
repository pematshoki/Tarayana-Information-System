import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText,
  Calendar,
  User,
  Globe,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { projectsData, beneficiariesData } from '../../data/mockData';

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const SpecificProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Find project data
  const project = projectsData.find(p => p.cid === id) || projectsData[0];
  
  // Determine back path
  const backPath = location.state?.from || '/projects';
  const backLabel = location.state?.label || 'Back to Projects';

  const activities = [
    { dzongkhag: 'Thimphu', gewog: 'Kawang', activity: 'Water Tap SLM', quantity: '15', training: 'Sanitation and Training', gender: 'F : 10   M : 10' },
    { dzongkhag: '', gewog: 'Shaba', activity: 'Water Tank', quantity: '20', training: '', gender: '' },
    { dzongkhag: 'Paro', gewog: 'Shaba', activity: 'Water Tap SLM', quantity: '20', training: '', gender: '' },
    { dzongkhag: 'Punakha', gewog: 'Guma', activity: 'Water Tap SLM', quantity: '20', training: '', gender: '' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Back Button */}
      <button 
        onClick={() => navigate(backPath)}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        <span>{backLabel}</span>
      </button>

      {/* Project Title Card */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">
          Improving housing resilience against climate impacts in rural communities.
        </p>
      </div>

      {/* Project Information Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Project information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard icon={FileText} label="Programme" value="Social Development" />
          <InfoCard icon={FileText} label="Dzongkhag" value="Trashigang" />
          <InfoCard icon={FileText} label="Duration" value="1 year" />
          <InfoCard icon={FileText} label="End Date" value="Dec 31, 2025" />
          <InfoCard icon={FileText} label="Donor" value="UNDP" />
          <InfoCard icon={FileText} label="Total Beneficiaries" value="30" />
        </div>
      </div>

      {/* Key Activities Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Key Activities</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                    DZONGKHAG <span className="text-red-500">*</span>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                    GEWOG <span className="text-red-500">*</span>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Activities <span className="text-red-500">*</span>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Quantity <span className="text-red-500">*</span>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Training</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Gender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activities.map((act, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{act.dzongkhag}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{act.gewog}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{act.activity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{act.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{act.training}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{act.gender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Beneficiaries Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Beneficiaries</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">CID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">NAME</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">DZONGKHAG</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">GEWOG</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">PROJECT</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">DETAIL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {beneficiariesData.slice(0, 4).map((ben, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{ben.cid}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{ben.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ben.dzongkhag}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{ben.gewog}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{ben.project}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {index === 0 ? 'Built water tank' : index === 3 ? 'provide kitchen utensils' : ben.project}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4">
        <button 
          onClick={() => navigate(backPath)}
          className="px-10 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold"
        >
          Cancel
        </button>
        <button className="px-10 py-2.5 bg-[#3498db] text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 font-bold">
          Update Activities
        </button>
      </div>
    </div>
  );
};

export default SpecificProjectDetail;
