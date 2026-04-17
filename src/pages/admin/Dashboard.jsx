

import { useState } from "react";

import {
  Users,
  FolderKanban,
  MapPin,
  TrendingUp,
  Activity,
  FileText,
  Calendar,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const programmeDistribution = [
  { name: "Social Development", value: 35, color: "#38bdf8" },
  { name: "Economic Development", value: 28, color: "#22c55e" },
  { name: "Environment", value: 20, color: "#facc15" },
  { name: "Research", value: 10, color: "#a855f7" },
  { name: "Advocacy", value: 7, color: "#ef4444" },
];

const dzongkhagData = [
  { name: "Thimphu", beneficiaries: 890 },
  { name: "Paro", beneficiaries: 650 },
  { name: "Punakha", beneficiaries: 520 },
  { name: "Bumthang", beneficiaries: 430 },
  { name: "Trashigang", beneficiaries: 380 },
  { name: "Wangdue", beneficiaries: 310 },
];

const projectData = [
  { name: "Social", value: 5200 },
  { name: "Economic", value: 4100 },
  { name: "Environment", value: 2600 },
  { name: "Research", value: 1200 },
  { name: "Advocacy", value: 2100 },
  { name: "Clubs", value: 2400 },
];

const colors = ["#38bdf8", "#22c55e", "#facc15", "#a855f7", "#ef4444", "#3b82f6"];

const recentActivities = [
  {
    action: "New programme 'Advocacy & Network' created",
    actor: "Programme Officer",
    date: "Mar 14, 2026",
    icon: FolderKanban,
    color: "bg-blue-100 text-blue-600",
  },
  {
    action: "New project 'WASH Installation' created",
    actor: "Field Officer",
    date: "Mar 13, 2026",
    icon: FolderKanban,
    color: "bg-green-100 text-green-600",
  },
  {
    action: "Quarterly report Q1 2026 generated",
    actor: "M&R Officer",
    date: "Mar 12, 2026",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    action: "New beneficiary registered",
    actor: "Field Officer",
    date: "Mar 11, 2026",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
];

const Dashboard = () => {
  const [dzFilter, setDzFilter] = useState("beneficiaries");
  const [projectFilter, setProjectFilter] = useState("programme");


const dzongkhagProjects = [
  { name: "Thimphu", value: 120 },
  { name: "Paro", value: 95 },
  { name: "Punakha", value: 80 },
  { name: "Bumthang", value: 60 },
  { name: "Trashigang", value: 55 },
  { name: "Wangdue", value: 40 },
];

const projectsByDzongkhag = [
  { name: "Thimphu", value: 2000 },
  { name: "Paro", value: 1500 },
  { name: "Punakha", value: 1200 },
];

const projectsByYear = [
  { name: "2022", value: 3000 },
  { name: "2023", value: 4200 },
  { name: "2024", value: 5000 },
  { name: "2025", value: 6200 },
];


const dzData =
  dzFilter === "beneficiaries" ? dzongkhagData : dzongkhagProjects;

const projectChartData =
  projectFilter === "programme"
    ? projectData
    : projectFilter === "dzongkhag"
    ? projectsByDzongkhag
    : projectsByYear;




  return (
    <div className="space-y-6">
          {/* KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Beneficiaries",
                value: "12,000",
                icon: Users,
                color: "bg-blue-500",
              },
              {
                title: "Active Programme",
                value: "24",
                icon: FolderKanban,
                color: "bg-green-500",
              },
              {
                title: "Dzongkhags Covered",
                value: "20",
                icon: MapPin,
                color: "bg-yellow-500",
              },
              {
                title: "Project this Year",
                value: "47",
                icon: TrendingUp,
                color: "bg-purple-500",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow p-5 flex justify-between items-center hover:shadow-lg transition"
                >
                  <div>
                    <p className="text-sm text-gray-500">{item.title}</p>
                    <h2 className="text-2xl font-bold mt-1">
                      {item.value}
                    </h2>
                  </div>
                  <div
                    className={`p-3 rounded-xl text-white ${item.color}`}
                  >
                    <Icon size={20} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pie */}
            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold mb-4">
                Programme Distribution
              </h3>

              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={programmeDistribution}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {programmeDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-3 space-y-1 text-sm">
                {programmeDistribution.map((p) => (
                  <p key={p.name}>
                    {p.name} - {p.value}%
                  </p>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold mb-4">Recent Activity</h3>

              <div className="space-y-4">
                {recentActivities.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className={`p-2 rounded-lg ${a.color}`}>
                        <Icon size={16} />
                      </div>

                      <div>
                        <p className="text-sm">{a.action}</p>
                        <div className="text-xs text-gray-400 flex gap-1 items-center">
                          {a.actor} • <Calendar size={12} /> {a.date}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Horizontal Bar */}
            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold mb-4">
                Beneficiaries by Dzongkhags
              </h3>

              <select
  value={projectFilter}
  onChange={(e) => setProjectFilter(e.target.value)}
  className="border rounded-lg px-2 py-1 text-sm"
>
  <option value="programme">Programme</option>
  <option value="dzongkhag">Dzongkhag</option>
  <option value="year">Year</option>
</select>


              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dzongkhagData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar
                    dataKey="beneficiaries"
                    fill="#38bdf8"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Vertical Bar */}
            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="font-semibold mb-4">
                Projects by Programme
              </h3>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {projectData.map((_, i) => (
                      <Cell key={i} fill={colors[i]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
    </div>
  );
};

export default Dashboard;