const fs = require('fs');
const file = 'src/firebase.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /setPersistence\(auth, browserLocalPersistence\)\.catch\(\(\) => \{[\s\S]*?\}\);\}\);/g,
  `setPersistence(auth, browserSessionPersistence).catch(() => {
  console.warn('browserSessionPersistence indisponível, usando memória (sessão não sobrevive a refresh).');
  setPersistence(auth, inMemoryPersistence);
});`
);
fs.writeFileSync(file, code);
