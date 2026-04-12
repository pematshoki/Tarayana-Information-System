import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { FileText } from "lucide-react";

const ProjectDetail = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH PROJECT
  // =========================
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/projects/summary/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        console.log(data)

        if (!res.ok) {
          console.error(data.message);
          return;
        }

        setProject(data.project);
        setBeneficiaries(data.beneficiaryList || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // =========================
  // FETCH BENEFICIARIES
  // =========================
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost:5000/api/beneficiaries/project/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
  console.log(data)
        if (!res.ok) return;

        setBeneficiaries(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBeneficiaries();
  }, [id]);

  // =========================
  // PROJECT INFO STRUCTURE
  // =========================
const projectInfo = [
  { label: "Programme", value: project?.programme?.programmeName },
  { label: "Project Name", value: project?.projectName },
  { label: "Field Officer", value: project?.fieldOfficer?.email },
  { label: "Start Date", value: project?.startDate },
  { label: "End Date", value: project?.endDate },
  { label: "Donor", value: project?.donor?.map(d => d.name).join(", ") },
  { label: "Partner", value: project?.partner?.map(p => p.name).join(", ") },
  { label: "Dzongkhag", value: project?.dzongkhag?.join(", ") },
];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`transition-all duration-300 ${
          collapsed ? "md:ml-[75px]" : "md:ml-[265px]"
        }`}
      >
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-20 space-y-6">

          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to Programme
          </button>

          {/* PROJECT HEADER */}
          <div className="bg-white rounded-xl p-5 shadow">
            <h2 className="text-lg md:text-xl font-semibold">
              {project?.projectName }
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {project?.description }
            </p>
          </div>

          {/* PROJECT INFO */}
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-semibold text-gray-700 mb-4">
              Project information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectInfo.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium">
                      {item.value ?? "-"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BENEFICIARIES TABLE */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="font-semibold text-gray-700 mb-4">
              Beneficiaries
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1100px]">

                <thead>
                  <tr className="text-gray-500 border-b text-left">
                    <th className="py-3 px-3">CID</th>
                    <th className="px-3">Name</th>
                    <th className="px-3">Gender</th>
                    <th className="px-3">Dzongkhag</th>
                    <th className="px-3">Village</th>
                    <th className="px-3">Gewog</th>
                    <th className="px-3">House No</th>
                    <th className="px-3">Thram No</th>
                    <th className="px-3">Indirect Beneficiaries</th>
                
                  </tr>
                </thead>

                <tbody>
                  {beneficiaries.map((b, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td>{b.cid}</td>
                    <td>{b.name }</td>
                      <td>{b.gender}</td>
                      <td>{b.dzongkhag}</td>
                      <td>{b.village}</td>
                      <td>{b.gewog}</td>
                      <td>{b.houseNo}</td>
                      <td>{b.thramNo}</td>
                     
                      <td>M: {b.indirectBeneficiaries.male}  F:{b.indirectBeneficiaries.female}</td>
                      {/* <td>{b.support || "-"}</td> */}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;