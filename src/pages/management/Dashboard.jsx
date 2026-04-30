import React from 'react';
import { 
  Users, 
  MapPin, 
  Folder,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import BhutanMap from '../../components/BhutanMap';

const Dashboard = () => {
  const kpis = [
    { label: 'Total Beneficiaries', value: '12,000', icon: <Users size={24} />, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Active Programme', value: '24', icon: <Folder size={24} />, color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'Dzongkhags Covered', value: '20', icon: <MapPin size={24} />, color: 'bg-amber-500', bgColor: 'bg-amber-50' },
    { label: 'Project this Year', value: '47', icon: <BarChart3 size={24} />, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
  ];

  const pieData = [
    { name: 'Social Development', value: 35, color: '#3498db' },
    { name: 'Economic Development', value: 28, color: '#2ecc71' },
    { name: 'Environment', value: 20, color: '#f1c40f' },
    { name: 'Research', value: 10, color: '#9b59b6' },
    { name: 'Advocacy', value: 7, color: '#e74c3c' },
  ];

  const barData = [
    { name: 'Social Dev', value: 5000 },
    { name: 'Economic Dev', value: 4000 },
    { name: 'Environment', value: 3000 },
    { name: 'Research', value: 1200 },
    { name: 'Advocacy', value: 2200 },
    { name: 'Tarayana Clubs', value: 2800 },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{kpi.value}</h3>
            </div>
            <div className={`${kpi.bgColor} ${kpi.color.replace('bg-', 'text-')} p-3 rounded-xl`}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Programme Distribution */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-full mb-6">
            <h3 className="text-lg font-bold text-gray-900">Programme Distribution</h3>
            <p className="text-xs text-gray-400">By category</p>
          </div>
          
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-56 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full max-w-md mt-4">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-semibold text-gray-600 truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Beneficiaries by Programme */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Beneficiaries by Programme</h3>
              <p className="text-xs text-gray-400">Filter by programme area</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-all">
              All Programmes <ChevronDown size={14} />
            </button>
          </div>
          
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#9ca3af' }}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3498db" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                >
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        index === 0 ? '#3498db' : 
                        index === 1 ? '#2ecc71' : 
                        index === 2 ? '#f1c40f' : 
                        index === 3 ? '#9b59b6' : 
                        index === 4 ? '#e74c3c' : 
                        '#1b5e8c'
                      } 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Map View */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900">Project Distribution Across Bhutan</h3>
        </div>
        
        <div className="h-[500px] relative rounded-xl overflow-hidden bg-gray-50/50">
            <BhutanMap data={[]} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
