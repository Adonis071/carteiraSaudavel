const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const targetFunc = `  const generateInsights = async () => {
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
  };`;

const newFunc = `  const generateInsights = async () => {
    if (transactions.length === 0) return;
    setLoadingInsights(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
      
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: transactions.slice(0, 50) }), // Send last 50 for context
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        if (data.insights) {
          setInsights(data.insights);
        } else {
          setInsights("Não foi possível gerar insights no momento. Tente novamente mais tarde.");
        }
      } else {
        setInsights("Erro ao conectar com a IA. Verifique se a API Key do Gemini está configurada corretamente.");
      }
    } catch (error) {
      console.error("Failed to generate insights:", error);
      setInsights("Erro de conexão ao gerar insights. Tente novamente.");
    } finally {
      setLoadingInsights(false);
    }
  };`;

if (code.includes('const generateInsights = async () => {')) {
    // Just regex replace the function
    const pattern = /const generateInsights = async \(\) => \{[\s\S]*?\n  \};\n/m;
    code = code.replace(pattern, newFunc + '\n');
    fs.writeFileSync('src/components/Dashboard.tsx', code);
    console.log('Patched generateInsights in Dashboard.tsx');
} else {
    console.log('Could not find generateInsights.');
}
