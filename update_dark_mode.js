const fs = require('fs');
let text = fs.readFileSync('src/App.tsx', 'utf8');

const classMap = {
  'bg-white': 'bg-white dark:bg-slate-800',
  'bg-[#f0f7fc]': 'bg-[#f0f7fc] dark:bg-slate-800/80',
  'bg-gray-50': 'bg-gray-50 dark:bg-slate-700/50',
  'text-[#1e293b]': 'text-[#1e293b] dark:text-slate-100',
  'text-[#64748b]': 'text-[#64748b] dark:text-slate-400',
  'text-[#475569]': 'text-[#475569] dark:text-slate-300',
  'text-[#94a3b8]': 'text-[#94a3b8] dark:text-slate-500',
  'text-[#004e92]': 'text-[#004e92] dark:text-blue-400', // for some text colors that are branded
  'text-[#00a89d]': 'text-[#00a89d] dark:text-teal-400',
  'bg-[#e6f0fa]': 'bg-[#e6f0fa] dark:bg-[#004e92]/20',
  'border-gray-200': 'border-gray-200 dark:border-slate-700',
  'border-gray-100': 'border-gray-100 dark:border-slate-700/50',
  'border-[#dbeafe]': 'border-[#dbeafe] dark:border-slate-700/80',
  'border-[#00a89d]/20': 'border-[#00a89d]/20 dark:border-[#00a89d]/10'
};

Object.entries(classMap).forEach(([oldClass, newClass]) => {
  const escapedOld = oldClass.replace(/([\[\]\/#])/g, '\\$1');
  const regex = new RegExp(`(?<=\\s|["'\`])` + escapedOld + `(?=\\s|["'\`])`, 'g');
  text = text.replace(regex, newClass);
});

// Remove duplicates where we already manually applied them (in header, etc)
text = text.replace(/(dark:[^\s"'\`]+)(\s+)\1/g, '$1');

// Handle specific complex logic in className
text = text.replace(/bg-white dark:bg-slate-800\/80/g, 'bg-white dark:bg-slate-800'); // Quick fix if we messed up something that should just be slate-800
// Actually let's just write to file
fs.writeFileSync('src/App.tsx', text);
console.log("Done");
