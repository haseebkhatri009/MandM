// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Mail, Lock, AlertCircle } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const { login, loginWithGoogle } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!email || !password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       await login(email, password);
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Email */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="abc@gmail.com"
//                   />
//                 </div>
//               </motion.div>

//               {/* Password */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                 </div>
//               </motion.div>

//               {/* Login Button */}
//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link
//                 href="/signup"
//                 className="text-primary font-semibold hover:underline transition-all"
//               >
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link
//               href="/"
//               className="text-muted-foreground hover:text-foreground transition-colors text-sm"
//             >
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }




//with eye icon see or hide password

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, loginWithGoogle } = useAuth();
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!email || !password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       await login(email, password);
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Email */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="abc@gmail.com"
//                   />
//                 </div>
//               </motion.div>

//               {/* Password */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </motion.div>

//               {/* Login Button */}
//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link
//                 href="/signup"
//                 className="text-primary font-semibold hover:underline transition-all"
//               >
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link
//               href="/"
//               className="text-muted-foreground hover:text-foreground transition-colors text-sm"
//             >
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }





//with user auth /login to /

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const { user, login, loginWithGoogle } = useAuth();
//   const router = useRouter();

//   // Check if user is already logged in
//   useEffect(() => {
//     // If user is logged in, redirect to home
//     if (user) {
//       router.push('/');
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!email || !password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       await login(email, password);
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please check your credentials.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // Show loading state while checking authentication
//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If user is logged in, don't render the login page
//   if (user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Email */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="abc@gmail.com"
//                   />
//                 </div>
//               </motion.div>

//               {/* Password */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </motion.div>

//               {/* Login Button */}
//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link
//                 href="/signup"
//                 className="text-primary font-semibold hover:underline transition-all"
//               >
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link
//               href="/"
//               className="text-muted-foreground hover:text-foreground transition-colors text-sm"
//             >
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }











// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { Mail, Lock, AlertCircle, Eye, EyeOff, Phone } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     emailOrPhone: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  
//   const { user, login, loginWithPhone, loginWithGoogle } = useAuth();
//   const router = useRouter();

//   // Check if user is already logged in
//   useEffect(() => {
//     if (user) {
//       router.push('/');
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const cleanValue = value.replace(/\s/g, '');
//     setFormData(prev => ({ ...prev, [name]: cleanValue }));
    
//     if (name === 'emailOrPhone') {
//       if (/^\d{11}$/.test(cleanValue)) {
//         setIsPhoneLogin(true);
//       } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
//         setIsPhoneLogin(false);
//       } else {
//         setIsPhoneLogin(false);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!formData.emailOrPhone || !formData.password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       const cleanEmailOrPhone = formData.emailOrPhone.replace(/\s/g, '');
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailOrPhone);
//       const isPhone = /^\d{11}$/.test(cleanEmailOrPhone);

//       if (isPhone) {
//         await loginWithPhone(cleanEmailOrPhone, formData.password);
//       } else if (isEmail) {
//         await login(cleanEmailOrPhone, formData.password);
//       } else {
//         setError('Please enter a valid email or 11-digit phone number');
//         setLoading(false);
//         return;
//       }

//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // Show loading state while checking authentication
//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If user is logged in, don't render the login page
//   if (user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Email or Phone */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address or Phone Number
//                 </label>
//                 <div className="relative">
//                   {isPhoneLogin ? (
//                     <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   ) : (
//                     <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   )}
//                   <input
//                     type="text"
//                     name="emailOrPhone"
//                     value={formData.emailOrPhone}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="email@example.com or 03123456789"
//                   />
//                 </div>
//                 {isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📱 Signing in with phone: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//                 {!isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📧 Signing in with email: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//               </motion.div>

//               {/* Password */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </motion.div>

//               {/* Login Button */}
//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link
//                 href="/signup"
//                 className="text-primary font-semibold hover:underline transition-all"
//               >
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link
//               href="/"
//               className="text-muted-foreground hover:text-foreground transition-colors text-sm"
//             >
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }










//reset password modal

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mail, Lock, AlertCircle, Eye, EyeOff, Phone, Key, X, CheckCircle } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const [formData, setFormData] = useState({
//     emailOrPhone: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  
//   // Forgot Password States
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
//   const [resetEmail, setResetEmail] = useState('');
//   const [resetPhone, setResetPhone] = useState('');
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [resetError, setResetError] = useState('');
  
//   const { user, login, loginWithPhone, loginWithGoogle, resetPassword } = useAuth();
//   const router = useRouter();

//   // Check if user is already logged in
//   useEffect(() => {
//     if (user) {
//       router.push('/');
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const cleanValue = value.replace(/\s/g, '');
//     setFormData(prev => ({ ...prev, [name]: cleanValue }));
    
//     if (name === 'emailOrPhone') {
//       if (/^\d{11}$/.test(cleanValue)) {
//         setIsPhoneLogin(true);
//       } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
//         setIsPhoneLogin(false);
//       } else {
//         setIsPhoneLogin(false);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!formData.emailOrPhone || !formData.password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       const cleanEmailOrPhone = formData.emailOrPhone.replace(/\s/g, '');
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailOrPhone);
//       const isPhone = /^\d{11}$/.test(cleanEmailOrPhone);

//       if (isPhone) {
//         await loginWithPhone(cleanEmailOrPhone, formData.password);
//       } else if (isEmail) {
//         await login(cleanEmailOrPhone, formData.password);
//       } else {
//         setError('Please enter a valid email or 11-digit phone number');
//         setLoading(false);
//         return;
//       }

//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//       router.push('/');
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // Handle Forgot Password - Email
//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setResetError('');
//     setResetSuccess(false);
//     setResetLoading(true);

//     try {
//       if (resetMethod === 'email') {
//         if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
//           setResetError('Please enter a valid email address');
//           setResetLoading(false);
//           return;
//         }
//         await resetPassword(resetEmail);
//         setResetSuccess(true);
//         setTimeout(() => {
//           setShowForgotModal(false);
//           setResetSuccess(false);
//           setResetEmail('');
//           setResetPhone('');
//         }, 3000);
//       } else {
//         // Phone password reset - Firebase doesn't support this directly
//         // Show message to contact support
//         setResetError('Phone password reset is not available. Please contact support or use email reset.');
//         setResetLoading(false);
//       }
//     } catch (err: any) {
//       if (err.code === 'auth/user-not-found') {
//         setResetError('No account found with this email address');
//       } else {
//         setResetError(err.message || 'Failed to send reset email. Please try again.');
//       }
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   // Show loading state while checking authentication
//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If user is logged in, don't render the login page
//   if (user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Email or Phone */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address or Phone Number
//                 </label>
//                 <div className="relative">
//                   {isPhoneLogin ? (
//                     <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   ) : (
//                     <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   )}
//                   <input
//                     type="text"
//                     name="emailOrPhone"
//                     value={formData.emailOrPhone}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="email@example.com or 03123456789"
//                   />
//                 </div>
//                 {isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📱 Signing in with phone: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//                 {!isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📧 Signing in with email: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//               </motion.div>

//               {/* Password */}
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-5 h-5" />
//                     ) : (
//                       <Eye className="w-5 h-5" />
//                     )}
//                   </button>
//                 </div>
//               </motion.div>

//               {/* Login Button */}
//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>

//               {/* Forgot Password Link */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.45 }}
//                 className="text-right"
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForgotModal(true);
//                     setResetError('');
//                     setResetSuccess(false);
//                     setResetEmail('');
//                     setResetPhone('');
//                   }}
//                   className="text-sm text-primary hover:text-accent hover:underline transition-colors font-medium"
//                 >
//                   Forgot Password?
//                 </button>
//               </motion.div>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link
//                 href="/signup"
//                 className="text-primary font-semibold hover:underline transition-all"
//               >
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link
//               href="/"
//               className="text-muted-foreground hover:text-foreground transition-colors text-sm"
//             >
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Forgot Password Modal */}
//       <AnimatePresence>
//         {showForgotModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => {
//               if (!resetLoading) {
//                 setShowForgotModal(false);
//                 setResetError('');
//                 setResetSuccess(false);
//               }
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
//                     <Key className="w-5 h-5 text-primary" />
//                     Reset Password
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Choose how you want to reset your password
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                     }
//                   }}
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Method Selector */}
//               <div className="flex gap-2 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('email');
//                     setResetError('');
//                     setResetSuccess(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'email'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Mail size={16} />
//                   Email
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('phone');
//                     setResetError('');
//                     setResetSuccess(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'phone'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Phone size={16} />
//                   Phone
//                 </button>
//               </div>

