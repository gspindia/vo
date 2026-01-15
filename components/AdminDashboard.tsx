import React, { useEffect, useState } from 'react';
import { Lab, User, INDIAN_STATES, LabStatus } from '../types';
import { api } from '../services/api';
import { Menu, UserCircle, ArrowLeft, Search, MapPin, ChevronRight, Building2, Map as MapIcon, Landmark, Palmtree, Plus, Trash2, Edit2, Save, X, Loader2, Home, BarChart2 } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

// Initial empty state for the form
const EMPTY_LAB_FORM = {
  name: '',
  district: '',
  address: '',
  contactPerson: '',
  contactNumber: '',
  email: '',
  notes: ''
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState(EMPTY_LAB_FORM);

  const loadData = async () => {
    const data = await api.getLabs();
    setLabs(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    setIsSidebarOpen(false); // Close sidebar on selection
  };

  const handleBack = () => {
    setSelectedState(null);
    setIsFormOpen(false);
    setEditingLab(null);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // CRUD Handlers
  const handleAddNew = () => {
    setEditingLab(null);
    setFormData(EMPTY_LAB_FORM);
    setIsFormOpen(true);
  };

  const handleEdit = (lab: Lab) => {
    setEditingLab(lab);
    setFormData({
      name: lab.name,
      district: lab.district,
      address: lab.address,
      contactPerson: lab.contactPerson,
      contactNumber: lab.contactNumber,
      email: lab.email,
      notes: lab.notes || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (labId: string) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      setLoading(true);
      try {
        await api.deleteLab(labId);
        await loadData();
      } catch (error) {
        alert("Failed to delete lab");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedState) return;
    
    setLoading(true);
    try {
      if (editingLab) {
        // Update existing
        await api.updateLab({
          ...editingLab,
          ...formData,
          state: selectedState
        });
      } else {
        // Create new
        await api.addLab({
          ...formData,
          state: selectedState,
          status: LabStatus.PENDING,
          reports: []
        });
      }
      await loadData();
      setIsFormOpen(false);
      setEditingLab(null);
    } catch (error) {
      alert("Failed to save lab details");
    } finally {
      setLoading(false);
    }
  };

  const filteredLabs = selectedState ? labs.filter(l => l.state === selectedState) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Issue Reported': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStateVisual = (state: string) => {
    const visuals: Record<string, { color: string, icon: React.ReactNode }> = {
       "Maharashtra": { color: "bg-blue-100 text-blue-600", icon: <Building2 size={24} /> },
       "Gujarat": { color: "bg-green-100 text-green-600", icon: <MapIcon size={24} /> },
       "Delhi": { color: "bg-red-100 text-red-600", icon: <Landmark size={24} /> },
       "Telangana": { color: "bg-yellow-100 text-yellow-600", icon: <Building2 size={24} /> },
       "Karnataka": { color: "bg-pink-100 text-pink-600", icon: <Landmark size={24} /> },
       "Tamil Nadu": { color: "bg-indigo-100 text-indigo-600", icon: <MapIcon size={24} /> },
       "Goa": { color: "bg-cyan-100 text-cyan-600", icon: <Palmtree size={24} /> },
       "Andhra Pradesh": { color: "bg-orange-100 text-orange-600", icon: <Landmark size={24} /> },
    };
    return visuals[state] || { color: "bg-gray-100 text-gray-600", icon: <MapIcon size={24} /> };
  };

  // --- Sidebar Component ---
  const Sidebar = () => (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white z-50 transform transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 bg-indigo-50">
           <h2 className="text-xl font-bold text-indigo-900">Admin Panel</h2>
           <p className="text-xs text-indigo-500 mt-1">Manage Labs & Reports</p>
        </div>
        <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
           <button 
             onClick={() => { setSelectedState(null); setIsSidebarOpen(false); }}
             className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium ${!selectedState ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <Home size={20} /> Dashboard
           </button>
           
           <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Regions</div>
           
           {INDIAN_STATES.map(state => (
             <button
                key={state}
                onClick={() => handleStateClick(state)}
                className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors ${selectedState === state ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
             >
                <span className={`w-2 h-2 rounded-full ${getStateVisual(state).color.split(' ')[0]}`}></span>
                {state}
             </button>
           ))}

           <div className="pt-8 border-t mt-4">
              <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium text-red-600 hover:bg-red-50">
                 <Trash2 size={20} /> Logout
              </button>
           </div>
        </div>
      </div>
    </>
  );

  // --- Form View ---
  if (isFormOpen && selectedState) {
    return (
       <div className="flex flex-col h-full bg-gray-50">
          <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                  <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <ArrowLeft size={20} />
                  </button>
                  <h1 className="font-bold text-lg">{editingLab ? 'Edit Lab' : 'Add New Lab'}</h1>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-5 animate-fadeIn">
              {/* Form fields same as before... */}
              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Lab Name</label>
                  <input 
                      required
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. City Path Labs"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                  />
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">District</label>
                  <input 
                      required
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="e.g. Mumbai Suburban"
                      value={formData.district}
                      onChange={e => setFormData({...formData, district: e.target.value})}
                  />
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Full Address</label>
                  <textarea 
                      required
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Street, Area, Pincode"
                      rows={3}
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact Person</label>
                      <input 
                          required
                          className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          placeholder="Name"
                          value={formData.contactPerson}
                          onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Phone</label>
                      <input 
                          required
                          type="tel"
                          className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                          placeholder="+91..."
                          value={formData.contactNumber}
                          onChange={e => setFormData({...formData, contactNumber: e.target.value})}
                      />
                  </div>
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</label>
                  <input 
                      required
                      type="email"
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="admin@lab.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                  />
              </div>

              <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Internal Notes</label>
                  <textarea 
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Any specific instructions for volunteers..."
                      rows={2}
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                  />
              </div>

              <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-2 w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Details</>}
                  </button>
              </div>
          </form>
       </div>
    );
  }

  // --- Grid View ---
  if (!selectedState) {
      return (
        <div className="flex flex-col h-full bg-white relative">
            <Sidebar />
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <button onClick={toggleSidebar} className="text-gray-800 hover:bg-gray-100 p-2 rounded-full transition-colors">
                    <Menu size={28} />
                </button>
                <div className="border-2 border-gray-800 px-3 py-1 rounded-lg">
                    <span className="font-bold text-lg text-gray-800 tracking-wider">Logo</span>
                </div>
                <button onClick={onLogout} className="text-gray-800 hover:bg-gray-100 p-2 rounded-full">
                    <UserCircle size={28} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                    {INDIAN_STATES.map((state) => {
                        const visual = getStateVisual(state);
                        return (
                            <button 
                                key={state}
                                onClick={() => handleStateClick(state)}
                                className="bg-white border-2 border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-3 aspect-[4/3] hover:bg-gray-50 active:scale-95 transition-all shadow-[4px_4px_0px_0px_rgba(31,41,55,1)]"
                            >
                                <div className={`p-2 rounded-full ${visual.color} bg-opacity-20`}>
                                    {visual.icon}
                                </div>
                                <span className="font-bold text-gray-800 text-sm text-center uppercase">
                                    {state === 'Andhra Pradesh' ? 'Andhra' : state}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {/* Stats placeholder */}
                <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-4 opacity-50">
                    <div className="h-2 w-3/4 bg-gray-100 rounded mb-2 mx-auto"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded mb-2 mx-auto"></div>
                    <div className="h-2 w-2/3 bg-gray-100 rounded mx-auto"></div>
                    <p className="text-xs text-gray-400 mt-2 text-center">Dashboard Stats Overview</p>
                </div>
            </div>
        </div>
      );
  }

  // --- List View ---
  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
        <Sidebar />
        <div className="bg-white p-4 border-b border-gray-200 flex flex-col gap-2 sticky top-0 z-10 shadow-sm">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-full">
                        <Menu size={24} />
                    </button>
                    <h1 className="font-bold text-lg text-gray-800">Labs</h1>
                </div>
                 <button onClick={onLogout} className="p-2 hover:bg-gray-100 rounded-full">
                    <UserCircle size={24} className="text-gray-600" />
                </button>
             </div>
             
             {/* Breadcrumbs */}
             <div className="flex items-center gap-2 text-xs text-gray-500 px-2">
                 <button onClick={() => setSelectedState(null)} className="hover:text-indigo-600 transition-colors">Dashboard</button>
                 <ChevronRight size={12} />
                 <span className="font-semibold text-gray-800">{selectedState}</span>
             </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto pb-20">
            {filteredLabs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Search size={32} className="mb-2 opacity-50" />
                    <p>No labs in this region</p>
                    <button 
                        onClick={handleAddNew}
                        className="mt-4 text-indigo-600 font-semibold text-sm hover:underline"
                    >
                        + Add the first lab
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredLabs.map(lab => (
                        <div key={lab.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow">
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(lab.id); }}
                                className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors z-10"
                                title="Delete Lab"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex justify-between items-start mb-2 pr-8">
                                <h3 className="font-bold text-gray-800">{lab.name}</h3>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${getStatusColor(lab.status)}`}>
                                    {lab.status}
                                </span>
                                <div className="flex items-center gap-1 text-gray-500 text-xs px-2 py-1 bg-gray-50 rounded-full border border-gray-100">
                                    <MapPin size={10} />
                                    <span>{lab.district}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-3 border-t pt-3">
                                <button 
                                    onClick={() => handleEdit(lab)}
                                    className="flex-1 py-2 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Edit2 size={14} /> Edit Info
                                </button>
                                <button className="flex-1 py-2 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 border border-indigo-100 flex items-center justify-center gap-2 transition-colors">
                                    View Reports <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <button 
            onClick={handleAddNew}
            className="absolute bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 active:scale-95 transition-all z-20"
        >
            <Plus size={28} />
        </button>
    </div>
  );
};