const fs = require('fs');
let code = fs.readFileSync('src/components/Transactions.tsx', 'utf8');

const oldFunc = `  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || !name) return;

    setIsClassifying(true);
    let category = 'Outros';

    if (selectedCategory === 'Outro') {
      category = customCategory || 'Outros';
    } else if (selectedCategory !== 'Auto (IA)') {
      category = selectedCategory;
    } else {
      try {
        // Use Gemini to classify the transaction with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout

        const aiRes = await fetch('/api/ai/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionName: name, amount: parseFloat(amount) }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const aiData = await aiRes.json();
        if (aiData.category) {
          category = aiData.category;
        }
      } catch (error) {
        console.error("Classification failed", error);
      }
    }

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
        userId: currentUser.uid,
        amount: parseFloat(amount),
        name,
        type,
        date: new Date(date).toISOString(),
        category,
        source: 'manual',
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setAmount('');
      setName('');
      setSelectedCategory('Auto (IA)');
      setCustomCategory('');
      setIsAdding(false);
      
    } catch (error) {
      console.error("Error adding doc", error);
    } finally {
      setIsClassifying(false);
    }
  };`;

const newFunc = `  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || !name) return;

    // Capture state values before resetting
    const txAmount = parseFloat(amount);
    const txName = name;
    const txType = type;
    const txDate = date;
    const txSelCat = selectedCategory;
    const txCustCat = customCategory;

    // Optimistically close modal/reset form IMMEDIATELY
    setIsAdding(false);
    setAmount('');
    setName('');
    setSelectedCategory('Auto (IA)');
    setCustomCategory('');
    
    // Background task to save and classify
    (async () => {
      setIsClassifying(true);
      let category = 'Outros';

      if (txSelCat === 'Outro') {
        category = txCustCat || 'Outros';
      } else if (txSelCat !== 'Auto (IA)') {
        category = txSelCat;
      } else {
        try {
          // Use Gemini to classify the transaction with a timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 seconds timeout

          const aiRes = await fetch('/api/ai/classify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactionName: txName, amount: txAmount }),
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          const aiData = await aiRes.json();
          if (aiData.category) {
            category = aiData.category;
          }
        } catch (error) {
          console.error("Classification failed", error);
        }
      }

      try {
        await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
          userId: currentUser.uid,
          amount: txAmount,
          name: txName,
          type: txType,
          date: new Date(txDate).toISOString(),
          category,
          source: 'manual',
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error adding doc", error);
      } finally {
        setIsClassifying(false);
      }
    })();
  };`;

if (code.includes(oldFunc)) {
  code = code.replace(oldFunc, newFunc);
  fs.writeFileSync('src/components/Transactions.tsx', code);
  console.log('Patched Transactions.tsx');
} else {
  console.log('Could not find oldFunc');
}
