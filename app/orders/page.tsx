// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Navbar from '@/components/Navbar';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
// import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Bell } from 'lucide-react';

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface Order {
//   id: string;
//   userId: string;
//   items: OrderItem[];
//   total: number;
//   status: 'pending' | 'dispatched' | 'delivered' | 'confirmed' | 'shipped' | 'cancelled';
//   userEmail: string;
//   userPhone: string;
//   userAddress: string;
//   createdAt: number;
//   adminNotes?: string;
//   adminNotesUpdatedAt?: number; // To track when note was added/updated
// }

// export default function OrdersPage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [viewedNotes, setViewedNotes] = useState<Set<string>>(new Set());

//   // Load viewed notes from localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('viewedOrderNotes');
//       if (saved) {
//         try {
//           setViewedNotes(new Set(JSON.parse(saved)));
//         } catch (e) {
//           console.error('Error loading viewed notes:', e);
//         }
//       }
//     }
//   }, []);

//   // Save viewed notes to localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('viewedOrderNotes', JSON.stringify([...viewedNotes]));
//     }
//   }, [viewedNotes]);

//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     // Fetch user's orders
//     const ordersRef = ref(rtdb, 'orders');
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const userOrders: Order[] = [];
//         const data = snapshot.val();

//         Object.keys(data).forEach((key) => {
//           const order = { id: key, ...data[key] } as Order;
//           if (order.userId === user.uid) {
//             userOrders.push(order);
//           }
//         });

//         // Sort by date (newest first)
//         userOrders.sort((a, b) => b.createdAt - a.createdAt);
//         setOrders(userOrders);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [user, authLoading, router]);

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="text-yellow-600" size={20} />;
//       case 'dispatched':
//       case 'shipped':
//         return <Truck className="text-blue-600" size={20} />;
//       case 'delivered':
//         return <CheckCircle className="text-green-600" size={20} />;
//       case 'confirmed':
//         return <CheckCircle className="text-blue-600" size={20} />;
//       case 'cancelled':
//         return <AlertCircle className="text-red-600" size={20} />;
//       default:
//         return <AlertCircle size={20} />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 border-yellow-300 text-yellow-900';
//       case 'dispatched':
//       case 'shipped':
//         return 'bg-blue-100 border-blue-300 text-blue-900';
//       case 'delivered':
//         return 'bg-green-100 border-green-300 text-green-900';
//       case 'confirmed':
//         return 'bg-blue-100 border-blue-300 text-blue-900';
//       case 'cancelled':
//         return 'bg-red-100 border-red-300 text-red-900';
//       default:
//         return 'bg-gray-100 border-gray-300 text-gray-900';
//     }
//   };

//   const formatDate = (timestamp: number) => {
//     return new Date(timestamp).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Check if order has unread admin note
//   const hasUnreadNote = (order: Order) => {
//     if (!order.adminNotes) return false;
//     const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
//     return !viewedNotes.has(noteKey);
//   };

//   // Mark note as viewed
//   const markNoteAsViewed = (order: Order) => {
//     if (order.adminNotes) {
//       const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
//       setViewedNotes(prev => new Set([...prev, noteKey]));
//     }
//   };

//   // Handle view details click
//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//     // Mark note as viewed when modal opens
//     if (order.adminNotes) {
//       markNoteAsViewed(order);
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-[80vh]">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//             className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background relative">
//       <Navbar />

//       {/* Watermark - Positioned absolutely behind content */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.08] z-0 flex items-center justify-center"
//         animate={{
//           scale: [1, 1.08, 1],
//         }}
//         transition={{
//           duration: 25,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       >
//         <img
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
//           alt="M&M Watermark"
//           className="w-96 h-96 object-contain"
//         />
//       </motion.div>

//       {/* Main Content - Positioned above watermark */}
//       <div className="relative z-10">
//         {/* Header */}
//         <section className="relative z-0 bg-gradient-to-b from-secondary/40 to-background/40 py-12 px-4">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h1 className="text-4xl font-serif font-bold mb-2 text-foreground">My Orders</h1>
//               <p className="text-muted-foreground">Track your M&M Scents orders</p>
//             </motion.div>
//           </div>
//         </section>

//         {/* Content */}
//         <section className="py-12 px-4">
//           <div className="max-w-7xl mx-auto">
//             {orders.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-20 bg-transparent backdrop-blur-none rounded-lg border border-gray-200/30 shadow-sm"
//               >
//                 <Package size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
//                 <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet</p>
//                 <motion.a
//                   href="/products"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg"
//                 >
//                   Start Shopping
//                 </motion.a>
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-4"
//               >
//                 {orders.map((order, idx) => (
//                   <motion.div
//                     key={order.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.1 }}
//                     className="bg-transparent backdrop-blur-none border border-gray-700/20 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative"
//                   >
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
//                       {/* Order ID & Date */}
//                       <div>
//                         <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Order ID</p>
//                         <p className="font-mono text-sm font-bold text-gray-800">{order.id.slice(0, 8)}...</p>
//                         <p className="text-xs text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
//                       </div>

//                       {/* Items Count */}
//                       <div>
//                         <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Items</p>
//                         <p className="text-lg font-bold text-gray-800">{order.items.length}</p>
//                         <p className="text-xs text-gray-500">Total: {order.items.reduce((sum, item) => sum + item.quantity, 0)} units</p>
//                       </div>

//                       {/* Total Amount */}
//                       <div>
//                         <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Total</p>
//                         <p className="text-lg font-bold text-primary">₹{order.total}</p>
//                       </div>

//                       {/* Status & Action */}
//                       <div className="flex flex-col gap-3 relative">
//                         <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)}`}>
//                           {getStatusIcon(order.status)}
//                           <span className="font-semibold capitalize">{order.status}</span>
//                         </div>
                        
//                         {/* View Details Button with Notification Dot */}
//                         <div className="relative">
//                           <motion.button
//                             onClick={() => handleViewDetails(order)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all w-full"
//                           >
//                             <Eye size={16} />
//                             View Details
//                           </motion.button>
                          
//                           {/* Notification Dot */}
//                           {hasUnreadNote(order) && (
//                             <motion.div
//                               initial={{ scale: 0 }}
//                               animate={{ scale: 1 }}
//                               className="absolute -top-1 -right-1"
//                             >
//                               <span className="relative flex h-4 w-4">
//                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                                 <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500">
//                                   <Bell className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
//                                 </span>
//                               </span>
//                             </motion.div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* Modal */}
//       {showModal && selectedOrder && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowModal(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
//           >
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-secondary to-background border-b border-border p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold">Order Details</h2>
//                 <p className="text-sm text-muted-foreground mt-1">ID: {selectedOrder.id}</p>
//               </div>
//               <motion.button
//                 onClick={() => setShowModal(false)}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-2xl font-bold text-muted-foreground hover:text-foreground"
//               >
//                 ×
//               </motion.button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-6">
//               {/* Status */}
//               <div className={`p-4 rounded-lg border-2 ${getStatusColor(selectedOrder.status)}`}>
//                 <div className="flex items-center gap-3 mb-2">
//                   {getStatusIcon(selectedOrder.status)}
//                   <span className="font-bold capitalize text-lg">{selectedOrder.status.toUpperCase()}</span>
//                 </div>
//               </div>

//               {/* Items */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Order Items</h3>
//                 <div className="space-y-3">
//                   {selectedOrder.items.map((item, idx) => (
//                     <motion.div
//                       key={idx}
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: idx * 0.1 }}
//                       className="flex gap-4 p-4 bg-secondary rounded-lg border border-border"
//                     >
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-20 h-20 object-cover rounded-lg"
//                       />
//                       <div className="flex-1">
//                         <h4 className="font-semibold">{item.name}</h4>
//                         <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
//                         <p className="font-bold text-primary">₹{item.price} each</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>

