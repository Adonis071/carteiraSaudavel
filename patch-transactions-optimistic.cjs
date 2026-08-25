const fs = require('fs');
let code = fs.readFileSync('src/components/Transactions.tsx', 'utf8');

const regex = /const handleAddTransaction = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};\n\n  const deleteTransaction = async/m;

const newFunc = `const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || !name) return;

    // Fix comma replacing and NaN issues
    const normalizedAmount = amount.replace(',', '.');
    let txAmount = parseFloat(normalizedAmount);
    if (isNaN(txAmount)) txAmount = 0;

    const txName = name;
    const txType = type;
    const txDate = date;
    const txSelCat = selectedCategory;
    const txCustCat = customCategory;

    // Optimistically close modal and reset form IMMEDIATELY for a snappy UI
    setIsAdding(false);
    setIsClassifying(false);
    setAmount('');
    setName('');
    setSelectedCategory('Auto (IA)');
    setCustomCategory('');
    
    // Run the API call and Firestore save in the background
    (async () => {
      let category = 'Outros';
      let aiSuccess = false;

      try {
        if (txSelCat === 'Outro') {
          category = txCustCat || 'Outros';
        } else if (txSelCat !== 'Auto (IA)') {
          category = txSelCat;
        } else {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const aiRes = await fetch('/api/ai/classify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ transactionName: txName, amount: txAmount }),
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (aiRes.ok) {
               const aiData = await aiRes.json();
               if (aiData.category) {
                 category = aiData.category;
                 aiSuccess = true;
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
          name: txName,
          type: txType,
          date: txDate,
          category: category,
          createdAt: serverTimestamp(),
          source: 'manual'
        });
        
      } catch (error) {
        console.error("Error adding doc in background", error);
      }
    })();
  };

  const deleteTransaction = async`;

code = code.replace(regex, newFunc);
fs.writeFileSync('src/components/Transactions.tsx', code);
console.log('Patched handleAddTransaction back to optimistic approach');
