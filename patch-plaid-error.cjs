const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /console\.error\('Plaid Link Token Error:', error\.response\?\.data \|\| error\.message\);\n    res\.status\(500\)\.json\(\{ error: error\.response\?\.data \|\| error\.message \}\);/g,
  `const errMsg = error.response?.data || error.message;
    if (typeof errMsg === 'string' && errMsg.includes('Plaid credentials missing')) {
      res.status(400).json({ error: errMsg });
    } else {
      console.error('Plaid Link Token Error:', errMsg);
      res.status(500).json({ error: errMsg });
    }`
);

fs.writeFileSync(file, code);
console.log("Patched server.ts Plaid Link Token Error");
