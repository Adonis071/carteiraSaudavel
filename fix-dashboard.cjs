const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

content = content.replace(
  '          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">\n            {formatCurrency(totalExpense)}\n          </p>\n        </div>\n      </div>',
  '          <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-4">\n            {formatCurrency(totalExpense)}\n          </p>\n        </motion.div>\n      </motion.div>'
);

content = content.replace(
  '      {/* Main Content Grid */}\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">',
  '      {/* Main Content Grid */}\n      <motion.div \n        initial={{ opacity: 0, y: 20 }}\n        animate={{ opacity: 1, y: 0 }}\n        transition={{ duration: 0.5, delay: 0.2 }}\n        className="grid grid-cols-1 lg:grid-cols-3 gap-6">'
);

content = content.replace(
  '          </div>\n        </div>\n      </div>\n    </div>\n  );\n}',
  '          </div>\n        </div>\n      </motion.div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
