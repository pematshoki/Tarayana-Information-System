import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { FileText, Eye, Download, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {  useEffect } from "react";

const Reports = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const [reports, setReports] = useState([
    {
      id: 1,
      title: "Q4 2025 Progress Report",
      type: "Quarterly",
      date: "Jan 15, 2026",
      fileUrl: "/dummy.pdf",
    },
    {
      id: 2,
      title: "Annual Report 2025",
      type: "Annual",
      date: "Jan 15, 2026",
      fileUrl: "/dummy.pdf",
    },
    {
      id: 3,
      title: "Q1 2026 Progress Report",
      type: "Quarterly",
      date: "Jan 15, 2026",
      fileUrl: "/dummy.pdf",
    },
  ]);

  const location = useLocation();

useEffect(() => {
  if (location.state?.newReport) {
    setReports((prev) => [location.state.newReport, ...prev]);
  }
}, [location.state]);


  // 👁 VIEW REPORT
  const handleView = (report) => {
    window.open(report.fileUrl, "_blank");
  };

  // ⬇ DOWNLOAD REPORT
  const handleDownload = (report) => {
    const link = document.createElement("a");
    link.href = report.fileUrl;
    link.download = report.title;
    link.click();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "md:ml-[75px]" : "md:ml-[265px]"
        }`}
      >
        <Navbar collapsed={collapsed} />

        <div className="p-4 md:p-6 pt-24 md:pt-28">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Reports & M&E
              </h1>
              <p className="text-sm text-gray-500">
                Monitoring, evaluation & reporting
              </p>
            </div>

            <button
              onClick={() => navigate("/generatereport")}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
            >
              <Sparkles size={18} />
              Generate Report
            </button>
          </div>

          {/* REPORT LIST */}
          <div className="bg-white rounded-2xl shadow p-4 space-y-4">
            <h2 className="text-md font-semibold text-gray-700">
              Generated Reports
            </h2>

            {reports.map((r) => (
              <div
                key={r.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-xl hover:shadow-md transition"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-800">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {r.type} • {r.date}
                    </p>
                  </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex gap-4 text-gray-500">
                  <Eye
                    onClick={() => handleView(r)}
                    className="cursor-pointer hover:text-blue-600"
                  />
                  <Download
                    onClick={() => handleDownload(r)}
                    className="cursor-pointer hover:text-green-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;