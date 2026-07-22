// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, update, get } from 'firebase/database';
// import { ArrowLeft, MessageCircle, Eye, TrendingUp, Clock, FileText, X } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   discount?: number;
// }

// interface Order {
//   id: string;
//   customerName: string;
//   phoneNumber: string;
//   email: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   items: OrderItem[];
//   total: number;
//   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
//   createdAt: string;
//   orderNotes?: string;
//   adminNotes?: string;  // New field for admin notes
// }

// const statusColors: Record<string, string> = {
//   pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//   confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
//   shipped: 'bg-purple-100 text-purple-800 border-purple-300',
//   delivered: 'bg-green-100 text-green-800 border-green-300',
//   cancelled: 'bg-red-100 text-red-800 border-red-300'
// };

// const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// // Only "confirmed" status counts as total income
// const CONFIRMED_STATUS = 'confirmed';

// // Statuses that count as pending income (all except confirmed and cancelled)
// const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// export default function AdminOrdersPage() {
//   const { user, isAdmin, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [showNoteModal, setShowNoteModal] = useState(false);
//   const [noteOrderId, setNoteOrderId] = useState<string | null>(null);
//   const [noteText, setNoteText] = useState('');
//   const [currentNote, setCurrentNote] = useState('');
//   const [savingNote, setSavingNote] = useState(false);

//   // Check admin access - wait for auth to load first
//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch orders from RTDB
//   useEffect(() => {
//     if (!isAdmin) return;

//     const ordersRef = ref(rtdb, 'orders');
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const ordersData: Order[] = [];
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           ordersData.push({
//             id: key,
//             ...data[key]
//           } as Order);
//         });
        
//         // Sort by newest first
//         ordersData.sort((a, b) => 
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
        
//         setOrders(ordersData);
//       } else {
//         setOrders([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   // Calculate income statistics
//   const calculateIncome = () => {
//     let totalIncome = 0;      // Only from "confirmed" orders
//     let pendingIncome = 0;    // From "pending", "shipped", "delivered" orders

//     orders.forEach(order => {
//       // Skip cancelled orders
//       if (order.status === 'cancelled') return;

//       // Total Income: ONLY "confirmed" orders
//       if (order.status === CONFIRMED_STATUS) {
//         totalIncome += order.total;
//       } 
//       // Pending Income: "pending", "shipped", "delivered" orders
//       else if (PENDING_STATUSES.includes(order.status)) {
//         pendingIncome += order.total;
//       }
//     });

//     return { totalIncome, pendingIncome };
//   };

//   const { totalIncome, pendingIncome } = calculateIncome();

//   // Count orders by status for display
//   const pendingCount = orders.filter(o => PENDING_STATUSES.includes(o.status)).length;
//   const confirmedCount = orders.filter(o => o.status === CONFIRMED_STATUS).length;

//   // Restore stock function (add stock back)
//   const restoreStock = async (items: OrderItem[]) => {
//     for (const item of items) {
//       try {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = currentStock + item.quantity;
          
//           await update(productRef, {
//             stock: newStock
//           });
//           console.log(`✅ Stock restored for ${item.name}: ${currentStock} -> ${newStock}`);
//         }
//       } catch (error) {
//         console.error(`Error restoring stock for ${item.name}:`, error);
//       }
//     }
//   };

//   // Cut stock function (subtract stock)
//   const cutStock = async (items: OrderItem[]) => {
//     for (const item of items) {
//       try {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = Math.max(0, currentStock - item.quantity);
          
//           await update(productRef, {
//             stock: newStock
//           });
//           console.log(`✅ Stock cut for ${item.name}: ${currentStock} -> ${newStock}`);
//         }
//       } catch (error) {
//         console.error(`Error cutting stock for ${item.name}:`, error);
//       }
//     }
//   };

//   const handleStatusChange = async (orderId: string, newStatus: string, order: Order) => {
//     const oldStatus = order.status;

//     // If status is being changed to cancelled
//     if (newStatus === 'cancelled') {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: 'This will cancel the order and restore all items to stock!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, cancel order!',
//         cancelButtonText: 'No, keep it'
//       });

//       if (!result.isConfirmed) {
//         return;
//       }

//       try {
//         // Restore stock for all items in the order
//         await restoreStock(order.items);
        
//         // Update order status to cancelled
//         const orderRef = ref(rtdb, `orders/${orderId}`);
//         await update(orderRef, {
//           status: newStatus,
//           updatedAt: new Date().toISOString()
//         });

//         await Swal.fire({
//           icon: 'success',
//           title: 'Order Cancelled!',
//           text: 'Order has been cancelled and stock has been restored.',
//           timer: 2000,
//           showConfirmButton: false
//         });
//       } catch (error) {
//         console.error('[v0] Error cancelling order:', error);
//         await Swal.fire({
//           icon: 'error',
//           title: 'Error!',
//           text: 'Failed to cancel order. Please try again.'
//         });
//       }
//       return;
//     }

//     // If changing from cancelled to any other status (pending/confirmed/shipped/delivered)
//     if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: 'This will cut stock for all items in this order!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, restore order!',
//         cancelButtonText: 'No, keep cancelled'
//       });

//       if (!result.isConfirmed) {
//         return;
//       }

//       try {
//         // Cut stock (subtract) for all items
//         await cutStock(order.items);
        
//         // Update order status
//         const orderRef = ref(rtdb, `orders/${orderId}`);
//         await update(orderRef, {
//           status: newStatus,
//           updatedAt: new Date().toISOString()
//         });

//         await Swal.fire({
//           icon: 'success',
//           title: 'Order Restored!',
//           text: `Order has been restored to ${newStatus} and stock has been updated.`,
//           timer: 2000,
//           showConfirmButton: false
//         });
//       } catch (error) {
//         console.error('[v0] Error restoring order:', error);
//         await Swal.fire({
//           icon: 'error',
//           title: 'Error!',
//           text: 'Failed to restore order. Please try again.'
//         });
//       }
//       return;
//     }

//     // For normal status changes (pending -> confirmed -> shipped -> delivered)
//     try {
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await update(orderRef, {
//         status: newStatus,
//         updatedAt: new Date().toISOString()
//       });

//       await Swal.fire({
//         icon: 'success',
//         title: 'Status Updated!',
//         text: `Order status changed to ${newStatus}`,
//         timer: 1500,
//         showConfirmButton: false
//       });
//     } catch (error) {
//       console.error('[v0] Error updating order:', error);
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'Failed to update order status. Please try again.'
//       });
//     }
//   };

//   // Wrapper function to handle status change with SweetAlert
//   const onStatusChange = async (orderId: string, newStatus: string) => {
//     const order = orders.find(o => o.id === orderId);
//     if (!order) return;
    
//     // If changing to same status, do nothing
//     if (order.status === newStatus) return;

//     await handleStatusChange(orderId, newStatus, order);
//   };

//   // Handle adding/editing admin note
//   const handleNoteClick = (order: Order) => {
//     setNoteOrderId(order.id);
//     setCurrentNote(order.adminNotes || '');
//     setNoteText(order.adminNotes || '');
//     setShowNoteModal(true);
//   };

//   const handleSaveNote = async () => {
//     if (!noteOrderId) return;
    
//     setSavingNote(true);
//     try {
//       const orderRef = ref(rtdb, `orders/${noteOrderId}`);
//       await update(orderRef, {
//         adminNotes: noteText,
//         updatedAt: new Date().toISOString()
//       });

//       // Update local state
//       setOrders(prevOrders => 
//         prevOrders.map(order => 
//           order.id === noteOrderId 
//             ? { ...order, adminNotes: noteText }
//             : order
//         )
//       );

//       await Swal.fire({
//         icon: 'success',
//         title: 'Note Saved!',
//         text: 'Admin note has been added to the order.',
//         timer: 1500,
//         showConfirmButton: false
//       });

//       setShowNoteModal(false);
//       setNoteText('');
//       setNoteOrderId(null);
//       setCurrentNote('');
//     } catch (error) {
//       console.error('Error saving note:', error);
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'Failed to save note. Please try again.'
//       });
//     } finally {
//       setSavingNote(false);
//     }
//   };

//   const filteredOrders = filterStatus === 'all' 
//     ? orders 
//     : orders.filter(o => o.status === filterStatus);

//   const whatsappUrl = (phoneNumber: string, orderID: string) => {
//     const message = encodeURIComponent(
//       `Hi! Your order #${orderID} has been confirmed. We will contact you soon with delivery details.`
//     );
//     return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
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
//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground">
//                 <ArrowLeft size={24} />
//               </Link>
//               <h1 className="text-3xl font-bold">Orders Management</h1>
//             </div>
//             <div className="text-right">
//               <p className="text-2xl font-bold text-primary">{orders.length}</p>
//               <p className="text-sm text-muted-foreground">Total Orders</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Income Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//           {/* Total Income Card - Only Confirmed Orders */}
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-700 font-medium mb-1">💰 Total Income</p>
//                 <p className="text-3xl font-bold text-green-800">
//                   PKR {totalIncome.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-green-600 mt-1">
//                   {confirmedCount} confirmed orders
//                 </p>
//                 <p className="text-xs text-green-600">
//                   (Only confirmed orders included)
//                 </p>
//               </div>
//               <div className="bg-green-200 p-3 rounded-full">
//                 <TrendingUp className="w-6 h-6 text-green-700" />
//               </div>
//             </div>
//           </motion.div>

//           {/* Pending Income Card - Pending, Shipped, Delivered Orders */}
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-yellow-700 font-medium mb-1">⏳ Pending Income</p>
//                 <p className="text-3xl font-bold text-yellow-800">
//                   PKR {pendingIncome.toLocaleString()}
//                 </p>
//                 <p className="text-xs text-yellow-600 mt-1">
//                   {pendingCount} orders (Pending, Shipped, Delivered)
//                 </p>
//                 <p className="text-xs text-yellow-600">
//                   (All non-confirmed & non-cancelled orders)
//                 </p>
//               </div>
//               <div className="bg-yellow-200 p-3 rounded-full">
//                 <Clock className="w-6 h-6 text-yellow-700" />
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Status Filter */}
//         <div className="flex gap-2 mb-8 flex-wrap">
//           <button
//             onClick={() => setFilterStatus('all')}
//             className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//               filterStatus === 'all'
//                 ? 'bg-primary text-white'
//                 : 'bg-secondary text-foreground hover:bg-muted'
//             }`}
//           >
//             All ({orders.length})
//           </button>
//           {statusOptions.map((status) => {
//             const count = orders.filter(o => o.status === status).length;
//             return (
//               <button
//                 key={status}
//                 onClick={() => setFilterStatus(status)}
//                 className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
//                   filterStatus === status
//                     ? 'bg-primary text-white'
//                     : 'bg-secondary text-foreground hover:bg-muted'
//                 }`}
//               >
//                 {status} ({count})
//               </button>
//             );
//           })}
//         </div>

//         {/* Orders List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading orders...</p>
//           </div>
//         ) : filteredOrders.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="space-y-4"
//           >
//             {filteredOrders.map((order) => (
//               <motion.div
//                 key={order.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-card rounded-lg border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 {/* Order Header */}
//                 <div className="p-4 bg-secondary border-b border-border">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Order ID</p>
//                       <p className="font-mono font-semibold text-sm">{order.id}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Customer</p>
//                       <p className="font-semibold text-sm">{order.customerName}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Order Date</p>
//                       <p className="font-semibold text-sm">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Amount</p>
//                       <p className="font-bold text-lg text-primary">PKR {Math.round(order.total).toLocaleString()}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Details */}
//                 <div className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                     {/* Customer Info */}
//                     <div>
//                       <h3 className="font-semibold mb-3 text-foreground">Customer Info</h3>
//                       <div className="text-sm space-y-1 text-muted-foreground">
//                         <p>📱 {order.phoneNumber}</p>
//                         <p>📧 {order.email}</p>
//                         <p>📍 {order.address}, {order.city} - {order.zipCode}</p>
//                       </div>
//                     </div>

//                     {/* Items */}
//                     <div>
//                       <h3 className="font-semibold mb-3 text-foreground">Items</h3>
//                       <div className="text-sm space-y-1">
//                         {order.items.map((item, idx) => (
//                           <p key={idx} className="text-muted-foreground">
//                             {item.name} x{item.quantity}
//                           </p>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Status & Actions */}
//                     <div>
//                       <h3 className="font-semibold mb-3 text-foreground">Status</h3>
//                       <select
//                         value={order.status}
//                         onChange={(e) => onStatusChange(order.id, e.target.value)}
//                         className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${statusColors[order.status]} cursor-pointer`}
//                       >
//                         {statusOptions.map((status) => (
//                           <option key={status} value={status}>
//                             {status.charAt(0).toUpperCase() + status.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                       {order.status === 'cancelled' && (
//                         <p className="text-xs text-red-500 mt-1">
//                           ⚠️ Stock restored • Not counted in income
//                         </p>
//                       )}
//                       {order.status === 'confirmed' && (
//                         <p className="text-xs text-blue-500 mt-1">
//                           💰 Added to Total Income
//                         </p>
//                       )}
//                       {PENDING_STATUSES.includes(order.status) && (
//                         <p className="text-xs text-yellow-500 mt-1">
//                           ⏳ Added to Pending Income
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Notes */}
//                   {order.orderNotes && (
//                     <div className="mb-4 p-3 bg-secondary rounded-lg border border-border">
//                       <p className="text-xs text-muted-foreground mb-1">Customer Notes</p>
//                       <p className="text-sm text-foreground">{order.orderNotes}</p>
//                     </div>
//                   )}

//                   {/* Admin Notes */}
//                   {order.adminNotes && (
//                     <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
//                       <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
//                       <p className="text-sm text-purple-800">{order.adminNotes}</p>
//                     </div>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex gap-2 flex-wrap">
//                     <a
//                       href={whatsappUrl(order.phoneNumber, order.id)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
//                     >
//                       <MessageCircle size={16} />
//                       WhatsApp Message
//                     </a>
//                     <button
//                       onClick={() => setSelectedOrder(order)}
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
//                     >
//                       <Eye size={16} />
//                       View Details
//                     </button>
//                     <button
//                       onClick={() => handleNoteClick(order)}
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
//                     >
//                       <FileText size={16} />
//                       {order.adminNotes ? 'Edit Note' : 'Add Note'}
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-12 bg-card rounded-lg border border-border">
//             <p className="text-muted-foreground">No orders found</p>
//           </div>
//         )}
//       </div>

//       {/* Modal for order details */}
//       {selectedOrder && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//           onClick={() => setSelectedOrder(null)}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-card rounded-lg max-w-2xl w-full p-6 border border-border max-h-96 overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder.id}</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold mb-2">Customer Information</h3>
//                 <p className="text-sm text-muted-foreground">
//                   <strong>Name:</strong> {selectedOrder.customerName}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   <strong>Phone:</strong> {selectedOrder.phoneNumber}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   <strong>Email:</strong> {selectedOrder.email}
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   <strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city} - {selectedOrder.zipCode}
//                 </p>
//               </div>

//               <div>
//                 <h3 className="font-semibold mb-2">Order Items</h3>
//                 <div className="space-y-2">
//                   {selectedOrder.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between text-sm p-2 bg-secondary rounded">
//                       <span>{item.name}</span>
//                       <span>x{item.quantity}</span>
//                       <span className="font-semibold">PKR {Math.round(item.price * item.quantity).toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {selectedOrder.adminNotes && (
//                 <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
//                   <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
//                   <p className="text-sm text-purple-800">{selectedOrder.adminNotes}</p>
//                 </div>
//               )}

//               <div className="border-t border-border pt-4">
//                 <p className="text-lg font-bold">
//                   Total: PKR {Math.round(selectedOrder.total).toLocaleString()}
//                 </p>
//                 {selectedOrder.status === 'confirmed' && (
//                   <p className="text-sm text-green-600 mt-1">
//                     ✅ This order is included in Total Income
//                   </p>
//                 )}
//                 {PENDING_STATUSES.includes(selectedOrder.status) && (
//                   <p className="text-sm text-yellow-600 mt-1">
//                     ⏳ This order is included in Pending Income
//                   </p>
//                 )}
//                 {selectedOrder.status === 'cancelled' && (
//                   <p className="text-sm text-red-600 mt-1">
//                     ❌ Cancelled order - not counted in any income
//                   </p>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedOrder(null)}
//               className="w-full mt-6 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
//             >
//               Close
//             </button>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Admin Note Modal */}
//       {showNoteModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//           onClick={() => {
//             setShowNoteModal(false);
//             setNoteText('');
//             setNoteOrderId(null);
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className="bg-card rounded-lg max-w-md w-full p-6 border border-border"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h2 className="text-xl font-bold text-foreground">
//                   {currentNote ? 'Edit Admin Note' : 'Add Admin Note'}
//                 </h2>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Order #{noteOrderId?.slice(0, 8)}...
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   setShowNoteModal(false);
//                   setNoteText('');
//                   setNoteOrderId(null);
//                 }}
//                 className="text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Note Content
//                 </label>
//                 <textarea
//                   value={noteText}
//                   onChange={(e) => setNoteText(e.target.value)}
//                   rows={5}
//                   className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//                   placeholder="Add your admin note here... (e.g., delivery instructions, special requests, etc.)"
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {noteText.length} characters
//                 </p>
//               </div>

//               {currentNote && (
//                 <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
//                   <p className="text-xs text-purple-600 font-semibold mb-1">Previous Note</p>
//                   <p className="text-sm text-purple-800">{currentNote}</p>
//                 </div>
//               )}

//               <div className="flex gap-3 pt-2">
//                 <button
//                   onClick={() => {
//                     setShowNoteModal(false);
//                     setNoteText('');
//                     setNoteOrderId(null);
//                   }}
//                   className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveNote}
//                   disabled={savingNote || !noteText.trim()}
//                   className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
//                     savingNote || !noteText.trim()
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg'
//                   }`}
//                 >
//                   {savingNote ? 'Saving...' : currentNote ? 'Update Note' : 'Save Note'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// }









//each price price show discount without order time
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, update, get } from 'firebase/database';
// import { ArrowLeft, MessageCircle, Eye, TrendingUp, Clock, FileText, X, Package, Truck, ChevronDown, ChevronUp } from 'lucide-react';
// import Link from 'next/link';
// import Swal from 'sweetalert2';

