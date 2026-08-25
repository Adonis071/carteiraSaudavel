const fs = require('fs');
let code = fs.readFileSync('src/components/Transactions.tsx', 'utf8');

// Replace the optimistic closing with a blocking loading state
const oldLogic = `    // Optimistically close modal/reset form IMMEDIATELY
    setIsAdding(false);
    setAmount('');
    setName('');
    setSelectedCategory('Auto (IA)');
    setCustomCategory('');
    
    // Background task to save and classify
    (async () => {
      setIsClassifying(true);`;

const newLogic = `    // Show loading state and prevent form close until done
    setIsClassifying(true);
    
    try {`;

const oldEndOfLogic = `      } catch (err) {
        console.error('Error saving transaction', err);
      } finally {
        setIsClassifying(false);
      }
    })();`;

const newEndOfLogic = `      } catch (err) {
        console.error('Error saving transaction', err);
      } finally {
        setIsClassifying(false);
        setIsAdding(false);
        setAmount('');
        setName('');
        setSelectedCategory('Auto (IA)');
        setCustomCategory('');
      }
    } catch (outerErr) {
        console.error(outerErr);
        setIsClassifying(false);
    }`;

// Try to patch it
if (code.includes('// Optimistically close modal')) {
    code = code.replace(oldLogic, newLogic);
    // Find the end of the async IIFE and replace it.
    code = code.replace(oldEndOfLogic, newEndOfLogic);
    fs.writeFileSync('src/components/Transactions.tsx', code);
    console.log('Patched Transactions.tsx');
} else {
    console.log('Could not find old logic.');
}

