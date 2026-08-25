const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const target = 'className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col"';
const replacement = 'className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col min-w-0 overflow-hidden"';

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log('Patched Dashboard.tsx for min-w-0');
