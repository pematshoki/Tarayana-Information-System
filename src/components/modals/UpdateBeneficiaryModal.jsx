import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';

const UpdateBeneficiaryModal = ({ isOpen, onClose, onUpdate, beneficiary }) => {
  const [formData, setFormData] = useState({
    name: '',
    cid: '',
    phoneNumber: '',
    dzongkhag: '',
    village: '',
    gewog: '',
    project: '',
    supportDetails: ''
  });

  useEffect(() => {
    if (beneficiary) {
      setFormData({
        name: beneficiary.name || '',
        cid: beneficiary.cid || '',
        phoneNumber: beneficiary.phoneNumber || '',
        dzongkhag: beneficiary.dzongkhag || '',
        village: beneficiary.village || '',
        gewog: beneficiary.gewog || '',
        project: beneficiary.project || '',
        supportDetails: beneficiary.supportDetails || ''
      });
    }
  }, [beneficiary]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 pb-0 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Update Beneficiary Details</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* CID */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">CID</label>
                  <input 
                    type="text"
                    value={formData.cid}
                    onChange={(e) => setFormData({...formData, cid: e.target.value})}
                    placeholder="Enter CID"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter Name"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Phone Number</label>
                  <input 
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="Enter Phone Number"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Dzongkhag */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Dzongkhag</label>
                  <div className="relative">
                    <select 
                      value={formData.dzongkhag}
                      onChange={(e) => setFormData({...formData, dzongkhag: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select Dzongkhag</option>
                      <option value="Thimphu">Thimphu</option>
                      <option value="Paro">Paro</option>
                      <option value="Punakha">Punakha</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Village */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Village</label>
                  <input 
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({...formData, village: e.target.value})}
                    placeholder="Enter Village"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Gewog */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Gewog</label>
                  <input 
                    type="text"
                    value={formData.gewog}
                    onChange={(e) => setFormData({...formData, gewog: e.target.value})}
                    placeholder="Enter Gewog"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Project */}
                <div className="space-y-2 md:col-span-1">
                  <label className="text-sm font-bold text-gray-900">Project</label>
                  <div className="relative">
                    <select 
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="">select project</option>
                      <option value="Housing Improvement">Housing Improvement</option>
                      <option value="Enterprise Dev">Enterprise Dev</option>
                      <option value="WASH">WASH</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Empty space to match layout if needed, but screenshot shows Project taking half width then Support Details full width */}
                <div className="hidden md:block"></div>

                {/* Support Details */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-900">Support Details</label>
                  <textarea 
                    value={formData.supportDetails}
                    onChange={(e) => setFormData({...formData, supportDetails: e.target.value})}
                    placeholder="Enter support details..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-10 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-all border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 px-10 bg-[#3498db] text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
                >
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateBeneficiaryModal;
