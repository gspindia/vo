import React, { useState } from 'react';
import { User, Lab, ViewState, UserRole } from './types';
import { Auth } from './components/Auth';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LabDetail } from './components/LabDetail';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('AUTH');
  const [selectedLab, setSelectedLab] = useState<Lab | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedLab(null);
    setView('AUTH');
  };

  const handleSelectLab = (lab: Lab) => {
    setSelectedLab(lab);
    setView('LAB_DETAIL');
  };

  const handleBackToDashboard = () => {
    setSelectedLab(null);
    setView('DASHBOARD');
  };

  // 1. Auth View
  if (!user || view === 'AUTH') {
    return <Auth onLogin={handleLogin} />;
  }

  // 2. Lab Detail View (Full Screen)
  if (view === 'LAB_DETAIL' && selectedLab) {
    return <LabDetail lab={selectedLab} onBack={handleBackToDashboard} />;
  }

  // 3. Main Dashboard (Volunteer or Admin)
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative">
      {/* Header removed from here, delegated to Dashboards for custom styling */}
      
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {user.role === UserRole.ADMIN ? (
          <AdminDashboard user={user} onLogout={handleLogout} />
        ) : (
          <VolunteerDashboard 
            user={user} 
            onSelectLab={handleSelectLab} 
            onLogout={handleLogout}
          />
        )}
      </main>

    </div>
  );
};

export default App;