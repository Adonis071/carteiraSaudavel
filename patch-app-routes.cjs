const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/<AnimatePresence>/g, '');
code = code.replace(/<\/AnimatePresence>/g, '');
code = code.replace(/<Routes location={location} key={location.pathname}>/g, '<Routes>');

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx');
