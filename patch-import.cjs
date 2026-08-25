const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('import Markdown')) {
  code = code.replace(
    /import \{ ArrowUpCircle/g,
    "import Markdown from 'react-markdown';\nimport { ArrowUpCircle"
  );
  fs.writeFileSync(file, code);
  console.log("Added Markdown import");
}
