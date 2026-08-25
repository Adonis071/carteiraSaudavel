const fs = require('fs');
let index = fs.readFileSync('index.html', 'utf8');
index = index.replace('<html lang="en">', '<html lang="pt-BR" translate="no">');
index = index.replace('<head>', '<head>\n    <meta name="google" content="notranslate" />');
fs.writeFileSync('index.html', index);
console.log('Patched index.html');
