const fs = require('fs');
let code = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');

const regex = /onAuthStateChanged\(auth, \(user\) => \{\n      setCurrentUser\(user\);\n      setLoading\(false\);\n    \}\);/g;

const newCode = `onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("🔥 [DIAGNÓSTICO] UID do usuário atual:", user.uid);
      } else {
        console.log("🔥 [DIAGNÓSTICO] Nenhum usuário logado.");
      }
      setCurrentUser(user);
      setLoading(false);
    });`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/context/AuthContext.tsx', code);
console.log('Patched AuthContext.tsx properly');
