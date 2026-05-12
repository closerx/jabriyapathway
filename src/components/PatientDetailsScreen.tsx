import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, ArrowLeft, Pencil, IdCard, UserIcon, Calendar, Phone, 
  HeartPulse, Droplet, Scale, Activity, Ribbon, Stethoscope 
} from 'lucide-react';

interface PatientDetailsScreenProps {
  t: any;
  isAr: boolean;
  selectedPatient: any;
  spData: any;
  setSelectedPatientId: (id: number | null) => void;
  setSelectedIndicatorId: (id: string | null) => void;
  setPatientForm: (form: any) => void;
  setIsEditModalOpen: (val: boolean) => void;
}

export const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({
  t, isAr, selectedPatient, spData, setSelectedPatientId, setSelectedIndicatorId, 
  setPatientForm, setIsEditModalOpen
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="px-5 md:px-10 mt-6 md:mt-10 pb-12"
    >
      <button 
        onClick={() => setSelectedPatientId(null)}
        className="flex items-center gap-2 text-[#94a3b8] dark:text-slate-500 hover:text-[#004e92] transition-colors font-bold mb-8 text-[16px] md:text-[17px] active:scale-95 w-fit"
      >
        {isAr ? <ArrowRight size={22} /> : <ArrowLeft size={22} />}
        <span>{t.backToPatients}</span>
      </button>

      {/* Patient Top Card */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-50 dark:border-slate-700/50 overflow-hidden shadow-sm mb-10 md:mb-12">
        <div className="bg-slate-50/30 dark:bg-slate-800/50 p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] min-w-[100px] sm:min-w-[120px] rounded-[32px] bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-[48px] sm:text-[56px] font-black shadow-2xl shadow-teal-500/20 pb-1 ring-8 ring-teal-500/5">
              {spData.initial}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[28px] sm:text-[36px] font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tight">
                  {spData.name}
                </h2>
                <span className={`px-4 py-1 rounded-full text-[13px] font-black uppercase tracking-wider ${selectedPatient?.gender === 'male' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-pink-100 text-pink-600 dark:bg-pink-900/30'}`}>
                  {selectedPatient?.gender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}
                </span>
              </div>
              <p className="text-slate-400 dark:text-slate-500 text-[18px] font-bold">
                {spData.age}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setPatientForm({
                name: spData?.name || '',
                civilId: selectedPatient?.idNumber || '',
                age: spData?.age?.replace(/[^0-9]/g, '') || '',
                phone: spData?.phone || '',
                birthDate: spData?.birthDate || '', 
                lastVisit: spData?.visit || '',
                gender: selectedPatient?.gender || 'male'
              });
              setIsEditModalOpen(true);
            }}
            className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/30 px-8 py-4 rounded-[22px] font-black text-[16px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 whitespace-nowrap"
          >
            <Pencil size={20} strokeWidth={2.5} />
            <span>{t.editData}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 ltr:sm:divide-x rtl:sm:divide-x-reverse divide-slate-100 dark:divide-slate-700/50">
          {[
            { label: t.civilIdForm, value: selectedPatient.idNumber, icon: IdCard },
            { label: t.birthDate, value: spData?.birthDate || '', icon: UserIcon },
            { label: t.lastVisit, value: spData?.visit || '', icon: Calendar },
            { label: t.phoneForm, value: spData?.phone || '', icon: Phone, dir: 'ltr' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 sm:p-8 flex flex-col items-start bg-white dark:bg-slate-800 active:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500 mb-2">
                <item.icon size={18} />
                <span className="font-black text-[13px] uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="font-black text-slate-800 dark:text-slate-100 text-[18px]" dir={item.dir}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Indicators Section */}
      <div className="mb-6 md:mb-8 text-center sm:text-start">
        <h3 className="text-[22px] sm:text-[26px] font-extrabold text-[#1e293b] dark:text-slate-100 mb-1.5">{t.healthIndicatorsTitle}</h3>
        <p className="text-[#64748b] dark:text-slate-400 text-[15px] sm:text-[16px] font-medium">{t.healthIndicatorsDesc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[
          { id: 'bp', title: t.bp, desc: t.bpDesc, icon: HeartPulse, iconColor: 'text-red-500', iconBg: 'bg-red-50 dark:bg-red-500/10', data: selectedPatient.indicators.bp },
          { id: 'sugar', title: t.sugar, desc: t.sugarDesc, icon: Droplet, iconColor: 'text-blue-500', iconBg: 'bg-blue-50 dark:bg-blue-500/10', data: selectedPatient.indicators.sugar },
          { id: 'obesity', title: t.obesity, desc: t.obesityDesc, icon: Scale, iconColor: 'text-amber-500', iconBg: 'bg-amber-50 dark:bg-amber-500/10', data: selectedPatient.indicators.obesity },
          { id: 'fat', title: t.fat, desc: t.fatDesc, icon: Activity, iconColor: 'text-purple-500', iconBg: 'bg-purple-50 dark:bg-purple-500/10', data: selectedPatient.indicators.fat },
          { id: 'breastCancer', title: t.breastCancer, desc: t.breastCancerDesc, icon: Ribbon, iconColor: 'text-pink-500', iconBg: 'bg-pink-50 dark:bg-pink-500/10', data: selectedPatient.indicators.breastCancer },
          { id: 'colon', title: t.colon, desc: t.colonDesc, icon: Stethoscope, iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10', data: selectedPatient.indicators.colon },
        ].map((indicator, index) => {
          const Icon = indicator.icon;
          const hasTests = indicator.data.count > 0;
          const lastTestText = hasTests ? `${t.lastTest} ${isAr ? indicator.data.lastDateAr : indicator.data.lastDateEn}` : t.noTestsYet;

          return (
            <motion.div 
              key={indicator.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedIndicatorId(indicator.id)}
              className="bg-white dark:bg-slate-800 rounded-[32px] border-2 border-slate-50 dark:border-slate-700/50 p-6 sm:p-8 relative cursor-pointer hover:shadow-2xl hover:shadow-teal-500/10 hover:border-teal-500/30 transition-all duration-300 active:scale-[0.98] group flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-50 dark:bg-slate-900 group-hover:bg-teal-500 group-hover:text-white transition-all rounded-xl px-4 py-1.5 text-[13px] font-black uppercase tracking-widest whitespace-nowrap shadow-sm">
                  {indicator.data.count} {t.testCount}
                </div>
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] ${indicator.iconBg} ${indicator.iconColor} flex items-center justify-center shrink-0 shadow-sm group-hover:rotate-6 group-hover:scale-110 transition-all`}>
                  <Icon size={30} strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-start flex-1">
                <h4 className="text-[20px] sm:text-[22px] font-black text-slate-800 dark:text-slate-100 mb-2 group-hover:text-teal-600 transition-colors">{indicator.title}</h4>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-[14px] sm:text-[15px] mb-6 leading-relaxed line-clamp-2">{indicator.desc}</p>
              </div>
              <div className="h-1 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden mb-4">
                 <div className={`h-full bg-teal-500 rounded-full w-0 group-hover:w-[${Math.min(100, indicator.data.count * 10)}%] transition-all duration-1000`} />
              </div>
              <div className="text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors text-[13px] font-black uppercase tracking-wider text-start">
                {lastTestText}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
