const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

// Add import
code = code.replace(
  /import \{ RefreshCw, Plus, TrendingUp, TrendingDown, Wallet, Sparkles, DollarSign, Calendar, ChevronRight \} from 'lucide-react';/,
  "import { RefreshCw, Plus, TrendingUp, TrendingDown, Wallet, Sparkles, DollarSign, Calendar, ChevronRight } from 'lucide-react';\nimport Markdown from 'react-markdown';"
);

// Replace rendering
const oldRender = `<div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {insights}
              </div>`;
const newRender = `<div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed markdown-body">
                <Markdown>{insights}</Markdown>
              </div>`;

code = code.replace(oldRender, newRender);

fs.writeFileSync(file, code);
console.log("Patched Dashboard.tsx");
