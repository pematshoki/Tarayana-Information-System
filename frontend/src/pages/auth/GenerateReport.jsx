import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Sparkles } from "lucide-react";

const GenerateReport = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [programme, setProgramme] = useState("All Programmes");
  const [format, setFormat] = useState("PDF Document");
  const [programmes, setProgrammes] = useState([]);
const [projects, setProjects] = useState([]);
const [openProject, setOpenProject] = useState(false);
const [selectedProgrammes, setSelectedProgrammes] = useState([]);
const [selectedProjects, setSelectedProjects] = useState([]);
const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [users, setUsers] = useState([]);
const [selectedUsers, setSelectedUsers] = useState([]);
const [openUsers, setOpenUsers] = useState(false);
useEffect(() => {
  fetch("http://localhost:5000/api/programmes")
    .then((res) => res.json())
    .then((data) => {
      setProgrammes(data.programmes || []);
    })
    .catch((err) => {
      console.error(err);
      setProgrammes([]);
    });
}, []);
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/users");
      const data = await res.json();

      const allUsers = data.users || data.data || data || [];

      const filtered = allUsers.filter((u) => {
        const roleName =
          u.roleId?.roleName || u.roleId?.name || u.roleId?.code;

        return (
          roleName === "ProgrammeOfficer" ||
          roleName === "FieldOfficer"
        );
      });

      setUsers(filtered);
      console.log(filtered)
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  fetchUsers();
}, []);
  const years = ["2026", "2025", "2024", "2023"];
