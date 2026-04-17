

import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const projects = [
  { name: "Climate & Disaster Resilient Housing Improvement", po: "Phuntsho Wangmo", fo: "Sangay Choden", beneficiaries: "1,200" },
  { name: "Climate Resilient WASH", po: "Phuntsho Wangmo", fo: "Tempel Gyeltshen", beneficiaries: "800" },
  { name: "Sustainable Food Systems", po: "Sangay Wangmo", fo: "Sangay Choden", beneficiaries: "500" },
];

const ValidationProjects = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { programme } = useParams();

  const rootPath = pathname.split('/')[1];
  const userRole = rootPath === 'mr' ? 'MR Officer' : 'CD Officer';
  const user = { name: "Pema Tshoki", role: userRole };

  return (
    <div className="space-y-6">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-400 text-xs sm:text-sm hover:text-blue-500 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Programme
      </button>

      {/* HEADER */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
        <div className="p-2 sm:p-3 bg-blue-100 rounded-xl text-blue-500 flex-shrink-0">
          <FileText />
        </div>

        <div className="break-words">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            {programme}
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            5 Projects
          </p>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="space-y-4">
        {projects.map((p, i) => (
          <div
            key={i}
            onClick={() => navigate(`/${rootPath}/validation-queue/project/${i}`)}
            className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md cursor-pointer transition-all"
          >
                {/* LEFT */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-400 flex-shrink-0">
                    <FileText size={20} />
                  </div>

                  <div className="break-words">
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                      {p.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-400 mt-1">
                      PO {p.po}, FO {p.fo}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-left sm:text-right">
                  <p className="text-lg sm:text-xl font-bold text-gray-800">
                    {p.beneficiaries}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                    Beneficiaries
                  </p>
                </div>
              </div>
        ))}
      </div>
    </div>
  );
};

export default ValidationProjects;