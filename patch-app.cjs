const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /import Transactions from '.\/components\/Transactions';/g,
  "import Transactions from './components/Transactions';\nimport MyAccount from './components/MyAccount';"
);

code = code.replace(
  /<Route path="\/transactions" element=\{[\s\S]*?\} \/>/g,
  `<Route path="/transactions" element={
            <motion.div {...pageTransition} className="w-full">
              <Transactions />
            </motion.div>
          } />
          <Route path="/account" element={
            <motion.div {...pageTransition} className="w-full">
              <MyAccount />
            </motion.div>
          } />`
);

fs.writeFileSync(file, code);
