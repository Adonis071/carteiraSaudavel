import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("🔥 [DIAGNÓSTICO] UID do usuário atual:", user.uid);
      } else {
        console.log("🔥 [DIAGNÓSTICO] Nenhum usuário logado.");
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in failed:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
