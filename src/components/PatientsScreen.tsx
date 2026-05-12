import React from 'react';
import { motion } from 'motion/react';
import { Users, Activity, AlertCircle, BarChart2, Search, ArrowDownUp, UserIcon, UserPlus, Plus, IdCard, Calendar } from 'lucide-react';
import { Patient } from '../types';

interface PatientsScreenProps {
  t: any;
  isAr: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  genderFilter: 'all' | 'male' | 'female';
  setGenderFilter: (filter: 'all' | 'male' | 'female') => void;
  setIsModalOpen: (open: boolean) => void;
  initialPatients: Patient[];
  setSelectedPatientId: (id: number | null) => void;
}

export const PatientsScreen: React.FC<PatientsScreenProps> = ({
  t, isAr, searchQuery, setSearchQuery, sortOrder, setSortOrder, genderFilter, setGenderFilter, setIsModalOpen, initialPatients, setSelectedPatientId
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Welcome Card */}
      <div className="px-5 md:px-10 mt-6 md:mt-10">
        <div className="bg-gradient-to-r from-[#00a89d]/5 to-[#00a89d]/10 dark:from-[#00a89d]/10 dark:to-[#004e92]/10 rounded-[24px] md:rounded-[32px] p-7 md:p-12 pb-6 md:pb-12 border border-[#00a89d]/20 dark:border-slate-700/80 flex flex-col md:flex-row md:justify-between md:items-center transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00a89d]/15 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#0d9488]/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="mb-5 md:mb-0 relative z-10">
            <h2 className="text-[26px] md:text-[40px] font-extrabold text-[#00a89d] dark:text-slate-100 leading-[1.3] md:leading-[1.4] mb-3 md:mb-5 whitespace-pre-line">
              {t.welcomeTitle}
            </h2>
            <p className="text-[#64748b] dark:text-slate-400 text-[15px] md:text-[19px] leading-relaxed max-w-[85%] md:max-w-full font-medium whitespace-pre-line">
              {t.welcomeDesc}
            </p>
          </div>

          <div className="flex justify-end mt-5 md:mt-0 relative z-10">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-800/80 rounded-[20px] md:rounded-[28px] py-4 px-6 md:py-6 md:px-8 flex items-center gap-6 shadow-md shadow-teal-900/5 border border-[#ccfbf1] dark:border-slate-700/80 transition-colors">
              <div className="w-[48px] h-[48px] md:w-[68px] md:h-[68px] rounded-[14px] md:rounded-[20px] bg-[#e6fbf9] dark:bg-[#00a89d]/20 text-[#00a89d] dark:text-teal-400 flex justify-center items-center">
                <Users size={24} strokeWidth={2} className="md:w-9 md:h-9" />
              </div>
              <div className="flex flex-col items-center pr-1 pl-1">
                <span className="text-[32px] md:text-[48px] font-black text-[#1e293b] dark:text-slate-100 leading-none mb-1 md:mb-2">{initialPatients.length}</span>
                <span className="text-[14px] md:text-[17px] text-[#1e293b] dark:text-slate-400 font-bold tracking-wide whitespace-nowrap">{t.totalPatients}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Smart Insights */}
      <div className="px-5 md:px-10 mt-6 md:mt-8">
        <div className="bg-gradient-to-r from-indigo-50/50 to-indigo-100/30 dark:from-indigo-900/20 dark:to-indigo-800/10 rounded-[24px] p-6 md:p-8 border border-indigo-100 dark:border-indigo-500/10 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-200/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-[18px] bg-white/90 dark:bg-slate-800 shadow-[0_4px_20px_-5px_rgba(99,102,241,0.2)] flex items-center justify-center shrink-0 border border-indigo-50 dark:border-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                <Activity size={26} strokeWidth={2.5} />
              </div>
              <div className="pt-1">
                <h4 className="text-[19px] md:text-[22px] font-extrabold text-slate-800 dark:text-slate-100 mb-1">{t.smartInsights}</h4>
                <p className="text-slate-500 dark:text-slate-400 text-[14px] md:text-[15px] font-medium">{t.smartInsightsDesc}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 md:min-w-[340px]">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-5 py-3.5 rounded-[16px] border border-white dark:border-slate-700 flex items-center gap-3.5 shadow-sm hover:shadow transition-all group/item cursor-default">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                  <AlertCircle size={16} className="text-blue-500 dark:text-blue-400 shrink-0" />
                </div>
                <span className="text-slate-700 dark:text-slate-200 text-[14.5px] font-bold">{t.insight1}</span>
              </div>
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-5 py-3.5 rounded-[16px] border border-white dark:border-slate-700 flex items-center gap-3.5 shadow-sm hover:shadow transition-all group/item cursor-default">
                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0 group-hover/item:scale-110 transition-transform">
                  <BarChart2 size={16} className="text-teal-500 dark:text-teal-400 shrink-0" />
                </div>
                <span className="text-slate-700 dark:text-slate-200 text-[14.5px] font-bold">{t.insight2}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls (Search, Sort & Add Patient) */}
      <div className="px-5 md:px-10 mt-6 md:mt-10 flex flex-col gap-4">
        <div className="relative flex items-center w-full group max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 rounded-[28px] py-4.5 md:py-[20px] ltr:pl-14 rtl:pr-14 ltr:pr-6 rtl:pl-6 font-bold focus:outline-none focus:border-teal-500/50 focus:ring-8 focus:ring-teal-500/5 shadow-sm hover:shadow-md transition-all md:text-[18px]"
            placeholder={t.searchPlaceholder}
          />
          <div className="absolute ltr:left-6 rtl:right-6 md:ltr:left-6 md:rtl:right-6 text-slate-400 dark:text-slate-500 flex items-center pointer-events-none group-focus-within:text-teal-500 transition-colors">
            <Search size={24} strokeWidth={3} className="transition-transform group-focus-within:scale-110" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex items-center w-full sm:w-[220px]">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[#1e293b] dark:text-slate-100 rounded-[16px] md:rounded-[20px] py-4 md:py-[16px] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 font-bold focus:outline-none focus:border-[#00a89d] focus:ring-1 focus:ring-[#00a89d] shadow-sm transition-all text-[15px] md:text-[16px] appearance-none cursor-pointer"
              >
                <option value="desc">{t.sortDesc}</option>
                <option value="asc">{t.sortAsc}</option>
              </select>
              <div className="absolute ltr:right-4 rtl:left-4 text-[#94a3b8] dark:text-slate-500 pointer-events-none">
                <ArrowDownUp size={18} strokeWidth={2.5} />
              </div>
            </div>
            <div className="relative flex items-center w-full sm:w-[220px]">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
                className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-[#1e293b] dark:text-slate-100 rounded-[16px] md:rounded-[20px] py-4 md:py-[16px] ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 font-bold focus:outline-none focus:border-[#00a89d] focus:ring-1 focus:ring-[#00a89d] shadow-sm transition-all text-[15px] md:text-[16px] appearance-none cursor-pointer"
              >
                <option value="all">{t.filterAll}</option>
                <option value="male">{t.filterMale}</option>
                <option value="female">{t.filterFemale}</option>
              </select>
              <div className="absolute ltr:right-4 rtl:left-4 text-[#94a3b8] dark:text-slate-500 pointer-events-none">
                <UserIcon size={18} strokeWidth={2.5} />
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-[#00a89d] to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white py-4 md:py-[16px] sm:px-10 rounded-[16px] md:rounded-[20px] font-bold text-[17px] flex items-center justify-center gap-3 transition-all shadow-lg shadow-teal-900/20 active:transform active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <UserPlus size={22} strokeWidth={2.5} className="md:w-6 md:h-6" />
            <span>{t.addPatientButton}</span>
          </button>
        </div>
      </div>

      {/* Patient List */}
      <div className="px-5 md:px-10 mt-6 md:mt-10 pb-12">
        {(() => {
          const filtered = initialPatients.filter(p => {
            const dataName = (isAr ? p.ar?.name : p.en?.name)?.toLowerCase() || '';
            const idNum = p.idNumber?.toLowerCase() || '';
            const q = searchQuery.toLowerCase();
            const matchesSearch = dataName.includes(q) || idNum.includes(q);
            
            const matchesGender = genderFilter === 'all' || p.gender === genderFilter;
            
            return matchesSearch && matchesGender;
          });

          const sorted = [...filtered].sort((a, b) => {
            const dateA = new Date(a.en?.visit || 0).getTime();
            const dateB = new Date(b.en?.visit || 0).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
          });

          if (sorted.length === 0) {
            return (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800/40 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[40px] py-24 flex flex-col items-center justify-center text-center px-10 transition-all shadow-inner"
              >
                <div className="relative mb-8">
                  <div className="w-28 h-28 bg-teal-50 dark:bg-teal-900/20 rounded-full flex items-center justify-center animate-pulse">
                    <Search size={48} className="text-teal-500/40 dark:text-teal-400/30" strokeWidth={1.5} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center text-teal-500">
                    <AlertCircle size={24} />
                  </div>
                </div>
                <h3 className="text-slate-800 dark:text-slate-100 text-[26px] font-black mb-4 tracking-tight">
                  {isAr ? 'لم نجد أي نتائج!' : 'No results found!'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[17px] font-medium max-w-sm mb-10 leading-relaxed">
                  {isAr ? `عذراً، لم نتمكن من العثور على أي مريض يطابق "${searchQuery}". يمكنك المحاولة مجدداً أو إضافة مريض جديد.` : `Sorry, we couldn't find any patients matching "${searchQuery}". You can try again or add a new patient.`}
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="group relative flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-[20px] font-black text-[18px] shadow-xl shadow-teal-900/20 hover:shadow-2xl hover:shadow-teal-900/30 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  <Plus size={22} strokeWidth={3} />
                  <span>{t.addPatientButton}</span>
                </button>
              </motion.div>
            );
          }

          return (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
              }}
              initial="hidden"
              animate="show"
            >
              {sorted.map((patient, index) => {
                const data = (isAr ? patient.ar : patient.en) as any;
                if (!data) return null; // Skip malformed patient
                return (
                  <motion.div 
                    key={patient.id}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95 },
                      show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
                    }}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className="group bg-white dark:bg-slate-800 rounded-[32px] p-6 md:p-8 flex flex-col gap-6 border-2 border-transparent hover:border-teal-500/20 transition-all duration-500 cursor-pointer shadow-[0_15px_35px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(0,168,157,0.15)] hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 dark:bg-teal-900/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center gap-5 w-full relative z-10">
                      <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[24px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-[28px] md:text-[34px] font-black group-hover:from-teal-500 group-hover:to-teal-600 group-hover:text-white transition-all duration-500 shadow-inner">
                        {data.initial}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-[20px] md:text-[22px] font-black text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-500 transition-colors line-clamp-1 tracking-tight">
                            {data.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${patient.gender === 'male' ? 'bg-blue-400' : 'bg-pink-400'}`} />
                           <p className="text-slate-400 dark:text-slate-500 text-[15px] font-black uppercase tracking-wider">
                             {data.age}
                           </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full h-[1.5px] bg-slate-50 dark:bg-slate-700/50 relative z-10">
                      <div className="absolute inset-0 bg-teal-500 w-0 group-hover:w-full transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100" />
                    </div>

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                              <IdCard size={18} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                            </div>
                            <span className="text-[15px] text-slate-500 dark:text-slate-400 font-bold">{t.idNumber}</span>
                          </div>
                          <span className="text-[16px] tracking-wide font-black text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{patient.idNumber}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                              <Calendar size={18} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
                            </div>
                            <span className="text-[15px] text-slate-500 dark:text-slate-400 font-bold">{t.lastVisit}</span>
                          </div>
                          <span className="text-[16px] font-black text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{data.visit}</span>
                        </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })()}
      </div>
    </motion.div>
  );
};
