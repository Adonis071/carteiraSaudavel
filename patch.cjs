const fs = require('fs');

const typesFile = 'src/types.ts';
let typesCode = fs.readFileSync(typesFile, 'utf8');
typesCode = typesCode.replace(
  /plaidTransactionId\?\: string;\n\}/g,
  "plaidTransactionId?: string;\n  createdAt?: any;\n}"
);
fs.writeFileSync(typesFile, typesCode);

const txFile = 'src/components/Transactions.tsx';
let txCode = fs.readFileSync(txFile, 'utf8');

const oldAddDoc = `await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
        userId: currentUser.uid,
        amount: txAmount,
        name: name,
        type: type,
        date: date,
        category: category,
        createdAt: serverTimestamp(),
        source: 'manual'
      });
      setShowAddForm(false);
      setAmount('');
      setName('');
      setSelectedCategory('Auto (IA)');
      setCustomCategory('');`;

if (!txCode.includes("setAmount('');")) {
  txCode = txCode.replace(
    `createdAt: serverTimestamp(),\n        source: 'manual'\n      });`,
    `createdAt: serverTimestamp(),\n        source: 'manual'\n      });\n      // Limpar campos após salvar\n      setAmount('');\n      setName('');\n      setSelectedCategory('Auto (IA)');\n      setCustomCategory('');\n      setShowAddForm(false);`
  );
}

fs.writeFileSync(txFile, txCode);
