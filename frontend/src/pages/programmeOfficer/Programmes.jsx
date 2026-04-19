import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Filter, Plus, ChevronDown, Edit2, Trash2, FileText, ArrowLeft} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { cn } from '../../lib/utils';
import UpdateProjectModal from '../../components/modals/UpdateProjectModal';
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal';
import SuccessModal from '../../components/modals/SuccessModal';

const Programmes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 🔴 DUMMY FALLBACKS
  const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGFhZjQ0MzBjZWI2NWFmZGRiYTJjMyIsInJvbGUiOiJQcm9ncmFtbWVPZmZpY2VyIiwiaWF0IjoxNzc2NDQ0NDI5LCJleHAiOjE3NzY1MzA4Mjl9.LIaDLCZMsro8bc_GDDsWdASKp56yhFi5qcXOOL4u-AY";
  const DUMMY_PO_ID = "69daaf4430ceb65afddba2c3";

  // 🔐 GET FROM LOCAL STORAGE
  const storedToken = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const TOKEN = storedToken || DUMMY_TOKEN;
  const PO_ID = storedUser?.id || DUMMY_PO_ID;

  // Core Data States
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState('projects');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  // --- API CALLS ---

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/projects/programme-officer/${PO_ID}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      console.log("📥 PO Projects:", response.data.data);
      setProjects(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching PO projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);





const handleUpdate = async (updatedData) => {
  try {
    console.log("📤 Sending update data:", updatedData);

    const response = await axios.put(
      `http://localhost:5000/api/projects/update/${selectedProject._id}`,
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    // ✅ Log full response
    console.log("✅ Update Response:", response);
    console.log("✅ Updated Project Data:", response.data);

    // UI updates
    setIsUpdateModalOpen(false);
    setSuccessMessage('Project Updated Successfully');
    setIsSuccessModalOpen(true);

    await fetchProjects(); // refresh list

    setTimeout(() => setIsSuccessModalOpen(false), 2000);

  } catch (error) {
    console.error("❌ Update failed FULL:", error);

    if (error.response) {
      console.error("❌ Status:", error.response.status);
      console.error("❌ Data:", error.response.data);
    }

    alert(error.response?.data?.message || "Failed to update project");
  }
};







  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${selectedProject._id}`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      setIsDeleteModalOpen(false);
      setSuccessMessage('Project Deleted Successfully');
      setIsSuccessModalOpen(true);
      fetchProjects();
      setTimeout(() => setIsSuccessModalOpen(false), 2000);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete project");
    }
  };

  // --- LOGIC (UNCHANGED BELOW) ---

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

  const handleBoxClick = (value) => {
    setSearchTerm(value);
    setLayout('projects');
  };

  const filteredProjects = projects.filter(project => {
    const search = searchTerm.toLowerCase();
    return (
      project.projectName?.toLowerCase().includes(search) ||
      project.dzongkhag?.some(d => d.toLowerCase().includes(search)) ||
      // project.programme?.programmeName?.toLowerCase().includes(search)
      project.programme?.some(p => p.programmeName?.toLowerCase().includes(search))
    );
  });

const programmesSummary = projects.reduce((acc, proj) => {
  if (proj.programme?.length > 0) {
    proj.programme.forEach(p => {
      const name = p.programmeName;
      if (!acc[name]) acc[name] = { name, count: 0 };
      acc[name].count++;
    });
  } else {
    if (!acc['Unassigned']) acc['Unassigned'] = { name: 'Unassigned', count: 0 };
    acc['Unassigned'].count++;
  }

  return acc;
}, {});

  const dzongkhagsSummary = projects.reduce((acc, proj) => {
    proj.dzongkhag?.forEach(d => {
      if (!acc[d]) acc[d] = { name: d, count: 0 };
      acc[d].count++;
    });
    return acc;
  }, {});




  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Back Arrow - Only shows if searching or not in default projects layout */}
          {(searchTerm || layout !== 'projects') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setLayout('projects');
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              title="Back to all projects"
            >
              <ArrowLeft size={20} />
            </button>
          )}

        <div>
          {/* <h1 className="text-2xl font-bold text-gray-900">Programmes</h1> */}
          {/* <p className="text-sm text-gray-500">Manage your system projects</p>
           */}
          <p className="text-sm text-gray-500">
              {searchTerm ? `Showing results for "${searchTerm}"` : "Manage your system projects"}
          </p>
        </div>
      </div>

        <button 
          onClick={() => navigate('/po/programmes/add')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#3498db] text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg font-bold text-sm"
        >
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
          />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-gray-600 min-w-[160px]"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <span className="text-sm font-medium capitalize">{layout}</span>
            </div>
            <ChevronDown className={cn("transition-transform", isDropdownOpen && "rotate-180")} size={16} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute right-0 mt-2 w-full bg-white border rounded-xl shadow-xl z-20 overflow-hidden">
                {['projects', 'programmes', 'dzongkhags'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setLayout(opt); setIsDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 capitalize font-medium text-gray-600"
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 animate-pulse">Fetching records...</div>
      ) : (
        <AnimatePresence mode="wait">
          {layout === 'projects' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b">
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Project Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dzongkhag</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Programme</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Field Officer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Action</th>
                  </tr> 
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px]">
                  {filteredProjects.map((project) => (
                    <tr 
                      key={project._id} 
                      onClick={() => navigate(`/po/programmes/detail/${project._id}`)}
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">{project.projectName}</td>
                      <td className="px-6 py-4 text-gray-900">{project.dzongkhag?.join(', ')}</td>
                      <td className="px-6 py-4 text-gray-900">{project.programme?.map(p => p.programmeName).join(', ')}</td>
                      <td className="px-6 py-4 text-gray-900">{project.fieldOfficer?.map(f => f.email).join(', ') }</td>
                      <td className="px-6 py-4 text-gray-900">{new Date(project.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button 
                          onClick={(e) => handleEditClick(e, project)} 
                          className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm"
                          title="Edit Project"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={(e) => handleDeleteClick(e, project)} 
                          className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="p-10 text-center text-gray-400 text-sm">No projects found matching your criteria.</div>
              )}
            </motion.div>
          )}

          {(layout === 'programmes' || layout === 'dzongkhags') && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.values(layout === 'programmes' ? programmesSummary : dzongkhagsSummary).map((item) => (
                <div 
                  key={item.name}
                  onClick={() => handleBoxClick(item.name)}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <FileText size={18} />
                    </div>
                    <h5 className="font-bold text-gray-900">{item.name}</h5>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border">
                    {item.count} projects
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Modals */}
      <UpdateProjectModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        project={selectedProject} 
        onUpdate={handleUpdate} 
      />
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Project?" 
        description="This will permanently remove the project from the database."
      />
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        message={successMessage} 
      />
    </div>
  );
};

export default Programmes;