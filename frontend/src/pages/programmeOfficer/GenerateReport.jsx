import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  ClipboardList, 
  Calendar, 
  FileText, 
  Download, 
  ChevronDown 
} from 'lucide-react';
import { motion } from 'motion/react';

const GenerateReport = () => {
  const navigate = useNavigate();
  const onBackClick = () => {
    navigate('/reports');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <button 
        onClick={() => navigate('/reports')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} />
        <span>Back to Reports</span>
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
          <Sparkles size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Generate Report</h3>
          <p className="text-sm text-gray-400">Configure and generate quarterly or annual reports</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <h4 className="font-bold text-gray-900">Choose Report</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/30 flex items-center gap-4 cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 border border-gray-100 shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Quarterly Report</p>
                <p className="text-xs text-gray-400">Progress for a specific quarter</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-all flex items-center gap-4 cursor-pointer">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-600 border border-gray-100 shadow-sm">
                <ClipboardList size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Annual Report</p>
                <p className="text-xs text-gray-400">Full year overview & achievements</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Calendar size={14} />
              Select Year
            </p>
            <div className="flex flex-wrap gap-3">
              {[2026, 2025, 2024, 2023].map((year) => (
                <label key={year} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-white hover:border-blue-200 transition-all group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500" defaultChecked={year === 2026} />
                  <span className="text-sm font-bold text-gray-600 group-hover:text-gray-900">{year}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <h4 className="font-bold text-gray-900">Report Details</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                Project
              </label>
              <div className="relative">
                <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>All Project</option>
                  <option>Housing Improvement</option>
                  <option>Water Project</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Download size={14} />
                Format
              </label>
              <div className="relative">
                <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                  <option>PDF Document</option>
                  <option>Excel Spreadsheet</option>
                  <option>CSV File</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button 
            onClick={onBackClick}
            className="px-8 py-2.5 bg-gray-50 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all border border-gray-200"
          >
            Cancel
          </button>
          <button className="flex items-center gap-2 px-8 py-2.5 bg-[#3498db] text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 font-bold">
            <Sparkles size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GenerateReport;