// interface OrderItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   discount?: number;
//   finalPrice?: number;
// }

// interface Order {
//   id: string;
//   customerName: string;
//   phoneNumber: string;
//   email: string;
//   address: string;
//   city: string;
//   zipCode: string;
//   items: OrderItem[];
//   subtotal: number;
//   deliveryCharge: number;
//   total: number;
//   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
//   createdAt: string;
//   orderNotes?: string;
//   adminNotes?: string;
// }

// const statusColors: Record<string, string> = {
//   pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//   confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
//   shipped: 'bg-purple-100 text-purple-800 border-purple-300',
//   delivered: 'bg-green-100 text-green-800 border-green-300',
//   cancelled: 'bg-red-100 text-red-800 border-red-300'
// };

// const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// const CONFIRMED_STATUS = 'confirmed';
// const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

// export default function AdminOrdersPage() {
//   const { user, isAdmin, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [filterStatus, setFilterStatus] = useState<string>('all');
//   const [showNoteModal, setShowNoteModal] = useState(false);
//   const [noteOrderId, setNoteOrderId] = useState<string | null>(null);
//   const [noteText, setNoteText] = useState('');
//   const [currentNote, setCurrentNote] = useState('');
//   const [savingNote, setSavingNote] = useState(false);
//   const [expandedSummary, setExpandedSummary] = useState<string | null>(null);

//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   useEffect(() => {
//     if (!isAdmin) return;

