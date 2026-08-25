const fs = require('fs');
let code = fs.readFileSync('src/components/Transactions.tsx', 'utf8');

const regex = /const unsubscribe = onSnapshot\(q, \(snapshot\) => \{\n      const data = snapshot\.docs\.map\(doc => \(\{\n        id: doc\.id,\n        \.\.\.doc\.data\(\)\n      \}\)\) as Transaction\[\];\n      setTransactions\(data\);\n    \}\);/g;

const newCode = `const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(data);
    }, (error) => {
      console.error("Erro no onSnapshot das transações:", error);
      alert("Erro ao buscar transações: " + error.message);
    });`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Transactions.tsx', code);
console.log('Patched Transactions.tsx to add error handling in onSnapshot');
