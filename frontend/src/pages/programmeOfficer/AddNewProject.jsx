import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronDown, Plus, Files } from 'lucide-react';
import { motion } from 'motion/react';
import SuccessModal from '../../components/modals/SuccessModal';

const AddNewProject = () => {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    dzongkhag: '',
    startDate: '',
    endDate: '',
    donor: '',
    partner: '',
    programme: '',
    fieldOfficer: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we would save the data here
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      navigate('/po/programmes');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Section */}
      <div className="space-y-4">
        <button 
          onClick={() => navigate('/po/programmes')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          <span>Back to programmes</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
      </div>

      {/* Form Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Project Name</label>
              <input 
                type="text" 
                placeholder="Enter Name"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                required
              />
            </div>

            {/* Dzongkhag */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Dzongkhag</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-gray-600"
                  value={formData.dzongkhag}
                  onChange={(e) => setFormData({...formData, dzongkhag: e.target.value})}
                  required
                >
                  <option value="">Select Dzongkhag</option>
                  <option value="Thimphu">Thimphu</option>
                  <option value="Paro">Paro</option>
                  <option value="Punakha">Punakha</option>
                  <option value="Wangdue">Wangdue</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Start Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">End Date</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-600"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Donor */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Donor</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Sonam Wangmo"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.donor}
                  onChange={(e) => setFormData({...formData, donor: e.target.value})}
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold text-sm hover:text-blue-600 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Partner */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Partner</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-gray-600"
                  value={formData.partner}
                  onChange={(e) => setFormData({...formData, partner: e.target.value})}
                >
                  <option value="">Enter Partner</option>
                  <option value="Partner A">Partner A</option>
                  <option value="Partner B">Partner B</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Programme */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Programme</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-gray-600"
                  value={formData.programme}
                  onChange={(e) => setFormData({...formData, programme: e.target.value})}
                  required
                >
                  <option value="">Select Programme</option>
                  <option value="Social Development">Social Development</option>
                  <option value="Economic Development">Economic Development</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Assign Field Officer */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Assign Field Officer</label>
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-gray-600"
                  value={formData.fieldOfficer}
                  onChange={(e) => setFormData({...formData, fieldOfficer: e.target.value})}
                  required
                >
                  <option value="">Select Field Officer</option>
                  <option value="Officer A">Officer A</option>
                  <option value="Officer B">Officer B</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900">Description</label>
            <textarea 
              placeholder="Brief description about the project..."
              rows={4}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button 
              type="button"
              onClick={() => navigate('/po/programmes')}
              className="px-10 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-10 py-3 bg-[#3498db] text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
            >
              Add
            </button>
          </div>
        </form>
      </motion.div>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Project Added Successfully"
        description="The project has been successfully added under the selected programme."
        icon={Files}
        iconColor="text-blue-500"
        iconBg="bg-blue-50"
      />
    </div>
  );
};

export default AddNewProject;
