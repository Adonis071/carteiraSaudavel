const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => navigate("/transactions", { state: { openForm: true } })} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm"><Plus className="w-4 h-4 mr-2" />Nova Transação</button>
          <BankSync className="flex-1 sm:flex-none" />
          <button
            onClick={exportPDF}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
        </div>`;

const replacement = `        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button onClick={() => navigate("/transactions", { state: { openForm: true } })} className="flex-1 sm:flex-none flex items-center justify-center px-2 py-2 sm:px-4 sm:py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-xs sm:text-sm font-medium shadow-sm whitespace-nowrap"><Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />Nova Transação</button>
          <div className="flex-1 sm:flex-none flex min-w-0">
            <BankSync className="w-full text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2 whitespace-nowrap" />
          </div>
          <button
            onClick={exportPDF}
            className="flex-1 sm:flex-none flex items-center justify-center px-2 py-2 sm:px-4 sm:py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-xs sm:text-sm font-medium shadow-sm whitespace-nowrap"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Exportar PDF
          </button>
        </div>`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
console.log("Patched!");
