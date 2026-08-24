sed -i 's/export const db = getFirestore(app);/export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);/g' src/firebase.ts
