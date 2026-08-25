const fs = require('fs');
const file = 'src/components/BankSync.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /console\.error\("Plaid API Error:", data\.error\);/g,
  `if (data.error && data.error.includes && data.error.includes('credentials missing')) {
            console.warn("Plaid não configurado. Se quiser sincronizar bancos, adicione PLAID_CLIENT_ID e PLAID_SECRET.");
          } else {
            console.error("Plaid API Error:", data.error);
          }`
);

fs.writeFileSync(file, code);
