import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Transaction } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Trash2, Tag, Landmark, Wallet, RefreshCw, X } from 'lucide-react';
import { cn } from '../lib/utils';

const safeFormatDate = (dateStr: any, fmt: string) => {
  try {
    if (!dateStr) return 'Data Inválida';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Data Inválida';
    return format(d, fmt, { locale: ptBR });
  } catch (e) {
    return 'Data Inválida';
  }
};


export default function Transactions() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(location.state?.openForm || false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form State
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedCategory, setSelectedCategory] = useState('Auto (IA)');
  const [customCategory, setCustomCategory] = useState('');
  const [isClassifying, setIsClassifying] = useState(false);

  useEffect(() => {
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
  }, [currentUser]);

    const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || !name) return;

    setIsSaving(true);
    
    // Fix comma replacing and NaN issues
    const normalizedAmount = amount.replace(',', '.');
    let txAmount = parseFloat(normalizedAmount);
    if (isNaN(txAmount)) txAmount = 0;

    let category = 'Outros';
    try {
      if (selectedCategory === 'Outro') {
        category = customCategory || 'Outros';
      } else if (selectedCategory !== 'Auto (IA)') {
        category = selectedCategory;
      } else {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);

          const aiRes = await fetch('/api/ai/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionName: name, amount: txAmount }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          if (aiRes.ok) {
             const aiData = await aiRes.json();
             if (aiData.category) {
               category = aiData.category;
             }
          }
        } catch (error) {
          console.error("AI Classification error", error);
          category = 'Outros';
        }
      }

      await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
        userId: currentUser.uid,
        amount: txAmount,
        name: name,
        type: type,
        date: date,
        category: category,
        createdAt: serverTimestamp(),
        source: 'manual'
      });
      
      // Success! Reset form and close
      setIsAdding(false);
      setAmount('');
      setName('');
      setSelectedCategory('Auto (IA)');
      setCustomCategory('');
      
    } catch (error: any) {
      console.error("Error adding doc:", error);
      alert("❌ ERRO AO SALVAR NO BANCO DE DADOS!\n\nO Firebase bloqueou a gravação. Você precisa liberar as Regras do Firestore no console do Firebase (aba Rules).\n\nDetalhe do erro: " + (error?.message || error));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'transactions', id));
    } catch (error) {
      console.error("Error deleting doc", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm" title="Voltar ao Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Transações</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Gerencie suas receitas e despesas</p>
        </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm"
        >
          {isAdding ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {isAdding ? 'Cancelar' : 'Nova Transação'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Tipo</label>
              <div className="flex rounded-lg shadow-sm">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-l-lg border",
                    type === 'expense' 
                      ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 z-10" 
                      : "bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  )}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-r-lg border -ml-px",
                    type === 'income' 
                      ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 z-10" 
                      : "bg-white dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  )}
                >
                  Receita
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 h-11 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Descrição</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 h-11 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
                placeholder="Ex: Supermercado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 h-11 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Categoria</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 h-11 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
              >
                <option value="Auto (IA)">Auto (Inteligência Artificial)</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Moradia">Moradia</option>
                <option value="Lazer">Lazer</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Salário">Salário</option>
                <option value="Serviços">Serviços</option>
                <option value="Outro">Outro (Digitar)</option>
              </select>
            </div>

            {selectedCategory === 'Outro' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Digite a Categoria</label>
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 h-11 border border-zinc-300 dark:border-zinc-600 rounded-lg shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm dark:bg-zinc-700 dark:text-white"
                  placeholder="Ex: Viagem, Presentes..."
                />
              </div>
            )}

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isClassifying}
                className="w-full flex justify-center items-center h-11 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-75"
              >
                {isClassifying ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {isClassifying ? (selectedCategory === 'Auto (IA)' ? 'Classificando com AI...' : 'Salvando...') : 'Salvar Transação'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Categoria</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Valor</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={cn("flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center", 
                          t.source === 'plaid' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                        )}>
                          {t.source === 'plaid' ? <Landmark className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-zinc-900 dark:text-white">{t.name}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{t.source === 'plaid' ? 'Sincronizado' : 'Manual'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                        <Tag className="w-3 h-3 mr-1" />
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                      {safeFormatDate(t.date, "dd 'de' MMM, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <span className={t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-zinc-900 dark:text-white'}>
                        {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
