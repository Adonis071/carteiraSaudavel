const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Some framer motion versions have a bug with mode="wait" and React Router. 
// Let's remove mode="wait" just to be extremely safe against white screens on navigation.
code = code.replace(/<AnimatePresence mode="wait">/g, '<AnimatePresence>');

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx');
