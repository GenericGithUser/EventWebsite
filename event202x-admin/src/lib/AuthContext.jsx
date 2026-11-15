import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider( { children} ){
    const [currentUser, setCurrentUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password);
    }

    const logout = () => {
        signOut(auth);
    }

    useEffect(()=>{
      // Fires on login, logout, and when Firebase restores the session on page load
      const unsubscribe = onAuthStateChanged(auth, (user)=> {
        setCurrentUser(user);
        setLoading(false);
      });
      return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
