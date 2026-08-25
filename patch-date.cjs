const fs = require('fs');

const makeSafe = (file) => {
  let code = fs.readFileSync(file, 'utf8');
  
  if (!code.includes('safeFormatDate')) {
    const safeDateFn = `
const safeFormatDate = (dateStr: any, fmt: string) => {
  try {
    if (!dateStr) return 'Data Inválida';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Data Inválida';
    return format(d, fmt, { locale: ptBR });
  } catch (e) {
    return 'Data Inválida';
  }
};
`;
    // inject after imports
    code = code.replace(/import { cn } from '\.\.\/lib\/utils';/, "import { cn } from '../lib/utils';\n" + safeDateFn);
    code = code.replace(/import autoTable from 'jspdf-autotable';\nimport { cn } from '\.\.\/lib\/utils';/, "import autoTable from 'jspdf-autotable';\nimport { cn } from '../lib/utils';\n" + safeDateFn);
    
    // Replace format(new Date(t.date)
    code = code.replace(/format\(new Date\(t\.date\), "dd 'de' MMM, yyyy", \{ locale: ptBR \}\)/g, 'safeFormatDate(t.date, "dd \'de\' MMM, yyyy")');
    code = code.replace(/format\(new Date\(t\.date\), 'dd\/MM\/yyyy'\)/g, 'safeFormatDate(t.date, "dd/MM/yyyy")');
    code = code.replace(/format\(new Date\(t\.date\), 'dd MMM', \{ locale: ptBR \}\)/g, 'safeFormatDate(t.date, "dd MMM")');
    
    fs.writeFileSync(file, code);
    console.log('Patched ' + file);
  }
};

try {
  makeSafe('src/components/Transactions.tsx');
  makeSafe('src/components/Dashboard.tsx');
} catch(e) {
  console.log(e);
}
