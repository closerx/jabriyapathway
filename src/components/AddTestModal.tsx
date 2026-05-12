import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar } from 'lucide-react';

interface AddTestModalProps {
  t: any;
  isAr: boolean;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  form: any;
  setForm: (form: any) => void;
  errors: Record<string, string>;
  handleSave: () => void;
  selectedIndicatorTitle: string | undefined;
}

export const AddTestModal: React.FC<AddTestModalProps> = ({
  t, isAr, isOpen, setIsOpen, form, setForm, errors, handleSave, selectedIndicatorTitle
}) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-center items-end sm:items-center p-0 sm:p-4 md:p-6"
    >
      <div 
        className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-md transition-opacity" 
        onClick={() => setIsOpen(false)}
      ></div>
      
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

        <div className="flex flex-col items-start pr-1 sm:pr-2">
          <h2 className="text-[24px] md:text-[28px] font-black text-[#1e293b] dark:text-slate-100 mb-1 leading-tight">{t.addTestTitle}</h2>
          {selectedIndicatorTitle && (
            <p className="text-[14px] md:text-[16px] font-bold text-[#00a89d] dark:text-teal-400 mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a89d]"></span>
              {selectedIndicatorTitle}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.testNameLabel}</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className={`w-full bg-[#f8fafc] border ${errors.testName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-[#00a89d]'} focus:bg-white rounded-[16px] px-5 py-3.5 md:py-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#00a89d]/20 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm`}
              placeholder={isAr ? 'مثال: فحص السكر التراكمي' : 'e.g. HbA1c Test'}
            />
            {errors.testName && <span className="text-red-500 text-[13px] px-1">{errors.testName}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.resultInputLabel}</label>
            <input
              type="text"
              value={form.result}
              onChange={(e) => setForm({...form, result: e.target.value})}
              className={`w-full bg-[#f8fafc] border ${errors.testResult ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-slate-700 focus:border-[#00a89d]'} focus:bg-white rounded-[16px] px-5 py-3.5 md:py-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#00a89d]/20 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm`}
              placeholder={isAr ? 'مثال: 120 mg/dL' : 'e.g. 120 mg/dL'}
              dir="ltr"
            />
            {errors.testResult && <span className="text-red-500 text-[13px] px-1">{errors.testResult}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <div className="flex flex-col gap-2 relative">
              <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.procedureDateLabel}</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className="w-full bg-[#f8fafc] border border-gray-200 dark:border-slate-700 focus:bg-white rounded-[16px] px-5 py-3.5 md:py-4 text-[16px] focus:outline-none focus:border-[#00a89d] focus:ring-2 focus:ring-[#00a89d]/20 transition-all font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm appearance-none"
              />
              <div className={`absolute top-[46px] md:top-[48px] ${isAr ? 'left-4' : 'right-4'} pointer-events-none text-slate-400`}>
                 <Calendar size={20} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.statusLabel}</label>
              <div className="flex bg-[#f8fafc] dark:bg-slate-900 p-1.5 rounded-[16px] border border-gray-200 dark:border-slate-700">
                <button
                   type="button"
                   onClick={() => setForm({...form, status: 'normal'})}
                   className={`flex-1 py-2 md:py-2.5 rounded-[12px] text-[13px] md:text-[14px] font-bold transition-all ${form.status === 'normal' ? 'bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100 dark:border-emerald-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                   {t.statusOptions?.normal || 'طبيعي'}
                </button>
                <button
                   type="button"
                   onClick={() => setForm({...form, status: 'critical'})}
                   className={`flex-1 py-2 md:py-2.5 rounded-[12px] text-[13px] md:text-[14px] font-bold transition-all ${form.status === 'critical' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100 dark:border-red-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                   {t.statusOptions?.critical || 'حرج'}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[14px] md:text-[15px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.notesInputLabel}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              className="w-full bg-[#f8fafc] border border-gray-200 dark:border-slate-700 focus:bg-white rounded-[16px] px-5 py-4 text-[16px] focus:outline-none focus:border-[#00a89d] focus:ring-2 focus:ring-[#00a89d]/20 transition-all font-medium text-slate-800 dark:text-slate-100 dark:bg-slate-900 shadow-sm resize-none"
              rows={3}
              placeholder={isAr ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-[#004e92] to-[#00a89d] hover:opacity-90 text-white py-3.5 md:py-4 rounded-[14px] md:rounded-[16px] font-bold text-[16px] md:text-[17px] transition-colors shadow-md active:scale-95"
          >
            {t.saveTest}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 text-[#475569] dark:text-slate-300 py-3.5 md:py-4 rounded-[14px] md:rounded-[16px] font-bold text-[16px] md:text-[17px] transition-colors active:scale-95 shadow-sm"
          >
            {t.cancelTest}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
