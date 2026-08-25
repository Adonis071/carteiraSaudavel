const fs = require('fs');
let code = fs.readFileSync('src/components/BankSync.tsx', 'utf8');

const oldButton = `  return (
    <button
      onClick={() => open()}
      disabled={!ready || syncing || !linkToken}
      className={cn(
        "flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium border border-zinc-200 dark:border-zinc-700 disabled:opacity-50",
        className
      )}
    >
      <RefreshCw className={cn("w-4 h-4 mr-2", syncing && "animate-spin")} />
      {syncing ? 'Sincronizando...' : 'Conectar Banco'}
    </button>
  );`;

const newButton = `  const handleSimulatedSync = async () => {
    setSyncing(true);
    try {
      // Simulate API delay
      await new Promise(r => setTimeout(r, 1500));
      
      const mockTransactions = [
        { name: 'Uber', amount: 25.50, type: 'expense', category: 'Transporte' },
        { name: 'Mercado Livre', amount: 120.00, type: 'expense', category: 'Compras' },
        { name: 'Salário', amount: 4500.00, type: 'income', category: 'Salário' }
      ];

      for (const t of mockTransactions) {
        await addDoc(collection(db, 'users', currentUser!.uid, 'transactions'), {
          userId: currentUser!.uid,
          amount: t.amount,
          name: t.name,
          type: t.type,
          date: new Date().toISOString(),
          category: t.category,
          source: 'plaid_mock',
          createdAt: serverTimestamp()
        });
      }
      alert('Transações simuladas sincronizadas com sucesso! (Modo de Demonstração)');
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleConnect = () => {
    if (linkToken && ready) {
      open();
    } else {
      handleSimulatedSync();
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={syncing}
      className={cn(
        "flex items-center justify-center px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium border border-zinc-200 dark:border-zinc-700 disabled:opacity-50",
        className
      )}
    >
      <RefreshCw className={cn("w-4 h-4 mr-2", syncing && "animate-spin")} />
      {syncing ? 'Sincronizando...' : 'Conectar Banco'}
    </button>
  );`;

if (code.includes(oldButton)) {
  code = code.replace(oldButton, newButton);
  fs.writeFileSync('src/components/BankSync.tsx', code);
  console.log('Patched BankSync.tsx');
} else {
  console.log('Could not find oldButton');
}
