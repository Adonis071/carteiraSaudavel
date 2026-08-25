const fs = require('fs');
const file = 'src/components/BankSync.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `"flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium border border-zinc-200 dark:border-zinc-700 disabled:opacity-50",`;
const replacement = `"flex items-center justify-center px-2 py-2 sm:px-4 sm:py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-xs sm:text-sm font-medium border border-zinc-200 dark:border-zinc-700 disabled:opacity-50",`;

code = code.replace(target, replacement);

const targetIcon = `<RefreshCw className={cn("w-4 h-4 mr-2", syncing && "animate-spin")} />`;
const replacementIcon = `<RefreshCw className={cn("w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2", syncing && "animate-spin")} />`;

code = code.replace(targetIcon, replacementIcon);

fs.writeFileSync(file, code);
console.log("Patched BankSync!");
