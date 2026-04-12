// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Sidebar from "../../components/Sidebar";
// import Navbar from "../../components/Navbar";
// import { Users, FileText, MapPin, BarChart3 } from "lucide-react";

// const ProgrammeDetail = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Dummy Programme Name Mapping
//   const programmeNames = {
//     1: "Social Development",
//     2: "Economic Development",
//     3: "Environment & Climate",
//   };

//   // Dummy Projects Data
//   const projectsData = [
//     {
//       id: 1,
//       cid: "BN1001",
//       location: "27.4721-89.6390",
//       name: "Housing Improvement",
//       dzongkhag: "Thimphu",
//       gewog: "Kawang",
//       year: 2020,
//     },
//     {
//       id: 2,
//       cid: "BN1002",
//       location: "27.4856-89.6542",
//       name: "Enterprise Dev",
//       dzongkhag: "Paro",
//       gewog: "Shaba",
//       year: 2020,
//     },
//     {
//       id: 3,
//       cid: "BN1003",
//       location: "27.8035-91.6894",
//       name: "WASH",
//       dzongkhag: "Punakha",
//       gewog: "Guma",
//       year: 2019,
//     },
//   ];

//   return (
//     <div className="bg-gray-100 min-h-screen">
//       {/* Sidebar */}
//       <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//       {/* Main */}
//       <div
//         className={`transition-all duration-300 ${
//           collapsed ? "md:ml-[75px]" : "md:ml-[265px]"
//         }`}
//       >
//         <Navbar collapsed={collapsed} />

//         <div className="p-6 pt-20 space-y-6">
//           {/* BACK */}
//           <button
//             onClick={() => navigate("/programmes")}
//             className="text-sm text-gray-500"
//           >
//             ← Back to programmes
//           </button>

//           {/* TITLE */}
//           <div>
//             <h2 className="text-xl font-semibold">
//               {programmeNames[id] || "Programme"}
//             </h2>
//             <p className="text-gray-500 text-sm mt-1">
//               Improving living conditions through housing, WASH, food security,
//               scholarships, and surgical camps.
//             </p>
//           </div>

//           {/* KPI CARDS */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[
//               {
//                 title: "Beneficiaries",
//                 value: "4294",
//                 icon: <Users />,
//                 color: "bg-blue-100 text-blue-600",
//               },
//               {
//                 title: "Projects",
//                 value: "12",
//                 icon: <FileText />,
//                 color: "bg-green-100 text-green-600",
//               },
//               {
//                 title: "Dzongkhags",
//                 value: "15",
//                 icon: <MapPin />,
//                 color: "bg-yellow-100 text-yellow-600",
//               },
//               {
//                 title: "Budget",
//                 value: "Nu. 42,000",
//                 icon: <BarChart3 />,
//                 color: "bg-purple-100 text-purple-600",
//               },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow p-5 flex justify-between items-center hover:shadow-lg transition"
//               >
//                 <div>
//                   <p className="text-sm text-gray-500">{item.title}</p>
//                   <h2 className="text-xl font-semibold mt-2">
//                     {item.value}
//                   </h2>
//                 </div>
//                 <div className={`p-3 rounded-lg ${item.color}`}>
//                   {item.icon}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* PROJECT TABLE */}
//           <div className="bg-white rounded-xl shadow p-5">
//             <h3 className="font-semibold text-gray-700 mb-4">
//               Projects
//             </h3>

//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-gray-500 border-b">
//                   <th className="text-left py-2">Project Name</th>
//                   <th className="text-left">Dzongkhag</th>
//                   <th className="text-left">Start Date</th>
//                   <th className="text-left">End Date</th>
//                   <th className="text-left">Donor</th>
//                   <th className="text-left">Partner</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {projectsData.map((p) => (
//                   <tr key={p.id} className="border-b hover:bg-gray-50">
//                     <td className="py-3">{p.cid}</td>

//                     <td className="text-blue-500 cursor-pointer">
//                       {p.location}
//                     </td>

//                     {/* CLICKABLE PROJECT NAME */}
//                     <td
//                       onClick={() => navigate(`/projects/${p.id}`)}
//                       className="text-blue-600 cursor-pointer hover:underline"
//                     >
//                       {p.name}
//                     </td>