//               {/* Customer Info */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Delivery Information</h3>
//                 <div className="space-y-3 p-4 bg-secondary rounded-lg border border-border">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Email</p>
//                     <p className="font-semibold">{selectedOrder.userEmail}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Phone</p>
//                     <p className="font-semibold">{selectedOrder.userPhone}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Address</p>
//                     <p className="font-semibold">{selectedOrder.userAddress}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Admin Notes - Display with Animation */}
//               {selectedOrder.adminNotes && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="bg-blue-100 p-2 rounded-full">
//                       <Bell className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
//                         Admin Note
//                         <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
//                           {selectedOrder.adminNotesUpdatedAt ? 
//                             new Date(selectedOrder.adminNotesUpdatedAt).toLocaleDateString('en-IN', {
//                               day: 'numeric',
//                               month: 'short',
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             }) 
//                             : 'Recent'
//                           }
//                         </span>
//                       </h4>
//                       <p className="text-blue-800 leading-relaxed">{selectedOrder.adminNotes}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Totals */}
//               <div className="border-t border-border pt-4">
//                 <div className="flex justify-between items-center text-xl font-bold">
//                   <span>Total Amount:</span>
//                   <span className="text-primary">₹{selectedOrder.total}</span>
//                 </div>
//               </div>

//               {/* Close Button */}
//               <motion.button
//                 onClick={() => setShowModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// }





//without coloured status pending or confirmed
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Navbar from '@/components/Navbar';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Bell } from 'lucide-react';

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   quantity: number;
//   image: string;
// }

// interface Order {
//   id: string;
//   userId: string;
//   customerName: string;
//   email: string;           // ✅ RTDB se email
//   phoneNumber: string;     // ✅ RTDB se phoneNumber
//   address: string;         // ✅ RTDB se address
//   city: string;
//   zipCode: string;
//   items: OrderItem[];
//   subtotal: number;
//   deliveryCharge: number;
//   total: number;
//   status: 'pending' | 'dispatched' | 'delivered' | 'confirmed' | 'shipped' | 'cancelled';
//   createdAt: number;
//   orderNotes?: string;
//   adminNotes?: string;
//   adminNotesUpdatedAt?: number;
// }

// export default function OrdersPage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [viewedNotes, setViewedNotes] = useState<Set<string>>(new Set());

//   // Load viewed notes from localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('viewedOrderNotes');
//       if (saved) {
//         try {
//           setViewedNotes(new Set(JSON.parse(saved)));
//         } catch (e) {
//           console.error('Error loading viewed notes:', e);
//         }
//       }
//     }
//   }, []);

//   // Save viewed notes to localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('viewedOrderNotes', JSON.stringify([...viewedNotes]));
//     }
//   }, [viewedNotes]);

//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     // Fetch user's orders
//     const ordersRef = ref(rtdb, 'orders');
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const userOrders: Order[] = [];
//         const data = snapshot.val();

//         Object.keys(data).forEach((key) => {
//           const order = { id: key, ...data[key] } as Order;
//           if (order.userId === user.uid) {
//             userOrders.push(order);
//           }
//         });

//         // Sort by date (newest first)
//         userOrders.sort((a, b) => b.createdAt - a.createdAt);
//         setOrders(userOrders);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [user, authLoading, router]);

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="text-yellow-600" size={20} />;
//       case 'dispatched':
//       case 'shipped':
//         return <Truck className="text-blue-600" size={20} />;
//       case 'delivered':
//         return <CheckCircle className="text-green-600" size={20} />;
//       case 'confirmed':
//         return <CheckCircle className="text-blue-600" size={20} />;
//       case 'cancelled':
//         return <AlertCircle className="text-red-600" size={20} />;
//       default:
//         return <AlertCircle size={20} />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return 'bg-yellow-100 border-yellow-300 text-yellow-900';
//       case 'dispatched':
//       case 'shipped':
//         return 'bg-blue-100 border-blue-300 text-blue-900';
//       case 'delivered':
//         return 'bg-green-100 border-green-300 text-green-900';
//       case 'confirmed':
//         return 'bg-blue-100 border-blue-300 text-blue-900';
//       case 'cancelled':
//         return 'bg-red-100 border-red-300 text-red-900';
//       default:
//         return 'bg-gray-100 border-gray-300 text-gray-900';
//     }
//   };

