import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Filter, Layers, Mail, UserCircle2 } from "lucide-react";

const OfficerDetails = ({ role }) => {
  const [selectedYear, setSelectedYear] = useState("2021"); // Default year filter
  const { officerName } = useParams(); // Get officer name from URL
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Placeholder Officer Metadata (matching the header in image_25.png)
  const officerInfo = {
    name: officerName || "Phuntsho Wangmo",
    role: "Programme Officer",
    email: "phuntsho@tarayana.org.bt"
  };

  // Expanded dummy data matching the table requirements, segmented by year
  const officerRecordsByYear = {
    "2021": [
      { ID: "BN1001", PROJECTNAME: "Housing Improvement", DZONGKHAG: "Thimphu", GEWOG: "Kawang", YEAR: "2021" },
      { ID: "BN1002", PROJECTNAME: "Enterprise Dev", DZONGKHAG: "Paro", GEWOG: "Shaba", YEAR: "2021" },
      { ID: "BN1003", PROJECTNAME: "WASH", DZONGKHAG: "Punakha", GEWOG: "Guma", YEAR: "2021" },
      { ID: "BN1004", PROJECTNAME: "Food Systems", DZONGKHAG: "Trashigang", GEWOG: "Radhi", YEAR: "2021" },
      { ID: "BN1005", PROJECTNAME: "Scholarships", DZONGKHAG: "Mongar", GEWOG: "Chaskhar", YEAR: "2021" },
      { ID: "BN1006", PROJECTNAME: "Community Skilling", DZONGKHAG: "Thimphu", GEWOG: "Kawang", YEAR: "2021" },
    ],
    "2020": [
      { ID: "BN0980", PROJECTNAME: "Sustainable Agriculture", DZONGKHAG: "Chukha", GEWOG: "Phuntsholing", YEAR: "2020" },
      { ID: "BN0981", PROJECTNAME: "Craft Promotion", DZONGKHAG: "Bumthang", GEWOG: "Chhoekhor", YEAR: "2020" },
    ],
    // Add more years here as needed
  };

  // Get records for the currently selected year
  const currentRecords = officerRecordsByYear[selectedYear] || [];
  
  // Dynamic base path for back navigation
  const rootPath = pathname.split('/')[1];
  const archivesPath = `/${rootPath}/archives`;

  return (
    <div className="space-y-6">
      {/* Compact Back Button */}
      <button 
        onClick={() => navigate(archivesPath)}
        className="flex items-center text-gray-400 mb-6 text-sm hover:text-blue-500 transition-colors"
      >
            <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>

          {/* Refined Header Card */}
          <section className="flex items-center gap-4 bg-white p-4 rounded-[22px] shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center shrink-0 border border-gray-100">
                <UserCircle2 size={24} />
            </div>
            
            <div className="flex-1">
                <h1 className="text-base font-bold text-gray-800 tracking-tight leading-none">{officerInfo.name}</h1>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] font-medium text-gray-400">
                    <span className="flex items-center gap-1"><Layers size={10}/> {officerInfo.role}</span>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <span className="flex items-center gap-1"><Mail size={10}/> {officerInfo.email}</span>
                </div>
            </div>
          </section>

          {/* Year Filter Controls (Matches image_25.png) */}
          <section className="flex justify-start">
            <div className="relative">
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="pl-12 pr-12 py-3 text-sm font-bold text-gray-600 border border-gray-200 rounded-2xl bg-white outline-none cursor-pointer appearance-none shadow-sm focus:border-blue-400 transition-all"
              >
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
              </select>
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-xs pointer-events-none">▼</div>
            </div>
          </section>

          {/* Records Table (Matching image_25.png, Latitude removed) */}
          <section className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold border-b border-gray-50">
                  <tr>
                    <th className="px-6 py-5">ID</th>
                    {/* Latitude-Longitude Column Removed */}
                    <th className="px-6 py-5">Project Name</th>
                    <th className="px-6 py-5">Dzongkhag</th>
                    <th className="px-6 py-5">Gewog</th>
                    <th className="px-6 py-5 text-right">Year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentRecords.map((record, i) => (
                    <tr 
                      key={i} 
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold text-gray-600 tabular-nums">{record.ID}</td>
                      {/* Latitude-Longitude Data Cell Removed */}
                      <td className="px-6 py-4 font-bold text-gray-800">{record.PROJECTNAME}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{record.DZONGKHAG}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{record.GEWOG}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-400 tabular-nums">{record.YEAR}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Empty State when no records exist for the selected year */}
              {currentRecords.length === 0 && (
                <div className="p-16 text-center text-gray-400 text-xs italic">
                  No records found for {officerInfo.name} in {selectedYear}.
                </div>
              )}
            </div>
          </section>
        </div>
  );
};

export default OfficerDetails;