import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';

const UpdateBeneficiaryModal = ({ isOpen, onClose, onUpdate, beneficiary }) => {
  const [projects, setProjects] = useState([]);
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
    keyActivities: []
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (beneficiary) {
      setFormData({
        projectId: beneficiary.projectId || '',
        year: beneficiary.year || 2026,
        gender: beneficiary.gender || '',
        cid: beneficiary.cid || '',
        name: beneficiary.name || '',
        dzongkhag: beneficiary.dzongkhag || '',
        gewog: beneficiary.gewog || '',
        village: beneficiary.village || '',
        houseNo: beneficiary.houseNo || '',
        thramNo: beneficiary.thramNo || '',
        indirectBeneficiaries: beneficiary.indirectBeneficiaries || { male: 0, female: 0 },
        keyActivities: beneficiary.keyActivities?.map(act => ({ 
          ...act, 
          isNew: false,
          // Map specifications array back to remarks string for the input
          remarks: act.specifications && act.specifications.length > 0 ? act.specifications[0] : '' 
        })) || []
      });
    }
  }, [beneficiary]);

  const selectedProject = projects.find(p => p._id === formData.projectId);

  const availableDzongkhags = selectedProject?.dzongkhag
    ? Array.isArray(selectedProject.dzongkhag)
      ? selectedProject.dzongkhag
      : [selectedProject.dzongkhag]
    : [];


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

  const addActivity = () => {
    setFormData({
      ...formData,
      keyActivities: [...formData.keyActivities, { 
        activityName: '', totalQuantity: 1, unit: 'Nos', remarks: '',
        isTraining: false, isNew: true,
        trainingDetails: { date: '', type: '' }
      }]
    });
  };

 // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      keyActivities: formData.keyActivities.map(act => ({
        ...act,
        specifications: act.remarks
          ? act.remarks.split(',').map(s => s.trim())
          : []
      }))
    };

    console.log("📤 UPDATE PAYLOAD:", payload);

    try {
      await axios.put(
        `http://localhost:5000/api/beneficiaries/${beneficiary._id}`,
        payload
      );

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Update failed");
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header with Project Name */}
            <div className="p-8 pb-0 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900">Update Beneficiary</h3>
                <p className="text-sm text-blue-600 font-bold uppercase tracking-wider">
                  Project: {selectedProject?.projectName || beneficiary?.projectName || "N/A"}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">Reporting Year</label>
                  <input required type="number" className="w-full p-3 border rounded-xl outline-none font-normal text-black" 
                    value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                </div>



                <div className="space-y-1 relative">
                  <label className="text-xs font-bold text-black uppercase">Dzongkhag</label>
                  <select required className="w-full p-3 border rounded-xl outline-none appearance-none capitalize font-normal text-black" 
                    value={formData.dzongkhag} onChange={e => setFormData({...formData, dzongkhag: e.target.value})}>
                    <option value="">Select Dzongkhag</option>
                    {availableDzongkhags.map((d, i) => (<option key={i} value={d.toLowerCase()}>{d}</option>))}
                  </select>
                  <ChevronDown className="absolute right-3 top-[34px] text-gray-400 pointer-events-none" size={18} />
                </div>


                <div className="space-y-1 relative">
                  <label className="text-xs font-bold text-black uppercase">Gender</label>
                  <select required className="w-full p-3 border rounded-xl outline-none appearance-none font-normal text-black" 
                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-[34px] text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">Full Name</label>
                  <input required className="w-full p-3 border rounded-xl outline-none font-normal text-black" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">CID</label>
                  <input required maxLength={11} className="w-full p-3 border rounded-xl outline-none font-normal text-black" value={formData.cid} onChange={e => setFormData({...formData, cid: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">Gewog</label>
                  <input required className="w-full p-3 border rounded-xl outline-none font-normal text-black" value={formData.gewog} onChange={e => setFormData({...formData, gewog: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">Village</label>
                  <input required className="w-full p-3 border rounded-xl outline-none font-normal text-black" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">House No</label>
                  <input required className="w-full p-3 border rounded-xl outline-none font-normal text-black" value={formData.houseNo} onChange={e => setFormData({...formData, houseNo: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">Thram No</label>
                  <input required className="w-full p-3 border rounded-xl outline-none font-normal text-black" value={formData.thramNo} onChange={e => setFormData({...formData, thramNo: e.target.value})} />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">Indirect Male</label>
                  <input type="number" className="w-full p-2 border rounded-lg font-normal text-black" value={formData.indirectBeneficiaries.male} onChange={e => setFormData({...formData, indirectBeneficiaries: {...formData.indirectBeneficiaries, male: e.target.value}})} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-black uppercase">Indirect Female</label>
                  <input type="number" className="w-full p-2 border rounded-lg font-normal text-black" value={formData.indirectBeneficiaries.female} onChange={e => setFormData({...formData, indirectBeneficiaries: {...formData.indirectBeneficiaries, female: e.target.value}})} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">Intervention</h3>
                  <button type="button" onClick={addActivity} className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:bg-blue-50 p-1 px-2 rounded-lg">
                    <Plus size={16}/> Add New Intervention
                  </button>
                </div>
                {formData.keyActivities.map((act, idx) => (
                  <div key={idx} className="p-4 border border-dashed border-gray-200 rounded-2xl relative bg-gray-50/30 space-y-3">
                    <button type="button" onClick={() => setFormData({...formData, keyActivities: formData.keyActivities.filter((_, i) => i !== idx)})} className="absolute top-4 right-4 text-red-400"><Trash2 size={16}/></button>
                    
                    {act.isNew && (
                      <div className="flex gap-4 mb-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-black">
                          <input type="radio" checked={!act.isTraining} onChange={() => handleActivityChange(idx, 'isTraining', false)} className="accent-blue-500" /> Activity
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-black">
                          <input type="radio" checked={act.isTraining} onChange={() => handleActivityChange(idx, 'isTraining', true)} className="accent-blue-500" /> Training
                        </label>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black uppercase">{act.isTraining ? 'Training Name' : 'Activity Name'}</label>
                      <input placeholder="Enter intervention name" className="w-full p-2 border-b bg-transparent outline-none font-normal text-black focus:border-blue-500" value={act.activityName} onChange={e => handleActivityChange(idx, 'activityName', e.target.value)} />
                    </div>

                    {act.isTraining ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-black uppercase">Date</label>
                          <input type="date" className="w-full p-2 border rounded-lg font-normal text-black" value={act.trainingDetails.date} onChange={e => handleActivityChange(idx, 'trainingDetails.date', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-black uppercase">Type</label>
                          <input className="w-full p-2 border rounded-lg font-normal text-black" value={act.trainingDetails.type} onChange={e => handleActivityChange(idx, 'trainingDetails.type', e.target.value)} />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-black uppercase">Quantity</label>
                          <input type="number" className="w-full p-2 border rounded-lg font-normal text-black" value={act.totalQuantity} onChange={e => handleActivityChange(idx, 'totalQuantity', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-black uppercase">Unit</label>
                          <select className="w-full p-2 border rounded-lg font-normal text-black" value={act.unit} onChange={e => handleActivityChange(idx, 'unit', e.target.value)}>
                            <option value="Nos">Nos</option><option value="Litres">Litres</option><option value="Kg">Kg</option><option value="Acres">Acres</option>
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-black uppercase">Remarks</label>
                      <input placeholder="Enter specifications..." className="w-full p-2 border rounded-lg italic text-sm font-normal text-black" value={act.remarks} onChange={e => handleActivityChange(idx, 'remarks', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-white pb-2">
                <button type="button" onClick={onClose} className="py-3 px-10 bg-white text-gray-900 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all">Cancel</button>
                <button type="submit" className="py-3 px-10 bg-[#3498db] text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-200">Update</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UpdateBeneficiaryModal;

// this is the real