'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, rtdb } from './firebase';
import { ref, get, set } from 'firebase/database';

interface UserData {
  email: string;
  isAdmin: boolean;
  name?: string;
  phone?: string;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Get user data from Firebase Realtime Database
          const userRef = ref(rtdb, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val() as UserData;
            console.log('[v0] User data from DB:', userData);
            setUserData(userData);
          } else {
            // Create default user data in RTDB
            const isAdminUser = currentUser.email === ADMIN_EMAIL;
            const defaultUserData: UserData = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              isAdmin: isAdminUser,
              name: currentUser.displayName || '',
              phone: ''
            };
            
            console.log('[v0] Creating new user:', { email: currentUser.email, isAdmin: isAdminUser, ADMIN_EMAIL });
            
            // Save to RTDB
            await set(userRef, defaultUserData);
            setUserData(defaultUserData);
          }
        } catch (error) {
          console.log('[v0] Error fetching user data:', error);
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email || '',
            isAdmin: currentUser.email === ADMIN_EMAIL,
          });
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUserData: UserData = {
        uid: userCredential.user.uid,
        email,
        isAdmin: email === ADMIN_EMAIL,
        name,
        phone: ''
      };
      
      // Save to RTDB
      await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userCredential = result.user;

      // Check if user exists in RTDB
      const userRef = ref(rtdb, `users/${userCredential.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        // Create new user in RTDB
        const newUserData: UserData = {
          uid: userCredential.uid,
          email: userCredential.email || '',
          isAdmin: userCredential.email === ADMIN_EMAIL,
          name: userCredential.displayName || '',
          phone: ''
        };
        await set(userRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const isAdminValue = userData?.isAdmin || false;
  
  const value: AuthContextType = {
    user,
    userData,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    isAdmin: isAdminValue,
  };
  
  console.log('[v0] Auth context:', { isAdmin: isAdminValue, userEmail: userData?.email, userData });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