//                     <td>{p.dzongkhag}</td>
//                     <td>{p.gewog}</td>
//                     <td>{p.year}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* KEY ACTIVITIES (OPTIONAL like image) */}
//           {/* <div>
//             <h3 className="font-semibold text-gray-700">
//               Key Activities
//             </h3>
//             <p className="text-sm text-gray-500">
//               Under this programme
//             </p>
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProgrammeDetail;



import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Users, FileText, MapPin, BarChart3 } from "lucide-react";
import { useEffect } from "react";

const ProgrammeDetail = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
const [projects, setProjects] = useState([]);
const [Beneficiaries, setBeneficiaries] = useState([]);

  const [programme, setProgramme] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
useEffect(() => {
  const fetchProgramme = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/programmes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load programme");
        return;
      }

      setProgramme(data.programme);

    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  fetchProgramme();
}, [id]);
const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/projects/programme/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

    setProjects(data.projects);

  } catch (err) {
    console.error(err);
  }
};
const fetchBeneficiaries = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/beneficiaries/project/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error(data.message);
      return;
    }

     setBeneficiaries(data.count);

  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchProjects(); 
   fetchBeneficiaries();
}, [id]);

const uniqueDzongkhags = [
  ...new Set(
    projects.flatMap((p) => p.dzongkhag || [])
  ),
];

const dzongkhagCount = uniqueDzongkhags.length;

return (
  
    <div className="bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      
      <div
        className={`transition-all duration-300 ${
          collapsed ? "md:ml-[75px]" : "md:ml-[265px]"
        }`}
      >
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-20 space-y-6 ">

          {/* BACK */}
          <button
            onClick={() => navigate("/programmes")}
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to programmes
          </button>
  
          {/* TITLE */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">
              {programme?.programmeName }
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              {programme?.programmeDescription}
            </p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                title: "Beneficiaries",
                value: Beneficiaries,
                icon: <Users />,
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Projects",
                value: projects.length,
                icon: <FileText />,
                color: "bg-green-100 text-green-600",
              },
              {
                title: "Dzongkhags",
                value: dzongkhagCount,
                icon: <MapPin />,
                color: "bg-yellow-100 text-yellow-600",
              },
              // {
              //   title: "Budget",
              //   value: "Nu. 42,000",
              //   icon: <BarChart3 />,
              //   color: "bg-purple-100 text-purple-600",
              // },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow p-4 md:p-5 flex justify-between items-center hover:shadow-lg transition"
              >
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="text-lg md:text-xl font-semibold mt-2">
                    {item.value}
                  </h2>
                </div>
                <div className={`p-3 rounded-lg ${item.color}`}>
                  {item.icon}
                </div>
              </div>
            ))}
          </div>

          {/* PROJECT TABLE */}
          <div className="bg-white rounded-xl shadow p-4 md:p-5">

            <h3 className="font-semibold text-gray-700 mb-4">
              Projects
            </h3>

            {/* ✅ RESPONSIVE TABLE WRAPPER */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">

                <thead>
                  <tr className="text-gray-500 border-b text-left">
                    <th className="py-3 px-3">Project Name</th>
                    <th className="px-3">Dzongkhag</th>
                    <th className="px-3">Start Date</th>
                    <th className="px-3">End Date</th>
                    <th className="px-3">Donor</th>
                    <th className="px-3">Partner</th>
                  </tr>
                </thead>
<tbody>
  {projects.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center py-6 text-gray-400">
        No projects found
      </td>
    </tr>
  ) : (
    projects.map((p) => (
      <tr
        key={p._id}
        className="border-b hover:bg-gray-50 transition"
      >
        <td
          onClick={() => navigate(`/projects/${p._id}`)}
          className="py-3 px-3 text-blue-600 cursor-pointer hover:underline font-medium"
        >
          {p.projectName}
        </td>

        <td className="px-3">
          {p.dzongkhag?.join(", ")}
        </td>

        <td className="px-3">
          {new Date(p.startDate).toLocaleDateString()}
        </td>

        <td className="px-3">
          {new Date(p.endDate).toLocaleDateString()}
        </td>

        <td className="px-3">
          {p.donor?.map(d => d.name).join(", ") || "-"}
        </td>

        <td className="px-3">
          {p.partner?.map(p => p.name).join(", ") || "-"}
        </td>
      </tr>
    ))
  )}
</tbody>
              

              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetail;