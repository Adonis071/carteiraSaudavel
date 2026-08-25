const fs = require('fs');
const file = 'src/components/Dashboard.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `    autoTable(doc, {
      startY: 70,
      head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] }, // violet-600
      styles: { fontSize: 10, cellPadding: 4 },
    });
    
    doc.save(\`Relatorio_Financeiro_\${format(new Date(), 'MMM_yyyy')}.pdf\`);`;

const replacement = `    autoTable(doc, {
      startY: 70,
      head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [124, 58, 237] }, // violet-600
      styles: { fontSize: 10, cellPadding: 4 },
    });

    if (insights) {
      const finalY = (doc as any).lastAutoTable?.finalY || 100;
      
      // Check if we need a new page
      if (finalY > 250) {
        doc.addPage();
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text('Análise da Inteligência Artificial', 14, 20);
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const cleanInsights = insights.replace(/\\*/g, '').replace(/#/g, '');
        const splitText = doc.splitTextToSize(cleanInsights, 180);
        doc.text(splitText, 14, 30);
      } else {
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text('Análise da Inteligência Artificial', 14, finalY + 15);
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        const cleanInsights = insights.replace(/\\*/g, '').replace(/#/g, '');
        const splitText = doc.splitTextToSize(cleanInsights, 180);
        doc.text(splitText, 14, finalY + 25);
      }
    }
    
    doc.save(\`Relatorio_Financeiro_\${format(new Date(), 'MMM_yyyy')}.pdf\`);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched PDF!");
} else {
    console.log("Target not found!");
}
