import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Transaction } from '../types';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Download, Sparkles, Plus, Landmark, RefreshCw, X, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '../lib/utils';
import BankSync from './BankSync';
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";


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


// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};






export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    
    const q = query(
      collection(db, 'users', currentUser.uid, 'transactions'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const generateInsights = async () => {
    if (transactions.length === 0) return;
    setLoadingInsights(true);
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: transactions.slice(0, 50) }) // Send last 50 for context
      });
      const data = await response.json();
      if (data.insights) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error("Failed to generate insights:", error);
    } finally {
      setLoadingInsights(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // zinc-900
    doc.text('Relatório Financeiro - Carteira Saudável', 14, 22);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // zinc-500
    doc.text(`Período: ${format(new Date(), 'MMMM yyyy', { locale: ptBR })}`, 14, 32);
    
    // Summaries
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Saldo Atual: ${formatCurrency(balance)}`, 14, 45);
    doc.setTextColor(22, 163, 74); // green-600
    doc.text(`Receitas: ${formatCurrency(totalIncome)}`, 14, 53);
    doc.setTextColor(220, 38, 38); // red-600
    doc.text(`Despesas: ${formatCurrency(totalExpense)}`, 14, 61);
    
    // Table
    const tableData = transactions.map(t => [
      safeFormatDate(t.date, "dd/MM/yyyy"),
      t.name,
      t.category,
      t.type === 'income' ? 'Receita' : 'Despesa',
      formatCurrency(t.amount)
    ]);
    
    autoTable(doc, {
      startY: 70,
      head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }, // violet-600
      styles: { fontSize: 10, cellPadding: 4 },
    });
    
    doc.save(`Relatorio_Financeiro_${format(new Date(), 'MMM_yyyy')}.pdf`);
  };

  // Calculations
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;

  // Chart Data Preparation (Grouping by Date)
  const chartData = [...transactions].reverse().reduce((acc: any[], t) => {
    const dateStr = safeFormatDate(t.date, "dd MMM");
    const existingDate = acc.find(item => item.date === dateStr);
    
    if (existingDate) {
      if (t.type === 'income') existingDate.Receitas += t.amount;
      if (t.type === 'expense') existingDate.Despesas += t.amount;
    } else {
      acc.push({
        date: dateStr,
        Receitas: t.type === 'income' ? t.amount : 0,
        Despesas: t.type === 'expense' ? t.amount : 0
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6" id="dashboard-content">
      {/* Header Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Visão Geral</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Acompanhe seu patrimônio e gastos
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={() => navigate("/transactions", { state: { openForm: true } })} className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm"><Plus className="w-4 h-4 mr-2" />Nova Transação</button>
          <BankSync className="flex-1 sm:flex-none" />
          <button
            onClick={exportPDF}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Saldo Atual</h3>
            <div className="p-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">
            {formatCurrency(balance)}
          </p>
        </motion.div>

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Receitas</h3>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <ArrowUpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">
            {formatCurrency(totalIncome)}
          </p>
        </motion.div>

        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Despesas</h3>
            <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg">
              <ArrowDownCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">
            {formatCurrency(totalExpense)}
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50 flex flex-col min-w-0 overflow-hidden">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Fluxo de Caixa</h3>
          <div className="flex-1 min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `R$ ${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                  <Area type="monotone" dataKey="Receitas" stroke="#16a34a" strokeWidth={2} fillOpacity={1} fill="url(#colorReceitas)" />
                  <Area type="monotone" dataKey="Despesas" stroke="#dc2626" strokeWidth={2} fillOpacity={1} fill="url(#colorDespesas)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                Nenhum dado para exibir. Adicione transações.
              </div>
            )}
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-md p-6 border border-zinc-100 dark:border-zinc-700/50 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 dark:bg-violet-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Carteira Saudável AI</h3>
            </div>
            {!insights && (
              <button
                onClick={generateInsights}
                disabled={loadingInsights || transactions.length === 0}
                className="py-2 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-md hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50 flex items-center transform hover:scale-105 active:scale-95"
              >
                {loadingInsights ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {loadingInsights ? 'Analisando...' : 'Gerar Análise'}
              </button>
            )}
          </div>
          
          <div className="relative z-10 flex-1 flex flex-col">
            {insights ? (
              <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {insights}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 mb-4 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-violet-500 dark:text-violet-400 opacity-50" />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-[250px]">
                  Descubra padrões nos seus gastos e receba dicas inteligentes do nosso assistente virtual.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
