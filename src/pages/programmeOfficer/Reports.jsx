import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Sparkles, Eye, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { reportsData } from '../../data/mockData';

const Reports = () => {
  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report & M&E</h1>
          <p className="text-sm text-gray-400">Recent reports & exports</p>
        </div>
        <Link 
          to="/po/reports/generate"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3498db] text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 font-bold text-sm"
        >
          <Sparkles size={18} />
          <span>Generate Report</span>
        </Link>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reportsData.map((report, index) => (
          <motion.div 
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <BarChart3 size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{report.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">{report.type}</span>
                  <span className="text-xs text-gray-400">{report.date}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-500 rounded-xl transition-all">
                <Eye size={20} />
              </button>
              <button className="p-2 hover:bg-green-50 text-gray-400 hover:text-green-500 rounded-xl transition-all">
                <Download size={20} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
