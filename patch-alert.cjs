const fs = require('fs');
let code = fs.readFileSync('src/components/Transactions.tsx', 'utf8');

const regex = /      } catch \(error\) \{\n        console\.error\("Error adding doc in background", error\);\n      \}/g;

const newCode = `      } catch (error: any) {
        console.error("Error adding doc in background", error);
        alert("Erro crítico ao salvar no banco de dados:\\n" + (error?.message || error) + "\\n\\nSe for um erro de permissão ou NOT_FOUND, verifique as regras do Firestore ou o Database ID no console.");
      }`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Transactions.tsx', code);
console.log('Patched Transactions.tsx to add alert');
