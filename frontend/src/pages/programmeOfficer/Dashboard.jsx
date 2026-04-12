import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  MapPin, 
  TrendingUp
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import ChartCard from '../../components/ui/ChartCard';

const beneficiariesByProgrammeData = [
  { name: 'Social Dev', value: 5200, color: '#3498db' },
  { name: 'Economic Dev', value: 3800, color: '#2ecc71' },
  { name: 'Environment', value: 3000, color: '#f1c40f' },
  { name: 'Research', value: 1200, color: '#9b59b6' },
  { name: 'Advocacy', value: 2200, color: '#e67e22' },
  { name: 'Tarayana Clubs', value: 2500, color: '#2980b9' },
];

const projectsByProgrammeData = [
  { name: 'Social Dev', value: 520, color: '#3498db' },
  { name: 'Economic Dev', value: 380, color: '#2ecc71' },
  { name: 'Environment', value: 300, color: '#f1c40f' },
  { name: 'Research', value: 120, color: '#9b59b6' },
  { name: 'Advocacy', value: 220, color: '#e67e22' },
  { name: 'Tarayana Clubs', value: 250, color: '#2980b9' },
];

const projectsByDzongkhagData = [
  { name: 'Thimphu', value: 450, color: '#3498db' },
  { name: 'Punakha', value: 480, color: '#2ecc71' },
  { name: 'Wangdue', value: 380, color: '#f1c40f' },
  { name: 'Bumthang', value: 320, color: '#9b59b6' },
  { name: 'Mongar', value: 550, color: '#e74c3c' },
  { name: 'Gasa', value: 350, color: '#2980b9' },
];

const projectsByYearData = [
  { name: '2021', value: 490, color: '#3498db' },
  { name: '2022', value: 460, color: '#2ecc71' },
  { name: '2023', value: 340, color: '#f1c40f' },
  { name: '2024', value: 120, color: '#9b59b6' },
  { name: '2025', value: 220, color: '#e67e22' },
  { name: '2026', value: 400, color: '#2980b9' },
];

const Dashboard = () => {
  const [leftChartFilter, setLeftChartFilter] = useState('programme');
  const [rightChartFilter, setRightChartFilter] = useState('programme');
  const [isLeftDropdownOpen, setIsLeftDropdownOpen] = useState(false);
  const [isRightDropdownOpen, setIsRightDropdownOpen] = useState(false);

  const filterOptions = [
    { id: 'programme', label: 'All Programmes' },
    { id: 'dzongkhag', label: 'Dzongkhag' },
    { id: 'year', label: 'Year' }
  ];

  const getLeftChartData = () => {
    switch (leftChartFilter) {
      case 'dzongkhag': 
        return projectsByDzongkhagData.map(d => ({ ...d, value: d.value * 10 }));
      case 'year': 
        return projectsByYearData.map(y => ({ ...y, value: y.value * 10 }));
      default: 
        return beneficiariesByProgrammeData;
    }
  };

  const getLeftChartTitle = () => {
    switch (leftChartFilter) {
      case 'dzongkhag': return 'Beneficiaries by Dzongkhag';
      case 'year': return 'Beneficiaries by Year';
      default: return 'Beneficiaries by Programme';
    }
  };

  const getRightChartData = () => {
    switch (rightChartFilter) {
      case 'dzongkhag': return projectsByDzongkhagData;
      case 'year': return projectsByYearData;
      default: return projectsByProgrammeData;
    }
  };

  const getRightChartTitle = () => {
    switch (rightChartFilter) {
      case 'dzongkhag': return 'Projects by Dzongkhag';
      case 'year': return 'Projects by Year';
      default: return 'Projects by Programme';
    }
  };

  const getRightChartSubtitle = () => {
    switch (rightChartFilter) {
      case 'dzongkhag': return 'Filter by dzongkhag area';
      case 'year': return 'Filter by year';
      default: return 'Filter by programme area';
    }
  };

  const currentLeftFilterLabel = filterOptions.find(opt => opt.id === leftChartFilter)?.label;
  const currentRightFilterLabel = filterOptions.find(opt => opt.id === rightChartFilter)?.label;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Beneficiaries" value="5100" icon={Users} colorClass="bg-blue-50 text-blue-400" />
        <StatCard label="Indirect Beneficiaries" value="5000" icon={FileText} colorClass="bg-green-50 text-green-500" />
        <StatCard label="Direct Beneficiaries" value="100" icon={MapPin} colorClass="bg-yellow-50 text-yellow-500" />
        <StatCard label="Total Projects" value="80" icon={TrendingUp} colorClass="bg-purple-50 text-purple-500" />
        
        <StatCard label="Total Beneficiaries" value="12,000" icon={Users} colorClass="bg-blue-50 text-blue-400" />
        <StatCard label="Active Programme" value="6" icon={FileText} colorClass="bg-green-50 text-green-500" />
        <StatCard label="Dzongkhags Covered" value="20" icon={MapPin} colorClass="bg-yellow-50 text-yellow-500" />
        <StatCard label="Project this Year" value="47" icon={TrendingUp} colorClass="bg-purple-50 text-purple-500" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard 
          title={getLeftChartTitle()}
          subtitle="Filter by programme area"
          data={getLeftChartData()}
          filterLabel={currentLeftFilterLabel}
          isDropdownOpen={isLeftDropdownOpen}
          setIsDropdownOpen={setIsLeftDropdownOpen}
          filterOptions={filterOptions}
          onOptionSelect={setLeftChartFilter}
          activeFilterId={leftChartFilter}
          yAxisTicks={[0, 1500, 3000, 4500, 6000]}
        />

        <ChartCard 
          title={getRightChartTitle()}
          subtitle={getRightChartSubtitle()}
          data={getRightChartData()}
          filterLabel={currentRightFilterLabel}
          isDropdownOpen={isRightDropdownOpen}
          setIsDropdownOpen={setIsRightDropdownOpen}
          filterOptions={filterOptions}
          onOptionSelect={setRightChartFilter}
          activeFilterId={rightChartFilter}
          yAxisTicks={[0, 150, 300, 450, 600]}
        />
      </div>
    </div>
  );
};

export default Dashboard;
