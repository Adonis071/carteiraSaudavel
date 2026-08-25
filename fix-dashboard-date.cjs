const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
// Split by "const safeFormatDate =" and remove duplicates
const parts = dash.split('const safeFormatDate =');
if (parts.length > 2) {
  // It was inserted twice!
  console.log('Fixing Dashboard.tsx');
  // Just take the first part, then the function definition, then the last part, skipping the middle redundant declaration
  // A safer way: just use regex to remove ALL declarations and insert exactly one
  dash = dash.replace(/const safeFormatDate = \(dateStr: any, fmt: string\) => \{[\s\S]*?\}\s*catch\s*\(e\)\s*\{\s*return 'Data Inválida';\s*\}\s*\};\s*/g, '');
  
  const safeDateFn = `\nconst safeFormatDate = (dateStr: any, fmt: string) => {
  try {
    if (!dateStr) return 'Data Inválida';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Data Inválida';
    return format(d, fmt, { locale: ptBR });
  } catch (e) {
    return 'Data Inválida';
  }
};\n`;
  dash = dash.replace(/import \{ cn \} from '\.\.\/lib\/utils';/, "import { cn } from '../lib/utils';\n" + safeDateFn);
  fs.writeFileSync('src/components/Dashboard.tsx', dash);
}

let trans = fs.readFileSync('src/components/Transactions.tsx', 'utf8');
const tparts = trans.split('const safeFormatDate =');
if (tparts.length > 2) {
  trans = trans.replace(/const safeFormatDate = \(dateStr: any, fmt: string\) => \{[\s\S]*?\}\s*catch\s*\(e\)\s*\{\s*return 'Data Inválida';\s*\}\s*\};\s*/g, '');
  
  const safeDateFn = `\nconst safeFormatDate = (dateStr: any, fmt: string) => {
  try {
    if (!dateStr) return 'Data Inválida';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Data Inválida';
    return format(d, fmt, { locale: ptBR });
  } catch (e) {
    return 'Data Inválida';
  }
};\n`;
  trans = trans.replace(/import \{ cn \} from '\.\.\/lib\/utils';/, "import { cn } from '../lib/utils';\n" + safeDateFn);
  fs.writeFileSync('src/components/Transactions.tsx', trans);
}

console.log('Fixed double declarations');
