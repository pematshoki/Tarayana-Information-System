import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const projectData = {
    1: {
      name: "Climate Resilient Housing Improvement",
      description:
        "Improving housing resilience against climate impacts in rural communities.",
      programme: "Social Development",
      dzongkhag: "Trashigang",
      duration: "1 year",
      endDate: "Dec 31, 2025",
      donor: "UNDP",
      budget: "Nu. 12,000",
    },
  };

  const project = projectData[id] || projectData[1];

  // ✅ UPDATED BENEFICIARY DATA
  const beneficiaries = [
    {
      cid: "11605003464",
      name: "Phuntsho Wangmo",
      dob: "1995-06-12",
      dzongkhag: "Thimphu",
      village: "Babesa",
      gewog: "Kawang",
      houseNo: "H12",
      thramNo: "T45",
      phone: "17123456",
      project: "Housing Improvement",
      indirect: "No",
      support: "Built water tank",
    },
    {
      cid: "11605003465",
      name: "Tempel Gyeltshen",
      dob: "1990-03-20",
      dzongkhag: "Paro",
      village: "Shaba",
      gewog: "Shaba",
      houseNo: "H8",
      thramNo: "T12",
      phone: "17654321",
      project: "Enterprise Dev",
      indirect: "Yes",
      support: "Enterprise training",
    },
  ];

  return (
    <div className="space-y-6">

          {/* BACK */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-black"
          >
            ← Back to Programme
          </button>

          {/* TITLE */}
          <div className="bg-white rounded-xl p-5 shadow">
            <h2 className="text-lg md:text-xl font-semibold">
              {project.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {project.description}
            </p>
          </div>

          {/* PROJECT INFO */}
          <div className="bg-white rounded-xl p-5 shadow">
            <h3 className="font-semibold text-gray-700 mb-4">
              Project information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Programme", value: project.programme },
                { label: "Dzongkhag", value: project.dzongkhag },
                { label: "Duration", value: project.duration },
                { label: "End Date", value: project.endDate },
                { label: "Donor", value: project.donor },
                { label: "Budget", value: project.budget },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <FileText size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ✅ UPDATED BENEFICIARIES TABLE */}
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
                    <th className="px-3">DOB</th>
                    <th className="px-3">Dzongkhag</th>
                    <th className="px-3">Village</th>
                    <th className="px-3">Gewog</th>
                    <th className="px-3">House No</th>
                    <th className="px-3">Thram No</th>
                    <th className="px-3">Phone</th>
                    <th className="px-3">Project</th>
                    <th className="px-3">Indirect</th>
                    <th className="px-3">Support</th>
                  </tr>
                </thead>

                <tbody>
                  {beneficiaries.map((b, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-3">{b.cid}</td>
                      <td className="px-3 font-medium whitespace-nowrap">{b.name}</td>
                      <td className="px-3 whitespace-nowrap">{b.dob}</td>
                      <td className="px-3">{b.dzongkhag}</td>
                      <td className="px-3">{b.village}</td>
                      <td className="px-3">{b.gewog}</td>
                      <td className="px-3">{b.houseNo}</td>
                      <td className="px-3">{b.thramNo}</td>
                      <td className="px-3">{b.phone}</td>
                      <td className="px-3">{b.project}</td>
                      <td className="px-3">{b.indirect}</td>
                      <td className="px-3">{b.support}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

    </div>
  );
};

export default ProjectDetail;