// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged, 
//   signOut, 
//   User,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider
// } from 'firebase/auth';
// import { auth, rtdb } from './firebase';
// import { ref, get, set } from 'firebase/database';

// interface UserData {
//   email: string;
//   isAdmin: boolean;
//   name?: string;
//   phone?: string;
//   uid: string;
// }

// interface AuthContextType {
//   user: User | null;
//   userData: UserData | null;
//   loading: boolean;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser) {
//         try {
//           // Get user data from Firebase Realtime Database
//           const userRef = ref(rtdb, `users/${currentUser.uid}`);
//           const snapshot = await get(userRef);
          
//           if (snapshot.exists()) {
//             const userData = snapshot.val() as UserData;
//             console.log('[v0] User data from DB:', userData);
//             setUserData(userData);
//           } else {
//             // Create default user data in RTDB
//             const isAdminUser = currentUser.email === ADMIN_EMAIL;
//             const defaultUserData: UserData = {
//               uid: currentUser.uid,
//               email: currentUser.email || '',
//               isAdmin: isAdminUser,
//               name: currentUser.displayName || '',
//               phone: ''
//             };
            
//             console.log('[v0] Creating new user:', { email: currentUser.email, isAdmin: isAdminUser, ADMIN_EMAIL });
            
//             // Save to RTDB
//             await set(userRef, defaultUserData);
//             setUserData(defaultUserData);
//           }
//         } catch (error) {
//           console.log('[v0] Error fetching user data:', error);
//           setUserData({
//             uid: currentUser.uid,
//             email: currentUser.email || '',
//             isAdmin: currentUser.email === ADMIN_EMAIL,
//           });
//         }
//       } else {
//         setUserData(null);
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const signup = async (email: string, password: string, name: string) => {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         email,
//         isAdmin: email === ADMIN_EMAIL,
//         name,
//         phone: ''
//       };
      
//       // Save to RTDB
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const userCredential = result.user;

//       // Check if user exists in RTDB
//       const userRef = ref(rtdb, `users/${userCredential.uid}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         // Create new user in RTDB
//         const newUserData: UserData = {
//           uid: userCredential.uid,
//           email: userCredential.email || '',
//           isAdmin: userCredential.email === ADMIN_EMAIL,
//           name: userCredential.displayName || '',
//           phone: ''
//         };
//         await set(userRef, newUserData);
//         setUserData(newUserData);
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUserData(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   const isAdminValue = userData?.isAdmin || false;
  
//   const value: AuthContextType = {
//     user,
//     userData,
//     loading,
//     signup,
//     login,
//     loginWithGoogle,
//     logout,
//     isAdmin: isAdminValue,
//   };
  
//   console.log('[v0] Auth context:', { isAdmin: isAdminValue, userEmail: userData?.email, userData });

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



//phone number login

// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged, 
//   signOut, 
//   User,
//   signInWithPopup,
//   GoogleAuthProvider
// } from 'firebase/auth';
// import { auth, rtdb } from './firebase';
// import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   isAdmin: boolean;
//   isPhone: boolean;
//   isEmail: boolean;
//   createdAt: string;
//   loginMethod: 'email' | 'phone' | 'google';
// }

// interface AuthContextType {
//   user: UserData | null;
//   loading: boolean;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithPhone: (phone: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

//   // Check Firebase Auth for Google users
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setFirebaseUser(currentUser);
      
//       if (currentUser) {
//         // Check if user exists in RTDB
//         const userRef = ref(rtdb, `users/${currentUser.uid}`);
//         const snapshot = await get(userRef);
        
//         if (snapshot.exists()) {
//           const userData = snapshot.val() as UserData;
//           setUser(userData);
//         } else {
//           // Create for Google user
//           const newUser: UserData = {
//             uid: currentUser.uid,
//             name: currentUser.displayName || '',
//             email: currentUser.email || '',
//             phone: '',
//             password: '',
//             isAdmin: currentUser.email === ADMIN_EMAIL,
//             isPhone: false,
//             isEmail: true,
//             createdAt: new Date().toISOString(),
//             loginMethod: 'google'
//           };
//           await set(userRef, newUser);
//           setUser(newUser);
//         }
//       } else {
//         setUser(null);
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Generate unique ID
//   const generateId = () => {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
//   };

//   // Signup with Email (Custom RTDB)
//   const signup = async (email: string, password: string, name: string) => {
//     try {
//       // Check if email already exists
//       const usersRef = ref(rtdb, 'users');
//       const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
//       const snapshot = await get(emailQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Email already registered');
//       }

//       const uid = generateId();
//       const newUser: UserData = {
//         uid: uid,
//         name: name,
//         email: email,
//         phone: '',
//         password: password,
//         isAdmin: email === ADMIN_EMAIL,
//         isPhone: false,
//         isEmail: true,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'email'
//       };
      
//       await set(ref(rtdb, `users/${uid}`), newUser);
//       setUser(newUser);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   // Signup with Phone (Custom RTDB)
//   const signupWithPhone = async (phone: string, password: string, name: string) => {
//     try {
//       // Check if phone already exists
//       const usersRef = ref(rtdb, 'users');
//       const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
//       const snapshot = await get(phoneQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Phone number already registered');
//       }

//       const uid = generateId();
//       const newUser: UserData = {
//         uid: uid,
//         name: name,
//         email: '',
//         phone: phone,
//         password: password,
//         isAdmin: false,
//         isPhone: true,
//         isEmail: false,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'phone'
//       };
      
//       await set(ref(rtdb, `users/${uid}`), newUser);
//       setUser(newUser);
//     } catch (error) {
//       console.error('Phone signup error:', error);
//       throw error;
//     }
//   };

//   // Login with Email (Custom RTDB)
//   const login = async (email: string, password: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
//       const snapshot = await get(emailQuery);
      
//       if (!snapshot.exists()) {
//         throw new Error('Email not found');
//       }

//       let userData: UserData | null = null;
//       snapshot.forEach((child) => {
//         const data = child.val() as UserData;
//         if (data.password === password) {
//           userData = data;
//         }
//       });

//       if (!userData) {
//         throw new Error('Incorrect password');
//       }

//       setUser(userData);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   // Login with Phone (Custom RTDB)
//   const loginWithPhone = async (phone: string, password: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
//       const snapshot = await get(phoneQuery);
      
//       if (!snapshot.exists()) {
//         throw new Error('Phone number not found');
//       }

//       let userData: UserData | null = null;
//       snapshot.forEach((child) => {
//         const data = child.val() as UserData;
//         if (data.password === password) {
//           userData = data;
//         }
//       });

//       if (!userData) {
//         throw new Error('Incorrect password');
//       }

//       setUser(userData);
//     } catch (error) {
//       console.error('Phone login error:', error);
//       throw error;
//     }
//   };

//   // Login with Google (Firebase Auth + RTDB)
//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const userCredential = result.user;

//       const userRef = ref(rtdb, `users/${userCredential.uid}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         const newUser: UserData = {
//           uid: userCredential.uid,
//           name: userCredential.displayName || '',
//           email: userCredential.email || '',
//           phone: '',
//           password: '',
//           isAdmin: userCredential.email === ADMIN_EMAIL,
//           isPhone: false,
//           isEmail: true,
//           createdAt: new Date().toISOString(),
//           loginMethod: 'google'
//         };
//         await set(userRef, newUser);
//         setUser(newUser);
//       } else {
//         setUser(snapshot.val() as UserData);
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       // If Google user, sign out from Firebase Auth
//       if (firebaseUser) {
//         await signOut(auth);
//       }
//       setUser(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   const isAdminValue = user?.isAdmin || false;
  
//   const value: AuthContextType = {
//     user,
//     loading,
//     signup,
//     signupWithPhone,
//     login,
//     loginWithPhone,
//     loginWithGoogle,
//     logout,
//     isAdmin: isAdminValue,
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



//password

// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged, 
//   signOut, 
//   User,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   updateProfile
// } from 'firebase/auth';
// import { auth, rtdb } from './firebase';
// import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;  // ⚠️ WARNING: Password stored in RTDB
//   isAdmin: boolean;
//   isPhone: boolean;
//   isEmail: boolean;
//   createdAt: string;
//   loginMethod: 'email' | 'phone' | 'google';
// }

// interface AuthContextType {
//   user: User | null;
//   userData: UserData | null;
//   loading: boolean;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithPhone: (phone: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser) {
//         try {
//           const userRef = ref(rtdb, `users/${currentUser.uid}`);
//           const snapshot = await get(userRef);
          
//           if (snapshot.exists()) {
//             const userData = snapshot.val() as UserData;
//             console.log('[v0] User data from DB:', userData);
//             setUserData(userData);
//           } else {
//             // Create user data in RTDB with password
//             const isAdminUser = currentUser.email === ADMIN_EMAIL;
//             const isPhoneUser = currentUser.email?.endsWith('@phone.auth') || false;
//             const cleanPhone = isPhoneUser ? currentUser.email?.replace('@phone.auth', '') || '' : '';
            
//             const defaultUserData: UserData = {
//               uid: currentUser.uid,
//               name: currentUser.displayName || '',
//               email: currentUser.email || '',
//               phone: cleanPhone || '',
//               password: '', // Google users won't have password
//               isAdmin: isAdminUser,
//               isPhone: isPhoneUser,
//               isEmail: !isPhoneUser && !!currentUser.email,
//               createdAt: new Date().toISOString(),
//               loginMethod: isPhoneUser ? 'phone' : (currentUser.email ? 'email' : 'google')
//             };
            
//             await set(userRef, defaultUserData);
//             setUserData(defaultUserData);
//           }
//         } catch (error) {
//           console.log('[v0] Error fetching user data:', error);
//         }
//       } else {
//         setUserData(null);
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Signup with Email (Password stored in both Firebase Auth AND RTDB)
//   const signup = async (email: string, password: string, name: string) => {
//     try {
//       // Check if email already exists in RTDB
//       const usersRef = ref(rtdb, 'users');
//       const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
//       const snapshot = await get(emailQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Email already registered');
//       }

//       // Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       // Store user data WITH password in RTDB
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: email,
//         phone: '',
//         password: password, // ⚠️ Storing password in RTDB
//         isAdmin: email === ADMIN_EMAIL,
//         isPhone: false,
//         isEmail: true,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'email'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   // Signup with Phone (Password stored in both Firebase Auth AND RTDB)
//   const signupWithPhone = async (phone: string, password: string, name: string) => {
//     try {
//       // Check if phone already exists in RTDB
//       const usersRef = ref(rtdb, 'users');
//       const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
//       const snapshot = await get(phoneQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Phone number already registered');
//       }

//       // Convert phone to email format for Firebase Auth
//       const phoneEmail = `${phone}@phone.auth`;
      
//       // Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(auth, phoneEmail, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       // Store user data WITH password in RTDB
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: '',
//         phone: phone,
//         password: password, // ⚠️ Storing password in RTDB
//         isAdmin: false,
//         isPhone: true,
//         isEmail: false,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'phone'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Phone signup error:', error);
//       throw error;
//     }
//   };

//   // Login with Email (Uses Firebase Auth)
//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   // Login with Phone (Uses Firebase Auth)
//   const loginWithPhone = async (phone: string, password: string) => {
//     try {
//       const phoneEmail = `${phone}@phone.auth`;
//       await signInWithEmailAndPassword(auth, phoneEmail, password);
//     } catch (error) {
//       console.error('Phone login error:', error);
//       throw error;
//     }
//   };

//   // Login with Google
//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const userCredential = result.user;

//       const userRef = ref(rtdb, `users/${userCredential.uid}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         const newUserData: UserData = {
//           uid: userCredential.uid,
//           name: userCredential.displayName || '',
//           email: userCredential.email || '',
//           phone: '',
//           password: '', // Google users don't have password
//           isAdmin: userCredential.email === ADMIN_EMAIL,
//           isPhone: false,
//           isEmail: true,
//           createdAt: new Date().toISOString(),
//           loginMethod: 'google'
//         };
//         await set(userRef, newUserData);
//         setUserData(newUserData);
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUserData(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   const isAdminValue = userData?.isAdmin || false;
  
//   const value: AuthContextType = {
//     user,
//     userData,
//     loading,
//     signup,
//     signupWithPhone,
//     login,
//     loginWithPhone,
//     loginWithGoogle,
//     logout,
//     isAdmin: isAdminValue,
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };








//resetpassword 

// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged, 
//   signOut, 
//   User,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   updateProfile,
//   sendPasswordResetEmail,
//   confirmPasswordReset,
//   verifyPasswordResetCode
// } from 'firebase/auth';
// import { auth, rtdb } from './firebase';
// import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;  // ⚠️ WARNING: Password stored in RTDB
//   isAdmin: boolean;
//   isPhone: boolean;
//   isEmail: boolean;
//   createdAt: string;
//   loginMethod: 'email' | 'phone' | 'google';
// }

// interface AuthContextType {
//   user: User | null;
//   userData: UserData | null;
//   loading: boolean;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithPhone: (phone: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
//   resetPassword: (email: string) => Promise<void>;  // ✅ ADDED
//   confirmResetPassword: (code: string, newPassword: string) => Promise<void>;  // ✅ ADDED
//   verifyResetCode: (code: string) => Promise<string>;  // ✅ ADDED
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser) {
//         try {
//           const userRef = ref(rtdb, `users/${currentUser.uid}`);
//           const snapshot = await get(userRef);
          
//           if (snapshot.exists()) {
//             const userData = snapshot.val() as UserData;
//             console.log('[v0] User data from DB:', userData);
//             setUserData(userData);
//           } else {
//             // Create user data in RTDB with password
//             const isAdminUser = currentUser.email === ADMIN_EMAIL;
//             const isPhoneUser = currentUser.email?.endsWith('@phone.auth') || false;
//             const cleanPhone = isPhoneUser ? currentUser.email?.replace('@phone.auth', '') || '' : '';
            
//             const defaultUserData: UserData = {
//               uid: currentUser.uid,
//               name: currentUser.displayName || '',
//               email: currentUser.email || '',
//               phone: cleanPhone || '',
//               password: '', // Google users won't have password
//               isAdmin: isAdminUser,
//               isPhone: isPhoneUser,
//               isEmail: !isPhoneUser && !!currentUser.email,
//               createdAt: new Date().toISOString(),
//               loginMethod: isPhoneUser ? 'phone' : (currentUser.email ? 'email' : 'google')
//             };
            
//             await set(userRef, defaultUserData);
//             setUserData(defaultUserData);
//           }
//         } catch (error) {
//           console.log('[v0] Error fetching user data:', error);
//         }
//       } else {
//         setUserData(null);
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // Signup with Email (Password stored in both Firebase Auth AND RTDB)
//   const signup = async (email: string, password: string, name: string) => {
//     try {
//       // Check if email already exists in RTDB
//       const usersRef = ref(rtdb, 'users');
//       const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
//       const snapshot = await get(emailQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Email already registered');
//       }

//       // Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       // Store user data WITH password in RTDB
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: email,
//         phone: '',
//         password: password, // ⚠️ Storing password in RTDB
//         isAdmin: email === ADMIN_EMAIL,
//         isPhone: false,
//         isEmail: true,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'email'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   // Signup with Phone (Password stored in both Firebase Auth AND RTDB)
//   const signupWithPhone = async (phone: string, password: string, name: string) => {
//     try {
//       // Check if phone already exists in RTDB
//       const usersRef = ref(rtdb, 'users');
//       const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
//       const snapshot = await get(phoneQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Phone number already registered');
//       }

//       // Convert phone to email format for Firebase Auth
//       const phoneEmail = `${phone}@phone.auth`;
      
//       // Create user in Firebase Auth
//       const userCredential = await createUserWithEmailAndPassword(auth, phoneEmail, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       // Store user data WITH password in RTDB
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: '',
//         phone: phone,
//         password: password, // ⚠️ Storing password in RTDB
//         isAdmin: false,
//         isPhone: true,
//         isEmail: false,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'phone'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Phone signup error:', error);
//       throw error;
//     }
//   };

//   // Login with Email (Uses Firebase Auth)
//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   // Login with Phone (Uses Firebase Auth)
//   const loginWithPhone = async (phone: string, password: string) => {
//     try {
//       const phoneEmail = `${phone}@phone.auth`;
//       await signInWithEmailAndPassword(auth, phoneEmail, password);
//     } catch (error) {
//       console.error('Phone login error:', error);
//       throw error;
//     }
//   };

//   // Login with Google
//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const userCredential = result.user;

//       const userRef = ref(rtdb, `users/${userCredential.uid}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         const newUserData: UserData = {
//           uid: userCredential.uid,
//           name: userCredential.displayName || '',
//           email: userCredential.email || '',
//           phone: '',
//           password: '', // Google users don't have password
//           isAdmin: userCredential.email === ADMIN_EMAIL,
//           isPhone: false,
//           isEmail: true,
//           createdAt: new Date().toISOString(),
//           loginMethod: 'google'
//         };
//         await set(userRef, newUserData);
//         setUserData(newUserData);
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   };

//   // ✅ Reset Password - Send reset email
//   const resetPassword = async (email: string) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error;
//     }
//   };

//   // ✅ Confirm Reset Password - After user clicks email link
//   const confirmResetPassword = async (code: string, newPassword: string) => {
//     try {
//       await confirmPasswordReset(auth, code, newPassword);
//     } catch (error) {
//       console.error('Confirm reset password error:', error);
//       throw error;
//     }
//   };

//   // ✅ Verify Reset Code - Check if code is valid
//   const verifyResetCode = async (code: string): Promise<string> => {
//     try {
//       const email = await verifyPasswordResetCode(auth, code);
//       return email;
//     } catch (error) {
//       console.error('Verify reset code error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUserData(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   const isAdminValue = userData?.isAdmin || false;
  
//   const value: AuthContextType = {
//     user,
//     userData,
//     loading,
//     signup,
//     signupWithPhone,
//     login,
//     loginWithPhone,
//     loginWithGoogle,
//     logout,
//     isAdmin: isAdminValue,
//     resetPassword,        // ✅ ADDED
//     confirmResetPassword,  // ✅ ADDED
//     verifyResetCode,       // ✅ ADDED
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };






//admin all user see

// lib/authContext.tsx
// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged, 
//   signOut, 
//   User,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   updateProfile,
//   sendPasswordResetEmail,
// } from 'firebase/auth';
// import { auth, rtdb } from './firebase';
// import { ref, get, set, query, orderByChild, equalTo } from 'firebase/database';

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   isAdmin: boolean;
//   isPhone: boolean;
//   isEmail: boolean;
//   createdAt: string;
//   loginMethod: 'email' | 'phone' | 'google';
// }

// interface AuthContextType {
//   user: User | null;
//   userData: UserData | null;
//   loading: boolean;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithPhone: (phone: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
//   resetPassword: (email: string) => Promise<void>;  // ✅ Added
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser) {
//         try {
//           const userRef = ref(rtdb, `users/${currentUser.uid}`);
//           const snapshot = await get(userRef);
          
//           if (snapshot.exists()) {
//             const userData = snapshot.val() as UserData;
//             setUserData(userData);
//           } else {
//             const isAdminUser = currentUser.email === ADMIN_EMAIL;
//             const isPhoneUser = currentUser.email?.endsWith('@phone.auth') || false;
//             const cleanPhone = isPhoneUser ? currentUser.email?.replace('@phone.auth', '') || '' : '';
            
//             const defaultUserData: UserData = {
//               uid: currentUser.uid,
//               name: currentUser.displayName || '',
//               email: currentUser.email || '',
//               phone: cleanPhone || '',
//               password: '',
//               isAdmin: isAdminUser,
//               isPhone: isPhoneUser,
//               isEmail: !isPhoneUser && !!currentUser.email,
//               createdAt: new Date().toISOString(),
//               loginMethod: isPhoneUser ? 'phone' : (currentUser.email ? 'email' : 'google')
//             };
            
//             await set(userRef, defaultUserData);
//             setUserData(defaultUserData);
//           }
//         } catch (error) {
//           console.log('[v0] Error fetching user data:', error);
//         }
//       } else {
//         setUserData(null);
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const signup = async (email: string, password: string, name: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
//       const snapshot = await get(emailQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Email already registered');
//       }

//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: email,
//         phone: '',
//         password: password,
//         isAdmin: email === ADMIN_EMAIL,
//         isPhone: false,
//         isEmail: true,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'email'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   const signupWithPhone = async (phone: string, password: string, name: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
//       const snapshot = await get(phoneQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Phone number already registered');
//       }

//       const phoneEmail = `${phone}@phone.auth`;
      
//       const userCredential = await createUserWithEmailAndPassword(auth, phoneEmail, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: '',
//         phone: phone,
//         password: password,
//         isAdmin: false,
//         isPhone: true,
//         isEmail: false,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'phone'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Phone signup error:', error);
//       throw error;
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const loginWithPhone = async (phone: string, password: string) => {
//     try {
//       const phoneEmail = `${phone}@phone.auth`;
//       await signInWithEmailAndPassword(auth, phoneEmail, password);
//     } catch (error) {
//       console.error('Phone login error:', error);
//       throw error;
//     }
//   };

//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const userCredential = result.user;

//       const userRef = ref(rtdb, `users/${userCredential.uid}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         const newUserData: UserData = {
//           uid: userCredential.uid,
//           name: userCredential.displayName || '',
//           email: userCredential.email || '',
//           phone: '',
//           password: '',
//           isAdmin: userCredential.email === ADMIN_EMAIL,
//           isPhone: false,
//           isEmail: true,
//           createdAt: new Date().toISOString(),
//           loginMethod: 'google'
//         };
//         await set(userRef, newUserData);
//         setUserData(newUserData);
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   };

//   // ✅ Reset Password
//   const resetPassword = async (email: string) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUserData(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   const isAdminValue = userData?.isAdmin || false;
  
//   const value: AuthContextType = {
//     user,
//     userData,
//     loading,
//     signup,
//     signupWithPhone,
//     login,
//     loginWithPhone,
//     loginWithGoogle,
//     logout,
//     isAdmin: isAdminValue,
//     resetPassword,  // ✅ Added
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


















//admin change hr user ka pass
// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged, 
//   signOut, 
//   User,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   updateProfile,
//   sendPasswordResetEmail,
//   updatePassword,
//   reauthenticateWithCredential,
//   EmailAuthProvider,
// } from 'firebase/auth';
// import { auth, rtdb } from './firebase';
// import { ref, get, set, query, orderByChild, equalTo, update } from 'firebase/database';

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   isAdmin: boolean;
//   isPhone: boolean;
//   isEmail: boolean;
//   createdAt: string;
//   loginMethod: 'email' | 'phone' | 'google';
// }

// interface AuthContextType {
//   user: User | null;
//   userData: UserData | null;
//   loading: boolean;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithPhone: (phone: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
//   // Password Reset
//   resetPassword: (email: string) => Promise<void>;
//   // Change Password (for logged in users)
//   changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser) {
//         try {
//           const userRef = ref(rtdb, `users/${currentUser.uid}`);
//           const snapshot = await get(userRef);
          
//           if (snapshot.exists()) {
//             const userData = snapshot.val() as UserData;
//             setUserData(userData);
//           } else {
//             const isAdminUser = currentUser.email === ADMIN_EMAIL;
//             const isPhoneUser = currentUser.email?.endsWith('@phone.auth') || false;
//             const cleanPhone = isPhoneUser ? currentUser.email?.replace('@phone.auth', '') || '' : '';
            
//             const defaultUserData: UserData = {
//               uid: currentUser.uid,
//               name: currentUser.displayName || '',
//               email: currentUser.email || '',
//               phone: cleanPhone || '',
//               password: '',
//               isAdmin: isAdminUser,
//               isPhone: isPhoneUser,
//               isEmail: !isPhoneUser && !!currentUser.email,
//               createdAt: new Date().toISOString(),
//               loginMethod: isPhoneUser ? 'phone' : (currentUser.email ? 'email' : 'google')
//             };
            
//             await set(userRef, defaultUserData);
//             setUserData(defaultUserData);
//           }
//         } catch (error) {
//           console.log('[v0] Error fetching user data:', error);
//         }
//       } else {
//         setUserData(null);
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // ============== SIGNUP FUNCTIONS ==============

//   const signup = async (email: string, password: string, name: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
//       const snapshot = await get(emailQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Email already registered');
//       }

//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: email,
//         phone: '',
//         password: password,
//         isAdmin: email === ADMIN_EMAIL,
//         isPhone: false,
//         isEmail: true,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'email'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   const signupWithPhone = async (phone: string, password: string, name: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
//       const snapshot = await get(phoneQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Phone number already registered');
//       }

//       const phoneEmail = `${phone}@phone.auth`;
      
//       const userCredential = await createUserWithEmailAndPassword(auth, phoneEmail, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: '',
//         phone: phone,
//         password: password,
//         isAdmin: false,
//         isPhone: true,
//         isEmail: false,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'phone'
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Phone signup error:', error);
//       throw error;
//     }
//   };

//   // ============== LOGIN FUNCTIONS ==============

//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const loginWithPhone = async (phone: string, password: string) => {
//     try {
//       const phoneEmail = `${phone}@phone.auth`;
//       await signInWithEmailAndPassword(auth, phoneEmail, password);
//     } catch (error) {
//       console.error('Phone login error:', error);
//       throw error;
//     }
//   };

//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const userCredential = result.user;

//       const userRef = ref(rtdb, `users/${userCredential.uid}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         const newUserData: UserData = {
//           uid: userCredential.uid,
//           name: userCredential.displayName || '',
//           email: userCredential.email || '',
//           phone: '',
//           password: '',
//           isAdmin: userCredential.email === ADMIN_EMAIL,
//           isPhone: false,
//           isEmail: true,
//           createdAt: new Date().toISOString(),
//           loginMethod: 'google'
//         };
//         await set(userRef, newUserData);
//         setUserData(newUserData);
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   };

//   // ============== PASSWORD RESET (Email) ==============

//   const resetPassword = async (email: string) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//     } catch (error) {
//       console.error('Reset password error:', error);
//       throw error;
//     }
//   };

//   // ============== CHANGE PASSWORD (Logged In Users) ==============

//   const changePassword = async (oldPassword: string, newPassword: string) => {
//     try {
//       if (!user || !user.email) {
//         throw new Error('No user logged in');
//       }

//       // Re-authenticate user
//       const credential = EmailAuthProvider.credential(user.email, oldPassword);
//       await reauthenticateWithCredential(user, credential);
      
//       // Update password in Firebase Auth
//       await updatePassword(user, newPassword);
      
//       // Update RTDB
//       const userRef = ref(rtdb, `users/${user.uid}`);
//       await update(userRef, { 
//         password: newPassword,
//         updatedAt: new Date().toISOString()
//       });
      
//       console.log('✅ Password changed successfully');
//     } catch (error) {
//       console.error('Change password error:', error);
//       throw error;
//     }
//   };

//   // ============== LOGOUT ==============

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUserData(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   // ============== EXPORT VALUE ==============

//   const isAdminValue = userData?.isAdmin || false;
  
//   const value: AuthContextType = {
//     user,
//     userData,
//     loading,
//     signup,
//     signupWithPhone,
//     login,
//     loginWithPhone,
//     loginWithGoogle,
//     logout,
//     isAdmin: isAdminValue,
//     resetPassword,
//     changePassword,
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };





// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   onAuthStateChanged, 
//   signOut, 
//   User,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   updateProfile,
//   sendPasswordResetEmail,
//   updatePassword,
//   reauthenticateWithCredential,
//   EmailAuthProvider,
//   confirmPasswordReset,
//   verifyPasswordResetCode,
// } from 'firebase/auth';
// import { auth, rtdb } from './firebase';
// import { ref, get, set, query, orderByChild, equalTo, update } from 'firebase/database';

// interface UserData {
//   uid: string;
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   isAdmin: boolean;
//   isPhone: boolean;
//   isEmail: boolean;
//   createdAt: string;
//   loginMethod: 'email' | 'phone' | 'google';
//   passwordReset?: boolean;
//   passwordResetAt?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   userData: UserData | null;
//   loading: boolean;
//   signup: (email: string, password: string, name: string) => Promise<void>;
//   signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
//   login: (email: string, password: string) => Promise<void>;
//   loginWithPhone: (phone: string, password: string) => Promise<void>;
//   loginWithGoogle: () => Promise<void>;
//   logout: () => Promise<void>;
//   isAdmin: boolean;
//   resetPassword: (email: string) => Promise<void>;
//   confirmResetPassword: (code: string, newPassword: string) => Promise<void>;
//   verifyResetCode: (code: string) => Promise<string>;
//   changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
//   changePasswordWithOld: (oldPassword: string, newPassword: string) => Promise<void>;
//   updateRTDBPasswordAfterReset: (email: string) => Promise<void>;
//   checkAndUpdateRTDBPassword: (user: User) => Promise<boolean>;
//   updateRTDBPassword: (uid: string, newPassword: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser);
      
//       if (currentUser) {
//         try {
//           const userRef = ref(rtdb, `users/${currentUser.uid}`);
//           const snapshot = await get(userRef);
          
//           if (snapshot.exists()) {
//             const userData = snapshot.val() as UserData;
//             setUserData(userData);
//           } else {
//             const isAdminUser = currentUser.email === ADMIN_EMAIL;
//             const isPhoneUser = currentUser.email?.endsWith('@phone.auth') || false;
//             const cleanPhone = isPhoneUser ? currentUser.email?.replace('@phone.auth', '') || '' : '';
            
//             const defaultUserData: UserData = {
//               uid: currentUser.uid,
//               name: currentUser.displayName || '',
//               email: currentUser.email || '',
//               phone: cleanPhone || '',
//               password: '',
//               isAdmin: isAdminUser,
//               isPhone: isPhoneUser,
//               isEmail: !isPhoneUser && !!currentUser.email,
//               createdAt: new Date().toISOString(),
//               loginMethod: isPhoneUser ? 'phone' : (currentUser.email ? 'email' : 'google'),
//               passwordReset: false,
//             };
            
//             await set(userRef, defaultUserData);
//             setUserData(defaultUserData);
//           }
//         } catch (error) {
//           console.log('[v0] Error fetching user data:', error);
//         }
//       } else {
//         setUserData(null);
//       }
      
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   // ============== SIGNUP FUNCTIONS ==============

//   const signup = async (email: string, password: string, name: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
//       const snapshot = await get(emailQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Email already registered');
//       }

//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: email,
//         phone: '',
//         password: password,
//         isAdmin: email === ADMIN_EMAIL,
//         isPhone: false,
//         isEmail: true,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'email',
//         passwordReset: false,
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   };

//   const signupWithPhone = async (phone: string, password: string, name: string) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
//       const snapshot = await get(phoneQuery);
      
//       if (snapshot.exists()) {
//         throw new Error('Phone number already registered');
//       }

//       const phoneEmail = `${phone}@phone.auth`;
      
//       const userCredential = await createUserWithEmailAndPassword(auth, phoneEmail, password);
//       await updateProfile(userCredential.user, { displayName: name });
      
//       const newUserData: UserData = {
//         uid: userCredential.user.uid,
//         name: name,
//         email: '',
//         phone: phone,
//         password: password,
//         isAdmin: false,
//         isPhone: true,
//         isEmail: false,
//         createdAt: new Date().toISOString(),
//         loginMethod: 'phone',
//         passwordReset: false,
//       };
      
//       await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
//       setUserData(newUserData);
//     } catch (error) {
//       console.error('Phone signup error:', error);
//       throw error;
//     }
//   };

//   // ============== LOGIN FUNCTIONS ==============

//   const login = async (email: string, password: string) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const loginWithPhone = async (phone: string, password: string) => {
//     try {
//       const phoneEmail = `${phone}@phone.auth`;
//       await signInWithEmailAndPassword(auth, phoneEmail, password);
//     } catch (error) {
//       console.error('Phone login error:', error);
//       throw error;
//     }
//   };

//   const loginWithGoogle = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const userCredential = result.user;

//       const userRef = ref(rtdb, `users/${userCredential.uid}`);
//       const snapshot = await get(userRef);

//       if (!snapshot.exists()) {
//         const newUserData: UserData = {
//           uid: userCredential.uid,
//           name: userCredential.displayName || '',
//           email: userCredential.email || '',
//           phone: '',
//           password: '',
//           isAdmin: userCredential.email === ADMIN_EMAIL,
//           isPhone: false,
//           isEmail: true,
//           createdAt: new Date().toISOString(),
//           loginMethod: 'google',
//           passwordReset: false,
//         };
//         await set(userRef, newUserData);
//         setUserData(newUserData);
//       }
//     } catch (error) {
//       console.error('Google login error:', error);
//       throw error;
//     }
//   };

//   // ============== ✅ UPDATED RESET PASSWORD WITH FLAG ==============

//   const resetPassword = async (email: string) => {
//     try {
//       // ✅ Step 1: Send reset email
//       const actionCodeSettings = {
//         url: `${window.location.origin}/reset-password`,
//         handleCodeInApp: false,
//       };
      
//       await sendPasswordResetEmail(auth, email, actionCodeSettings);
//       console.log('✅ Reset email sent to:', email);
      
//       // ✅ Step 2: Immediately set passwordReset flag in RTDB
//       try {
//         const usersRef = ref(rtdb, 'users');
//         const snapshot = await get(usersRef);
        
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           let userUid = null;
          
//           Object.keys(data).forEach((key) => {
//             const userData = data[key];
//             const userEmail = userData.email || '';
//             const phoneEmail = `${userData.phone || ''}@phone.auth`;
            
//             if (userEmail === email || userEmail === `${email}@phone.auth` || phoneEmail === email) {
//               userUid = key;
//               console.log('✅ Found user in RTDB:', key);
//             }
//           });
          
//           if (userUid) {
//             await update(ref(rtdb, `users/${userUid}`), {
//               passwordReset: true,
//               passwordResetAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString()
//             });
//             console.log('✅✅✅ passwordReset flag set to TRUE for:', email);
//           } else {
//             console.warn('⚠️ User NOT found in RTDB for email:', email);
//           }
//         }
//       } catch (err) {
//         console.error('Error setting passwordReset flag:', err);
//       }
      
//     } catch (error: any) {
//       console.error('Reset password error:', error);
//       if (error.code === 'auth/user-not-found') {
//         throw new Error('No account found with this email address');
//       } else if (error.code === 'auth/too-many-requests') {
//         throw new Error('Too many requests. Please try again later');
//       } else {
//         throw new Error(error.message || 'Failed to send reset email');
//       }
//     }
//   };

//   const verifyResetCode = async (code: string): Promise<string> => {
//     try {
//       const email = await verifyPasswordResetCode(auth, code);
//       return email;
//     } catch (error: any) {
//       console.error('Verify reset code error:', error);
//       if (error.code === 'auth/expired-action-code') {
//         throw new Error('Reset link has expired. Please request a new one.');
//       } else if (error.code === 'auth/invalid-action-code') {
//         throw new Error('Invalid reset link. Please request a new one.');
//       } else {
//         throw new Error(error.message || 'Failed to verify reset code');
//       }
//     }
//   };

//   const confirmResetPassword = async (code: string, newPassword: string) => {
//     try {
//       await confirmPasswordReset(auth, code, newPassword);
      
//       const email = await verifyPasswordResetCode(auth, code);
//       console.log('🔍 Email from reset code:', email);
      
//       if (email) {
//         const usersRef = ref(rtdb, 'users');
//         const snapshot = await get(usersRef);
        
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           let userUid = null;
          
//           Object.keys(data).forEach((key) => {
//             const userData = data[key];
//             const userEmail = userData.email || '';
//             const phoneEmail = `${userData.phone || ''}@phone.auth`;
            
//             if (userEmail === email || userEmail === `${email}@phone.auth` || phoneEmail === email) {
//               userUid = key;
//               console.log('✅ Found user in RTDB:', key);
//             }
//           });
          
//           if (userUid) {
//             await update(ref(rtdb, `users/${userUid}`), {
//               password: newPassword,
//               passwordReset: true,
//               passwordResetAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString()
//             });
//             console.log('✅ Password updated in RTDB with reset flag for:', email);
//           } else {
//             console.warn('⚠️ User NOT found in RTDB for email:', email);
//           }
//         }
//       }
      
//       console.log('✅ Password reset successfully');
//     } catch (error: any) {
//       console.error('Confirm reset password error:', error);
//       if (error.code === 'auth/expired-action-code') {
//         throw new Error('Reset link has expired. Please request a new one.');
//       } else if (error.code === 'auth/invalid-action-code') {
//         throw new Error('Invalid reset link. Please request a new one.');
//       } else if (error.code === 'auth/weak-password') {
//         throw new Error('Password is too weak. Minimum 6 characters.');
//       } else {
//         throw new Error(error.message || 'Failed to reset password');
//       }
//     }
//   };

//   const updateRTDBPasswordAfterReset = async (email: string): Promise<void> => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         let userUid = null;
        
//         Object.keys(data).forEach((key) => {
//           const userData = data[key];
//           if (userData.email === email || userData.email === `${email}@phone.auth`) {
//             userUid = key;
//           }
//         });
        
//         if (userUid) {
//           await update(ref(rtdb, `users/${userUid}`), {
//             passwordReset: true,
//             passwordResetAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//           });
//           console.log('✅ Password reset flag set in RTDB for:', email);
//         }
//       }
//     } catch (error) {
//       console.error('RTDB update error:', error);
//     }
//   };

//   const updateRTDBPasswordByEmail = async (email: string, newPassword: string, setResetFlag: boolean = false) => {
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         let userUid = null;
        
//         Object.keys(data).forEach((key) => {
//           const userData = data[key];
//           const userEmail = userData.email || '';
//           const phoneEmail = `${userData.phone || ''}@phone.auth`;
          
//           if (userEmail === email || userEmail === `${email}@phone.auth` || phoneEmail === email) {
//             userUid = key;
//           }
//         });
        
//         if (userUid) {
//           const updateData: any = {
//             password: newPassword,
//             updatedAt: new Date().toISOString()
//           };
          
//           if (setResetFlag) {
//             updateData.passwordReset = true;
//           }
          
//           await update(ref(rtdb, `users/${userUid}`), updateData);
//           console.log('✅ Password updated in RTDB for:', email);
//         } else {
//           console.warn('⚠️ User not found in RTDB, only Firebase Auth updated');
//         }
//       }
//     } catch (error) {
//       console.error('RTDB update error:', error);
//     }
//   };

//   // ============== CHECK RTDB PASSWORD WITH FLAG ==============

//   const checkAndUpdateRTDBPassword = async (user: User): Promise<boolean> => {
//     try {
//       const userRef = ref(rtdb, `users/${user.uid}`);
//       const snapshot = await get(userRef);
      
//       if (snapshot.exists()) {
//         const userData = snapshot.val();
//         console.log('🔍 RTDB Data:', { 
//           password: userData.password ? '✅ exists' : '❌ missing',
//           passwordReset: userData.passwordReset,
//           email: userData.email
//         });
        
//         if (userData.passwordReset === true || !userData.password || userData.password === '') {
//           console.log('⚠️ Password reset required (flag or missing password)');
          
//           await update(userRef, {
//             passwordReset: false
//           });
          
//           return true;
//         }
//         return false;
//       }
//       console.log('⚠️ User not found in RTDB, update required');
//       return true;
//     } catch (error) {
//       console.error('Error checking RTDB password:', error);
//       return true;
//     }
//   };

//   // ============== UPDATE RTDB PASSWORD ==============

//   const updateRTDBPassword = async (uid: string, newPassword: string): Promise<void> => {
//     try {
//       const userRef = ref(rtdb, `users/${uid}`);
//       const snapshot = await get(userRef);
      
//       if (snapshot.exists()) {
//         await update(userRef, {
//           password: newPassword,
//           passwordReset: false,
//           updatedAt: new Date().toISOString()
//         });
//         console.log('✅ RTDB password updated for user:', uid);
//       } else {
//         await set(userRef, {
//           uid: uid,
//           password: newPassword,
//           passwordReset: false,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         });
//         console.log('✅ New user created in RTDB with password:', uid);
//       }
//     } catch (error) {
//       console.error('Error updating RTDB password:', error);
//       throw error;
//     }
//   };

//   // ============== CHANGE PASSWORD WITH OLD ==============

//   const changePasswordWithOld = async (oldPassword: string, newPassword: string) => {
//     try {
//       if (!user || !user.email) {
//         throw new Error('No user logged in');
//       }

//       const credential = EmailAuthProvider.credential(user.email, oldPassword);
//       await reauthenticateWithCredential(user, credential);
      
//       await updatePassword(user, newPassword);
      
//       const userRef = ref(rtdb, `users/${user.uid}`);
//       await update(userRef, { 
//         password: newPassword,
//         passwordReset: false,
//         updatedAt: new Date().toISOString()
//       });
      
//       console.log('✅ Password changed successfully in both Auth and RTDB');
//     } catch (error: any) {
//       console.error('Change password error:', error);
//       if (error.code === 'auth/wrong-password') {
//         throw new Error('Current password is incorrect');
//       } else if (error.code === 'auth/requires-recent-login') {
//         throw new Error('Please login again to change password');
//       } else if (error.code === 'auth/weak-password') {
//         throw new Error('Password is too weak. Minimum 6 characters.');
//       } else {
//         throw new Error(error.message || 'Failed to change password');
//       }
//     }
//   };

//   // ============== CHANGE PASSWORD ==============

//   const changePassword = async (oldPassword: string, newPassword: string) => {
//     try {
//       if (!user || !user.email) {
//         throw new Error('No user logged in');
//       }

//       const credential = EmailAuthProvider.credential(user.email, oldPassword);
//       await reauthenticateWithCredential(user, credential);
      
//       await updatePassword(user, newPassword);
      
//       const userRef = ref(rtdb, `users/${user.uid}`);
//       await update(userRef, { 
//         password: newPassword,
//         passwordReset: false,
//         updatedAt: new Date().toISOString()
//       });
      
//       console.log('✅ Password changed successfully');
//     } catch (error: any) {
//       console.error('Change password error:', error);
//       if (error.code === 'auth/wrong-password') {
//         throw new Error('Current password is incorrect');
//       } else if (error.code === 'auth/requires-recent-login') {
//         throw new Error('Please login again to change password');
//       } else if (error.code === 'auth/weak-password') {
//         throw new Error('Password is too weak. Minimum 6 characters.');
//       } else {
//         throw new Error(error.message || 'Failed to change password');
//       }
//     }
//   };

//   // ============== LOGOUT ==============

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUserData(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     }
//   };

//   // ============== EXPORT VALUE ==============

//   const isAdminValue = userData?.isAdmin || false;
  
//   const value: AuthContextType = {
//     user,
//     userData,
//     loading,
//     signup,
//     signupWithPhone,
//     login,
//     loginWithPhone,
//     loginWithGoogle,
//     logout,
//     isAdmin: isAdminValue,
//     resetPassword,
//     confirmResetPassword,
//     verifyResetCode,
//     changePassword,
//     changePasswordWithOld,
//     updateRTDBPasswordAfterReset,
//     checkAndUpdateRTDBPassword,
//     updateRTDBPassword,
//   };
  
//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };










'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { auth, rtdb } from './firebase';
import { ref, get, set, query, orderByChild, equalTo, update } from 'firebase/database';

