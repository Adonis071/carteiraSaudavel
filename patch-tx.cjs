const fs = require('fs');
let code = fs.readFileSync('src/components/Transactions.tsx', 'utf8');

// Add isSaving state
if (!code.includes('isSaving')) {
  code = code.replace(/const \[isAdding, setIsAdding\] = useState\(location\.state\?\.openForm \|\| false\);/, 
    "const [isAdding, setIsAdding] = useState(location.state?.openForm || false);\n  const [isSaving, setIsSaving] = useState(false);");
}

// Fix handleAddTransaction
const newHandle = `  const handleAddTransaction = async (e: React.FormEvent) => {
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
      alert("❌ ERRO AO SALVAR NO BANCO DE DADOS!\\n\\nO Firebase bloqueou a gravação. Você precisa liberar as Regras do Firestore no console do Firebase (aba Rules).\\n\\nDetalhe do erro: " + (error?.message || error));
    } finally {
      setIsSaving(false);
    }
  };`;

// Replace the old handleAddTransaction block
const oldHandleRegex = /const handleAddTransaction = async \(e: React\.FormEvent\) => \{[\s\S]*?\}\)\(\);\n  \};/g;
code = code.replace(oldHandleRegex, newHandle);

// Add loading state to button
code = code.replace(/<button\n\s*type="submit"\n\s*className="px-4 py-2 bg-violet-600 text-white rounded-lg.*>[\s\S]*?<\/button>/, 
`<button
  type="submit"
  disabled={isSaving}
  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
>
  {isSaving ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
  {isSaving ? 'Salvando...' : 'Salvar Transação'}
</button>`);

fs.writeFileSync('src/components/Transactions.tsx', code);
console.log('Patched Transactions.tsx');