//               <form onSubmit={handleResetPassword}>
//                 {resetMethod === 'email' ? (
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-foreground mb-2">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={resetEmail}
//                         onChange={(e) => {
//                           setResetEmail(e.target.value);
//                           setResetError('');
//                           setResetSuccess(false);
//                         }}
//                         className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder="you@example.com"
//                         required
//                         disabled={resetLoading || resetSuccess}
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         We'll send a password reset link to this email
//                       </p>
//                     </div>

//                     {resetError && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
//                       >
//                         <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-red-700 text-sm">{resetError}</p>
//                       </motion.div>
//                     )}

//                     {resetSuccess && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2"
//                       >
//                         <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-green-700 text-sm">
//                           Password reset email sent! Please check your inbox.
//                         </p>
//                       </motion.div>
//                     )}

//                     <button
//                       type="submit"
//                       disabled={resetLoading || resetSuccess}
//                       className={`w-full py-2 rounded-lg font-semibold transition-all ${
//                         resetLoading || resetSuccess
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           : 'bg-primary text-white hover:opacity-90'
//                       }`}
//                     >
//                       {resetLoading ? 'Sending...' : 'Send Reset Link'}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                       <div className="flex items-start gap-3">
//                         <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <p className="text-yellow-800 font-medium text-sm">
//                             Phone Reset Not Available
//                           </p>
//                           <p className="text-yellow-700 text-sm mt-1">
//                             Password reset via phone number is not supported by Firebase.
//                             Please use the <strong>Email</strong> option above or contact support.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-foreground mb-2">
//                         Phone Number
//                       </label>
//                       <input
//                         type="tel"
//                         value={resetPhone}
//                         onChange={(e) => {
//                           const clean = e.target.value.replace(/\D/g, '');
//                           setResetPhone(clean);
//                         }}
//                         className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder="03123456789"
//                         disabled
//                         maxLength={11}
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         ⚠️ Phone password reset is not available
//                       </p>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => setResetMethod('email')}
//                       className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all"
//                     >
//                       Use Email Instead
//                     </button>
//                   </div>
//                 )}
//               </form>

//               <div className="mt-4 text-center">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                     }
//                   }}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   ← Back to Login
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }






//password change modal
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mail, Lock, AlertCircle, Eye, EyeOff, Phone, Key, X, CheckCircle, Loader2 } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import { getDatabase, ref, get, update } from 'firebase/database';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const { 
//     user, 
//     login, 
//     loginWithPhone, 
//     loginWithGoogle, 
//     resetPassword, 
//     checkAndUpdateRTDBPassword, 
//     updateRTDBPassword,
//     changePasswordWithOld
//   } = useAuth();
  
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     emailOrPhone: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  
//   // Forgot Password States
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
//   const [resetEmail, setResetEmail] = useState('');
//   const [resetPhone, setResetPhone] = useState('');
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [resetError, setResetError] = useState('');

//   // ✅ Password Update Modal States
//   const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
//   const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [updateError, setUpdateError] = useState('');
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   // ✅ Check if user is already logged in and needs password update
//   useEffect(() => {
//     if (user) {
//       const checkRTDB = async () => {
//         try {
//           const needsUpdate = await checkAndUpdateRTDBPassword(user);
//           if (needsUpdate) {
//             setShowPasswordUpdateModal(true);
//           } else {
//             router.push('/');
//           }
//         } catch (error) {
//           console.error('Error checking RTDB:', error);
//           router.push('/');
//         }
//       };
//       checkRTDB();
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const cleanValue = value.replace(/\s/g, '');
//     setFormData(prev => ({ ...prev, [name]: cleanValue }));
    
//     if (name === 'emailOrPhone') {
//       if (/^\d{11}$/.test(cleanValue)) {
//         setIsPhoneLogin(true);
//       } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
//         setIsPhoneLogin(false);
//       } else {
//         setIsPhoneLogin(false);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!formData.emailOrPhone || !formData.password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       const cleanEmailOrPhone = formData.emailOrPhone.replace(/\s/g, '');
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailOrPhone);
//       const isPhone = /^\d{11}$/.test(cleanEmailOrPhone);

//       if (isPhone) {
//         await loginWithPhone(cleanEmailOrPhone, formData.password);
//       } else if (isEmail) {
//         await login(cleanEmailOrPhone, formData.password);
//       } else {
//         setError('Please enter a valid email or 11-digit phone number');
//         setLoading(false);
//         return;
//       }

//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // ✅ Updated Reset Password - Sets flag in RTDB
//   // const handleResetPassword = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   setResetError('');
//   //   setResetSuccess(false);
//   //   setResetLoading(true);

//   //   try {
//   //     if (resetMethod === 'email') {
//   //       if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
//   //         setResetError('Please enter a valid email address');
//   //         setResetLoading(false);
//   //         return;
//   //       }
        
//   //       // ✅ Step 1: Send reset email
//   //       await resetPassword(resetEmail);
        
//   //       // ✅ Step 2: Immediately set passwordReset flag in RTDB
//   //       try {
//   //         const db = getDatabase();
//   //         const usersRef = ref(db, 'users');
//   //         const snapshot = await get(usersRef);
          
//   //         if (snapshot.exists()) {
//   //           const data = snapshot.val();
//   //           let userUid = null;
            
//   //           Object.keys(data).forEach((key) => {
//   //             const userData = data[key];
//   //             const userEmail = userData.email || '';
//   //             const phoneEmail = `${userData.phone || ''}@phone.auth`;
              
//   //             if (userEmail === resetEmail || userEmail === `${resetEmail}@phone.auth` || phoneEmail === resetEmail) {
//   //               userUid = key;
//   //             }
//   //           });
            
//   //           if (userUid) {
//   //             await update(ref(db, `users/${userUid}`), {
//   //               passwordReset: true,
//   //               passwordResetAt: new Date().toISOString(),
//   //               updatedAt: new Date().toISOString()
//   //             });
//   //             console.log('✅ passwordReset flag set to TRUE for:', resetEmail);
//   //           }
//   //         }
//   //       } catch (err) {
//   //         console.error('Error setting passwordReset flag:', err);
//   //       }
        
//   //       setResetSuccess(true);
//   //       setTimeout(() => {
//   //         setShowForgotModal(false);
//   //         setResetSuccess(false);
//   //         setResetEmail('');
//   //         setResetPhone('');
//   //       }, 3000);
//   //     } else {
//   //       setResetError('Phone password reset is not available. Please use email.');
//   //       setResetLoading(false);
//   //     }
//   //   } catch (err: any) {
//   //     if (err.code === 'auth/user-not-found') {
//   //       setResetError('No account found with this email address');
//   //     } else {
//   //       setResetError(err.message || 'Failed to send reset email. Please try again.');
//   //     }
//   //   } finally {
//   //     setResetLoading(false);
//   //   }
//   // };



// const handleResetPassword = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setResetError('');
//   setResetSuccess(false);
//   setResetLoading(true);

//   try {
//     if (resetMethod === 'email') {
//       if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
//         setResetError('Please enter a valid email address');
//         setResetLoading(false);
//         return;
//       }
      
//       // ✅ Step 1: Send reset email
//       await resetPassword(resetEmail);
//       console.log('✅ Email sent successfully to:', resetEmail);
      
//       // ✅ Step 2: JAB EMAIL SEND HO JAYE TOH RTDB UPDATE KARO
//       const db = getDatabase();
//       const usersRef = ref(db, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         let userUid = null;
        
//         // Find user by email
//         Object.keys(data).forEach((key) => {
//           const userData = data[key];
//           const userEmail = userData.email || '';
//           const phoneEmail = `${userData.phone || ''}@phone.auth`;
          
//           if (userEmail === resetEmail || userEmail === `${resetEmail}@phone.auth` || phoneEmail === resetEmail) {
//             userUid = key;
//           }
//         });
        
//         if (userUid) {
//           // ✅ SIRF YAHI KAAM KARNA HAI - passwordReset: true
//           await update(ref(db, `users/${userUid}`), {
//             passwordReset: true,
//             passwordResetAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//           });
//           console.log('✅✅✅ passwordReset set to TRUE for:', resetEmail);
//         } else {
//           console.warn('⚠️ User NOT found in RTDB for email:', resetEmail);
//         }
//       }
      
//       setResetSuccess(true);
//       setTimeout(() => {
//         setShowForgotModal(false);
//         setResetSuccess(false);
//         setResetEmail('');
//         setResetPhone('');
//       }, 3000);
      
//     } else {
//       setResetError('Phone password reset is not available. Please use email.');
//       setResetLoading(false);
//     }
//   } catch (err: any) {
//     if (err.code === 'auth/user-not-found') {
//       setResetError('No account found with this email address');
//     } else {
//       setResetError(err.message || 'Failed to send reset email. Please try again.');
//     }
//   } finally {
//     setResetLoading(false);
//   }
// };




//   // ✅ Handle Password Update - Sets flag to false
//   const handlePasswordUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUpdateError('');
//     setUpdateSuccess(false);
//     setUpdateLoading(true);

//     if (!oldPassword || !newPassword || !confirmPassword) {
//       setUpdateError('Please fill in all fields');
//       setUpdateLoading(false);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setUpdateError('New passwords do not match');
//       setUpdateLoading(false);
//       return;
//     }

//     if (newPassword.length < 6) {
//       setUpdateError('Password must be at least 6 characters');
//       setUpdateLoading(false);
//       return;
//     }

//     if (oldPassword === newPassword) {
//       setUpdateError('New password must be different from current password');
//       setUpdateLoading(false);
//       return;
//     }

//     try {
//       if (!user) {
//         throw new Error('No user logged in');
//       }

//       // ✅ Change password in Firebase Auth AND RTDB
//       await changePasswordWithOld(oldPassword, newPassword);
      
//       // ✅ Explicitly set passwordReset to false
//       const db = getDatabase();
//       const userRef = ref(db, `users/${user.uid}`);
//       await update(userRef, {
//         passwordReset: false,
//         updatedAt: new Date().toISOString()
//       });
//       console.log('✅ passwordReset flag set to FALSE');
      
//       setUpdateSuccess(true);
      
//       setTimeout(() => {
//         setShowPasswordUpdateModal(false);
//         router.push('/');
//       }, 1500);
      
//     } catch (err: any) {
//       console.error('Update password error:', err);
//       setUpdateError(err.message || 'Failed to update password. Please try again.');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Show loading state while checking authentication
//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If user is logged in, don't render the login page
//   if (user && !showPasswordUpdateModal) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address or Phone Number
//                 </label>
//                 <div className="relative">
//                   {isPhoneLogin ? (
//                     <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   ) : (
//                     <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   )}
//                   <input
//                     type="text"
//                     name="emailOrPhone"
//                     value={formData.emailOrPhone}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="email@example.com or 03123456789"
//                   />
//                 </div>
//                 {isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📱 Signing in with phone: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//                 {!isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📧 Signing in with email: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </motion.div>

//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.45 }}
//                 className="text-right"
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForgotModal(true);
//                     setResetError('');
//                     setResetSuccess(false);
//                     setResetEmail('');
//                     setResetPhone('');
//                   }}
//                   className="text-sm text-primary hover:text-accent hover:underline transition-colors font-medium"
//                 >
//                   Forgot Password?
//                 </button>
//               </motion.div>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link href="/signup" className="text-primary font-semibold hover:underline transition-all">
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Forgot Password Modal */}
//       <AnimatePresence>
//         {showForgotModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => {
//               if (!resetLoading) {
//                 setShowForgotModal(false);
//                 setResetError('');
//                 setResetSuccess(false);
//               }
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
//                     <Key className="w-5 h-5 text-primary" />
//                     Reset Password
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Choose how you want to reset your password
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                     }
//                   }}
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="flex gap-2 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('email');
//                     setResetError('');
//                     setResetSuccess(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'email'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Mail size={16} />
//                   Email
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('phone');
//                     setResetError('');
//                     setResetSuccess(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'phone'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Phone size={16} />
//                   Phone
//                 </button>
//               </div>

//               <form onSubmit={handleResetPassword}>
//                 {resetMethod === 'email' ? (
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-foreground mb-2">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={resetEmail}
//                         onChange={(e) => {
//                           setResetEmail(e.target.value);
//                           setResetError('');
//                           setResetSuccess(false);
//                         }}
//                         className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder="you@example.com"
//                         required
//                         disabled={resetLoading || resetSuccess}
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         We'll send a password reset link to this email
//                       </p>
//                     </div>

//                     {resetError && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
//                       >
//                         <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-red-700 text-sm">{resetError}</p>
//                       </motion.div>
//                     )}

//                     {resetSuccess && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2"
//                       >
//                         <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-green-700 text-sm">
//                           Password reset email sent! Flag set in RTDB.
//                         </p>
//                       </motion.div>
//                     )}

//                     <button
//                       type="submit"
//                       disabled={resetLoading || resetSuccess}
//                       className={`w-full py-2 rounded-lg font-semibold transition-all ${
//                         resetLoading || resetSuccess
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           : 'bg-primary text-white hover:opacity-90'
//                       }`}
//                     >
//                       {resetLoading ? 'Sending...' : 'Send Reset Link'}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                       <div className="flex items-start gap-3">
//                         <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <p className="text-yellow-800 font-medium text-sm">
//                             Phone Reset Not Available
//                           </p>
//                           <p className="text-yellow-700 text-sm mt-1">
//                             Password reset via phone number is not supported by Firebase.
//                             Please use the <strong>Email</strong> option above.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setResetMethod('email')}
//                       className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all"
//                     >
//                       Use Email Instead
//                     </button>
//                   </div>
//                 )}
//               </form>

//               <div className="mt-4 text-center">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                     }
//                   }}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   ← Back to Login
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ✅ Password Update Modal */}
//       <AnimatePresence>
//         {showPasswordUpdateModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
//                     <Key className="w-5 h-5 text-primary" />
//                     Update Password
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Please update your password to complete the setup.
//                   </p>
//                 </div>
//               </div>

//               <form onSubmit={handlePasswordUpdate} className="space-y-4">
//                 {/* Old Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showOldPassword ? 'text' : 'password'}
//                       value={oldPassword}
//                       onChange={(e) => setOldPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Enter current password"
//                       required
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowOldPassword(!showOldPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showNewPasswordModal ? 'text' : 'password'}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Enter new password (min 6 chars)"
//                       required
//                       minLength={6}
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowNewPasswordModal(!showNewPasswordModal)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showNewPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPasswordModal ? 'text' : 'password'}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Confirm new password"
//                       required
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPasswordModal(!showConfirmPasswordModal)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showConfirmPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Password Requirements */}
//                 <div className="text-xs text-muted-foreground space-y-1">
//                   <p className={newPassword.length >= 6 ? 'text-green-600' : ''}>
//                     ✓ At least 6 characters
//                   </p>
//                   <p className={newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : ''}>
//                     ✓ Passwords match
//                   </p>
//                   <p className={oldPassword && newPassword && oldPassword !== newPassword ? 'text-green-600' : ''}>
//                     ✓ Different from current password
//                   </p>
//                 </div>

//                 {updateError && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
//                   >
//                     {updateError}
//                   </motion.div>
//                 )}

//                 {updateSuccess && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
//                   >
//                     <CheckCircle className="w-4 h-4 text-green-500" />
//                     Password updated successfully! Flag reset to false.
//                   </motion.div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={
//                     updateLoading || 
//                     updateSuccess || 
//                     !oldPassword || 
//                     !newPassword || 
//                     newPassword.length < 6 || 
//                     newPassword !== confirmPassword ||
//                     oldPassword === newPassword
//                   }
//                   className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     updateLoading || 
//                     updateSuccess || 
//                     !oldPassword || 
//                     !newPassword || 
//                     newPassword.length < 6 || 
//                     newPassword !== confirmPassword ||
//                     oldPassword === newPassword
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
//                   }`}
//                 >
//                   {updateLoading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Updating...
//                     </>
//                   ) : updateSuccess ? (
//                     'Done ✓'
//                   ) : (
//                     'Update Password'
//                   )}
//                 </button>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
















