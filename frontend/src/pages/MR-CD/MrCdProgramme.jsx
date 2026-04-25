import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, FileText, User2, Loader2 } from "lucide-react";
const MrCdProgramme = ({ role }) => {
  const { programmeName } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Session Logic ---
  const token = localStorage.getItem('token');
  const rootPath = pathname.split('/')[1];
  const archivesPath = `/${rootPath}/archives`;

  useEffect(() => {
    const fetchProgrammeProjects = async () => {
      // Guard: Check if token exists
      if (!token) {
        console.error("No authentication token found");
        navigate('/login');
        return;
      }

      setLoading(true);

      // Standard headers for all requests
      const fetchOptions = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      try {
        // 1. Fetch Officer lists
        const [fieldOffRes, progOffRes] = await Promise.all([
          fetch("http://localhost:5000/api/auth/feild-officers", fetchOptions),
          fetch("http://localhost:5000/api/auth/programme-officers", fetchOptions)
        ]);

        // Check for session expiry (401)
        if (fieldOffRes.status === 401 || progOffRes.status === 401) {
          localStorage.clear();
          navigate('/login');
          return;
        }

        const fieldOffData = await fieldOffRes.json();
        const progOffData = await progOffRes.json();

        // 2. Fetch projects for all officers
        const fetchAll = async (officers, type) => {
          const results = await Promise.all(
            (officers || []).map(async (off) => {
              const endpoint = type === "Field" 
                ? `http://localhost:5000/api/projects/field-officer/${off._id}`
                : `http://localhost:5000/api/projects/programme-officer/${off._id}`;
              
              const res = await fetch(endpoint, fetchOptions);
              const json = await res.json();
              return json.data || [];
            })
          );
          return results;
        };

        const allProjectArrays = await Promise.all([
          fetchAll(fieldOffData.data, "Field"),
          fetchAll(progOffData.data, "Program")
        ]);

        const masterList = allProjectArrays.flat(2);

        // 3. Filter by current Programme
        const filtered = masterList.filter(proj => {
          if (Array.isArray(proj.programme)) {
            return proj.programme.some(p => p.programmeName === programmeName);
          }
          return proj.programme?.programmeName === programmeName || proj.programme === programmeName;
        });

        // Remove duplicates based on ID
        const uniqueFiltered = Array.from(new Map(filtered.map(p => [p._id, p])).values());

        // 4. Map to UI structure with REAL beneficiary counts
        const mappedProjects = await Promise.all(
          uniqueFiltered.map(async (proj) => {
            try {
              const summaryRes = await fetch(
                `http://localhost:5000/api/projects/summary/${proj._id}`,
                fetchOptions
              );
              const summaryData = await summaryRes.json();

              return {
                id: proj._id,
                name: proj.projectName,              
                fo: proj.fieldOfficer?.[0]?.email
                  ? `FO ${proj.fieldOfficer[0].email.split("@")[0]}` // Corrected Label to FO
                  : "FO Not Assigned",
                count: summaryData?.beneficiaryList?.length?.toLocaleString() || "0",
                originalPo: proj.programmeOfficer?.email?.split("@")[0] || "",
                originalFo: proj.fieldOfficer?.[0]?.email?.split("@")[0] || "",
              };
            } catch (err) {
              console.error("Error fetching project summary:", proj._id, err);
              return {
                id: proj._id,
                name: proj.projectName,
                fo: "Error",
                count: "0",
                originalPo: "",
                originalFo: "",
              };
            }
          })
        );

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching programme projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammeProjects();
  }, [programmeName, token, navigate]);


  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={24} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(archivesPath)}
        className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm hover:text-blue-500 transition"
      >
        <ChevronLeft size={14} />
        Back to archives
      </button>

      {/* HEADER */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border shadow-sm flex items-start sm:items-center gap-3 sm:gap-4">
      

        <div className="break-words">
          <h1 className="text-sm sm:text-lg font-bold text-gray-800">
            {programmeName}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-gray-500">
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
                `${archivesPath}/programme/${programmeName}/project/${proj.id}` 
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
                        navigate(`${archivesPath}/officer/${proj.originalPo}`);
                      }}
                      className="hover:text-blue-600 cursor-pointer"
                    >
                      {proj.po}
                    </span>
                    {" • "}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${archivesPath}/officer/${proj.originalFo}`);
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
        
        {projects.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-dashed text-center">
            <p className="text-gray-400 text-xs">No projects found for this programme.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MrCdProgramme;

