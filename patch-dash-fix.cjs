const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
content = content.replace(/<button onClick=\{\(\) => navigate\("\/transactions"\)\}.*\n\s*<button onClick=\{\(\) => navigate\("\/transactions"\)\}.*/, '<button onClick={() => navigate("/transactions")} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm"><Plus className="w-4 h-4 mr-2" />Nova Transação</button>');
fs.writeFileSync('src/components/Dashboard.tsx', content);
