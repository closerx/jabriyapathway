import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserIcon, Sun, Moon, Languages } from 'lucide-react';

interface HeaderProps {
  isAr: boolean;
  t: any;
  authProfile: any;
  handleNurseClick: () => void;
  showNurseName: boolean;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  toggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAr, t, authProfile, handleNurseClick, showNurseName, isDarkMode, setIsDarkMode, toggleLanguage
}) => {
  return (
    <header className="flex items-center justify-between px-3 min-[400px]:px-5 md:px-10 py-4 md:py-5 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 transition-colors">
      <div className="flex items-center gap-2 min-[400px]:gap-3 md:gap-4">
        <div className="w-[44px] h-[44px] min-[400px]:w-[52px] min-[400px]:h-[52px] md:w-[60px] md:h-[60px] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#004e92" />
                <stop offset="100%" stopColor="#00a89d" />
              </linearGradient>
            </defs>
            <path d="M50 5 L90 20 L90 50 C90 75 50 95 50 95 C50 95 10 75 10 50 L10 20 L50 5 Z" stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="35" r="12" fill="url(#logo-grad)" />
            <path d="M50 52 C35 52 28 65 28 80 C40 88 60 88 72 80 C72 65 65 52 50 52 Z" fill="url(#logo-grad)" />
            <path d="M46 60 H54 V66 H60 V74 H54 V80 H46 V74 H40 V66 H46 V60 Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="flex flex-col justify-center overflow-hidden">
          <h1 className="text-[17px] min-[400px]:text-[20px] md:text-[25px] font-extrabold leading-none whitespace-nowrap text-[#00a89d]">
            {isAr ? 'مسارات المرضى' : 'Patient Pathways'}
          </h1>
          <p className="text-[10px] min-[400px]:text-[12px] md:text-[13px] text-[#004e92] dark:text-blue-300 font-bold tracking-wide mt-1 opacity-90">
            {isAr ? 'مركز صحي الجابرية' : 'Al Jabriya Health Center'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 min-[400px]:gap-3 md:gap-4 shrink-0">
        <div className="relative">
          <div 
            onClick={handleNurseClick}
            className="flex items-center gap-3 px-3 py-2 bg-slate-50/80 dark:bg-slate-800/80 rounded-[20px] border border-slate-100 dark:border-slate-700/50 cursor-pointer active:scale-95 transition-all hover:bg-white dark:hover:bg-slate-700 shadow-sm group"
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 shrink-0 group-hover:rotate-12 transition-transform">
              <UserIcon size={20} strokeWidth={2.5} />
            </div>
            
            <div className="flex-col overflow-hidden hidden lg:flex items-start">
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{isAr ? 'الممرضة' : 'Nurse'}</span>
              <span className="text-[15px] font-black text-[#1e293b] dark:text-slate-100 leading-tight whitespace-nowrap">
                {(isAr ? authProfile.nameAr : authProfile.nameEn) || t.nurseName}
              </span>
            </div>
          </div>

          <AnimatePresence>
            {showNurseName && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full mt-2 right-0 lg:hidden min-w-[140px] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-3 z-50 transform origin-top-right"
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-bold text-[#1e293b] dark:text-slate-100 leading-tight whitespace-nowrap mb-1">
                    {(isAr ? authProfile.nameAr : authProfile.nameEn) || t.nurseName}
                  </span>
                  <div className="flex items-center gap-1.5 pt-1 border-t border-gray-50 dark:border-slate-700/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{t.online}</span>
                  </div>
                </div>
                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white dark:bg-slate-800 border-t border-l border-gray-100 dark:border-slate-700 rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center border border-gray-200 dark:border-slate-700 rounded-[16px] text-[#475569] dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm bg-white dark:bg-slate-800 shrink-0"
        >
          {isDarkMode ? <Sun size={18} className="md:w-5 md:h-5 text-amber-500" /> : <Moon size={18} className="md:w-5 md:h-5" />}
        </button>
        <button 
          onClick={toggleLanguage}
          className="h-10 md:h-11 flex items-center justify-center gap-1 min-[400px]:gap-1.5 px-2 min-[400px]:px-3 md:px-4 border border-gray-200 dark:border-slate-700 rounded-[16px] text-[#475569] dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm bg-white dark:bg-slate-800 shrink-0"
        >
          <span className="font-semibold text-[14px] min-[400px]:text-[15px] md:text-[16px] pt-0.5 whitespace-nowrap">{t.langToggle}</span>
          <Languages size={16} className="min-[400px]:w-4.5 min-[400px]:h-4.5 md:w-5 md:h-5" />
        </button>
      </div>
    </header>
  );
};
