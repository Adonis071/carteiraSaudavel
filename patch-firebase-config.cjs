const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

// Ensure firestoreDatabaseId is supported if they add it
if (!code.includes('firebaseConfig.firestoreDatabaseId')) {
  code = code.replace(/export const db = getFirestore\(app\);/, 
    "export const db = firebaseConfig.firestoreDatabaseId ? getFirestore(app, firebaseConfig.firestoreDatabaseId) : getFirestore(app);");
  fs.writeFileSync('src/firebase.ts', code);
  console.log('Patched firebase.ts to support firestoreDatabaseId optionally');
} else {
  console.log('Already patched');
}