//   const formatDate = (timestamp: number) => {
//     return new Date(timestamp).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get final price after discount
//   const getFinalPrice = (item: OrderItem) => {
//     if (item.discount && item.discount > 0) {
//       return item.price - item.discount;
//     }
//     return item.price;
//   };

//   // Check if order has unread admin note
//   const hasUnreadNote = (order: Order) => {
//     if (!order.adminNotes) return false;
//     const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
//     return !viewedNotes.has(noteKey);
//   };

//   // Mark note as viewed
//   const markNoteAsViewed = (order: Order) => {
//     if (order.adminNotes) {
//       const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
//       setViewedNotes(prev => new Set([...prev, noteKey]));
//     }
//   };

//   // Handle view details click
//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//     if (order.adminNotes) {
//       markNoteAsViewed(order);
//     }
//   };

//   // Format price
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-[80vh]">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//             className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background relative">
//       <Navbar />

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.08] z-0 flex items-center justify-center"
//         animate={{
//           scale: [1, 1.08, 1],
//         }}
//         transition={{
//           duration: 25,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       >
//         <img
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
//           alt="M&M Watermark"
//           className="w-96 h-96 object-contain"
//         />
//       </motion.div>

//       {/* Main Content */}
//       <div className="relative z-10">
//         {/* Header */}
//         <section className="relative z-0 bg-gradient-to-b from-secondary/40 to-background/40 py-12 px-4">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h1 className="text-4xl font-serif font-bold mb-2 text-foreground">My Orders</h1>
//               <p className="text-muted-foreground">Track your M&M Scents orders</p>
//             </motion.div>
//           </div>
//         </section>

//         {/* Content */}
//         <section className="py-12 px-4">
//           <div className="max-w-7xl mx-auto">
//             {orders.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-20 bg-transparent backdrop-blur-none rounded-lg border border-gray-200/30 shadow-sm"
//               >
//                 <Package size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
//                 <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet</p>
//                 <motion.a
//                   href="/products"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg"
//                 >
//                   Start Shopping
//                 </motion.a>
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-4"
//               >
//                 {orders.map((order, idx) => (
//                   <motion.div
//                     key={order.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.1 }}
//                     className="bg-transparent backdrop-blur-none border border-gray-700/20 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative"
//                   >
//                     <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
//                       {/* Order ID & Date */}
//                       <div>
//                         <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Order ID</p>
//                         <p className="font-mono text-sm font-bold text-gray-800">{order.id.slice(0, 8)}...</p>
//                         <p className="text-xs text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
//                       </div>

//                       {/* Items Count */}
//                       <div>
//                         <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Items</p>
//                         <p className="text-lg font-bold text-gray-800">{order.items.length}</p>
//                         <p className="text-xs text-gray-500">Total: {order.items.reduce((sum, item) => sum + item.quantity, 0)} units</p>
//                       </div>

//                       {/* Total Amount with Discount */}
//                       <div>
//                         <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Total</p>
//                         <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
//                         {order.deliveryCharge > 0 ? (
//                           <p className="text-xs text-gray-500">Delivery: {formatPrice(order.deliveryCharge)}</p>
//                         ) : (
//                           <p className="text-xs text-green-600">✅ Free Delivery</p>
//                         )}
//                       </div>

//                       {/* Status */}
//                       <div>
//                         <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Status</p>
//                         <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)}`}>
//                           {getStatusIcon(order.status)}
//                           <span className="font-semibold capitalize text-sm">{order.status}</span>
//                         </div>
//                       </div>

//                       {/* Action */}
//                       <div className="relative">
//                         <motion.button
//                           onClick={() => handleViewDetails(order)}
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all w-full"
//                         >
//                           <Eye size={16} />
//                           View Details
//                         </motion.button>
                        
//                         {hasUnreadNote(order) && (
//                           <motion.div
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             className="absolute -top-1 -right-1"
//                           >
//                             <span className="relative flex h-4 w-4">
//                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                               <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500">
//                                 <Bell className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
//                               </span>
//                             </span>
//                           </motion.div>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* Modal */}
//       {showModal && selectedOrder && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowModal(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
//           >
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-secondary to-background border-b border-border p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold">Order Details</h2>
//                 <p className="text-sm text-muted-foreground mt-1">ID: {selectedOrder.id}</p>
//               </div>
//               <motion.button
//                 onClick={() => setShowModal(false)}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-2xl font-bold text-muted-foreground hover:text-foreground"
//               >
//                 ×
//               </motion.button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-6">
//               {/* Status */}
//               <div className={`p-4 rounded-lg border-2 ${getStatusColor(selectedOrder.status)}`}>
//                 <div className="flex items-center gap-3 mb-2">
//                   {getStatusIcon(selectedOrder.status)}
//                   <span className="font-bold capitalize text-lg">{selectedOrder.status.toUpperCase()}</span>
//                 </div>
//               </div>

