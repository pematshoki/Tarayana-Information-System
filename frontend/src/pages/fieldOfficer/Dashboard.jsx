import React from 'react';
import { 
  Users2, 
  FileText, 
  MapPin, 
  TrendingUp 
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';
import DonutChartCard from '../../components/ui/DonutChartCard';
import { beneficiaryData, programmeDistribution } from '../../data/mockData';

const Dashboard = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Beneficiaries" value="620" icon={Users2} colorClass="bg-blue-50 text-blue-500" />
        <StatCard label="Indirect Beneficiaries" value="600" icon={FileText} colorClass="bg-green-50 text-green-500" />
        <StatCard label="Direct Beneficiaries" value="20" icon={MapPin} colorClass="bg-yellow-50 text-yellow-500" />
        <StatCard label="Total Project" value="27" icon={TrendingUp} colorClass="bg-purple-50 text-purple-500" />
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Beneficiaries" value="12,000" icon={Users2} colorClass="bg-blue-50 text-blue-500" />
        <StatCard label="Active Programme" value="6" icon={FileText} colorClass="bg-green-50 text-green-500" />
        <StatCard label="Dzongkhags Covered" value="20" icon={MapPin} colorClass="bg-yellow-50 text-yellow-500" />
        <StatCard label="Project this Year" value="27" icon={TrendingUp} colorClass="bg-purple-50 text-purple-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Beneficiaries by Project"
            subtitle="Filter by project"
            data={beneficiaryData}
            yAxisTicks={[0, 20, 40, 60, 80, 100]}
          />
        </div>

        <DonutChartCard 
          title="Programme Distribution"
          subtitle="By category"
          data={programmeDistribution}
        />
      </div>
    </div>
  );
};

export default Dashboard;
