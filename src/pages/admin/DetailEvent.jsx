import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

const DetailEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { entry, event } = location.state || {};

  return (
    <div className="space-y-4 max-w-5xl mx-auto">

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
  );
};

export default DetailEvent;