const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const regex = /const unsubscribe = onSnapshot\(q, \(snapshot\) => \{\n      const data = snapshot\.docs\.map\(doc => \(\{\n        id: doc\.id,\n        \.\.\.doc\.data\(\)\n      \}\)\) as Transaction\[\];\n      setTransactions\(data\);\n      setLoading\(false\);\n    \}\);/g;

const newCode = `const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(data);
      setLoading(false);
    }, (error) => {
      console.error("Erro no onSnapshot do Dashboard:", error);
      setLoading(false);
    });`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/components/Dashboard.tsx', code);
console.log('Patched Dashboard.tsx to add error handling in onSnapshot');
