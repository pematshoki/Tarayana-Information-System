import { useState, useEffect } from "react";
import { FileText, Eye, Download, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminReports = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Annual Impact Report 2025",
      type: "Annual",
      date: "Jan 10, 2026",
      fileUrl: "/dummy.pdf",
    },
    {
      id: 2,
      title: "Q4 2025 Operational Report",
      type: "Quarterly",
      date: "Jan 15, 2026",
      fileUrl: "/dummy.pdf",
    },
  ]);

  useEffect(() => {
    if (location.state?.newReport) {
      setReports((prev) => [location.state.newReport, ...prev]);
    }
  }, [location.state]);

  const handleView = (report) => window.open(report.fileUrl, "_blank");

  const handleDownload = (report) => {
    const link = document.createElement("a");
    link.href = report.fileUrl;
    link.download = report.title;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            System Reports
          </h1>
          <p className="text-xs sm:text-[13px] text-gray-500 font-medium">
            Administrative overview and organizational performance monitoring.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/generate-report")}
          className="flex items-center justify-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm w-full sm:w-auto"
        >
          <Sparkles size={18} />
          Generate New Report
        </button>
      </div>

      {/* REPORT LIST */}
      <div className="space-y-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="group flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 sm:p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            {/* LEFT CONTENT */}
            <div className="flex items-start sm:items-center gap-4 sm:gap-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-blue-500" size={22} />
              </div>

              <div className="break-words">
                <h3 className="font-semibold text-gray-800 text-sm sm:text-lg">
                  {r.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {r.type} <span className="mx-1 sm:mx-2">•</span> {r.date}
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end sm:justify-center gap-3">
              <button
                onClick={() => handleView(r)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Eye size={20} />
              </button>

              <button
                onClick={() => handleDownload(r)}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
