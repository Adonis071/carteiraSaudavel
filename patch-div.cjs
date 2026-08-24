const fs = require('fs');
let content = fs.readFileSync('src/components/Transactions.tsx', 'utf8');
content = content.replace(
  '<p className="text-sm text-zinc-500 dark:text-zinc-400">Gerencie suas receitas e despesas</p>\n        </div>',
  '<p className="text-sm text-zinc-500 dark:text-zinc-400">Gerencie suas receitas e despesas</p>\n        </div>\n        </div>'
);
fs.writeFileSync('src/components/Transactions.tsx', content);