interface UserData {
  uid: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin: boolean;
  isPhone: boolean;
  isEmail: boolean;
  createdAt: string;
  loginMethod: 'email' | 'phone' | 'google';
  passwordReset?: boolean;
  passwordResetAt?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (code: string, newPassword: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<string>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  changePasswordWithOld: (oldPassword: string, newPassword: string) => Promise<void>;
  updateRTDBPasswordAfterReset: (email: string) => Promise<void>;
  checkAndUpdateRTDBPassword: (user: User) => Promise<boolean>;
  updateRTDBPassword: (uid: string, newPassword: string) => Promise<void>;
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
          const userRef = ref(rtdb, `users/${currentUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val() as UserData;
            setUserData(userData);
          } else {
            const isAdminUser = currentUser.email === ADMIN_EMAIL;
            const isPhoneUser = currentUser.email?.endsWith('@phone.auth') || false;
            const cleanPhone = isPhoneUser ? currentUser.email?.replace('@phone.auth', '') || '' : '';
            
            const defaultUserData: UserData = {
              uid: currentUser.uid,
              name: currentUser.displayName || '',
              email: currentUser.email || '',
              phone: cleanPhone || '',
              password: '',
              isAdmin: isAdminUser,
              isPhone: isPhoneUser,
              isEmail: !isPhoneUser && !!currentUser.email,
              createdAt: new Date().toISOString(),
              loginMethod: isPhoneUser ? 'phone' : (currentUser.email ? 'email' : 'google'),
              passwordReset: false,
            };
            
            await set(userRef, defaultUserData);
            setUserData(defaultUserData);
          }
        } catch (error) {
          console.log('[v0] Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ============== SIGNUP FUNCTIONS ==============

  const signup = async (email: string, password: string, name: string) => {
    try {
      const usersRef = ref(rtdb, 'users');
      const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(emailQuery);
      
      if (snapshot.exists()) {
        throw new Error('Email already registered');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const newUserData: UserData = {
        uid: userCredential.user.uid,
        name: name,
        email: email,
        phone: '',
        password: password,
        isAdmin: email === ADMIN_EMAIL,
        isPhone: false,
        isEmail: true,
        createdAt: new Date().toISOString(),
        loginMethod: 'email',
        passwordReset: false,
      };
      
      await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const signupWithPhone = async (phone: string, password: string, name: string) => {
    try {
      const usersRef = ref(rtdb, 'users');
      const phoneQuery = query(usersRef, orderByChild('phone'), equalTo(phone));
      const snapshot = await get(phoneQuery);
      
      if (snapshot.exists()) {
        throw new Error('Phone number already registered');
      }

      const phoneEmail = `${phone}@phone.auth`;
      
      const userCredential = await createUserWithEmailAndPassword(auth, phoneEmail, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const newUserData: UserData = {
        uid: userCredential.user.uid,
        name: name,
        email: '',
        phone: phone,
        password: password,
        isAdmin: false,
        isPhone: true,
        isEmail: false,
        createdAt: new Date().toISOString(),
        loginMethod: 'phone',
        passwordReset: false,
      };
      
      await set(ref(rtdb, `users/${userCredential.user.uid}`), newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error('Phone signup error:', error);
      throw error;
    }
  };

  // ============== LOGIN FUNCTIONS ==============

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    try {
      const phoneEmail = `${phone}@phone.auth`;
      await signInWithEmailAndPassword(auth, phoneEmail, password);
    } catch (error) {
      console.error('Phone login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userCredential = result.user;

      const userRef = ref(rtdb, `users/${userCredential.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        const newUserData: UserData = {
          uid: userCredential.uid,
          name: userCredential.displayName || '',
          email: userCredential.email || '',
          phone: '',
          password: '',
          isAdmin: userCredential.email === ADMIN_EMAIL,
          isPhone: false,
          isEmail: true,
          createdAt: new Date().toISOString(),
          loginMethod: 'google',
          passwordReset: false,
        };
        await set(userRef, newUserData);
        setUserData(newUserData);
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  // ============== PASSWORD RESET FUNCTIONS ==============

  const resetPassword = async (email: string) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log('✅ Reset email sent to:', email);
      
      try {
        const usersRef = ref(rtdb, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          let userUid = null;
          
          Object.keys(data).forEach((key) => {
            const userData = data[key];
            const userEmail = userData.email || '';
            const phoneEmail = `${userData.phone || ''}@phone.auth`;
            
            if (userEmail === email || userEmail === `${email}@phone.auth` || phoneEmail === email) {
              userUid = key;
              console.log('✅ Found user in RTDB:', key);
            }
          });
          
          if (userUid) {
            await update(ref(rtdb, `users/${userUid}`), {
              passwordReset: true,
              passwordResetAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            console.log('✅✅✅ passwordReset flag set to TRUE for user:', userUid);
          } else {
            console.warn('⚠️ User NOT found in RTDB for email:', email);
          }
        }
      } catch (err) {
        console.error('Error setting passwordReset flag:', err);
      }
      
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email address');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please try again later');
      } else {
        throw new Error(error.message || 'Failed to send reset email');
      }
    }
  };

  const verifyResetCode = async (code: string): Promise<string> => {
    try {
      const email = await verifyPasswordResetCode(auth, code);
      return email;
    } catch (error: any) {
      console.error('Verify reset code error:', error);
      if (error.code === 'auth/expired-action-code') {
        throw new Error('Reset link has expired. Please request a new one.');
      } else if (error.code === 'auth/invalid-action-code') {
        throw new Error('Invalid reset link. Please request a new one.');
      } else {
        throw new Error(error.message || 'Failed to verify reset code');
      }
    }
  };

  const confirmResetPassword = async (code: string, newPassword: string) => {
    try {
      await confirmPasswordReset(auth, code, newPassword);
      
      const email = await verifyPasswordResetCode(auth, code);
      console.log('🔍 Email from reset code:', email);
      
      if (email) {
        const usersRef = ref(rtdb, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          let userUid = null;
          
          Object.keys(data).forEach((key) => {
            const userData = data[key];
            const userEmail = userData.email || '';
            const phoneEmail = `${userData.phone || ''}@phone.auth`;
            
            if (userEmail === email || userEmail === `${email}@phone.auth` || phoneEmail === email) {
              userUid = key;
              console.log('✅ Found user in RTDB:', key);
            }
          });
          
          if (userUid) {
            await update(ref(rtdb, `users/${userUid}`), {
              password: newPassword,
              passwordReset: true,
              passwordResetAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            console.log('✅ Password updated in RTDB with reset flag for:', email);
          } else {
            console.warn('⚠️ User NOT found in RTDB for email:', email);
          }
        }
      }
      
      console.log('✅ Password reset successfully');
    } catch (error: any) {
      console.error('Confirm reset password error:', error);
      if (error.code === 'auth/expired-action-code') {
        throw new Error('Reset link has expired. Please request a new one.');
      } else if (error.code === 'auth/invalid-action-code') {
        throw new Error('Invalid reset link. Please request a new one.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Minimum 6 characters.');
      } else {
        throw new Error(error.message || 'Failed to reset password');
      }
    }
  };

  const updateRTDBPasswordAfterReset = async (email: string): Promise<void> => {
    try {
      const usersRef = ref(rtdb, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        let userUid = null;
        
        Object.keys(data).forEach((key) => {
          const userData = data[key];
          if (userData.email === email || userData.email === `${email}@phone.auth`) {
            userUid = key;
          }
        });
        
        if (userUid) {
          await update(ref(rtdb, `users/${userUid}`), {
            passwordReset: true,
            passwordResetAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          console.log('✅ Password reset flag set in RTDB for:', email);
        }
      }
    } catch (error) {
      console.error('RTDB update error:', error);
    }
  };

  const updateRTDBPasswordByEmail = async (email: string, newPassword: string, setResetFlag: boolean = false) => {
    try {
      const usersRef = ref(rtdb, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        let userUid = null;
        
        Object.keys(data).forEach((key) => {
          const userData = data[key];
          const userEmail = userData.email || '';
          const phoneEmail = `${userData.phone || ''}@phone.auth`;
          
          if (userEmail === email || userEmail === `${email}@phone.auth` || phoneEmail === email) {
            userUid = key;
          }
        });
        
        if (userUid) {
          const updateData: any = {
            password: newPassword,
            updatedAt: new Date().toISOString()
          };
          
          if (setResetFlag) {
            updateData.passwordReset = true;
          }
          
          await update(ref(rtdb, `users/${userUid}`), updateData);
          console.log('✅ Password updated in RTDB for:', email);
        } else {
          console.warn('⚠️ User not found in RTDB, only Firebase Auth updated');
        }
      }
    } catch (error) {
      console.error('RTDB update error:', error);
    }
  };

  // ============== ✅ CHECK RTDB PASSWORD - NO FLAG RESET HERE ==============

  const checkAndUpdateRTDBPassword = async (user: User): Promise<boolean> => {
    try {
      const userRef = ref(rtdb, `users/${user.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log('🔍 RTDB Data:', { 
          password: userData.password ? '✅ exists' : '❌ missing',
          passwordReset: userData.passwordReset,
          email: userData.email,
          uid: user.uid
        });
        
        // ✅ Check if passwordReset flag is true OR password is missing
        // ⚠️ DO NOT reset the flag here - let the modal handle it
        if (userData.passwordReset === true || !userData.password || userData.password === '') {
          console.log('⚠️ Password reset required (flag or missing password)');
          return true; // Modal aayega
        }
        return false;
      }
      
      console.log('⚠️ User not found in RTDB, but DO NOT create new entry');
      return true;
      
    } catch (error) {
      console.error('Error checking RTDB password:', error);
      return true;
    }
  };

  // ============== UPDATE RTDB PASSWORD - FLAG RESET HERE ==============

  const updateRTDBPassword = async (uid: string, newPassword: string): Promise<void> => {
    try {
      const userRef = ref(rtdb, `users/${uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        await update(userRef, {
          password: newPassword,
          passwordReset: false,  // ✅ Flag reset here (when password is actually changed)
          updatedAt: new Date().toISOString()
        });
        console.log('✅ RTDB password updated for user:', uid);
      } else {
        await set(userRef, {
          uid: uid,
          password: newPassword,
          passwordReset: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log('✅ New user created in RTDB with password:', uid);
      }
    } catch (error) {
      console.error('Error updating RTDB password:', error);
      throw error;
    }
  };

  // ============== CHANGE PASSWORD WITH OLD - FLAG RESET HERE ==============

  const changePasswordWithOld = async (oldPassword: string, newPassword: string) => {
    try {
      if (!user || !user.email) {
        throw new Error('No user logged in');
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      
      await updatePassword(user, newPassword);
      
      const userRef = ref(rtdb, `users/${user.uid}`);
      await update(userRef, { 
        password: newPassword,
        passwordReset: false,  // ✅ Flag reset here (only when password is actually changed)
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Password changed successfully in both Auth and RTDB');
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please login again to change password');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Minimum 6 characters.');
      } else {
        throw new Error(error.message || 'Failed to change password');
      }
    }
  };

  // ============== CHANGE PASSWORD ==============

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      if (!user || !user.email) {
        throw new Error('No user logged in');
      }

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      
      await updatePassword(user, newPassword);
      
      const userRef = ref(rtdb, `users/${user.uid}`);
      await update(userRef, { 
        password: newPassword,
        passwordReset: false,
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Password changed successfully');
    } catch (error: any) {
      console.error('Change password error:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      } else if (error.code === 'auth/requires-recent-login') {
        throw new Error('Please login again to change password');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Minimum 6 characters.');
      } else {
        throw new Error(error.message || 'Failed to change password');
      }
    }
  };

  // ============== LOGOUT ==============

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // ============== EXPORT VALUE ==============

  const isAdminValue = userData?.isAdmin || false;
  
  const value: AuthContextType = {
    user,
    userData,
    loading,
    signup,
    signupWithPhone,
    login,
    loginWithPhone,
    loginWithGoogle,
    logout,
    isAdmin: isAdminValue,
    resetPassword,
    confirmResetPassword,
    verifyResetCode,
    changePassword,
    changePasswordWithOld,
    updateRTDBPasswordAfterReset,
    checkAndUpdateRTDBPassword,
    updateRTDBPassword,
  };
  
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