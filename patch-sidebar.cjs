const fs = require('fs');
const file = 'src/components/Sidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /import \{ LayoutDashboard, Receipt, Settings, LogOut, Wallet, Shield, Share2 \} from 'lucide-react';/g,
  "import { LayoutDashboard, Receipt, Settings, LogOut, Wallet, Shield, Share2, UserCircle } from 'lucide-react';"
);

code = code.replace(
  /const navItems = \[\n\s*\{ name: 'Dashboard', icon: LayoutDashboard, path: '\/' \},\n\s*\{ name: 'Transações', icon: Receipt, path: '\/transactions' \},\n\s*\];/g,
  `const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Transações', icon: Receipt, path: '/transactions' },
    { name: 'Minha Conta', icon: UserCircle, path: '/account' },
  ];`
);

fs.writeFileSync(file, code);