//               {/* Items with Discount */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Order Items</h3>
//                 <div className="space-y-3">
//                   {selectedOrder.items.map((item, idx) => {
//                     const finalPrice = getFinalPrice(item);
//                     return (
//                       <motion.div
//                         key={idx}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.1 }}
//                         className="flex gap-4 p-4 bg-secondary rounded-lg border border-border"
//                       >
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="w-20 h-20 object-cover rounded-lg"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e8e3dc" width="80" height="80"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         <div className="flex-1">
//                           <h4 className="font-semibold">{item.name}</h4>
//                           <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
//                           <div className="flex items-center gap-2">
//                             <p className="font-bold text-primary">{formatPrice(finalPrice)} each</p>
//                             {item.discount && item.discount > 0 && (
//                               <p className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</p>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-lg">{formatPrice(finalPrice * item.quantity)}</p>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* ✅ Customer Info - FIXED with correct RTDB fields */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Customer Information</h3>
//                 <div className="space-y-3 p-4 bg-secondary rounded-lg border border-border">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Full Name</p>
//                     <p className="font-semibold">{selectedOrder.customerName || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Email</p>
//                     <p className="font-semibold">{selectedOrder.email || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Phone Number</p>
//                     <p className="font-semibold">{selectedOrder.phoneNumber || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Delivery Address</p>
//                     <p className="font-semibold">{selectedOrder.address || 'N/A'}</p>
//                   </div>
//                   {selectedOrder.city && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">City</p>
//                       <p className="font-semibold">{selectedOrder.city}</p>
//                     </div>
//                   )}
//                   {selectedOrder.zipCode && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Zip Code</p>
//                       <p className="font-semibold">{selectedOrder.zipCode}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Price Summary */}
//               <div className="p-4 bg-secondary rounded-lg border border-border">
//                 <h3 className="text-lg font-bold mb-3">Price Summary</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal</span>
//                     <span className="font-medium">{formatPrice(selectedOrder.subtotal || 0)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge</span>
//                     <span className="font-medium">
//                       {selectedOrder.deliveryCharge > 0 
//                         ? formatPrice(selectedOrder.deliveryCharge)
//                         : 'Free Delivery ✅'
//                       }
//                     </span>
//                   </div>
//                   <div className="border-t border-border pt-2 flex justify-between">
//                     <span className="font-bold">Total</span>
//                     <span className="font-bold text-primary">{formatPrice(selectedOrder.total || 0)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Customer Order Notes */}
//               {selectedOrder.orderNotes && (
//                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <h4 className="font-bold text-yellow-800 mb-1">📝 Customer Note</h4>
//                   <p className="text-yellow-700">{selectedOrder.orderNotes}</p>
//                 </div>
//               )}

//               {/* Admin Notes */}
//               {selectedOrder.adminNotes && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="bg-blue-100 p-2 rounded-full">
//                       <Bell className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
//                         Admin Note
//                         <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
//                           {selectedOrder.adminNotesUpdatedAt ? 
//                             new Date(selectedOrder.adminNotesUpdatedAt).toLocaleDateString('en-IN', {
//                               day: 'numeric',
//                               month: 'short',
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             }) 
//                             : 'Recent'
//                           }
//                         </span>
//                       </h4>
//                       <p className="text-blue-800 leading-relaxed">{selectedOrder.adminNotes}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Close Button */}
//               <motion.button
//                 onClick={() => setShowModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// }




// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Navbar from '@/components/Navbar';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Bell, XCircle, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   quantity: number;
//   image: string;
// }

// interface Order {
//   id: string;
//   userId: string;
//   customerName: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   items: OrderItem[];
//   subtotal: number;
//   deliveryCharge: number;
//   total: number;
//   status: 'pending' | 'dispatched' | 'delivered' | 'confirmed' | 'shipped' | 'cancelled';
//   createdAt: number;
//   orderNotes?: string;
//   adminNotes?: string;
//   adminNotesUpdatedAt?: number;
// }

// export default function OrdersPage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const [viewedNotes, setViewedNotes] = useState<Set<string>>(new Set());
//   const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // desc = newest first

//   // Load viewed notes from localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem('viewedOrderNotes');
//       if (saved) {
//         try {
//           setViewedNotes(new Set(JSON.parse(saved)));
//         } catch (e) {
//           console.error('Error loading viewed notes:', e);
//         }
//       }
//     }
//   }, []);

//   // Save viewed notes to localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('viewedOrderNotes', JSON.stringify([...viewedNotes]));
//     }
//   }, [viewedNotes]);

//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     // Fetch user's orders
//     const ordersRef = ref(rtdb, 'orders');
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const userOrders: Order[] = [];
//         const data = snapshot.val();

//         Object.keys(data).forEach((key) => {
//           const order = { id: key, ...data[key] } as Order;
//           if (order.userId === user.uid) {
//             userOrders.push(order);
//           }
//         });

//         setOrders(userOrders);
//         applySorting(userOrders, sortOrder);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [user, authLoading, router]);

//   // ✅ Apply sorting function
//   const applySorting = (ordersList: Order[], order: 'asc' | 'desc') => {
//     const sorted = [...ordersList];
//     if (order === 'desc') {
//       sorted.sort((a, b) => b.createdAt - a.createdAt);
//     } else {
//       sorted.sort((a, b) => a.createdAt - b.createdAt);
//     }
//     setFilteredOrders(sorted);
//   };

//   // ✅ Toggle sort order
//   const toggleSortOrder = () => {
//     const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
//     setSortOrder(newOrder);
//     applySorting(orders, newOrder);
//   };

//   // ✅ Status icon based on status
//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return <Clock className="text-gray-500" size={20} />;
//       case 'shipped':
//         return <Truck className="text-blue-600" size={20} />;
//       case 'dispatched':
//         return <Truck className="text-purple-600" size={20} />;
//       case 'delivered':
//         return <CheckCircle className="text-green-600" size={20} />;
//       case 'confirmed':
//         return <CheckCircle className="text-green-600" size={20} />;
//       case 'cancelled':
//         return <XCircle className="text-red-500" size={20} />;
//       default:
//         return <AlertCircle className="text-gray-400" size={20} />;
//     }
//   };

//   // ✅ Status color
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'confirmed':
//         return 'bg-green-100 border-green-300 text-green-900';
//       case 'shipped':
//         return 'bg-blue-100 border-blue-300 text-blue-900';
//       case 'dispatched':
//         return 'bg-purple-100 border-purple-300 text-purple-900';
//       case 'delivered':
//         return 'bg-green-100 border-green-300 text-green-900';
//       case 'pending':
//         return 'bg-gray-100 border-gray-300 text-gray-600';
//       case 'cancelled':
//         return 'bg-red-100 border-red-300 text-red-700';
//       default:
//         return 'bg-gray-100 border-gray-300 text-gray-600';
//     }
//   };

