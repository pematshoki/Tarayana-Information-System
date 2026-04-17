import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, FileText, User2 } from "lucide-react";

const MrCdProgramme = ({ role }) => {
  const { programmeName } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const rootPath = pathname.split('/')[1];
  const archivesPath = `/${rootPath}/archives`;

  const projects = [
    { name: "Climate & Disaster Resilient Housing Improvement", po: "PO Phuntsho Wangmo", fo: "FO Sangay Choden", count: "1,200" },
    { name: "Climate Resilient WASH", po: "PO Phuntsho Wangmo", fo: "FO Tempel Gyeltshen", count: "800" },
    { name: "Sustainable Food Systems", po: "PO Sangay Wangmo", fo: "FO Sangay Choden", count: "500" },
    { name: "Scholarships and Learning Opportunities", po: "PO Phuntsho Choden", fo: "FO Sangay Lhamo", count: "1,000" },
    { name: "Surgical Camps", po: "PO Phuntsho Wangmo", fo: "FO Sangay Choden", count: "1,050" },
  ];

  return (
    <div className="space-y-6">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(archivesPath)}
        className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm hover:text-blue-500 transition"
      >
        <ChevronLeft size={14} />
        Back to programme
      </button>

      {/* HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border shadow-sm flex items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
          <FileText size={20} />
        </div>

        <div className="break-words">
          <h1 className="text-sm sm:text-lg font-bold text-gray-800">
            {programmeName || "Social Development"}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-gray-400">
            {projects.length} Projects total
          </p>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="space-y-3">
        {projects.map((proj, i) => (
          <div
            key={i}
            onClick={() =>
              navigate(
                `${archivesPath}/programme/${programmeName}/project/${proj.name}`
              )
            }
            className="bg-white p-4 sm:px-6 sm:py-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between gap-4 hover:border-blue-200 hover:shadow-md transition cursor-pointer group"
          >
                {/* LEFT */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>

                  <div className="break-words">
                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600">
                      {proj.name}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <div className="flex -space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-gray-200 border flex items-center justify-center">
                          <User2 size={8} />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-blue-100 border flex items-center justify-center">
                          <User2 size={8} />
                        </div>
                      </div>

                      <p className="text-[10px] font-semibold text-gray-400 uppercase">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const nameOnly = proj.po.replace("PO ", "");
                            navigate(
                              `${archivesPath}/officer/${nameOnly}`
                            );
                          }}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {proj.po}
                        </span>
                        {" • "}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            const nameOnly = proj.fo.replace("FO ", "");
                            navigate(
                              `${archivesPath}/officer/${nameOnly}`
                            );
                          }}
                          className="hover:text-blue-600 cursor-pointer"
                        >
                          {proj.fo}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-row sm:flex-col justify-between sm:items-end w-full sm:w-auto">
                  <span className="text-base sm:text-lg font-black text-gray-800">
                    {proj.count}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    Beneficiaries
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
  );
};

export default MrCdProgramme;