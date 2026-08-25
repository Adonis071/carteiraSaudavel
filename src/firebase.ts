import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence, inMemoryPersistence } from 'firebase/auth';
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

// Configura persistência de sessão. Desloga o usuário ao fechar o navegador/aba.
setPersistence(auth, browserSessionPersistence).catch(() => {
  console.warn('browserSessionPersistence indisponível, usando memória (sessão não sobrevive a refresh).');
  setPersistence(auth, inMemoryPersistence);
});

// Initialize Firestore
export const db = getFirestore(app);
