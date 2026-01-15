import React, { useState } from 'react';
import { Lab, LabStatus } from '../types';
import { ArrowLeft, Phone, Mail, Map, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { api } from '../services/api';

interface LabDetailProps {
  lab: Lab;
  onBack: () => void;
}

type Tab = 'detail' | 'status' | 'report' | 'contact';

export const LabDetail: React.FC<LabDetailProps> = ({ lab: initialLab, onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('contact'); // Default to contact since detail is empty

  const [lab, setLab] = useState<Lab>(initialLab);

  const handleStatusChange = async (newStatus: LabStatus) => {
    // Optimistic update
    setLab({...lab, status: newStatus});
    await api.updateLabStatus(lab.id, newStatus);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'detail':
        return (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-fadeIn">
            <p>No additional details available.</p>
          </div>
        );
      case 'status':
        return (
          <div className="space-y-4 animate-fadeIn">
             <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-4">Current Status</h3>
                
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(LabStatus).map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`p-4 rounded-lg border text-left flex items-center gap-3 transition-all ${
                                lab.status === status 
                                ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' 
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                lab.status === status ? 'border-indigo-600' : 'border-gray-400'
                            }`}>
                                {lab.status === status && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                            </div>
                            <span className={`font-medium ${lab.status === status ? 'text-indigo-900' : 'text-gray-700'}`}>
                                {status}
                            </span>
                        </button>
                    ))}
                </div>
             </div>
             <p className="text-xs text-gray-400 text-center">Tap to update status immediately.</p>
          </div>
        );
      case 'report':
        return (
          <div className="space-y-4 animate-fadeIn">
            {lab.reports.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed">
                    <FileText className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-500">No reports submitted yet.</p>
                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg">Add New Report</button>
                </div>
            ) : (
                lab.reports.map(report => (
                    <div key={report.id} className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">{report.summary}</h4>
                                <p className="text-xs text-gray-500">{report.date}</p>
                            </div>
                        </div>
                        <button className="text-indigo-600 text-sm font-medium">View</button>
                    </div>
                ))
            )}
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4 animate-fadeIn">
            {/* General Info moved from Detail */}
            <div className="bg-white p-5 rounded-xl border shadow-sm">
               <h3 className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-3">General Info</h3>
               <div className="space-y-3">
                   <div>
                       <label className="text-xs text-gray-400">Lab Name</label>
                       <p className="font-medium text-gray-800">{lab.name}</p>
                   </div>
                   <div>
                       <label className="text-xs text-gray-400">Address</label>
                       <p className="font-medium text-gray-800">{lab.address}</p>
                   </div>
                   <div>
                       <label className="text-xs text-gray-400">District/State</label>
                       <p className="font-medium text-gray-800">{lab.district}, {lab.state}</p>
                   </div>
               </div>
            </div>
            
            {lab.notes && (
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm">
                    <strong>Note:</strong> {lab.notes}
                </div>
            )}

            <div className="bg-white p-5 rounded-xl border shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600">
                        {lab.contactPerson.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-gray-800">{lab.contactPerson}</h3>
                        <p className="text-gray-500 text-sm">Lab Manager</p>
                    </div>
                </div>
                <hr />
                <div className="space-y-4 pt-2">
                    <a href={`tel:${lab.contactNumber}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-800 hover:bg-green-100 transition">
                        <Phone size={20} />
                        <span className="font-medium">Call {lab.contactNumber}</span>
                    </a>
                    <a href={`mailto:${lab.email}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-blue-800 hover:bg-blue-100 transition">
                        <Mail size={20} />
                        <span className="font-medium">Email {lab.email}</span>
                    </a>
                </div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border shadow-sm">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Map size={18} className="text-gray-400" />
                    <span>Location Map</span>
                </h4>
                <div className="mt-0 h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    Map Placeholder
                </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b flex items-center gap-3 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 overflow-hidden">
            <h1 className="text-lg font-bold truncate text-gray-900">{lab.name}</h1>
            <p className="text-xs text-gray-500 truncate">{lab.district}, {lab.state}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b px-2">
        <div className="flex justify-between">
            {(['detail', 'status', 'report', 'contact'] as Tab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 capitalize transition-colors ${
                        activeTab === tab 
                        ? 'border-indigo-600 text-indigo-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};