// ok code without phone password reset

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mail, Lock, AlertCircle, Eye, EyeOff, Phone, Key, X, CheckCircle, Loader2 } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import { getDatabase, ref, get, update } from 'firebase/database';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const { 
//     user, 
//     login, 
//     loginWithPhone, 
//     loginWithGoogle, 
//     resetPassword, 
//     checkAndUpdateRTDBPassword, 
//     updateRTDBPassword,
//     changePasswordWithOld
//   } = useAuth();
  
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     emailOrPhone: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  
//   // Forgot Password States
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
//   const [resetEmail, setResetEmail] = useState('');
//   const [resetPhone, setResetPhone] = useState('');
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [resetError, setResetError] = useState('');

//   // Password Update Modal States
//   const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
//   const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [updateError, setUpdateError] = useState('');
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   // Check if user is already logged in and needs password update
//   useEffect(() => {
//     if (user) {
//       const checkRTDB = async () => {
//         try {
//           const needsUpdate = await checkAndUpdateRTDBPassword(user);
//           if (needsUpdate) {
//             setShowPasswordUpdateModal(true);
//           } else {
//             router.push('/');
//           }
//         } catch (error) {
//           console.error('Error checking RTDB:', error);
//           router.push('/');
//         }
//       };
//       checkRTDB();
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const cleanValue = value.replace(/\s/g, '');
//     setFormData(prev => ({ ...prev, [name]: cleanValue }));
    
//     if (name === 'emailOrPhone') {
//       if (/^\d{11}$/.test(cleanValue)) {
//         setIsPhoneLogin(true);
//       } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
//         setIsPhoneLogin(false);
//       } else {
//         setIsPhoneLogin(false);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!formData.emailOrPhone || !formData.password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       const cleanEmailOrPhone = formData.emailOrPhone.replace(/\s/g, '');
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailOrPhone);
//       const isPhone = /^\d{11}$/.test(cleanEmailOrPhone);

//       if (isPhone) {
//         await loginWithPhone(cleanEmailOrPhone, formData.password);
//       } else if (isEmail) {
//         await login(cleanEmailOrPhone, formData.password);
//       } else {
//         setError('Please enter a valid email or 11-digit phone number');
//         setLoading(false);
//         return;
//       }

//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // ✅ Updated Reset Password - Sets flag in RTDB
//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setResetError('');
//     setResetSuccess(false);
//     setResetLoading(true);

//     try {
//       if (resetMethod === 'email') {
//         if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
//           setResetError('Please enter a valid email address');
//           setResetLoading(false);
//           return;
//         }
        
//         // ✅ Step 1: Send reset email
//         await resetPassword(resetEmail);
//         console.log('✅ Email sent successfully to:', resetEmail);
        
//         // ✅ Step 2: Find existing user and update passwordReset flag
//         const db = getDatabase();
//         const usersRef = ref(db, 'users');
//         const snapshot = await get(usersRef);
        
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           let userUid = null;
          
//           // Find existing user by email (case sensitive)
//           Object.keys(data).forEach((key) => {
//             const userData = data[key];
//             const userEmail = userData.email || '';
//             const phoneEmail = `${userData.phone || ''}@phone.auth`;
            
//             // Check both email and phone email
//             if (userEmail === resetEmail || userEmail === `${resetEmail}@phone.auth` || phoneEmail === resetEmail) {
//               userUid = key;
//             }
//           });
          
//           if (userUid) {
//             // ✅ UPDATE existing user - NO duplicate creation
//             await update(ref(db, `users/${userUid}`), {
//               passwordReset: true,
//               passwordResetAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString()
//             });
//             console.log('✅✅✅ passwordReset set to TRUE for user:', userUid);
//           } else {
//             console.warn('⚠️ User NOT found in RTDB for email:', resetEmail);
//           }
//         }
        
//         setResetSuccess(true);
//         setTimeout(() => {
//           setShowForgotModal(false);
//           setResetSuccess(false);
//           setResetEmail('');
//           setResetPhone('');
//         }, 3000);
        
//       } else {
//         setResetError('Phone password reset is not available. Please use email.');
//         setResetLoading(false);
//       }
//     } catch (err: any) {
//       if (err.code === 'auth/user-not-found') {
//         setResetError('No account found with this email address');
//       } else {
//         setResetError(err.message || 'Failed to send reset email. Please try again.');
//       }
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   // ✅ Handle Password Update - Sets flag to false
//   const handlePasswordUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUpdateError('');
//     setUpdateSuccess(false);
//     setUpdateLoading(true);

//     if (!oldPassword || !newPassword || !confirmPassword) {
//       setUpdateError('Please fill in all fields');
//       setUpdateLoading(false);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setUpdateError('New passwords do not match');
//       setUpdateLoading(false);
//       return;
//     }

//     if (newPassword.length < 6) {
//       setUpdateError('Password must be at least 6 characters');
//       setUpdateLoading(false);
//       return;
//     }

//     if (oldPassword === newPassword) {
//       setUpdateError('New password must be different from current password');
//       setUpdateLoading(false);
//       return;
//     }

//     try {
//       if (!user) {
//         throw new Error('No user logged in');
//       }

//       // ✅ Change password in Firebase Auth AND RTDB
//       await changePasswordWithOld(oldPassword, newPassword);
      
//       // ✅ Explicitly set passwordReset to false
//       const db = getDatabase();
//       const userRef = ref(db, `users/${user.uid}`);
//       await update(userRef, {
//         passwordReset: false,
//         updatedAt: new Date().toISOString()
//       });
//       console.log('✅ passwordReset flag set to FALSE');
      
//       setUpdateSuccess(true);
      
//       setTimeout(() => {
//         setShowPasswordUpdateModal(false);
//         router.push('/');
//       }, 1500);
      
//     } catch (err: any) {
//       console.error('Update password error:', err);
//       setUpdateError(err.message || 'Failed to update password. Please try again.');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Show loading state while checking authentication
//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If user is logged in, don't render the login page
//   if (user && !showPasswordUpdateModal) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address or Phone Number
//                 </label>
//                 <div className="relative">
//                   {isPhoneLogin ? (
//                     <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   ) : (
//                     <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   )}
//                   <input
//                     type="text"
//                     name="emailOrPhone"
//                     value={formData.emailOrPhone}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="email@example.com or 03123456789"
//                   />
//                 </div>
//                 {isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📱 Signing in with phone: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//                 {!isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📧 Signing in with email: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </motion.div>

//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.45 }}
//                 className="text-right"
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForgotModal(true);
//                     setResetError('');
//                     setResetSuccess(false);
//                     setResetEmail('');
//                     setResetPhone('');
//                   }}
//                   className="text-sm text-primary hover:text-accent hover:underline transition-colors font-medium"
//                 >
//                   Forgot Password?
//                 </button>
//               </motion.div>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link href="/signup" className="text-primary font-semibold hover:underline transition-all">
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Forgot Password Modal */}
//       <AnimatePresence>
//         {showForgotModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => {
//               if (!resetLoading) {
//                 setShowForgotModal(false);
//                 setResetError('');
//                 setResetSuccess(false);
//               }
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
//                     <Key className="w-5 h-5 text-primary" />
//                     Reset Password
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Choose how you want to reset your password
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                     }
//                   }}
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="flex gap-2 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('email');
//                     setResetError('');
//                     setResetSuccess(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'email'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Mail size={16} />
//                   Email
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('phone');
//                     setResetError('');
//                     setResetSuccess(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'phone'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Phone size={16} />
//                   Phone
//                 </button>
//               </div>

//               <form onSubmit={handleResetPassword}>
//                 {resetMethod === 'email' ? (
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-foreground mb-2">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={resetEmail}
//                         onChange={(e) => {
//                           setResetEmail(e.target.value);
//                           setResetError('');
//                           setResetSuccess(false);
//                         }}
//                         className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder="you@example.com"
//                         required
//                         disabled={resetLoading || resetSuccess}
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         We'll send a password reset link to this email
//                       </p>
//                     </div>

//                     {resetError && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
//                       >
//                         <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-red-700 text-sm">{resetError}</p>
//                       </motion.div>
//                     )}

//                     {resetSuccess && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2"
//                       >
//                         <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-green-700 text-sm">
//                           Password reset email sent! Flag set in RTDB.
//                         </p>
//                       </motion.div>
//                     )}

//                     <button
//                       type="submit"
//                       disabled={resetLoading || resetSuccess}
//                       className={`w-full py-2 rounded-lg font-semibold transition-all ${
//                         resetLoading || resetSuccess
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           : 'bg-primary text-white hover:opacity-90'
//                       }`}
//                     >
//                       {resetLoading ? 'Sending...' : 'Send Reset Link'}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                       <div className="flex items-start gap-3">
//                         <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <p className="text-yellow-800 font-medium text-sm">
//                             Phone Reset Not Available
//                           </p>
//                           <p className="text-yellow-700 text-sm mt-1">
//                             Password reset via phone number is not supported by Firebase.
//                             Please use the <strong>Email</strong> option above.
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setResetMethod('email')}
//                       className="w-full py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-all"
//                     >
//                       Use Email Instead
//                     </button>
//                   </div>
//                 )}
//               </form>

//               <div className="mt-4 text-center">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                     }
//                   }}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   ← Back to Login
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Password Update Modal */}
//       <AnimatePresence>
//         {showPasswordUpdateModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
//                     <Key className="w-5 h-5 text-primary" />
//                     Update Password
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Please update your password to complete the setup.
//                   </p>
//                 </div>
//               </div>

