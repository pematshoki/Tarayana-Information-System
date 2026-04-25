import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, FileText, User2, Loader2 } from "lucide-react";

const ValidationProjects = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { programme } = useParams();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Session & Auth Logic ---
  const token = localStorage.getItem('token');
  const rootPath = pathname.split('/')[1];

  useEffect(() => {
    const fetchProgrammeProjects = async () => {
      // Guard: No token found
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

        // Catch expired session
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
          return results.flat();
        };

        const fieldProjects = await fetchAll(fieldOffData.data, "Field");
        const progProjects = await fetchAll(progOffData.data, "Program");
        const masterList = [...fieldProjects, ...progProjects];

        // 3. Filter by the current Programme Name
        const filtered = masterList.filter(proj => {
          if (Array.isArray(proj.programme)) {
            return proj.programme.some(p => p.programmeName === programme);
          }
          return proj.programme?.programmeName === programme || proj.programme === programme;
        });

        // Remove duplicates
        const uniqueFiltered = Array.from(new Map(filtered.map(item => [item._id, item])).values());

        // 4. Map and fetch summary for each project
        const mappedProjects = await Promise.all(
          uniqueFiltered.map(async (proj) => {
            try {
              const summaryRes = await fetch(`http://localhost:5000/api/projects/summary/${proj._id}`, fetchOptions);
              const summaryData = await summaryRes.json();
              
              return {
                id: proj._id,
                name: proj.projectName,
                status: proj.status,              
                fo: proj.fieldOfficer?.[0]?.email
                  ? `FO ${proj.fieldOfficer[0].email.split("@")[0]}`
                  : "FO Not Assigned",
                count: summaryData?.beneficiaryList?.length?.toLocaleString() || "0",
              };
            } catch (err) {
              console.error("Error fetching summary:", err);
              return null;
            }
          })
        );

        setProjects(mappedProjects.filter(p => p !== null));
      } catch (error) {
        console.error("Error fetching validation projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammeProjects();
  }, [programme, token, navigate]);


  
  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={24} />
    </div>
  );

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
      <div className="bg-white p-4 sm:p-5 rounded-2xl border shadow-sm flex items-start sm:items-center gap-3 sm:gap-4 mb-6">
       

        <div className="break-words">
          <h2 className="text-sm sm:text-lg font-bold text-gray-800">
            {programme}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-gray-500">
            {projects.length} Projects for Validation
          </p>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="space-y-3">
        {projects.map((p, i) => (
          <div
            key={p.id}
            onClick={() => navigate(`/${rootPath}/validation-queue/project/${p.id}`)}
            className="bg-white p-4 sm:px-6 sm:py-4 rounded-2xl border shadow-sm flex flex-col sm:flex-row justify-between gap-4 hover:border-blue-200 hover:shadow-md transition cursor-pointer group"
          >
            {/* LEFT */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                <FileText size={18} />
              </div>

              <div className="break-words">
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-blue-600">
                  {p.name}
                </h3>
                <span 
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    p.status?.toLowerCase() === 'ongoing' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {p.status}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex -space-x-1.5">
                    <div className="w-4 h-4 rounded-full bg-gray-200 border flex items-center justify-center">
                      <User2 size={8} />
                    </div>
                    <div className="w-4 h-4 rounded-full bg-blue-100 border flex items-center justify-center">
                      <User2 size={8} />
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-tight">
                    {p.po} • {p.fo}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-row sm:flex-col justify-between sm:items-end w-full sm:w-auto">
              <span className="text-base sm:text-lg font-black text-gray-800">
                {p.count}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                Beneficiaries
              </span>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-dashed text-center">
            <p className="text-gray-400 text-xs">No projects found for validation in this programme.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidationProjects;