import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { createUserDocument } from '../lib/firebase/users';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await createUserDocument(user);
        } catch (error) {
          console.error("Error creating user document:", error);
          setError(error.message);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function loginWithGoogle() {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function loginWithEmail(email, password) {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function signup(email, password) {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user); // Create user document in Firestore
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      setError(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  const value = {
    user,
    error,
    loading,
    loginWithGoogle,
    loginWithEmail,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}