//     const ordersRef = ref(rtdb, 'orders');
//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const ordersData: Order[] = [];
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const order = {
//             id: key,
//             ...data[key]
//           } as Order;
          
//           if (order.items) {
//             order.items = order.items.map(item => ({
//               ...item,
//               finalPrice: item.price - (item.discount || 0)
//             }));
//           }
          
//           ordersData.push(order);
//         });
        
//         ordersData.sort((a, b) => 
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
        
//         setOrders(ordersData);
//       } else {
//         setOrders([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   const calculateIncome = () => {
//     let totalIncome = 0;
//     let pendingIncome = 0;

//     orders.forEach(order => {
//       if (order.status === 'cancelled') return;

//       if (order.status === CONFIRMED_STATUS) {
//         totalIncome += order.total || 0;
//       } else if (PENDING_STATUSES.includes(order.status)) {
//         pendingIncome += order.total || 0;
//       }
//     });

//     return { totalIncome, pendingIncome };
//   };

//   const { totalIncome, pendingIncome } = calculateIncome();
//   const pendingCount = orders.filter(o => PENDING_STATUSES.includes(o.status)).length;
//   const confirmedCount = orders.filter(o => o.status === CONFIRMED_STATUS).length;

//   const restoreStock = async (items: OrderItem[]) => {
//     for (const item of items) {
//       try {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = currentStock + item.quantity;
          
//           await update(productRef, {
//             stock: newStock
//           });
//         }
//       } catch (error) {
//         console.error(`Error restoring stock for ${item.name}:`, error);
//       }
//     }
//   };

//   const cutStock = async (items: OrderItem[]) => {
//     for (const item of items) {
//       try {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = Math.max(0, currentStock - item.quantity);
          
//           await update(productRef, {
//             stock: newStock
//           });
//         }
//       } catch (error) {
//         console.error(`Error cutting stock for ${item.name}:`, error);
//       }
//     }
//   };

//   const handleStatusChange = async (orderId: string, newStatus: string, order: Order) => {
//     const oldStatus = order.status;

//     if (newStatus === 'cancelled') {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: 'This will cancel the order and restore all items to stock!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Yes, cancel order!',
//         cancelButtonText: 'No, keep it'
//       });

//       if (!result.isConfirmed) {
//         return;
//       }

//       try {
//         await restoreStock(order.items);
        
//         const orderRef = ref(rtdb, `orders/${orderId}`);
//         await update(orderRef, {
//           status: newStatus,
//           updatedAt: new Date().toISOString()
//         });

//         await Swal.fire({
//           icon: 'success',
//           title: 'Order Cancelled!',
//           text: 'Order has been cancelled and stock has been restored.',
//           timer: 2000,
//           showConfirmButton: false
//         });
//       } catch (error) {
//         console.error('[v0] Error cancelling order:', error);
//         await Swal.fire({
//           icon: 'error',
//           title: 'Error!',
//           text: 'Failed to cancel order. Please try again.'
//         });
//       }
//       return;
//     }

//     if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
//       const result = await Swal.fire({
//         title: 'Are you sure?',
//         text: 'This will cut stock for all items in this order!',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, restore order!',
//         cancelButtonText: 'No, keep cancelled'
//       });

//       if (!result.isConfirmed) {
//         return;
//       }

//       try {
//         await cutStock(order.items);
        
//         const orderRef = ref(rtdb, `orders/${orderId}`);
//         await update(orderRef, {
//           status: newStatus,
//           updatedAt: new Date().toISOString()
//         });

//         await Swal.fire({
//           icon: 'success',
//           title: 'Order Restored!',
//           text: `Order has been restored to ${newStatus} and stock has been updated.`,
//           timer: 2000,
//           showConfirmButton: false
//         });
//       } catch (error) {
//         console.error('[v0] Error restoring order:', error);
//         await Swal.fire({
//           icon: 'error',
//           title: 'Error!',
//           text: 'Failed to restore order. Please try again.'
//         });
//       }
//       return;
//     }

//     try {
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await update(orderRef, {
//         status: newStatus,
//         updatedAt: new Date().toISOString()
//       });

//       await Swal.fire({
//         icon: 'success',
//         title: 'Status Updated!',
//         text: `Order status changed to ${newStatus}`,
//         timer: 1500,
//         showConfirmButton: false
//       });
//     } catch (error) {
//       console.error('[v0] Error updating order:', error);
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'Failed to update order status. Please try again.'
//       });
//     }
//   };

//   const onStatusChange = async (orderId: string, newStatus: string) => {
//     const order = orders.find(o => o.id === orderId);
//     if (!order) return;
    
//     if (order.status === newStatus) return;

//     await handleStatusChange(orderId, newStatus, order);
//   };

//   const handleNoteClick = (order: Order) => {
//     setNoteOrderId(order.id);
//     setCurrentNote(order.adminNotes || '');
//     setNoteText(order.adminNotes || '');
//     setShowNoteModal(true);
//   };

//   const handleSaveNote = async () => {
//     if (!noteOrderId) return;
    
//     setSavingNote(true);
//     try {
//       const orderRef = ref(rtdb, `orders/${noteOrderId}`);
//       await update(orderRef, {
//         adminNotes: noteText,
//         updatedAt: new Date().toISOString()
//       });

//       setOrders(prevOrders => 
//         prevOrders.map(order => 
//           order.id === noteOrderId 
//             ? { ...order, adminNotes: noteText }
//             : order
//         )
//       );

//       await Swal.fire({
//         icon: 'success',
//         title: 'Note Saved!',
//         text: 'Admin note has been added to the order.',
//         timer: 1500,
//         showConfirmButton: false
//       });

//       setShowNoteModal(false);
//       setNoteText('');
//       setNoteOrderId(null);
//       setCurrentNote('');
//     } catch (error) {
//       console.error('Error saving note:', error);
//       await Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: 'Failed to save note. Please try again.'
//       });
//     } finally {
//       setSavingNote(false);
//     }
//   };

//   const togglePriceSummary = (orderId: string) => {
//     if (expandedSummary === orderId) {
//       setExpandedSummary(null);
//     } else {
//       setExpandedSummary(orderId);
//     }
//   };

//   const filteredOrders = filterStatus === 'all' 
//     ? orders 
//     : orders.filter(o => o.status === filterStatus);

//   const whatsappUrl = (phoneNumber: string, orderID: string) => {
//     const message = encodeURIComponent(
//       `Hi! Your order #${orderID} has been confirmed. We will contact you soon with delivery details.`
//     );
//     return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
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
//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground">
//                 <ArrowLeft size={24} />
//               </Link>
//               <h1 className="text-3xl font-bold">Orders Management</h1>
//             </div>
//             <div className="text-right">
//               <p className="text-2xl font-bold text-primary">{orders.length}</p>
//               <p className="text-sm text-muted-foreground">Total Orders</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Income Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-700 font-medium mb-1">💰 Total Income</p>
//                 <p className="text-3xl font-bold text-green-800">
//                   {formatPrice(totalIncome)}
//                 </p>
//                 <p className="text-xs text-green-600 mt-1">
//                   {confirmedCount} confirmed orders
//                 </p>
//               </div>
//               <div className="bg-green-200 p-3 rounded-full">
//                 <TrendingUp className="w-6 h-6 text-green-700" />
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-yellow-700 font-medium mb-1">⏳ Pending Income</p>
//                 <p className="text-3xl font-bold text-yellow-800">
//                   {formatPrice(pendingIncome)}
//                 </p>
//                 <p className="text-xs text-yellow-600 mt-1">
//                   {pendingCount} orders pending
//                 </p>
//               </div>
//               <div className="bg-yellow-200 p-3 rounded-full">
//                 <Clock className="w-6 h-6 text-yellow-700" />
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Status Filter */}
//         <div className="flex gap-2 mb-8 flex-wrap">
//           <button
//             onClick={() => setFilterStatus('all')}
//             className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//               filterStatus === 'all'
//                 ? 'bg-primary text-white'
//                 : 'bg-secondary text-foreground hover:bg-muted'
//             }`}
//           >
//             All ({orders.length})
//           </button>
//           {statusOptions.map((status) => {
//             const count = orders.filter(o => o.status === status).length;
//             return (
//               <button
//                 key={status}
//                 onClick={() => setFilterStatus(status)}
//                 className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
//                   filterStatus === status
//                     ? 'bg-primary text-white'
//                     : 'bg-secondary text-foreground hover:bg-muted'
//                 }`}
//               >
//                 {status} ({count})
//               </button>
//             );
//           })}
//         </div>

//         {/* Orders List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading orders...</p>
//           </div>
//         ) : filteredOrders.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="space-y-4"
//           >
//             {filteredOrders.map((order) => (
//               <motion.div
//                 key={order.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-card rounded-lg border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//               >
//                 {/* Order Header */}
//                 <div className="p-4 bg-secondary border-b border-border">
//                   <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Order ID</p>
//                       <p className="font-mono font-semibold text-sm">{order.id.slice(0, 8)}...</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Customer</p>
//                       <p className="font-semibold text-sm">{order.customerName}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Order Date</p>
//                       <p className="font-semibold text-sm">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Items</p>
//                       <p className="font-semibold text-sm">{order.items.length} products</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground mb-1">Total</p>
//                       <p className="font-bold text-lg text-primary">{formatPrice(order.total)}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Order Details */}
//                 <div className="p-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                     {/* Customer Info */}
//                     <div>
//                       <h3 className="font-semibold mb-3 text-foreground text-sm">Customer Info</h3>
//                       <div className="text-sm space-y-1 text-muted-foreground">
//                         <p>📱 {order.phoneNumber}</p>
//                         <p>📧 {order.email}</p>
//                         <p>📍 {order.address}, {order.city}</p>
//                       </div>
//                     </div>

//                     {/* Items */}
//                     <div>
//                       <h3 className="font-semibold mb-3 text-foreground text-sm">Order Items</h3>
//                       <div className="text-sm space-y-1">
//                         {order.items.map((item, idx) => (
//                           <div key={idx} className="flex justify-between items-center">
//                             <span className="text-muted-foreground">{item.name} ×{item.quantity}</span>
//                             <span className="font-medium text-primary">
//                               {formatPrice((item.price - (item.discount || 0)) * item.quantity)}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                       {/* Price Summary Toggle Button */}
//                       <button
//                         onClick={() => togglePriceSummary(order.id)}
//                         className="mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
//                       >
//                         {expandedSummary === order.id ? (
//                           <>
//                             <ChevronUp size={14} />
//                             Hide Price Summary
//                           </>
//                         ) : (
//                           <>
//                             <ChevronDown size={14} />
//                             View Price Summary
//                           </>
//                         )}
//                       </button>
//                     </div>

//                     {/* Status & Actions */}
//                     <div>
//                       <h3 className="font-semibold mb-3 text-foreground text-sm">Status</h3>
//                       <select
//                         value={order.status}
//                         onChange={(e) => onStatusChange(order.id, e.target.value)}
//                         className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${statusColors[order.status]} cursor-pointer`}
//                       >
//                         {statusOptions.map((status) => (
//                           <option key={status} value={status}>
//                             {status.charAt(0).toUpperCase() + status.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                       {order.status === 'cancelled' && (
//                         <p className="text-xs text-red-500 mt-1">⚠️ Stock restored</p>
//                       )}
//                       {order.status === 'confirmed' && (
//                         <p className="text-xs text-blue-500 mt-1">💰 Added to Total Income</p>
//                       )}
//                       {PENDING_STATUSES.includes(order.status) && (
//                         <p className="text-xs text-yellow-500 mt-1">⏳ Pending Income</p>
//                       )}
//                     </div>
//                   </div>

//                   {/* Price Summary - Collapsible */}
//                   {expandedSummary === order.id && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: 'auto' }}
//                       exit={{ opacity: 0, height: 0 }}
//                       className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
//                     >
//                       <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
//                         <Package className="w-4 h-4" />
//                         Price Summary
//                       </h3>
//                       <div className="space-y-2">
//                         {/* Each item with unit price and total */}
//                         {order.items.map((item, idx) => {
//                           const finalPrice = item.price - (item.discount || 0);
//                           const itemTotal = finalPrice * item.quantity;
//                           return (
//                             <div key={idx} className="flex flex-col text-sm border-b border-gray-200 pb-2">
//                               <div className="flex justify-between">
//                                 <span className="font-medium text-foreground">{item.name}</span>
//                                 <span className="font-semibold text-primary">{formatPrice(itemTotal)}</span>
//                               </div>
//                               <div className="flex justify-between text-xs text-muted-foreground">
//                                 <span>
//                                   Unit Price: {formatPrice(finalPrice)} × {item.quantity}
//                                 </span>
//                                 {item.discount && item.discount > 0 && (
//                                   <span className="text-green-600">
//                                     💰 Saved: {formatPrice(item.discount)} each
//                                   </span>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
                        
//                         {/* Subtotal */}
//                         <div className="flex justify-between text-sm pt-2">
//                           <span className="text-muted-foreground">Subtotal</span>
//                           <span className="font-medium">
//                             {formatPrice(order.subtotal || order.total - (order.deliveryCharge || 0))}
//                           </span>
//                         </div>
                        
//                         {/* Delivery Charge */}
//                         <div className="flex justify-between text-sm">
//                           <span className="text-muted-foreground flex items-center gap-1">
//                             <Truck className="w-4 h-4" />
//                             Delivery Charge
//                           </span>
//                           <span className="font-medium">{formatPrice(order.deliveryCharge || 0)}</span>
//                         </div>
                        
//                         {/* Grand Total */}
//                         <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
//                           <span className="text-foreground">Grand Total</span>
//                           <span className="text-primary">{formatPrice(order.total)}</span>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}

//                   {/* Notes */}
//                   {order.orderNotes && (
//                     <div className="mb-4 p-3 bg-secondary rounded-lg border border-border">
//                       <p className="text-xs text-muted-foreground mb-1">Customer Notes</p>
//                       <p className="text-sm text-foreground">{order.orderNotes}</p>
//                     </div>
//                   )}

//                   {/* Admin Notes */}
//                   {order.adminNotes && (
//                     <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
//                       <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
//                       <p className="text-sm text-purple-800">{order.adminNotes}</p>
//                     </div>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex gap-2 flex-wrap">
//                     <a
//                       href={whatsappUrl(order.phoneNumber, order.id)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
//                     >
//                       <MessageCircle size={16} />
//                       WhatsApp
//                     </a>
//                     <button
//                       onClick={() => setSelectedOrder(order)}
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
//                     >
//                       <Eye size={16} />
//                       View Details
//                     </button>
//                     <button
//                       onClick={() => handleNoteClick(order)}
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
//                     >
//                       <FileText size={16} />
//                       {order.adminNotes ? 'Edit Note' : 'Add Note'}
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-12 bg-card rounded-lg border border-border">
//             <p className="text-muted-foreground">No orders found</p>
//           </div>
//         )}
//       </div>

//       {/* Modal for order details */}
//       {selectedOrder && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//           onClick={() => setSelectedOrder(null)}
//         >
//           <motion.div
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-card rounded-lg max-w-2xl w-full p-6 border border-border max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder.id.slice(0, 8)}</h2>
            
//             <div className="space-y-4">
//               <div>
//                 <h3 className="font-semibold mb-2">Customer Information</h3>
//                 <p className="text-sm text-muted-foreground"><strong>Name:</strong> {selectedOrder.customerName}</p>
//                 <p className="text-sm text-muted-foreground"><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
//                 <p className="text-sm text-muted-foreground"><strong>Email:</strong> {selectedOrder.email}</p>
//                 <p className="text-sm text-muted-foreground"><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
//               </div>

//               <div>
//                 <h3 className="font-semibold mb-2">Order Items</h3>
//                 <div className="space-y-2">
//                   {selectedOrder.items.map((item, idx) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     const itemTotal = finalPrice * item.quantity;
//                     return (
//                       <div key={idx} className="flex flex-col text-sm p-2 bg-secondary rounded">
//                         <div className="flex justify-between">
//                           <span className="font-medium">{item.name}</span>
//                           <span className="font-semibold">{formatPrice(itemTotal)}</span>
//                         </div>
//                         <div className="flex justify-between text-xs text-muted-foreground">
//                           <span>Unit: {formatPrice(finalPrice)} × {item.quantity}</span>
//                           {item.discount && item.discount > 0 && (
//                             <span className="text-green-600">Saved: {formatPrice(item.discount)} each</span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="p-3 bg-secondary rounded-lg border border-border">
//                 <h3 className="font-semibold mb-2">Price Summary</h3>
//                 <div className="space-y-1 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal</span>
//                     <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total - (selectedOrder.deliveryCharge || 0))}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground flex items-center gap-1">
//                       <Truck className="w-4 h-4" /> Delivery
//                     </span>
//                     <span>{formatPrice(selectedOrder.deliveryCharge || 0)}</span>
//                   </div>
//                   <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
//                     <span>Total</span>
//                     <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
//                   </div>
//                 </div>
//               </div>

//               {selectedOrder.adminNotes && (
//                 <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
//                   <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
//                   <p className="text-sm text-purple-800">{selectedOrder.adminNotes}</p>
//                 </div>
//               )}

//               <div className="border-t border-border pt-4">
//                 <p className="text-sm text-muted-foreground">Status: <span className="font-semibold capitalize">{selectedOrder.status}</span></p>
//                 {selectedOrder.status === 'confirmed' && (
//                   <p className="text-sm text-green-600">✅ Included in Total Income</p>
//                 )}
//                 {PENDING_STATUSES.includes(selectedOrder.status) && (
//                   <p className="text-sm text-yellow-600">⏳ Included in Pending Income</p>
//                 )}
//                 {selectedOrder.status === 'cancelled' && (
//                   <p className="text-sm text-red-600">❌ Cancelled - Not counted</p>
//                 )}
//               </div>
//             </div>

//             <button
//               onClick={() => setSelectedOrder(null)}
//               className="w-full mt-6 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
//             >
//               Close
//             </button>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Admin Note Modal */}
//       {showNoteModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
//           onClick={() => {
//             setShowNoteModal(false);
//             setNoteText('');
//             setNoteOrderId(null);
//           }}
//         >
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className="bg-card rounded-lg max-w-md w-full p-6 border border-border"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h2 className="text-xl font-bold text-foreground">
//                   {currentNote ? 'Edit Admin Note' : 'Add Admin Note'}
//                 </h2>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Order #{noteOrderId?.slice(0, 8)}...
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   setShowNoteModal(false);
//                   setNoteText('');
//                   setNoteOrderId(null);
//                 }}
//                 className="text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-foreground mb-2">
//                   Note Content
//                 </label>
//                 <textarea
//                   value={noteText}
//                   onChange={(e) => setNoteText(e.target.value)}
//                   rows={5}
//                   className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
//                   placeholder="Add your admin note here..."
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   {noteText.length} characters
//                 </p>
//               </div>

//               {currentNote && (
//                 <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
//                   <p className="text-xs text-purple-600 font-semibold mb-1">Previous Note</p>
//                   <p className="text-sm text-purple-800">{currentNote}</p>
//                 </div>
//               )}

//               <div className="flex gap-3 pt-2">
//                 <button
//                   onClick={() => {
//                     setShowNoteModal(false);
//                     setNoteText('');
//                     setNoteOrderId(null);
//                   }}
//                   className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSaveNote}
//                   disabled={savingNote || !noteText.trim()}
//                   className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
//                     savingNote || !noteText.trim()
//                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       : 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg'
//                   }`}
//                 >
//                   {savingNote ? 'Saving...' : currentNote ? 'Update Note' : 'Save Note'}
//                 </button>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}
//     </div>
//   );
// }



//with order time and without confirmed = done

  // 'use client';

  // import { useEffect, useState } from 'react';
  // import { useRouter } from 'next/navigation';
  // import { motion } from 'framer-motion';
  // import { useAuth } from '@/lib/authContext';
  // import { rtdb } from '@/lib/firebase';
  // import { ref, onValue, update, get } from 'firebase/database';
  // import { ArrowLeft, MessageCircle, Eye, TrendingUp, Clock, FileText, X, Package, Truck, ChevronDown, ChevronUp } from 'lucide-react';
  // import Link from 'next/link';
  // import Swal from 'sweetalert2';

  // interface OrderItem {
  //   id: string;
  //   name: string;
  //   price: number;
  //   quantity: number;
  //   discount?: number;
  //   finalPrice?: number;
  // }

  // interface Order {
  //   id: string;
  //   customerName: string;
  //   phoneNumber: string;
  //   email: string;
  //   address: string;
  //   city: string;
  //   zipCode: string;
  //   items: OrderItem[];
  //   subtotal: number;
  //   deliveryCharge: number;
  //   total: number;
  //   status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  //   createdAt: string;
  //   orderNotes?: string;
  //   adminNotes?: string;
  // }

  // const statusColors: Record<string, string> = {
  //   pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  //   confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  //   shipped: 'bg-purple-100 text-purple-800 border-purple-300',
  //   delivered: 'bg-green-100 text-green-800 border-green-300',
  //   cancelled: 'bg-red-100 text-red-800 border-red-300'
  // };

  // const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  // const CONFIRMED_STATUS = 'confirmed';
  // const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

  // export default function AdminOrdersPage() {
  //   const { user, isAdmin, loading: authLoading } = useAuth();
  //   const router = useRouter();
  //   const [orders, setOrders] = useState<Order[]>([]);
  //   const [loading, setLoading] = useState(true);
  //   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  //   const [filterStatus, setFilterStatus] = useState<string>('all');
  //   const [showNoteModal, setShowNoteModal] = useState(false);
  //   const [noteOrderId, setNoteOrderId] = useState<string | null>(null);
  //   const [noteText, setNoteText] = useState('');
  //   const [currentNote, setCurrentNote] = useState('');
  //   const [savingNote, setSavingNote] = useState(false);
  //   const [expandedSummary, setExpandedSummary] = useState<string | null>(null);

  //   useEffect(() => {
  //     if (authLoading) return;

  //     if (!user) {
  //       router.push('/login');
  //     } else if (!isAdmin) {
  //       router.push('/');
  //     }
  //   }, [user, isAdmin, authLoading, router]);

  //   useEffect(() => {
  //     if (!isAdmin) return;

  //     const ordersRef = ref(rtdb, 'orders');
  //     const unsubscribe = onValue(ordersRef, (snapshot) => {
  //       if (snapshot.exists()) {
  //         const ordersData: Order[] = [];
  //         const data = snapshot.val();
          
  //         Object.keys(data).forEach((key) => {
  //           const order = {
  //             id: key,
  //             ...data[key]
  //           } as Order;
            
  //           if (order.items) {
  //             order.items = order.items.map(item => ({
  //               ...item,
  //               finalPrice: item.price - (item.discount || 0)
  //             }));
  //           }
            
  //           ordersData.push(order);
  //         });
          
  //         ordersData.sort((a, b) => 
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //         );
          
  //         setOrders(ordersData);
  //       } else {
  //         setOrders([]);
  //       }
  //       setLoading(false);
  //     });

  //     return () => unsubscribe();
  //   }, [isAdmin]);

  //   // ✅ Format date with time
  //   const formatDateTime = (dateString: string) => {
  //     const date = new Date(dateString);
  //     return {
  //       date: date.toLocaleDateString('en-PK', {
  //         day: '2-digit',
  //         month: 'short',
  //         year: 'numeric'
  //       }),
  //       time: date.toLocaleTimeString('en-PK', {
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: true
  //       }),
  //       full: date.toLocaleString('en-PK', {
  //         day: '2-digit',
  //         month: 'short',
  //         year: 'numeric',
  //         hour: '2-digit',
  //         minute: '2-digit',
  //         hour12: true
  //       })
  //     };
  //   };

  //   const calculateIncome = () => {
  //     let totalIncome = 0;
  //     let pendingIncome = 0;

  //     orders.forEach(order => {
  //       if (order.status === 'cancelled') return;

  //       if (order.status === CONFIRMED_STATUS) {
  //         totalIncome += order.total || 0;
  //       } else if (PENDING_STATUSES.includes(order.status)) {
  //         pendingIncome += order.total || 0;
  //       }
  //     });

  //     return { totalIncome, pendingIncome };
  //   };

  //   const { totalIncome, pendingIncome } = calculateIncome();
  //   const pendingCount = orders.filter(o => PENDING_STATUSES.includes(o.status)).length;
  //   const confirmedCount = orders.filter(o => o.status === CONFIRMED_STATUS).length;

  //   const restoreStock = async (items: OrderItem[]) => {
  //     for (const item of items) {
  //       try {
  //         const productRef = ref(rtdb, `products/${item.id}`);
  //         const snapshot = await get(productRef);
  //         if (snapshot.exists()) {
  //           const product = snapshot.val();
  //           const currentStock = product.stock || 0;
  //           const newStock = currentStock + item.quantity;
            
  //           await update(productRef, {
  //             stock: newStock
  //           });
  //         }
  //       } catch (error) {
  //         console.error(`Error restoring stock for ${item.name}:`, error);
  //       }
  //     }
  //   };

  //   const cutStock = async (items: OrderItem[]) => {
  //     for (const item of items) {
  //       try {
  //         const productRef = ref(rtdb, `products/${item.id}`);
  //         const snapshot = await get(productRef);
  //         if (snapshot.exists()) {
  //           const product = snapshot.val();
  //           const currentStock = product.stock || 0;
  //           const newStock = Math.max(0, currentStock - item.quantity);
            
  //           await update(productRef, {
  //             stock: newStock
  //           });
  //         }
  //       } catch (error) {
  //         console.error(`Error cutting stock for ${item.name}:`, error);
  //       }
  //     }
  //   };

  //   const handleStatusChange = async (orderId: string, newStatus: string, order: Order) => {
  //     const oldStatus = order.status;

  //     if (newStatus === 'cancelled') {
  //       const result = await Swal.fire({
  //         title: 'Are you sure?',
  //         text: 'This will cancel the order and restore all items to stock!',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#d33',
  //         cancelButtonColor: '#3085d6',
  //         confirmButtonText: 'Yes, cancel order!',
  //         cancelButtonText: 'No, keep it'
  //       });

  //       if (!result.isConfirmed) {
  //         return;
  //       }

  //       try {
  //         await restoreStock(order.items);
          
  //         const orderRef = ref(rtdb, `orders/${orderId}`);
  //         await update(orderRef, {
  //           status: newStatus,
  //           updatedAt: new Date().toISOString()
  //         });

  //         await Swal.fire({
  //           icon: 'success',
  //           title: 'Order Cancelled!',
  //           text: 'Order has been cancelled and stock has been restored.',
  //           timer: 2000,
  //           showConfirmButton: false
  //         });
  //       } catch (error) {
  //         console.error('[v0] Error cancelling order:', error);
  //         await Swal.fire({
  //           icon: 'error',
  //           title: 'Error!',
  //           text: 'Failed to cancel order. Please try again.'
  //         });
  //       }
  //       return;
  //     }

  //     if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
  //       const result = await Swal.fire({
  //         title: 'Are you sure?',
  //         text: 'This will cut stock for all items in this order!',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'Yes, restore order!',
  //         cancelButtonText: 'No, keep cancelled'
  //       });

  //       if (!result.isConfirmed) {
  //         return;
  //       }

  //       try {
  //         await cutStock(order.items);
          
  //         const orderRef = ref(rtdb, `orders/${orderId}`);
  //         await update(orderRef, {
  //           status: newStatus,
  //           updatedAt: new Date().toISOString()
  //         });

  //         await Swal.fire({
  //           icon: 'success',
  //           title: 'Order Restored!',
  //           text: `Order has been restored to ${newStatus} and stock has been updated.`,
  //           timer: 2000,
  //           showConfirmButton: false
  //         });
  //       } catch (error) {
  //         console.error('[v0] Error restoring order:', error);
  //         await Swal.fire({
  //           icon: 'error',
  //           title: 'Error!',
  //           text: 'Failed to restore order. Please try again.'
  //         });
  //       }
  //       return;
  //     }

  //     try {
  //       const orderRef = ref(rtdb, `orders/${orderId}`);
  //       await update(orderRef, {
  //         status: newStatus,
  //         updatedAt: new Date().toISOString()
  //       });

  //       await Swal.fire({
  //         icon: 'success',
  //         title: 'Status Updated!',
  //         text: `Order status changed to ${newStatus}`,
  //         timer: 1500,
  //         showConfirmButton: false
  //       });
  //     } catch (error) {
  //       console.error('[v0] Error updating order:', error);
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'Error!',
  //         text: 'Failed to update order status. Please try again.'
  //       });
  //     }
  //   };

  //   const onStatusChange = async (orderId: string, newStatus: string) => {
  //     const order = orders.find(o => o.id === orderId);
  //     if (!order) return;
      
  //     if (order.status === newStatus) return;

  //     await handleStatusChange(orderId, newStatus, order);
  //   };

  //   const handleNoteClick = (order: Order) => {
  //     setNoteOrderId(order.id);
  //     setCurrentNote(order.adminNotes || '');
  //     setNoteText(order.adminNotes || '');
  //     setShowNoteModal(true);
  //   };

  //   const handleSaveNote = async () => {
  //     if (!noteOrderId) return;
      
  //     setSavingNote(true);
  //     try {
  //       const orderRef = ref(rtdb, `orders/${noteOrderId}`);
  //       await update(orderRef, {
  //         adminNotes: noteText,
  //         updatedAt: new Date().toISOString()
  //       });

  //       setOrders(prevOrders => 
  //         prevOrders.map(order => 
  //           order.id === noteOrderId 
  //             ? { ...order, adminNotes: noteText }
  //             : order
  //         )
  //       );

  //       await Swal.fire({
  //         icon: 'success',
  //         title: 'Note Saved!',
  //         text: 'Admin note has been added to the order.',
  //         timer: 1500,
  //         showConfirmButton: false
  //       });

  //       setShowNoteModal(false);
  //       setNoteText('');
  //       setNoteOrderId(null);
  //       setCurrentNote('');
  //     } catch (error) {
  //       console.error('Error saving note:', error);
  //       await Swal.fire({
  //         icon: 'error',
  //         title: 'Error!',
  //         text: 'Failed to save note. Please try again.'
  //       });
  //     } finally {
  //       setSavingNote(false);
  //     }
  //   };

  //   const togglePriceSummary = (orderId: string) => {
  //     if (expandedSummary === orderId) {
  //       setExpandedSummary(null);
  //     } else {
  //       setExpandedSummary(orderId);
  //     }
  //   };

  //   const filteredOrders = filterStatus === 'all' 
  //     ? orders 
  //     : orders.filter(o => o.status === filterStatus);

  //   const whatsappUrl = (phoneNumber: string, orderID: string) => {
  //     const message = encodeURIComponent(
  //       `Hi! Your order #${orderID} has been confirmed. We will contact you soon with delivery details.`
  //     );
  //     return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
  //   };

  //   const formatPrice = (price: number) => {
  //     return new Intl.NumberFormat('ur-PK', {
  //       style: 'currency',
  //       currency: 'PKR',
  //       minimumFractionDigits: 0,
  //       maximumFractionDigits: 0,
  //     }).format(price);
  //   };

  //   if (authLoading) {
  //     return (
  //       <div className="min-h-screen bg-background flex items-center justify-center">
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
  //       {/* Header */}
  //       <div className="bg-secondary border-b border-border">
  //         <div className="max-w-7xl mx-auto px-4 py-6">
  //           <div className="flex items-center justify-between">
  //             <div className="flex items-center gap-4">
  //               <Link href="/admin" className="text-muted-foreground hover:text-foreground">
  //                 <ArrowLeft size={24} />
  //               </Link>
  //               <h1 className="text-3xl font-bold">Orders Management</h1>
  //             </div>
  //             <div className="text-right">
  //               <p className="text-2xl font-bold text-primary">{orders.length}</p>
  //               <p className="text-sm text-muted-foreground">Total Orders</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="max-w-7xl mx-auto px-4 py-8">
  //         {/* Income Summary Cards */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
  //           <motion.div
  //             initial={{ opacity: 0, y: -10 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             transition={{ delay: 0.1 }}
  //             className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
  //           >
  //             <div className="flex items-center justify-between">
  //               <div>
  //                 <p className="text-sm text-green-700 font-medium mb-1">💰 Total Income</p>
  //                 <p className="text-3xl font-bold text-green-800">
  //                   {formatPrice(totalIncome)}
  //                 </p>
  //                 <p className="text-xs text-green-600 mt-1">
  //                   {confirmedCount} confirmed orders
  //                 </p>
  //               </div>
  //               <div className="bg-green-200 p-3 rounded-full">
  //                 <TrendingUp className="w-6 h-6 text-green-700" />
  //               </div>
  //             </div>
  //           </motion.div>

  //           <motion.div
  //             initial={{ opacity: 0, y: -10 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             transition={{ delay: 0.2 }}
  //             className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
  //           >
  //             <div className="flex items-center justify-between">
  //               <div>
  //                 <p className="text-sm text-yellow-700 font-medium mb-1">⏳ Pending Income</p>
  //                 <p className="text-3xl font-bold text-yellow-800">
  //                   {formatPrice(pendingIncome)}
  //                 </p>
  //                 <p className="text-xs text-yellow-600 mt-1">
  //                   {pendingCount} orders pending
  //                 </p>
  //               </div>
  //               <div className="bg-yellow-200 p-3 rounded-full">
  //                 <Clock className="w-6 h-6 text-yellow-700" />
  //               </div>
  //             </div>
  //           </motion.div>
  //         </div>

  //         {/* Status Filter */}
  //         <div className="flex gap-2 mb-8 flex-wrap">
  //           <button
  //             onClick={() => setFilterStatus('all')}
  //             className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
  //               filterStatus === 'all'
  //                 ? 'bg-primary text-white'
  //                 : 'bg-secondary text-foreground hover:bg-muted'
  //             }`}
  //           >
  //             All ({orders.length})
  //           </button>
  //           {statusOptions.map((status) => {
  //             const count = orders.filter(o => o.status === status).length;
  //             return (
  //               <button
  //                 key={status}
  //                 onClick={() => setFilterStatus(status)}
  //                 className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
  //                   filterStatus === status
  //                     ? 'bg-primary text-white'
  //                     : 'bg-secondary text-foreground hover:bg-muted'
  //                 }`}
  //               >
  //                 {status} ({count})
  //               </button>
  //             );
  //           })}
  //         </div>

  //         {/* Orders List */}
  //         {loading ? (
  //           <div className="text-center py-12">
  //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
  //             <p className="mt-4 text-muted-foreground">Loading orders...</p>
  //           </div>
  //         ) : filteredOrders.length > 0 ? (
  //           <motion.div
  //             initial={{ opacity: 0 }}
  //             animate={{ opacity: 1 }}
  //             className="space-y-4"
  //           >
  //             {filteredOrders.map((order) => {
  //               const dateTime = formatDateTime(order.createdAt);
  //               return (
  //                 <motion.div
  //                   key={order.id}
  //                   initial={{ opacity: 0, y: 10 }}
  //                   animate={{ opacity: 1, y: 0 }}
  //                   className="bg-card rounded-lg border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow"
  //                 >
  //                   {/* Order Header */}
  //                   <div className="p-4 bg-secondary border-b border-border">
  //                     <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
  //                       <div>
  //                         <p className="text-xs text-muted-foreground mb-1">Order ID</p>
  //                         <p className="font-mono font-semibold text-sm">{order.id.slice(0, 8)}...</p>
  //                       </div>
  //                       <div>
  //                         <p className="text-xs text-muted-foreground mb-1">Customer</p>
  //                         <p className="font-semibold text-sm">{order.customerName}</p>
  //                       </div>
  //                       <div>
  //                         <p className="text-xs text-muted-foreground mb-1">Order Date</p>
  //                         <p className="font-semibold text-sm">{dateTime.date}</p>
  //                       </div>
  //                       {/* ✅ New Column for Time */}
  //                       <div>
  //                         <p className="text-xs text-muted-foreground mb-1">Order Time</p>
  //                         <p className="font-semibold text-sm flex items-center gap-1">
  //                           <Clock className="w-3 h-3 text-muted-foreground" />
  //                           {dateTime.time}
  //                         </p>
  //                       </div>
  //                       <div>
  //                         <p className="text-xs text-muted-foreground mb-1">Items</p>
  //                         <p className="font-semibold text-sm">{order.items.length} products</p>
  //                       </div>
  //                       <div>
  //                         <p className="text-xs text-muted-foreground mb-1">Total</p>
  //                         <p className="font-bold text-lg text-primary">{formatPrice(order.total)}</p>
  //                       </div>
  //                     </div>
  //                   </div>

  //                   {/* Order Details */}
  //                   <div className="p-4">
  //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  //                       {/* Customer Info */}
  //                       <div>
  //                         <h3 className="font-semibold mb-3 text-foreground text-sm">Customer Info</h3>
  //                         <div className="text-sm space-y-1 text-muted-foreground">
  //                           <p>📱 {order.phoneNumber}</p>
  //                           <p>📧 {order.email}</p>
  //                           <p>📍 {order.address}, {order.city}</p>
  //                         </div>
  //                       </div>

  //                       {/* Items */}
  //                       <div>
  //                         <h3 className="font-semibold mb-3 text-foreground text-sm">Order Items</h3>
  //                         <div className="text-sm space-y-1">
  //                           {order.items.map((item, idx) => (
  //                             <div key={idx} className="flex justify-between items-center">
  //                               <span className="text-muted-foreground">{item.name} ×{item.quantity}</span>
  //                               <span className="font-medium text-primary">
  //                                 {formatPrice((item.price - (item.discount || 0)) * item.quantity)}
  //                               </span>
  //                             </div>
  //                           ))}
  //                         </div>
  //                         {/* Price Summary Toggle Button */}
  //                         <button
  //                           onClick={() => togglePriceSummary(order.id)}
  //                           className="mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
  //                         >
  //                           {expandedSummary === order.id ? (
  //                             <>
  //                               <ChevronUp size={14} />
  //                               Hide Price Summary
  //                             </>
  //                           ) : (
  //                             <>
  //                               <ChevronDown size={14} />
  //                               View Price Summary
  //                             </>
  //                           )}
  //                         </button>
  //                       </div>

  //                       {/* Status & Actions */}
  //                       <div>
  //                         <h3 className="font-semibold mb-3 text-foreground text-sm">Status</h3>
  //                         <select
  //                           value={order.status}
  //                           onChange={(e) => onStatusChange(order.id, e.target.value)}
  //                           className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${statusColors[order.status]} cursor-pointer`}
  //                         >
  //                           {statusOptions.map((status) => (
  //                             <option key={status} value={status}>
  //                               {status.charAt(0).toUpperCase() + status.slice(1)}
  //                             </option>
  //                           ))}
  //                         </select>
  //                         {order.status === 'cancelled' && (
  //                           <p className="text-xs text-red-500 mt-1">⚠️ Stock restored</p>
  //                         )}
  //                         {order.status === 'confirmed' && (
  //                           <p className="text-xs text-blue-500 mt-1">💰 Added to Total Income</p>
  //                         )}
  //                         {PENDING_STATUSES.includes(order.status) && (
  //                           <p className="text-xs text-yellow-500 mt-1">⏳ Pending Income</p>
  //                         )}
  //                       </div>
  //                     </div>

  //                     {/* Price Summary - Collapsible */}
  //                     {expandedSummary === order.id && (
  //                       <motion.div
  //                         initial={{ opacity: 0, height: 0 }}
  //                         animate={{ opacity: 1, height: 'auto' }}
  //                         exit={{ opacity: 0, height: 0 }}
  //                         className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
  //                       >
  //                         <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
  //                           <Package className="w-4 h-4" />
  //                           Price Summary
  //                         </h3>
  //                         <div className="space-y-2">
  //                           {/* Each item with unit price and total */}
  //                           {order.items.map((item, idx) => {
  //                             const finalPrice = item.price - (item.discount || 0);
  //                             const itemTotal = finalPrice * item.quantity;
  //                             return (
  //                               <div key={idx} className="flex flex-col text-sm border-b border-gray-200 pb-2">
  //                                 <div className="flex justify-between">
  //                                   <span className="font-medium text-foreground">{item.name}</span>
  //                                   <span className="font-semibold text-primary">{formatPrice(itemTotal)}</span>
  //                                 </div>
  //                                 <div className="flex justify-between text-xs text-muted-foreground">
  //                                   <span>
  //                                     Unit Price: {formatPrice(finalPrice)} × {item.quantity}
  //                                   </span>
  //                                   {item.discount && item.discount > 0 && (
  //                                     <span className="text-green-600">
  //                                       💰 Saved: {formatPrice(item.discount)} each
  //                                     </span>
  //                                   )}
  //                                 </div>
  //                               </div>
  //                             );
  //                           })}
                            
  //                           {/* Subtotal */}
  //                           <div className="flex justify-between text-sm pt-2">
  //                             <span className="text-muted-foreground">Subtotal</span>
  //                             <span className="font-medium">
  //                               {formatPrice(order.subtotal || order.total - (order.deliveryCharge || 0))}
  //                             </span>
  //                           </div>
                            
  //                           {/* Delivery Charge */}
  //                           <div className="flex justify-between text-sm">
  //                             <span className="text-muted-foreground flex items-center gap-1">
  //                               <Truck className="w-4 h-4" />
  //                               Delivery Charge
  //                             </span>
  //                             <span className="font-medium">{formatPrice(order.deliveryCharge || 0)}</span>
  //                           </div>
                            
  //                           {/* Grand Total */}
  //                           <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
  //                             <span className="text-foreground">Grand Total</span>
  //                             <span className="text-primary">{formatPrice(order.total)}</span>
  //                           </div>
  //                         </div>
  //                       </motion.div>
  //                     )}

  //                     {/* Notes */}
  //                     {order.orderNotes && (
  //                       <div className="mb-4 p-3 bg-secondary rounded-lg border border-border">
  //                         <p className="text-xs text-muted-foreground mb-1">Customer Notes</p>
  //                         <p className="text-sm text-foreground">{order.orderNotes}</p>
  //                       </div>
  //                     )}

  //                     {/* Admin Notes */}
  //                     {order.adminNotes && (
  //                       <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
  //                         <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
  //                         <p className="text-sm text-purple-800">{order.adminNotes}</p>
  //                       </div>
  //                     )}

  //                     {/* Action Buttons */}
  //                     <div className="flex gap-2 flex-wrap">
  //                       <a
  //                         href={whatsappUrl(order.phoneNumber, order.id)}
  //                         target="_blank"
  //                         rel="noopener noreferrer"
  //                         className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
  //                       >
  //                         <MessageCircle size={16} />
  //                         WhatsApp
  //                       </a>
  //                       <button
  //                         onClick={() => setSelectedOrder(order)}
  //                         className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
  //                       >
  //                         <Eye size={16} />
  //                         View Details
  //                       </button>
  //                       <button
  //                         onClick={() => handleNoteClick(order)}
  //                         className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
  //                       >
  //                         <FileText size={16} />
  //                         {order.adminNotes ? 'Edit Note' : 'Add Note'}
  //                       </button>
  //                     </div>
  //                   </div>
  //                 </motion.div>
  //               );
  //             })}
  //           </motion.div>
  //         ) : (
  //           <div className="text-center py-12 bg-card rounded-lg border border-border">
  //             <p className="text-muted-foreground">No orders found</p>
  //           </div>
  //         )}
  //       </div>

  //       {/* Modal for order details */}
  //       {selectedOrder && (
  //         <motion.div
  //           initial={{ opacity: 0 }}
  //           animate={{ opacity: 1 }}
  //           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  //           onClick={() => setSelectedOrder(null)}
  //         >
  //           <motion.div
  //             initial={{ scale: 0.95, opacity: 0 }}
  //             animate={{ scale: 1, opacity: 1 }}
  //             className="bg-card rounded-lg max-w-2xl w-full p-6 border border-border max-h-[90vh] overflow-y-auto"
  //             onClick={(e) => e.stopPropagation()}
  //           >
  //             <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder.id.slice(0, 8)}</h2>
              
  //             <div className="space-y-4">
  //               <div>
  //                 <h3 className="font-semibold mb-2">Customer Information</h3>
  //                 <p className="text-sm text-muted-foreground"><strong>Name:</strong> {selectedOrder.customerName}</p>
  //                 <p className="text-sm text-muted-foreground"><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
  //                 <p className="text-sm text-muted-foreground"><strong>Email:</strong> {selectedOrder.email}</p>
  //                 <p className="text-sm text-muted-foreground"><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
  //               </div>

  //               <div>
  //                 <h3 className="font-semibold mb-2">Order Items</h3>
  //                 <div className="space-y-2">
  //                   {selectedOrder.items.map((item, idx) => {
  //                     const finalPrice = item.price - (item.discount || 0);
  //                     const itemTotal = finalPrice * item.quantity;
  //                     return (
  //                       <div key={idx} className="flex flex-col text-sm p-2 bg-secondary rounded">
  //                         <div className="flex justify-between">
  //                           <span className="font-medium">{item.name}</span>
  //                           <span className="font-semibold">{formatPrice(itemTotal)}</span>
  //                         </div>
  //                         <div className="flex justify-between text-xs text-muted-foreground">
  //                           <span>Unit: {formatPrice(finalPrice)} × {item.quantity}</span>
  //                           {item.discount && item.discount > 0 && (
  //                             <span className="text-green-600">Saved: {formatPrice(item.discount)} each</span>
  //                           )}
  //                         </div>
  //                       </div>
  //                     );
  //                   })}
  //                 </div>
  //               </div>

  //               <div className="p-3 bg-secondary rounded-lg border border-border">
  //                 <h3 className="font-semibold mb-2">Price Summary</h3>
  //                 <div className="space-y-1 text-sm">
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground">Subtotal</span>
  //                     <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total - (selectedOrder.deliveryCharge || 0))}</span>
  //                   </div>
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground flex items-center gap-1">
  //                       <Truck className="w-4 h-4" /> Delivery
  //                     </span>
  //                     <span>{formatPrice(selectedOrder.deliveryCharge || 0)}</span>
  //                   </div>
  //                   <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
  //                     <span>Total</span>
  //                     <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
  //                   </div>
  //                 </div>
  //               </div>

  //               <div className="p-3 bg-secondary rounded-lg border border-border">
  //                 <h3 className="font-semibold mb-2">Order Timeline</h3>
  //                 <div className="space-y-1 text-sm">
  //                   <div className="flex justify-between">
  //                     <span className="text-muted-foreground">Order Placed</span>
  //                     <span className="font-medium">{formatDateTime(selectedOrder.createdAt).full}</span>
  //                   </div>
  //                   {selectedOrder.updatedAt && (
  //                     <div className="flex justify-between">
  //                       <span className="text-muted-foreground">Last Updated</span>
  //                       <span className="font-medium">{formatDateTime(selectedOrder.updatedAt).full}</span>
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>

  //               {selectedOrder.adminNotes && (
  //                 <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
  //                   <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
  //                   <p className="text-sm text-purple-800">{selectedOrder.adminNotes}</p>
  //                 </div>
  //               )}

  //               <div className="border-t border-border pt-4">
  //                 <p className="text-sm text-muted-foreground">Status: <span className="font-semibold capitalize">{selectedOrder.status}</span></p>
  //                 {selectedOrder.status === 'confirmed' && (
  //                   <p className="text-sm text-green-600">✅ Included in Total Income</p>
  //                 )}
  //                 {PENDING_STATUSES.includes(selectedOrder.status) && (
  //                   <p className="text-sm text-yellow-600">⏳ Included in Pending Income</p>
  //                 )}
  //                 {selectedOrder.status === 'cancelled' && (
  //                   <p className="text-sm text-red-600">❌ Cancelled - Not counted</p>
  //                 )}
  //               </div>
  //             </div>

  //             <button
  //               onClick={() => setSelectedOrder(null)}
  //               className="w-full mt-6 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
  //             >
  //               Close
  //             </button>
  //           </motion.div>
  //         </motion.div>
  //       )}

  //       {/* Admin Note Modal */}
  //       {showNoteModal && (
  //         <motion.div
  //           initial={{ opacity: 0 }}
  //           animate={{ opacity: 1 }}
  //           exit={{ opacity: 0 }}
  //           className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
  //           onClick={() => {
  //             setShowNoteModal(false);
  //             setNoteText('');
  //             setNoteOrderId(null);
  //           }}
  //         >
  //           <motion.div
  //             initial={{ scale: 0.9, opacity: 0 }}
  //             animate={{ scale: 1, opacity: 1 }}
  //             exit={{ scale: 0.9, opacity: 0 }}
  //             className="bg-card rounded-lg max-w-md w-full p-6 border border-border"
  //             onClick={(e) => e.stopPropagation()}
  //           >
  //             <div className="flex justify-between items-center mb-4">
  //               <div>
  //                 <h2 className="text-xl font-bold text-foreground">
  //                   {currentNote ? 'Edit Admin Note' : 'Add Admin Note'}
  //                 </h2>
  //                 <p className="text-sm text-muted-foreground mt-1">
  //                   Order #{noteOrderId?.slice(0, 8)}...
  //                 </p>
  //               </div>
  //               <button
  //                 onClick={() => {
  //                   setShowNoteModal(false);
  //                   setNoteText('');
  //                   setNoteOrderId(null);
  //                 }}
  //                 className="text-muted-foreground hover:text-foreground transition-colors"
  //               >
  //                 <X className="w-6 h-6" />
  //               </button>
  //             </div>

  //             <div className="space-y-4">
  //               <div>
  //                 <label className="block text-sm font-medium text-foreground mb-2">
  //                   Note Content
  //                 </label>
  //                 <textarea
  //                   value={noteText}
  //                   onChange={(e) => setNoteText(e.target.value)}
  //                   rows={5}
  //                   className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
  //                   placeholder="Add your admin note here..."
  //                 />
  //                 <p className="text-xs text-muted-foreground mt-1">
  //                   {noteText.length} characters
  //                 </p>
  //               </div>

  //               {currentNote && (
  //                 <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
  //                   <p className="text-xs text-purple-600 font-semibold mb-1">Previous Note</p>
  //                   <p className="text-sm text-purple-800">{currentNote}</p>
  //                 </div>
  //               )}

  //               <div className="flex gap-3 pt-2">
  //                 <button
  //                   onClick={() => {
  //                     setShowNoteModal(false);
  //                     setNoteText('');
  //                     setNoteOrderId(null);
  //                   }}
  //                   className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
  //                 >
  //                   Cancel
  //                 </button>
  //                 <button
  //                   onClick={handleSaveNote}
  //                   disabled={savingNote || !noteText.trim()}
  //                   className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
  //                     savingNote || !noteText.trim()
  //                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
  //                       : 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg'
  //                   }`}
  //                 >
  //                   {savingNote ? 'Saving...' : currentNote ? 'Update Note' : 'Save Note'}
  //                 </button>
  //               </div>
  //             </div>
  //           </motion.div>
  //         </motion.div>
  //       )}
  //     </div>
  //   );
  // }


  // confirmed = done

  'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, update, get } from 'firebase/database';
import { ArrowLeft, MessageCircle, Eye, TrendingUp, Clock, FileText, X, Package, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  finalPrice?: number;
}

interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'cancelled';
  createdAt: string;
  orderNotes?: string;
  adminNotes?: string;
}

