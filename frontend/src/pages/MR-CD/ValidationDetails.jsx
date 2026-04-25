import { useState, useEffect } from "react";
import { Pencil, ArrowLeft, Send, FileText, Check, Loader2, CheckCircle2, AlertTriangle, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ValidationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isSending, setIsSending] = useState(false); // New state for loading
  
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [geoRows, setGeoRows] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", desc: "" });

  const [tempActuals, setTempActuals] = useState({});
  const [remarkText, setRemarkText] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const fetchFullDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/projects/summary/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const json = await response.json();

        if (json.success) {
          setProjectData(json.project);
          setSummary(json.projectSummary);
          console.log(json)
          
          // Filter out Trainings and map rows
          const rows = (json.geographicBreakdown || []).flatMap(geo => 
            geo.activities
              .filter(act => !act.isTraining) // REMOVE TRAININGS
              .map(act => ({
                dzongkhag: geo.location?.dzongkhag,
                village: geo.location?.village,
                activityName: act.activityName,
                displayTotal: act.displayTotal,
                remarks: act.remarks?.join(", ") || "No specification",
                capacity: `${act.totalCapacitySum} ${act.unit || ''}`,
                realQuantity: json.project.keyActivityVerification?.find(v => v.activityName === act.activityName)?.realQuantity || 0
              }))
          );
          setGeoRows(rows);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullDetails();
  }, [id, token]);

  // Logic for showing buttons
  const isOngoing = projectData?.status === "Ongoing";
  const hasDiscrepancy = geoRows.some(row => Number(row.displayTotal) !== Number(row.realQuantity));

  const paginatedRows = geoRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const handleMarkComplete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMessage({ title: "Project Completed", desc: "The project status has been updated to completed." });
        setShowSuccess(true);
        setTimeout(() => { setShowSuccess(false); navigate(-1); }, 2500);
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveQuantities = async () => {
    try {
      const verifications = geoRows.map((r, i) => ({
        activityName: r.activityName,
        realQuantity: Number(tempActuals[i] !== undefined ? tempActuals[i] : r.realQuantity)
      }));

      const res = await fetch(`http://localhost:5000/api/projects/${id}/verify-data`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ verifications })
      });

      if (res.ok) {
        setShowModal(false);
        setSuccessMessage({ title: "Updated", desc: "Quantities synchronized successfully." });
        setShowSuccess(true);
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (err) { console.error(err); }
  };


