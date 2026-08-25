const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
dash = dash.replace(
  'navigate("/transactions")',
  'navigate("/transactions", { state: { openForm: true } })'
);
fs.writeFileSync('src/components/Dashboard.tsx', dash);

let trans = fs.readFileSync('src/components/Transactions.tsx', 'utf8');
trans = trans.replace(
  'import { useNavigate } from \'react-router-dom\';',
  'import { useNavigate, useLocation } from \'react-router-dom\';'
);
trans = trans.replace(
  'const [isAdding, setIsAdding] = useState(false);',
  'const location = useLocation();\n  const [isAdding, setIsAdding] = useState(location.state?.openForm || false);'
);
fs.writeFileSync('src/components/Transactions.tsx', trans);

console.log('Patched UX');
