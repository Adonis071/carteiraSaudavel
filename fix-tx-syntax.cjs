const fs = require('fs');
let code = fs.readFileSync('src/components/Transactions.tsx', 'utf8');

const oldFuncStart = `  const handleAddTransaction = async (e: React.FormEvent) => {`;
const oldFuncEnd = `    })();\n  };`; // Wait, this might not match exactly.

// Let's just use regex to replace the entire handleAddTransaction body.
// It starts at "const handleAddTransaction = async (e: React.FormEvent) => {"
// and ends at "};" before "const deleteTransaction = async (id: string) => {"
const pattern = /const handleAddTransaction = async \(e: React\.FormEvent\) => \{[\s\S]*?\n  \};\n\n  const deleteTransaction = async/m;

const newFunc = `const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !amount || !name) return;

    // Capture state values before resetting
    const txAmount = parseFloat(amount);
    const txName = name;
    const txType = type;
    const txDate = date;
    const txSelCat = selectedCategory;
    const txCustCat = customCategory;

    // Show loading state and prevent form close until done
    setIsClassifying(true);
    
    let category = 'Outros';

    try {
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
          console.error("AI Classification error", error);
          // Fallback if AI fails or times out
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
      console.error("Error adding doc", error);
    } finally {
      setIsClassifying(false);
      setIsAdding(false);
      setAmount('');
      setName('');
      setSelectedCategory('Auto (IA)');
      setCustomCategory('');
    }
  };

  const deleteTransaction = async`;

code = code.replace(pattern, newFunc);
fs.writeFileSync('src/components/Transactions.tsx', code);
console.log('Fixed syntax');