const handleSendAlert = async () => {
  setIsSending(true); 
  try {
    const poEmail = projectData?.programmeOfficer?.email;
    
    // Filter for officers where data doesn't match
    const relevantFOs = projectData?.fieldOfficer?.filter((off, index) => {
      const assignedDzo = projectData.dzongkhag?.[index];
      return geoRows.some(row => 
        row.dzongkhag?.toLowerCase() === assignedDzo?.toLowerCase() && 
        Number(row.displayTotal) !== Number(row.realQuantity)
      );
    }).map(off => off.email);

    const recipientEmails = Array.from(new Set([poEmail, ...relevantFOs])).filter(Boolean);

    const res = await fetch(`http://localhost:5000/api/projects/${id}/alert`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        emails: recipientEmails,
        // Description is now optional; sends "No additional details provided" if empty
        remark: remarkText.trim() || "No additional description provided.",
        projectName: projectData?.projectName
      })
    });

    if (res.ok) {
      setShowRemark(false);
      setRemarkText("");
      setSuccessMessage({ 
        title: "Alert Sent", 
        desc: "The responsible officers have been notified." 
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  } catch (err) {
    console.error("Failed to notify officers:", err);
  } finally {
    setIsSending(false); 
  }
};


  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;

  return (
    <div className="relative min-h-screen p-4 sm:p-6">
      <div className={`space-y-6 transition-all duration-500 ${showSuccess || showModal || showRemark ? "blur-md pointer-events-none" : ""}`}>
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-blue-500 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to projects
          </button>
          
          {isOngoing && (
            <div className="flex items-center gap-3">
              {hasDiscrepancy && (
                <button onClick={() => setShowRemark(true)} className="flex items-center gap-2 bg-red-50 text-red-600 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight hover:bg-red-100 transition-all">
                  <AlertTriangle size={16} /> Report Discrepancy
                </button>
              )}
              <button onClick={handleMarkComplete} className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-tight shadow-lg shadow-green-100 hover:bg-green-600 transition-all">
                <CheckCircle2 size={16} /> Mark as complete
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
          {/* Project Info Header */}
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><FileText size={24}/></div>
              <div>
                <h2 className="text-2xl font-black text-gray-800 tracking-tight">{projectData?.projectName}</h2>
                <div className="flex gap-2 mt-1.5">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">{projectData?.status}</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">Direct: {summary?.totalDirect}</span>
                </div>
              </div>
            </div>
            {isOngoing && (
                <button onClick={() => {
                const initials = {};
                geoRows.forEach((r, i) => initials[i] = r.realQuantity);
                setTempActuals(initials);
                setShowModal(true);
                }} className="p-3 border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 shadow-sm transition-all">
                <Pencil size={20} />
                </button>
            )}
          </div>

          {/* TABLE AREA */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-4 pb-4">Location</th>
                  <th className="px-4 pb-4">Activity Name</th>
                  <th className="px-4 pb-4">Specifications</th>
                  <th className="px-4 pb-4 text-center">Plan Total</th>
                  <th className="px-4 pb-4 text-center">Actual (val)</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {paginatedRows.map((row, i) => (
                  <tr key={i} className="bg-white hover:bg-gray-50/50 transition-colors border-y border-gray-50">
                    <td className="px-4 py-6">
                      <p className="text-gray-800 capitalize font-bold">{row.dzongkhag}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{row.village}</p>
                    </td>
                    <td className="px-4 py-6 text-blue-600 capitalize">{row.activityName}</td>
                    <td className="px-4 py-6">
                      <p className="font-bold text-gray-700 text-xs">{row.capacity}</p>
                      <p className="text-[11px] text-gray-400 italic line-clamp-1">{row.remarks}</p>
                    </td>
                    <td className="px-4 py-6 text-center text-gray-500 font-bold">{row.displayTotal}</td>
                    <td className="px-4 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-black ${Number(row.displayTotal) === Number(row.realQuantity) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {row.realQuantity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-6 mt-10 text-gray-400 border-t border-gray-50 pt-8">
            <button 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-20"
            >
                <ChevronLeft size={24} />
            </button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                Page {currentPage + 1} of {Math.ceil(geoRows.length / pageSize)}
            </span>
            <button 
                disabled={(currentPage + 1) * pageSize >= geoRows.length}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-20"
            >
                <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
            <h3 className="text-xl font-black text-gray-900 mb-6">Synchronize Actuals</h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {geoRows.map((item, i) => {
                const isMismatch = Number(tempActuals[i]) !== Number(item.displayTotal);
                return (
                  <div key={i} className={`flex justify-between items-center p-4 rounded-2xl border transition-colors ${isMismatch ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-transparent'}`}>
                    <span className={`text-[10px] font-black uppercase ${isMismatch ? 'text-red-500' : 'text-gray-400'}`}>
                      {item.activityName} ({item.village})
                    </span>
                    <input 
                      type="number" 
                      value={tempActuals[i]} 
                      onChange={(e) => setTempActuals({...tempActuals, [i]: e.target.value})}
                      className={`w-20 rounded-xl py-2 text-center font-black outline-none shadow-sm border ${isMismatch ? 'bg-white border-red-200 text-red-600 focus:ring-red-400' : 'bg-white border-gray-100 text-blue-600 focus:ring-blue-400'}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-gray-400 rounded-2xl hover:bg-gray-50">Cancel</button>
              <button onClick={handleSaveQuantities} className="flex-1 py-4 font-bold bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      

      {/* REMARK MODAL (With Officer Details) */}
      {showRemark && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRemark(false)}></div>
           <div className="relative bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={20}/></div>
                <h3 className="text-xl font-black text-gray-900">Report Discrepancy</h3>
              </div>
              
              {/* Officer Awareness Section */}
             <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Notifying Officers:</p>
            <div className="space-y-3">
              
              {/* Programme Officer */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-600">Programme Officer:</span> 
                <span className="text-xs text-blue-600 font-medium">
                  {projectData?.programmeOfficer?.email || "Loading..."}
                </span>
              </div>
              
              {/* Field Officer */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-600">Field Officer:</span> 
                <div className="space-y-1">
                  {projectData?.fieldOfficer?.map((off, index) => {
                    const assignedDzo = projectData.dzongkhag?.[index];
                    
                    // Use toLowerCase() to fix the "Samtse" vs "samtse" issue
                    const hasDiscrepancyInDzo = geoRows.some(row => 
                      row.dzongkhag?.toLowerCase() === assignedDzo?.toLowerCase() && 
                      Number(row.displayTotal) !== Number(row.realQuantity)
                    );

                    if (!hasDiscrepancyInDzo) return null;

                    return (
                      <div key={index} className="flex justify-between items-center bg-red-50/50 p-3 rounded-xl border border-red-100">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-red-400 uppercase">Responsible for: {assignedDzo}</span>
                          <span className="text-[11px] text-blue-600 font-bold">{off.email}</span>
                        </div>
                        <Check size={14} className="text-green-500" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
              <textarea 
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-[24px] p-6 h-40 text-sm focus:ring-2 focus:ring-red-400 outline-none" 
              placeholder="Describe the discrepancy (optional)..."
            ></textarea>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setShowRemark(false)} 
                className="flex-1 py-4 font-bold text-gray-400 rounded-2xl hover:bg-gray-50"
                disabled={isSending}
              >
                Cancel
              </button>
              
              <button 
                onClick={handleSendAlert} 
                disabled={isSending}
                className={`flex-1 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all 
                  ${isSending 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-red-600 text-white shadow-red-100 active:scale-95'
                  }`}
              >
                {isSending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Notify Officers <Send size={16}/>
                  </>
                )}
              </button>
            </div>
           </div>
        </div>
      )}



      {/* SUCCESS POPUP (Hidden during normal flow) */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] shadow-2xl p-12 text-center w-full max-w-sm animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200">
              <Check className="text-white" size={40} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">{successMessage.title}</h2>
            <p className="text-gray-400 mt-3 text-sm font-medium">{successMessage.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationDetails;