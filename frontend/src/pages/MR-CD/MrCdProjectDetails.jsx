import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Briefcase, MapPin, Clock, Calendar, Gift, DollarSign, User } from "lucide-react";

const MrCdProjectDetails = ({ role }) => {
  const { projectName, programmeName } = useParams();
  const navigate = useNavigate();

  // Project data organized for 2 rows, 3 columns
  const projectDetails = [
    { label: "Programme", val: "Social Development", icon: Briefcase },
    { label: "Dzongkhag", val: "Trashigang", icon: MapPin },
    { label: "Duration", val: "1 year", icon: Clock },
    { label: "End Date", val: "Dec 31, 2025", icon: Calendar },
    { label: "Donor", val: "UNDP", icon: Gift },
    { label: "Budget", val: "Nu. 12,000", icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-400 mb-6 text-sm hover:text-blue-500 transition-colors"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Social Development</span>
      </button>

      {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Briefcase size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                {projectName || "Climate & Disaster Resilient Housing Improvement"}
              </h1>
              <p className="text-xs font-medium text-gray-400 mt-0.5">120 Beneficiaries</p>
            </div>
          </div>

          {/* Project Information - 2 Rows, 3 Columns Layout */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-tight">Project information</h2>
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {projectDetails.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-4 p-5 border-gray-50 
                      ${(i + 1) % 3 !== 0 ? "lg:border-r" : ""} 
                      ${i < 3 ? "lg:border-b" : ""}
                      ${(i + 1) % 2 !== 0 ? "sm:max-lg:border-r" : ""}
                      ${i < 4 ? "sm:max-lg:border-b" : ""}
                      max-sm:border-b last:border-b-0`}
                  >
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {item.label}
                      </span>
                      <span className="text-sm font-bold text-gray-700">
                        {item.val}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Beneficiaries Table */}
          <section className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800 ml-1 uppercase tracking-tight">Beneficiaries</h2>
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-6 py-4">CID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Dzongkhag</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4 text-right">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-500 tabular-nums">1160500346{i}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                              <User size={14}/>
                            </div>
                            <span className="font-bold text-blue-600">Phuntsho Wangmo</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">Thimphu</td>
                        <td className="px-6 py-4 font-bold text-gray-700">Housing Improvement</td>
                        <td className="px-6 py-4 text-right text-gray-400 italic font-medium">Built water tank</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
  );
};

export default MrCdProjectDetails;