//   // ✅ Get display status name
//   const getDisplayStatus = (status: string) => {
//     if (status === 'confirmed') {
//       return 'Delivered';
//     }
//     if (status === 'cancelled') {
//       return 'Cancelled';
//     }
//     return status;
//   };

//   // ✅ Get status message
//   const getStatusMessage = (status: string) => {
//     switch (status) {
//       case 'pending':
//         return '⏳ Waiting for admin confirmation';
//       case 'confirmed':
//         return '✅ Order confirmed';
//       case 'shipped':
//         return '🚚 Order has been shipped';
//       case 'dispatched':
//         return '📦 Order has been dispatched';
//       case 'delivered':
//         return '📦 Order delivered successfully';
//       case 'cancelled':
//         return '❌ Order has been cancelled';
//       default:
//         return '';
//     }
//   };

//   const formatDate = (timestamp: number) => {
//     return new Date(timestamp).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get final price after discount
//   const getFinalPrice = (item: OrderItem) => {
//     if (item.discount && item.discount > 0) {
//       return item.price - item.discount;
//     }
//     return item.price;
//   };

//   // Check if order has unread admin note
//   const hasUnreadNote = (order: Order) => {
//     if (!order.adminNotes) return false;
//     const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
//     return !viewedNotes.has(noteKey);
//   };

//   // Mark note as viewed
//   const markNoteAsViewed = (order: Order) => {
//     if (order.adminNotes) {
//       const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
//       setViewedNotes(prev => new Set([...prev, noteKey]));
//     }
//   };

//   // Handle view details click
//   const handleViewDetails = (order: Order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//     if (order.adminNotes) {
//       markNoteAsViewed(order);
//     }
//   };

//   // Format price
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center min-h-[80vh]">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//             className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background relative">
//       <Navbar />

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.08] z-0 flex items-center justify-center"
//         animate={{
//           scale: [1, 1.08, 1],
//         }}
//         transition={{
//           duration: 25,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       >
//         <img
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
//           alt="M&M Watermark"
//           className="w-96 h-96 object-contain"
//         />
//       </motion.div>

//       {/* Main Content */}
//       <div className="relative z-10">
//         {/* Header */}
//         <section className="relative z-0 bg-gradient-to-b from-secondary/40 to-background/40 py-12 px-4">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//             >
//               <h1 className="text-4xl font-serif font-bold mb-2 text-foreground">My Orders</h1>
//               <p className="text-muted-foreground">Track your M&M Scents orders</p>
//             </motion.div>
//           </div>
//         </section>

//         {/* Content */}
//         <section className="py-12 px-4">
//           <div className="max-w-7xl mx-auto">
//             {/* ✅ Sort Button */}
//             <div className="flex justify-end mb-6">
//               <motion.button
//                 onClick={toggleSortOrder}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-lg hover:bg-muted transition-colors"
//               >
//                 <ArrowUpDown size={18} className="text-muted-foreground" />
//                 <span className="text-sm font-medium text-foreground">
//                   Sort: {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
//                 </span>
//                 {sortOrder === 'desc' ? (
//                   <ArrowDown size={16} className="text-primary" />
//                 ) : (
//                   <ArrowUp size={16} className="text-primary" />
//                 )}
//               </motion.button>
//             </div>

//             {filteredOrders.length === 0 ? (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-20 bg-transparent backdrop-blur-none rounded-lg border border-gray-200/30 shadow-sm"
//               >
//                 <Package size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
//                 <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet</p>
//                 <motion.a
//                   href="/products"
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg"
//                 >
//                   Start Shopping
//                 </motion.a>
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="space-y-4"
//               >
//                 {filteredOrders.map((order, idx) => {
//                   const displayStatus = getDisplayStatus(order.status);
//                   const statusMessage = getStatusMessage(order.status);
//                   return (
//                     <motion.div
//                       key={order.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: idx * 0.1 }}
//                       className="bg-transparent backdrop-blur-none border border-gray-700/20 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative"
//                     >
//                       <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
//                         {/* Order ID & Date */}
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Order ID</p>
//                           <p className="font-mono text-sm font-bold text-gray-800">{order.id.slice(0, 8)}...</p>
//                           <p className="text-xs text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
//                         </div>

//                         {/* Items Count */}
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Items</p>
//                           <p className="text-lg font-bold text-gray-800">{order.items.length}</p>
//                           <p className="text-xs text-gray-500">Total: {order.items.reduce((sum, item) => sum + item.quantity, 0)} units</p>
//                         </div>

//                         {/* Total Amount with Discount */}
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Total</p>
//                           <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
//                           {order.deliveryCharge > 0 ? (
//                             <p className="text-xs text-gray-500">Delivery: {formatPrice(order.deliveryCharge)}</p>
//                           ) : (
//                             <p className="text-xs text-green-600">✅ Free Delivery</p>
//                           )}
//                         </div>

//                         {/* ✅ Status - Display name changed */}
//                         <div>
//                           <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Status</p>
//                           <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)}`}>
//                             {getStatusIcon(order.status)}
//                             <span className={`font-semibold capitalize text-sm ${
//                               order.status === 'cancelled' ? 'text-red-700' :
//                               order.status === 'pending' ? 'text-gray-600' :
//                               'text-inherit'
//                             }`}>
//                               {displayStatus}
//                             </span>
//                           </div>
//                           {/* ✅ Status message */}
//                           {statusMessage && (
//                             <p className={`text-xs mt-1 ${
//                               order.status === 'confirmed' ? 'text-green-600' :
//                               order.status === 'pending' ? 'text-gray-500' :
//                               order.status === 'shipped' ? 'text-blue-600' :
//                               order.status === 'dispatched' ? 'text-purple-600' :
//                               order.status === 'delivered' ? 'text-green-600' :
//                               order.status === 'cancelled' ? 'text-red-500' :
//                               'text-gray-500'
//                             }`}>
//                               {statusMessage}
//                             </p>
//                           )}
//                         </div>

