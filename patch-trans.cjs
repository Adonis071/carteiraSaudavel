const fs = require('fs');
let content = fs.readFileSync('src/components/Transactions.tsx', 'utf8');
content = content.replace(
  '<div>\n          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Transações</h2>',
  `<div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm" title="Voltar ao Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Transações</h2>`
);
fs.writeFileSync('src/components/Transactions.tsx', content);
