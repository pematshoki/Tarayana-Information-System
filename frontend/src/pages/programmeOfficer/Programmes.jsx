import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Plus, ChevronDown, Edit2, Trash2, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectsData, programmesData, dzongkhagsData } from '../../data/mockData';
import { cn } from '../../lib/utils';
import UpdateProjectModal from '../../components/modals/UpdateProjectModal';
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal';
import SuccessModal from '../../components/modals/SuccessModal';

const Programmes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects] = useState(projectsData);
  const [layout, setLayout] = useState('projects'); // 'projects', 'programmes', 'dzongkhags'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successDescription, setSuccessDescription] = useState('');
  const [successIcon, setSuccessIcon] = useState(null);
  const [successColor, setSuccessColor] = useState('text-green-500');
  const [successBg, setSuccessBg] = useState('bg-green-50');
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEditClick = (e, project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (e, project) => {
    e.stopPropagation();
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    console.log('Updating project:', updatedData);
    setIsUpdateModalOpen(false);
    setSuccessMessage('Project Updated Successfully');
    setSuccessDescription('');
    setSuccessIcon(null);
    setSuccessColor('text-green-500');
    setSuccessBg('bg-green-50');
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2000);
  };

  const handleDelete = () => {
    console.log('Deleting project:', selectedProject?.cid);
    setIsDeleteModalOpen(false);
    setSuccessMessage('Project Deleted Successfully');
    setSuccessDescription('');
    setSuccessIcon(null);
    setSuccessColor('text-green-500');
    setSuccessBg('bg-green-50');
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2000);
  };

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.dzongkhag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (type, id) => {
    navigate(`/po/programmes/${type}/${encodeURIComponent(id)}`);
  };

  const handleProjectClick = (projectId, label) => {
    navigate(`/po/programmes/detail/${projectId}`, { 
      state: { from: location.pathname, label: `Back to ${label}` } 
    });
  };

  const layoutOptions = [
    { id: 'projects', label: 'Projects' },
    { id: 'programmes', label: 'Programmes' },
    { id: 'dzongkhags', label: 'Dzongkhags' }
  ];

  const currentLayoutLabel = layoutOptions.find(opt => opt.id === layout)?.label;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programmes</h1>
          <p className="text-sm text-gray-500">Manage programmes & projects</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/po/programmes/add')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3498db] text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 font-bold text-sm"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all min-w-[160px]"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm font-medium">{currentLayoutLabel}</span>
            </div>
            <ChevronDown className={cn("transition-transform duration-200 text-gray-400", isDropdownOpen && "rotate-180")} size={16} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                >
                  {layoutOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setLayout(option.id);
                        setIsDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                        layout === option.id 
                          ? "bg-blue-50 text-blue-600" 
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {layout === 'projects' && (
          <motion.div 
            key="projects-layout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">CID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dzongkhag</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Village</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gewog</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredProjects.map((project, index) => (
                    <motion.tr 
                      key={project.cid}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleProjectClick(project.cid, 'Projects')}
                      className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4 text-xs font-bold text-gray-600">{project.cid}</td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-900">{project.name}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{project.dzongkhag}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{project.village}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{project.gewog}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{project.year}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={(e) => handleEditClick(e, project)}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteClick(e, project)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {layout === 'programmes' && (
          <motion.div 
            key="programmes-layout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {programmesData.map((programme, index) => (
              <motion.div 
                key={programme.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCardClick('programme', programme.title)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900">{programme.title}</h4>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-400">{programme.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                    {programme.count} projects
                  </span>
                </div>
                
                <ul className="space-y-2 pt-2">
                  {programme.projects.map((proj, i) => (
                    <li 
                      key={i} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick('BN1001', programme.title);
                      }}
                      className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-500 cursor-pointer transition-colors"
                    >
                      <div className="w-1 h-1 bg-gray-300 rounded-full" />
                      {proj}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        )}

        {layout === 'dzongkhags' && (
          <motion.div 
            key="dzongkhags-layout"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {dzongkhagsData.map((dzongkhag, index) => (
              <motion.div 
                key={dzongkhag.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCardClick('dzongkhag', dzongkhag.name)}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <FileText size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900">{dzongkhag.name}</h4>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                  {dzongkhag.count} projects
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <UpdateProjectModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdate}
        project={selectedProject}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project?"
        description="Are you sure you want to delete this project? This action will permanently remove the project from the system."
      />

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
        description={successDescription}
        icon={successIcon}
        iconColor={successColor}
        iconBg={successBg}
      />
    </div>
  );
};

export default Programmes;
