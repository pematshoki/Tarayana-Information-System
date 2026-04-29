import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

const DetailEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const { entry } = location.state || {};
  const data = entry?.data || entry || {};

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${collapsed ? "md:ml-[75px]" : "md:ml-[265px]"} transition-all`}>
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-20 space-y-4 max-w-5xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-black mb-2">
            ← Back
          </button>

          <div className="bg-white rounded-xl border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 border-b pb-4 text-gray-800">
              {data["Pilgrimage Title"] || "Event Details"}
            </h2>

            <div className="space-y-6">
              {Object.entries(data).map(([key, value]) => {
                // Skip internal keys or nested objects we handle specifically later
                if (key === "citizen_details" || key === "sponsor_list" || key === "_id" || key === "annualEventId") return null;

                return (
                  <div key={key} className="grid grid-cols-3 gap-4 py-1">
                    <span className="font-bold text-gray-700 col-span-1">{key}</span>
                    <span className="text-gray-600 col-span-2 italic">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                );
              })}

              {/* --- SPECIAL CASE: Senior Citizen Details Table --- */}
              {data["citizen_details"] && data["citizen_details"].length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-2">
                   <span className="font-bold text-gray-700">Senior Citizen Participants  </span>
                  <div className="col-start-2 col-span-2">

                 <div className="grid grid-cols-2 text-sm mb-2">

                      <span className="font-bold text-gray-800 underline">CID</span>
                      <span className="font-bold text-gray-800 underline">Name</span>
                    </div>
                    {data["citizen_details"].map((citizen, idx) => (
                      <div key={idx} className="grid grid-cols-2 py-1 text-gray-600 italic">
                          <span>{citizen.cid}</span>
                        <span>{citizen.name}</span>
                      
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- SPECIAL CASE: Sponsors List --- */}
              {data["sponsor_list"] && data["sponsor_list"].length > 0 && (
              
                <div className="grid grid-cols-3 gap-4 pt-2">
                   <span className="font-bold text-gray-700">Sponsor's Name with Amount </span>
                  <div className="col-start-2 col-span-2">

                 <div className="grid grid-cols-2 text-sm mb-2">

                      <span className="font-bold text-gray-800 underline">Name</span>
                      <span className="font-bold text-gray-800 underline">Amount</span>
                    </div>
                  {data["sponsor_list"].map((sponsor, idx) => (
                      <div key={idx} className="grid grid-cols-2 py-1 text-gray-600 italic">
                      <span>{sponsor.name}</span>
                  <span>Nu. {sponsor.amount}</span>
                      
                      </div>
                    ))}
                  </div>
                </div>
                
                
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailEvent;