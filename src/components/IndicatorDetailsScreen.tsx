import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, HeartPulse, Droplet, Scale, Activity, Ribbon, Stethoscope, Plus, Calendar 
} from 'lucide-react';

interface IndicatorDetailsProps {
  t: any;
  isAr: boolean;
  selectedPatient: any;
  spData: any;
  selectedIndicatorId: string;
  setSelectedIndicatorId: (id: string | null) => void;
  setIsAddTestModalOpen: (val: boolean) => void;
}

export const IndicatorDetailsScreen: React.FC<IndicatorDetailsProps> = ({
  t, isAr, selectedPatient, spData, selectedIndicatorId, setSelectedIndicatorId, setIsAddTestModalOpen
}) => {
  const indicatorsList = [
    { id: 'bp', title: t.bp, desc: t.bpDesc, icon: HeartPulse, iconColor: 'text-red-500 dark:text-red-400', iconBg: 'bg-red-50 dark:bg-red-500/10', data: selectedPatient.indicators.bp },
    { id: 'sugar', title: t.sugar, desc: t.sugarDesc, icon: Droplet, iconColor: 'text-blue-500 dark:text-blue-400', iconBg: 'bg-blue-50 dark:bg-blue-500/10', data: selectedPatient.indicators.sugar },
    { id: 'obesity', title: t.obesity, desc: t.obesityDesc, icon: Scale, iconColor: 'text-amber-500 dark:text-amber-400', iconBg: 'bg-amber-50 dark:bg-amber-500/10', data: selectedPatient.indicators.obesity },
    { id: 'fat', title: t.fat, desc: t.fatDesc, icon: Activity, iconColor: 'text-purple-500 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-500/10', data: selectedPatient.indicators.fat },
    { id: 'breastCancer', title: t.breastCancer, desc: t.breastCancerDesc, icon: Ribbon, iconColor: 'text-pink-500 dark:text-pink-400', iconBg: 'bg-pink-50 dark:bg-pink-500/10', data: selectedPatient.indicators.breastCancer },
    { id: 'colon', title: t.colon, desc: t.colonDesc, icon: Stethoscope, iconColor: 'text-emerald-500 dark:text-emerald-400', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', data: selectedPatient.indicators.colon },
  ];
  const actInd = indicatorsList.find(i => i.id === selectedIndicatorId);
  if (!actInd) return null;
  const Icon = actInd.icon;
  
  const displayRecords = actInd.data.records || (actInd.data.count > 0 ? [
    {
      id: 1,
      titleAr: `قياس ${actInd.title}`,
      titleEn: `${actInd.title} Measurement`,
      result: selectedIndicatorId === 'bp' ? '160/100 mmHg' : '150 mg/dL',
      dateAr: actInd.data.lastDateAr || '٢٥ مارس ٢٠٢٥',
      dateEn: actInd.data.lastDateEn || 'Mar 25, 2025',
      status: 'normal',
      statusTextAr: 'طبيعي',
      statusTextEn: 'Normal',
      notesAr: 'نتيجة الفحص السابق',
      notesEn: 'Previous test result',
      isLatest: true
    }
  ] : []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: isAr ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="px-5 md:px-10 mt-6 md:mt-10 pb-12"
    >
      <button 
        onClick={() => setSelectedIndicatorId(null)}
        className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-teal-600 transition-colors font-black mb-8 text-[16px] md:text-[17px] active:scale-95 w-fit group"
      >
        <div className="group-hover:translate-x-rtl-1 group-hover:translate-x-ltr--1 transition-transform">
          {isAr ? <ArrowRight size={22} strokeWidth={3} /> : <ArrowLeft size={22} strokeWidth={3} />}
        </div>
        <span>{t.backToPatientPage}</span>
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-[40px] border-2 border-slate-50 dark:border-slate-700/50 overflow-hidden shadow-sm mb-12 flex flex-col items-center pt-12 pb-10 text-center px-6 max-w-2xl mx-auto group">
          <div className={`w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-[32px] ${actInd.iconBg} ${actInd.iconColor} flex items-center justify-center shadow-xl shadow-current transition-all group-hover:scale-110 group-hover:rotate-6 mb-8`}>
              <Icon size={56} strokeWidth={2.5} />
          </div>
          <h3 className="text-slate-400 dark:text-slate-500 text-[14px] md:text-[16px] font-black uppercase tracking-widest mb-2">{spData.name}</h3>
          <h2 className="text-slate-800 dark:text-slate-100 text-[32px] md:text-[42px] font-black mb-3 tracking-tight">{actInd.title}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[16px] md:text-[18px] mb-10 font-bold max-w-md">{actInd.desc}</p>
          
          <button 
             onClick={() => setIsAddTestModalOpen(true)}
             className="flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white px-10 py-5 rounded-[24px] font-black text-[18px] transition-all hover:shadow-2xl hover:shadow-teal-500/30 active:scale-95 w-full sm:w-auto"
          >
             <Plus size={24} strokeWidth={3} />
             <span>{t.addAnalysis}</span>
          </button>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6">
         {displayRecords.map((record: any) => (
             <div key={record.id} className="bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700/50 rounded-[32px] p-7 sm:p-10 flex flex-col relative group hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-3">
                            <h4 className="text-[20px] md:text-[24px] font-black text-slate-800 dark:text-slate-100 tracking-tight">
                                 {isAr ? record.titleAr : record.titleEn}
                            </h4>
                            {record.isLatest && (
                                <span className="bg-teal-500 text-white font-black text-[12px] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-teal-500/20">
                                    {t.latestBadge}
                                </span>
                            )}
                       </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-10 gap-y-4 mb-8 items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[24px]">
                       <div className="flex flex-col gap-1">
                            <span className="text-slate-400 dark:text-slate-500 font-black text-[12px] uppercase tracking-widest">{t.resultLabel}</span>
                            <span className="text-slate-800 dark:text-slate-100 font-black text-[24px]" dir="ltr">{record.result}</span>
                       </div>
                       <div className="flex flex-col gap-1">
                            <span className="text-slate-400 dark:text-slate-500 font-black text-[12px] uppercase tracking-widest">{isAr ? 'الحالة' : 'Status'}</span>
                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-black border ${record.status === 'critical' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30'}`}>
                                 <div className={`w-2.5 h-2.5 rounded-full ${record.status === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                                 <span className="uppercase tracking-wider">{isAr ? record.statusTextAr : record.statusTextEn}</span>
                            </div>
                       </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 text-[15px] font-black">
                         <Calendar size={20} strokeWidth={2.5} />
                         <span dir="ltr">{isAr ? record.dateAr : record.dateEn}</span>
                    </div>
                  </div>

                  {record.notesAr && (
                       <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                            <p className="text-[15px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                              <span className="text-slate-800 dark:text-slate-200 font-black mr-2 uppercase tracking-wide text-[13px] block mb-2">{t.notesLabel}</span>
                              {isAr ? record.notesAr : record.notesEn}
                            </p>
                       </div>
                  )}
             </div>
         ))}
      </div>
    </motion.div>
  );
};
