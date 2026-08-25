const fs = require('fs');
let code = fs.readFileSync('src/components/Auth.tsx', 'utf8');

const regex = /      \} else if \(mode === 'reset'\) \{\n        await sendPasswordResetEmail\(auth, email\);\n        setMessage\('E-mail de recuperação enviado! Verifique sua caixa de entrada\.'\);\n        setMode\('login'\);\n      \}/g;

const newCode = `      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Se o e-mail estiver cadastrado, enviamos um link de recuperação. Por segurança, o sistema sempre confirma o envio. Verifique também sua caixa de Spam e confirme se digitou o e-mail exato do cadastro.');
        setMode('login');
      }`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Auth.tsx', code);
console.log('Patched Auth.tsx');
