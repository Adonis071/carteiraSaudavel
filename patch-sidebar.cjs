const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!code.includes('Share2')) {
  code = code.replace(/import \{ LayoutDashboard, Receipt, Settings, LogOut, Wallet, Shield \} from 'lucide-react';/, "import { LayoutDashboard, Receipt, Settings, LogOut, Wallet, Shield, Share2 } from 'lucide-react';");
  
  code = code.replace(/import \{ cn \} from '\.\.\/lib\/utils';/, "import { cn } from '../lib/utils';\nimport { db } from '../firebase';\nimport { collection, getDocs, query, orderBy } from 'firebase/firestore';");
}

const handleShareCode = `
  const [sharing, setSharing] = React.useState(false);

  const handleShare = async () => {
    if (!currentUser) return;
    setSharing(true);
    try {
      const q = query(
        collection(db, 'users', currentUser.uid, 'transactions'),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const transactions = snapshot.docs.map(doc => doc.data());
      
      const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
      const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
      const balance = totalIncome - totalExpense;

      const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

      const text = \`📊 *Relatório - Carteira Saudável*\\n\\n\` +
                   \`💰 *Saldo Atual:* \${formatCurrency(balance)}\\n\` +
                   \`📈 *Receitas:* \${formatCurrency(totalIncome)}\\n\` +
                   \`📉 *Despesas:* \${formatCurrency(totalExpense)}\\n\\n\` +
                   \`Gerado pelo app Carteira Saudável.\`;

      if (navigator.share) {
        await navigator.share({
          title: 'Meu Relatório Financeiro',
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Relatório copiado para a área de transferência! Cole onde desejar (WhatsApp, E-mail, etc).');
      }
    } catch (err) {
      console.error("Erro ao compartilhar", err);
      // AbortError is common if the user cancels the share dialog, no need to alert
    } finally {
      setSharing(false);
      if (onClose) onClose();
    }
  };
`;

if (!code.includes('const handleShare =')) {
  code = code.replace(/const toggleTheme = \(\) => \{/, handleShareCode + "\n  const toggleTheme = () => {");
}

const buttonCode = `        <button
          onClick={handleShare}
          disabled={sharing}
          className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          <Share2 className="mr-3 w-5 h-5 flex-shrink-0" />
          {sharing ? 'Preparando...' : 'Compartilhar Relatório'}
        </button>
      </nav>`;

code = code.replace(/<\/nav>/, buttonCode);

fs.writeFileSync('src/components/Sidebar.tsx', code);
console.log('Patched Sidebar.tsx with Share button');
