const fs = require('fs');
let code = fs.readFileSync('src/components/BankSync.tsx', 'utf8');

const oldAlert = `        } else if (data.error) {
          console.error("Plaid API Error:", data.error);
          alert("Erro na API do Plaid: " + (data.error.error_message || JSON.stringify(data.error)));
        }`;

const newAlert = `        } else if (data.error) {
          console.error("Plaid API Error (Using Mock Mode instead):", data.error);
        }`;

if (code.includes(oldAlert)) {
  code = code.replace(oldAlert, newAlert);
  fs.writeFileSync('src/components/BankSync.tsx', code);
  console.log('Patched BankSync.tsx alert');
} else {
  console.log('Could not find oldAlert');
}
