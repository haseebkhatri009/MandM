// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';
// import { rtdb, auth } from '@/lib/firebase';
// import { ref, onValue, get } from 'firebase/database';
// import { Package, ShoppingCart, TrendingUp, Settings, Clock, CheckCircle, Users, X } from 'lucide-react';
// import Link from 'next/link';

// interface DashboardStats {
//   totalProducts: number;
//   totalOrders: number;
//   earnedRevenue: number;     // Only confirmed orders
//   pendingRevenue: number;    // Pending, Shipped, Delivered orders
//   pendingOrders: number;     // Only 'pending, shipped and delivered' status
//   confirmedOrders: number;   // Count of confirmed orders
// }

// interface UserData {
//   uid: string;
//   email: string;
//   phone: string;           // ✅ Phone number from RTDB
//   phoneNumber?: string;    // ✅ Fallback
//   displayName?: string;
//   name?: string;
//   createdAt: string;
// }

// // Only "confirmed" status counts as earned revenue
// const CONFIRMED_STATUS = 'confirmed';
// // Statuses that count as pending revenue (all except confirmed and cancelled)
// const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// export default function AdminDashboard() {
//   const { user, isAdmin, loading: authLoading, userData } = useAuth();
//   const router = useRouter();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProducts: 0,
//     totalOrders: 0,
//     earnedRevenue: 0,
//     pendingRevenue: 0,
//     pendingOrders: 0,
//     confirmedOrders: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [showUsersModal, setShowUsersModal] = useState(false);
//   const [usersLoading, setUsersLoading] = useState(false);

//   // Check admin access - wait for auth to load first
//   useEffect(() => {
//     if (authLoading) return;

//     console.log('[v0] Admin check:', { user: user?.email, isAdmin, userData });
    
//     if (!user) {
//       console.log('[v0] No user, redirecting to login');
//       router.push('/login');
//     } else if (!isAdmin) {
//       console.log('[v0] Not admin, redirecting to home');
//       router.push('/');
//     } else {
//       console.log('[v0] Admin access granted');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch statistics from RTDB
//   useEffect(() => {
//     if (!isAdmin) return;

//     // Fetch products
//     const productsRef = ref(rtdb, 'products');
//     const productsUnsubscribe = onValue(productsRef, (snapshot) => {
//       const productCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
//       setStats(prev => ({ ...prev, totalProducts: productCount }));
//     });

//     // Fetch orders
//     const ordersRef = ref(rtdb, 'orders');
//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const orders = Object.values(data) as any[];
//         const totalOrders = orders.length;
//         let earnedRevenue = 0;
//         let pendingRevenue = 0;
//         let pendingOrders = 0;
//         let confirmedOrders = 0;

//         orders.forEach((order) => {
//           // Skip cancelled orders
//           if (order.status === 'cancelled') return;

//           // Earned Revenue: ONLY "confirmed" orders
//           if (order.status === CONFIRMED_STATUS) {
//             earnedRevenue += order.total || 0;
//             confirmedOrders++;
//           } 
//           // Pending Revenue: "pending", "shipped", "delivered" orders
//           else if (PENDING_STATUSES.includes(order.status)) {
//             pendingRevenue += order.total || 0;
//           }

//           // Pending orders count (pending, shipped, delivered)
//           if (PENDING_STATUSES.includes(order.status)) {
//             pendingOrders++;
//           }
//         });

//         setStats(prev => ({
//           ...prev,
//           totalOrders,
//           earnedRevenue,
//           pendingRevenue,
//           pendingOrders,
//           confirmedOrders
//         }));
//       } else {
//         setStats(prev => ({
//           ...prev,
//           totalOrders: 0,
//           earnedRevenue: 0,
//           pendingRevenue: 0,
//           pendingOrders: 0,
//           confirmedOrders: 0
//         }));
//       }
//       setLoading(false);
//     });

//     return () => {
//       productsUnsubscribe();
//       ordersUnsubscribe();
//     };
//   }, [isAdmin]);

//   // Format date function
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '—';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '—';
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return '—';
//     }
//   };

//   // Extract phone number from email if it's a phone user
//   const extractPhoneFromEmail = (email: string): string => {
//     if (!email) return '';
//     if (email.endsWith('@phone.auth')) {
//       return email.replace('@phone.auth', '');
//     }
//     return '';
//   };

//   // Fetch all users from Firebase Auth and RTDB
//   const fetchAllUsers = async () => {
//     setUsersLoading(true);
//     try {
//       // First, try to get users from RTDB users node
//       const usersRef = ref(rtdb, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const userList: UserData[] = Object.keys(data).map((key) => {
//           const userData = data[key];
//           const email = userData.email || '';
          
//           // ✅ Extract phone number from email if it's a phone user
//           let phoneNumber = userData.phone || userData.phoneNumber || '';
//           if (!phoneNumber && email.endsWith('@phone.auth')) {
//             phoneNumber = email.replace('@phone.auth', '');
//           }
          
