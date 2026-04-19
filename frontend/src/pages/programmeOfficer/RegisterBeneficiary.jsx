import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, ChevronDown } from 'lucide-react';
import axios from 'axios';
import SuccessModal from '../../components/modals/SuccessModal';

const RegisterBeneficiary = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const DUMMY_PO_ID = "69daaf4430ceb65afddba2c3";


  const [formData, setFormData] = useState({
    projectId: '',
    year: 2026,
    gender: '',
    cid: '',
    name: '',
    dzongkhag: '',
    gewog: '',
    village: '',
    houseNo: '',
    thramNo: '',
    indirectBeneficiaries: { male: 0, female: 0 },
    keyActivities: [{ 
      activityName: '', 
      totalQuantity: 1, 
      unit: 'Nos', 
      remarks: '',
      isTraining: false,
      trainingDetails: { date: '', type: '' }
    }]
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/programme-officer/${DUMMY_PO_ID}`);
        setProjects(res.data.data || []);
      } catch (err) { console.error("Fetch error", err); }
    };
    fetchProjects();
  }, []);

  const getTextColor = (value) => value ? "text-black" : "text-gray-400";

  const selectedProject = projects.find(p => p._id === formData.projectId);
  const availableDzongkhags = [];
  if (selectedProject && selectedProject.dzongkhag) {
    if (Array.isArray(selectedProject.dzongkhag)) {
      availableDzongkhags.push(...selectedProject.dzongkhag);
    } else {
      availableDzongkhags.push(selectedProject.dzongkhag.toString());
    }
  }

  const addActivity = () => {
    const lastItemType = formData.keyActivities[formData.keyActivities.length - 1]?.isTraining;
    setFormData({
      ...formData,
      keyActivities: [...formData.keyActivities, { 
        activityName: '', totalQuantity: 1, unit: 'Nos', remarks: '',
        isTraining: lastItemType || false,
        trainingDetails: { date: '', type: '' }
      }]
    });
  };

  const handleActivityChange = (idx, field, value) => {
    const newActs = [...formData.keyActivities];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newActs[idx][parent][child] = value;
    } else {
      newActs[idx][field] = value;
    }
    setFormData({ ...formData, keyActivities: newActs });
  };




const handleSubmit = async () => {
  try {
    const payload = {
      ...formData,
      keyActivities: formData.keyActivities.map(act => ({
        ...act,
        specifications: act.remarks
          ? act.remarks.split(',').map(s => s.trim())
          : []
      }))
    };

    console.log("📤 Sending Payload:", payload);

    await axios.post('http://localhost:5000/api/beneficiaries', payload);

    setIsSuccess(true);
    setShowConfirm(false);
    setTimeout(() => navigate('/po/beneficiaries'), 2000);

  } catch (err) {
    console.error("❌ Error:", err);
    alert(err.response?.data?.message || "Registration failed");
  }
};
return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 px-4 pt-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-medium hover:text-blue-500 transition-colors">
        <ArrowLeft size={18}/> Back
      </button>
      
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Register New Beneficiary</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); setShowConfirm(true); }} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-1 relative">
              <label className="text-sm font-bold text-gray-700">Project <span className="text-red-500">*</span></label>
              <select required className={`w-full p-3 border rounded-xl border-blue-100 outline-none appearance-none ${getTextColor(formData.projectId)}`}
                value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value, dzongkhag: ''})}>
                <option value="" className="text-gray-400">Select associated project</option>
                {projects.map(p => <option key={p._id} value={p._id} className="text-black">{p.projectName}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-[38px] text-blue-400 pointer-events-none" size={18} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Reporting Year <span className="text-red-500">*</span></label>
              <input required type="number" className={`w-full p-3 border rounded-xl outline-none font-medium ${getTextColor(formData.year)}`} 
                value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
              <input required type="text" className={`w-full p-3 border rounded-xl outline-none ${getTextColor(formData.name)}`} placeholder="Enter Full Name" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">CID <span className="text-red-500">*</span></label>
              <input required type="text" maxLength={11} className={`w-full p-3 border rounded-xl outline-none ${getTextColor(formData.cid)}`} placeholder="Enter 11 Digit CID" 
                value={formData.cid} onChange={e => setFormData({...formData, cid: e.target.value})} />
            </div>

            <div className="space-y-1 relative">
              <label className="text-sm font-bold text-gray-700">Gender <span className="text-red-500">*</span></label>
              <select required className={`w-full p-3 border rounded-xl outline-none appearance-none ${getTextColor(formData.gender)}`} 
                value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                <option value="" className="text-gray-400">Select Gender</option>
                <option value="M" className="text-black">Male</option>
                <option value="F" className="text-black">Female</option>
              </select>
              <ChevronDown className="absolute right-3 top-[38px] text-gray-400 pointer-events-none" size={18} />
            </div>

           <div className="space-y-1 relative">
              <label className="text-sm font-bold text-gray-700">Dzongkhag <span className="text-red-500">*</span></label>
              <select required className={`w-full p-3 border rounded-xl outline-none appearance-none capitalize ${getTextColor(formData.dzongkhag)}`} 
                value={formData.dzongkhag} onChange={e => setFormData({...formData, dzongkhag: e.target.value})}>
                <option value="" className="text-gray-400">Select Dzongkhag</option>
                {availableDzongkhags.map((d, index) => <option key={index} value={d.toLowerCase()} className="text-black">{d}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-[38px] text-gray-400 pointer-events-none" size={18} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Gewog <span className="text-red-500">*</span></label>
              <input required type="text" className={`w-full p-3 border rounded-xl outline-none ${getTextColor(formData.gewog)}`} placeholder="Enter Gewog" 
              value={formData.gewog} onChange={e => setFormData({...formData, gewog: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Village <span className="text-red-500">*</span></label>
              <input required type="text" className={`w-full p-3 border rounded-xl outline-none ${getTextColor(formData.village)}`} placeholder="Enter Village" 
                value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">House No <span className="text-red-500">*</span></label>
              <input required type="text" className={`w-full p-3 border rounded-xl outline-none ${getTextColor(formData.houseNo)}`} placeholder="Enter House No" 
                value={formData.houseNo} onChange={e => setFormData({...formData, houseNo: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-gray-700">Thram No <span className="text-red-500">*</span></label>
              <input required type="text" className={`w-full p-3 border rounded-xl outline-none ${getTextColor(formData.thramNo)}`} placeholder="Enter Thram No" 
                value={formData.thramNo} onChange={e => setFormData({...formData, thramNo: e.target.value})} />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl space-y-4">
            <h3 className="font-bold text-xs text-gray-500 uppercase">Indirect Beneficiaries</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Male</label>
                <input type="number" className={`p-3 border rounded-xl w-full outline-none ${getTextColor(formData.indirectBeneficiaries.male)}`} 
                  value={formData.indirectBeneficiaries.male} onChange={e => setFormData({...formData, indirectBeneficiaries: {...formData.indirectBeneficiaries, male: e.target.value}})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400">Female</label>
                <input type="number" className={`p-3 border rounded-xl w-full outline-none ${getTextColor(formData.indirectBeneficiaries.female)}`} 
                  value={formData.indirectBeneficiaries.female} onChange={e => setFormData({...formData, indirectBeneficiaries: {...formData.indirectBeneficiaries, female: e.target.value}})} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Intervention</h3>
              <button type="button" onClick={addActivity} className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:bg-blue-50 p-1 px-2 rounded-lg transition-colors">
                <Plus size={16}/> {formData.keyActivities[formData.keyActivities.length-1]?.isTraining ? "Add New Training" : "Add New Activity"}
              </button>
            </div>

            {formData.keyActivities.map((act, idx) => (
              <div key={idx} className="p-5 border border-dashed border-gray-200 rounded-2xl space-y-4 relative bg-gray-50/30">
                {formData.keyActivities.length > 1 && (
                  <button type="button" onClick={() => setFormData({...formData, keyActivities: formData.keyActivities.filter((_, i) => i !== idx)})} 
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                )}

                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={`type-${idx}`} checked={!act.isTraining} onChange={() => handleActivityChange(idx, 'isTraining', false)} className="accent-blue-500" />
                    <span className="text-xs font-bold uppercase text-gray-900">Key Activity</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={`type-${idx}`} checked={act.isTraining} onChange={() => handleActivityChange(idx, 'isTraining', true)} className="accent-blue-500" />
                    <span className="text-xs font-bold uppercase text-gray-900">Training</span>
                  </label>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">{act.isTraining ? "Training Name" : "Activity Name"}</label>
                    <input required placeholder={act.isTraining ? "Enter training name..." : "Enter activity name..."} className={`w-full p-2 border-b bg-transparent outline-none focus:border-blue-500 transition-all ${getTextColor(act.activityName)}`} 
                      value={act.activityName} onChange={e => handleActivityChange(idx, 'activityName', e.target.value)} />
                </div>

                {act.isTraining ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Training Date</label>
                      <input required type="date" className={`w-full p-2 border rounded-lg outline-none ${getTextColor(act.trainingDetails.date)}`} 
                        value={act.trainingDetails.date} onChange={e => handleActivityChange(idx, 'trainingDetails.date', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Training Type</label>
                      <input required placeholder="e.g. Technical, Financial" className={`w-full p-2 border rounded-lg outline-none ${getTextColor(act.trainingDetails.type)}`} 
                        value={act.trainingDetails.type} onChange={e => handleActivityChange(idx, 'trainingDetails.type', e.target.value)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Quantity</label>
                      <input required type="number" className={`w-full p-2 border rounded-lg outline-none ${getTextColor(act.totalQuantity)}`} 
                        value={act.totalQuantity} onChange={e => handleActivityChange(idx, 'totalQuantity', e.target.value)} />
                    </div>
                    <div className="space-y-1 relative">
                      <label className="text-xs font-bold text-gray-500 uppercase">Unit</label>
                      <select required className={`w-full p-2 border rounded-lg outline-none appearance-none bg-white ${getTextColor(act.unit)}`} 
                        value={act.unit} onChange={e => handleActivityChange(idx, 'unit', e.target.value)}>
                        <option value="Nos">Nos</option>
                        <option value="Litres">Litres</option>
                        <option value="Acres">Acres</option>
                        <option value="Kg">Kg</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-[28px] text-gray-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Remarks (Specifications)</label>
                    <input placeholder="Eg: 1 5000, 2 500.   'SLM Training'" className={`w-full p-2 border rounded-lg outline-none italic ${getTextColor(act.remarks)}`} 
                      value={act.remarks} onChange={e => handleActivityChange(idx, 'remarks', e.target.value)} />
                </div>
                <br />
              </div>
            ))}
          </div>

          <button type="submit" className="w-full bg-[#3498db] text-white p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98]">
            <Save size={20}/> Review and Register
          </button>
        </form>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Confirm Beneficiary Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600 bg-gray-50 p-6 rounded-2xl border">
                <p className="md:col-span-2 text-blue-600 font-bold border-b pb-1 mb-1">Basic Information</p>
                <p><strong>Project:</strong> <span className="text-black font-medium">{projects.find(p => p._id === formData.projectId)?.projectName || 'N/A'}</span></p>
                <p><strong>Reporting Year:</strong> <span className="text-black font-medium">{formData.year}</span></p>
                <p><strong>Full Name:</strong> <span className="text-black font-medium">{formData.name}</span></p>
                <p><strong>CID:</strong> <span className="text-black font-medium">{formData.cid}</span></p>
                <p><strong>Gender:</strong> <span className="text-black font-medium">{formData.gender === 'M' ? 'Male' : 'Female'}</span></p>
                
                <p className="md:col-span-2 text-blue-600 font-bold border-b pb-1 mt-2 mb-1">Location Details</p>
                <p><strong>Dzongkhag:</strong> <span className="text-black font-medium capitalize">{formData.dzongkhag}</span></p>
                <p><strong>Gewog:</strong> <span className="text-black font-medium">{formData.gewog}</span></p>
                <p><strong>Village:</strong> <span className="text-black font-medium">{formData.village}</span></p>
                <p><strong>House No:</strong> <span className="text-black font-medium">{formData.houseNo}</span></p>
                <p><strong>Thram No:</strong> <span className="text-black font-medium">{formData.thramNo}</span></p>

                <p className="md:col-span-2 text-blue-600 font-bold border-b pb-1 mt-2 mb-1">Indirect Beneficiaries</p>
                <p><strong>Male:</strong> <span className="text-black font-medium">{formData.indirectBeneficiaries.male}</span></p>
                <p><strong>Female:</strong> <span className="text-black font-medium">{formData.indirectBeneficiaries.female}</span></p>

                <p className="md:col-span-2 text-blue-600 font-bold border-b pb-1 mt-2 mb-1">Intervention ({formData.keyActivities.length})</p>
                <div className="md:col-span-2 space-y-3">
                  {formData.keyActivities.map((act, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="font-bold text-black">{act.isTraining ? 'Training:' : 'Activity:'} {act.activityName}</p>
                      <p className="text-xs text-gray-500">
                        {act.isTraining 
                          ? `Date: ${act.trainingDetails.date} | Type: ${act.trainingDetails.type}` 
                          : `Quantity: ${act.totalQuantity} ${act.unit}`}
                      </p>
                      {act.remarks && <p className="text-xs italic text-gray-400 mt-1">Remarks: {act.remarks}</p>}
                    </div>
                  ))}
                </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(false)} className="flex-1 p-4 border rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Go Back</button>
              <button onClick={handleSubmit} className="flex-1 p-4 bg-[#3498db] text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md">Confirm & Save</button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal isOpen={isSuccess} onClose={() => setIsSuccess(false)} message="Beneficiary Registered Successfully" />
    </div>
  );
};

export default RegisterBeneficiary;