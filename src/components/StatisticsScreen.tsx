import React from 'react';
import { motion } from 'motion/react';
import { Download, Edit3, Target, ClipboardCheck, Stethoscope, Users2, Activity, BarChart3, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';

interface StatisticsScreenProps {
  t: any;
  isAr: boolean;
  timeFilter: 'daily' | 'weekly' | 'monthly';
  setTimeFilter: (val: 'daily' | 'weekly' | 'monthly') => void;
  monthlyGoals: any[];
  setIsExportMenuOpen: (val: boolean) => void;
  isExportMenuOpen: boolean;
  handleExport: (format: 'xlsx' | 'csv') => void;
  exportMenuRef: React.RefObject<HTMLDivElement | null>;
  barData: any[];
  lineData: any[];
  goalsColorsMap: any;
  handleEditGoal: (goal: any) => void;
  patientCount: number;
  totalTestsCount?: number;
}

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-5 rounded-[24px] shadow-2xl border-2 border-slate-50 dark:border-slate-800 transition-all duration-300">
        <p className="font-black text-slate-800 dark:text-slate-100 text-[16px] mb-3 tracking-tight border-b-2 border-slate-50 dark:border-slate-800 pb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color || entry.stroke || '#00a89d' }}></div>
                <span className="text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[11px] font-black">{entry.name}:</span>
              </div>
              <span className="text-slate-800 dark:text-slate-100 font-black text-[15px]">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  t, isAr, timeFilter, setTimeFilter, monthlyGoals, setIsExportMenuOpen, isExportMenuOpen,
  handleExport, exportMenuRef, barData, lineData, goalsColorsMap, handleEditGoal, patientCount, totalTestsCount = 0
}) => {
  const order = ['bp', 'sugar', 'obesity', 'fat', 'breastCancer', 'colon'];
  const orderedGoals = [...monthlyGoals]
    .filter(goal => order.includes(goal.id) || goal.id === 'cancer')
    .map(goal => goal.id === 'cancer' ? { ...goal, id: 'breastCancer' } : goal)
    .sort((a, b) => {
      const idxA = order.indexOf(a.id);
      const idxB = order.indexOf(b.id);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

  // Use the orderedGoals to build a consistent chart matching the indicators
  const chartData = orderedGoals.map(goal => {
    const id = goal.id as string;
    let color = '#ef4444'; // default red (bp)
    if (id === 'sugar') color = '#3b82f6';
    if (id === 'obesity') color = '#eab308';
    if (id === 'fat') color = '#a855f7';
    if (id === 'breastCancer') color = '#ec4899';
    if (id === 'colon') color = '#10b981';

    return {
      name: t[id] || goal.name,
      value: goal.target - (goal.remaining || 0),
      color: color
    };
  });

  const evolutionData = [
    { name: isAr ? '٩ أبريل' : 'Apr 9', bp: 5, sugar: 3, obesity: 4, fat: 2, breastCancer: 2, colon: 0.8 },
    { name: isAr ? '١٠ أبريل' : 'Apr 10', bp: 3, sugar: 4, obesity: 2, fat: 3, breastCancer: 1, colon: 1.2 },
    { name: isAr ? '١١ أبريل' : 'Apr 11', bp: 6, sugar: 2, obesity: 3, fat: 5, breastCancer: 3, colon: 0.5 },
    { name: isAr ? '١٢ أبريل' : 'Apr 12', bp: 4, sugar: 5, obesity: 5, fat: 1, breastCancer: 4, colon: 2 },
    { name: isAr ? '١٣ أبريل' : 'Apr 13', bp: 1, sugar: 1, obesity: 2, fat: 4, breastCancer: 1, colon: 0.8 },
    { name: isAr ? '١٤ أبريل' : 'Apr 14', bp: 3, sugar: 4, obesity: 4, fat: 3, breastCancer: 2, colon: 1.5 },
    { name: isAr ? '١٥ أبريل' : 'Apr 15', bp: 5, sugar: 6, obesity: 1, fat: 2, breastCancer: 5, colon: 0.7 },
    { name: isAr ? '١٦ أبريل' : 'Apr 16', bp: 2, sugar: 3, obesity: 5, fat: 1, breastCancer: 3, colon: 2.2 },
    { name: isAr ? '١٧ أبريل' : 'Apr 17', bp: 4, sugar: 1, obesity: 3, fat: 5, breastCancer: 1, colon: 0.9 },
    { name: isAr ? '١٨ أبريل' : 'Apr 18', bp: 6, sugar: 4, obesity: 2, fat: 1, breastCancer: 4, colon: 1.1 },
    { name: isAr ? '١٩ أبريل' : 'Apr 19', bp: 3, sugar: 2, obesity: 5, fat: 4, breastCancer: 2, colon: 0.6 },
    { name: isAr ? '٢٠ أبريل' : 'Apr 20', bp: 2, sugar: 5, obesity: 1, fat: 3, breastCancer: 1, colon: 1.8 },
    { name: isAr ? '٢١ أبريل' : 'Apr 21', bp: 5, sugar: 2, obesity: 4, fat: 2, breastCancer: 3, colon: 1.2 },
    { name: isAr ? '٢٢ أبريل' : 'Apr 22', bp: 3, sugar: 4, obesity: 2, fat: 4, breastCancer: 2, colon: 1 },
  ];

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-10">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2 group cursor-default">
            <div className="w-4 h-4 rounded-full shadow-sm group-hover:scale-125 transition-transform" style={{ backgroundColor: entry.color || entry.payload?.stroke }}></div>
            <span className="text-[13px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="px-4 md:px-10 py-8 md:py-12 max-w-[1400px] mx-auto space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[40px] border-2 border-slate-50 dark:border-slate-800 shadow-sm relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
        <div className="relative md:order-1 flex-1 text-center md:text-start">
          <h2 className="text-[38px] md:text-[52px] font-black text-slate-800 dark:text-slate-100 mb-2 leading-tight tracking-tight">{t.statsHeader}</h2>
          <p className="text-[18px] md:text-[20px] font-bold text-slate-400 dark:text-slate-500 max-w-2xl">
            {t.statsDesc}
          </p>
        </div>

        <div className="relative md:order-2 flex justify-center md:justify-end">
          <div className="relative" ref={exportMenuRef}>
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-teal-500 text-white rounded-[26px] font-black text-[18px] transition-all shadow-2xl shadow-teal-500/30 active:scale-95 hover:bg-teal-600 hover:-translate-y-1"
            >
              <Download size={24} strokeWidth={3} />
              <span>{t.exportData}</span>
            </button>
            
            {isExportMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute top-full mt-4 right-0 md:left-0 z-50 bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 p-3 rounded-[28px] shadow-2xl min-w-[220px]"
              >
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => { handleExport('xlsx'); setIsExportMenuOpen(false); }}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-[20px] transition-colors text-start"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                      <BarChart3 size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block font-black text-slate-800 dark:text-slate-100 text-[15px]">Excel (XLSX)</span>
                      <span className="block text-[12px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{isAr ? 'بيانات مفصلة' : 'Detailed Data'}</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => { handleExport('csv'); setIsExportMenuOpen(false); }}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-[20px] transition-colors text-start"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                      <ClipboardCheck size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="block font-black text-slate-800 dark:text-slate-100 text-[15px]">CSV Format</span>
                      <span className="block text-[12px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{isAr ? 'بيانات نصية' : 'Text Data'}</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex justify-center md:justify-end">
        <div className="bg-slate-100 dark:bg-slate-900/50 p-2 rounded-[32px] flex gap-1 w-full max-w-sm shadow-inner border border-slate-50 dark:border-slate-800">
          {(['monthly', 'weekly', 'daily'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`flex-1 py-4 rounded-[26px] text-[16px] font-black transition-all duration-300 ${
                timeFilter === filter 
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-100 dark:ring-slate-700' 
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50'
              }`}
            >
              {t[filter]}
            </button>
          ))}
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: isAr ? 'إجمالي الفحوصات' : 'Total Exams', value: totalTestsCount, icon: Activity, color: 'bg-blue-500', shadow: 'shadow-blue-500/20' },
          { label: isAr ? 'المرضى النشطون' : 'Active Patients', value: patientCount, icon: Users2, color: 'bg-teal-500', shadow: 'shadow-teal-500/20' },
          { label: isAr ? 'إجمالي المرضى' : 'Total Patients', value: patientCount, icon: BarChart3, color: 'bg-indigo-500', shadow: 'shadow-indigo-500/20' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-10 rounded-[40px] border-2 border-slate-50 dark:border-slate-700/50 shadow-sm flex items-center justify-between group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full translate-x-1/2 -translate-y-1/2`}></div>
            <div className={`w-20 h-20 ${stat.color} text-white rounded-[28px] flex items-center justify-center shadow-2xl ${stat.shadow} group-hover:rotate-12 transition-transform duration-500`}>
              <stat.icon size={40} strokeWidth={2.5} />
            </div>
            <div className="text-end flex-1 pl-4">
              <span className="block text-[42px] font-black text-slate-800 dark:text-slate-100 leading-none mb-2 tracking-tight">{stat.value}</span>
              <span className="block text-[13px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Targets Section */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[48px] p-8 md:p-16 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500"></div>
        <div className="text-center mb-16">
          <h3 className="text-[38px] md:text-[52px] font-black text-slate-800 dark:text-slate-100 mb-6 tracking-tight leading-tight">{t.monthlyGoalSectionTitle}</h3>
          <div className="inline-flex items-center px-12 py-3 bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500/20 rounded-full shadow-sm">
            <span className="text-[20px] font-black text-teal-600 dark:text-teal-400 tracking-widest uppercase">
              {t.monthlyGoalMonth}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {orderedGoals.map((goal, index) => {
            const indicatorName = t[goal.id] || goal.name;
            const displayTarget = goal.target;
            const displayRemaining = goal.remaining || 0;
            const count = displayTarget - displayRemaining;
            const Icon = goal.icon;
            const activeSegmentsCount = Math.floor((count / displayTarget) * 7);
            
            const colorMap = {
               bp: { text: "text-[#ef4444]", border: 'border-[#fee2e2]', fill: 'bg-[#ef4444]', iconBg: 'bg-[#fef2f2]' },
               sugar: { text: "text-[#3b82f6]", border: 'border-[#dbeafe]', fill: 'bg-[#3b82f6]', iconBg: 'bg-[#eff6ff]' },
               obesity: { text: "text-[#eab308]", border: 'border-[#fef9c3]', fill: 'bg-[#eab308]', iconBg: 'bg-[#fefce8]' },
               fat: { text: "text-[#a855f7]", border: 'border-[#f3e8ff]', fill: 'bg-[#a855f7]', iconBg: 'bg-[#faf5ff]' },
               breastCancer: { text: "text-[#ec4899]", border: 'border-[#fce7f3]', fill: 'bg-[#ec4899]', iconBg: 'bg-[#fdf2f8]' },
               colon: { text: "text-[#10b981]", border: 'border-[#d1fae5]', fill: 'bg-[#10b981]', iconBg: 'bg-[#ecfdf5]' }
            }[goal.id as string] || { text: 'text-slate-500', border: 'border-slate-100', fill: 'bg-slate-500', iconBg: 'bg-slate-50' };

            return (
              <motion.div 
                key={goal.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-50 dark:bg-slate-800/30 rounded-[40px] p-8 sm:p-10 border-2 border-transparent hover:border-teal-500/10 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 ${colorMap.iconBg} dark:bg-slate-900 rounded-[20px] flex items-center justify-center ${colorMap.text} shadow-sm group-hover:rotate-12 transition-transform duration-500`}>
                      {Icon && <Icon size={28} strokeWidth={2.5} />}
                    </div>
                    <span className="text-[24px] sm:text-[28px] font-black text-slate-800 dark:text-slate-100 tracking-tight">{indicatorName}</span>
                  </div>
                  <button 
                    onClick={() => handleEditGoal({...goal})}
                    className="w-12 h-12 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-teal-500 hover:border-teal-500/30 transition-all active:scale-90"
                  >
                    <Edit3 size={20} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="mb-10">
                  <div className="relative h-20 rounded-[28px] border-4 border-white dark:border-slate-700 bg-white dark:bg-slate-900 flex p-2 gap-2 shadow-inner">
                    <div className="flex w-full gap-2">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const isActive = i < activeSegmentsCount;
                        return (
                          <div 
                            key={i} 
                            className={`flex-1 rounded-[16px] transition-all duration-1000 ${
                              isActive ? `${colorMap.fill} shadow-lg shadow-current/10` : 'bg-slate-100 dark:bg-slate-800'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border-2 border-white dark:border-slate-800 shadow-sm text-center">
                    <span className="block text-slate-400 dark:text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1">{isAr ? 'المستهدف' : 'Target'}</span>
                    <span className={`text-[28px] font-black ${colorMap.text}`}>{displayTarget}</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border-2 border-white dark:border-slate-800 shadow-sm text-center">
                    <span className="block text-slate-400 dark:text-slate-500 text-[12px] font-black uppercase tracking-widest mb-1">{t.remaining}</span>
                    <span className={`text-[28px] font-black ${colorMap.text}`}>{displayRemaining}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Path Indicators Chart Card */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[48px] p-8 md:p-16 shadow-sm overflow-hidden group">
        <div className="flex items-center justify-between mb-16">
           <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
           <h3 className="text-[32px] md:text-[42px] font-black text-slate-800 dark:text-slate-100 tracking-tight">
             {isAr ? 'مؤشر المسارات' : 'Path Indicators'}
           </h3>
        </div>
        
        <div className="h-[400px] sm:h-[500px] w-full" dir={isAr ? 'rtl' : 'ltr'}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 40, right: 20, left: 20, bottom: 20 }}>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`grad-${index}`} id={`colorBar-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.4}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#94a3b8" strokeOpacity={0.08} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 900 }}
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }}
                dx={isAr ? 15 : -15}
              />
              <Tooltip cursor={{ fill: 'rgba(0, 168, 157, 0.04)', radius: 24 }} content={<CustomTooltip t={t} />} />
              <Bar 
                dataKey="value" 
                radius={[20, 20, 5, 5]} 
                barSize={55}
                animationDuration={2500}
                label={{ position: 'top', fill: '#64748b', fontSize: 14, fontWeight: 900, offset: 15 }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#colorBar-${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend payload={chartData} />
      </div>

      {/* Evolution Chart Card */}
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[48px] p-8 md:p-16 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-16">
           <div className="w-12 h-1 bg-red-500 rounded-full"></div>
           <h3 className="text-[32px] md:text-[42px] font-black text-slate-800 dark:text-slate-100 tracking-tight">
             {isAr ? 'تطور مؤشر المسارات' : 'Path Evolution'}
           </h3>
        </div>
        
        <div className="h-[400px] sm:h-[500px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#94a3b8" strokeOpacity={0.08} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 900 }}
                dy={20}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }}
                dx={-15}
              />
              <Tooltip content={<CustomTooltip t={t} />} />
              {[
                { key: 'bp', color: '#ef4444', label: t.bp },
                { key: 'sugar', color: '#3b82f6', label: t.sugar },
                { key: 'obesity', color: '#eab308', label: t.obesity },
                { key: 'fat', color: '#a855f7', label: t.fat },
                { key: 'breastCancer', color: '#ec4899', label: t.breastCancer },
                { key: 'colon', color: '#10b981', label: t.colon }
              ].map((line) => (
                <Line 
                  key={line.key}
                  name={line.label}
                  type="monotone" 
                  dataKey={line.key} 
                  stroke={line.color} 
                  strokeWidth={5} 
                  dot={{ r: 6, fill: line.color, strokeWidth: 4, stroke: '#fff' }} 
                  activeDot={{ r: 10, strokeWidth: 0 }}
                  animationDuration={3000}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <CustomLegend payload={[
          { value: t.bp, color: '#ef4444' },
          { value: t.sugar, color: '#3b82f6' },
          { value: t.obesity, color: '#eab308' },
          { value: t.fat, color: '#a855f7' },
          { value: t.breastCancer, color: '#ec4899' },
          { value: t.colon, color: '#10b981' }
        ]} />
      </div>
    </motion.div>
  );
};
