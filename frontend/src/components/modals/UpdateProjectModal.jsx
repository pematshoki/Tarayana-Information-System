import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, ChevronDown } from 'lucide-react';

const UpdateProjectModal = ({ isOpen, onClose, onUpdate, project }) => {
  const [formData, setFormData] = useState({
    name: '',
    dzongkhag: '',
    duration: '1 year',
    endDate: '20/06/2021',
    donor: '',
    programme: '',
    longitude: '',
    latitude: '',
    description: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        ...formData,
        name: project.name || '',
        dzongkhag: project.dzongkhag || '',
        // Other fields might not be in mockData, so we use defaults or empty
      });
    }
  }, [project]);

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
            className="relative bg-white rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-gray-50">
              <h3 className="text-2xl font-bold text-gray-900">Update Project Details</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Project Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Housing"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Dzongkhag */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Dzongkhag</label>
                  <input 
                    type="text"
                    value={formData.dzongkhag}
                    onChange={(e) => setFormData({...formData, dzongkhag: e.target.value})}
                    placeholder="Thimphu"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Duration</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="1 year"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      placeholder="20/06/2021"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>

                {/* Donor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Donor</label>
                  <input 
                    type="text"
                    value={formData.donor}
                    onChange={(e) => setFormData({...formData, donor: e.target.value})}
                    placeholder="Enter Donor"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Programme */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Programme</label>
                  <div className="relative">
                    <select 
                      value={formData.programme}
                      onChange={(e) => setFormData({...formData, programme: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                    >
                      <option value="">Select Programme</option>
                      <option value="Social Development">Social Development</option>
                      <option value="Economic Development">Economic Development</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Longitude */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Longitude</label>
                  <input 
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="Enter Longitude"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>

                {/* Latitude */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Latitude</label>
                  <input 
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="Enter Latitude"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description about the project..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-6 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-[#3498db] text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200"
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

export default UpdateProjectModal;