useEffect(() => {
  const fetchProjects = async () => {
    try {
      let allProjects = [];

      // ✅ CASE 1: No programme selected → fetch ALL
      if (selectedProgrammes.length === 0) {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();

        allProjects = data.projects || data.data || data;
      }

      // ✅ CASE 2: One or more programmes → fetch individually
      else {
        const requests = selectedProgrammes.map((id) =>
          fetch(`http://localhost:5000/api/projects/programme/${id}`)
            .then((res) => res.json())
        );

        const results = await Promise.all(requests);

        // flatten all responses
        allProjects = results.flatMap((res) =>
          res.projects || res.data || res
        );
      }

      // ✅ REMOVE DUPLICATES (important)
      const uniqueProjects = Array.from(
        new Map(allProjects.map((p) => [p._id, p])).values()
      );

      setProjects(uniqueProjects);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  fetchProjects();
  setSelectedProjects([]);
}, [selectedProgrammes]);
  // 👉 restrict dates to selected year
  const getMinDate = () => (year ? `${year}-01-01` : "");
  const getMaxDate = () => (year ? `${year}-12-31` : "");

  const handleGenerate = async () => {
  if (!type || !year) return;
  if (type === "quarterly" && (!fromDate || !toDate)) return;

  try {
    setLoading(true);

    const token = localStorage.getItem("token");

  const payload = {
  type,
  year,
  fromDate: type === "quarterly" ? fromDate : null,
  toDate: type === "quarterly" ? toDate : null,

  programmes: selectedProgrammes,   // ✅ FIXED

  projects: selectedProjects,       // (you already have this state)
  dzongkhags: [],
  officers: selectedUsers,

  format: format === "PDF Document" ? "pdf" : "excel",
};

    const res = await fetch(
      "http://localhost:5000/api/report/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Report generation failed");
      return;
    }

    // 🔥 FILE DOWNLOAD HANDLING
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    a.download =
      format === "PDF Document"
        ? `report-${year}.pdf`
        : `report-${year}.xlsx`;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

    setShowSuccess(true);
  } catch (err) {
    console.error(err);
    alert("Server error while generating report");
  } finally {
    setLoading(false);
  }
};

  const handleDone = () => {
    navigate("/reports");
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

        <div className="p-4 md:p-6 pt-20 space-y-6 max-w-6xl mx-auto">
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
             <div className="relative">
  {/* Trigger */}
  <div
    onClick={() => setOpen(!open)}
    className="border p-3 rounded-lg cursor-pointer bg-white"
  >
   {
  selectedProgrammes.length === 0
    ? "All Programmes"
    : programmes
        .filter(p => selectedProgrammes.includes(p._id))
        .map(p => p.programmeName)
        .join(", ")
}
  </div>

  {/* Dropdown */}
  {open && (
    <div className="absolute z-10 bg-white border rounded-lg mt-2 w-full shadow max-h-60 overflow-y-auto">
      
      <label className="flex gap-2 p-2">
        <input
          type="checkbox"
          checked={selectedProgrammes.length === 0}
          onChange={() => setSelectedProgrammes([])}
        />
        All Programmes
      </label>

      {programmes.map((p) => (
        <label key={p._id} className="flex gap-2 p-2">
          <input
            type="checkbox"
            checked={selectedProgrammes.includes(p._id)}
            onChange={() =>
              setSelectedProgrammes((prev) =>
                prev.includes(p._id)
                  ? prev.filter((id) => id !== p._id)
                  : [...prev, p._id]
              )
            }
          />
          {p.programmeName}
        </label>
      ))}
    </div>
  )}
</div>
              <div className="relative">
  <div
    onClick={() => setOpenProject(!openProject)}
    className="border p-3 rounded-lg cursor-pointer bg-white"
  >
 {
  selectedProjects.length === 0
    ? "All Projects"
    : projects
        .filter(p => selectedProjects.includes(p._id))
        .map(p => p.projectName || p.name)
        .join(", ")
}
  </div>

  {openProject && (
    <div className="absolute z-10 bg-white border rounded-lg mt-2 w-full max-h-60 overflow-y-auto shadow">
      
      {/* ALL */}
      <label className="flex items-center gap-2 p-2 hover:bg-gray-50">
        <input
          type="checkbox"
          checked={selectedProjects.length === 0}
          onChange={() => setSelectedProjects([])}
        />
        All Projects
      </label>

      {/* PROJECTS */}
      {Array.isArray(projects) &&
        projects.map((proj) => (
          <label key={proj._id} className="flex items-center gap-2 p-2 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={selectedProjects.includes(proj._id)}
              onChange={() =>
                setSelectedProjects((prev) =>
                  prev.includes(proj._id)
                    ? prev.filter((id) => id !== proj._id)
                    : [...prev, proj._id]
                )
              }
            />
            {proj.projectName || proj.name}
          </label>
        ))}
    </div>
  )}
</div>
               <div className="relative">
  {/* TRIGGER */}
  <div
    onClick={() => setOpenUsers(!openUsers)}
    className="border p-3 rounded-lg cursor-pointer bg-white"
  >
    {selectedUsers.length === 0
      ? "All Officers"
      : users
          .filter(u => selectedUsers.includes(u._id))
          .map(u => u.email)
          .join(", ")}
  </div>

  {/* DROPDOWN */}
  {openUsers && (
    <div className="absolute z-10 bg-white border rounded-lg mt-2 w-full shadow max-h-60 overflow-y-auto">

      {/* ALL */}
      <label className="flex items-center gap-2 p-2">
        <input
          type="checkbox"
          checked={selectedUsers.length === 0}
          onChange={() => setSelectedUsers([])}
        />
        All Officers
      </label>

      {/* USERS */}
      {Array.isArray(users) &&
        users.map((u) => (
          <label key={u._id} className="flex items-center gap-2 p-2">
            <input
              type="checkbox"
              checked={selectedUsers.includes(u._id)}
              onChange={() =>
                setSelectedUsers((prev) =>
                  prev.includes(u._id)
                    ? prev.filter((id) => id !== u._id)
                    : [...prev, u._id]
                )
              }
            />
            {u.email}
          </label>
        ))}
    </div>
  )}
</div>

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

            {/* <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg"
            >
              <Sparkles size={18} />
              Generate Report
            </button> */}
            <button
  onClick={handleGenerate}
  disabled={loading}
  className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2 rounded-lg disabled:opacity-50"
>
  <Sparkles size={18} />
  {loading ? "Generating..." : "Generate Report"}
</button>
          </div>
        </div>
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