import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Sparkles, ChevronLeft, CheckCircle2 } from "lucide-react";

const MrGenerateReport = () => {
  const navigate = useNavigate();

  // Changed default to null so nothing is clicked at first
  const [type, setType] = useState(null); 
  const [year, setYear] = useState(null); 
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [programme, setProgramme] = useState("All Programme");
  const [project, setProject] = useState("All Project");
  const [officer, setOfficer] = useState("All Officer");
  const [format, setFormat] = useState("PDF Document");

  const [showSuccess, setShowSuccess] = useState(false);
  const user = { name: "Pema Tshoki", role: "MR Officer" };
  const years = ["2026", "2025", "2024", "2023"];

  const handleGenerate = () => {
    if (!type || !year) return;
    setShowSuccess(true);
  };

  const handleDone = () => {
    navigate("/mr/reports");
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/mr/reports")}
        className="flex items-center text-gray-400 mb-6 text-sm hover:text-blue-500 transition-colors"
      >
            <ChevronLeft size={16} />
            Back to Reports
          </button>

          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Sparkles className="text-blue-600" size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-bold text-gray-800">Generate Report</h1>
                <p className="text-sm text-gray-500">Configure and generate quarterly or annual reports</p>
             </div>
          </div>

          {/* STEP 1: CHOOSE REPORT */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#3B82F6] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">1</div>
              <h2 className="text-lg font-bold text-gray-800">Choose Report</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Quarterly Option */}
              <div
                onClick={() => setType("quarterly")}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  type === "quarterly" ? "border-blue-500 bg-blue-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${type === "quarterly" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                    <Calendar size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">Quarterly Report</h3>
                    <p className="text-sm text-gray-500">Progress for a specific quarter</p>
                  </div>
                  {type === "quarterly" && <CheckCircle2 className="text-blue-500 animate-in zoom-in duration-200" size={20} />}
                </div>
              </div>

              {/* Annual Option */}
              <div
                onClick={() => setType("annual")}
                className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                  type === "annual" ? "border-blue-500 bg-blue-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${type === "annual" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">Annual Report</h3>
                    <p className="text-sm text-gray-500">Full year overview & achievements</p>
                  </div>
                  {type === "annual" && <CheckCircle2 className="text-blue-500 animate-in zoom-in duration-200" size={20} />}
                </div>
              </div>
            </div>

            {/* YEAR SELECTION - Only styled as selected when clicked */}
            <div className="pt-4">
                <p className="text-sm font-semibold text-gray-500 mb-4 flex items-center gap-2">
                    <Calendar size={14} /> Select Year
                </p>
                <div className="flex flex-wrap gap-3">
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setYear(y)}
                      className={`px-6 py-2 rounded-xl border-2 font-medium transition-all ${
                        year === y ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-100 bg-white text-gray-500"
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
            </div>

            {type === "quarterly" && (
              <div className="pt-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-sm font-semibold text-gray-500 mb-4">Select Period</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full border-2 border-gray-100 p-3.5 rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full border-2 border-gray-100 p-3.5 rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 2: REPORT DETAILS - Shows only after a type is chosen */}
          <div className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8 transition-opacity duration-300 ${!type ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            <div className="flex items-center gap-3">
              <div className="bg-[#3B82F6] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">2</div>
              <h2 className="text-lg font-bold text-gray-800">Report Details</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Programme</label>
                <select className="w-full border-2 border-gray-100 p-3 rounded-xl bg-gray-50/50 outline-none focus:border-blue-500 transition-all" value={programme} onChange={(e) => setProgramme(e.target.value)}>
                    <option>All Programme</option>
                    <option>Social Development</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Project</label>
                <select className="w-full border-2 border-gray-100 p-3 rounded-xl bg-gray-50/50 outline-none focus:border-blue-500 transition-all" value={project} onChange={(e) => setProject(e.target.value)}>
                    <option>All Project</option>
                    <option>WASH</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Officer</label>
                <select className="w-full border-2 border-gray-100 p-3 rounded-xl bg-gray-50/50 outline-none focus:border-blue-500 transition-all" value={officer} onChange={(e) => setOfficer(e.target.value)}>
                    <option>All Officer</option>
                    <option>Sonam</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Format</label>
                <select className="w-full border-2 border-gray-100 p-3 rounded-xl bg-gray-50/50 outline-none focus:border-blue-500 transition-all" value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option>PDF Document</option>
                    <option>Excel</option>
                </select>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <button onClick={() => navigate("/mr/reports")} className="px-8 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!type || !year}
              className={`flex items-center justify-center gap-2 px-10 py-3 rounded-xl font-bold transition-all shadow-lg ${
                !type || !year 
                ? "bg-gray-300 cursor-not-allowed text-white shadow-none" 
                : "bg-[#3B82F6] hover:bg-blue-600 text-white shadow-blue-200"
              }`}
            >
              <Sparkles size={18} />
              Generate Report
            </button>
          </div>
      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="relative bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 text-center w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="text-purple-600" size={36} />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              Report Generated Successfully
            </h2>

            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Your report has been generated successfully and is ready to view or download.
            </p>

            <p
              onClick={handleDone}
              className="mt-6 text-blue-500 font-medium cursor-pointer text-sm hover:underline"
            >
              Go to Reports
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MrGenerateReport;