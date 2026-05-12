import React from 'react';
import { Users, BarChart2 } from 'lucide-react';

interface TabsProps {
  t: any;
  activeTab: 'patients' | 'statistics' | 'profile';
  selectedPatientId: number | null;
  setActiveTab: (tab: 'patients' | 'statistics' | 'profile') => void;
  setSelectedPatientId: (id: number | null) => void;
  setSelectedIndicatorId: (id: string | null) => void;
}

export const NavigationTabs: React.FC<TabsProps> = ({
  t, activeTab, selectedPatientId, setActiveTab, setSelectedPatientId, setSelectedIndicatorId
}) => {
  return (
    <div className="bg-white/50 dark:bg-slate-900/50 px-4 md:px-10 py-4 flex gap-4 md:gap-8 justify-center md:justify-start transition-colors overflow-x-auto no-scrollbar">
      <button 
        onClick={() => { setActiveTab('patients'); setSelectedPatientId(null); setSelectedIndicatorId(null); }}
        className={`group relative flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[22px] font-black text-[16px] md:text-[17px] transition-all duration-300 active:scale-95 ${
          activeTab === 'patients' && selectedPatientId === null
            ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/25' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <Users size={20} className={`shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'patients' && selectedPatientId === null ? 'animate-pulse' : ''}`} strokeWidth={2.5} />
        <span>{t.patientsTab}</span>
      </button>
      <button 
        onClick={() => { setActiveTab('statistics'); setSelectedPatientId(null); setSelectedIndicatorId(null); }}
        className={`group relative flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[22px] font-black text-[16px] md:text-[17px] transition-all duration-300 active:scale-95 ${
          activeTab === 'statistics' && selectedPatientId === null 
            ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/25' 
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <BarChart2 size={20} strokeWidth={2.5} className={`shrink-0 transition-transform group-hover:scale-110 ${activeTab === 'statistics' && selectedPatientId === null ? 'animate-pulse' : ''}`} />
        <span>{t.statsTab}</span>
      </button>
    </div>
  );
};
