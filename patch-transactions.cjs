const fs = require('fs');

const txFile = 'src/components/Transactions.tsx';
let txCode = fs.readFileSync(txFile, 'utf8');

// Fix button disabled state
txCode = txCode.replace(
  /disabled=\{isClassifying\}/g,
  'disabled={isSaving}'
);

txCode = txCode.replace(
  /isClassifying \?/g,
  'isSaving ?'
);

// Fix table column for date/time
const oldDateColumn = `<td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                      {safeFormatDate(t.date, "dd 'de' MMM, yyyy")}
                    </td>`;

const newDateColumn = `<td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-900 dark:text-zinc-100">{safeFormatDate(t.date, "dd 'de' MMM, yyyy")}</div>
                      {t.createdAt?.toDate && (
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {format(t.createdAt.toDate(), "HH:mm")}
                        </div>
                      )}
                    </td>`;

txCode = txCode.replace(oldDateColumn, newDateColumn);

fs.writeFileSync(txFile, txCode);
console.log("Patched Transactions.tsx");
