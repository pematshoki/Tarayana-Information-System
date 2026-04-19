import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, FileText, MapPin, BarChart3 } from "lucide-react";

const ProgrammeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Programme Names
  const programmeNames = {
    1: "Social Development",
    2: "Economic Development",
    3: "Environment & Climate",
  };

  // ✅ UPDATED DUMMY PROJECT DATA (REALISTIC)
  const projectsData = [
    {
      id: 1,
      name: "Housing Improvement Project",
      dzongkhag: "Thimphu",
      startDate: "2023-01-10",
      endDate: "2023-12-30",
      donor: "UNDP",
      partner: "MoWHS",
    },
    {
      id: 2,
      name: "Enterprise Development Program",
      dzongkhag: "Paro",
      startDate: "2022-03-15",
      endDate: "2024-06-20",
      donor: "World Bank",
      partner: "MoEA",
    },
    {
      id: 3,
      name: "WASH Improvement Initiative",
      dzongkhag: "Punakha",
      startDate: "2021-07-01",
      endDate: "2023-09-10",
      donor: "UNICEF",
      partner: "MoH",
    },
    {
      id: 4,
      name: "Climate Resilience Project",
      dzongkhag: "Bumthang",
      startDate: "2022-05-10",
      endDate: "2025-01-15",
      donor: "ADB",
      partner: "NEC",
    },
  ];

  return (
    <div className="space-y-6">

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
              {programmeNames[id] || "Programme"}
            </h2>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Improving living conditions through housing, WASH, food security,
              scholarships, and development programs.
            </p>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                title: "Beneficiaries",
                value: "4,294",
                icon: <Users />,
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Projects",
                value: projectsData.length,
                icon: <FileText />,
                color: "bg-green-100 text-green-600",
              },
              {
                title: "Dzongkhags",
                value: "15",
                icon: <MapPin />,
                color: "bg-yellow-100 text-yellow-600",
              },
              {
                title: "Budget",
                value: "Nu. 42,000",
                icon: <BarChart3 />,
                color: "bg-purple-100 text-purple-600",
              },
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
                  {projectsData.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      {/* CLICKABLE NAME */}
                      <td
                        onClick={() => navigate(`/projects/${p.id}`)}
                        className="py-3 px-3 text-blue-600 cursor-pointer hover:underline font-medium"
                      >
                        {p.name}
                      </td>

                      <td className="px-3">{p.dzongkhag}</td>
                      <td className="px-3">{p.startDate}</td>
                      <td className="px-3">{p.endDate}</td>
                      <td className="px-3">{p.donor}</td>
                      <td className="px-3">{p.partner}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

    </div>
  );
};

export default ProgrammeDetail;