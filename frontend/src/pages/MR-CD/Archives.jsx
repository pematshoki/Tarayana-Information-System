
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Search, Filter, ChevronLeft, ChevronRight, User, FolderOpen } from "lucide-react";

const Archives = ({ role }) => {
  const [activeFilter, setActiveFilter] = useState("Programme");
  const [officerType, setOfficerType] = useState("All");
  const [selectedYear, setSelectedYear] = useState(2024);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const programmes = [
    { name: "Social Development", count: 12 },
    { name: "Economic Development", count: 12 },
    { name: "Environment & Climate", count: 12 },
    { name: "Research", count: 12 },
    { name: "Advocacy & Network", count: 12 },
    { name: "Tarayana Clubs", count: 12 },
  ];

  const allOfficers = [
    { name: "Phuntsho Wangmo", type: "Program Officer", count: 120 },
    { name: "Sangay Choden", type: "Field Officer", count: 85 },
    { name: "Tempel Gyeltshen", type: "Field Officer", count: 42 },
    { name: "Pema Tshoki", type: "Program Officer", count: 64 },
  ];

  // Updated dummy data to match your table requirements
  const yearlyRecords = {
    2024: [
      { ID: 1, PROJECTNAME: "Rural Housing Project", DZONGKHAG: "Thimphu", GEWOG: "Chang", YEAR: "2024" },
      { ID: 2, PROJECTNAME: "Water Management", DZONGKHAG: "Paro", GEWOG: "Wangchang", YEAR: "2024" },
    ],
    2023: [
      { ID: 3, PROJECTNAME: "Organic Farming Initiative", DZONGKHAG: "Punakha", GEWOG: "Kabisa", YEAR: "2023" },
      { ID: 4, PROJECTNAME: "Solar Lighting Install", DZONGKHAG: "Haa", GEWOG: "Katsho", YEAR: "2023" },
    ],
  };

  const filteredOfficers = officerType === "All" 
    ? allOfficers 
    : allOfficers.filter(off => off.type === officerType);

  const basePath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Records Repository</h1>
              <p className="text-[13px] text-gray-500 font-medium">View {activeFilter}s and associated data</p>
            </div>

            {/* Officer Filter Tabs */}
            {activeFilter === "Officer" && (
              <div className="flex bg-white border border-gray-100 p-1 rounded-full shadow-sm">
                {["All", "Program Officer", "Field Officer"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setOfficerType(tab)}
                    className={`px-4 py-1.5 text-[10px] font-bold rounded-full uppercase tracking-wider transition-all ${
                      officerType === tab ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}

            {/* Year Selector */}
            {activeFilter === "Year" && (
              <div className="flex items-center bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setSelectedYear(prev => prev - 1)}
                  className="p-2 hover:bg-gray-50 border-r border-gray-100 text-gray-400 transition-colors"
                >
                  <ChevronLeft size={14}/>
                </button>
                <span className="px-6 text-xs font-bold text-blue-600 tabular-nums">{selectedYear}</span>
                <button 
                  onClick={() => setSelectedYear(prev => prev + 1)}
                  className="p-2 hover:bg-gray-50 border-l border-gray-100 text-gray-400 transition-colors"
                >
                  <ChevronRight size={14}/>
                </button>
              </div>
            )}
          </div>

          {/* Search/Filter Bar */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder={`Search ${activeFilter.toLowerCase()}...`} 
                className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white transition-all shadow-sm" 
              />
            </div>
            <div className="relative">
              <select 
                value={activeFilter} 
                onChange={(e) => setActiveFilter(e.target.value)}
                className="pl-4 pr-10 py-2.5 text-xs border border-gray-200 rounded-xl bg-white outline-none cursor-pointer appearance-none font-bold text-gray-600 shadow-sm"
              >
                <option value="Programme">Programme</option>
                <option value="Officer">Officer</option>
                <option value="Year">Year</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>
          </div>

          {/* CONTENT AREA */}
          {activeFilter === "Programme" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {programmes.map((prog, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(`${basePath}/programme/${prog.name}`)}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <FileText size={22} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-2.5 py-1 rounded-lg">{prog.count} Projects</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{prog.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-bold border-b border-gray-50">
                  {activeFilter === "Officer" ? (
                    <tr>
                      <th className="px-8 py-5">Officer Name</th>
                      <th className="px-8 py-5">Designation</th>
                      <th className="px-8 py-5 text-right">Records</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-6 py-5">ID</th>
                      <th className="px-6 py-5">Project Name</th>
                      <th className="px-6 py-5">Dzongkhag</th>
                      <th className="px-6 py-5">Gewog</th>
                      <th className="px-6 py-5 text-right">Year</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(activeFilter === "Officer" ? filteredOfficers : (yearlyRecords[selectedYear] || [])).map((item, i) => (
                    <tr 
                      key={i} 
                      onClick={() => navigate(`${basePath}/${activeFilter.toLowerCase()}/${item.name || item.PROJECTNAME}`)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                    >
                      {activeFilter === "Officer" ? (
                        <>
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                                <User size={16}/>
                              </div>
                              <span className="font-bold text-gray-700">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-gray-400 font-bold uppercase text-[9px] tracking-tight">{item.type}</td>
                          <td className="px-8 py-4 text-right font-black text-gray-800 tabular-nums">{item.count}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 font-bold text-blue-600">{item.ID}</td>
                          <td className="px-6 py-4 font-bold text-gray-800">{item.PROJECTNAME}</td>
                          <td className="px-6 py-4 text-gray-500 font-medium">{item.DZONGKHAG}</td>
                          <td className="px-6 py-4 text-gray-500 font-medium">{item.GEWOG}</td>
                          <td className="px-6 py-4 text-right font-bold text-gray-400 tabular-nums">{item.YEAR}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeFilter === "Year" && (!yearlyRecords[selectedYear] || yearlyRecords[selectedYear].length === 0) && (
                <div className="p-16 text-center space-y-2">
                  <div className="flex justify-center"><FolderOpen className="text-gray-200" size={40}/></div>
                  <p className="text-gray-400 text-xs font-medium">No records found for the year {selectedYear}</p>
                </div>
              )}
            </div>
          )}
        </div>
  );
};

export default Archives;