// ✅ Updated status colors
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  dispatched: 'bg-purple-100 text-purple-800 border-purple-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300'
};

// ✅ Updated status options
const statusOptions = ['pending', 'confirmed', 'dispatched', 'cancelled'];

const CONFIRMED_STATUS = 'confirmed';
const PENDING_STATUSES = ['pending', 'dispatched', 'delivered'];

export default function AdminOrdersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteOrderId, setNoteOrderId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;

    const ordersRef = ref(rtdb, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData: Order[] = [];
        const data = snapshot.val();
        
        Object.keys(data).forEach((key) => {
          const order = {
            id: key,
            ...data[key]
          } as Order;
          
          if (order.items) {
            order.items = order.items.map(item => ({
              ...item,
              finalPrice: item.price - (item.discount || 0)
            }));
          }
          
          ordersData.push(order);
        });
        
        ordersData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setOrders(ordersData);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-PK', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      full: date.toLocaleString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const calculateIncome = () => {
    let totalIncome = 0;
    let pendingIncome = 0;

    orders.forEach(order => {
      if (order.status === 'cancelled') return;

      if (order.status === CONFIRMED_STATUS) {
        totalIncome += order.total || 0;
      } else if (PENDING_STATUSES.includes(order.status)) {
        pendingIncome += order.total || 0;
      }
    });

    return { totalIncome, pendingIncome };
  };

  const { totalIncome, pendingIncome } = calculateIncome();
  const pendingCount = orders.filter(o => PENDING_STATUSES.includes(o.status)).length;
  const confirmedCount = orders.filter(o => o.status === CONFIRMED_STATUS).length;

  const restoreStock = async (items: OrderItem[]) => {
    for (const item of items) {
      try {
        const productRef = ref(rtdb, `products/${item.id}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const product = snapshot.val();
          const currentStock = product.stock || 0;
          const newStock = currentStock + item.quantity;
          
          await update(productRef, {
            stock: newStock
          });
        }
      } catch (error) {
        console.error(`Error restoring stock for ${item.name}:`, error);
      }
    }
  };

  const cutStock = async (items: OrderItem[]) => {
    for (const item of items) {
      try {
        const productRef = ref(rtdb, `products/${item.id}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const product = snapshot.val();
          const currentStock = product.stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          
          await update(productRef, {
            stock: newStock
          });
        }
      } catch (error) {
        console.error(`Error cutting stock for ${item.name}:`, error);
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string, order: Order) => {
    const oldStatus = order.status;

    if (newStatus === 'cancelled') {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will cancel the order and restore all items to stock!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel order!',
        cancelButtonText: 'No, keep it'
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await restoreStock(order.items);
        
        const orderRef = ref(rtdb, `orders/${orderId}`);
        await update(orderRef, {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });

        await Swal.fire({
          icon: 'success',
          title: 'Order Cancelled!',
          text: 'Order has been cancelled and stock has been restored.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('[v0] Error cancelling order:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to cancel order. Please try again.'
        });
      }
      return;
    }

    if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will cut stock for all items in this order!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, restore order!',
        cancelButtonText: 'No, keep cancelled'
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await cutStock(order.items);
        
        const orderRef = ref(rtdb, `orders/${orderId}`);
        await update(orderRef, {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });

        await Swal.fire({
          icon: 'success',
          title: 'Order Restored!',
          text: `Order has been restored to ${newStatus} and stock has been updated.`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('[v0] Error restoring order:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to restore order. Please try again.'
        });
      }
      return;
    }

    try {
      const orderRef = ref(rtdb, `orders/${orderId}`);
      await update(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      await Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Order status changed to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('[v0] Error updating order:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update order status. Please try again.'
      });
    }
  };

  const onStatusChange = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    if (order.status === newStatus) return;

    await handleStatusChange(orderId, newStatus, order);
  };

  const handleNoteClick = (order: Order) => {
    setNoteOrderId(order.id);
    setCurrentNote(order.adminNotes || '');
    setNoteText(order.adminNotes || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!noteOrderId) return;
    
    setSavingNote(true);
    try {
      const orderRef = ref(rtdb, `orders/${noteOrderId}`);
      await update(orderRef, {
        adminNotes: noteText,
        updatedAt: new Date().toISOString()
      });

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === noteOrderId 
            ? { ...order, adminNotes: noteText }
            : order
        )
      );

      await Swal.fire({
        icon: 'success',
        title: 'Note Saved!',
        text: 'Admin note has been added to the order.',
        timer: 1500,
        showConfirmButton: false
      });

      setShowNoteModal(false);
      setNoteText('');
      setNoteOrderId(null);
      setCurrentNote('');
    } catch (error) {
      console.error('Error saving note:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save note. Please try again.'
      });
    } finally {
      setSavingNote(false);
    }
  };

  const togglePriceSummary = (orderId: string) => {
    if (expandedSummary === orderId) {
      setExpandedSummary(null);
    } else {
      setExpandedSummary(orderId);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const whatsappUrl = (phoneNumber: string, orderID: string) => {
    const message = encodeURIComponent(
      `Hi! Your order #${orderID} has been confirmed. We will contact you soon with delivery details.`
    );
    return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Orders Management</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Income Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">💰 Total Income</p>
                <p className="text-3xl font-bold text-green-800">
                  {formatPrice(totalIncome)}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {confirmedCount} done orders
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium mb-1">⏳ Pending Income</p>
                <p className="text-3xl font-bold text-yellow-800">
                  {formatPrice(pendingIncome)}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {pendingCount} orders pending
                </p>
              </div>
              <div className="bg-yellow-200 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-white'
                : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          >
            All ({orders.length})
          </button>
          {statusOptions.map((status) => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                {status === 'dispatched' ? 'Dispatched' : status} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredOrders.map((order) => {
              const dateTime = formatDateTime(order.createdAt);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-lg border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Order Header */}
                  <div className="p-4 bg-secondary border-b border-border">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                        <p className="font-mono font-semibold text-sm">{order.id.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Customer</p>
                        <p className="font-semibold text-sm">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                        <p className="font-semibold text-sm">{dateTime.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Order Time</p>
                        <p className="font-semibold text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {dateTime.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Items</p>
                        <p className="font-semibold text-sm">{order.items.length} products</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Total</p>
                        <p className="font-bold text-lg text-primary">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Customer Info */}
                      <div>
                        <h3 className="font-semibold mb-3 text-foreground text-sm">Customer Info</h3>
                        <div className="text-sm space-y-1 text-muted-foreground">
                          <p>📱 {order.phoneNumber}</p>
                          <p>📧 {order.email}</p>
                          <p>📍 {order.address}, {order.city}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div>
                        <h3 className="font-semibold mb-3 text-foreground text-sm">Order Items</h3>
                        <div className="text-sm space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span className="text-muted-foreground">{item.name} ×{item.quantity}</span>
                              <span className="font-medium text-primary">
                                {formatPrice((item.price - (item.discount || 0)) * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Price Summary Toggle Button */}
                        <button
                          onClick={() => togglePriceSummary(order.id)}
                          className="mt-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                          {expandedSummary === order.id ? (
                            <>
                              <ChevronUp size={14} />
                              Hide Price Summary
                            </>
                          ) : (
                            <>
                              <ChevronDown size={14} />
                              View Price Summary
                            </>
                          )}
                        </button>
                      </div>

                      {/* Status & Actions */}
                      <div>
                        <h3 className="font-semibold mb-3 text-foreground text-sm">Status</h3>
                        <select
                          value={order.status}
                          onChange={(e) => onStatusChange(order.id, e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${statusColors[order.status]} cursor-pointer`}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status === 'dispatched' ? 'Dispatched' : 
                               status === 'confirmed' ? 'Done' :
                               status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                        {order.status === 'cancelled' && (
                          <p className="text-xs text-red-500 mt-1">⚠️ Stock restored</p>
                        )}
                        {order.status === 'confirmed' && (
                          <p className="text-xs text-blue-500 mt-1">💰 Added to Total Income</p>
                        )}
                        {PENDING_STATUSES.includes(order.status) && order.status !== 'confirmed' && (
                          <p className="text-xs text-yellow-500 mt-1">⏳ Pending Income</p>
                        )}
                      </div>
                    </div>

                    {/* Price Summary - Collapsible */}
                    {expandedSummary === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
                      >
                        <h3 className="font-semibold mb-3 text-foreground flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Price Summary
                        </h3>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => {
                            const finalPrice = item.price - (item.discount || 0);
                            const itemTotal = finalPrice * item.quantity;
                            return (
                              <div key={idx} className="flex flex-col text-sm border-b border-gray-200 pb-2">
                                <div className="flex justify-between">
                                  <span className="font-medium text-foreground">{item.name}</span>
                                  <span className="font-semibold text-primary">{formatPrice(itemTotal)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>
                                    Unit Price: {formatPrice(finalPrice)} × {item.quantity}
                                  </span>
                                  {item.discount && item.discount > 0 && (
                                    <span className="text-green-600">
                                      💰 Saved: {formatPrice(item.discount)} each
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          
                          <div className="flex justify-between text-sm pt-2">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="font-medium">
                              {formatPrice(order.subtotal || order.total - (order.deliveryCharge || 0))}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Truck className="w-4 h-4" />
                              Delivery Charge
                            </span>
                            <span className="font-medium">{formatPrice(order.deliveryCharge || 0)}</span>
                          </div>
                          
                          <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
                            <span className="text-foreground">Grand Total</span>
                            <span className="text-primary">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Notes */}
                    {order.orderNotes && (
                      <div className="mb-4 p-3 bg-secondary rounded-lg border border-border">
                        <p className="text-xs text-muted-foreground mb-1">Customer Notes</p>
                        <p className="text-sm text-foreground">{order.orderNotes}</p>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {order.adminNotes && (
                      <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
                        <p className="text-sm text-purple-800">{order.adminNotes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={whatsappUrl(order.phoneNumber, order.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
                      >
                        <MessageCircle size={16} />
                        WhatsApp
                      </a>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => handleNoteClick(order)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
                      >
                        <FileText size={16} />
                        {order.adminNotes ? 'Edit Note' : 'Add Note'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* Modal for order details */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-lg max-w-2xl w-full p-6 border border-border max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder.id.slice(0, 8)}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-sm text-muted-foreground"><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground"><strong>Phone:</strong> {selectedOrder.phoneNumber}</p>
                <p className="text-sm text-muted-foreground"><strong>Email:</strong> {selectedOrder.email}</p>
                <p className="text-sm text-muted-foreground"><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => {
                    const finalPrice = item.price - (item.discount || 0);
                    const itemTotal = finalPrice * item.quantity;
                    return (
                      <div key={idx} className="flex flex-col text-sm p-2 bg-secondary rounded">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.name}</span>
                          <span className="font-semibold">{formatPrice(itemTotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Unit: {formatPrice(finalPrice)} × {item.quantity}</span>
                          {item.discount && item.discount > 0 && (
                            <span className="text-green-600">Saved: {formatPrice(item.discount)} each</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-secondary rounded-lg border border-border">
                <h3 className="font-semibold mb-2">Price Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(selectedOrder.subtotal || selectedOrder.total - (selectedOrder.deliveryCharge || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="w-4 h-4" /> Delivery
                    </span>
                    <span>{formatPrice(selectedOrder.deliveryCharge || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-secondary rounded-lg border border-border">
                <h3 className="font-semibold mb-2">Order Timeline</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Placed</span>
                    <span className="font-medium">{formatDateTime(selectedOrder.createdAt).full}</span>
                  </div>
                  {selectedOrder.updatedAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">{formatDateTime(selectedOrder.updatedAt).full}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.adminNotes && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 mb-1 font-semibold">📝 Admin Note</p>
                  <p className="text-sm text-purple-800">{selectedOrder.adminNotes}</p>
                </div>
              )}

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Status: <span className="font-semibold capitalize">
                  {selectedOrder.status === 'dispatched' ? 'Dispatched' : 
                   selectedOrder.status === 'confirmed' ? 'Done' :
                   selectedOrder.status}
                </span></p>
                {selectedOrder.status === 'confirmed' && (
                  <p className="text-sm text-green-600">✅ Included in Total Income</p>
                )}
                {PENDING_STATUSES.includes(selectedOrder.status) && selectedOrder.status !== 'confirmed' && (
                  <p className="text-sm text-yellow-600">⏳ Included in Pending Income</p>
                )}
                {selectedOrder.status === 'cancelled' && (
                  <p className="text-sm text-red-600">❌ Cancelled - Not counted</p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Admin Note Modal */}
      {showNoteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowNoteModal(false);
            setNoteText('');
            setNoteOrderId(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-lg max-w-md w-full p-6 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {currentNote ? 'Edit Admin Note' : 'Add Admin Note'}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Order #{noteOrderId?.slice(0, 8)}...
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                  setNoteOrderId(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Note Content
                </label>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Add your admin note here..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {noteText.length} characters
                </p>
              </div>

              {currentNote && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold mb-1">Previous Note</p>
                  <p className="text-sm text-purple-800">{currentNote}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowNoteModal(false);
                    setNoteText('');
                    setNoteOrderId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  disabled={savingNote || !noteText.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    savingNote || !noteText.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600 hover:shadow-lg'
                  }`}
                >
                  {savingNote ? 'Saving...' : currentNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}