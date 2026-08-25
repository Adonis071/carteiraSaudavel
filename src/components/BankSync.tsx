import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';

interface BankSyncProps {
  className?: string;
}

export default function BankSync({ className }: BankSyncProps) {
  const { currentUser } = useAuth();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    const generateToken = async () => {
      try {
        const response = await fetch('/api/plaid/create_link_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser.uid })
        });
        const data = await response.json();
        
        if (data.link_token) {
          setLinkToken(data.link_token);
        } else if (data.error) {
          console.error("Plaid API Error:", data.error);
        }
      } catch (err) {
        console.error("Error generating Plaid link token", err);
      }
    };
    generateToken();
  }, [currentUser]);

  const onSuccess = useCallback(async (public_token: string) => {
    setSyncing(true);
    try {
      const res = await fetch('/api/plaid/exchange_and_sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token })
      });
      const data = await res.json();
      
      if (data.transactions && currentUser) {
        // Save transactions to Firestore
        // Note: Plaid amounts are positive for expenses, negative for income.
        for (const t of data.transactions) {
          await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
            userId: currentUser.uid,
            amount: Math.abs(t.amount),
            name: t.name,
            type: t.amount > 0 ? 'expense' : 'income',
            date: new Date(t.date).toISOString(),
            category: t.category ? t.category[0] : 'Outros',
            source: 'plaid',
            createdAt: serverTimestamp(),
            plaidTransactionId: t.transaction_id
          });
        }
        alert('Transações sincronizadas com sucesso!');
      }
    } catch (err) {
      console.error("Error syncing transactions", err);
      alert('Erro ao sincronizar. Verifique se as credenciais Plaid estão corretas nas Secrets.');
    } finally {
      setSyncing(false);
    }
  }, [currentUser]);

  const config: Parameters<typeof usePlaidLink>[0] = {
    token: linkToken || '',
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

  return (
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
  );
}