//               <form onSubmit={handlePasswordUpdate} className="space-y-4">
//                 {/* Old Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showOldPassword ? 'text' : 'password'}
//                       value={oldPassword}
//                       onChange={(e) => setOldPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Enter current password"
//                       required
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowOldPassword(!showOldPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showNewPasswordModal ? 'text' : 'password'}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Enter new password (min 6 chars)"
//                       required
//                       minLength={6}
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowNewPasswordModal(!showNewPasswordModal)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showNewPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPasswordModal ? 'text' : 'password'}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Confirm new password"
//                       required
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPasswordModal(!showConfirmPasswordModal)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showConfirmPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Password Requirements */}
//                 <div className="text-xs text-muted-foreground space-y-1">
//                   <p className={newPassword.length >= 6 ? 'text-green-600' : ''}>
//                     ✓ At least 6 characters
//                   </p>
//                   <p className={newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : ''}>
//                     ✓ Passwords match
//                   </p>
//                   <p className={oldPassword && newPassword && oldPassword !== newPassword ? 'text-green-600' : ''}>
//                     ✓ Different from current password
//                   </p>
//                 </div>

//                 {updateError && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
//                   >
//                     {updateError}
//                   </motion.div>
//                 )}

//                 {updateSuccess && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
//                   >
//                     <CheckCircle className="w-4 h-4 text-green-500" />
//                     Password updated successfully! Flag reset to false.
//                   </motion.div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={
//                     updateLoading || 
//                     updateSuccess || 
//                     !oldPassword || 
//                     !newPassword || 
//                     newPassword.length < 6 || 
//                     newPassword !== confirmPassword ||
//                     oldPassword === newPassword
//                   }
//                   className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     updateLoading || 
//                     updateSuccess || 
//                     !oldPassword || 
//                     !newPassword || 
//                     newPassword.length < 6 || 
//                     newPassword !== confirmPassword ||
//                     oldPassword === newPassword
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
//                   }`}
//                 >
//                   {updateLoading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Updating...
//                     </>
//                   ) : updateSuccess ? (
//                     'Done ✓'
//                   ) : (
//                     'Update Password'
//                   )}
//                 </button>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



// ok code with email and phone both password reset

// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Mail, Lock, AlertCircle, Eye, EyeOff, Phone, Key, X, CheckCircle, Loader2, Send } from 'lucide-react';
// import { useAuth } from '@/lib/authContext';
// import { getDatabase, ref, get, update } from 'firebase/database';
// import Navbar from '@/components/Navbar';

// export default function LoginPage() {
//   const { 
//     user, 
//     login, 
//     loginWithPhone, 
//     loginWithGoogle, 
//     resetPassword, 
//     checkAndUpdateRTDBPassword, 
//     updateRTDBPassword,
//     changePasswordWithOld
//   } = useAuth();
  
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     emailOrPhone: '',
//     password: ''
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [googleLoading, setGoogleLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  
//   // Forgot Password States
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
//   const [resetEmail, setResetEmail] = useState('');
//   const [resetPhone, setResetPhone] = useState('');
//   const [resetLoading, setResetLoading] = useState(false);
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [resetError, setResetError] = useState('');
//   const [whatsappMessageSent, setWhatsappMessageSent] = useState(false);

//   // Password Update Modal States
//   const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
//   const [oldPassword, setOldPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showOldPassword, setShowOldPassword] = useState(false);
//   const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
//   const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);
//   const [updateLoading, setUpdateLoading] = useState(false);
//   const [updateError, setUpdateError] = useState('');
//   const [updateSuccess, setUpdateSuccess] = useState(false);

//   // Admin WhatsApp Number
//   const ADMIN_WHATSAPP = '923111111111'; // Without + sign

//   // Check if user is already logged in and needs password update
//   useEffect(() => {
//     if (user) {
//       const checkRTDB = async () => {
//         try {
//           const needsUpdate = await checkAndUpdateRTDBPassword(user);
//           if (needsUpdate) {
//             setShowPasswordUpdateModal(true);
//           } else {
//             router.push('/');
//           }
//         } catch (error) {
//           console.error('Error checking RTDB:', error);
//           router.push('/');
//         }
//       };
//       checkRTDB();
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const cleanValue = value.replace(/\s/g, '');
//     setFormData(prev => ({ ...prev, [name]: cleanValue }));
    
//     if (name === 'emailOrPhone') {
//       if (/^\d{11}$/.test(cleanValue)) {
//         setIsPhoneLogin(true);
//       } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
//         setIsPhoneLogin(false);
//       } else {
//         setIsPhoneLogin(false);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       if (!formData.emailOrPhone || !formData.password) {
//         setError('Please fill in all fields');
//         setLoading(false);
//         return;
//       }

//       const cleanEmailOrPhone = formData.emailOrPhone.replace(/\s/g, '');
//       const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailOrPhone);
//       const isPhone = /^\d{11}$/.test(cleanEmailOrPhone);

//       if (isPhone) {
//         await loginWithPhone(cleanEmailOrPhone, formData.password);
//       } else if (isEmail) {
//         await login(cleanEmailOrPhone, formData.password);
//       } else {
//         setError('Please enter a valid email or 11-digit phone number');
//         setLoading(false);
//         return;
//       }

//     } catch (err: any) {
//       setError(err.message || 'Login failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setError('');
//     setGoogleLoading(true);

//     try {
//       await loginWithGoogle();
//     } catch (err: any) {
//       setError(err.message || 'Google login failed. Please try again.');
//     } finally {
//       setGoogleLoading(false);
//     }
//   };

//   // ✅ Handle Phone Reset via WhatsApp
//   const handlePhoneReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setResetError('');
//     setWhatsappMessageSent(false);
//     setResetLoading(true);

//     try {
//       // Validate phone number
//       const cleanPhone = resetPhone.replace(/\s/g, '');
//       if (!/^\d{11}$/.test(cleanPhone)) {
//         setResetError('Please enter a valid 11-digit phone number');
//         setResetLoading(false);
//         return;
//       }

//       // Format phone number for WhatsApp (Pakistan format)
//       const formattedPhone = cleanPhone.substring(1); // Remove first 0
//       const whatsappUrl = `https://wa.me/92${formattedPhone}`;

//       // ✅ Send WhatsApp message
//       const message = `🔐 *Password Reset Request*

// 📱 *Phone Number:* ${cleanPhone}

// 👤 *User:* The owner of this phone number wants to reset their account password.

// ⚠️ *Action Required:* Please verify this request and help the user reset their password.

// 📝 *Request Details:*
// • Phone: ${cleanPhone}
// • Time: ${new Date().toLocaleString()}
// • Status: Pending

// 🔑 *Admin Action Needed:*
// Please check the user's identity and reset their password from the admin panel.`;

//       // Encode message for URL
//       const encodedMessage = encodeURIComponent(message);
//       const fullWhatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;

//       // Open WhatsApp
//       window.open(fullWhatsappUrl, '_blank');
      
//       setWhatsappMessageSent(true);
//       setResetSuccess(true);
      
//       setTimeout(() => {
//         setShowForgotModal(false);
//         setResetSuccess(false);
//         setWhatsappMessageSent(false);
//         setResetPhone('');
//       }, 4000);

//     } catch (err: any) {
//       console.error('Phone reset error:', err);
//       setResetError('Failed to send WhatsApp message. Please try again.');
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   // ✅ Updated Reset Password - Email
//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setResetError('');
//     setResetSuccess(false);
//     setResetLoading(true);

//     try {
//       if (resetMethod === 'email') {
//         if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
//           setResetError('Please enter a valid email address');
//           setResetLoading(false);
//           return;
//         }
        
//         await resetPassword(resetEmail);
//         console.log('✅ Email sent successfully to:', resetEmail);
        
//         const db = getDatabase();
//         const usersRef = ref(db, 'users');
//         const snapshot = await get(usersRef);
        
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           let userUid = null;
          
//           Object.keys(data).forEach((key) => {
//             const userData = data[key];
//             const userEmail = userData.email || '';
//             const phoneEmail = `${userData.phone || ''}@phone.auth`;
            
//             if (userEmail === resetEmail || userEmail === `${resetEmail}@phone.auth` || phoneEmail === resetEmail) {
//               userUid = key;
//             }
//           });
          
//           if (userUid) {
//             await update(ref(db, `users/${userUid}`), {
//               passwordReset: true,
//               passwordResetAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString()
//             });
//             console.log('✅ passwordReset set to TRUE for user:', userUid);
//           } else {
//             console.warn('⚠️ User NOT found in RTDB for email:', resetEmail);
//           }
//         }
        
//         setResetSuccess(true);
//         setTimeout(() => {
//           setShowForgotModal(false);
//           setResetSuccess(false);
//           setResetEmail('');
//           setResetPhone('');
//         }, 3000);
        
//       } else {
//         // Phone method - handled by handlePhoneReset
//         await handlePhoneReset(e);
//       }
//     } catch (err: any) {
//       if (err.code === 'auth/user-not-found') {
//         setResetError('No account found with this email address');
//       } else {
//         setResetError(err.message || 'Failed to send reset email. Please try again.');
//       }
//     } finally {
//       setResetLoading(false);
//     }
//   };

//   // Handle Password Update
//   const handlePasswordUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUpdateError('');
//     setUpdateSuccess(false);
//     setUpdateLoading(true);

//     if (!oldPassword || !newPassword || !confirmPassword) {
//       setUpdateError('Please fill in all fields');
//       setUpdateLoading(false);
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setUpdateError('New passwords do not match');
//       setUpdateLoading(false);
//       return;
//     }

//     if (newPassword.length < 6) {
//       setUpdateError('Password must be at least 6 characters');
//       setUpdateLoading(false);
//       return;
//     }

//     if (oldPassword === newPassword) {
//       setUpdateError('New password must be different from current password');
//       setUpdateLoading(false);
//       return;
//     }

//     try {
//       if (!user) {
//         throw new Error('No user logged in');
//       }

//       await changePasswordWithOld(oldPassword, newPassword);
      
//       const db = getDatabase();
//       const userRef = ref(db, `users/${user.uid}`);
//       await update(userRef, {
//         passwordReset: false,
//         updatedAt: new Date().toISOString()
//       });
//       console.log('✅ passwordReset flag set to FALSE');
      
//       setUpdateSuccess(true);
      
//       setTimeout(() => {
//         setShowPasswordUpdateModal(false);
//         router.push('/');
//       }, 1500);
      
//     } catch (err: any) {
//       console.error('Update password error:', err);
//       setUpdateError(err.message || 'Failed to update password. Please try again.');
//     } finally {
//       setUpdateLoading(false);
//     }
//   };

//   // Show loading state while checking authentication
//   if (isCheckingAuth) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // If user is logged in, don't render the login page
//   if (user && !showPasswordUpdateModal) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex items-center justify-center px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="w-full max-w-md"
//         >
//           <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-center mb-8"
//             >
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-muted-foreground">
//                 Sign in to your M&M Scents account
//               </p>
//             </motion.div>

//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
//               >
//                 <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </motion.div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Email Address or Phone Number
//                 </label>
//                 <div className="relative">
//                   {isPhoneLogin ? (
//                     <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   ) : (
//                     <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   )}
//                   <input
//                     type="text"
//                     name="emailOrPhone"
//                     value={formData.emailOrPhone}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="email@example.com or 03123456789"
//                   />
//                 </div>
//                 {isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📱 Signing in with phone: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//                 {!isPhoneLogin && formData.emailOrPhone && (
//                   <p className="mt-1 text-xs text-green-600">
//                     📧 Signing in with email: <span className="font-bold">{formData.emailOrPhone}</span>
//                   </p>
//                 )}
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                     placeholder="••••••••"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </motion.div>

//               <motion.button
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </motion.button>

//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.45 }}
//                 className="text-right"
//               >
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForgotModal(true);
//                     setResetError('');
//                     setResetSuccess(false);
//                     setResetEmail('');
//                     setResetPhone('');
//                     setWhatsappMessageSent(false);
//                   }}
//                   className="text-sm text-primary hover:text-accent hover:underline transition-colors font-medium"
//                 >
//                   Forgot Password?
//                 </button>
//               </motion.div>
//             </form>

//             {/* Google Login Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               type="button"
//               onClick={handleGoogleLogin}
//               disabled={googleLoading}
//               className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//               {googleLoading ? 'Signing in...' : 'Continue with Google'}
//             </motion.button>

//             {/* Divider */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.6 }}
//               className="my-6 flex items-center gap-4"
//             >
//               <div className="flex-1 h-px bg-border" />
//               <span className="text-sm text-muted-foreground">or</span>
//               <div className="flex-1 h-px bg-border" />
//             </motion.div>

//             {/* Sign Up Link */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="text-center"
//             >
//               <p className="text-muted-foreground text-sm mb-2">
//                 Don&apos;t have an account?
//               </p>
//               <Link href="/signup" className="text-primary font-semibold hover:underline transition-all">
//                 Create one now
//               </Link>
//             </motion.div>
//           </div>

//           {/* Back Home */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//             className="text-center mt-4"
//           >
//             <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
//               ← Back to home
//             </Link>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Forgot Password Modal */}
//       <AnimatePresence>
//         {showForgotModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//             onClick={() => {
//               if (!resetLoading) {
//                 setShowForgotModal(false);
//                 setResetError('');
//                 setResetSuccess(false);
//                 setWhatsappMessageSent(false);
//               }
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
//                     <Key className="w-5 h-5 text-primary" />
//                     Reset Password
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Choose how you want to reset your password
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                       setWhatsappMessageSent(false);
//                     }
//                   }}
//                   className="text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="flex gap-2 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('email');
//                     setResetError('');
//                     setResetSuccess(false);
//                     setWhatsappMessageSent(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'email'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Mail size={16} />
//                   Email
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setResetMethod('phone');
//                     setResetError('');
//                     setResetSuccess(false);
//                     setWhatsappMessageSent(false);
//                   }}
//                   className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     resetMethod === 'phone'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   <Phone size={16} />
//                   Phone
//                 </button>
//               </div>

//               <form onSubmit={resetMethod === 'email' ? handleResetPassword : handlePhoneReset}>
//                 {resetMethod === 'email' ? (
//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-foreground mb-2">
//                         Email Address
//                       </label>
//                       <input
//                         type="email"
//                         value={resetEmail}
//                         onChange={(e) => {
//                           setResetEmail(e.target.value);
//                           setResetError('');
//                           setResetSuccess(false);
//                         }}
//                         className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder="you@example.com"
//                         required
//                         disabled={resetLoading || resetSuccess}
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         We'll send a password reset link to this email
//                       </p>
//                     </div>

//                     {resetError && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
//                       >
//                         <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-red-700 text-sm">{resetError}</p>
//                       </motion.div>
//                     )}

//                     {resetSuccess && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2"
//                       >
//                         <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-green-700 text-sm">
//                           Password reset email sent! Flag set in RTDB.
//                         </p>
//                       </motion.div>
//                     )}

//                     <button
//                       type="submit"
//                       disabled={resetLoading || resetSuccess}
//                       className={`w-full py-2 rounded-lg font-semibold transition-all ${
//                         resetLoading || resetSuccess
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           : 'bg-primary text-white hover:opacity-90'
//                       }`}
//                     >
//                       {resetLoading ? 'Sending...' : 'Send Reset Link'}
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                       <div className="flex items-start gap-3">
//                         <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                         <div>
//                           <p className="text-blue-800 font-medium text-sm">
//                             Phone Reset via WhatsApp
//                           </p>
//                           <p className="text-blue-700 text-sm mt-1">
//                             Enter your phone number and we'll send a reset request to admin via WhatsApp.
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-foreground mb-2">
//                         Phone Number
//                       </label>
//                       <input
//                         type="tel"
//                         value={resetPhone}
//                         onChange={(e) => {
//                           const clean = e.target.value.replace(/\D/g, '');
//                           setResetPhone(clean);
//                           setResetError('');
//                           setWhatsappMessageSent(false);
//                         }}
//                         className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                         placeholder="03123456789"
//                         required
//                         disabled={resetLoading || resetSuccess}
//                         maxLength={11}
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Enter 11-digit phone number (e.g., 03123456789)
//                       </p>
//                     </div>

//                     {resetError && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
//                       >
//                         {resetError}
//                       </motion.div>
//                     )}

//                     {resetSuccess && (
//                       <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
//                       >
//                         <CheckCircle className="w-4 h-4 text-green-500" />
//                         <span>WhatsApp message sent to admin! They will contact you soon.</span>
//                       </motion.div>
//                     )}

//                     <button
//                       type="submit"
//                       disabled={resetLoading || resetSuccess || resetPhone.length !== 11}
//                       className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                         resetLoading || resetSuccess || resetPhone.length !== 11
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                           : 'bg-green-500 text-white hover:bg-green-600'
//                       }`}
//                     >
//                       {resetLoading ? (
//                         <>
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                           Sending...
//                         </>
//                       ) : (
//                         <>
//                           <Send size={18} />
//                           Send WhatsApp Request
//                         </>
//                       )}
//                     </button>

//                     <p className="text-xs text-center text-muted-foreground">
//                       Admin will receive your request on WhatsApp
//                     </p>
//                   </div>
//                 )}
//               </form>

//               <div className="mt-4 text-center">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     if (!resetLoading) {
//                       setShowForgotModal(false);
//                       setResetError('');
//                       setResetSuccess(false);
//                       setWhatsappMessageSent(false);
//                     }
//                   }}
//                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//                 >
//                   ← Back to Login
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Password Update Modal */}
//       <AnimatePresence>
//         {showPasswordUpdateModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
//                     <Key className="w-5 h-5 text-primary" />
//                     Update Password
//                   </h3>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Please update your password to complete the setup.
//                   </p>
//                 </div>
//               </div>

