const fs = require('fs');
const file = 'server.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /Provide 3 personalized, actionable insights about my spending habits and budget in Portuguese \(Brazil\)\. Keep them concise and professional\./g,
  `Forneça 3 insights diretos e curtos sobre meus hábitos de consumo e orçamento em Português (Brasil). Seja extremamente conciso, máximo de 1 frase curta por insight.`
);

fs.writeFileSync(file, code);
console.log("Patched server.ts AI Prompt");
