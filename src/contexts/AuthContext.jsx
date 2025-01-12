import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
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
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            await createUserDocument(user);
          } catch (error) {
            console.error("Error creating user document:", error);
          }
        }
        setUser(user);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);

    function login() {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
      }
    
      function logout() {
        return signOut(auth);
      }

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
  }