//                         {/* Action */}
//                         <div className="relative">
//                           <motion.button
//                             onClick={() => handleViewDetails(order)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all w-full"
//                           >
//                             <Eye size={16} />
//                             View Details
//                           </motion.button>
                          
//                           {hasUnreadNote(order) && (
//                             <motion.div
//                               initial={{ scale: 0 }}
//                               animate={{ scale: 1 }}
//                               className="absolute -top-1 -right-1"
//                             >
//                               <span className="relative flex h-4 w-4">
//                                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                                 <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500">
//                                   <Bell className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
//                                 </span>
//                               </span>
//                             </motion.div>
//                           )}
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             )}
//           </div>
//         </section>
//       </div>

//       {/* Modal */}
//       {showModal && selectedOrder && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//           onClick={() => setShowModal(false)}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
//           >
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-secondary to-background border-b border-border p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-serif font-bold">Order Details</h2>
//                 <p className="text-sm text-muted-foreground mt-1">ID: {selectedOrder.id}</p>
//               </div>
//               <motion.button
//                 onClick={() => setShowModal(false)}
//                 whileHover={{ scale: 1.1 }}
//                 className="text-2xl font-bold text-muted-foreground hover:text-foreground"
//               >
//                 ×
//               </motion.button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-6">
//               {/* ✅ Status */}
//               <div className={`p-4 rounded-lg border-2 ${getStatusColor(selectedOrder.status)}`}>
//                 <div className="flex items-center gap-3">
//                   {getStatusIcon(selectedOrder.status)}
//                   <span className={`font-bold capitalize text-lg ${
//                     selectedOrder.status === 'cancelled' ? 'text-red-700' :
//                     selectedOrder.status === 'pending' ? 'text-gray-600' :
//                     'text-inherit'
//                   }`}>
//                     {getDisplayStatus(selectedOrder.status)}
//                   </span>
//                 </div>
//                 <p className={`text-sm mt-2 ml-9 ${
//                   selectedOrder.status === 'confirmed' ? 'text-green-600' :
//                   selectedOrder.status === 'pending' ? 'text-gray-500' :
//                   selectedOrder.status === 'shipped' ? 'text-blue-600' :
//                   selectedOrder.status === 'dispatched' ? 'text-purple-600' :
//                   selectedOrder.status === 'delivered' ? 'text-green-600' :
//                   selectedOrder.status === 'cancelled' ? 'text-red-500' :
//                   'text-gray-500'
//                 }`}>
//                   {getStatusMessage(selectedOrder.status)}
//                 </p>
//               </div>

//               {/* Items */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Order Items</h3>
//                 <div className="space-y-3">
//                   {selectedOrder.items.map((item, idx) => {
//                     const finalPrice = getFinalPrice(item);
//                     return (
//                       <motion.div
//                         key={idx}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.1 }}
//                         className="flex gap-4 p-4 bg-secondary rounded-lg border border-border"
//                       >
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="w-20 h-20 object-cover rounded-lg"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e8e3dc" width="80" height="80"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         <div className="flex-1">
//                           <h4 className="font-semibold">{item.name}</h4>
//                           <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
//                           <div className="flex items-center gap-2">
//                             <p className="font-bold text-primary">{formatPrice(finalPrice)} each</p>
//                             {item.discount && item.discount > 0 && (
//                               <p className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</p>
//                             )}
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-lg">{formatPrice(finalPrice * item.quantity)}</p>
//                         </div>
//                       </motion.div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Customer Info */}
//               <div>
//                 <h3 className="text-lg font-bold mb-4">Customer Information</h3>
//                 <div className="space-y-3 p-4 bg-secondary rounded-lg border border-border">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Full Name</p>
//                     <p className="font-semibold">{selectedOrder.customerName || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Email</p>
//                     <p className="font-semibold">{selectedOrder.email || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Phone Number</p>
//                     <p className="font-semibold">{selectedOrder.phoneNumber || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Delivery Address</p>
//                     <p className="font-semibold">{selectedOrder.address || 'N/A'}</p>
//                   </div>
//                   {selectedOrder.city && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">City</p>
//                       <p className="font-semibold">{selectedOrder.city}</p>
//                     </div>
//                   )}
//                   {selectedOrder.zipCode && (
//                     <div>
//                       <p className="text-sm text-muted-foreground">Zip Code</p>
//                       <p className="font-semibold">{selectedOrder.zipCode}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Price Summary */}
//               <div className="p-4 bg-secondary rounded-lg border border-border">
//                 <h3 className="text-lg font-bold mb-3">Price Summary</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal</span>
//                     <span className="font-medium">{formatPrice(selectedOrder.subtotal || 0)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge</span>
//                     <span className="font-medium">
//                       {selectedOrder.deliveryCharge > 0 
//                         ? formatPrice(selectedOrder.deliveryCharge)
//                         : 'Free Delivery ✅'
//                       }
//                     </span>
//                   </div>
//                   <div className="border-t border-border pt-2 flex justify-between">
//                     <span className="font-bold">Total</span>
//                     <span className="font-bold text-primary">{formatPrice(selectedOrder.total || 0)}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Customer Order Notes */}
//               {selectedOrder.orderNotes && (
//                 <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <h4 className="font-bold text-yellow-800 mb-1">📝 Customer Note</h4>
//                   <p className="text-yellow-700">{selectedOrder.orderNotes}</p>
//                 </div>
//               )}

