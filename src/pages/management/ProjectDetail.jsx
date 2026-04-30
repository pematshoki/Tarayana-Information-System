import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  UserCircle2, 
  MapPin, 
  Calendar,
  Layers,
  Search,
  Download
} from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const projectInfo = {
    title: 'Rural Housing Phase III',
    description: 'Providing sustainable housing solutions and renovations for underprivileged households in rural Thimphu and Paro regions.',
    details: [
      { label: 'Programme Area', value: 'Social Development', icon: <Layers size={18} /> },
      { label: 'Operational Status', value: 'Active / On-Track', icon: <Calendar size={18} /> },
      { label: 'Primary Dzongkhag', value: 'Thimphu', icon: <MapPin size={18} /> },
    ],
    beneficiaries: [
      { cid: '11400000000', name: 'Sangay Wangmo', dzongkhag: 'Thimphu', gewog: 'Genekha', village: 'Zamtog', year: '2025' },
      { cid: '11500000000', name: 'Karma Tashi', dzongkhag: 'Thimphu', gewog: 'Genekha', village: 'Zamtog', year: '2025' },
      { cid: '11600000000', name: 'Pema Lhamo', dzongkhag: 'Thimphu', gewog: 'Genekha', village: 'Zamtog', year: '2025' },
      { cid: '11700000000', name: 'Sonam Yeshey', dzongkhag: 'Thimphu', gewog: 'Chang', village: 'Ramtokto', year: '2025' },
    ]
  };

  const filteredBeneficiaries = projectInfo.beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.cid.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredBeneficiaries.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBeneficiaries = filteredBeneficiaries.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Navigation & Hero */}
      <div className="space-y-8">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-500 uppercase tracking-widest transition-all"
        >
          <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50">
            <ArrowLeft size={14} /> 
          </div>
          Back to Programme
        </button>

        <div className="bg-white p-10 sm:p-14 rounded-[56px] shadow-sm border border-gray-50 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full -mr-20 -mt-20" />
          <div className="relative">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-4">{projectInfo.title}</h2>
            <p className="text-lg text-gray-500 font-medium max-w-3xl leading-relaxed italic border-l-4 border-blue-500 pl-6">{projectInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectInfo.details.map((detail, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner shadow-blue-100">
              {detail.icon}
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{detail.label}</p>
              <h4 className="text-lg font-black text-gray-900 tracking-tight">{detail.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 px-4">
           <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Project Beneficiaries</h3>
              <p className="text-xs text-gray-400 font-black uppercase tracking-widest mt-1">Listing of supported households</p>
           </div>
           
           <div className="flex gap-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search by Name or CID..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white border border-gray-100 pl-12 pr-6 py-3 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100" 
                 />
              </div>
              <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                 <Download size={16} /> Export Data
              </button>
           </div>
        </div>

        <div className="bg-white rounded-[40px] border border-gray-50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-gray-400">CID #</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-gray-400">Full Name</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-gray-400">Location Details</th>
                  <th className="px-10 py-8 text-[11px] font-black uppercase tracking-widest text-gray-400 text-right">Status</th>
                </tr>
              </thead>
               <tbody className="divide-y divide-gray-50">
                {currentBeneficiaries.length > 0 ? (
                  currentBeneficiaries.map((b, i) => (
                    <tr key={i} className="hover:bg-blue-50/10 transition-colors group">
                      <td className="px-10 py-8 text-sm font-black text-gray-900">{b.cid}</td>
                      <td className="px-10 py-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                               <UserCircle2 size={24} />
                            </div>
                            <span className="text-sm font-black text-gray-900">{b.name}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8">
                         <div className="flex flex-col">
                            <span className="text-xs font-black text-gray-700">{b.dzongkhag}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{b.gewog}, {b.village}</span>
                         </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                         <span className="text-xs font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Verified</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-10 py-20 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                         <UserCircle2 size={40} className="opacity-10" />
                         <p className="font-bold">No beneficiaries found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
