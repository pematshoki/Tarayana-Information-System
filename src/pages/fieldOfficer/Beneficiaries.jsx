import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Users2, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { beneficiariesData } from '../../data/mockData';
import UpdateBeneficiaryModal from '../../components/modals/UpdateBeneficiaryModal';
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal';
import SuccessModal from '../../components/modals/SuccessModal';
import Pagination from '../../components/ui/Pagination';

const Beneficiaries = () => {
  // Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredBeneficiaries = beneficiariesData.filter(b => 
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

  const handleEditClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (updatedData) => {
    console.log('Updating beneficiary:', updatedData);
    setIsUpdateModalOpen(false);
    setSuccessMessage('Beneficiary Updated Successfully');
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2000);
  };

  const handleDelete = () => {
    console.log('Deleting beneficiary:', selectedBeneficiary?.cid);
    setIsDeleteModalOpen(false);
    setSuccessMessage('Beneficiary Deleted Successfully');
    setIsSuccessModalOpen(true);
    setTimeout(() => setIsSuccessModalOpen(false), 2000);
  };
  return (
    <div className="space-y-6">
      {/* Search and Action */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name or CID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        <Link 
          to="/beneficiaries/register"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3498db] text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 font-bold"
        >
          <Plus size={20} />
          <span>New Beneficiary</span>
        </Link>
      </div>

      {/* Beneficiaries Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">CID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Dzongkhag</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Gewog</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Project</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentBeneficiaries.length > 0 ? (
                currentBeneficiaries.map((beneficiary, index) => (
                  <motion.tr 
                    key={`${beneficiary.cid}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{beneficiary.cid}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                          <Users2 size={16} />
                        </div>
                        <span>{beneficiary.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{beneficiary.dzongkhag}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{beneficiary.gewog}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{beneficiary.project}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleEditClick(beneficiary)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(beneficiary)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                       <Users2 size={32} className="opacity-20" />
                       <p className="text-sm">No beneficiaries found matching your search</p>
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

      {/* Modals */}
      <UpdateBeneficiaryModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdate}
        beneficiary={selectedBeneficiary}
      />

      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Beneficiary?"
        description="Deleting this beneficiary will remove all related data permanently. This action cannot be undone."
      />

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </div>
  );
};

export default Beneficiaries;