//               {/* Admin Notes */}
//               {selectedOrder.adminNotes && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm"
//                 >
//                   <div className="flex items-start gap-3">
//                     <div className="bg-blue-100 p-2 rounded-full">
//                       <Bell className="w-4 h-4 text-blue-600" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
//                         Admin Note
//                         <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
//                           {selectedOrder.adminNotesUpdatedAt ? 
//                             new Date(selectedOrder.adminNotesUpdatedAt).toLocaleDateString('en-IN', {
//                               day: 'numeric',
//                               month: 'short',
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             }) 
//                             : 'Recent'
//                           }
//                         </span>
//                       </h4>
//                       <p className="text-blue-800 leading-relaxed">{selectedOrder.adminNotes}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* Close Button */}
//               <motion.button
//                 onClick={() => setShowModal(false)}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
//               >
//                 Close
//               </motion.button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye, Bell, XCircle } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'dispatched' | 'delivered' | 'confirmed' | 'shipped' | 'cancelled';
  createdAt: number;
  orderNotes?: string;
  adminNotes?: string;
  adminNotesUpdatedAt?: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewedNotes, setViewedNotes] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load viewed notes from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('viewedOrderNotes');
      if (saved) {
        try {
          setViewedNotes(new Set(JSON.parse(saved)));
        } catch (e) {
          console.error('Error loading viewed notes:', e);
        }
      }
    }
  }, []);

  // Save viewed notes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('viewedOrderNotes', JSON.stringify([...viewedNotes]));
    }
  }, [viewedNotes]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const ordersRef = ref(rtdb, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const userOrders: Order[] = [];
        const data = snapshot.val();

        Object.keys(data).forEach((key) => {
          const order = { id: key, ...data[key] } as Order;
          if (order.userId === user.uid) {
            userOrders.push(order);
          }
        });

        setOrders(userOrders);
        applyFilters(userOrders, statusFilter);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, router]);

  // ✅ Apply status filter only (no sorting)
  const applyFilters = (ordersList: Order[], status: string) => {
    let filtered = [...ordersList];

    // ✅ Status filter
    if (status !== 'all') {
      filtered = filtered.filter(o => o.status === status);
    }

    // ✅ Default sorting: newest first (descending)
    filtered.sort((a, b) => b.createdAt - a.createdAt);

    setFilteredOrders(filtered);
  };

  // ✅ Change status filter
  const setStatusFilterHandler = (status: string) => {
    setStatusFilter(status);
    applyFilters(orders, status);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-gray-500" size={20} />;
      case 'shipped':
        return <Truck className="text-blue-600" size={20} />;
      case 'dispatched':
        return <Truck className="text-purple-600" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'confirmed':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-900';
      case 'shipped':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'dispatched':
        return 'bg-purple-100 border-purple-300 text-purple-900';
      case 'delivered':
        return 'bg-green-100 border-green-300 text-green-900';
      case 'pending':
        return 'bg-gray-100 border-gray-300 text-gray-600';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getDisplayStatus = (status: string) => {
    if (status === 'confirmed') return 'Delivered';
    if (status === 'cancelled') return 'Cancelled';
    return status;
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳ Waiting for admin confirmation';
      case 'confirmed':
        return '✅ Order confirmed';
      case 'shipped':
        return '🚚 Order has been shipped';
      case 'dispatched':
        return '📦 Order has been dispatched';
      case 'delivered':
        return '📦 Order delivered successfully';
      case 'cancelled':
        return '❌ Order has been cancelled';
      default:
        return '';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFinalPrice = (item: OrderItem) => {
    if (item.discount && item.discount > 0) {
      return item.price - item.discount;
    }
    return item.price;
  };

  const hasUnreadNote = (order: Order) => {
    if (!order.adminNotes) return false;
    const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
    return !viewedNotes.has(noteKey);
  };

  const markNoteAsViewed = (order: Order) => {
    if (order.adminNotes) {
      const noteKey = `${order.id}_${order.adminNotesUpdatedAt || order.createdAt}`;
      setViewedNotes(prev => new Set([...prev, noteKey]));
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
    if (order.adminNotes) {
      markNoteAsViewed(order);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // ✅ Get count for each status
  const getStatusCount = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.08] z-0 flex items-center justify-center"
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
          alt="M&M Watermark"
          className="w-96 h-96 object-contain"
        />
      </motion.div>

      <div className="relative z-10">
        <section className="relative z-0 bg-gradient-to-b from-secondary/40 to-background/40 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-serif font-bold mb-2 text-foreground">My Orders</h1>
              <p className="text-muted-foreground">Track your M&M Scents orders</p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* ✅ Status Filter Buttons - Only */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setStatusFilterHandler('all')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  statusFilter === 'all'
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-secondary text-foreground hover:bg-muted border border-border'
                }`}
              >
                All ({getStatusCount('all')})
              </button>
              <button
                onClick={() => setStatusFilterHandler('pending')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-500 text-white shadow-md'
                    : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                }`}
              >
                ⏳ Pending ({getStatusCount('pending')})
              </button>
              <button
                onClick={() => setStatusFilterHandler('dispatched')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  statusFilter === 'dispatched'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                📦 Dispatched ({getStatusCount('dispatched')})
              </button>
              <button
                onClick={() => setStatusFilterHandler('delivered')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  statusFilter === 'delivered'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                }`}
              >
                ✅ Delivered ({getStatusCount('delivered')})
              </button>
              <button
                onClick={() => setStatusFilterHandler('cancelled')}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  statusFilter === 'cancelled'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                ❌ Cancelled ({getStatusCount('cancelled')})
              </button>
            </div>

            {/* ✅ Show filter info */}
            {statusFilter !== 'all' && (
              <div className="text-sm text-muted-foreground mb-4">
                Showing <span className="font-semibold text-foreground capitalize">{statusFilter}</span> orders
                <span className="ml-2 font-semibold text-foreground">
                  ({filteredOrders.length} orders)
                </span>
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-transparent backdrop-blur-none rounded-lg border border-gray-200/30 shadow-sm"
              >
                <Package size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-600 mb-6">
                  {orders.length > 0 
                    ? `No ${statusFilter !== 'all' ? statusFilter : ''} orders found` 
                    : "You haven't placed any orders yet"}
                </p>
                {orders.length > 0 && statusFilter !== 'all' ? (
                  <button
                    onClick={() => setStatusFilterHandler('all')}
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg"
                  >
                    View All Orders
                  </button>
                ) : (
                  <motion.a
                    href="/products"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg"
                  >
                    Start Shopping
                  </motion.a>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {filteredOrders.map((order, idx) => {
                  const displayStatus = getDisplayStatus(order.status);
                  const statusMessage = getStatusMessage(order.status);
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                      className="bg-transparent backdrop-blur-none border border-gray-700/20 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all relative"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Order ID</p>
                          <p className="font-mono text-sm font-bold text-gray-800">{order.id.slice(0, 8)}...</p>
                          <p className="text-xs text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Items</p>
                          <p className="text-lg font-bold text-gray-800">{order.items.length}</p>
                          <p className="text-xs text-gray-500">Total: {order.items.reduce((sum, item) => sum + item.quantity, 0)} units</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Total</p>
                          <p className="text-lg font-bold text-primary">{formatPrice(order.total)}</p>
                          {order.deliveryCharge > 0 ? (
                            <p className="text-xs text-gray-500">Delivery: {formatPrice(order.deliveryCharge)}</p>
                          ) : (
                            <p className="text-xs text-green-600">✅ Free Delivery</p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Status</p>
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className={`font-semibold capitalize text-sm ${
                              order.status === 'cancelled' ? 'text-red-700' :
                              order.status === 'pending' ? 'text-gray-600' :
                              'text-inherit'
                            }`}>
                              {displayStatus}
                            </span>
                          </div>
                          {statusMessage && (
                            <p className={`text-xs mt-1 ${
                              order.status === 'confirmed' ? 'text-green-600' :
                              order.status === 'pending' ? 'text-gray-500' :
                              order.status === 'shipped' ? 'text-blue-600' :
                              order.status === 'dispatched' ? 'text-purple-600' :
                              order.status === 'delivered' ? 'text-green-600' :
                              order.status === 'cancelled' ? 'text-red-500' :
                              'text-gray-500'
                            }`}>
                              {statusMessage}
                            </p>
                          )}
                        </div>

                        <div className="relative">
                          <motion.button
                            onClick={() => handleViewDetails(order)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all w-full"
                          >
                            <Eye size={16} />
                            View Details
                          </motion.button>
                          
                          {hasUnreadNote(order) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1"
                            >
                              <span className="relative flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500">
                                  <Bell className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                                </span>
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
          >
            <div className="sticky top-0 bg-gradient-to-r from-secondary to-background border-b border-border p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold">Order Details</h2>
                <p className="text-sm text-muted-foreground mt-1">ID: {selectedOrder.id}</p>
              </div>
              <motion.button
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-muted-foreground hover:text-foreground"
              >
                ×
              </motion.button>
            </div>

            <div className="p-6 space-y-6">
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(selectedOrder.status)}`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(selectedOrder.status)}
                  <span className={`font-bold capitalize text-lg ${
                    selectedOrder.status === 'cancelled' ? 'text-red-700' :
                    selectedOrder.status === 'pending' ? 'text-gray-600' :
                    'text-inherit'
                  }`}>
                    {getDisplayStatus(selectedOrder.status)}
                  </span>
                </div>
                <p className={`text-sm mt-2 ml-9 ${
                  selectedOrder.status === 'confirmed' ? 'text-green-600' :
                  selectedOrder.status === 'pending' ? 'text-gray-500' :
                  selectedOrder.status === 'shipped' ? 'text-blue-600' :
                  selectedOrder.status === 'dispatched' ? 'text-purple-600' :
                  selectedOrder.status === 'delivered' ? 'text-green-600' :
                  selectedOrder.status === 'cancelled' ? 'text-red-500' :
                  'text-gray-500'
                }`}>
                  {getStatusMessage(selectedOrder.status)}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => {
                    const finalPrice = getFinalPrice(item);
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4 p-4 bg-secondary rounded-lg border border-border"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e8e3dc" width="80" height="80"/%3E%3C/svg%3E';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-primary">{formatPrice(finalPrice)} each</p>
                            {item.discount && item.discount > 0 && (
                              <p className="text-xs text-gray-400 line-through">{formatPrice(item.price)}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatPrice(finalPrice * item.quantity)}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Customer Information</h3>
                <div className="space-y-3 p-4 bg-secondary rounded-lg border border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{selectedOrder.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedOrder.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-semibold">{selectedOrder.phoneNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-semibold">{selectedOrder.address || 'N/A'}</p>
                  </div>
                  {selectedOrder.city && (
                    <div>
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="font-semibold">{selectedOrder.city}</p>
                    </div>
                  )}
                  {selectedOrder.zipCode && (
                    <div>
                      <p className="text-sm text-muted-foreground">Zip Code</p>
                      <p className="font-semibold">{selectedOrder.zipCode}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg border border-border">
                <h3 className="text-lg font-bold mb-3">Price Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(selectedOrder.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span className="font-medium">
                      {selectedOrder.deliveryCharge > 0 
                        ? formatPrice(selectedOrder.deliveryCharge)
                        : 'Free Delivery ✅'
                      }
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">{formatPrice(selectedOrder.total || 0)}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.orderNotes && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-bold text-yellow-800 mb-1">📝 Customer Note</h4>
                  <p className="text-yellow-700">{selectedOrder.orderNotes}</p>
                </div>
              )}

              {selectedOrder.adminNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Bell className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                        Admin Note
                        <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                          {selectedOrder.adminNotesUpdatedAt ? 
                            new Date(selectedOrder.adminNotesUpdatedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) 
                            : 'Recent'
                          }
                        </span>
                      </h4>
                      <p className="text-blue-800 leading-relaxed">{selectedOrder.adminNotes}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.button
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}