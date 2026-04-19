import React, { useState, useEffect } from 'react';
import { data, useNavigate } from 'react-router-dom';
import { Search, Plus, Users2, Pencil, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import axios from 'axios';
import UpdateBeneficiaryModal from '../../components/modals/UpdateBeneficiaryModal';
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal';
import SuccessModal from '../../components/modals/SuccessModal';

const Beneficiaries = () => {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Configuration & Dummy Data
  const USE_DUMMY = true; // Toggle this for testing
  const DUMMY_PO_ID = "69daaf4430ceb65afddba2c3";
  const DUMMY_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

  // Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

const fetchBeneficiaries = async () => {
  setLoading(true);
  try {
    const poId = USE_DUMMY ? DUMMY_PO_ID : JSON.parse(localStorage.getItem('user')).id;

    // 1. Fetch Projects for the PO
    const projectRes = await axios.get(`http://localhost:5000/api/projects/programme-officer/${poId}`);
    const projects = projectRes.data.data || [];

    if (projects.length === 0) {
      setBeneficiaries([]);
      return;
    }

    // 2. Create a "Lookup Map" for Project Names
    // This stores { "projectId123": "Project Alpha", "projectId456": "Project Beta" }
    const projectNameMap = {};
    projects.forEach(proj => {
      projectNameMap[proj._id] = proj.projectName;
    });

    // 3. Fetch beneficiaries for each project
    const beneficiaryPromises = projects.map(project => 
      axios.get(`http://localhost:5000/api/beneficiaries/bene/${project._id}`)
    );

    const results = await Promise.all(beneficiaryPromises);
    
    // 4. Flatten and attach the Project Name manually
    const allBeneficiaries = results.flatMap((res, index) => {
      const projectData = res.data.data || [];
      const currentProjectId = projects[index]._id;

      return projectData.map(beneficiary => ({
        ...beneficiary,
        // We add a display property for the project name
        projectName: projectNameMap[currentProjectId] || "Unknown Project"
      }));
    });
    
    setBeneficiaries(allBeneficiaries);
    console.log(allBeneficiaries)

  } catch (err) {
    console.error("Error fetching data:", err);
    setBeneficiaries([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/beneficiaries/${selectedBeneficiary._id}`);
      setIsDeleteModalOpen(false);
      setSuccessMessage('Beneficiary Deleted Successfully');
      setIsSuccessModalOpen(true);
      fetchBeneficiaries(); // Refresh the list
    } catch (err) {
      alert("Delete failed");
    }
  };

  
const filteredData = beneficiaries.filter(b => {
  const search = searchTerm.toLowerCase();

  return (
    b.name?.toLowerCase().includes(search) ||
    b.cid?.toString().includes(search) ||
    b.dzongkhag?.toLowerCase().includes(search) ||
    b.projectName?.toLowerCase().includes(search)
  );
});
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or CID..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => navigate('/po/beneficiaries/register')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3498db] text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> <span>New Beneficiary</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">CID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Dzongkhag</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Project</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Year</th>

                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    No beneficiaries found for your assigned projects.
                  </td>
                </tr>
              ) : (
                filteredData.map((b) => (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm  text-gray-900">{b.cid}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                          <Users2 size={16} />
                        </div>
                        <span>{b.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{b.dzongkhag}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">
                      {b.projectName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {b.year}
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => { setSelectedBeneficiary(b); setIsUpdateModalOpen(true); }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => { setSelectedBeneficiary(b); setIsDeleteModalOpen(true); }}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Beneficiary?"
        description="This action cannot be undone."
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
     {selectedBeneficiary && (
      <UpdateBeneficiaryModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedBeneficiary(null);
        }}
        beneficiary={selectedBeneficiary}
        onUpdate={async () => {
          try {
            // refresh list AFTER update
            await fetchBeneficiaries();

            // show success
            setSuccessMessage('Beneficiary updated successfully');
            setIsSuccessModalOpen(true);
          } catch (err) {
            console.error("Refresh failed:", err);
          }
        }}
      />
    )}
    </div>
  );
};

export default Beneficiaries;