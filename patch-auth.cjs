const fs = require('fs');
const file = 'src/components/Auth.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<form className="space-y-4" onSubmit=\{handleSubmit\}>/g,
  '<form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">'
);

code = code.replace(
  /type="email"/g,
  'type="email"\n                  autoComplete="new-password"'
);

code = code.replace(
  /type="password"/g,
  'type="password"\n                    autoComplete="new-password"'
);

code = code.replace(
  /await signInWithEmailAndPassword\(auth, email, password\);/g,
  `await signInWithEmailAndPassword(auth, email, password);
        setEmail('');
        setPassword('');`
);

code = code.replace(
  /await setDoc\(doc\(db, 'users', userCredential\.user\.uid\), \{/g,
  `await setDoc(doc(db, 'users', userCredential.user.uid), {`
);

// We'll also clear on register:
code = code.replace(
  `        });
      } else if (mode === 'reset') {`,
  `        });
        setEmail('');
        setPassword('');
      } else if (mode === 'reset') {`
);

fs.writeFileSync(file, code);
console.log("Patched Auth.tsx");
