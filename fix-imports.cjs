const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

dash = dash.replace(/import BankSync from '\.\/BankSync';/g, '');
dash = dash.replace(/import \{ useNavigate \} from "react-router-dom";/g, '');
dash = dash.replace(/import \{ motion \} from "motion\/react";/g, '');

const allImports = `
import BankSync from './BankSync';
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
`;

dash = dash.replace(/import \{ cn \} from '\.\.\/lib\/utils';/, "import { cn } from '../lib/utils';" + allImports);
fs.writeFileSync('src/components/Dashboard.tsx', dash);
console.log('Fixed imports in Dashboard.tsx');
