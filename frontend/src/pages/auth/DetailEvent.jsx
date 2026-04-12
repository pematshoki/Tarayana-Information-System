import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

const DetailEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const { entry, event } = location.state || {};

  return (
    <div className="bg-gray-100 min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`${collapsed ? "md:ml-[75px]" : "md:ml-[265px]"}`}>
        <Navbar collapsed={collapsed} />

        <div className="p-6 pt-20 space-y-4 max-w-5xl mx-auto">

          <button onClick={() => navigate(-1)}>← Back</button>

          <div className="bg-white rounded-xl border p-5">

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded">
                <CalendarDays className="text-blue-600" />
              </div>

              <h2 className="font-semibold text-lg">
                {entry.Theme || entry.Title}
              </h2>
            </div>

            <div className="border-b mb-4"></div>

            <h3 className="font-semibold mb-3">Details</h3>

            {Object.entries(entry).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b py-2">
                <span className="font-medium">{k}</span>
                <span className="text-gray-500">{v}</span>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailEvent;