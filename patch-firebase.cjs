const fs = require('fs');

const firebaseTs = `import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjNDuhbiB3Xtb_hsNNyzXwksfEJX3oSQQ",
  authDomain: "carteirasaudavel-17e4b.firebaseapp.com",
  projectId: "carteirasaudavel-17e4b",
  storageBucket: "carteirasaudavel-17e4b.firebasestorage.app",
  messagingSenderId: "913957967804",
  appId: "1:913957967804:web:63714d4a4464b759b6bdb9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);
`;

fs.writeFileSync('src/firebase.ts', firebaseTs);
console.log("Patched src/firebase.ts back to carteirasaudavel-17e4b");
