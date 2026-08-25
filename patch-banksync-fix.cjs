const fs = require('fs');
let code = fs.readFileSync('src/components/BankSync.tsx', 'utf8');

// Replace the alert
const oldAlert = `        } else if (data.error) {
          console.error("Plaid API Error:", data.error);
          alert("Erro na API do Plaid (verifique suas chaves no Render): " + (data.error.error_message || JSON.stringify(data.error)));
        }`;
const newAlert = `        } else if (data.error) {
          console.error("Plaid API Error:", data.error);
        }`;
if (code.includes(oldAlert)) {
  code = code.replace(oldAlert, newAlert);
  console.log('Fixed alert');
}

// Ensure usePlaidLink is safe
const oldConfig = `  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken!,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);`;
const newConfig = `  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken || '',
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);`;
if (code.includes(oldConfig)) {
  code = code.replace(oldConfig, newConfig);
  console.log('Fixed usePlaidLink config');
}

fs.writeFileSync('src/components/BankSync.tsx', code);
