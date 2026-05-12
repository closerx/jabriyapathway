import React from 'react';
import { motion } from 'motion/react';
import { X, Target } from 'lucide-react';

interface EditGoalModalProps {
  t: any;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  editingGoal: any;
  newTargetValue: string;
  setNewTargetValue: (val: string) => void;
  saveGoalUpdate: () => void;
  goalsColorsMap: any;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({
  t, isOpen, setIsOpen, editingGoal, newTargetValue, setNewTargetValue, saveGoalUpdate, goalsColorsMap
}) => {
  if (!isOpen || !editingGoal) return null;
  const c = goalsColorsMap[editingGoal.colorGroup];

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
        className={`relative bg-white dark:bg-slate-800 w-[95%] sm:max-w-md rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 md:gap-8 shadow-2xl border border-white/20`}
      >
        <div className="absolute top-6 ltr:right-6 rtl:left-6">
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={20} className="" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mt-2">
          <div className={`w-16 h-16 ${c.iconBg} rounded-2xl flex items-center justify-center ${c.text} mb-4`}>
            <Target size={32} strokeWidth={2.5} />
          </div>
          <h2 className="text-[24px] font-black text-[#1e293b] dark:text-slate-100 mb-1">{t.editGoalTitle}</h2>
          <p className={`text-[14px] font-bold ${c.text}`}>
            {editingGoal.name}
          </p>
          <p className="text-[14px] font-medium text-[#64748b] dark:text-slate-400 mt-1">{t.editGoalSubtitle}</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#475569] dark:text-slate-300 px-1">{t.targetLabel}</label>
            <div className="relative">
              <input
                type="number"
                value={newTargetValue}
                onChange={(e) => setNewTargetValue(e.target.value)}
                autoFocus
                className={`w-full bg-[#f8fafc] border border-gray-200 dark:border-slate-700 focus:bg-white rounded-[16px] px-5 py-4 text-[24px] text-center focus:outline-none focus:ring-4 transition-all font-black ${c.text} dark:bg-slate-900 shadow-sm ${
                  editingGoal.colorGroup === 'pink' ? 'focus:border-pink-500 focus:ring-pink-500/20' :
                  editingGoal.colorGroup === 'red' ? 'focus:border-red-500 focus:ring-red-500/20' :
                  editingGoal.colorGroup === 'blue' ? 'focus:border-blue-500 focus:ring-blue-500/20' :
                  editingGoal.colorGroup === 'brown' ? 'focus:border-amber-900 focus:ring-amber-900/20' :
                  editingGoal.colorGroup === 'amber' ? 'focus:border-amber-500 focus:ring-amber-500/20' :
                  editingGoal.colorGroup === 'purple' ? 'focus:border-purple-500 focus:ring-purple-500/20' :
                  'focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button 
            onClick={saveGoalUpdate}
            className={`w-full ${c.filled} text-white py-4.5 rounded-[20px] font-black text-[18px] transition-all shadow-lg active:scale-95`}
          >
            {t.saveChanges}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
