
import { useState, useEffect } from "react";
import { Pencil, ArrowLeft, Send, X, FileText, Check } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const ValidationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [showModal, setShowModal] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  
  // Success Modal States
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", desc: "" });

  const rootPath = pathname.split('/')[1];
  const userRole = rootPath === 'mr' ? 'MR Officer' : 'CD Officer';
  const user = { name: "Pema Tshoki", role: userRole };

  // Local state for table data to handle real-time updates
  const [activities, setActivities] = useState([
    { activity: "Housing Improvement", qty: 96, actual: 0 },
    { activity: "WASH Facilities/Toilets", qty: 37, actual: 0 },
    { activity: "Solar Home Lighting", qty: 5, actual: 0 },
    { activity: "Solar Water Heating", qty: 2, actual: 0 },
    { activity: "Eco-San Toilets", qty: 30, actual: 0 },
    { activity: "Fuel Efficient Stoves", qty: 20, actual: 0 },
  ]);

  // Temporary state for the modal inputs
  const [tempActuals, setTempActuals] = useState({});

  // Function to determine status color
  const getStatusStyle = (qty, actual) => {
    if (actual === 0 || actual === "0" || actual === "") return "text-gray-800"; // Pending/Initial
    return qty === Number(actual) 
      ? "bg-green-100 text-green-600" 
      : "bg-red-100 text-red-600";
  };

  const handleSaveQuantities = () => {
    const updatedActivities = activities.map((item, index) => ({
      ...item,
      actual: tempActuals[index] !== undefined ? tempActuals[index] : item.actual
    }));
    
    setActivities(updatedActivities);
    setShowModal(false);
    
    // Trigger Success Popup
    setSuccessMessage({
      title: "Quantities Added Successfully",
      desc: "The actual quantities have been updated and verified."
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSendRemark = () => {
    setShowRemark(false);
    // Trigger Success Popup
    setSuccessMessage({
      title: "Remark Sent Successfully",
      desc: "Your remarks have been forwarded to the PO and FO."
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 mb-6 text-sm hover:text-blue-500 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to Social Development
      </button>

      <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-gray-100">

    <div className="flex justify-between items-start mb-10">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 rounded-xl text-blue-500"><FileText /></div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Climate & Disaster Resilient Housing Improvement
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm">
            Project ID: {id || 0}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          const initials = {};
          activities.forEach((a, i) => (initials[i] = a.actual));
          setTempActuals(initials);
          setShowModal(true);
        }}
        className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50"
      >
        <Pencil size={18} />
      </button>
    </div>

    {/* ✅ TABLE FIX (IMPORTANT) */}
    <div className="w-full overflow-x-auto">
      <table className="min-w-[700px] w-full text-left">
        <thead>
          <tr className="text-gray-400 text-xs uppercase tracking-wider font-bold border-b border-gray-50">
            <th className="pb-4">Key Activities</th>
            <th className="pb-4 text-center">Quantity</th>
            <th className="pb-4 text-center">Actual Quantity(C&D)</th>
            <th className="pb-4 text-right">Remarks</th>
          </tr>
        </thead>

        <tbody className="text-sm font-medium text-gray-700">
          {activities.map((item, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
              <td className="py-5 text-gray-600 whitespace-nowrap">
                {item.activity}:
              </td>

              <td className="py-5 text-center font-bold whitespace-nowrap">
                {item.qty}
              </td>

              <td className="py-5 text-center whitespace-nowrap">
                <span
                  className={`px-5 py-1.5 rounded-full inline-block min-w-[70px] ${getStatusStyle(
                    item.qty,
                    item.actual
                  )}`}
                >
                  {item.actual}
                </span>
              </td>

              <td className="py-5 text-right whitespace-nowrap">
                <button
                  onClick={() => setShowRemark(true)}
                  className="text-gray-300 hover:text-blue-500"
                >
                  <Pencil size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* MOBILE HINT */}
    <p className="text-[10px] text-gray-400 mt-2 sm:hidden">
      👉 Swipe to view full table
    </p>

  </div>

      {/* MODAL: Edit Quantities - Styled exactly like second image */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-extrabold mb-8 text-gray-900">Edit Quantities</h3>
            
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {activities.slice(0, 3).map((item, i) => ( // Showing first 3 like image
                <div key={i} className="flex justify-between items-center">
                  <label className="text-sm text-gray-500 font-bold">{item.activity}:</label>
                  <input 
                    type="number" 
                    value={tempActuals[i]} 
                    onChange={(e) => setTempActuals({...tempActuals, [i]: e.target.value})}
                    className="w-28 border border-gray-200 rounded-xl py-2.5 text-center font-bold text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none shadow-sm" 
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-12">
              <button 
                onClick={() => setShowModal(false)} 
                className="flex-1 py-4 font-bold text-gray-400 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveQuantities}
                className="flex-1 py-4 font-bold bg-[#3B82F6] text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Write Remarks */}
      {showRemark && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
           <div className="bg-white w-full max-w-lg rounded-[32px] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Write Remarks</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8">
                This remark will be sent to the respective Programme Officer, Field Officer, and Admin via email. It informs them of the verification results and any differences identified.
              </p>
              <textarea 
                className="w-full border border-gray-100 bg-gray-50 rounded-2xl p-5 h-40 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none text-sm text-gray-600"
                placeholder="Write remarks here..."
              ></textarea>
              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowRemark(false)} className="flex-1 py-4 text-gray-400 font-bold border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">Cancel</button>
                <button 
                  onClick={handleSendRemark}
                  className="flex-1 py-4 bg-[#3B82F6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all"
                >
                   Send <Send size={16}/>
                </button>
              </div>
           </div>
        </div>
      )}

      {/* SUCCESS MODAL (Reusable for both actions) */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] px-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 text-center w-full max-w-md">
            <div className="flex items-center justify-center mb-8">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <Check className="w-10 h-10 text-white" strokeWidth={4} />
                </div>
              </div>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-700">
              {successMessage.title}
            </h2>
            <p className="text-gray-500 mt-2 text-xs sm:text-sm">
              {successMessage.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationDetails;