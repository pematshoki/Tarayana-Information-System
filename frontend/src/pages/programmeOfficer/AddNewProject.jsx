import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Plus, Files, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import SuccessModal from '../../components/modals/SuccessModal';

const AddNewProject = () => {
  const navigate = useNavigate();
  const dummyToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZGFhZjQ0MzBjZWI2NWFmZGRiYTJjMyIsInJvbGUiOiJQcm9ncmFtbWVPZmZpY2VyIiwiaWF0IjoxNzc2NDQ0NDI5LCJleHAiOjE3NzY1MzA4Mjl9.LIaDLCZMsro8bc_GDDsWdASKp56yhFi5qcXOOL4u-AY";

  // Data States
  const [donors, setDonors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [dzongkhagsList] = useState(["Bumthang", "Chukha", "Dagana", "Gasa", "Haa", "Lhuentse", 
    "Mongar", "Paro", "Pema Gatshel", "Punakha", "Samdrup Jongkhar", 
    "Samtse", "Sarpang", "Thimphu", "Trashigang", "Trashi Yangtse", 
    "Trongsa", "Tsirang", "Wangdue Phodrang", "Zhemgang"]);

  // Modals
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showConfirmProject, setShowConfirmProject] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [addingType, setAddingType] = useState('');

  // Form State
  const [tempSelections, setTempSelections] = useState({ dzongkhag: '', donor: '', partner: '', fieldOfficer: '', programme: '' });
  const [formData, setFormData] = useState({
    projectName: '',
    dzongkhag: [],
    startDate: '',
    endDate: '',
    donor: [],
    partner: [],
    programme: [],
    fieldOfficer: [],
    description: ''
  });

  const fetchData = async () => {
    try {
      const [donPartRes, progRes, userRes] = await Promise.all([
        axios.get('http://localhost:5000/api/donor-partner/summary'),
        axios.get('http://localhost:5000/api/programmes/'),
        axios.get('http://localhost:5000/api/auth/users')
      ]);
      setDonors(donPartRes.data.donors || []);
      setPartners(donPartRes.data.partners || []);
      setProgrammes(progRes.data.programmes || []);
      setOfficers((userRes.data.users || []).filter(u => u.roleId?.roleName === 'FieldOfficer'));
    } catch (err) { console.error("Fetch Error:", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const formatEmail = (email) => email ? email.split('@')[0] : 'N/A';

  const getDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = Math.abs(e - s);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${Math.floor(diffDays / 30)} months, ${diffDays % 30} days`;
  };

  const handleSelectChange = (field, value) => {
    if (value === "ADD_NEW_TRIGGER") {
      setAddingType(field.charAt(0).toUpperCase() + field.slice(1));
      setShowAddModal(true);
      setTempSelections({ ...tempSelections, [field]: '' });
    } else {
      setTempSelections({ ...tempSelections, [field]: value });
    }
  };

  const confirmAddition = (field) => {
    const value = tempSelections[field];
    if (value && !formData[field].includes(value)) {
      setFormData({ ...formData, [field]: [...formData[field], value] });
      setTempSelections({ ...tempSelections, [field]: '' });
    }
  };

  const removeItem = (field, value) => {
    setFormData({ ...formData, [field]: formData[field].filter(i => i !== value) });
  };

  const handleAddNewSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/donor-partner/register', { name: newName, roleName: addingType });
      setNewName(''); 
      setShowAddModal(false); 
      setSuccessMsg(`${addingType} Registered Successfully`);
      setIsSuccessModalOpen(true); 
      fetchData(); 
    } catch (err) { alert("Error adding " + addingType); }
  };

  const prepareForConfirmation = (e) => {
    e.preventDefault();
    let updatedFormData = { ...formData };
    ['dzongkhag', 'donor', 'partner', 'fieldOfficer', 'programme'].forEach(key => {
      const currentTemp = tempSelections[key];
      if (currentTemp && !updatedFormData[key].includes(currentTemp)) {
        updatedFormData[key] = [...updatedFormData[key], currentTemp];
      }
    });

    if (updatedFormData.dzongkhag.length === 0) return alert("Select at least one Dzongkhag");
    if (updatedFormData.programme.length === 0) return alert("Select at least one Programme");
    if (updatedFormData.fieldOfficer.length === 0) return alert("Assign at least one Officer");

    setFormData(updatedFormData);
    setShowConfirmProject(true);
  };

  const finalSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/projects', formData, {
        headers: { Authorization: `Bearer ${dummyToken}` }
      });
      setShowConfirmProject(false);
      setSuccessMsg("Project Added Successfully");
      setIsSuccessModalOpen(true);
      setTimeout(() => { navigate('/po/programmes'); }, 2000);
    } catch (error) { alert("Submission failed."); }
  };

  return (
    // This wrapper ensures the content is centered in the available screen space
    <div className="w-full flex justify-center px-4 md:px-8 py-6">
      <div className="max-w-5xl w-full space-y-6 pb-10">
        
        <div className="space-y-4">
          <button onClick={() => navigate('/po/programmes')} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
            <ArrowLeft size={16} /> <span>Back to programmes</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12">
          <form onSubmit={prepareForConfirmation} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Form Fields */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Project Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Enter project name" 
                  className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium ${formData.projectName ? 'text-black' : 'text-gray-400'}`} 
                  value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Dzongkhags <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none appearance-none font-medium ${tempSelections.dzongkhag ? 'text-black' : 'text-gray-400'}`} 
                      value={tempSelections.dzongkhag} onChange={(e) => handleSelectChange('dzongkhag', e.target.value)} required>
                      <option value="" className="text-gray-400">Select Dzongkhag</option>
                      {dzongkhagsList.map(dz => <option key={dz} value={dz} className="text-black">{dz}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <button type="button" onClick={() => confirmAddition('dzongkhag')} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Plus size={20}/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.dzongkhag.map((d, i) => (
                    <span key={d} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-gray-200">
                      <span className="bg-blue-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                      {d} <X size={14} className="cursor-pointer text-gray-400 hover:text-red-500" onClick={() => removeItem('dzongkhag', d)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Start Date <span className="text-red-500">*</span></label>
                <input type="date" className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-medium ${formData.startDate ? 'text-black' : 'text-gray-400'}`} value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">End Date <span className="text-red-500">*</span></label>
                <input type="date" className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none font-medium ${formData.endDate ? 'text-black' : 'text-gray-400'}`} value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
              </div>

              {/* Donors */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Donors</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none appearance-none font-medium ${tempSelections.donor ? 'text-black' : 'text-gray-400'}`} 
                      value={tempSelections.donor} onChange={(e) => handleSelectChange('donor', e.target.value)}>
                      <option value="" className="text-gray-400">Select Donor</option>
                      {donors.map(d => <option key={d._id} value={d._id} className="text-black">{d.name}</option>)}
                      <option value="ADD_NEW_TRIGGER" className="text-blue-600 font-bold">+ Register New Donor</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <button type="button" onClick={() => confirmAddition('donor')} className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Plus size={20}/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">{formData.donor.map(id => <span key={id} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-100">{donors.find(d => d._id === id)?.name} <X size={12} className="cursor-pointer" onClick={() => removeItem('donor', id)} /></span>)}</div>
              </div>

              {/* Partners */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Partners</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none appearance-none font-medium ${tempSelections.partner ? 'text-black' : 'text-gray-400'}`} 
                      value={tempSelections.partner} onChange={(e) => handleSelectChange('partner', e.target.value)}>
                      <option value="" className="text-gray-400">Select Partner</option>
                      {partners.map(p => <option key={p._id} value={p._id} className="text-black">{p.name}</option>)}
                      <option value="ADD_NEW_TRIGGER" className="text-blue-600 font-bold">+ Register New Partner </option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <button type="button" onClick={() => confirmAddition('partner')} className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Plus size={20}/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">{formData.partner.map(id => <span key={id} className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-100">{partners.find(p => p._id === id)?.name} <X size={12} className="cursor-pointer" onClick={() => removeItem('partner', id)} /></span>)}</div>
              </div>

              {/* Programmes */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Programmes <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none appearance-none font-medium ${tempSelections.programme ? 'text-black' : 'text-gray-400'}`} 
                      value={tempSelections.programme} onChange={(e) => handleSelectChange('programme', e.target.value)} required>
                      <option value="" className="text-gray-400">Select Programme</option>
                      {programmes.map(p => <option key={p._id} value={p._id} className="text-black">{p.programmeName}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <button type="button" onClick={() => confirmAddition('programme')} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Plus size={20}/></button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">{formData.programme.map(id => <span key={id} className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100">{programmes.find(p => p._id === id)?.programmeName} <X size={12} className="cursor-pointer" onClick={() => removeItem('programme', id)} /></span>)}</div>
              </div>

              {/* Field Officers */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900">Assign Field Officers <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none appearance-none font-medium ${tempSelections.fieldOfficer ? 'text-black' : 'text-gray-400'}`} 
                      value={tempSelections.fieldOfficer} onChange={(e) => handleSelectChange('fieldOfficer', e.target.value)} required>
                      <option value="" className="text-gray-400">Select Officer</option>
                      {officers.map(o => <option key={o._id} value={o._id} className="text-black">{o.email}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                  <button type="button" onClick={() => confirmAddition('fieldOfficer')} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Plus size={20}/></button>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {formData.fieldOfficer.map((id, index) => (
                    <div key={id} className="flex items-center justify-between bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">{index + 1}</span>
                        <span className="text-xs font-bold text-blue-700">{officers.find(o => o._id === id)?.email}</span>
                      </div>
                      <X size={14} className="cursor-pointer text-blue-300 hover:text-red-500" onClick={() => removeItem('fieldOfficer', id)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">Description</label>
              <textarea rows={4} placeholder="Enter project description..." className={`w-full px-4 py-3 border border-gray-200 rounded-xl outline-none resize-none font-medium ${formData.description ? 'text-black' : 'text-gray-400'}`} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => navigate('/po/programmes')} className="px-10 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="px-10 py-3 bg-[#3498db] text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all">Next Step</button>
            </div>
          </form>
        </motion.div>

        {/* Register New Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Register {addingType}</h2>
                <p className="text-sm text-gray-500 mb-6 font-medium">Add this new {addingType.toLowerCase()} to the system?</p>
                <input type="text" placeholder={`${addingType} Name`} className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-6 outline-none text-black font-medium" value={newName} onChange={(e) => setNewName(e.target.value)} />
                <div className="flex gap-3 font-bold">
                  <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-gray-400">Cancel</button>
                  <button onClick={handleAddNewSubmit} className="flex-1 py-3 bg-blue-500 text-white rounded-xl">Register</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Review Modal */}
        <AnimatePresence>
          {showConfirmProject && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-10 max-w-3xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Project Review</h2>
                <div className="space-y-6 text-sm bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-8">
                  <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Project:</span> <span className="font-bold text-gray-900">{formData.projectName}</span></div>
                  <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Dzongkhags:</span> <span className="font-bold text-gray-900 text-right max-w-xs">{formData.dzongkhag.join(', ')}</span></div>
                  <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Donors:</span> <span className="font-bold text-gray-900 text-right">{formData.donor.map(id => donors.find(d => d._id === id)?.name).join(', ') || 'N/A'}</span></div>
                  <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Partners:</span> <span className="font-bold text-gray-900 text-right">{formData.partner.map(id => partners.find(p => p._id === id)?.name).join(', ') || 'N/A'}</span></div>
                  <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Programmes:</span> <span className="font-bold text-gray-900 text-right">{formData.programme.map(id => programmes.find(p => p._id === id)?.programmeName).join(', ')}</span></div>
                  <div className="flex justify-between border-b pb-3"><span className="text-gray-500">Duration:</span> <span className="font-bold text-blue-600">{getDuration(formData.startDate, formData.endDate)}</span></div>
                  
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-gray-500 border-b pb-2">Assigned Officers:</span>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.fieldOfficer.map((id, i) => (
                        <span key={id} className="bg-white px-3 py-1.5 rounded-lg border border-gray-200 font-bold text-gray-700 shadow-sm text-xs">
                          <span className="text-blue-500 mr-1">#{i+1}</span>
                          {formatEmail(officers.find(o => o._id === id)?.email)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-center font-bold text-gray-700 mb-6">Are you sure you want to add this project?</p>
                <div className="flex gap-4 font-bold">
                  <button onClick={() => setShowConfirmProject(false)} className="flex-1 py-4 text-gray-500 hover:bg-gray-100 rounded-2xl transition-all">Cancel</button>
                  <button onClick={finalSubmit} className="flex-1 py-4 bg-[#3498db] text-white rounded-2xl hover:bg-blue-600 shadow-lg transition-all">Yes, Add Project</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} message={successMsg} icon={Files} />
      </div>
    </div>
  );
};

export default AddNewProject;