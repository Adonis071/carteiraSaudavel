const fs = require('fs');

const dashFile = 'src/components/Dashboard.tsx';
let dashCode = fs.readFileSync(dashFile, 'utf8');

const oldDashUseEffect = /useEffect\(\(\) => \{\n\s*if \(\!currentUser\) return;\n\s*const q = query\(\n\s*collection\(db, 'users', currentUser\.uid, 'transactions'\),\n\s*orderBy\('date', 'desc'\)\n\s*\);\n\s*const unsubscribe = onSnapshot\(q, \(snapshot\) => \{\n\s*const data = snapshot\.docs\.map\(doc => \(\{\n\s*id: doc\.id,\n\s*\.\.\.doc\.data\(\)\n\s*\}\)\) as Transaction\[\];\n\s*setTransactions\(data\);\n\s*setLoading\(false\);\n\s*\}, \(error\) => \{\n\s*console\.error\("Erro no onSnapshot do Dashboard:", error\);\n\s*setLoading\(false\);\n\s*\}\);\n\s*return unsubscribe;\n\s*\}, \[currentUser\]\);/g;

const newDashUseEffect = `useEffect(() => {
    if (!currentUser) return;
    
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const setupListener = async () => {
      try {
        await currentUser.getIdToken(true); // Força um token fresco antes
        if (!isMounted) return;

        const q = query(
          collection(db, 'users', currentUser.uid, 'transactions'),
          orderBy('date', 'desc')
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Transaction[];
          setTransactions(data);
          setLoading(false);
        }, (error: any) => {
          console.error("🔥 Firebase Firestore Erro Real (Dashboard):", error.code, error.message, error);
          setLoading(false);
        });
      } catch (err) {
        console.error("Erro ao forçar token no Dashboard:", err);
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);`;

dashCode = dashCode.replace(oldDashUseEffect, newDashUseEffect);
fs.writeFileSync(dashFile, dashCode);


const txFile = 'src/components/Transactions.tsx';
let txCode = fs.readFileSync(txFile, 'utf8');

const oldTxUseEffect = /useEffect\(\(\) => \{\n\s*if \(\!currentUser\) return;\n\s*const q = query\(\n\s*collection\(db, 'users', currentUser\.uid, 'transactions'\),\n\s*orderBy\('date', 'desc'\)\n\s*\);\n\s*const unsubscribe = onSnapshot\(q, \(snapshot\) => \{\n\s*const data = snapshot\.docs\.map\(doc => \(\{\n\s*id: doc\.id,\n\s*\.\.\.doc\.data\(\)\n\s*\}\)\) as Transaction\[\];\n\s*setTransactions\(data\);\n\s*\}, \(error\) => \{\n\s*console\.error\("Erro no onSnapshot das transações:", error\);\n\s*alert\("Erro ao buscar transações: " \+ error\.message\);\n\s*\}\);\n\s*return unsubscribe;\n\s*\}, \[currentUser\]\);/g;

const newTxUseEffect = `useEffect(() => {
    if (!currentUser) return;
    
    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const setupListener = async () => {
      try {
        await currentUser.getIdToken(true); // Força um token fresco antes
        if (!isMounted) return;

        const q = query(
          collection(db, 'users', currentUser.uid, 'transactions'),
          orderBy('date', 'desc')
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Transaction[];
          setTransactions(data);
        }, (error: any) => {
          console.error("🔥 Firebase Firestore Erro Real (Transactions):", error.code, error.message, error);
          alert("Erro real do Firestore: " + (error.message || error));
        });
      } catch (err) {
        console.error("Erro ao forçar token em Transactions:", err);
      }
    };

    setupListener();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);`;

txCode = txCode.replace(oldTxUseEffect, newTxUseEffect);
fs.writeFileSync(txFile, txCode);

console.log("Patched useEffects!");