//           return {
//             uid: key,
//             email: email,
//             phone: phoneNumber,  // ✅ Phone number set karo
//             phoneNumber: phoneNumber,
//             displayName: userData.name || userData.displayName || '',
//             name: userData.name || userData.displayName || '',
//             createdAt: userData.createdAt || userData.metadata?.createdAt || new Date().toISOString()
//           };
//         });
//         setUsers(userList);
//       } else {
//         // If no users in RTDB, try to get from Firebase Auth (via API)
//         const response = await fetch('/api/admin/users');
//         if (response.ok) {
//           const data = await response.json();
//           setUsers(data.users || []);
//         } else {
//           console.error('Failed to fetch users');
//           setUsers([]);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setUsers([]);
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const handleViewUsers = () => {
//     setShowUsersModal(true);
//     fetchAllUsers();
//   };

//   // Show loading while auth is being checked
//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Navbar />
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Redirect happens via useEffect, show blank while redirecting
//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Header */}
//       <section className="bg-secondary border-b border-border py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here&apos;s your M&M Scents overview</p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//               <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
//             </div>
//           ) : (
//             <>
//               {/* Stats Grid - 6 Cards */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
//               >
//                 {/* Total Products */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Products</h3>
//                     <Package className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Products in catalog</p>
//                 </motion.div>

//                 {/* Total Orders */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">All time orders</p>
//                 </motion.div>

//                 {/* Earned Revenue - Only Confirmed Orders */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-green-700">💰 Earned Revenue</h3>
//                     <TrendingUp className="w-5 h-5 text-green-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-800">₹{Math.round(stats.earnedRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-green-600 mt-2">
//                     {stats.confirmedOrders} confirmed orders
//                   </p>
//                   <p className="text-xs text-green-600">(Earned from confirmed orders)</p>
//                 </motion.div>

//                 {/* Pending Revenue - Pending, Shipped, Delivered Orders */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-yellow-700">⏳ Pending Revenue</h3>
//                     <Clock className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-800">₹{Math.round(stats.pendingRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-yellow-600 mt-2">
//                     {stats.pendingOrders} pending orders
//                   </p>
//                   <p className="text-xs text-yellow-600">(Pending, Shipped, Delivered)</p>
//                 </motion.div>

//                 {/* Confirmed Orders Count */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Confirmed Orders</h3>
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Confirmed orders</p>
//                 </motion.div>

//                 {/* Pending Orders Count - Pending, Shipped, Delivered */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Pending Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-yellow-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Pending, Shipped, Delivered</p>
//                 </motion.div>
//               </motion.div>

//               {/* Quick Actions */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
//               >
//                 {/* Manage Products */}
//                 <Link
//                   href="/admin/products"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
//                       <p className="text-sm text-muted-foreground">Add, edit or delete</p>
//                     </div>
//                     <Package className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {stats.totalProducts} products
//                   </p>
//                 </Link>

//                 {/* Manage Orders */}
//                 <Link
//                   href="/admin/orders"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Orders</h3>
//                       <p className="text-sm text-muted-foreground">View & update</p>
//                     </div>
//                     <ShoppingCart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground text-yellow-600 font-semibold">
//                     {stats.pendingOrders} pending
//                   </p>
//                 </Link>

//                 {/* Store Settings */}
//                 <Link
//                   href="/admin/settings"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Store Settings</h3>
//                       <p className="text-sm text-muted-foreground">Banner & charges</p>
//                     </div>
//                     <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">Customize store</p>
//                 </Link>

//                 {/* Quick Stats */}
//                 <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Quick Stats</h3>
//                       <p className="text-sm text-muted-foreground">Summary view</p>
//                     </div>
//                     <TrendingUp className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-xs space-y-1 text-muted-foreground">
//                     <p>✓ {stats.totalOrders} total orders</p>
//                     <p>✓ {stats.confirmedOrders} confirmed</p>
//                     <p>✓ {stats.pendingOrders} pending</p>
//                     <p>✓ {stats.totalProducts} products</p>
//                   </div>
//                 </div>

//                 {/* View All Users Button */}
//                 <motion.button
//                   onClick={handleViewUsers}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 border border-purple-400 hover:shadow-xl transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-white mb-1">All Users</h3>
//                       <p className="text-sm text-purple-100">View all registered users</p>
//                     </div>
//                     <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-purple-100">
//                     Click to view users list
//                   </p>
//                 </motion.button>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Users Modal */}
//       {showUsersModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowUsersModal(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl"
//           >
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold text-white">Registered Users</h2>
//                 <p className="text-sm text-purple-100 mt-1">All users who have created accounts</p>
//               </div>
//               <motion.button
//                 onClick={() => setShowUsersModal(false)}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-white hover:text-purple-200 transition-colors"
//               >
//                 <X size={28} />
//               </motion.button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//               {usersLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//                   <p className="mt-4 text-gray-500">Loading users...</p>
//                 </div>
//               ) : users.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                       <tr>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Account Created</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {users.map((user, index) => (
//                         <motion.tr
//                           key={user.uid}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
//                           <td className="py-3 px-4 text-sm text-gray-700 font-medium">
//                             {user.email || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {user.name || user.displayName || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600 font-mono">
//                             {user.phone || user.phoneNumber || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {formatDate(user.createdAt)}
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No users found</p>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
//               <p className="text-sm text-gray-500">Total: {users.length} users</p>
//               <motion.button
//                 onClick={() => setShowUsersModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents Admin Panel. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }











//admin all user  change password

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';
// import { rtdb, auth } from '@/lib/firebase';
// import { ref, onValue, get, update } from 'firebase/database';
// import { 
//   Package, ShoppingCart, TrendingUp, Settings, Clock, 
//   CheckCircle, Users, X, Key, Eye, EyeOff, Loader2 
// } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// interface DashboardStats {
//   totalProducts: number;
//   totalOrders: number;
//   earnedRevenue: number;
//   pendingRevenue: number;
//   pendingOrders: number;
//   confirmedOrders: number;
// }

// interface UserData {
//   uid: string;
//   email: string;
//   phone: string;
//   phoneNumber?: string;
//   displayName?: string;
//   name?: string;
//   createdAt: string;
//   isAdmin?: boolean;
// }

// const CONFIRMED_STATUS = 'confirmed';
// const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// export default function AdminDashboard() {
//   const { user, isAdmin, loading: authLoading, userData } = useAuth();
//   const router = useRouter();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProducts: 0,
//     totalOrders: 0,
//     earnedRevenue: 0,
//     pendingRevenue: 0,
//     pendingOrders: 0,
//     confirmedOrders: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [showUsersModal, setShowUsersModal] = useState(false);
//   const [usersLoading, setUsersLoading] = useState(false);
  
//   // Change Password States
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [passwordLoading, setPasswordLoading] = useState(false);
//   const [passwordError, setPasswordError] = useState('');

//   // Check admin access
//   useEffect(() => {
//     if (authLoading) return;

//     console.log('[v0] Admin check:', { user: user?.email, isAdmin, userData });
    
//     if (!user) {
//       console.log('[v0] No user, redirecting to login');
//       router.push('/login');
//     } else if (!isAdmin) {
//       console.log('[v0] Not admin, redirecting to home');
//       router.push('/');
//     } else {
//       console.log('[v0] Admin access granted');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch statistics from RTDB
//   useEffect(() => {
//     if (!isAdmin) return;

//     const productsRef = ref(rtdb, 'products');
//     const productsUnsubscribe = onValue(productsRef, (snapshot) => {
//       const productCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
//       setStats(prev => ({ ...prev, totalProducts: productCount }));
//     });

//     const ordersRef = ref(rtdb, 'orders');
//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const orders = Object.values(data) as any[];
//         const totalOrders = orders.length;
//         let earnedRevenue = 0;
//         let pendingRevenue = 0;
//         let pendingOrders = 0;
//         let confirmedOrders = 0;

//         orders.forEach((order) => {
//           if (order.status === 'cancelled') return;

//           if (order.status === CONFIRMED_STATUS) {
//             earnedRevenue += order.total || 0;
//             confirmedOrders++;
//           } else if (PENDING_STATUSES.includes(order.status)) {
//             pendingRevenue += order.total || 0;
//           }

//           if (PENDING_STATUSES.includes(order.status)) {
//             pendingOrders++;
//           }
//         });

//         setStats(prev => ({
//           ...prev,
//           totalOrders,
//           earnedRevenue,
//           pendingRevenue,
//           pendingOrders,
//           confirmedOrders
//         }));
//       } else {
//         setStats(prev => ({
//           ...prev,
//           totalOrders: 0,
//           earnedRevenue: 0,
//           pendingRevenue: 0,
//           pendingOrders: 0,
//           confirmedOrders: 0
//         }));
//       }
//       setLoading(false);
//     });

//     return () => {
//       productsUnsubscribe();
//       ordersUnsubscribe();
//     };
//   }, [isAdmin]);

//   // Format date function
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '—';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '—';
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return '—';
//     }
//   };

//   // Fetch all users from RTDB
//   const fetchAllUsers = async () => {
//     setUsersLoading(true);
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const userList: UserData[] = Object.keys(data).map((key) => {
//           const userData = data[key];
//           const email = userData.email || '';
          
//           let phoneNumber = userData.phone || userData.phoneNumber || '';
//           if (!phoneNumber && email.endsWith('@phone.auth')) {
//             phoneNumber = email.replace('@phone.auth', '');
//           }
          
//           return {
//             uid: key,
//             email: email,
//             phone: phoneNumber,
//             phoneNumber: phoneNumber,
//             displayName: userData.name || userData.displayName || '',
//             name: userData.name || userData.displayName || '',
//             createdAt: userData.createdAt || new Date().toISOString(),
//             isAdmin: userData.isAdmin || false
//           };
//         });
//         setUsers(userList);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setUsers([]);
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const handleViewUsers = () => {
//     setShowUsersModal(true);
//     fetchAllUsers();
//   };

//   // Open change password modal
//   const handleChangePasswordClick = (user: UserData) => {
//     setSelectedUser(user);
//     setNewPassword('');
//     setConfirmPassword('');
//     setPasswordError('');
//     setShowPasswordModal(true);
//   };

//   // Change password for user
//   const handleChangePassword = async () => {
//     // Validation
//     if (!newPassword || newPassword.length < 6) {
//       setPasswordError('Password must be at least 6 characters');
//       return;
//     }
//     if (newPassword !== confirmPassword) {
//       setPasswordError('Passwords do not match');
//       return;
//     }

//     setPasswordLoading(true);
//     setPasswordError('');

//     try {
//       const response = await fetch('/api/admin/change-password', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           uid: selectedUser?.uid,
//           email: selectedUser?.email,
//           newPassword: newPassword,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to change password');
//       }

//       // Update password in RTDB as well
//       if (selectedUser) {
//         const userRef = ref(rtdb, `users/${selectedUser.uid}`);
//         await update(userRef, {
//           password: newPassword,
//           updatedAt: new Date().toISOString()
//         });
//       }

//       await Swal.fire({
//         icon: 'success',
//         title: 'Password Changed!',
//         text: `Password for ${selectedUser?.email || selectedUser?.phone || 'user'} has been changed successfully.`,
//         timer: 2000,
//         showConfirmButton: false
//       });

//       setShowPasswordModal(false);
//       setSelectedUser(null);
//       setNewPassword('');
//       setConfirmPassword('');

//     } catch (error: any) {
//       console.error('Error changing password:', error);
//       setPasswordError(error.message || 'Failed to change password. Please try again.');
//     } finally {
//       setPasswordLoading(false);
//     }
//   };

//   // Show loading while auth is being checked
//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Navbar />
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Redirect happens via useEffect, show blank while redirecting
//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Header */}
//       <section className="bg-secondary border-b border-border py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here&apos;s your M&M Scents overview</p>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//               <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
//             </div>
//           ) : (
//             <>
//               {/* Stats Grid - 6 Cards */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
//               >
//                 {/* Total Products */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Products</h3>
//                     <Package className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Products in catalog</p>
//                 </motion.div>

//                 {/* Total Orders */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">All time orders</p>
//                 </motion.div>

//                 {/* Earned Revenue */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-green-700">💰 Earned Revenue</h3>
//                     <TrendingUp className="w-5 h-5 text-green-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-800">₹{Math.round(stats.earnedRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-green-600 mt-2">
//                     {stats.confirmedOrders} confirmed orders
//                   </p>
//                   <p className="text-xs text-green-600">(Earned from confirmed orders)</p>
//                 </motion.div>

//                 {/* Pending Revenue */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-yellow-700">⏳ Pending Revenue</h3>
//                     <Clock className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-800">₹{Math.round(stats.pendingRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-yellow-600 mt-2">
//                     {stats.pendingOrders} pending orders
//                   </p>
//                   <p className="text-xs text-yellow-600">(Pending, Shipped, Delivered)</p>
//                 </motion.div>

//                 {/* Confirmed Orders */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Confirmed Orders</h3>
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Confirmed orders</p>
//                 </motion.div>

//                 {/* Pending Orders */}
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Pending Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-yellow-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Pending, Shipped, Delivered</p>
//                 </motion.div>
//               </motion.div>

//               {/* Quick Actions */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
//               >
//                 <Link
//                   href="/admin/products"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
//                       <p className="text-sm text-muted-foreground">Add, edit or delete</p>
//                     </div>
//                     <Package className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">{stats.totalProducts} products</p>
//                 </Link>

//                 <Link
//                   href="/admin/orders"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Orders</h3>
//                       <p className="text-sm text-muted-foreground">View & update</p>
//                     </div>
//                     <ShoppingCart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground text-yellow-600 font-semibold">
//                     {stats.pendingOrders} pending
//                   </p>
//                 </Link>

//                 <Link
//                   href="/admin/settings"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Store Settings</h3>
//                       <p className="text-sm text-muted-foreground">Banner & charges</p>
//                     </div>
//                     <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">Customize store</p>
//                 </Link>

//                 <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Quick Stats</h3>
//                       <p className="text-sm text-muted-foreground">Summary view</p>
//                     </div>
//                     <TrendingUp className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-xs space-y-1 text-muted-foreground">
//                     <p>✓ {stats.totalOrders} total orders</p>
//                     <p>✓ {stats.confirmedOrders} confirmed</p>
//                     <p>✓ {stats.pendingOrders} pending</p>
//                     <p>✓ {stats.totalProducts} products</p>
//                   </div>
//                 </div>

//                 {/* View All Users Button */}
//                 <motion.button
//                   onClick={handleViewUsers}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 border border-purple-400 hover:shadow-xl transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-white mb-1">All Users</h3>
//                       <p className="text-sm text-purple-100">View all registered users</p>
//                     </div>
//                     <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-purple-100">Click to view users list</p>
//                 </motion.button>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Users Modal with Change Password */}
//       {showUsersModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => {
//             if (!passwordLoading) {
//               setShowUsersModal(false);
//             }
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl"
//           >
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold text-white">Registered Users</h2>
//                 <p className="text-sm text-purple-100 mt-1">All users who have created accounts</p>
//               </div>
//               <motion.button
//                 onClick={() => {
//                   setShowUsersModal(false);
//                   setShowPasswordModal(false);
//                 }}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-white hover:text-purple-200 transition-colors"
//               >
//                 <X size={28} />
//               </motion.button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//               {usersLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//                   <p className="mt-4 text-gray-500">Loading users...</p>
//                 </div>
//               ) : users.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                       <tr>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email / Phone</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
//                         <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {users.map((user, index) => (
//                         <motion.tr
//                           key={user.uid}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
//                           <td className="py-3 px-4 text-sm text-gray-700 font-medium">
//                             {user.email || user.phone || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {user.name || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm">
//                             {user.isAdmin ? (
//                               <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Admin</span>
//                             ) : (
//                               <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold">User</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {formatDate(user.createdAt)}
//                           </td>
//                           <td className="py-3 px-4 text-center">
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleChangePasswordClick(user)}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//                             >
//                               <Key size={14} />
//                               Change Password
//                             </motion.button>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No users found</p>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
//               <p className="text-sm text-gray-500">Total: {users.length} users</p>
//               <motion.button
//                 onClick={() => setShowUsersModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Change Password Modal */}
//       <AnimatePresence>
//         {showPasswordModal && selectedUser && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
//             onClick={() => {
//               if (!passwordLoading) {
//                 setShowPasswordModal(false);
//                 setSelectedUser(null);
//               }
//             }}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-gray-200"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <div>
//                   <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                     <Key className="w-5 h-5 text-blue-500" />
//                     Change Password
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     User: <span className="font-semibold text-gray-700">{selectedUser.email || selectedUser.phone || selectedUser.name}</span>
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     if (!passwordLoading) {
//                       setShowPasswordModal(false);
//                       setSelectedUser(null);
//                     }
//                   }}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {/* New Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       value={newPassword}
//                       onChange={(e) => setNewPassword(e.target.value)}
//                       className="w-full px-4 pr-12 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Enter new password (min 6 chars)"
//                       disabled={passwordLoading}
//                       minLength={6}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Confirm Password
//                   </label>
//                   <input
//                     type="password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                     className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Confirm new password"
//                     disabled={passwordLoading}
//                   />
//                 </div>

//                 {/* Password Requirements */}
//                 <div className="text-xs text-gray-500 space-y-1">
//                   <p className={newPassword.length >= 6 ? 'text-green-600' : ''}>
//                     ✓ At least 6 characters
//                   </p>
//                   <p className={newPassword === confirmPassword && newPassword.length > 0 ? 'text-green-600' : ''}>
//                     ✓ Passwords match
//                   </p>
//                 </div>

//                 {passwordError && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
//                   >
//                     <span className="text-red-500 text-sm">⚠️</span>
//                     <p className="text-red-700 text-sm">{passwordError}</p>
//                   </motion.div>
//                 )}

//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowPasswordModal(false);
//                       setSelectedUser(null);
//                     }}
//                     className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                     disabled={passwordLoading}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleChangePassword}
//                     disabled={passwordLoading || !newPassword || newPassword.length < 6 || newPassword !== confirmPassword}
//                     className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                       passwordLoading || !newPassword || newPassword.length < 6 || newPassword !== confirmPassword
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
//                     }`}
//                   >
//                     {passwordLoading ? (
//                       <>
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                         Changing...
//                       </>
//                     ) : (
//                       <>
//                         <Key size={16} />
//                         Change Password
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents Admin Panel. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }







//update user password in rtdb adn without resetPassword true or false
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';
// import { rtdb, auth } from '@/lib/firebase';
// import { ref, onValue, get, update, set } from 'firebase/database';
// import { 
//   Package, ShoppingCart, TrendingUp, Settings, Clock, 
//   CheckCircle, Users, X, Key, Eye, EyeOff, Loader2, User, Mail, Phone, Calendar 
// } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// interface DashboardStats {
//   totalProducts: number;
//   totalOrders: number;
//   earnedRevenue: number;
//   pendingRevenue: number;
//   pendingOrders: number;
//   confirmedOrders: number;
// }

// interface UserData {
//   uid: string;
//   email: string;
//   phone: string;
//   phoneNumber?: string;
//   displayName?: string;
//   name?: string;
//   createdAt: string;
//   isAdmin?: boolean;
//   password?: string;
//   loginMethod?: 'email' | 'phone' | 'google'; // ✅ ADDED
// }

// const CONFIRMED_STATUS = 'confirmed';
// const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// export default function AdminDashboard() {
//   const { user, isAdmin, loading: authLoading, userData } = useAuth();
//   const router = useRouter();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProducts: 0,
//     totalOrders: 0,
//     earnedRevenue: 0,
//     pendingRevenue: 0,
//     pendingOrders: 0,
//     confirmedOrders: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [showUsersModal, setShowUsersModal] = useState(false);
//   const [usersLoading, setUsersLoading] = useState(false);
  
//   // ✅ User Detail Modal States
//   const [showUserDetailModal, setShowUserDetailModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
//   // ✅ Show/Hide Password State
//   const [showPassword, setShowPassword] = useState(false);

//   // Check admin access
//   useEffect(() => {
//     if (authLoading) return;

//     console.log('[v0] Admin check:', { user: user?.email, isAdmin, userData });
    
//     if (!user) {
//       console.log('[v0] No user, redirecting to login');
//       router.push('/login');
//     } else if (!isAdmin) {
//       console.log('[v0] Not admin, redirecting to home');
//       router.push('/');
//     } else {
//       console.log('[v0] Admin access granted');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch statistics from RTDB
//   useEffect(() => {
//     if (!isAdmin) return;

//     const productsRef = ref(rtdb, 'products');
//     const productsUnsubscribe = onValue(productsRef, (snapshot) => {
//       const productCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
//       setStats(prev => ({ ...prev, totalProducts: productCount }));
//     });

//     const ordersRef = ref(rtdb, 'orders');
//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const orders = Object.values(data) as any[];
//         const totalOrders = orders.length;
//         let earnedRevenue = 0;
//         let pendingRevenue = 0;
//         let pendingOrders = 0;
//         let confirmedOrders = 0;

//         orders.forEach((order) => {
//           if (order.status === 'cancelled') return;

//           if (order.status === CONFIRMED_STATUS) {
//             earnedRevenue += order.total || 0;
//             confirmedOrders++;
//           } else if (PENDING_STATUSES.includes(order.status)) {
//             pendingRevenue += order.total || 0;
//           }

//           if (PENDING_STATUSES.includes(order.status)) {
//             pendingOrders++;
//           }
//         });

//         setStats(prev => ({
//           ...prev,
//           totalOrders,
//           earnedRevenue,
//           pendingRevenue,
//           pendingOrders,
//           confirmedOrders
//         }));
//       } else {
//         setStats(prev => ({
//           ...prev,
//           totalOrders: 0,
//           earnedRevenue: 0,
//           pendingRevenue: 0,
//           pendingOrders: 0,
//           confirmedOrders: 0
//         }));
//       }
//       setLoading(false);
//     });

//     return () => {
//       productsUnsubscribe();
//       ordersUnsubscribe();
//     };
//   }, [isAdmin]);

//   // Format date function
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '—';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '—';
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return '—';
//     }
//   };

//   // Fetch all users from RTDB
//   const fetchAllUsers = async () => {
//     setUsersLoading(true);
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const userList: UserData[] = Object.keys(data).map((key) => {
//           const userData = data[key];
//           const email = userData.email || '';
          
//           let phoneNumber = userData.phone || userData.phoneNumber || '';
//           if (!phoneNumber && email.endsWith('@phone.auth')) {
//             phoneNumber = email.replace('@phone.auth', '');
//           }
          
//           // ✅ Get loginMethod from RTDB
//           let loginMethod: 'email' | 'phone' | 'google' = 'email';
//           if (userData.loginMethod) {
//             loginMethod = userData.loginMethod;
//           } else if (email.endsWith('@phone.auth')) {
//             loginMethod = 'phone';
//           } else if (userData.password === '' || userData.password === undefined) {
//             loginMethod = 'google';
//           }
          
//           return {
//             uid: key,
//             email: email,
//             phone: phoneNumber,
//             phoneNumber: phoneNumber,
//             displayName: userData.name || userData.displayName || '',
//             name: userData.name || userData.displayName || '',
//             createdAt: userData.createdAt || new Date().toISOString(),
//             isAdmin: userData.isAdmin || false,
//             password: userData.password || '',
//             loginMethod: loginMethod, // ✅ ADDED
//           };
//         });
//         setUsers(userList);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setUsers([]);
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const handleViewUsers = () => {
//     setShowUsersModal(true);
//     fetchAllUsers();
//   };

//   // ✅ Open User Detail Modal
//   const handleViewUserDetail = (user: UserData) => {
//     setSelectedUser(user);
//     setShowPassword(false);
//     setShowUserDetailModal(true);
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Navbar />
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="bg-secondary border-b border-border py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here&apos;s your M&M Scents overview</p>
//         </div>
//       </section>

//       <section className="py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//               <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
//             </div>
//           ) : (
//             <>
//               {/* Stats Grid */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
//               >
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Products</h3>
//                     <Package className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Products in catalog</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">All time orders</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-green-700">💰 Earned Revenue</h3>
//                     <TrendingUp className="w-5 h-5 text-green-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-800">₹{Math.round(stats.earnedRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-green-600 mt-2">
//                     {stats.confirmedOrders} confirmed orders
//                   </p>
//                   <p className="text-xs text-green-600">(Earned from confirmed orders)</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-yellow-700">⏳ Pending Revenue</h3>
//                     <Clock className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-800">₹{Math.round(stats.pendingRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-yellow-600 mt-2">
//                     {stats.pendingOrders} pending orders
//                   </p>
//                   <p className="text-xs text-yellow-600">(Pending, Shipped, Delivered)</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Confirmed Orders</h3>
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Confirmed orders</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Pending Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-yellow-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Pending, Shipped, Delivered</p>
//                 </motion.div>
//               </motion.div>

//               {/* Quick Actions */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
//               >
//                 <Link
//                   href="/admin/products"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
//                       <p className="text-sm text-muted-foreground">Add, edit or delete</p>
//                     </div>
//                     <Package className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">{stats.totalProducts} products</p>
//                 </Link>

//                 <Link
//                   href="/admin/orders"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Orders</h3>
//                       <p className="text-sm text-muted-foreground">View & update</p>
//                     </div>
//                     <ShoppingCart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground text-yellow-600 font-semibold">
//                     {stats.pendingOrders} pending
//                   </p>
//                 </Link>

//                 <Link
//                   href="/admin/settings"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Store Settings</h3>
//                       <p className="text-sm text-muted-foreground">Banner & charges</p>
//                     </div>
//                     <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">Customize store</p>
//                 </Link>

//                 <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Quick Stats</h3>
//                       <p className="text-sm text-muted-foreground">Summary view</p>
//                     </div>
//                     <TrendingUp className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-xs space-y-1 text-muted-foreground">
//                     <p>✓ {stats.totalOrders} total orders</p>
//                     <p>✓ {stats.confirmedOrders} confirmed</p>
//                     <p>✓ {stats.pendingOrders} pending</p>
//                     <p>✓ {stats.totalProducts} products</p>
//                   </div>
//                 </div>

//                 <motion.button
//                   onClick={handleViewUsers}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 border border-purple-400 hover:shadow-xl transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-white mb-1">All Users</h3>
//                       <p className="text-sm text-purple-100">View all registered users</p>
//                     </div>
//                     <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-purple-100">Click to view users list</p>
//                 </motion.button>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Users Modal with View Details Button */}
//       {showUsersModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => {
//             setShowUsersModal(false);
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl"
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold text-white">Registered Users</h2>
//                 <p className="text-sm text-purple-100 mt-1">All users who have created accounts</p>
//               </div>
//               <motion.button
//                 onClick={() => {
//                   setShowUsersModal(false);
//                   setShowUserDetailModal(false);
//                 }}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-white hover:text-purple-200 transition-colors"
//               >
//                 <X size={28} />
//               </motion.button>
//             </div>

//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//               {usersLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//                   <p className="mt-4 text-gray-500">Loading users...</p>
//                 </div>
//               ) : users.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                       <tr>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email / Phone</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Login Method</th> {/* ✅ ADDED */}
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
//                         <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {users.map((user, index) => (
//                         <motion.tr
//                           key={user.uid}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
//                           <td className="py-3 px-4 text-sm text-gray-700 font-medium">
//                             {user.email || user.phone || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {user.name || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm">
//                             {user.loginMethod === 'google' ? (
//                               <div className="flex items-center gap-1.5">
//                                 <svg className="w-4 h-4" viewBox="0 0 24 24">
//                                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                                 </svg>
//                                 <span className="text-xs text-gray-500">Google</span>
//                               </div>
//                             ) : user.loginMethod === 'phone' ? (
//                               <div className="flex items-center gap-1.5">
//                                 <Phone className="w-4 h-4 text-green-500" />
//                                 <span className="text-xs text-gray-500">Phone</span>
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-1.5">
//                                 <Mail className="w-4 h-4 text-blue-500" />
//                                 <span className="text-xs text-gray-500">Email</span>
//                               </div>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-sm">
//                             {user.isAdmin ? (
//                               <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Admin</span>
//                             ) : (
//                               <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold">User</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {formatDate(user.createdAt)}
//                           </td>
//                           <td className="py-3 px-4 text-center">
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleViewUserDetail(user)}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//                             >
//                               <User size={14} />
//                               View Details
//                             </motion.button>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No users found</p>
//                 </div>
//               )}
//             </div>

//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
//               <p className="text-sm text-gray-500">Total: {users.length} users</p>
//               <motion.button
//                 onClick={() => setShowUsersModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* ✅ User Detail Modal - With Login Method */}
//       <AnimatePresence>
//         {showUserDetailModal && selectedUser && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
//             onClick={() => setShowUserDetailModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-gray-200"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <User className="w-5 h-5 text-blue-500" />
//                   User Details
//                 </h3>
//                 <button
//                   onClick={() => setShowUserDetailModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {/* Name */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <User className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Name</p>
//                     <p className="font-medium text-gray-800">{selectedUser.name || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Mail className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Email</p>
//                     <p className="font-medium text-gray-800">{selectedUser.email || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Phone className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800">{selectedUser.phone || '—'}</p>
//                   </div>
//                 </div>

//                 {/* ✅ Login Method */}
//                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   {selectedUser.loginMethod === 'google' ? (
//                     <svg className="w-5 h-5" viewBox="0 0 24 24">
//                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                     </svg>
//                   ) : selectedUser.loginMethod === 'phone' ? (
//                     <Phone className="w-5 h-5 text-green-500" />
//                   ) : (
//                     <Mail className="w-5 h-5 text-blue-500" />
//                   )}
//                   <div>
//                     <p className="text-xs text-gray-400">Login Method</p>
//                     <p className="font-medium text-gray-800 capitalize">
//                       {selectedUser.loginMethod === 'google' ? 'Google' : 
//                        selectedUser.loginMethod === 'phone' ? 'Phone Number' : 'Email'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Role */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <CheckCircle className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Role</p>
//                     <p className="font-medium text-gray-800">
//                       {selectedUser.isAdmin ? 'Administrator' : 'Customer'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <Key className="w-5 h-5 text-yellow-500" />
//                   <div className="flex-1">
//                     <p className="text-xs text-yellow-600">Password (RTDB)</p>
//                     <div className="flex items-center gap-2">
//                       <p className="font-mono text-sm text-gray-800 break-all">
//                         {showPassword ? (selectedUser.password || '—') : '••••••••'}
//                       </p>
//                       <button
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Created At */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Calendar className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Account Created</p>
//                     <p className="font-medium text-gray-800">{formatDate(selectedUser.createdAt)}</p>
//                   </div>
//                 </div>

//                 {/* Close Button */}
//                 <button
//                   onClick={() => setShowUserDetailModal(false)}
//                   className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents Admin Panel. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


//with resetPassword true or false without scroll modal of user details

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';
// import { rtdb, auth } from '@/lib/firebase';
// import { ref, onValue, get, update, set } from 'firebase/database';
// import { 
//   Package, ShoppingCart, TrendingUp, Settings, Clock, 
//   CheckCircle, Users, X, Key, Eye, EyeOff, Loader2, User, Mail, Phone, Calendar, RefreshCw 
// } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// interface DashboardStats {
//   totalProducts: number;
//   totalOrders: number;
//   earnedRevenue: number;
//   pendingRevenue: number;
//   pendingOrders: number;
//   confirmedOrders: number;
// }

// interface UserData {
//   uid: string;
//   email: string;
//   phone: string;
//   phoneNumber?: string;
//   displayName?: string;
//   name?: string;
//   createdAt: string;
//   isAdmin?: boolean;
//   password?: string;
//   loginMethod?: 'email' | 'phone' | 'google';
//   passwordReset?: boolean;
// }

// const CONFIRMED_STATUS = 'confirmed';
// const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// export default function AdminDashboard() {
//   const { user, isAdmin, loading: authLoading, userData } = useAuth();
//   const router = useRouter();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProducts: 0,
//     totalOrders: 0,
//     earnedRevenue: 0,
//     pendingRevenue: 0,
//     pendingOrders: 0,
//     confirmedOrders: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [showUsersModal, setShowUsersModal] = useState(false);
//   const [usersLoading, setUsersLoading] = useState(false);
  
//   // User Detail Modal States
//   const [showUserDetailModal, setShowUserDetailModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
//   // Show/Hide Password State
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Reset Password Flag Toggle
//   const [togglingResetFlag, setTogglingResetFlag] = useState(false);

//   // Check admin access
//   useEffect(() => {
//     if (authLoading) return;

//     console.log('[v0] Admin check:', { user: user?.email, isAdmin, userData });
    
//     if (!user) {
//       console.log('[v0] No user, redirecting to login');
//       router.push('/login');
//     } else if (!isAdmin) {
//       console.log('[v0] Not admin, redirecting to home');
//       router.push('/');
//     } else {
//       console.log('[v0] Admin access granted');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch statistics from RTDB
//   useEffect(() => {
//     if (!isAdmin) return;

//     const productsRef = ref(rtdb, 'products');
//     const productsUnsubscribe = onValue(productsRef, (snapshot) => {
//       const productCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
//       setStats(prev => ({ ...prev, totalProducts: productCount }));
//     });

//     const ordersRef = ref(rtdb, 'orders');
//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const orders = Object.values(data) as any[];
//         const totalOrders = orders.length;
//         let earnedRevenue = 0;
//         let pendingRevenue = 0;
//         let pendingOrders = 0;
//         let confirmedOrders = 0;

//         orders.forEach((order) => {
//           if (order.status === 'cancelled') return;

//           if (order.status === CONFIRMED_STATUS) {
//             earnedRevenue += order.total || 0;
//             confirmedOrders++;
//           } else if (PENDING_STATUSES.includes(order.status)) {
//             pendingRevenue += order.total || 0;
//           }

//           if (PENDING_STATUSES.includes(order.status)) {
//             pendingOrders++;
//           }
//         });

//         setStats(prev => ({
//           ...prev,
//           totalOrders,
//           earnedRevenue,
//           pendingRevenue,
//           pendingOrders,
//           confirmedOrders
//         }));
//       } else {
//         setStats(prev => ({
//           ...prev,
//           totalOrders: 0,
//           earnedRevenue: 0,
//           pendingRevenue: 0,
//           pendingOrders: 0,
//           confirmedOrders: 0
//         }));
//       }
//       setLoading(false);
//     });

//     return () => {
//       productsUnsubscribe();
//       ordersUnsubscribe();
//     };
//   }, [isAdmin]);

//   // Format date function
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '—';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '—';
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return '—';
//     }
//   };

//   // Fetch all users from RTDB
//   const fetchAllUsers = async () => {
//     setUsersLoading(true);
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const userList: UserData[] = Object.keys(data).map((key) => {
//           const userData = data[key];
//           const email = userData.email || '';
          
//           let phoneNumber = userData.phone || userData.phoneNumber || '';
//           if (!phoneNumber && email.endsWith('@phone.auth')) {
//             phoneNumber = email.replace('@phone.auth', '');
//           }
          
//           let loginMethod: 'email' | 'phone' | 'google' = 'email';
//           if (userData.loginMethod) {
//             loginMethod = userData.loginMethod;
//           } else if (email.endsWith('@phone.auth')) {
//             loginMethod = 'phone';
//           } else if (userData.password === '' || userData.password === undefined) {
//             loginMethod = 'google';
//           }
          
//           return {
//             uid: key,
//             email: email,
//             phone: phoneNumber,
//             phoneNumber: phoneNumber,
//             displayName: userData.name || userData.displayName || '',
//             name: userData.name || userData.displayName || '',
//             createdAt: userData.createdAt || new Date().toISOString(),
//             isAdmin: userData.isAdmin || false,
//             password: userData.password || '',
//             loginMethod: loginMethod,
//             passwordReset: userData.passwordReset || false,
//           };
//         });
//         setUsers(userList);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setUsers([]);
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const handleViewUsers = () => {
//     setShowUsersModal(true);
//     fetchAllUsers();
//   };

//   // Open User Detail Modal
//   const handleViewUserDetail = (user: UserData) => {
//     setSelectedUser(user);
//     setShowPassword(false);
//     setShowUserDetailModal(true);
//   };

//   // ✅ Toggle Reset Password Flag
//   const handleToggleResetFlag = async () => {
//     if (!selectedUser) return;
    
//     setTogglingResetFlag(true);
//     try {
//       const userRef = ref(rtdb, `users/${selectedUser.uid}`);
//       const newFlagValue = !selectedUser.passwordReset;
      
//       await update(userRef, {
//         passwordReset: newFlagValue,
//         passwordResetAt: newFlagValue ? new Date().toISOString() : null,
//         updatedAt: new Date().toISOString()
//       });
      
//       // Update local state
//       setSelectedUser(prev => prev ? { ...prev, passwordReset: newFlagValue } : null);
//       setUsers(prevUsers => 
//         prevUsers.map(u => 
//           u.uid === selectedUser.uid 
//             ? { ...u, passwordReset: newFlagValue }
//             : u
//         )
//       );
      
//       await Swal.fire({
//         icon: 'success',
//         title: newFlagValue ? 'Reset Flag Enabled!' : 'Reset Flag Disabled!',
//         text: newFlagValue 
//           ? `User ${selectedUser.email || selectedUser.phone} will be prompted to reset password on next login.`
//           : `User ${selectedUser.email || selectedUser.phone} will NOT be prompted to reset password.`,
//         timer: 2000,
//         showConfirmButton: false
//       });
      
//     } catch (error: any) {
//       console.error('Error toggling reset flag:', error);
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'Failed to update reset flag. Please try again.'
//       });
//     } finally {
//       setTogglingResetFlag(false);
//     }
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Navbar />
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="bg-secondary border-b border-border py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here&apos;s your M&M Scents overview</p>
//         </div>
//       </section>

//       <section className="py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//               <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
//             </div>
//           ) : (
//             <>
//               {/* Stats Grid */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
//               >
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Products</h3>
//                     <Package className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Products in catalog</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">All time orders</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-green-700">💰 Earned Revenue</h3>
//                     <TrendingUp className="w-5 h-5 text-green-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-800">₹{Math.round(stats.earnedRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-green-600 mt-2">
//                     {stats.confirmedOrders} confirmed orders
//                   </p>
//                   <p className="text-xs text-green-600">(Earned from confirmed orders)</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-yellow-700">⏳ Pending Revenue</h3>
//                     <Clock className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-800">₹{Math.round(stats.pendingRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-yellow-600 mt-2">
//                     {stats.pendingOrders} pending orders
//                   </p>
//                   <p className="text-xs text-yellow-600">(Pending, Shipped, Delivered)</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Confirmed Orders</h3>
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Confirmed orders</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Pending Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-yellow-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Pending, Shipped, Delivered</p>
//                 </motion.div>
//               </motion.div>

//               {/* Quick Actions */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
//               >
//                 <Link
//                   href="/admin/products"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
//                       <p className="text-sm text-muted-foreground">Add, edit or delete</p>
//                     </div>
//                     <Package className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">{stats.totalProducts} products</p>
//                 </Link>

//                 <Link
//                   href="/admin/orders"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Orders</h3>
//                       <p className="text-sm text-muted-foreground">View & update</p>
//                     </div>
//                     <ShoppingCart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground text-yellow-600 font-semibold">
//                     {stats.pendingOrders} pending
//                   </p>
//                 </Link>

//                 <Link
//                   href="/admin/settings"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Store Settings</h3>
//                       <p className="text-sm text-muted-foreground">Banner & charges</p>
//                     </div>
//                     <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">Customize store</p>
//                 </Link>

//                 <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Quick Stats</h3>
//                       <p className="text-sm text-muted-foreground">Summary view</p>
//                     </div>
//                     <TrendingUp className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-xs space-y-1 text-muted-foreground">
//                     <p>✓ {stats.totalOrders} total orders</p>
//                     <p>✓ {stats.confirmedOrders} confirmed</p>
//                     <p>✓ {stats.pendingOrders} pending</p>
//                     <p>✓ {stats.totalProducts} products</p>
//                   </div>
//                 </div>

//                 <motion.button
//                   onClick={handleViewUsers}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 border border-purple-400 hover:shadow-xl transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-white mb-1">All Users</h3>
//                       <p className="text-sm text-purple-100">View all registered users</p>
//                     </div>
//                     <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-purple-100">Click to view users list</p>
//                 </motion.button>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Users Modal with View Details Button */}
//       {showUsersModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => {
//             setShowUsersModal(false);
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl"
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold text-white">Registered Users</h2>
//                 <p className="text-sm text-purple-100 mt-1">All users who have created accounts</p>
//               </div>
//               <motion.button
//                 onClick={() => {
//                   setShowUsersModal(false);
//                   setShowUserDetailModal(false);
//                 }}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-white hover:text-purple-200 transition-colors"
//               >
//                 <X size={28} />
//               </motion.button>
//             </div>

//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//               {usersLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//                   <p className="mt-4 text-gray-500">Loading users...</p>
//                 </div>
//               ) : users.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                       <tr>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email / Phone</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Login Method</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
//                         <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {users.map((user, index) => (
//                         <motion.tr
//                           key={user.uid}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
//                           <td className="py-3 px-4 text-sm text-gray-700 font-medium">
//                             {user.email || user.phone || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {user.name || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm">
//                             {user.loginMethod === 'google' ? (
//                               <div className="flex items-center gap-1.5">
//                                 <svg className="w-4 h-4" viewBox="0 0 24 24">
//                                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                                 </svg>
//                                 <span className="text-xs text-gray-500">Google</span>
//                               </div>
//                             ) : user.loginMethod === 'phone' ? (
//                               <div className="flex items-center gap-1.5">
//                                 <Phone className="w-4 h-4 text-green-500" />
//                                 <span className="text-xs text-gray-500">Phone</span>
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-1.5">
//                                 <Mail className="w-4 h-4 text-blue-500" />
//                                 <span className="text-xs text-gray-500">Email</span>
//                               </div>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-sm">
//                             {user.isAdmin ? (
//                               <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Admin</span>
//                             ) : (
//                               <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold">User</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {formatDate(user.createdAt)}
//                           </td>
//                           <td className="py-3 px-4 text-center">
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleViewUserDetail(user)}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//                             >
//                               <User size={14} />
//                               View Details
//                             </motion.button>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No users found</p>
//                 </div>
//               )}
//             </div>

//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
//               <p className="text-sm text-gray-500">Total: {users.length} users</p>
//               <motion.button
//                 onClick={() => setShowUsersModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* ✅ User Detail Modal - With Reset Flag Toggle */}
//       <AnimatePresence>
//         {showUserDetailModal && selectedUser && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
//             onClick={() => setShowUserDetailModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl border border-gray-200"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                   <User className="w-5 h-5 text-blue-500" />
//                   User Details
//                 </h3>
//                 <button
//                   onClick={() => setShowUserDetailModal(false)}
//                   className="text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 {/* Name */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <User className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Name</p>
//                     <p className="font-medium text-gray-800">{selectedUser.name || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Mail className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Email</p>
//                     <p className="font-medium text-gray-800">{selectedUser.email || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Phone className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800">{selectedUser.phone || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Login Method */}
//                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   {selectedUser.loginMethod === 'google' ? (
//                     <svg className="w-5 h-5" viewBox="0 0 24 24">
//                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                     </svg>
//                   ) : selectedUser.loginMethod === 'phone' ? (
//                     <Phone className="w-5 h-5 text-green-500" />
//                   ) : (
//                     <Mail className="w-5 h-5 text-blue-500" />
//                   )}
//                   <div>
//                     <p className="text-xs text-gray-400">Login Method</p>
//                     <p className="font-medium text-gray-800 capitalize">
//                       {selectedUser.loginMethod === 'google' ? 'Google' : 
//                        selectedUser.loginMethod === 'phone' ? 'Phone Number' : 'Email'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Role */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <CheckCircle className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Role</p>
//                     <p className="font-medium text-gray-800">
//                       {selectedUser.isAdmin ? 'Administrator' : 'Customer'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <Key className="w-5 h-5 text-yellow-500" />
//                   <div className="flex-1">
//                     <p className="text-xs text-yellow-600">Password (RTDB)</p>
//                     <div className="flex items-center gap-2">
//                       <p className="font-mono text-sm text-gray-800 break-all">
//                         {showPassword ? (selectedUser.password || '—') : '••••••••'}
//                       </p>
//                       <button
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* ✅ Reset Password Flag - Toggle */}
//                 <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
//                   <RefreshCw className="w-5 h-5 text-purple-500" />
//                   <div className="flex-1">
//                     <p className="text-xs text-purple-600 font-semibold">Reset Password Flag</p>
//                     <div className="flex items-center justify-between mt-1">
//                       <span className={`text-sm font-medium ${selectedUser.passwordReset ? 'text-green-600' : 'text-gray-500'}`}>
//                         {selectedUser.passwordReset ? '✅ Enabled' : '❌ Disabled'}
//                       </span>
//                       <button
//                         onClick={handleToggleResetFlag}
//                         disabled={togglingResetFlag}
//                         className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
//                           selectedUser.passwordReset
//                             ? 'bg-red-500 text-white hover:bg-red-600'
//                             : 'bg-green-500 text-white hover:bg-green-600'
//                         } ${togglingResetFlag ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {togglingResetFlag ? (
//                           <Loader2 className="w-3 h-3 animate-spin" />
//                         ) : null}
//                         {selectedUser.passwordReset ? 'Disable' : 'Enable'}
//                       </button>
//                     </div>
//                     <p className="text-xs text-purple-600 mt-1">
//                       {selectedUser.passwordReset 
//                         ? 'User will be prompted to reset password on next login' 
//                         : 'User will NOT be prompted to reset password'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Created At */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Calendar className="w-5 h-5 text-gray-400" />
//                   <div>
//                     <p className="text-xs text-gray-400">Account Created</p>
//                     <p className="font-medium text-gray-800">{formatDate(selectedUser.createdAt)}</p>
//                   </div>
//                 </div>

//                 {/* Close Button */}
//                 <button
//                   onClick={() => setShowUserDetailModal(false)}
//                   className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents Admin Panel. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


// without abdulhaseebkhatri123@gmail.com view admin details

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import Navbar from '@/components/Navbar';
// import { rtdb, auth } from '@/lib/firebase';
// import { ref, onValue, get, update, set } from 'firebase/database';
// import { 
//   Package, ShoppingCart, TrendingUp, Settings, Clock, 
//   CheckCircle, Users, X, Key, Eye, EyeOff, Loader2, User, Mail, Phone, Calendar, RefreshCw 
// } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// interface DashboardStats {
//   totalProducts: number;
//   totalOrders: number;
//   earnedRevenue: number;
//   pendingRevenue: number;
//   pendingOrders: number;
//   confirmedOrders: number;
// }

// interface UserData {
//   uid: string;
//   email: string;
//   phone: string;
//   phoneNumber?: string;
//   displayName?: string;
//   name?: string;
//   createdAt: string;
//   isAdmin?: boolean;
//   password?: string;
//   loginMethod?: 'email' | 'phone' | 'google';
//   passwordReset?: boolean;
// }

// const CONFIRMED_STATUS = 'confirmed';
// const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// export default function AdminDashboard() {
//   const { user, isAdmin, loading: authLoading, userData } = useAuth();
//   const router = useRouter();
//   const [stats, setStats] = useState<DashboardStats>({
//     totalProducts: 0,
//     totalOrders: 0,
//     earnedRevenue: 0,
//     pendingRevenue: 0,
//     pendingOrders: 0,
//     confirmedOrders: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState<UserData[]>([]);
//   const [showUsersModal, setShowUsersModal] = useState(false);
//   const [usersLoading, setUsersLoading] = useState(false);
  
//   // User Detail Modal States
//   const [showUserDetailModal, setShowUserDetailModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
//   // Show/Hide Password State
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Reset Password Flag Toggle
//   const [togglingResetFlag, setTogglingResetFlag] = useState(false);

//   // Check admin access
//   useEffect(() => {
//     if (authLoading) return;

//     console.log('[v0] Admin check:', { user: user?.email, isAdmin, userData });
    
//     if (!user) {
//       console.log('[v0] No user, redirecting to login');
//       router.push('/login');
//     } else if (!isAdmin) {
//       console.log('[v0] Not admin, redirecting to home');
//       router.push('/');
//     } else {
//       console.log('[v0] Admin access granted');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch statistics from RTDB
//   useEffect(() => {
//     if (!isAdmin) return;

//     const productsRef = ref(rtdb, 'products');
//     const productsUnsubscribe = onValue(productsRef, (snapshot) => {
//       const productCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
//       setStats(prev => ({ ...prev, totalProducts: productCount }));
//     });

//     const ordersRef = ref(rtdb, 'orders');
//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const orders = Object.values(data) as any[];
//         const totalOrders = orders.length;
//         let earnedRevenue = 0;
//         let pendingRevenue = 0;
//         let pendingOrders = 0;
//         let confirmedOrders = 0;

//         orders.forEach((order) => {
//           if (order.status === 'cancelled') return;

//           if (order.status === CONFIRMED_STATUS) {
//             earnedRevenue += order.total || 0;
//             confirmedOrders++;
//           } else if (PENDING_STATUSES.includes(order.status)) {
//             pendingRevenue += order.total || 0;
//           }

//           if (PENDING_STATUSES.includes(order.status)) {
//             pendingOrders++;
//           }
//         });

//         setStats(prev => ({
//           ...prev,
//           totalOrders,
//           earnedRevenue,
//           pendingRevenue,
//           pendingOrders,
//           confirmedOrders
//         }));
//       } else {
//         setStats(prev => ({
//           ...prev,
//           totalOrders: 0,
//           earnedRevenue: 0,
//           pendingRevenue: 0,
//           pendingOrders: 0,
//           confirmedOrders: 0
//         }));
//       }
//       setLoading(false);
//     });

//     return () => {
//       productsUnsubscribe();
//       ordersUnsubscribe();
//     };
//   }, [isAdmin]);

//   // Format date function
//   const formatDate = (dateString: string) => {
//     if (!dateString) return '—';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return '—';
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return '—';
//     }
//   };

//   // Fetch all users from RTDB
//   const fetchAllUsers = async () => {
//     setUsersLoading(true);
//     try {
//       const usersRef = ref(rtdb, 'users');
//       const snapshot = await get(usersRef);
      
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const userList: UserData[] = Object.keys(data).map((key) => {
//           const userData = data[key];
//           const email = userData.email || '';
          
//           let phoneNumber = userData.phone || userData.phoneNumber || '';
//           if (!phoneNumber && email.endsWith('@phone.auth')) {
//             phoneNumber = email.replace('@phone.auth', '');
//           }
          
//           let loginMethod: 'email' | 'phone' | 'google' = 'email';
//           if (userData.loginMethod) {
//             loginMethod = userData.loginMethod;
//           } else if (email.endsWith('@phone.auth')) {
//             loginMethod = 'phone';
//           } else if (userData.password === '' || userData.password === undefined) {
//             loginMethod = 'google';
//           }
          
//           return {
//             uid: key,
//             email: email,
//             phone: phoneNumber,
//             phoneNumber: phoneNumber,
//             displayName: userData.name || userData.displayName || '',
//             name: userData.name || userData.displayName || '',
//             createdAt: userData.createdAt || new Date().toISOString(),
//             isAdmin: userData.isAdmin || false,
//             password: userData.password || '',
//             loginMethod: loginMethod,
//             passwordReset: userData.passwordReset || false,
//           };
//         });
//         setUsers(userList);
//       } else {
//         setUsers([]);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setUsers([]);
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   const handleViewUsers = () => {
//     setShowUsersModal(true);
//     fetchAllUsers();
//   };

//   // Open User Detail Modal
//   const handleViewUserDetail = (user: UserData) => {
//     setSelectedUser(user);
//     setShowPassword(false);
//     setShowUserDetailModal(true);
//   };

//   // ✅ Toggle Reset Password Flag
//   const handleToggleResetFlag = async () => {
//     if (!selectedUser) return;
    
//     setTogglingResetFlag(true);
//     try {
//       const userRef = ref(rtdb, `users/${selectedUser.uid}`);
//       const newFlagValue = !selectedUser.passwordReset;
      
//       await update(userRef, {
//         passwordReset: newFlagValue,
//         passwordResetAt: newFlagValue ? new Date().toISOString() : null,
//         updatedAt: new Date().toISOString()
//       });
      
//       // Update local state
//       setSelectedUser(prev => prev ? { ...prev, passwordReset: newFlagValue } : null);
//       setUsers(prevUsers => 
//         prevUsers.map(u => 
//           u.uid === selectedUser.uid 
//             ? { ...u, passwordReset: newFlagValue }
//             : u
//         )
//       );
      
//       await Swal.fire({
//         icon: 'success',
//         title: newFlagValue ? 'Reset Flag Enabled!' : 'Reset Flag Disabled!',
//         text: newFlagValue 
//           ? `User ${selectedUser.email || selectedUser.phone} will be prompted to reset password on next login.`
//           : `User ${selectedUser.email || selectedUser.phone} will NOT be prompted to reset password.`,
//         timer: 2000,
//         showConfirmButton: false
//       });
      
//     } catch (error: any) {
//       console.error('Error toggling reset flag:', error);
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'Failed to update reset flag. Please try again.'
//       });
//     } finally {
//       setTogglingResetFlag(false);
//     }
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Navbar />
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="bg-secondary border-b border-border py-8 px-4">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back! Here&apos;s your M&M Scents overview</p>
//         </div>
//       </section>

//       <section className="py-12 px-4">
//         <div className="max-w-7xl mx-auto">
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//               <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
//             </div>
//           ) : (
//             <>
//               {/* Stats Grid */}
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
//               >
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Products</h3>
//                     <Package className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Products in catalog</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.1 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Total Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-primary" />
//                   </div>
//                   <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">All time orders</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 }}
//                   className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-green-700">💰 Earned Revenue</h3>
//                     <TrendingUp className="w-5 h-5 text-green-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-800">₹{Math.round(stats.earnedRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-green-600 mt-2">
//                     {stats.confirmedOrders} confirmed orders
//                   </p>
//                   <p className="text-xs text-green-600">(Earned from confirmed orders)</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.3 }}
//                   className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-sm font-semibold text-yellow-700">⏳ Pending Revenue</h3>
//                     <Clock className="w-5 h-5 text-yellow-600" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-800">₹{Math.round(stats.pendingRevenue).toLocaleString()}</p>
//                   <p className="text-xs text-yellow-600 mt-2">
//                     {stats.pendingOrders} pending orders
//                   </p>
//                   <p className="text-xs text-yellow-600">(Pending, Shipped, Delivered)</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.4 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Confirmed Orders</h3>
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Confirmed orders</p>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="text-muted-foreground text-sm font-semibold">Pending Orders</h3>
//                     <ShoppingCart className="w-5 h-5 text-yellow-500" />
//                   </div>
//                   <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
//                   <p className="text-xs text-muted-foreground mt-2">Pending, Shipped, Delivered</p>
//                 </motion.div>
//               </motion.div>

//               {/* Quick Actions */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.6 }}
//                 className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
//               >
//                 <Link
//                   href="/admin/products"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
//                       <p className="text-sm text-muted-foreground">Add, edit or delete</p>
//                     </div>
//                     <Package className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">{stats.totalProducts} products</p>
//                 </Link>

//                 <Link
//                   href="/admin/orders"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Manage Orders</h3>
//                       <p className="text-sm text-muted-foreground">View & update</p>
//                     </div>
//                     <ShoppingCart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground text-yellow-600 font-semibold">
//                     {stats.pendingOrders} pending
//                   </p>
//                 </Link>

//                 <Link
//                   href="/admin/settings"
//                   className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Store Settings</h3>
//                       <p className="text-sm text-muted-foreground">Banner & charges</p>
//                     </div>
//                     <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-muted-foreground">Customize store</p>
//                 </Link>

//                 <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-foreground mb-1">Quick Stats</h3>
//                       <p className="text-sm text-muted-foreground">Summary view</p>
//                     </div>
//                     <TrendingUp className="w-6 h-6 text-primary" />
//                   </div>
//                   <div className="text-xs space-y-1 text-muted-foreground">
//                     <p>✓ {stats.totalOrders} total orders</p>
//                     <p>✓ {stats.confirmedOrders} confirmed</p>
//                     <p>✓ {stats.pendingOrders} pending</p>
//                     <p>✓ {stats.totalProducts} products</p>
//                   </div>
//                 </div>

//                 <motion.button
//                   onClick={handleViewUsers}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 border border-purple-400 hover:shadow-xl transition-all group cursor-pointer"
//                 >
//                   <div className="flex items-start justify-between mb-4">
//                     <div>
//                       <h3 className="font-semibold text-white mb-1">All Users</h3>
//                       <p className="text-sm text-purple-100">View all registered users</p>
//                     </div>
//                     <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
//                   </div>
//                   <p className="text-xs text-purple-100">Click to view users list</p>
//                 </motion.button>
//               </motion.div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Users Modal */}
//       {showUsersModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => {
//             setShowUsersModal(false);
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl"
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex justify-between items-center z-10">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold text-white">Registered Users</h2>
//                 <p className="text-sm text-purple-100 mt-1">All users who have created accounts</p>
//               </div>
//               <motion.button
//                 onClick={() => {
//                   setShowUsersModal(false);
//                   setShowUserDetailModal(false);
//                 }}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-white hover:text-purple-200 transition-colors"
//               >
//                 <X size={28} />
//               </motion.button>
//             </div>

//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
//               {usersLoading ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
//                   <p className="mt-4 text-gray-500">Loading users...</p>
//                 </div>
//               ) : users.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
//                       <tr>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email / Phone</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Login Method</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
//                         <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
//                         <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-100">
//                       {users.map((user, index) => (
//                         <motion.tr
//                           key={user.uid}
//                           initial={{ opacity: 0, x: -10 }}
//                           animate={{ opacity: 1, x: 0 }}
//                           transition={{ delay: index * 0.05 }}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
//                           <td className="py-3 px-4 text-sm text-gray-700 font-medium">
//                             {user.email || user.phone || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {user.name || '—'}
//                           </td>
//                           <td className="py-3 px-4 text-sm">
//                             {user.loginMethod === 'google' ? (
//                               <div className="flex items-center gap-1.5">
//                                 <svg className="w-4 h-4" viewBox="0 0 24 24">
//                                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                                 </svg>
//                                 <span className="text-xs text-gray-500">Google</span>
//                               </div>
//                             ) : user.loginMethod === 'phone' ? (
//                               <div className="flex items-center gap-1.5">
//                                 <Phone className="w-4 h-4 text-green-500" />
//                                 <span className="text-xs text-gray-500">Phone</span>
//                               </div>
//                             ) : (
//                               <div className="flex items-center gap-1.5">
//                                 <Mail className="w-4 h-4 text-blue-500" />
//                                 <span className="text-xs text-gray-500">Email</span>
//                               </div>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-sm">
//                             {user.isAdmin ? (
//                               <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Admin</span>
//                             ) : (
//                               <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold">User</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-sm text-gray-600">
//                             {formatDate(user.createdAt)}
//                           </td>
//                           <td className="py-3 px-4 text-center">
//                             <motion.button
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => handleViewUserDetail(user)}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
//                             >
//                               <User size={14} />
//                               View Details
//                             </motion.button>
//                           </td>
//                         </motion.tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                   <p className="text-gray-500">No users found</p>
//                 </div>
//               )}
//             </div>

//             <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
//               <p className="text-sm text-gray-500">Total: {users.length} users</p>
//               <motion.button
//                 onClick={() => setShowUsersModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* ✅ User Detail Modal - CHOTA AUR SCROLLABLE */}
//       <AnimatePresence>
//         {showUserDetailModal && selectedUser && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
//             onClick={() => setShowUserDetailModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, y: 20 }}
//               animate={{ scale: 1, y: 0 }}
//               exit={{ scale: 0.9, y: 20 }}
//               className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden border border-gray-200 shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Modal Header - Fixed */}
//               <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex justify-between items-center z-10">
//                 <h3 className="text-lg font-bold text-white flex items-center gap-2">
//                   <User className="w-5 h-5" />
//                   User Details
//                 </h3>
//                 <button
//                   onClick={() => setShowUserDetailModal(false)}
//                   className="text-white hover:text-blue-200 transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               {/* Modal Body - Scrollable */}
//               <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] space-y-3">
//                 {/* Name */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-400">Name</p>
//                     <p className="font-medium text-gray-800 truncate">{selectedUser.name || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-400">Email</p>
//                     <p className="font-medium text-gray-800 truncate">{selectedUser.email || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Phone */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-400">Phone</p>
//                     <p className="font-medium text-gray-800 truncate">{selectedUser.phone || '—'}</p>
//                   </div>
//                 </div>

//                 {/* Login Method */}
//                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
//                   {selectedUser.loginMethod === 'google' ? (
//                     <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
//                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                     </svg>
//                   ) : selectedUser.loginMethod === 'phone' ? (
//                     <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
//                   ) : (
//                     <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-400">Login Method</p>
//                     <p className="font-medium text-gray-800 capitalize truncate">
//                       {selectedUser.loginMethod === 'google' ? 'Google' : 
//                        selectedUser.loginMethod === 'phone' ? 'Phone Number' : 'Email'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Role */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-400">Role</p>
//                     <p className="font-medium text-gray-800">
//                       {selectedUser.isAdmin ? 'Administrator' : 'Customer'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                   <Key className="w-5 h-5 text-yellow-500 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-yellow-600">Password (RTDB)</p>
//                     <div className="flex items-center gap-2">
//                       <p className="font-mono text-sm text-gray-800 truncate">
//                         {showPassword ? (selectedUser.password || '—') : '••••••••'}
//                       </p>
//                       <button
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
//                       >
//                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Reset Password Flag - Toggle */}
//                 <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
//                   <RefreshCw className="w-5 h-5 text-purple-500 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-purple-600 font-semibold">Reset Password Flag</p>
//                     <div className="flex items-center justify-between mt-1 gap-2">
//                       <span className={`text-sm font-medium ${selectedUser.passwordReset ? 'text-green-600' : 'text-gray-500'}`}>
//                         {selectedUser.passwordReset ? '✅ Enabled' : '❌ Disabled'}
//                       </span>
//                       <button
//                         onClick={handleToggleResetFlag}
//                         disabled={togglingResetFlag}
//                         className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0 ${
//                           selectedUser.passwordReset
//                             ? 'bg-red-500 text-white hover:bg-red-600'
//                             : 'bg-green-500 text-white hover:bg-green-600'
//                         } ${togglingResetFlag ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {togglingResetFlag ? (
//                           <Loader2 className="w-3 h-3 animate-spin" />
//                         ) : null}
//                         {selectedUser.passwordReset ? 'Disable' : 'Enable'}
//                       </button>
//                     </div>
//                     <p className="text-xs text-purple-600 mt-1">
//                       {selectedUser.passwordReset 
//                         ? 'User will be prompted to reset password on next login' 
//                         : 'User will NOT be prompted to reset password'}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Created At */}
//                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//                   <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs text-gray-400">Account Created</p>
//                     <p className="font-medium text-gray-800 truncate">{formatDate(selectedUser.createdAt)}</p>
//                   </div>
//                 </div>

//                 {/* Close Button */}
//                 <button
//                   onClick={() => setShowUserDetailModal(false)}
//                   className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents Admin Panel. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



// only abdulhaseebkhatri123@gmail.com view admin details
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import { rtdb, auth } from '@/lib/firebase';
import { ref, onValue, get, update, set } from 'firebase/database';
import { 
  Package, ShoppingCart, TrendingUp, Settings, Clock, 
  CheckCircle, Users, X, Key, Eye, EyeOff, Loader2, User, Mail, Phone, Calendar, RefreshCw, Shield 
} from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  earnedRevenue: number;
  pendingRevenue: number;
  pendingOrders: number;
  confirmedOrders: number;
}

interface UserData {
  uid: string;
  email: string;
  phone: string;
  phoneNumber?: string;
  displayName?: string;
  name?: string;
  createdAt: string;
  isAdmin?: boolean;
  password?: string;
  loginMethod?: 'email' | 'phone' | 'google';
  passwordReset?: boolean;
}

const CONFIRMED_STATUS = 'confirmed';
const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// ✅ Super Admin Email
const SUPER_ADMIN_EMAIL = 'abdulhaseebkhatri123@gmail.com';

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, userData } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    earnedRevenue: 0,
    pendingRevenue: 0,
    pendingOrders: 0,
    confirmedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // User Detail Modal States
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // Show/Hide Password State
  const [showPassword, setShowPassword] = useState(false);
  
  // Reset Password Flag Toggle
  const [togglingResetFlag, setTogglingResetFlag] = useState(false);

  // ✅ Check if current user is Super Admin
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  // Check admin access
  useEffect(() => {
    if (authLoading) return;

    console.log('[v0] Admin check:', { user: user?.email, isAdmin, userData });
    
    if (!user) {
      console.log('[v0] No user, redirecting to login');
      router.push('/login');
    } else if (!isAdmin) {
      console.log('[v0] Not admin, redirecting to home');
      router.push('/');
    } else {
      console.log('[v0] Admin access granted');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch statistics from RTDB
  useEffect(() => {
    if (!isAdmin) return;

    const productsRef = ref(rtdb, 'products');
    const productsUnsubscribe = onValue(productsRef, (snapshot) => {
      const productCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      setStats(prev => ({ ...prev, totalProducts: productCount }));
    });

    const ordersRef = ref(rtdb, 'orders');
    const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.values(data) as any[];
        const totalOrders = orders.length;
        let earnedRevenue = 0;
        let pendingRevenue = 0;
        let pendingOrders = 0;
        let confirmedOrders = 0;

        orders.forEach((order) => {
          if (order.status === 'cancelled') return;

          if (order.status === CONFIRMED_STATUS) {
            earnedRevenue += order.total || 0;
            confirmedOrders++;
          } else if (PENDING_STATUSES.includes(order.status)) {
            pendingRevenue += order.total || 0;
          }

          if (PENDING_STATUSES.includes(order.status)) {
            pendingOrders++;
          }
        });

        setStats(prev => ({
          ...prev,
          totalOrders,
          earnedRevenue,
          pendingRevenue,
          pendingOrders,
          confirmedOrders
        }));
      } else {
        setStats(prev => ({
          ...prev,
          totalOrders: 0,
          earnedRevenue: 0,
          pendingRevenue: 0,
          pendingOrders: 0,
          confirmedOrders: 0
        }));
      }
      setLoading(false);
    });

    return () => {
      productsUnsubscribe();
      ordersUnsubscribe();
    };
  }, [isAdmin]);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '—';
    }
  };

  // Fetch all users from RTDB
  const fetchAllUsers = async () => {
    setUsersLoading(true);
    try {
      const usersRef = ref(rtdb, 'users');
      const snapshot = await get(usersRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const userList: UserData[] = Object.keys(data).map((key) => {
          const userData = data[key];
          const email = userData.email || '';
          
          let phoneNumber = userData.phone || userData.phoneNumber || '';
          if (!phoneNumber && email.endsWith('@phone.auth')) {
            phoneNumber = email.replace('@phone.auth', '');
          }
          
          let loginMethod: 'email' | 'phone' | 'google' = 'email';
          if (userData.loginMethod) {
            loginMethod = userData.loginMethod;
          } else if (email.endsWith('@phone.auth')) {
            loginMethod = 'phone';
          } else if (userData.password === '' || userData.password === undefined) {
            loginMethod = 'google';
          }
          
          return {
            uid: key,
            email: email,
            phone: phoneNumber,
            phoneNumber: phoneNumber,
            displayName: userData.name || userData.displayName || '',
            name: userData.name || userData.displayName || '',
            createdAt: userData.createdAt || new Date().toISOString(),
            isAdmin: userData.isAdmin || false,
            password: userData.password || '',
            loginMethod: loginMethod,
            passwordReset: userData.passwordReset || false,
          };
        });
        setUsers(userList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleViewUsers = () => {
    setShowUsersModal(true);
    fetchAllUsers();
  };

  // Open User Detail Modal - ✅ Only for Super Admin
  const handleViewUserDetail = (user: UserData) => {
    // ✅ Check if current user is Super Admin
    if (!isSuperAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied!',
        text: 'Only Super Admin can view user details.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    setSelectedUser(user);
    setShowPassword(false);
    setShowUserDetailModal(true);
  };

  // ✅ Toggle Reset Password Flag - Only for Super Admin
  const handleToggleResetFlag = async () => {
    // ✅ Double check Super Admin
    if (!isSuperAdmin) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied!',
        text: 'Only Super Admin can toggle reset flag.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    
    if (!selectedUser) return;
    
    setTogglingResetFlag(true);
    try {
      const userRef = ref(rtdb, `users/${selectedUser.uid}`);
      const newFlagValue = !selectedUser.passwordReset;
      
      await update(userRef, {
        passwordReset: newFlagValue,
        passwordResetAt: newFlagValue ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
      setSelectedUser(prev => prev ? { ...prev, passwordReset: newFlagValue } : null);
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.uid === selectedUser.uid 
            ? { ...u, passwordReset: newFlagValue }
            : u
        )
      );
      
      await Swal.fire({
        icon: 'success',
        title: newFlagValue ? 'Reset Flag Enabled!' : 'Reset Flag Disabled!',
        text: newFlagValue 
          ? `User ${selectedUser.email || selectedUser.phone} will be prompted to reset password on next login.`
          : `User ${selectedUser.email || selectedUser.phone} will NOT be prompted to reset password.`,
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error: any) {
      console.error('Error toggling reset flag:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update reset flag. Please try again.'
      });
    } finally {
      setTogglingResetFlag(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-secondary border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your M&M Scents overview</p>
          {/* ✅ Show Super Admin Badge */}
          {isSuperAdmin && (
            <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              <Shield className="w-4 h-4" />
              SUPER ADMIN
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Total Products</h3>
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground mt-2">Products in catalog</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Total Orders</h3>
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground mt-2">All time orders</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-green-700">💰 Earned Revenue</h3>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-800">₹{Math.round(stats.earnedRevenue).toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-2">
                    {stats.confirmedOrders} confirmed orders
                  </p>
                  <p className="text-xs text-green-600">(Earned from confirmed orders)</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-yellow-700">⏳ Pending Revenue</h3>
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-800">₹{Math.round(stats.pendingRevenue).toLocaleString()}</p>
                  <p className="text-xs text-yellow-600 mt-2">
                    {stats.pendingOrders} pending orders
                  </p>
                  <p className="text-xs text-yellow-600">(Pending, Shipped, Delivered)</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Confirmed Orders</h3>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.confirmedOrders}</p>
                  <p className="text-xs text-muted-foreground mt-2">Confirmed orders</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Pending Orders</h3>
                    <ShoppingCart className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                  <p className="text-xs text-muted-foreground mt-2">Pending, Shipped, Delivered</p>
                </motion.div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
              >
                <Link
                  href="/admin/products"
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
                      <p className="text-sm text-muted-foreground">Add, edit or delete</p>
                    </div>
                    <Package className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground">{stats.totalProducts} products</p>
                </Link>

                <Link
                  href="/admin/orders"
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Manage Orders</h3>
                      <p className="text-sm text-muted-foreground">View & update</p>
                    </div>
                    <ShoppingCart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground text-yellow-600 font-semibold">
                    {stats.pendingOrders} pending
                  </p>
                </Link>

                <Link
                  href="/admin/settings"
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Store Settings</h3>
                      <p className="text-sm text-muted-foreground">Banner & charges</p>
                    </div>
                    <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground">Customize store</p>
                </Link>

                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Quick Stats</h3>
                      <p className="text-sm text-muted-foreground">Summary view</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>✓ {stats.totalOrders} total orders</p>
                    <p>✓ {stats.confirmedOrders} confirmed</p>
                    <p>✓ {stats.pendingOrders} pending</p>
                    <p>✓ {stats.totalProducts} products</p>
                  </div>
                </div>

                <motion.button
                  onClick={handleViewUsers}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 border border-purple-400 hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">All Users</h3>
                      <p className="text-sm text-purple-100">View all registered users</p>
                    </div>
                    <Users className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-purple-100">Click to view users list</p>
                </motion.button>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Users Modal */}
      {showUsersModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowUsersModal(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-hidden border border-gray-200 shadow-2xl"
          >
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 p-6 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Registered Users</h2>
                <p className="text-sm text-purple-100 mt-1">All users who have created accounts</p>
              </div>
              <motion.button
                onClick={() => {
                  setShowUsersModal(false);
                  setShowUserDetailModal(false);
                }}
                whileHover={{ scale: 1.1 }}
                className="text-white hover:text-purple-200 transition-colors"
              >
                <X size={28} />
              </motion.button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {usersLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading users...</p>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">#</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email / Phone</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Login Method</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((user, index) => (
                        <motion.tr
                          key={user.uid}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-500">{index + 1}</td>
                          <td className="py-3 px-4 text-sm text-gray-700 font-medium">
                            {user.email || user.phone || '—'}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {user.name || '—'}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {user.loginMethod === 'google' ? (
                              <div className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span className="text-xs text-gray-500">Google</span>
                              </div>
                            ) : user.loginMethod === 'phone' ? (
                              <div className="flex items-center gap-1.5">
                                <Phone className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-gray-500">Phone</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <Mail className="w-4 h-4 text-blue-500" />
                                <span className="text-xs text-gray-500">Email</span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {user.isAdmin ? (
                              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Admin</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold">User</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {/* ✅ View Details Button - Only for Super Admin */}
                            {isSuperAdmin ? (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleViewUserDetail(user)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                              >
                                <User size={14} />
                                View Details
                              </motion.button>
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                🔒 Super Admin only
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No users found</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">Total: {users.length} users</p>
              <motion.button
                onClick={() => setShowUsersModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ✅ User Detail Modal - Only visible to Super Admin */}
      <AnimatePresence>
        {showUserDetailModal && selectedUser && isSuperAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setShowUserDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden border border-gray-200 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header - Fixed */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex justify-between items-center z-10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  User Details
                </h3>
                <button
                  onClick={() => setShowUserDetailModal(false)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)] space-y-3">
                {/* Name */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="font-medium text-gray-800 truncate">{selectedUser.name || '—'}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 truncate">{selectedUser.email || '—'}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 truncate">{selectedUser.phone || '—'}</p>
                  </div>
                </div>

                {/* Login Method */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  {selectedUser.loginMethod === 'google' ? (
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  ) : selectedUser.loginMethod === 'phone' ? (
                    <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Login Method</p>
                    <p className="font-medium text-gray-800 capitalize truncate">
                      {selectedUser.loginMethod === 'google' ? 'Google' : 
                       selectedUser.loginMethod === 'phone' ? 'Phone Number' : 'Email'}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <CheckCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Role</p>
                    <p className="font-medium text-gray-800">
                      {selectedUser.isAdmin ? 'Administrator' : 'Customer'}
                    </p>
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Key className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-yellow-600">Password (RTDB)</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-gray-800 truncate">
                        {showPassword ? (selectedUser.password || '—') : '••••••••'}
                      </p>
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reset Password Flag - Toggle */}
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <RefreshCw className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-purple-600 font-semibold">Reset Password Flag</p>
                    <div className="flex items-center justify-between mt-1 gap-2">
                      <span className={`text-sm font-medium ${selectedUser.passwordReset ? 'text-green-600' : 'text-gray-500'}`}>
                        {selectedUser.passwordReset ? '✅ Enabled' : '❌ Disabled'}
                      </span>
                      <button
                        onClick={handleToggleResetFlag}
                        disabled={togglingResetFlag}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0 ${
                          selectedUser.passwordReset
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        } ${togglingResetFlag ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {togglingResetFlag ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : null}
                        {selectedUser.passwordReset ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                      {selectedUser.passwordReset 
                        ? 'User will be prompted to reset password on next login' 
                        : 'User will NOT be prompted to reset password'}
                    </p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">Account Created</p>
                    <p className="font-medium text-gray-800 truncate">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowUserDetailModal(false)}
                  className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-secondary py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2026 M&M Scents Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}