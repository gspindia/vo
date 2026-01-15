import React, { useState, useEffect } from 'react';
import { Lab, INDIAN_STATES, User } from '../types';
import { api } from '../services/api';
import { MapPin, ChevronRight, Activity, Search, Globe, Bell, LogOut, ArrowLeft, Building2, Map as MapIcon, Landmark, Palmtree, Check, Menu, UserCircle, HelpCircle, Phone, Mail, Home } from 'lucide-react';

interface VolunteerDashboardProps {
  onSelectLab: (lab: Lab) => void;
  onLogout: () => void;
  user: User;
}

type DashboardView = 'GRID' | 'LIST';
type DashboardSection = 'HOME' | 'PROFILE' | 'CONTACT_ADMIN';
type Language = 'EN' | 'HI';

const TRANSLATIONS = {
  EN: {
    volunteer: "VOLUNTEER",
    connect: "CONNECT",
    explore: "Explore by State",
    labsIn: "Labs in",
    noLabs: "No labs found",
    noLabsDesc: "There are no labs assigned to this state currently.",
    loading: "Loading labs...",
    viewDetails: "View Details",
    lastUpdated: "Last updated recently",
    back: "Back",
    profile: "My Profile",
    contactAdmin: "Contact Support",
    home: "Home"
  },
  HI: {
    volunteer: "स्वयंसेवक",
    connect: "कनेक्ट",
    explore: "राज्य चुनें",
    labsIn: "लैब -",
    noLabs: "कोई लैब नहीं मिली",
    noLabsDesc: "इस राज्य में कोई लैब उपलब्ध नहीं है।",
    loading: "लोड हो रहा है...",
    viewDetails: "विवरण देखें",
    lastUpdated: "हाल ही में अपडेट",
    back: "पीछे",
    profile: "मेरी प्रोफाइल",
    contactAdmin: "संपर्क करें",
    home: "होम"
  }
};

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ onSelectLab, onLogout, user }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('HOME');
  const [viewMode, setViewMode] = useState<DashboardView>('GRID');
  const [lang, setLang] = useState<Language>('EN');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const t = TRANSLATIONS[lang];

  // Initialize with user's state if valid, otherwise first state
  const getInitialState = () => {
    if (user.state && INDIAN_STATES.includes(user.state)) {
        return user.state;
    }
    return INDIAN_STATES[0];
  };

  const [selectedState, setSelectedState] = useState<string>(getInitialState);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const data = await api.getLabs();
        setLabs(data);
      } catch (e) {
        console.error("Failed to fetch labs", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    setViewMode('LIST');
  };

  const handleBackToGrid = () => {
    setViewMode('GRID');
  };

  const filteredLabs = labs.filter(lab => lab.state === selectedState);

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
       "Maharashtra": { color: "bg-orange-100 text-orange-600", icon: <Building2 size={32} /> },
       "Gujarat": { color: "bg-purple-100 text-purple-600", icon: <MapIcon size={32} /> },
       "Delhi": { color: "bg-blue-100 text-blue-600", icon: <Landmark size={32} /> },
       "Telangana": { color: "bg-yellow-100 text-yellow-600", icon: <Building2 size={32} /> },
       "Karnataka": { color: "bg-pink-100 text-pink-600", icon: <Landmark size={32} /> },
       "Tamil Nadu": { color: "bg-indigo-100 text-indigo-600", icon: <MapIcon size={32} /> },
       "Goa": { color: "bg-cyan-100 text-cyan-600", icon: <Palmtree size={32} /> },
       "Andhra Pradesh": { color: "bg-amber-100 text-amber-600", icon: <Landmark size={32} /> },
    };
    return visuals[state] || { color: "bg-gray-100 text-gray-600", icon: <MapIcon size={32} /> };
  };

  // --- Sidebar Component ---
  const Sidebar = () => (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div className={`fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white z-50 transform transition-transform duration-300 shadow-2xl flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-indigo-600 text-white">
           <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold mb-3">
              {user.name.charAt(0)}
           </div>
           <h2 className="text-lg font-bold">{user.name}</h2>
           <p className="text-xs text-indigo-200">ID: {user.volNo || 'N/A'}</p>
        </div>
        
        <div className="p-4 space-y-2 flex-1">
           <button 
             onClick={() => { setActiveSection('HOME'); setIsSidebarOpen(false); }}
             className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-colors ${activeSection === 'HOME' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <Home size={20} /> {t.home}
           </button>
           
           <button 
             onClick={() => { setActiveSection('PROFILE'); setIsSidebarOpen(false); }}
             className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-colors ${activeSection === 'PROFILE' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <UserCircle size={20} /> {t.profile}
           </button>

           <button 
             onClick={() => { setActiveSection('CONTACT_ADMIN'); setIsSidebarOpen(false); }}
             className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium transition-colors ${activeSection === 'CONTACT_ADMIN' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             <HelpCircle size={20} /> {t.contactAdmin}
           </button>
        </div>

        <div className="p-4 border-t">
          <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 font-medium text-red-600 hover:bg-red-50">
             <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </>
  );

  // --- Header Component ---
  const Header = () => (
    <div className="bg-white p-4 flex justify-between items-center border-b border-gray-100 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700">
           <Menu size={24} />
        </button>
        <div>
           <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-md">
                VO
                </div>
                <div className="hidden sm:block">
                    <p className="text-[10px] font-bold text-indigo-900 leading-none">{t.volunteer}</p>
                    <p className="text-[10px] text-gray-400 leading-none">{t.connect}</p>
                </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Dropdown */}
        <div className="relative">
            <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition"
            >
                <Globe size={14} className="text-indigo-600" />
                <span className="text-xs font-bold text-indigo-900">{lang === 'EN' ? 'EN' : 'HI'}</span>
            </button>
            
            {showLangMenu && (
                <>
                <div className="fixed inset-0 z-30" onClick={() => setShowLangMenu(false)}></div>
                <div className="absolute top-full mt-2 right-0 bg-white border border-gray-100 rounded-xl shadow-xl p-1 z-40 w-32 animate-fadeIn">
                    <button 
                        onClick={() => { setLang('EN'); setShowLangMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between transition-colors ${lang === 'EN' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        English {lang === 'EN' && <Check size={12} />}
                    </button>
                    <button 
                        onClick={() => { setLang('HI'); setShowLangMenu(false); }}
                        className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg flex items-center justify-between transition-colors ${lang === 'HI' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Hindi {lang === 'HI' && <Check size={12} />}
                    </button>
                </div>
                </>
            )}
        </div>
      </div>
    </div>
  );

  // --- Profile View ---
  if (activeSection === 'PROFILE') {
      return (
          <div className="flex flex-col h-full bg-gray-50">
              <Header />
              <Sidebar />
              <div className="p-6 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.profile}</h2>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="bg-indigo-600 p-8 flex flex-col items-center">
                          <div className="w-24 h-24 rounded-full bg-white p-1 mb-4 shadow-lg">
                              <div className="w-full h-full rounded-full bg-indigo-50 flex items-center justify-center text-4xl font-bold text-indigo-600">
                                  {user.name.charAt(0)}
                              </div>
                          </div>
                          <h3 className="text-xl font-bold text-white">{user.name}</h3>
                          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full mt-2">Volunteer</span>
                      </div>
                      <div className="p-6 space-y-4">
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase">Volunteer ID</label>
                              <p className="font-medium text-gray-800">{user.volNo || 'Not Assigned'}</p>
                          </div>
                          <hr className="border-gray-100" />
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase">Mobile Number</label>
                              <p className="font-medium text-gray-800">{user.mobile}</p>
                          </div>
                          <hr className="border-gray-100" />
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                              <p className="font-medium text-gray-800">{user.email}</p>
                          </div>
                          <hr className="border-gray-100" />
                          <div>
                              <label className="text-xs font-bold text-gray-400 uppercase">Assigned State</label>
                              <p className="font-medium text-gray-800">{user.state || 'None'}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- Contact Admin View ---
  if (activeSection === 'CONTACT_ADMIN') {
      return (
          <div className="flex flex-col h-full bg-gray-50">
              <Header />
              <Sidebar />
              <div className="p-6 animate-fadeIn">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.contactAdmin}</h2>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                      <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                              <HelpCircle size={32} />
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Central Support</h3>
                              <p className="text-sm text-gray-500">Available Mon-Fri, 9am - 6pm</p>
                          </div>
                      </div>
                      
                      <div className="space-y-4">
                          <a href="tel:+919999999999" className="flex items-center gap-4 p-4 rounded-xl bg-green-50 text-green-800 hover:bg-green-100 transition-colors">
                              <Phone size={24} />
                              <div>
                                  <p className="text-xs font-bold opacity-70 uppercase">Helpline</p>
                                  <p className="font-bold">+91 99999 99999</p>
                              </div>
                          </a>
                          
                          <a href="mailto:support@vollab.com" className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors">
                              <Mail size={24} />
                              <div>
                                  <p className="text-xs font-bold opacity-70 uppercase">Email Support</p>
                                  <p className="font-bold">support@vollab.com</p>
                              </div>
                          </a>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- GRID VIEW ---
  if (viewMode === 'GRID') {
    return (
      <div className="flex flex-col h-full bg-gray-50/50">
        <Sidebar />
        <Header />
        
        <div className="flex-1 overflow-y-auto p-4 animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-800 mb-6 mt-2 px-1">{t.explore}</h2>
          
          <div className="grid grid-cols-2 gap-4 pb-8">
            {INDIAN_STATES.map((state) => {
              const visual = getStateVisual(state);
              return (
                <button
                  key={state}
                  onClick={() => handleStateClick(state)}
                  className="group relative flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Visual Area (Top 70%) */}
                  <div className={`h-24 w-full ${visual.color} flex items-center justify-center relative overflow-hidden`}>
                     {/* Decorative circle */}
                     <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/20 rounded-full"></div>
                     <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        {visual.icon}
                     </div>
                  </div>
                  
                  {/* Text Area (Bottom 30%) */}
                  <div className="p-3 w-full flex items-center justify-center bg-white">
                    <span className="font-bold text-gray-800 text-xs sm:text-sm tracking-wide uppercase truncate">
                        {state === 'Andhra Pradesh' ? 'Andhra' : state}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Sidebar />
      <Header />
      
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b sticky top-[73px] z-10">
        <div className="flex items-center p-2 gap-2">
            <button onClick={handleBackToGrid} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition">
                <ArrowLeft size={20} />
            </button>
            <div className="flex-1 overflow-x-auto no-scrollbar flex gap-2 pr-2">
                 {INDIAN_STATES.map((state) => (
                    <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        selectedState === state
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                    >
                    {state}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-500 text-sm">
                {filteredLabs.length} {t.labsIn} <span className="text-gray-900 font-semibold">{selectedState}</span>
            </h3>
            <Activity size={16} className="text-gray-400" />
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 gap-2">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm">{t.loading}</p>
            </div>
        ) : (
            <div className="space-y-3">
            {filteredLabs.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
                    <Search className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">{t.noLabs}</p>
                    <p className="text-xs text-gray-400 mt-1">{t.noLabsDesc}</p>
                </div>
            ) : (
                filteredLabs.map((lab) => (
                    <div 
                        key={lab.id}
                        onClick={() => onSelectLab(lab)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md hover:border-indigo-200"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg leading-tight">{lab.name}</h4>
                                <div className="flex items-center gap-1 text-gray-500 text-xs mt-1.5">
                                    <MapPin size={12} />
                                    <span>{lab.district}</span>
                                </div>
                            </div>
                            <span className={`text-[10px] px-2 py-1 rounded-full border font-bold uppercase tracking-wide ${getStatusColor(lab.status)}`}>
                                {lab.status}
                            </span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.lastUpdated}</span>
                            <div className="flex items-center text-indigo-600 text-xs font-bold uppercase tracking-wide">
                                {t.viewDetails} <ChevronRight size={14} />
                            </div>
                        </div>
                    </div>
                ))
            )}
            </div>
        )}
      </div>
    </div>
  );
};