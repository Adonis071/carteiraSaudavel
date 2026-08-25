const fs = require('fs');

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace("import { Menu, X } from 'lucide-react';", "import { Menu, X } from 'lucide-react';\nimport { ErrorBoundary } from './components/ErrorBoundary';");

app = app.replace(/<AppRoutes \/>/g, '<ErrorBoundary><AppRoutes /></ErrorBoundary>');
fs.writeFileSync('src/App.tsx', app);
console.log('Added ErrorBoundary');
