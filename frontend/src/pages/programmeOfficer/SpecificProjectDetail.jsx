  import React, { useEffect, useState } from 'react';
  import { useNavigate, useParams, useLocation } from 'react-router-dom';
  import { ArrowLeft, FileText, Calendar, Globe, Users } from 'lucide-react';
  import axios from 'axios';

  const InfoCard = ({ icon: Icon, label, value, valueColor = "text-sm font-bold text-gray-900" }) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><Icon size={24} /></div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={valueColor}>{value}</p>
      </div>
    </div>
  );

  const SpecificProjectDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const backPath = location.state?.from || '/po/programmes';
    const backLabel = location.state?.label || 'Back to Projects';

    useEffect(() => {
      const fetchSummary = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/projects/summary/${id}`);
          console.log("Project Summary Data:", response.data);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching summary:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSummary();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading detailed summary...</div>;
    if (!data) return <div className="p-10 text-center text-red-500">Project not found.</div>;

    const { project, projectSummary, geographicBreakdown, beneficiaryList } = data;

    
    const getDuration = (start, end) => {
      if (!start || !end) return "N/A";
      const s = new Date(start);
      const e = new Date(end);
      const diffTime = Math.abs(e - s);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${Math.floor(diffDays / 30)} months, ${diffDays % 30} days`;
    };

    // 2. Beneficiary Formatting logic
    const indirectTotal = (projectSummary.totalIndirectMale || 0) + (projectSummary.totalIndirectFemale || 0);

    return (
      <div className="space-y-8 pb-10">
        <button onClick={() => navigate(backPath)} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm font-medium">
          <ArrowLeft size={16} /> <span>{backLabel}</span>
        </button>

        {/* Project Header */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{project.projectName}</h1>
          <p className="text-sm text-gray-500 max-w-3xl leading-relaxed">{project.description}</p>
          <br />
          <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {project.status}
              </span>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Project Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Fetching the Programme Name from the project object */}
            <InfoCard icon={FileText} label="Programme" value={project.programme?.map(p => p.programmeName).join(', ')} />
            
            {/* Direct Beneficiary Fetching */}
            <InfoCard icon={Users} label="Direct Beneficiaries" value={`${projectSummary.totalDirect}`} />
            
            {/* Indirect Beneficiary Formatting: Total (M/F) */}
            <InfoCard icon={Users} label="Indirect Total" value={`${indirectTotal} (M:${projectSummary.totalIndirectMale} F:${projectSummary.totalIndirectFemale})`} />
            
            {/* Duration Calculation */}
            <InfoCard icon={Calendar} label="Duration" value={getDuration(project.startDate, project.endDate)} />
            
            {/* Donor & Partner logic (None if empty) */}
            <InfoCard icon={Globe} label="Donor" value={project.donor?.length > 0 ? project.donor.map(d => d.name).join(', ') : "None"} />
            <InfoCard icon={Globe} label="Partner" value={project.partner?.length > 0 ? project.partner.map(p => p.name).join(', ') : "None"} />
            
            {/* Status Fetching (Blue for ongoing) */}
            {/* <InfoCard icon={FileText} label="Status" value={project.status} valueColor="text-sm font-bold text-blue-500" /> */}
          </div>
        </div>

        {/* Geographic Key Activities */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Key Activities</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Dzongkhag</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Gewog</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Village</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Activity</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Total Qty</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Total Capacity</th>
                  {/* Added Remarks Field */}
                  <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {geographicBreakdown.map((geo, idx) => (
                  geo.activities.map((act, actIdx) => (
                    <tr key={`${idx}-${actIdx}`} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{geo.location.dzongkhag}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{geo.location.gewog}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{geo.location.village}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{act.activityName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{act.displayTotal} {act.unit}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{act.totalCapacitySum}</td>
                      {/* Fetching the Remarks array and joining it */}
                      <td className="px-6 py-4 text-sm text-gray-500">{act.remarks?.join(', ') || 'N/A'}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Beneficiaries (Scrollable with all fields) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Registered Beneficiaries</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* overflow-x-auto makes the table scrollable for all fields */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">CID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Gender</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Dzongkhag</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Gewog</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Village</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">House No</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-900 uppercase">Thram No</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {beneficiaryList.map((ben) => (
                    <tr key={ben._id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{ben.cid}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{ben.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ben.gender}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ben.dzongkhag}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ben.gewog}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ben.village}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ben.houseNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{ben.thramNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SpecificProjectDetail;