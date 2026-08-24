const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Import motion
content = content.replace(
  'import { useNavigate } from "react-router-dom";',
  'import { useNavigate } from "react-router-dom";\nimport { motion } from "motion/react";'
);

// 2. Animate header
content = content.replace(
  '<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">',
  '<motion.div \n        initial={{ opacity: 0, y: 10 }}\n        animate={{ opacity: 1, y: 0 }}\n        transition={{ duration: 0.4 }}\n        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">'
);
content = content.replace(
  '</button>\n        </div>\n      </div>',
  '</button>\n        </div>\n      </motion.div>'
);

// 3. Animate metric cards
content = content.replace(
  '<div className="grid grid-cols-1 md:grid-cols-3 gap-6">',
  '<motion.div \n        initial="hidden"\n        animate="visible"\n        variants={{\n          hidden: { opacity: 0 },\n          visible: {\n            opacity: 1,\n            transition: { staggerChildren: 0.1 }\n          }\n        }}\n        className="grid grid-cols-1 md:grid-cols-3 gap-6">'
);

// Card 1
content = content.replace(
  '<div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">\n          <div className="flex items-center justify-between">\n            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Saldo Atual</h3>',
  '<motion.div \n          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}\n          transition={{ duration: 0.4 }}\n          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">\n          <div className="flex items-center justify-between">\n            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Saldo Atual</h3>'
);

// Card 2
content = content.replace(
  '<div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">\n          <div className="flex items-center justify-between">\n            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Receitas</h3>',
  '<motion.div \n          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}\n          transition={{ duration: 0.4 }}\n          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">\n          <div className="flex items-center justify-between">\n            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Receitas</h3>'
);

// Card 3
content = content.replace(
  '<div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">\n          <div className="flex items-center justify-between">\n            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Despesas</h3>',
  '<motion.div \n          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}\n          transition={{ duration: 0.4 }}\n          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700/50">\n          <div className="flex items-center justify-between">\n            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Despesas</h3>'
);

// Close motion.divs for cards
let occurrences = 0;
content = content.replace(/<\/p>\n        <\/div>/g, (match) => {
  occurrences++;
  if (occurrences <= 3) {
    return '</p>\n        </motion.div>';
  }
  return match;
});

// Close grid motion.div
content = content.replace(
  '</p>\n        </motion.div>\n      </div>',
  '</p>\n        </motion.div>\n      </motion.div>'
);

// 4. Animate Charts and AI Section container
content = content.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">',
  '<motion.div \n        initial={{ opacity: 0, y: 20 }}\n        animate={{ opacity: 1, y: 0 }}\n        transition={{ duration: 0.5, delay: 0.2 }}\n        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">'
);

content = content.replace(
  '</div>\n            )}             \n          </div>\n        </div>\n      </div>\n    </div>',
  '</div>\n            )}             \n          </div>\n        </div>\n      </motion.div>\n    </div>'
);

fs.writeFileSync('src/components/Dashboard.tsx', content);
