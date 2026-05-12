import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard flat blue backgrounds with gradient backgrounds for primary impact elements
code = code.replace(/bg-\[\#004e92\](?= text-white)/g, 'bg-gradient-to-br from-[#004e92] to-[#00a89d]');

// Update online indicator
code = code.replace(/bg-\[\#004e92\] shadow-\[0_0_8px_rgba\(0,78,146,0\.5\)\]/, 'bg-gradient-to-r from-[#004e92] to-[#00a89d] shadow-[0_0_8px_rgba(0,168,157,0.5)]');

fs.writeFileSync('src/App.tsx', code);
console.log('Colors updated');
