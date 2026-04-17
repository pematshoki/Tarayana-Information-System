import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Sparkles } from "lucide-react";

const GenerateReport = () => {
  const navigate = useNavigate();

  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [programme, setProgramme] = useState("All Programmes");
  const [format, setFormat] = useState("PDF Document");

  const [showSuccess, setShowSuccess] = useState(false);

  const years = ["2026", "2025", "2024", "2023"];

  // 👉 restrict dates to selected year
  const getMinDate = () => (year ? `${year}-01-01` : "");
  const getMaxDate = () => (year ? `${year}-12-31` : "");

  const handleGenerate = () => {
    if (!type || !year) return;
    if (type === "quarterly" && (!fromDate || !toDate)) return;

    setShowSuccess(true);
  };

  const handleDone = () => {
    navigate("/reports");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
          {/* BACK */}
          <button
            onClick={() => navigate("/reports")}
            className="text-sm text-gray-600"
          >
            ← Back to Reports
          </button>

          {/* TITLE */}
          <div>
            <h1 className="text-xl font-semibold">Generate Report</h1>
            <p className="text-sm text-gray-500">
              Configure and generate quarterly or annual reports
            </p>
          </div>

          {/* STEP 1 */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm">
                1
              </div>
              <h2 className="font-semibold">Choose Report</h2>
            </div>

            {/* TYPE */}
            <div className="grid md:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setType("quarterly");
                  setFromDate("");
                  setToDate("");
                }}
                className={`p-4 rounded-xl border cursor-pointer ${
                  type === "quarterly"
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar />
                  <div>
                    <h3 className="font-medium">Quarterly Report</h3>
                    <p className="text-sm text-gray-500">
                      Progress for a specific quarter
                    </p>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setType("annual")}
                className={`p-4 rounded-xl border cursor-pointer ${
                  type === "annual"
                    ? "border-blue-500 bg-blue-50"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText />
                  <div>
                    <h3 className="font-medium">Annual Report</h3>
                    <p className="text-sm text-gray-500">
                      Full year overview & achievements
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* YEAR (checkbox style like image) */}
            {type && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Select Year
                </p>

                <div className="flex flex-wrap gap-3">
                  {years.map((y) => (
                    <label
                      key={y}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer ${
                        year === y
                          ? "border-blue-500 bg-blue-50"
                          : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={year === y}
                        onChange={() => setYear(y)}
                      />
                      {y}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* DATE RANGE */}
            {type === "quarterly" && year && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Select Period
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* FROM */}
                  <input
                    type="date"
                    value={fromDate}
                    min={getMinDate()}
                    max={toDate || getMaxDate()}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="border p-3 rounded-lg"
                  />

                  {/* TO */}
                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || getMinDate()}
                    max={getMaxDate()}
                    onChange={(e) => setToDate(e.target.value)}
                    className="border p-3 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* STEP 2 */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-5">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white w-7 h-7 flex items-center justify-center rounded-full text-sm">
                2
              </div>
              <h2 className="font-semibold">Report Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                className="border p-3 rounded-lg"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
              >
                <option>All Programmes</option>
                <option>WASH</option>
                <option>Housing</option>
              </select>

              <select
                className="border p-3 rounded-lg"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option>PDF Document</option>
                <option>Excel</option>
              </select>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => navigate("/reports")}
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg"
            >
              <Sparkles size={18} />
              Generate Report
            </button>
          </div>

      {/* ✅ SUCCESS MODAL (MATCHED SIZE & STYLE) */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          <div className="relative bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 text-center w-full max-w-md">
            
            {/* ICON */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                <Sparkles className="text-purple-600" size={36} />
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              Report Generated Successfully
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Your report has been generated successfully and is
              ready to view or download.
            </p>

            {/* TEXT ONLY (no button) */}
            <p
              onClick={handleDone}
              className="mt-4 text-blue-500 cursor-pointer text-sm"
            >
              Go to Reports
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReport;