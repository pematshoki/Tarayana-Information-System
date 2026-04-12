
import { Users, FileText, MapPin, BarChart3 } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Beneficiaries",
            value: "12,000",
            icon: <Users />,
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Active Programme",
            value: "24",
            icon: <FileText />,
            color: "bg-green-100 text-green-600",
          },
          {
            title: "Dzongkhags Covered",
            value: "20",
            icon: <MapPin />,
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            title: "Project this Year",
            value: "47",
            icon: <BarChart3 />,
            color: "bg-purple-100 text-purple-600",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 flex justify-between items-center 
            transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          >
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-2xl font-semibold mt-2">
                {item.value}
              </h2>
            </div>
            <div
              className={`p-3 rounded-lg ${item.color} transition-transform duration-300 group-hover:scale-110`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Programme Distribution */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-gray-700 mb-4">
            Programme Distribution
          </h3>

          {/* Fake Donut */}
          <div className="flex justify-center items-center">
            <div className="w-40 h-40 rounded-full border-[18px] border-blue-500 border-t-green-500 border-r-yellow-400 border-b-purple-500 relative">
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                Data
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-1 text-sm">
            <p>Social Dev - 35%</p>
            <p>Economic Dev - 28%</p>
            <p>Environment - 20%</p>
            <p>Research - 10%</p>
            <p>Advocacy - 7%</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-gray-700 mb-4">
            Recent Activity
          </h3>

          <div className="space-y-4">
            {[
              "New programme 'Advocacy & Network' created",
              "New project 'WASH Installation' created",
              "Quarterly report Q1 2026 generated",
              "New beneficiary registered (CID: 11001000001)",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{item}</p>
                  <span className="text-xs text-gray-400">
                    Mar {14 - i}, 2026
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Beneficiaries by Dzongkhags */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">
              Beneficiaries by Dzongkhags
            </h3>
            <select className="border rounded-lg px-2 py-1 text-sm">
              <option>Dzongkhags</option>
              <option>Projects</option>
            </select>
          </div>

          {/* Bars */}
          <div className="space-y-3">
            {[1000, 800, 700, 500, 400, 300].map((val, i) => (
              <div key={i}>
                <div className="h-3 bg-gray-200 rounded">
                  <div
                    className="h-3 bg-blue-500 rounded transition-all duration-500"
                    style={{ width: `${val / 10}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects by Programme */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">
              Projects by Programme
            </h3>
            <select className="border rounded-lg px-2 py-1 text-sm">
              <option>All Programmes</option>
              <option>Dzongkhags</option>
              <option>Years</option>
            </select>
          </div>

          {/* Vertical Bars */}
          <div className="flex items-end justify-between h-40 gap-3">
            {[5000, 4000, 3000, 1000, 2000, 2500].map((val, i) => (
              <div
                key={i}
                className="w-8 bg-blue-500 rounded-t transition-all duration-500 hover:opacity-80"
                style={{ height: `${val / 50}px` }}
              ></div>
            ))}
          </div>

          <div className="flex justify-between text-xs mt-2 text-gray-500">
            <span>Social</span>
            <span>Economic</span>
            <span>Env</span>
            <span>Research</span>
            <span>Advocacy</span>
            <span>Clubs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;