//               <form onSubmit={handlePasswordUpdate} className="space-y-4">
//                 {/* Old Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showOldPassword ? 'text' : 'password'}
//                       value={oldPassword}
//                       onChange={(e) => setOldPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Enter current password"
//                       required
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowOldPassword(!showOldPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showNewPasswordModal ? 'text' : 'password'}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Enter new password (min 6 chars)"
//                       required
//                       minLength={6}
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowNewPasswordModal(!showNewPasswordModal)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showNewPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Confirm Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showConfirmPasswordModal ? 'text' : 'password'}
//                       value={confirmPassword}
//                       onChange={(e) => setConfirmPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                       placeholder="Confirm new password"
//                       required
//                       disabled={updateLoading || updateSuccess}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPasswordModal(!showConfirmPasswordModal)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                     >
//                       {showConfirmPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Password Requirements */}
//                 <div className="text-xs text-muted-foreground space-y-1">
//                   <p className={newPassword.length >= 6 ? 'text-green-600' : ''}>
//                     ✓ At least 6 characters
//                   </p>
//                   <p className={newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : ''}>
//                     ✓ Passwords match
//                   </p>
//                   <p className={oldPassword && newPassword && oldPassword !== newPassword ? 'text-green-600' : ''}>
//                     ✓ Different from current password
//                   </p>
//                 </div>

//                 {updateError && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
//                   >
//                     {updateError}
//                   </motion.div>
//                 )}

//                 {updateSuccess && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
//                   >
//                     <CheckCircle className="w-4 h-4 text-green-500" />
//                     Password updated successfully! Flag reset to false.
//                   </motion.div>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={
//                     updateLoading || 
//                     updateSuccess || 
//                     !oldPassword || 
//                     !newPassword || 
//                     newPassword.length < 6 || 
//                     newPassword !== confirmPassword ||
//                     oldPassword === newPassword
//                   }
//                   className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                     updateLoading || 
//                     updateSuccess || 
//                     !oldPassword || 
//                     !newPassword || 
//                     newPassword.length < 6 || 
//                     newPassword !== confirmPassword ||
//                     oldPassword === newPassword
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
//                   }`}
//                 >
//                   {updateLoading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Updating...
//                     </>
//                   ) : updateSuccess ? (
//                     'Done ✓'
//                   ) : (
//                     'Update Password'
//                   )}
//                 </button>
//               </form>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, AlertCircle, Eye, EyeOff, Phone, Key, X, CheckCircle, Loader2, Send } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { getDatabase, ref, get, update } from 'firebase/database';
import Navbar from '@/components/Navbar';
import toast, { Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const { 
    user, 
    login, 
    loginWithPhone, 
    loginWithGoogle, 
    resetPassword, 
    checkAndUpdateRTDBPassword, 
    updateRTDBPassword,
    changePasswordWithOld
  } = useAuth();
  
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetPhone, setResetPhone] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const [whatsappMessageSent, setWhatsappMessageSent] = useState(false);

  // Password Update Modal States
  const [showPasswordUpdateModal, setShowPasswordUpdateModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [showConfirmPasswordModal, setShowConfirmPasswordModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Redirect Success State
  const [redirectSuccess, setRedirectSuccess] = useState(false);
  const [isRedirectFromReset, setIsRedirectFromReset] = useState(false);

  // Admin WhatsApp Number
  const ADMIN_WHATSAPP = '923111111111';

  // ✅ Show toast if user came from cart page - Click to dismiss
  useEffect(() => {
    const fromCart = new URLSearchParams(window.location.search).get('from');
    
    if (fromCart === 'cart') {
      toast.error('🔒 Please login to view your cart', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '15px',
          cursor: 'pointer',
        },
        icon: '🔒',
        // ✅ Click on toast to dismiss
        onClick: () => {
          toast.dismiss();
        },
      });
    }
  }, []);

  // ✅ Check if user is already logged in and needs password update
  useEffect(() => {
    if (user) {
      const checkRTDB = async () => {
        try {
          const needsUpdate = await checkAndUpdateRTDBPassword(user);
          if (needsUpdate) {
            setShowPasswordUpdateModal(true);
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error checking RTDB:', error);
          router.push('/');
        }
      };
      checkRTDB();
    }
    setIsCheckingAuth(false);
  }, [user, router]);

  // ✅ Handle redirect from Firebase default page - DETECT AND SET FLAG
  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get('mode');
    const apiKey = new URLSearchParams(window.location.search).get('apiKey');
    const oobCode = new URLSearchParams(window.location.search).get('oobCode');
    
    console.log('🔍 URL Params:', { mode, apiKey, oobCode });
    
    if (mode === 'resetPassword' || oobCode || apiKey) {
      console.log('✅ Password reset redirect detected!');
      setRedirectSuccess(true);
      setIsRedirectFromReset(true);
      
      setTimeout(() => {
        window.history.replaceState({}, '', '/login');
      }, 4000);
    }
  }, []);

  // ✅ EXTRA: Check for reset flag after user logs in
  useEffect(() => {
    const checkResetFlag = async () => {
      if (user && isRedirectFromReset) {
        console.log('🔍 Checking reset flag for user:', user.uid);
        try {
          const db = getDatabase();
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            console.log('🔍 User data after login:', userData);
            
            if (userData.passwordReset === true) {
              console.log('✅ passwordReset flag found! Opening modal...');
              setShowPasswordUpdateModal(true);
              setIsRedirectFromReset(false);
            }
          }
        } catch (error) {
          console.error('Error checking reset flag:', error);
        }
      }
    };
    
    checkResetFlag();
  }, [user, isRedirectFromReset]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/\s/g, '');
    setFormData(prev => ({ ...prev, [name]: cleanValue }));
    
    if (name === 'emailOrPhone') {
      if (/^\d{11}$/.test(cleanValue)) {
        setIsPhoneLogin(true);
      } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanValue)) {
        setIsPhoneLogin(false);
      } else {
        setIsPhoneLogin(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.emailOrPhone || !formData.password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const cleanEmailOrPhone = formData.emailOrPhone.replace(/\s/g, '');
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmailOrPhone);
      const isPhone = /^\d{11}$/.test(cleanEmailOrPhone);

      if (isPhone) {
        await loginWithPhone(cleanEmailOrPhone, formData.password);
      } else if (isEmail) {
        await login(cleanEmailOrPhone, formData.password);
      } else {
        setError('Please enter a valid email or 11-digit phone number');
        setLoading(false);
        return;
      }

    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Handle Phone Reset via WhatsApp
  const handlePhoneReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setWhatsappMessageSent(false);
    setResetLoading(true);

    try {
      const cleanPhone = resetPhone.replace(/\s/g, '');
      if (!/^\d{11}$/.test(cleanPhone)) {
        setResetError('Please enter a valid 11-digit phone number');
        setResetLoading(false);
        return;
      }

      const message = `🔐 *Password Reset Request*

📱 *Phone Number:* ${cleanPhone}

👤 *User:* The owner of this phone number wants to reset their account password.

⚠️ *Action Required:* Please verify this request and help the user reset their password.

📝 *Request Details:*
• Phone: ${cleanPhone}
• Time: ${new Date().toLocaleString()}
• Status: Pending

🔑 *Admin Action Needed:*
Please check the user's identity and reset their password from the admin panel.`;

      const encodedMessage = encodeURIComponent(message);
      const fullWhatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`;

      window.open(fullWhatsappUrl, '_blank');
      
      setWhatsappMessageSent(true);
      setResetSuccess(true);
      
      setTimeout(() => {
        setShowForgotModal(false);
        setResetSuccess(false);
        setWhatsappMessageSent(false);
        setResetPhone('');
      }, 4000);

    } catch (err: any) {
      console.error('Phone reset error:', err);
      setResetError('Failed to send WhatsApp message. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  // Updated Reset Password - Email
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    setResetLoading(true);

    try {
      if (resetMethod === 'email') {
        if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
          setResetError('Please enter a valid email address');
          setResetLoading(false);
          return;
        }
        
        await resetPassword(resetEmail);
        console.log('✅ Email sent successfully to:', resetEmail);
        
        const db = getDatabase();
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          let userUid = null;
          
          Object.keys(data).forEach((key) => {
            const userData = data[key];
            const userEmail = userData.email || '';
            const phoneEmail = `${userData.phone || ''}@phone.auth`;
            
            if (userEmail === resetEmail || userEmail === `${resetEmail}@phone.auth` || phoneEmail === resetEmail) {
              userUid = key;
            }
          });
          
          if (userUid) {
            await update(ref(db, `users/${userUid}`), {
              passwordReset: true,
              passwordResetAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            console.log('✅ passwordReset set to TRUE for user:', userUid);
          } else {
            console.warn('⚠️ User NOT found in RTDB for email:', resetEmail);
          }
        }
        
        setResetSuccess(true);
        setTimeout(() => {
          setShowForgotModal(false);
          setResetSuccess(false);
          setResetEmail('');
          setResetPhone('');
        }, 3000);
        
      } else {
        await handlePhoneReset(e);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setResetError('No account found with this email address');
      } else {
        setResetError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);
    setUpdateLoading(true);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setUpdateError('Please fill in all fields');
      setUpdateLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setUpdateError('New passwords do not match');
      setUpdateLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setUpdateError('Password must be at least 6 characters');
      setUpdateLoading(false);
      return;
    }

    if (oldPassword === newPassword) {
      setUpdateError('New password must be different from current password');
      setUpdateLoading(false);
      return;
    }

    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      await changePasswordWithOld(oldPassword, newPassword);
      
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        passwordReset: false,
        updatedAt: new Date().toISOString()
      });
      console.log('✅ passwordReset flag set to FALSE');
      
      setUpdateSuccess(true);
      
      setTimeout(() => {
        setShowPasswordUpdateModal(false);
        router.push('/');
      }, 1500);
      
    } catch (err: any) {
      console.error('Update password error:', err);
      setUpdateError(err.message || 'Failed to update password. Please try again.');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in, don't render the login page
  if (user && !showPasswordUpdateModal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Toaster Component */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
            cursor: 'pointer',
          },
        }}
      />

      <div className="flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to your M&M Scents account
              </p>
            </motion.div>

            {/* Redirect Success Message */}
            {redirectSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-700 font-semibold">✅ Password reset successfully!</p>
                  <p className="text-green-600 text-sm mt-1">Please login with your new password.</p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  {isPhoneLogin ? (
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  )}
                  <input
                    type="text"
                    name="emailOrPhone"
                    value={formData.emailOrPhone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="email@example.com or 03123456789"
                  />
                </div>
                {isPhoneLogin && formData.emailOrPhone && (
                  <p className="mt-1 text-xs text-green-600">
                    📱 Signing in with phone: <span className="font-bold">{formData.emailOrPhone}</span>
                  </p>
                )}
                {!isPhoneLogin && formData.emailOrPhone && (
                  <p className="mt-1 text-xs text-green-600">
                    📧 Signing in with email: <span className="font-bold">{formData.emailOrPhone}</span>
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </motion.button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-right"
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setResetError('');
                    setResetSuccess(false);
                    setResetEmail('');
                    setResetPhone('');
                    setWhatsappMessageSent(false);
                  }}
                  className="text-sm text-primary hover:text-accent hover:underline transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </motion.div>
            </form>

            {/* Google Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-white border-2 border-border text-foreground py-2 rounded-lg font-semibold hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </motion.button>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="my-6 flex items-center gap-4"
            >
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-muted-foreground text-sm mb-2">
                Don&apos;t have an account?
              </p>
              <Link href="/signup" className="text-primary font-semibold hover:underline transition-all">
                Create one now
              </Link>
            </motion.div>
          </div>

          {/* Back Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-4"
          >
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              ← Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!resetLoading) {
                setShowForgotModal(false);
                setResetError('');
                setResetSuccess(false);
                setWhatsappMessageSent(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Reset Password
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose how you want to reset your password
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!resetLoading) {
                      setShowForgotModal(false);
                      setResetError('');
                      setResetSuccess(false);
                      setWhatsappMessageSent(false);
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setResetMethod('email');
                    setResetError('');
                    setResetSuccess(false);
                    setWhatsappMessageSent(false);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    resetMethod === 'email'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-secondary text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Mail size={16} />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResetMethod('phone');
                    setResetError('');
                    setResetSuccess(false);
                    setWhatsappMessageSent(false);
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    resetMethod === 'phone'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-secondary text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Phone size={16} />
                  Phone
                </button>
              </div>

              <form onSubmit={resetMethod === 'email' ? handleResetPassword : handlePhoneReset}>
                {resetMethod === 'email' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          setResetError('');
                          setResetSuccess(false);
                        }}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="you@example.com"
                        required
                        disabled={resetLoading || resetSuccess}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        We'll send a password reset link to this email
                      </p>
                    </div>

                    {resetError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
                      >
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">{resetError}</p>
                      </motion.div>
                    )}

                    {resetSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <p className="text-green-700 text-sm">
                          Password reset email sent! Flag set in RTDB.
                        </p>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading || resetSuccess}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        resetLoading || resetSuccess
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:opacity-90'
                      }`}
                    >
                      {resetLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-800 font-medium text-sm">
                            Phone Reset via WhatsApp
                          </p>
                          <p className="text-blue-700 text-sm mt-1">
                            Enter your phone number and we'll send a reset request to admin via WhatsApp.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={resetPhone}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, '');
                          setResetPhone(clean);
                          setResetError('');
                          setWhatsappMessageSent(false);
                        }}
                        className="w-full px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="03123456789"
                        required
                        disabled={resetLoading || resetSuccess}
                        maxLength={11}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter 11-digit phone number (e.g., 03123456789)
                      </p>
                    </div>

                    {resetError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                      >
                        {resetError}
                      </motion.div>
                    )}

                    {resetSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>WhatsApp message sent to admin! They will contact you soon.</span>
                      </motion.div>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading || resetSuccess || resetPhone.length !== 11}
                      className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        resetLoading || resetSuccess || resetPhone.length !== 11
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {resetLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} />
                          Send WhatsApp Request
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-muted-foreground">
                      Admin will receive your request on WhatsApp
                    </p>
                  </div>
                )}
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (!resetLoading) {
                      setShowForgotModal(false);
                      setResetError('');
                      setResetSuccess(false);
                      setWhatsappMessageSent(false);
                    }
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Update Modal */}
      <AnimatePresence>
        {showPasswordUpdateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" />
                    Update Password
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please update your password to complete the setup.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                {/* Old Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter current password"
                      required
                      disabled={updateLoading || updateSuccess}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPasswordModal ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter new password (min 6 chars)"
                      required
                      minLength={6}
                      disabled={updateLoading || updateSuccess}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPasswordModal(!showNewPasswordModal)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPasswordModal ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 pr-12 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Confirm new password"
                      required
                      disabled={updateLoading || updateSuccess}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPasswordModal(!showConfirmPasswordModal)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPasswordModal ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className={newPassword.length >= 6 ? 'text-green-600' : ''}>
                    ✓ At least 6 characters
                  </p>
                  <p className={newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : ''}>
                    ✓ Passwords match
                  </p>
                  <p className={oldPassword && newPassword && oldPassword !== newPassword ? 'text-green-600' : ''}>
                    ✓ Different from current password
                  </p>
                </div>

                {updateError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    {updateError}
                  </motion.div>
                )}

                {updateSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Password updated successfully! Flag reset to false.
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={
                    updateLoading || 
                    updateSuccess || 
                    !oldPassword || 
                    !newPassword || 
                    newPassword.length < 6 || 
                    newPassword !== confirmPassword ||
                    oldPassword === newPassword
                  }
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    updateLoading || 
                    updateSuccess || 
                    !oldPassword || 
                    !newPassword || 
                    newPassword.length < 6 || 
                    newPassword !== confirmPassword ||
                    oldPassword === newPassword
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
                  }`}
                >
                  {updateLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : updateSuccess ? (
                    'Done ✓'
                  ) : (
                    'Update Password'
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}