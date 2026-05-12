import React from 'react';
import { motion } from 'motion/react';
import { X, Calendar } from 'lucide-react';

interface PatientFormModalProps {
  t: any;
  isAr: boolean;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  form: any;
  setForm: (form: any) => void;
  errors: Record<string, string>;
  handleSave: () => void;
  title: string;
  subtitle: string;
  saveText: string;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  t, isAr, isOpen, setIsOpen, form, setForm, errors, handleSave, title, subtitle, saveText
}) => {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 md:p-6"
    >
      <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md transition-opacity" onClick={() => setIsOpen(false)}></div>
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white dark:bg-slate-800 w-full sm:w-[95%] md:max-w-xl rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 md:gap-8 shadow-2xl max-h-[95vh] overflow-y-auto border border-white/20"
      >
        <div className="absolute top-6 ltr:right-6 rtl:left-6 md:top-8 md:ltr:right-8 md:rtl:left-8">
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 md:w-11 md:h-11 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={20} className="md:w-[22px] md:h-[22px]" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mt-2">
          <h2 className="text-[24px] md:text-[28px] font-black text-[#1e293b] dark:text-slate-100 mb-1">{title}</h2>
          <p className="text-[14px] md:text-[16px] font-medium text-[#64748b] dark:text-slate-400 max-w-[80%] mx-auto">{subtitle}</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.patientNameForm} <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className={`w-full bg-[#f8fafc] border ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-slate-700 focus:border-[#00a89d] focus:ring-[#00a89d]/20'} focus:bg-white rounded-[16px] px-5 py-4 text-[16px] focus:outline-none focus:ring-2 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm`}
            />
            {errors.name && <span className="text-red-500 text-[13px] px-1">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.civilIdForm} <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.civilId}
              onChange={(e) => setForm({...form, civilId: e.target.value})}
              className={`w-full bg-[#f8fafc] border ${errors.civilId ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 dark:border-slate-700 focus:border-[#00a89d] focus:ring-[#00a89d]/20'} focus:bg-white rounded-[16px] px-5 py-4 text-[16px] focus:outline-none focus:ring-2 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm`}
            />
            {errors.civilId && <span className="text-red-500 text-[13px] px-1">{errors.civilId}</span>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.genderForm} <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({...form, gender: 'male'})}
                  className={`flex-1 py-4 rounded-[16px] font-bold text-[16px] transition-all flex items-center justify-center gap-2 border-2 ${form.gender === 'male' ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-500' : 'bg-gray-50 border-gray-100 text-slate-500 dark:bg-slate-900 dark:border-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${form.gender === 'male' ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-transparent'}`} />
                  {t.male}
                </button>
                <button
                  type="button"
                  onClick={() => setForm({...form, gender: 'female'})}
                  className={`flex-1 py-4 rounded-[16px] font-bold text-[16px] transition-all flex items-center justify-center gap-2 border-2 ${form.gender === 'female' ? 'bg-pink-50 border-pink-500 text-pink-600 dark:bg-pink-900/30 dark:border-pink-500' : 'bg-gray-50 border-gray-100 text-slate-500 dark:bg-slate-900 dark:border-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 ${form.gender === 'female' ? 'border-pink-500 bg-pink-500' : 'border-gray-300 bg-transparent'}`} />
                  {t.female}
                </button>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.phoneForm}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  setForm({...form, phone: val});
                }}
                className="w-full bg-[#f8fafc] border border-gray-200 dark:border-slate-700 focus:bg-white rounded-[16px] px-5 py-4 text-[16px] focus:outline-none focus:border-[#00a89d] focus:ring-2 focus:ring-[#00a89d]/20 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm"
                dir="ltr"
                placeholder="0XXXXXXXXX"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.birthDate} <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({...form, birthDate: e.target.value})}
                className={`w-full bg-[#f8fafc] border ${errors.birthDate ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-[#00a89d]'} focus:bg-white rounded-[16px] px-5 py-4 text-[16px] focus:outline-none focus:ring-2 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm appearance-none`}
              />
              <div className={`absolute top-[48px] ${isAr ? 'left-4' : 'right-4'} pointer-events-none text-slate-400`}>
                 <Calendar size={20} />
              </div>
              {errors.birthDate && <span className="text-red-500 text-[13px] px-1">{errors.birthDate}</span>}
            </div>
            
            <div className="flex flex-col gap-2 relative">
              <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.lastVisit}</label>
              <input
                type="date"
                value={form.lastVisit}
                onChange={(e) => setForm({...form, lastVisit: e.target.value})}
                className="w-full bg-[#f8fafc] border border-gray-200 dark:border-slate-700 focus:bg-white rounded-[16px] px-5 py-4 text-[16px] focus:outline-none focus:border-[#00a89d] focus:ring-2 focus:ring-[#00a89d]/20 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm appearance-none"
              />
              <div className={`absolute top-[48px] ${isAr ? 'left-4' : 'right-4'} pointer-events-none text-slate-400`}>
                 <Calendar size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button 
            onClick={handleSave}
            className="w-full bg-[#00a89d] hover:bg-[#008f85] text-white py-4.5 rounded-[20px] font-black text-[18px] transition-all shadow-[0_8px_20px_rgba(0,168,157,0.25)] active:scale-95 flex items-center justify-center gap-2"
          >
            {saveText}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 text-slate-500 dark:text-slate-400 py-4.5 rounded-[20px] font-bold text-[18px] transition-all active:scale-95"
          >
            {t.cancel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
