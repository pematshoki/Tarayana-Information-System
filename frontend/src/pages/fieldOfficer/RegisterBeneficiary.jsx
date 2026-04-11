import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Plus, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';
import SuccessModal from '../../components/modals/SuccessModal';

const RegisterBeneficiary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const isPO = location.pathname.startsWith('/po');
  const backPath = isPO ? '/po/beneficiaries' : '/beneficiaries';

  const handleRegister = () => {
    setIsSuccessModalOpen(true);
    setTimeout(() => {
      setIsSuccessModalOpen(false);
      navigate(backPath);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <button 
        onClick={() => navigate(backPath)}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        <span>Back to Beneficiaries</span>
      </button>

      <div>
        <h3 className="text-xl font-bold text-gray-900">Register New Beneficiary</h3>
        <p className="text-sm text-gray-400">Fill in the Details to register a new Beneficiary</p>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">CID Number</label>
              <input type="text" placeholder="Enter CID Number" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Name</label>
              <input type="text" placeholder="Enter Name" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Date of Birth</label>
              <input type="date" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Dzongkhag</label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-500">
                  <option>Enter Dzongkhag</option>
                  <option>Thimphu</option>
                  <option>Paro</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Village</label>
              <input type="text" placeholder="Enter Village" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Gewog</label>
              <input type="text" placeholder="Enter Gewog" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">House No</label>
              <input type="text" placeholder="Enter House No" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Thram No</label>
              <input type="text" placeholder="Enter Thram No" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Project</label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-500">
                  <option>Select Project</option>
                  <option>Housing Improvement</option>
                  <option>Water Project</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Phone Number</label>
              <input type="text" placeholder="Enter Phone Number" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>
        </div>

        {/* Indirect Beneficiaries & Support Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Indirect Beneficiaries</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Male :</span>
                <input type="number" defaultValue={0} className="w-20 text-center bg-gray-50 border-none focus:ring-0 text-sm font-bold" />
              </div>
              <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                <span className="text-sm font-medium text-gray-600">Female :</span>
                <input type="number" defaultValue={0} className="w-20 text-center bg-gray-50 border-none focus:ring-0 text-sm font-bold" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Support Details</h4>
            <textarea 
              placeholder="Enter support details.." 
              rows={5}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button 
            onClick={() => navigate(backPath)}
            className="px-12 py-2.5 bg-white text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all border border-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleRegister}
            className="flex items-center gap-2 px-12 py-2.5 bg-[#3498db] text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 font-bold"
          >
            <Plus size={20} />
            <span>Register</span>
          </button>
        </div>
      </div>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message="Beneficiary Registered Successfully"
        description="The new beneficiary has been successfully added to the system."
        icon={UserPlus}
        iconColor="text-blue-500"
        iconBg="bg-blue-50"
      />
    </motion.div>
  );
};

export default RegisterBeneficiary;
