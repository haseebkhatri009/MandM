// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue } from 'firebase/database';

// export default function CheckoutPage() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   const totalPrice = getTotalPrice();
//   const grandTotal = totalPrice + deliveryCharge;

//   // Fetch delivery charges from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/deliveryCharges');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setDeliveryCharge(snapshot.val());
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       const orderId = Date.now().toString();
      
//       const orderData = {
//         id: orderId,
//         userId: user?.uid || 'guest',
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes,
//         items: cartItems,
//         subtotal: totalPrice,
//         deliveryCharge: deliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       setSuccess(true);
//       clearCart();

//       // Redirect to success page after 2 seconds
//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         disabled
//                       />
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         placeholder="WhatsApp Number *"
//                         value={formData.phoneNumber}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
//                   >
//                     {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
//                   </button>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => (
//                     <div key={item.id} className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <p className="font-medium text-foreground">{item.name}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {item.quantity} x ₹{Math.round(item.price - (item.discount || 0))}
//                         </p>
//                       </div>
//                       <p className="font-semibold text-primary">
//                         ₹{Math.round((item.price - (item.discount || 0)) * item.quantity)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">₹{Math.round(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">₹{deliveryCharge}</span>
//                   </div>
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">₹{Math.round(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }





// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';

// export default function CheckoutPage() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const totalPrice = getTotalPrice();
//   const grandTotal = totalPrice + deliveryCharge;

//   // Fetch delivery charges from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/deliveryCharges');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setDeliveryCharge(snapshot.val());
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Check stock when component loads
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               errors[item.id] = `Only ${availableStock} items of "${item.name}" available`;
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0) {
//       checkStock();
//     }
//   }, [cartItems]);

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Show stock errors if any
//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link
//                 href="/cart"
//                 className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // 🔥 FINAL STOCK CHECK - Double check before placing order
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               setError(`"${item.name}" is out of stock. Only ${availableStock} available.`);
//               setLoading(false);
//               return;
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       const orderData = {
//         id: orderId,
//         userId: user?.uid || 'guest',
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes,
//         items: cartItems.map(item => ({
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         })),
//         subtotal: totalPrice,
//         deliveryCharge: deliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       // 🔥 UPDATE STOCK - Cut the quantity from stock
//       for (const item of cartItems) {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = currentStock - item.quantity;
          
//           console.log(`Updating stock for ${item.name}: ${currentStock} -> ${newStock}`);
          
//           // Update stock
//           await update(productRef, {
//             stock: Math.max(0, newStock) // Ensure stock doesn't go negative
//           });
//         }
//       }

//       setSuccess(true);
//       clearCart();

//       // Redirect to success page after 2 seconds
//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         disabled
//                       />
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         placeholder="WhatsApp Number *"
//                         value={formData.phoneNumber}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {item.quantity} x {formatPrice(finalPrice)}
//                           </p>
//                         </div>
//                         <p className="font-semibold text-primary">
//                           {formatPrice(finalPrice * item.quantity)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">{formatPrice(deliveryCharge)}</span>
//                   </div>
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }







//without login not reach
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CheckoutPage() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // Check authentication - redirect if not logged in
//   useEffect(() => {
//     if (!user) {
//       toast.error('Please login to access checkout', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🔒',
//       });
//       setTimeout(() => {
//         router.push('/login');
//       }, 1500);
//       return;
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   // Update email when user changes
//   useEffect(() => {
//     if (user?.email) {
//       setFormData(prev => ({ ...prev, email: user.email || '' }));
//     }
//   }, [user]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const totalPrice = getTotalPrice();
//   const grandTotal = totalPrice + deliveryCharge;

//   // Fetch delivery charges from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/banner/deliveryCharges');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         setDeliveryCharge(snapshot.val());
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Check stock when component loads
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               errors[item.id] = `Only ${availableStock} items of "${item.name}" available`;
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && user) {
//       checkStock();
//     }
//   }, [cartItems, user]);

//   // If still checking auth, show loading
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

//   // If user is not logged in, don't render the page
//   if (!user) {
//     return null;
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Show stock errors if any
//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link
//                 href="/cart"
//                 className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // 🔥 FINAL STOCK CHECK - Double check before placing order
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               setError(`"${item.name}" is out of stock. Only ${availableStock} available.`);
//               setLoading(false);
//               return;
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       const orderData = {
//         id: orderId,
//         userId: user?.uid || 'guest',
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes,
//         items: cartItems.map(item => ({
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         })),
//         subtotal: totalPrice,
//         deliveryCharge: deliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       // 🔥 UPDATE STOCK - Cut the quantity from stock
//       for (const item of cartItems) {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = currentStock - item.quantity;
          
//           console.log(`Updating stock for ${item.name}: ${currentStock} -> ${newStock}`);
          
//           // Update stock
//           await update(productRef, {
//             stock: Math.max(0, newStock) // Ensure stock doesn't go negative
//           });
//         }
//       }

//       setSuccess(true);
//       clearCart();

//       // Show success toast
//       toast.success('Order placed successfully!', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#10B981',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🎉',
//       });

//       // Redirect to success page after 2 seconds
//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//       toast.error('Failed to place order. Please try again.', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '❌',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Toaster Component */}
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#333',
//             color: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//           },
//         }}
//       />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         disabled
//                       />
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         placeholder="WhatsApp Number *"
//                         value={formData.phoneNumber}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {item.quantity} x {formatPrice(finalPrice)}
//                           </p>
//                         </div>
//                         <p className="font-semibold text-primary">
//                           {formatPrice(finalPrice * item.quantity)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">{formatPrice(deliveryCharge)}</span>
//                   </div>
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


//minOrderForFreeDelivery dc will 0 and without 11 digit 

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CheckoutPage() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // Check authentication - redirect if not logged in
//   useEffect(() => {
//     if (!user) {
//       toast.error('Please login to access checkout', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🔒',
//       });
//       setTimeout(() => {
//         router.push('/login');
//       }, 1500);
//       return;
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   // Update email when user changes
//   useEffect(() => {
//     if (user?.email) {
//       setFormData(prev => ({ ...prev, email: user.email || '' }));
//     }
//   }, [user]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const totalPrice = getTotalPrice();
  
//   // ✅ Calculate delivery charges based on min order
//   const getCalculatedDeliveryCharge = () => {
//     if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
//       return 0; // Free delivery if order meets minimum
//     }
//     return deliveryCharge;
//   };

//   const calculatedDeliveryCharge = getCalculatedDeliveryCharge();
//   const grandTotal = totalPrice + calculatedDeliveryCharge;

//   // Fetch delivery charges and min order from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//           setDeliveryCharge(data.deliveryCharges);
//         }
//         if (data.minOrderForFreeDelivery !== undefined && data.minOrderForFreeDelivery !== null) {
//           setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Check stock when component loads
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               errors[item.id] = `Only ${availableStock} items of "${item.name}" available`;
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && user) {
//       checkStock();
//     }
//   }, [cartItems, user]);

//   // If still checking auth, show loading
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

//   // If user is not logged in, don't render the page
//   if (!user) {
//     return null;
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Show stock errors if any
//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link
//                 href="/cart"
//                 className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // 🔥 FINAL STOCK CHECK - Double check before placing order
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               setError(`"${item.name}" is out of stock. Only ${availableStock} available.`);
//               setLoading(false);
//               return;
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       const orderData = {
//         id: orderId,
//         userId: user?.uid || 'guest',
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes,
//         items: cartItems.map(item => ({
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         })),
//         subtotal: totalPrice,
//         deliveryCharge: calculatedDeliveryCharge, // ✅ Use calculated delivery charge
//         total: grandTotal,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       // 🔥 UPDATE STOCK - Cut the quantity from stock
//       for (const item of cartItems) {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = currentStock - item.quantity;
          
//           console.log(`Updating stock for ${item.name}: ${currentStock} -> ${newStock}`);
          
//           // Update stock
//           await update(productRef, {
//             stock: Math.max(0, newStock) // Ensure stock doesn't go negative
//           });
//         }
//       }

//       setSuccess(true);
//       clearCart();

//       // Show success toast
//       toast.success('Order placed successfully!', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#10B981',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🎉',
//       });

//       // Redirect to success page after 2 seconds
//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//       toast.error('Failed to place order. Please try again.', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '❌',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Toaster Component */}
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#333',
//             color: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//           },
//         }}
//       />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         disabled
//                       />
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         placeholder="WhatsApp Number *"
//                         value={formData.phoneNumber}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {item.quantity} x {formatPrice(finalPrice)}
//                           </p>
//                         </div>
//                         <p className="font-semibold text-primary">
//                           {formatPrice(finalPrice * item.quantity)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">
//                       {formatPrice(calculatedDeliveryCharge)}
//                     </span>
//                   </div>
//                   {calculatedDeliveryCharge === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                     <div className="text-sm text-green-600 text-right -mt-1">
//                       🎉 Free delivery applied!
//                     </div>
//                   )}
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



//max 11 digit allowed

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CheckoutPage() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [phoneError, setPhoneError] = useState('');

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '03',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // Check authentication - redirect if not logged in
//   useEffect(() => {
//     if (!user) {
//       toast.error('Please login to access checkout', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🔒',
//       });
//       setTimeout(() => {
//         router.push('/login');
//       }, 1500);
//       return;
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   // Update email when user changes
//   useEffect(() => {
//     if (user?.email) {
//       setFormData(prev => ({ ...prev, email: user.email || '' }));
//     }
//   }, [user]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const totalPrice = getTotalPrice();
  
//   // ✅ Calculate delivery charges based on min order
//   const getCalculatedDeliveryCharge = () => {
//     if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
//       return 0; // Free delivery if order meets minimum
//     }
//     return deliveryCharge;
//   };

//   const calculatedDeliveryCharge = getCalculatedDeliveryCharge();
//   const grandTotal = totalPrice + calculatedDeliveryCharge;

//   // Fetch delivery charges and min order from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//           setDeliveryCharge(data.deliveryCharges);
//         }
//         if (data.minOrderForFreeDelivery !== undefined && data.minOrderForFreeDelivery !== null) {
//           setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Check stock when component loads
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               errors[item.id] = `Only ${availableStock} items of "${item.name}" available`;
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && user) {
//       checkStock();
//     }
//   }, [cartItems, user]);

//   // ✅ Validate phone number
//   const validatePhoneNumber = (phone: string) => {
//     // Remove any non-digit characters for validation
//     const digitsOnly = phone.replace(/\D/g, '');
    
//     // Must start with 03
//     if (!phone.startsWith('03')) {
//       setPhoneError('Must start with 03');
//       return false;
//     }
    
//     // Must be exactly 11 digits total (03 + 9 digits)
//     if (digitsOnly.length !== 11) {
//       setPhoneError(`Must be 11 digits (03 + 9 digits)`);
//       return false;
//     }
    
//     setPhoneError('');
//     return true;
//   };

//   // ✅ Handle phone input change
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
    
//     // Remove all non-digit characters
//     const digitsOnly = value.replace(/\D/g, '');
    
//     // Limit to 11 digits
//     if (digitsOnly.length > 11) {
//       return;
//     }
    
//     // If empty, set to '03'
//     if (digitsOnly.length === 0) {
//       setFormData(prev => ({ ...prev, phoneNumber: '03' }));
//       setPhoneError('');
//       return;
//     }
    
//     // Ensure it starts with 03
//     let formattedValue = digitsOnly;
//     if (formattedValue.length >= 2) {
//       // If first two digits are not 03, force them
//       if (!formattedValue.startsWith('03')) {
//         // If user typed something else, replace with 03
//         formattedValue = '03' + formattedValue.slice(2);
//       }
//     }
    
//     // Format as 03XXXXXXXXX
//     if (formattedValue.length > 2) {
//       // Ensure we have 03 + 9 digits max
//       if (formattedValue.length > 11) {
//         formattedValue = formattedValue.slice(0, 11);
//       }
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     } else {
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     }
    
//     // Validate
//     validatePhoneNumber(formattedValue);
//   };

//   // If still checking auth, show loading
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

//   // If user is not logged in, don't render the page
//   if (!user) {
//     return null;
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Show stock errors if any
//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link
//                 href="/cart"
//                 className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     // If it's phone number, use the specific handler
//     if (name === 'phoneNumber') {
//       handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ Validate phone before submit
//     if (!validatePhoneNumber(formData.phoneNumber)) {
//       setError('Please enter a valid phone number (03XXXXXXXXX)');
//       return;
//     }

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // 🔥 FINAL STOCK CHECK - Double check before placing order
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             if (item.quantity > availableStock) {
//               setError(`"${item.name}" is out of stock. Only ${availableStock} available.`);
//               setLoading(false);
//               return;
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       const orderData = {
//         id: orderId,
//         userId: user?.uid || 'guest',
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes,
//         items: cartItems.map(item => ({
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         })),
//         subtotal: totalPrice,
//         deliveryCharge: calculatedDeliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       // 🔥 UPDATE STOCK - Cut the quantity from stock
//       for (const item of cartItems) {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
//           const newStock = currentStock - item.quantity;
          
//           console.log(`Updating stock for ${item.name}: ${currentStock} -> ${newStock}`);
          
//           // Update stock
//           await update(productRef, {
//             stock: Math.max(0, newStock)
//           });
//         }
//       }

//       setSuccess(true);
//       clearCart();

//       // Show success toast
//       toast.success('Order placed successfully!', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#10B981',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🎉',
//       });

//       // Redirect to success page after 2 seconds
//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//       toast.error('Failed to place order. Please try again.', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '❌',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Toaster Component */}
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#333',
//             color: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//           },
//         }}
//       />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         disabled
//                       />
//                       <div>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           placeholder="WhatsApp Number *"
//                           value={formData.phoneNumber}
//                           onChange={handleInputChange}
//                           required
//                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input ${
//                             phoneError ? 'border-red-500 focus:ring-red-500' : 'border-border'
//                           }`}
//                         />
//                         {/* ✅ Phone number error message */}
//                         {phoneError && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle className="w-3 h-3" />
//                             {phoneError}
//                           </p>
//                         )}
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Format: 03XXXXXXXXX (03 + 9 digits)
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {item.quantity} x {formatPrice(finalPrice)}
//                           </p>
//                         </div>
//                         <p className="font-semibold text-primary">
//                           {formatPrice(finalPrice * item.quantity)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">
//                       {formatPrice(calculatedDeliveryCharge)}
//                     </span>
//                   </div>
//                   {calculatedDeliveryCharge === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                     <div className="text-sm text-green-600 text-right -mt-1">
//                       🎉 Free delivery applied!
//                     </div>
//                   )}
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CheckoutPage() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [phoneError, setPhoneError] = useState('');
//   const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: any }>({});
//   const [productDetails, setProductDetails] = useState<{ [key: string]: any }>({});

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '03',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // Check authentication
//   useEffect(() => {
//     if (!user) {
//       toast.error('Please login to access checkout', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🔒',
//       });
//       setTimeout(() => {
//         router.push('/login');
//       }, 1500);
//       return;
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   // Update email when user changes
//   useEffect(() => {
//     if (user?.email) {
//       setFormData(prev => ({ ...prev, email: user.email || '' }));
//     }
//   }, [user]);

//   // ✅ Load flavor selections from RTDB
//   useEffect(() => {
//     const loadFlavorSelections = async () => {
//       if (!user) return;
//       try {
//         const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//         const snapshot = await get(selectionsRef);
//         if (snapshot.exists()) {
//           setFlavorSelections(snapshot.val());
//         }
//       } catch (error) {
//         console.error('Error loading flavor selections:', error);
//       }
//     };
//     loadFlavorSelections();
//   }, [user]);

//   // ✅ Load product details for flavor products
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       const details: { [key: string]: any } = {};
//       for (const item of cartItems) {
//         if (!details[item.id]) {
//           try {
//             const snapshot = await get(ref(rtdb, `products/${item.id}`));
//             if (snapshot.exists()) {
//               details[item.id] = { id: item.id, ...snapshot.val() };
//             }
//           } catch (error) {
//             console.error('Error fetching product:', error);
//           }
//         }
//       }
//       setProductDetails(details);
//     };
//     if (cartItems.length > 0 && user) {
//       fetchProductDetails();
//     }
//   }, [cartItems, user]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // ✅ Get total quantity including flavors
//   const getTotalFlavorQuantityForProduct = (productId: string) => {
//     const selection = flavorSelections[productId];
//     if (!selection || !selection.selectedFlavors) return 0;
//     return selection.selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//   };

//   // ✅ Get total cart quantity with flavors
//   const getTotalCartQuantity = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.hasFlavors) {
//         total += getTotalFlavorQuantityForProduct(item.id);
//       } else {
//         total += item.quantity;
//       }
//     }
//     return total;
//   };

//   // ✅ Get total price including flavors
//   const getTotalCartPrice = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       const finalPrice = item.price - (item.discount || 0);
      
//       if (product?.hasFlavors) {
//         const qty = getTotalFlavorQuantityForProduct(item.id);
//         total += finalPrice * qty;
//       } else {
//         total += finalPrice * item.quantity;
//       }
//     }
//     return total;
//   };

//   const totalPrice = getTotalCartPrice();
//   const totalQuantity = getTotalCartQuantity();

//   // ✅ Calculate delivery charges based on min order
//   const getCalculatedDeliveryCharge = () => {
//     if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
//       return 0;
//     }
//     return deliveryCharge;
//   };

//   const calculatedDeliveryCharge = getCalculatedDeliveryCharge();
//   const grandTotal = totalPrice + calculatedDeliveryCharge;

//   // Fetch delivery charges and min order from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//           setDeliveryCharge(data.deliveryCharges);
//         }
//         if (data.minOrderForFreeDelivery !== undefined && data.minOrderForFreeDelivery !== null) {
//           setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Check stock when component loads
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
            
//             // ✅ Check flavor product stock
//             const productDetail = productDetails[item.id];
//             if (productDetail?.hasFlavors) {
//               const totalQty = getTotalFlavorQuantityForProduct(item.id);
//               if (totalQty > availableStock) {
//                 errors[item.id] = `Only ${availableStock} items of "${item.name}" available (${totalQty} requested)`;
//               }
//             } else {
//               if (item.quantity > availableStock) {
//                 errors[item.id] = `Only ${availableStock} items of "${item.name}" available`;
//               }
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && user && Object.keys(productDetails).length > 0) {
//       checkStock();
//     }
//   }, [cartItems, user, productDetails, flavorSelections]);

//   // ✅ Validate phone number
//   const validatePhoneNumber = (phone: string) => {
//     const digitsOnly = phone.replace(/\D/g, '');
    
//     if (!phone.startsWith('03')) {
//       setPhoneError('Must start with 03');
//       return false;
//     }
    
//     if (digitsOnly.length !== 11) {
//       setPhoneError(`Must be 11 digits (03 + 9 digits)`);
//       return false;
//     }
    
//     setPhoneError('');
//     return true;
//   };

//   // ✅ Handle phone input change
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
//     const digitsOnly = value.replace(/\D/g, '');
    
//     if (digitsOnly.length > 11) return;
    
//     if (digitsOnly.length === 0) {
//       setFormData(prev => ({ ...prev, phoneNumber: '03' }));
//       setPhoneError('');
//       return;
//     }
    
//     let formattedValue = digitsOnly;
//     if (formattedValue.length >= 2) {
//       if (!formattedValue.startsWith('03')) {
//         formattedValue = '03' + formattedValue.slice(2);
//       }
//     }
    
//     if (formattedValue.length > 2) {
//       if (formattedValue.length > 11) {
//         formattedValue = formattedValue.slice(0, 11);
//       }
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     } else {
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     }
    
//     validatePhoneNumber(formattedValue);
//   };

//   // If still checking auth, show loading
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

//   if (!user) {
//     return null;
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Show stock errors if any
//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link
//                 href="/cart"
//                 className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'phoneNumber') {
//       handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validatePhoneNumber(formData.phoneNumber)) {
//       setError('Please enter a valid phone number (03XXXXXXXXX)');
//       return;
//     }

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // ✅ FINAL STOCK CHECK - Double check before placing order
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
            
//             const productDetail = productDetails[item.id];
//             if (productDetail?.hasFlavors) {
//               const totalQty = getTotalFlavorQuantityForProduct(item.id);
//               if (totalQty > availableStock) {
//                 setError(`"${item.name}" is out of stock. Only ${availableStock} available. (${totalQty} requested)`);
//                 setLoading(false);
//                 return;
//               }
//             } else {
//               if (item.quantity > availableStock) {
//                 setError(`"${item.name}" is out of stock. Only ${availableStock} available.`);
//                 setLoading(false);
//                 return;
//               }
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       // ✅ Build order items with flavor details
//       const orderItems = cartItems.map(item => {
//         const productDetail = productDetails[item.id];
//         if (productDetail?.hasFlavors) {
//           const selection = flavorSelections[item.id];
//           const selectedFlavors = selection?.selectedFlavors || [];
//           const totalQty = selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//           const finalPrice = item.price - (item.discount || 0);
          
//           return {
//             ...item,
//             finalPrice: finalPrice,
//             quantity: totalQty,
//             selectedFlavors: selectedFlavors,
//             isFlavorProduct: true
//           };
//         }
//         return {
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         };
//       });

//       const orderData = {
//         id: orderId,
//         userId: user?.uid || 'guest',
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes,
//         items: orderItems,
//         subtotal: totalPrice,
//         totalQuantity: totalQuantity,
//         deliveryCharge: calculatedDeliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       // 🔥 UPDATE STOCK - Cut the quantity from stock
//       for (const item of cartItems) {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
          
//           const productDetail = productDetails[item.id];
//           let quantityToDeduct = item.quantity;
//           if (productDetail?.hasFlavors) {
//             quantityToDeduct = getTotalFlavorQuantityForProduct(item.id);
//           }
          
//           const newStock = currentStock - quantityToDeduct;
          
//           console.log(`Updating stock for ${item.name}: ${currentStock} -> ${newStock}`);
          
//           await update(productRef, {
//             stock: Math.max(0, newStock)
//           });
//         }
//       }

//       setSuccess(true);
//       clearCart();

//       toast.success('Order placed successfully!', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#10B981',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🎉',
//       });

//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//       toast.error('Failed to place order. Please try again.', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '❌',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 3000,
//           style: {
//             background: '#333',
//             color: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//           },
//         }}
//       />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         disabled
//                       />
//                       <div>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           placeholder="WhatsApp Number *"
//                           value={formData.phoneNumber}
//                           onChange={handleInputChange}
//                           required
//                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input ${
//                             phoneError ? 'border-red-500 focus:ring-red-500' : 'border-border'
//                           }`}
//                         />
//                         {phoneError && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle className="w-3 h-3" />
//                             {phoneError}
//                           </p>
//                         )}
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Format: 03XXXXXXXXX (03 + 9 digits)
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     const product = productDetails[item.id];
//                     let qty = item.quantity;
                    
//                     if (product?.hasFlavors) {
//                       qty = getTotalFlavorQuantityForProduct(item.id);
//                     }
                    
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {qty} x {formatPrice(finalPrice)}
//                           </p>
//                           {product?.hasFlavors && flavorSelections[item.id] && (
//                             <p className="text-xs text-green-600 mt-1">
//                               Flavors: {flavorSelections[item.id].selectedFlavors.map((f: any) => 
//                                 `${f.flavorName} (x${f.quantity})`
//                               ).join(', ')}
//                             </p>
//                           )}
//                         </div>
//                         <p className="font-semibold text-primary">
//                           {formatPrice(finalPrice * qty)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Total Items:</span>
//                     <span className="font-medium text-foreground">{totalQuantity} units</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">
//                       {formatPrice(calculatedDeliveryCharge)}
//                     </span>
//                   </div>
//                   {calculatedDeliveryCharge === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                     <div className="text-sm text-green-600 text-right -mt-1">
//                       🎉 Free delivery applied!
//                     </div>
//                   )}
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2, Plus, Minus, X } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CheckoutPage() {
//   const { cartItems, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
//   const [phoneError, setPhoneError] = useState('');
//   const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: any }>({});
//   const [productDetails, setProductDetails] = useState<{ [key: string]: any }>({});

//   // ✅ Wax selections - { productId: { variant: string, quantity: number }[] }
//   const [waxSelections, setWaxSelections] = useState<{ [key: string]: { variant: string; quantity: number }[] }>({});

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '03',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // Check authentication
//   useEffect(() => {
//     if (!user) {
//       toast.error('Please login to access checkout', {
//         duration: 1000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🔒',
//       });
//       setTimeout(() => {
//         router.push('/login');
//       }, 1500);
//       return;
//     }
//     setIsCheckingAuth(false);
//   }, [user, router]);

//   // Update email when user changes
//   useEffect(() => {
//     if (user?.email) {
//       setFormData(prev => ({ ...prev, email: user.email || '' }));
//     }
//   }, [user]);

//   // ✅ Load flavor selections from RTDB
//   useEffect(() => {
//     const loadFlavorSelections = async () => {
//       if (!user) return;
//       try {
//         const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//         const snapshot = await get(selectionsRef);
//         if (snapshot.exists()) {
//           setFlavorSelections(snapshot.val());
//         }
//       } catch (error) {
//         console.error('Error loading flavor selections:', error);
//       }
//     };
//     loadFlavorSelections();
//   }, [user]);

//   // ✅ Load product details
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       const details: { [key: string]: any } = {};
//       for (const item of cartItems) {
//         if (!details[item.id]) {
//           try {
//             const snapshot = await get(ref(rtdb, `products/${item.id}`));
//             if (snapshot.exists()) {
//               details[item.id] = { id: item.id, ...snapshot.val() };
//             }
//           } catch (error) {
//             console.error('Error fetching product:', error);
//           }
//         }
//       }
//       setProductDetails(details);
//     };
//     if (cartItems.length > 0 && user) {
//       fetchProductDetails();
//     }
//   }, [cartItems, user]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // ✅ Get total quantity including flavors
//   const getTotalFlavorQuantityForProduct = (productId: string) => {
//     const selection = flavorSelections[productId];
//     if (!selection || !selection.selectedFlavors) return 0;
//     return selection.selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//   };

//   // ✅ Get total wax quantity for a product (sum of all variant quantities)
//   const getTotalWaxQuantityForProduct = (productId: string) => {
//     const selection = waxSelections[productId];
//     if (!selection || selection.length === 0) return 0;
//     return selection.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   // ✅ Get total cart quantity with flavors (wax does NOT affect quantity)
//   const getTotalCartQuantity = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.hasFlavors) {
//         total += getTotalFlavorQuantityForProduct(item.id);
//       } else {
//         total += item.quantity;
//       }
//     }
//     return total;
//   };

//   // ✅ Get total price (wax does NOT affect price)
//   const getTotalCartPrice = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       const finalPrice = item.price - (item.discount || 0);
      
//       if (product?.hasFlavors) {
//         const qty = getTotalFlavorQuantityForProduct(item.id);
//         total += finalPrice * qty;
//       } else {
//         total += finalPrice * item.quantity;
//       }
//     }
//     return total;
//   };

//   const totalPrice = getTotalCartPrice();
//   const totalQuantity = getTotalCartQuantity();

//   // ✅ Calculate delivery charges based on min order
//   const getCalculatedDeliveryCharge = () => {
//     if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
//       return 0;
//     }
//     return deliveryCharge;
//   };

//   const calculatedDeliveryCharge = getCalculatedDeliveryCharge();
//   const grandTotal = totalPrice + calculatedDeliveryCharge;

//   // Fetch delivery charges and min order from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//           setDeliveryCharge(data.deliveryCharges);
//         }
//         if (data.minOrderForFreeDelivery !== undefined && data.minOrderForFreeDelivery !== null) {
//           setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Check stock when component loads
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
            
//             const productDetail = productDetails[item.id];
//             let totalQty = item.quantity;
            
//             if (productDetail?.hasFlavors) {
//               totalQty = getTotalFlavorQuantityForProduct(item.id);
//             }
            
//             if (totalQty > availableStock) {
//               errors[item.id] = `Only ${availableStock} items of "${item.name}" available (${totalQty} requested)`;
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && user && Object.keys(productDetails).length > 0) {
//       checkStock();
//     }
//   }, [cartItems, user, productDetails, flavorSelections]);

//   // ✅ Validate phone number
//   const validatePhoneNumber = (phone: string) => {
//     const digitsOnly = phone.replace(/\D/g, '');
    
//     if (!phone.startsWith('03')) {
//       setPhoneError('Must start with 03');
//       return false;
//     }
    
//     if (digitsOnly.length !== 11) {
//       setPhoneError(`Must be 11 digits (03 + 9 digits)`);
//       return false;
//     }
    
//     setPhoneError('');
//     return true;
//   };

//   // ✅ Handle phone input change
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
//     const digitsOnly = value.replace(/\D/g, '');
    
//     if (digitsOnly.length > 11) return;
    
//     if (digitsOnly.length === 0) {
//       setFormData(prev => ({ ...prev, phoneNumber: '03' }));
//       setPhoneError('');
//       return;
//     }
    
//     let formattedValue = digitsOnly;
//     if (formattedValue.length >= 2) {
//       if (!formattedValue.startsWith('03')) {
//         formattedValue = '03' + formattedValue.slice(2);
//       }
//     }
    
//     if (formattedValue.length > 2) {
//       if (formattedValue.length > 11) {
//         formattedValue = formattedValue.slice(0, 11);
//       }
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     } else {
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     }
    
//     validatePhoneNumber(formattedValue);
//   };

//   // ✅ Update wax variant quantity
//   const updateWaxVariant = (productId: string, variantName: string, newQuantity: number) => {
//     const product = productDetails[productId];
//     const maxAllow = product?.totalAllowWax || 3;
    
//     if (newQuantity < 0) newQuantity = 0;
//     if (newQuantity > maxAllow) newQuantity = maxAllow;
    
//     const currentSelections = waxSelections[productId] || [];
//     const existingIndex = currentSelections.findIndex(item => item.variant === variantName);
    
//     let newSelections = [...currentSelections];
    
//     // Calculate current total excluding this variant
//     const currentTotal = currentSelections.reduce((sum, item) => sum + item.quantity, 0);
//     const otherTotal = currentTotal - (existingIndex !== -1 ? currentSelections[existingIndex].quantity : 0);
    
//     // Check if adding this quantity exceeds max
//     if (otherTotal + newQuantity > maxAllow) {
//       toast.error(`Maximum ${maxAllow} wax items allowed for this deal!`, {
//         duration: 1000,
//         position: 'top-right',
//         icon: '⚠️'
//       });
//       return;
//     }
    
//     if (existingIndex !== -1) {
//       if (newQuantity === 0) {
//         newSelections.splice(existingIndex, 1);
//       } else {
//         newSelections[existingIndex] = { variant: variantName, quantity: newQuantity };
//       }
//     } else {
//       if (newQuantity > 0) {
//         newSelections.push({ variant: variantName, quantity: newQuantity });
//       }
//     }
    
//     if (newSelections.length === 0) {
//       const newState = { ...waxSelections };
//       delete newState[productId];
//       setWaxSelections(newState);
//     } else {
//       setWaxSelections(prev => ({
//         ...prev,
//         [productId]: newSelections
//       }));
//     }
//   };

//   // ✅ Remove a wax variant
//   const removeWaxVariant = (productId: string, variantName: string) => {
//     const currentSelections = waxSelections[productId] || [];
//     const newSelections = currentSelections.filter(item => item.variant !== variantName);
    
//     if (newSelections.length === 0) {
//       const newState = { ...waxSelections };
//       delete newState[productId];
//       setWaxSelections(newState);
//     } else {
//       setWaxSelections(prev => ({
//         ...prev,
//         [productId]: newSelections
//       }));
//     }
//   };

//   // ✅ Get selected wax variants for a product
//   const getSelectedWaxVariants = (productId: string) => {
//     return waxSelections[productId] || [];
//   };

//   // ✅ Get max wax allowed for a product
//   const getMaxWaxForProduct = (productId: string) => {
//     const product = productDetails[productId];
//     if (!product) return 3;
//     return product.totalAllowWax || 3;
//   };

//   // ✅ Get total wax quantity for a product
//   const getTotalWaxQuantity = (productId: string) => {
//     return getTotalWaxQuantityForProduct(productId);
//   };

//   // ✅ Check if wax selections are complete (total must equal maxAllow)
//   const isWaxSelectionComplete = (productId: string) => {
//     const maxAllow = getMaxWaxForProduct(productId);
//     const totalSelected = getTotalWaxQuantity(productId);
//     return totalSelected === maxAllow;
//   };

//   // ✅ Check if any wax product has incomplete selections
//   const hasIncompleteWaxSelections = () => {
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
//         if (!isWaxSelectionComplete(item.id)) {
//           return true;
//         }
//       }
//     }
//     return false;
//   };

//   // If still checking auth, show loading
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

//   if (!user) {
//     return null;
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 1000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Show stock errors if any
//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 1000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link
//                 href="/cart"
//                 className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'phoneNumber') {
//       handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validatePhoneNumber(formData.phoneNumber)) {
//       setError('Please enter a valid phone number (03XXXXXXXXX)');
//       return;
//     }

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     // ✅ Check if all wax products have complete selections (must equal maxAllow)
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
//         const maxAllow = getMaxWaxForProduct(item.id);
//         const totalSelected = getTotalWaxQuantity(item.id);
//         if (totalSelected !== maxAllow) {
//           toast.error(`Please select exactly ${maxAllow} wax items for "${item.name}" (currently ${totalSelected} selected)`, { 
//             duration: 3000, 
//             position: 'top-right', 
//             icon: '⚠️' 
//           });
//           return;
//         }
//       }
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // ✅ FINAL STOCK CHECK
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
            
//             const productDetail = productDetails[item.id];
//             let totalQty = item.quantity;
//             if (productDetail?.hasFlavors) {
//               totalQty = getTotalFlavorQuantityForProduct(item.id);
//             }
            
//             if (totalQty > availableStock) {
//               setError(`"${item.name}" is out of stock. Only ${availableStock} available. (${totalQty} requested)`);
//               setLoading(false);
//               return;
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       // ✅ Build order items with flavor + wax details
//       const orderItems = cartItems.map(item => {
//         const productDetail = productDetails[item.id];
//         let finalItem: any = {
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         };

//         if (productDetail?.hasFlavors) {
//           const selection = flavorSelections[item.id];
//           const selectedFlavors = selection?.selectedFlavors || [];
//           const totalQty = selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//           finalItem = {
//             ...finalItem,
//             quantity: totalQty,
//             selectedFlavors: selectedFlavors,
//             isFlavorProduct: true
//           };
//         }
        
//         return finalItem;
//       });

//       // ✅ Build wax notes for admin
//       let waxNotes = '';
//       for (const item of cartItems) {
//         const product = productDetails[item.id];
//         if (product?.waxIncluded && product?.waxVariants) {
//           const selection = waxSelections[item.id] || [];
//           if (selection.length > 0) {
//             const details = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
//             waxNotes += `\n• ${item.name}: ${details}`;
//           }
//         }
//       }

//       const orderData = {
//         id: orderId,
//         userId: user?.uid || 'guest',
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes + (waxNotes ? `\n\n🕯️ Wax Selections:${waxNotes}` : ''),
//         items: orderItems,
//         subtotal: totalPrice,
//         totalQuantity: totalQuantity,
//         deliveryCharge: calculatedDeliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       // 🔥 UPDATE STOCK
//       for (const item of cartItems) {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
          
//           const productDetail = productDetails[item.id];
//           let quantityToDeduct = item.quantity;
//           if (productDetail?.hasFlavors) {
//             quantityToDeduct = getTotalFlavorQuantityForProduct(item.id);
//           }
          
//           const newStock = currentStock - quantityToDeduct;
          
//           console.log(`Updating stock for ${item.name}: ${currentStock} -> ${newStock}`);
          
//           await update(productRef, {
//             stock: Math.max(0, newStock)
//           });
//         }
//       }

//       setSuccess(true);
//       clearCart();

//       toast.success('Order placed successfully!', {
//         duration: 1000,
//         position: 'top-right',
//         style: {
//           background: '#10B981',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🎉',
//       });

//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//       toast.error('Failed to place order. Please try again.', {
//         duration: 1000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '❌',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 1000,
//           style: {
//             background: '#333',
//             color: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//           },
//         }}
//       />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         disabled
//                       />
//                       <div>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           placeholder="WhatsApp Number *"
//                           value={formData.phoneNumber}
//                           onChange={handleInputChange}
//                           required
//                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input ${
//                             phoneError ? 'border-red-500 focus:ring-red-500' : 'border-border'
//                           }`}
//                         />
//                         {phoneError && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle className="w-3 h-3" />
//                             {phoneError}
//                           </p>
//                         )}
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Format: 03XXXXXXXXX (03 + 9 digits)
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* ✅ Wax Variants Section - Must select EXACTLY maxAllow items */}
//                   {cartItems.some(item => {
//                     const product = productDetails[item.id];
//                     return product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0;
//                   }) && (
//                     <div>
//                       <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
//                         <span>🕯️</span> Select Your Wax Variants
//                       </h2>
//                       <p className="text-sm text-gray-500 mb-4">
//                         You must select exactly <span className="font-bold text-purple-600">
//                           {Math.max(...cartItems.map(item => {
//                             const product = productDetails[item.id];
//                             return product?.totalAllowWax || 3;
//                           }))}
//                         </span> wax items per product. You cannot checkout with less or more.
//                       </p>
//                       <div className="space-y-4">
//                         {cartItems.map((item) => {
//                           const product = productDetails[item.id];
//                           if (!product?.waxIncluded || !product?.waxVariants || product.waxVariants.length === 0) {
//                             return null;
//                           }

//                           const selectedVariants = getSelectedWaxVariants(item.id);
//                           const maxAllow = getMaxWaxForProduct(item.id);
//                           const totalSelected = getTotalWaxQuantity(item.id);
//                           const remaining = maxAllow - totalSelected;
//                           const isComplete = totalSelected === maxAllow;

//                           return (
//                             <div key={item.id} className={`p-4 rounded-lg border ${isComplete ? 'bg-green-50 border-green-300' : 'bg-purple-50 border-purple-200'}`}>
//                               <div className="flex justify-between items-center mb-3">
//                                 <p className="font-medium text-gray-800">{item.name}</p>
//                                 <div className={`text-xs font-semibold ${isComplete ? 'text-green-600' : 'text-purple-600'}`}>
//                                   {isComplete ? '✅ Complete' : '❌ Incomplete'}
//                                   <span className="ml-2">
//                                     {totalSelected} / {maxAllow}
//                                   </span>
//                                 </div>
//                               </div>

//                               {/* ✅ Selected Variants with Quantity Controls */}
//                               {selectedVariants.length > 0 && (
//                                 <div className="mb-3 space-y-2">
//                                   {selectedVariants.map((sel, idx) => (
//                                     <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-purple-200">
//                                       <span className="text-sm font-medium text-purple-700 flex-1">{sel.variant}</span>
//                                       <div className="flex items-center gap-2">
//                                         <button
//                                           type="button"
//                                           onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity - 1)}
//                                           className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                           disabled={sel.quantity <= 1}
//                                         >
//                                           <Minus size={14} />
//                                         </button>
//                                         <span className="w-8 text-center font-semibold text-sm">{sel.quantity}</span>
//                                         <button
//                                           type="button"
//                                           onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity + 1)}
//                                           className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                           disabled={remaining === 0}
//                                         >
//                                           <Plus size={14} />
//                                         </button>
//                                         <button
//                                           type="button"
//                                           onClick={() => removeWaxVariant(item.id, sel.variant)}
//                                           className="text-red-500 hover:text-red-700 p-1"
//                                         >
//                                           <X size={14} />
//                                         </button>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}

//                               {/* ✅ Add New Variant Dropdown */}
//                               {remaining > 0 && (
//                                 <div className="flex gap-3">
//                                   <select
//                                     onChange={(e) => {
//                                       const variant = e.target.value;
//                                       if (variant) {
//                                         updateWaxVariant(item.id, variant, 1);
//                                         e.target.value = '';
//                                       }
//                                     }}
//                                     className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
//                                     defaultValue=""
//                                   >
//                                     <option value="">+ Add wax variant...</option>
//                                     {product.waxVariants
//                                       .filter((v: string) => !selectedVariants.some(s => s.variant === v))
//                                       .map((v: string) => (
//                                         <option key={v} value={v}>{v}</option>
//                                       ))}
//                                   </select>
//                                 </div>
//                               )}

//                               {isComplete && (
//                                 <p className="text-sm text-green-600 mt-2">✅ All {maxAllow} slots filled - Ready to checkout!</p>
//                               )}

//                               {!isComplete && totalSelected > 0 && (
//                                 <p className="text-sm text-orange-600 mt-2">⚠️ Need {remaining} more wax selection{remaining > 1 ? 's' : ''}</p>
//                               )}

//                               {selectedVariants.length === 0 && (
//                                 <p className="text-sm text-red-500 mt-2">⚠️ No variants selected yet. Please select {maxAllow} wax items.</p>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading || hasIncompleteWaxSelections()}
//                     className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                       loading || hasIncompleteWaxSelections()
//                         ? 'bg-gray-400 cursor-not-allowed text-gray-200'
//                         : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
//                     }`}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : hasIncompleteWaxSelections() ? (
//                       'Complete Wax Selections First'
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                   {hasIncompleteWaxSelections() && (
//                     <p className="text-sm text-red-500 text-center -mt-2">
//                       Please select exactly the required number of wax items for all products
//                     </p>
//                   )}
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     const product = productDetails[item.id];
//                     let qty = item.quantity;
//                     let extraInfo = '';
                    
//                     if (product?.hasFlavors) {
//                       qty = getTotalFlavorQuantityForProduct(item.id);
//                       const selection = flavorSelections[item.id];
//                       if (selection?.selectedFlavors) {
//                         extraInfo = `Flavors: ${selection.selectedFlavors.map((f: any) => `${f.flavorName} (x${f.quantity})`).join(', ')}`;
//                       }
//                     }
                    
//                     // ✅ Wax info in summary
//                     if (product?.waxIncluded && product?.waxVariants) {
//                       const selection = waxSelections[item.id] || [];
//                       if (selection.length > 0) {
//                         const waxStr = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
//                         extraInfo = extraInfo ? `${extraInfo} | Wax: ${waxStr}` : `Wax: ${waxStr}`;
//                       }
//                     }
                    
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {qty} x {formatPrice(finalPrice)}
//                           </p>
//                           {extraInfo && (
//                             <p className="text-xs text-purple-600 mt-1">{extraInfo}</p>
//                           )}
//                         </div>
//                         <p className="font-semibold text-primary">
//                           {formatPrice(finalPrice * qty)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Total Items:</span>
//                     <span className="font-medium text-foreground">{totalQuantity} units</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">
//                       {formatPrice(calculatedDeliveryCharge)}
//                     </span>
//                   </div>
//                   {calculatedDeliveryCharge === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                     <div className="text-sm text-green-600 text-right -mt-1">
//                       🎉 Free delivery applied!
//                     </div>
//                   )}
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



//logged out scene

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2, Plus, Minus, X } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const { user, loginWithToken } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [phoneError, setPhoneError] = useState('');
//   const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: any }>({});
//   const [productDetails, setProductDetails] = useState<{ [key: string]: any }>({});
//   const [showAccountCreated, setShowAccountCreated] = useState(false);

//   // ✅ Wax selections
//   const [waxSelections, setWaxSelections] = useState<{ [key: string]: { variant: string; quantity: number }[] }>({});

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '03',
//     email: '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // ✅ Auto-signup when email is filled
//   useEffect(() => {
//     const autoSignup = async () => {
//       const email = formData.email.trim();
//       const name = formData.fullName.trim();
      
//       // ✅ Only trigger if valid email, name exists, not logged in, not already registering
//       if (email && email.includes('@') && name && !user && !isRegistering) {
//         try {
//           setIsRegistering(true);
          
//           const response = await fetch('/api/auth/auto-signup', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//               email, 
//               name, 
//               phone: formData.phoneNumber 
//             })
//           });
          
//           const data = await response.json();
          
//           if (data.success) {
//             // ✅ Auto-login with token
//             await loginWithToken(data.token);
//             setShowAccountCreated(true);
            
//             toast.success('Account created automatically! 🎉', {
//               duration: 1500,
//               position: 'top-right'
//             });
            
//             // ✅ Hide message after 3 seconds
//             setTimeout(() => setShowAccountCreated(false), 3000);
//           }
//         } catch (error) {
//           console.error('Auto signup error:', error);
//           // Silent fail - user can still checkout as guest
//         } finally {
//           setIsRegistering(false);
//         }
//       }
//     };

//     // ✅ Wait 1.5 seconds after user stops typing
//     const timeoutId = setTimeout(autoSignup, 1500);
//     return () => clearTimeout(timeoutId);
//   }, [formData.email, formData.fullName, formData.phoneNumber, user, loginWithToken]);

//   // ✅ Update email when user logs in (after auto-signup)
//   useEffect(() => {
//     if (user?.email) {
//       setFormData(prev => ({ ...prev, email: user.email || '' }));
//     }
//   }, [user]);

//   // ✅ Load flavor selections from RTDB
//   useEffect(() => {
//     const loadFlavorSelections = async () => {
//       if (!user) return;
//       try {
//         const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//         const snapshot = await get(selectionsRef);
//         if (snapshot.exists()) {
//           setFlavorSelections(snapshot.val());
//         }
//       } catch (error) {
//         console.error('Error loading flavor selections:', error);
//       }
//     };
//     loadFlavorSelections();
//   }, [user]);

//   // ✅ Load product details
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       const details: { [key: string]: any } = {};
//       for (const item of cartItems) {
//         if (!details[item.id]) {
//           try {
//             const snapshot = await get(ref(rtdb, `products/${item.id}`));
//             if (snapshot.exists()) {
//               details[item.id] = { id: item.id, ...snapshot.val() };
//             }
//           } catch (error) {
//             console.error('Error fetching product:', error);
//           }
//         }
//       }
//       setProductDetails(details);
//     };
//     if (cartItems.length > 0) {
//       fetchProductDetails();
//     }
//   }, [cartItems]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // ✅ Get total quantity including flavors
//   const getTotalFlavorQuantityForProduct = (productId: string) => {
//     const selection = flavorSelections[productId];
//     if (!selection || !selection.selectedFlavors) return 0;
//     return selection.selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//   };

//   // ✅ Get total wax quantity for a product
//   const getTotalWaxQuantityForProduct = (productId: string) => {
//     const selection = waxSelections[productId];
//     if (!selection || selection.length === 0) return 0;
//     return selection.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   // ✅ Get total cart quantity with flavors
//   const getTotalCartQuantity = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.hasFlavors) {
//         total += getTotalFlavorQuantityForProduct(item.id);
//       } else {
//         total += item.quantity;
//       }
//     }
//     return total;
//   };

//   // ✅ Get total price
//   const getTotalCartPrice = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       const finalPrice = item.price - (item.discount || 0);
      
//       if (product?.hasFlavors) {
//         const qty = getTotalFlavorQuantityForProduct(item.id);
//         total += finalPrice * qty;
//       } else {
//         total += finalPrice * item.quantity;
//       }
//     }
//     return total;
//   };

//   const totalPrice = getTotalCartPrice();
//   const totalQuantity = getTotalCartQuantity();

//   // ✅ Calculate delivery charges
//   const getCalculatedDeliveryCharge = () => {
//     if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
//       return 0;
//     }
//     return deliveryCharge;
//   };

//   const calculatedDeliveryCharge = getCalculatedDeliveryCharge();
//   const grandTotal = totalPrice + calculatedDeliveryCharge;

//   // Fetch delivery charges and min order from RTDB
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//           setDeliveryCharge(data.deliveryCharges);
//         }
//         if (data.minOrderForFreeDelivery !== undefined && data.minOrderForFreeDelivery !== null) {
//           setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Check stock when component loads
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
            
//             const productDetail = productDetails[item.id];
//             let totalQty = item.quantity;
            
//             if (productDetail?.hasFlavors) {
//               totalQty = getTotalFlavorQuantityForProduct(item.id);
//             }
            
//             if (totalQty > availableStock) {
//               errors[item.id] = `Only ${availableStock} items of "${item.name}" available (${totalQty} requested)`;
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && Object.keys(productDetails).length > 0) {
//       checkStock();
//     }
//   }, [cartItems, productDetails, flavorSelections]);

//   // ✅ Validate phone number
//   const validatePhoneNumber = (phone: string) => {
//     const digitsOnly = phone.replace(/\D/g, '');
    
//     if (!phone.startsWith('03')) {
//       setPhoneError('Must start with 03');
//       return false;
//     }
    
//     if (digitsOnly.length !== 11) {
//       setPhoneError(`Must be 11 digits (03 + 9 digits)`);
//       return false;
//     }
    
//     setPhoneError('');
//     return true;
//   };

//   // ✅ Handle phone input change
//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
//     const digitsOnly = value.replace(/\D/g, '');
    
//     if (digitsOnly.length > 11) return;
    
//     if (digitsOnly.length === 0) {
//       setFormData(prev => ({ ...prev, phoneNumber: '03' }));
//       setPhoneError('');
//       return;
//     }
    
//     let formattedValue = digitsOnly;
//     if (formattedValue.length >= 2) {
//       if (!formattedValue.startsWith('03')) {
//         formattedValue = '03' + formattedValue.slice(2);
//       }
//     }
    
//     if (formattedValue.length > 2) {
//       if (formattedValue.length > 11) {
//         formattedValue = formattedValue.slice(0, 11);
//       }
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     } else {
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     }
    
//     validatePhoneNumber(formattedValue);
//   };

//   // ✅ Update wax variant quantity
//   const updateWaxVariant = (productId: string, variantName: string, newQuantity: number) => {
//     const product = productDetails[productId];
//     const maxAllow = product?.totalAllowWax || 3;
    
//     if (newQuantity < 0) newQuantity = 0;
//     if (newQuantity > maxAllow) newQuantity = maxAllow;
    
//     const currentSelections = waxSelections[productId] || [];
//     const existingIndex = currentSelections.findIndex(item => item.variant === variantName);
    
//     let newSelections = [...currentSelections];
    
//     const currentTotal = currentSelections.reduce((sum, item) => sum + item.quantity, 0);
//     const otherTotal = currentTotal - (existingIndex !== -1 ? currentSelections[existingIndex].quantity : 0);
    
//     if (otherTotal + newQuantity > maxAllow) {
//       toast.error(`Maximum ${maxAllow} wax items allowed for this deal!`, {
//         duration: 1000,
//         position: 'top-right',
//         icon: '⚠️'
//       });
//       return;
//     }
    
//     if (existingIndex !== -1) {
//       if (newQuantity === 0) {
//         newSelections.splice(existingIndex, 1);
//       } else {
//         newSelections[existingIndex] = { variant: variantName, quantity: newQuantity };
//       }
//     } else {
//       if (newQuantity > 0) {
//         newSelections.push({ variant: variantName, quantity: newQuantity });
//       }
//     }
    
//     if (newSelections.length === 0) {
//       const newState = { ...waxSelections };
//       delete newState[productId];
//       setWaxSelections(newState);
//     } else {
//       setWaxSelections(prev => ({
//         ...prev,
//         [productId]: newSelections
//       }));
//     }
//   };

//   // ✅ Remove a wax variant
//   const removeWaxVariant = (productId: string, variantName: string) => {
//     const currentSelections = waxSelections[productId] || [];
//     const newSelections = currentSelections.filter(item => item.variant !== variantName);
    
//     if (newSelections.length === 0) {
//       const newState = { ...waxSelections };
//       delete newState[productId];
//       setWaxSelections(newState);
//     } else {
//       setWaxSelections(prev => ({
//         ...prev,
//         [productId]: newSelections
//       }));
//     }
//   };

//   // ✅ Get selected wax variants
//   const getSelectedWaxVariants = (productId: string) => {
//     return waxSelections[productId] || [];
//   };

//   // ✅ Get max wax allowed
//   const getMaxWaxForProduct = (productId: string) => {
//     const product = productDetails[productId];
//     if (!product) return 3;
//     return product.totalAllowWax || 3;
//   };

//   // ✅ Get total wax quantity
//   const getTotalWaxQuantity = (productId: string) => {
//     return getTotalWaxQuantityForProduct(productId);
//   };

//   // ✅ Check if wax selections are complete
//   const isWaxSelectionComplete = (productId: string) => {
//     const maxAllow = getMaxWaxForProduct(productId);
//     const totalSelected = getTotalWaxQuantity(productId);
//     return totalSelected === maxAllow;
//   };

//   // ✅ Check if any wax product has incomplete selections
//   const hasIncompleteWaxSelections = () => {
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
//         if (!isWaxSelectionComplete(item.id)) {
//           return true;
//         }
//       }
//     }
//     return false;
//   };

//   // ✅ If cart is empty
//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 1000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//               Your cart is empty
//             </h1>
//             <Link href="/products" className="text-primary hover:underline">
//               Continue shopping
//             </Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   // Show stock errors if any
//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 1000,
//             style: {
//               background: '#333',
//               color: '#fff',
//               padding: '16px',
//               borderRadius: '12px',
//             },
//           }}
//         />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link
//                 href="/cart"
//                 className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     if (name === 'phoneNumber') {
//       handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
//       return;
//     }
    
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validatePhoneNumber(formData.phoneNumber)) {
//       setError('Please enter a valid phone number (03XXXXXXXXX)');
//       return;
//     }

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     if (!formData.email || !formData.email.includes('@')) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     // ✅ Check if all wax products have complete selections
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
//         const maxAllow = getMaxWaxForProduct(item.id);
//         const totalSelected = getTotalWaxQuantity(item.id);
//         if (totalSelected !== maxAllow) {
//           toast.error(`Please select exactly ${maxAllow} wax items for "${item.name}" (currently ${totalSelected} selected)`, { 
//             duration: 3000, 
//             position: 'top-right', 
//             icon: '⚠️' 
//           });
//           return;
//         }
//       }
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // ✅ FINAL STOCK CHECK
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
            
//             const productDetail = productDetails[item.id];
//             let totalQty = item.quantity;
//             if (productDetail?.hasFlavors) {
//               totalQty = getTotalFlavorQuantityForProduct(item.id);
//             }
            
//             if (totalQty > availableStock) {
//               setError(`"${item.name}" is out of stock. Only ${availableStock} available. (${totalQty} requested)`);
//               setLoading(false);
//               return;
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       // ✅ Build order items with flavor + wax details
//       const orderItems = cartItems.map(item => {
//         const productDetail = productDetails[item.id];
//         let finalItem: any = {
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         };

//         if (productDetail?.hasFlavors) {
//           const selection = flavorSelections[item.id];
//           const selectedFlavors = selection?.selectedFlavors || [];
//           const totalQty = selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//           finalItem = {
//             ...finalItem,
//             quantity: totalQty,
//             selectedFlavors: selectedFlavors,
//             isFlavorProduct: true
//           };
//         }
        
//         return finalItem;
//       });

//       // ✅ Build wax notes for admin
//       let waxNotes = '';
//       for (const item of cartItems) {
//         const product = productDetails[item.id];
//         if (product?.waxIncluded && product?.waxVariants) {
//           const selection = waxSelections[item.id] || [];
//           if (selection.length > 0) {
//             const details = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
//             waxNotes += `\n• ${item.name}: ${details}`;
//           }
//         }
//       }

//       // ✅ Get userId - either from logged in user or use email as fallback
//       const userId = user?.uid || `guest_${formData.email.replace(/[.#$]/g, '_')}`;

//       const orderData = {
//         id: orderId,
//         userId: userId,
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes + (waxNotes ? `\n\n🕯️ Wax Selections:${waxNotes}` : ''),
//         items: orderItems,
//         subtotal: totalPrice,
//         totalQuantity: totalQuantity,
//         deliveryCharge: calculatedDeliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         isGuest: !user, // ✅ Flag to identify guest orders
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // ✅ Save order to Realtime Database
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);

//       // ✅ Also save under email for quick lookup (guest orders)
//       if (!user) {
//         const emailKey = formData.email.replace(/[.#$]/g, '_');
//         await set(ref(rtdb, `user_orders/${emailKey}/${orderId}`), true);
//       } else {
//         // ✅ Save under user ID for logged in users
//         await set(ref(rtdb, `user_orders/${user.uid}/${orderId}`), true);
//       }

//       // 🔥 UPDATE STOCK
//       for (const item of cartItems) {
//         const productRef = ref(rtdb, `products/${item.id}`);
//         const snapshot = await get(productRef);
//         if (snapshot.exists()) {
//           const product = snapshot.val();
//           const currentStock = product.stock || 0;
          
//           const productDetail = productDetails[item.id];
//           let quantityToDeduct = item.quantity;
//           if (productDetail?.hasFlavors) {
//             quantityToDeduct = getTotalFlavorQuantityForProduct(item.id);
//           }
          
//           const newStock = currentStock - quantityToDeduct;
          
//           await update(productRef, {
//             stock: Math.max(0, newStock)
//           });
//         }
//       }

//       setSuccess(true);
//       clearCart();

//       toast.success('Order placed successfully! 🎉', {
//         duration: 1000,
//         position: 'top-right',
//         style: {
//           background: '#10B981',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '🎉',
//       });

//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 2000);
//     } catch (err) {
//       console.log('[v0] Error placing order:', err);
//       setError('Failed to place order. Please try again.');
//       toast.error('Failed to place order. Please try again.', {
//         duration: 1000,
//         position: 'top-right',
//         style: {
//           background: '#EF4444',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '❌',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 1000,
//           style: {
//             background: '#333',
//             color: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//           },
//         }}
//       />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Checkout Form */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {/* ✅ Auto-signup status messages */}
//                 {isRegistering && (
//                   <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2">
//                     <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
//                     Setting up your account...
//                   </div>
//                 )}

//                 {showAccountCreated && (
//                   <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
//                     <CheckCircle className="w-4 h-4" />
//                     Account created! Your orders will be saved.
//                   </div>
//                 )}

//                 {user && (
//                   <div className="mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 flex items-center gap-2">
//                     <span>👤</span>
//                     {user.email}
//                     <span className="text-green-600 ml-auto">✓ Logged in</span>
//                   </div>
//                 )}

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div>
//                         <input
//                           type="email"
//                           name="email"
//                           placeholder="Email * (orders will be saved to this email)"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <p className="text-xs text-muted-foreground mt-1">
//                           📧 Your orders will be linked to this email. No password needed!
//                         </p>
//                       </div>
//                       <div>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           placeholder="WhatsApp Number *"
//                           value={formData.phoneNumber}
//                           onChange={handleInputChange}
//                           required
//                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input ${
//                             phoneError ? 'border-red-500 focus:ring-red-500' : 'border-border'
//                           }`}
//                         />
//                         {phoneError && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle className="w-3 h-3" />
//                             {phoneError}
//                           </p>
//                         )}
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Format: 03XXXXXXXXX (03 + 9 digits)
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Wax Variants Section */}
//                   {cartItems.some(item => {
//                     const product = productDetails[item.id];
//                     return product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0;
//                   }) && (
//                     <div>
//                       <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
//                         <span>🕯️</span> Select Your Wax Variants
//                       </h2>
//                       <p className="text-sm text-gray-500 mb-4">
//                         You must select exactly <span className="font-bold text-purple-600">
//                           {Math.max(...cartItems.map(item => {
//                             const product = productDetails[item.id];
//                             return product?.totalAllowWax || 3;
//                           }))}
//                         </span> wax items per product.
//                       </p>
//                       <div className="space-y-4">
//                         {cartItems.map((item) => {
//                           const product = productDetails[item.id];
//                           if (!product?.waxIncluded || !product?.waxVariants || product.waxVariants.length === 0) {
//                             return null;
//                           }

//                           const selectedVariants = getSelectedWaxVariants(item.id);
//                           const maxAllow = getMaxWaxForProduct(item.id);
//                           const totalSelected = getTotalWaxQuantity(item.id);
//                           const remaining = maxAllow - totalSelected;
//                           const isComplete = totalSelected === maxAllow;

//                           return (
//                             <div key={item.id} className={`p-4 rounded-lg border ${isComplete ? 'bg-green-50 border-green-300' : 'bg-purple-50 border-purple-200'}`}>
//                               <div className="flex justify-between items-center mb-3">
//                                 <p className="font-medium text-gray-800">{item.name}</p>
//                                 <div className={`text-xs font-semibold ${isComplete ? 'text-green-600' : 'text-purple-600'}`}>
//                                   {isComplete ? '✅ Complete' : '❌ Incomplete'}
//                                   <span className="ml-2">
//                                     {totalSelected} / {maxAllow}
//                                   </span>
//                                 </div>
//                               </div>

//                               {selectedVariants.length > 0 && (
//                                 <div className="mb-3 space-y-2">
//                                   {selectedVariants.map((sel, idx) => (
//                                     <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-purple-200">
//                                       <span className="text-sm font-medium text-purple-700 flex-1">{sel.variant}</span>
//                                       <div className="flex items-center gap-2">
//                                         <button
//                                           type="button"
//                                           onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity - 1)}
//                                           className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                           disabled={sel.quantity <= 1}
//                                         >
//                                           <Minus size={14} />
//                                         </button>
//                                         <span className="w-8 text-center font-semibold text-sm">{sel.quantity}</span>
//                                         <button
//                                           type="button"
//                                           onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity + 1)}
//                                           className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                           disabled={remaining === 0}
//                                         >
//                                           <Plus size={14} />
//                                         </button>
//                                         <button
//                                           type="button"
//                                           onClick={() => removeWaxVariant(item.id, sel.variant)}
//                                           className="text-red-500 hover:text-red-700 p-1"
//                                         >
//                                           <X size={14} />
//                                         </button>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}

//                               {remaining > 0 && (
//                                 <div className="flex gap-3">
//                                   <select
//                                     onChange={(e) => {
//                                       const variant = e.target.value;
//                                       if (variant) {
//                                         updateWaxVariant(item.id, variant, 1);
//                                         e.target.value = '';
//                                       }
//                                     }}
//                                     className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
//                                     defaultValue=""
//                                   >
//                                     <option value="">+ Add wax variant...</option>
//                                     {product.waxVariants
//                                       .filter((v: string) => !selectedVariants.some(s => s.variant === v))
//                                       .map((v: string) => (
//                                         <option key={v} value={v}>{v}</option>
//                                       ))}
//                                   </select>
//                                 </div>
//                               )}

//                               {isComplete && (
//                                 <p className="text-sm text-green-600 mt-2">✅ All {maxAllow} slots filled - Ready to checkout!</p>
//                               )}

//                               {!isComplete && totalSelected > 0 && (
//                                 <p className="text-sm text-orange-600 mt-2">⚠️ Need {remaining} more wax selection{remaining > 1 ? 's' : ''}</p>
//                               )}

//                               {selectedVariants.length === 0 && (
//                                 <p className="text-sm text-red-500 mt-2">⚠️ No variants selected yet. Please select {maxAllow} wax items.</p>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading || hasIncompleteWaxSelections()}
//                     className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                       loading || hasIncompleteWaxSelections()
//                         ? 'bg-gray-400 cursor-not-allowed text-gray-200'
//                         : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
//                     }`}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : hasIncompleteWaxSelections() ? (
//                       'Complete Wax Selections First'
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                   {hasIncompleteWaxSelections() && (
//                     <p className="text-sm text-red-500 text-center -mt-2">
//                       Please select exactly the required number of wax items for all products
//                     </p>
//                   )}
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>

//                 {/* Cart Items */}
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     const product = productDetails[item.id];
//                     let qty = item.quantity;
//                     let extraInfo = '';
                    
//                     if (product?.hasFlavors) {
//                       qty = getTotalFlavorQuantityForProduct(item.id);
//                       const selection = flavorSelections[item.id];
//                       if (selection?.selectedFlavors) {
//                         extraInfo = `Flavors: ${selection.selectedFlavors.map((f: any) => `${f.flavorName} (x${f.quantity})`).join(', ')}`;
//                       }
//                     }
                    
//                     if (product?.waxIncluded && product?.waxVariants) {
//                       const selection = waxSelections[item.id] || [];
//                       if (selection.length > 0) {
//                         const waxStr = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
//                         extraInfo = extraInfo ? `${extraInfo} | Wax: ${waxStr}` : `Wax: ${waxStr}`;
//                       }
//                     }
                    
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">
//                             {qty} x {formatPrice(finalPrice)}
//                           </p>
//                           {extraInfo && (
//                             <p className="text-xs text-purple-600 mt-1">{extraInfo}</p>
//                           )}
//                         </div>
//                         <p className="font-semibold text-primary">
//                           {formatPrice(finalPrice * qty)}
//                         </p>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Price Breakdown */}
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Total Items:</span>
//                     <span className="font-medium text-foreground">{totalQuantity} units</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">
//                       {formatPrice(calculatedDeliveryCharge)}
//                     </span>
//                   </div>
//                   {calculatedDeliveryCharge === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                     <div className="text-sm text-green-600 text-right -mt-1">
//                       🎉 Free delivery applied!
//                     </div>
//                   )}
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>

//                 {/* Payment Method */}
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Pay when your order arrives
//                   </p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



//logged out scene and without email localstorage used

// app/checkout/page.tsx - Auto-signup completely removed

// app/checkout/page.tsx - PURA REPLACE KARO

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { AlertCircle, CheckCircle, Loader2, Plus, Minus, X } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, set, onValue, get, update } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CheckoutPage() {
//   const { cartItems, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [phoneError, setPhoneError] = useState('');
//   const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: any }>({});
//   const [productDetails, setProductDetails] = useState<{ [key: string]: any }>({});
//   const [waxSelections, setWaxSelections] = useState<{ [key: string]: { variant: string; quantity: number }[] }>({});

//   const [formData, setFormData] = useState({
//     fullName: '',
//     phoneNumber: '03',
//     email: user?.email || '',
//     address: '',
//     city: '',
//     zipCode: '',
//     orderNotes: ''
//   });

//   // ✅ Save guest info to localStorage
//   const saveGuestInfo = (email: string, name: string, phone: string) => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('guestEmail', email);
//       localStorage.setItem('guestName', name);
//       localStorage.setItem('guestPhone', phone);
//     }
//   };

//   // ✅ Save email on change
//   useEffect(() => {
//     if (!user && formData.email && formData.email.includes('@')) {
//       saveGuestInfo(formData.email, formData.fullName, formData.phoneNumber);
//     }
//   }, [formData.email, formData.fullName, formData.phoneNumber, user]);

//   // ✅ Update email when user changes
//   useEffect(() => {
//     if (user?.email) {
//       setFormData(prev => ({ ...prev, email: user.email || '' }));
//     }
//   }, [user]);

//   // ✅ Load flavor selections from RTDB
//   useEffect(() => {
//     const loadFlavorSelections = async () => {
//       if (!user) return;
//       try {
//         const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//         const snapshot = await get(selectionsRef);
//         if (snapshot.exists()) {
//           setFlavorSelections(snapshot.val());
//         }
//       } catch (error) {
//         console.error('Error loading flavor selections:', error);
//       }
//     };
//     loadFlavorSelections();
//   }, [user]);

//   // ✅ Load product details
//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       const details: { [key: string]: any } = {};
//       for (const item of cartItems) {
//         if (!details[item.id]) {
//           try {
//             const snapshot = await get(ref(rtdb, `products/${item.id}`));
//             if (snapshot.exists()) {
//               details[item.id] = { id: item.id, ...snapshot.val() };
//             }
//           } catch (error) {
//             console.error('Error fetching product:', error);
//           }
//         }
//       }
//       setProductDetails(details);
//     };
//     if (cartItems.length > 0) {
//       fetchProductDetails();
//     }
//   }, [cartItems]);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const getTotalFlavorQuantityForProduct = (productId: string) => {
//     const selection = flavorSelections[productId];
//     if (!selection || !selection.selectedFlavors) return 0;
//     return selection.selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//   };

//   const getTotalWaxQuantityForProduct = (productId: string) => {
//     const selection = waxSelections[productId];
//     if (!selection || selection.length === 0) return 0;
//     return selection.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   const getTotalCartQuantity = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.hasFlavors) {
//         total += getTotalFlavorQuantityForProduct(item.id);
//       } else {
//         total += item.quantity;
//       }
//     }
//     return total;
//   };

//   const getTotalCartPrice = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       const finalPrice = item.price - (item.discount || 0);
      
//       if (product?.hasFlavors) {
//         const qty = getTotalFlavorQuantityForProduct(item.id);
//         total += finalPrice * qty;
//       } else {
//         total += finalPrice * item.quantity;
//       }
//     }
//     return total;
//   };

//   const totalPrice = getTotalCartPrice();
//   const totalQuantity = getTotalCartQuantity();

//   const getCalculatedDeliveryCharge = () => {
//     if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
//       return 0;
//     }
//     return deliveryCharge;
//   };

//   const calculatedDeliveryCharge = getCalculatedDeliveryCharge();
//   const grandTotal = totalPrice + calculatedDeliveryCharge;

//   // Fetch delivery charges
//   useEffect(() => {
//     const settingsRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(settingsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         if (data.deliveryCharges !== undefined) setDeliveryCharge(data.deliveryCharges);
//         if (data.minOrderForFreeDelivery !== undefined) setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   // Check stock
//   useEffect(() => {
//     const checkStock = async () => {
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             const productDetail = productDetails[item.id];
//             let totalQty = item.quantity;
//             if (productDetail?.hasFlavors) {
//               totalQty = getTotalFlavorQuantityForProduct(item.id);
//             }
//             if (totalQty > availableStock) {
//               errors[item.id] = `Only ${availableStock} items of "${item.name}" available (${totalQty} requested)`;
//             }
//           } else {
//             errors[item.id] = `Product "${item.name}" not found`;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }
//       setStockErrors(errors);
//     };
//     if (cartItems.length > 0 && Object.keys(productDetails).length > 0) {
//       checkStock();
//     }
//   }, [cartItems, productDetails, flavorSelections]);

//   const validatePhoneNumber = (phone: string) => {
//     const digitsOnly = phone.replace(/\D/g, '');
//     if (!phone.startsWith('03')) {
//       setPhoneError('Must start with 03');
//       return false;
//     }
//     if (digitsOnly.length !== 11) {
//       setPhoneError(`Must be 11 digits (03 + 9 digits)`);
//       return false;
//     }
//     setPhoneError('');
//     return true;
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
//     const digitsOnly = value.replace(/\D/g, '');
//     if (digitsOnly.length > 11) return;
//     if (digitsOnly.length === 0) {
//       setFormData(prev => ({ ...prev, phoneNumber: '03' }));
//       setPhoneError('');
//       return;
//     }
//     let formattedValue = digitsOnly;
//     if (formattedValue.length >= 2) {
//       if (!formattedValue.startsWith('03')) {
//         formattedValue = '03' + formattedValue.slice(2);
//       }
//     }
//     if (formattedValue.length > 2) {
//       if (formattedValue.length > 11) {
//         formattedValue = formattedValue.slice(0, 11);
//       }
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     } else {
//       setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
//     }
//     validatePhoneNumber(formattedValue);
//   };

//   const updateWaxVariant = (productId: string, variantName: string, newQuantity: number) => {
//     const product = productDetails[productId];
//     const maxAllow = product?.totalAllowWax || 3;
//     if (newQuantity < 0) newQuantity = 0;
//     if (newQuantity > maxAllow) newQuantity = maxAllow;
//     const currentSelections = waxSelections[productId] || [];
//     const existingIndex = currentSelections.findIndex(item => item.variant === variantName);
//     let newSelections = [...currentSelections];
//     const currentTotal = currentSelections.reduce((sum, item) => sum + item.quantity, 0);
//     const otherTotal = currentTotal - (existingIndex !== -1 ? currentSelections[existingIndex].quantity : 0);
//     if (otherTotal + newQuantity > maxAllow) {
//       toast.error(`Maximum ${maxAllow} wax items allowed for this deal!`, {
//         duration: 1000,
//         position: 'top-right',
//         icon: '⚠️'
//       });
//       return;
//     }
//     if (existingIndex !== -1) {
//       if (newQuantity === 0) {
//         newSelections.splice(existingIndex, 1);
//       } else {
//         newSelections[existingIndex] = { variant: variantName, quantity: newQuantity };
//       }
//     } else {
//       if (newQuantity > 0) {
//         newSelections.push({ variant: variantName, quantity: newQuantity });
//       }
//     }
//     if (newSelections.length === 0) {
//       const newState = { ...waxSelections };
//       delete newState[productId];
//       setWaxSelections(newState);
//     } else {
//       setWaxSelections(prev => ({
//         ...prev,
//         [productId]: newSelections
//       }));
//     }
//   };

//   const removeWaxVariant = (productId: string, variantName: string) => {
//     const currentSelections = waxSelections[productId] || [];
//     const newSelections = currentSelections.filter(item => item.variant !== variantName);
//     if (newSelections.length === 0) {
//       const newState = { ...waxSelections };
//       delete newState[productId];
//       setWaxSelections(newState);
//     } else {
//       setWaxSelections(prev => ({
//         ...prev,
//         [productId]: newSelections
//       }));
//     }
//   };

//   const getSelectedWaxVariants = (productId: string) => {
//     return waxSelections[productId] || [];
//   };

//   const getMaxWaxForProduct = (productId: string) => {
//     const product = productDetails[productId];
//     if (!product) return 3;
//     return product.totalAllowWax || 3;
//   };

//   const getTotalWaxQuantity = (productId: string) => {
//     return getTotalWaxQuantityForProduct(productId);
//   };

//   const isWaxSelectionComplete = (productId: string) => {
//     const maxAllow = getMaxWaxForProduct(productId);
//     const totalSelected = getTotalWaxQuantity(productId);
//     return totalSelected === maxAllow;
//   };

//   const hasIncompleteWaxSelections = () => {
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
//         if (!isWaxSelectionComplete(item.id)) {
//           return true;
//         }
//       }
//     }
//     return false;
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster position="top-right" />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Your cart is empty</h1>
//             <Link href="/products" className="text-primary hover:underline">Continue shopping</Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   if (Object.keys(stockErrors).length > 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster position="top-right" />
//         <section className="py-20 px-4">
//           <div className="max-w-2xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
//             >
//               <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
//               <div className="text-left mb-6">
//                 {Object.values(stockErrors).map((error, index) => (
//                   <p key={index} className="text-red-600 mb-2">• {error}</p>
//                 ))}
//               </div>
//               <Link href="/cart" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
//                 Return to Cart
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     if (name === 'phoneNumber') {
//       handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
//       return;
//     }
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validatePhoneNumber(formData.phoneNumber)) {
//       setError('Please enter a valid phone number (03XXXXXXXXX)');
//       return;
//     }

//     if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
//       setError('Please fill all required fields');
//       return;
//     }

//     if (!formData.email || !formData.email.includes('@')) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     // ✅ Wax validation
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
//         const maxAllow = getMaxWaxForProduct(item.id);
//         const totalSelected = getTotalWaxQuantity(item.id);
//         if (totalSelected !== maxAllow) {
//           toast.error(`Please select exactly ${maxAllow} wax items for "${item.name}" (currently ${totalSelected} selected)`, { 
//             duration: 3000, 
//             position: 'top-right', 
//             icon: '⚠️' 
//           });
//           return;
//         }
//       }
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // ✅ FINAL STOCK CHECK
//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             const productDetail = productDetails[item.id];
//             let totalQty = item.quantity;
//             if (productDetail?.hasFlavors) {
//               totalQty = getTotalFlavorQuantityForProduct(item.id);
//             }
//             if (totalQty > availableStock) {
//               setError(`"${item.name}" is out of stock. Only ${availableStock} available. (${totalQty} requested)`);
//               setLoading(false);
//               return;
//             }
//           } else {
//             setError(`Product "${item.name}" not found.`);
//             setLoading(false);
//             return;
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//           setError('Error checking stock. Please try again.');
//           setLoading(false);
//           return;
//         }
//       }

//       const orderId = Date.now().toString();
      
//       const orderItems = cartItems.map(item => {
//         const productDetail = productDetails[item.id];
//         let finalItem: any = {
//           ...item,
//           finalPrice: item.price - (item.discount || 0)
//         };
//         if (productDetail?.hasFlavors) {
//           const selection = flavorSelections[item.id];
//           const selectedFlavors = selection?.selectedFlavors || [];
//           const totalQty = selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
//           finalItem = {
//             ...finalItem,
//             quantity: totalQty,
//             selectedFlavors: selectedFlavors,
//             isFlavorProduct: true
//           };
//         }
//         return finalItem;
//       });

//       let waxNotes = '';
//       for (const item of cartItems) {
//         const product = productDetails[item.id];
//         if (product?.waxIncluded && product?.waxVariants) {
//           const selection = waxSelections[item.id] || [];
//           if (selection.length > 0) {
//             const details = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
//             waxNotes += `\n• ${item.name}: ${details}`;
//           }
//         }
//       }

//       const userId = user?.uid || `guest_${formData.email.replace(/[.#$]/g, '_')}`;

//       const orderData = {
//         id: orderId,
//         userId: userId,
//         customerName: formData.fullName,
//         email: formData.email,
//         phoneNumber: formData.phoneNumber,
//         address: formData.address,
//         city: formData.city,
//         zipCode: formData.zipCode,
//         orderNotes: formData.orderNotes + (waxNotes ? `\n\n🕯️ Wax Selections:${waxNotes}` : ''),
//         items: orderItems,
//         subtotal: totalPrice,
//         totalQuantity: totalQuantity,
//         deliveryCharge: calculatedDeliveryCharge,
//         total: grandTotal,
//         status: 'pending',
//         isGuest: !user,
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };

//       // ✅ STEP 1: Save order
//       const orderRef = ref(rtdb, `orders/${orderId}`);
//       await set(orderRef, orderData);
//       console.log('✅ Order saved');

//       // ✅ STEP 2: Save guest info
//       if (!user) {
//         saveGuestInfo(formData.email, formData.fullName, formData.phoneNumber);
//       }

//       // ✅ STEP 3: Save user_orders (non-critical)
//       try {
//         if (!user) {
//           const emailKey = formData.email.replace(/[.#$]/g, '_');
//           await set(ref(rtdb, `user_orders/${emailKey}/${orderId}`), true);
//         } else {
//           await set(ref(rtdb, `user_orders/${user.uid}/${orderId}`), true);
//         }
//       } catch (userOrderError) {
//         console.warn('⚠️ user_orders save failed:', userOrderError);
//       }

//       // ✅ STEP 4: Update stock (non-critical - silent fail)
//       try {
//         for (const item of cartItems) {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const currentStock = product.stock || 0;
//             const productDetail = productDetails[item.id];
//             let quantityToDeduct = item.quantity;
//             if (productDetail?.hasFlavors) {
//               quantityToDeduct = getTotalFlavorQuantityForProduct(item.id);
//             }
//             const newStock = currentStock - quantityToDeduct;
//             await update(productRef, { stock: Math.max(0, newStock) }).catch(() => {});
//           }
//         }
//       } catch (stockError) {
//         console.warn('⚠️ Stock update failed:', stockError);
//       }

//       // ✅ STEP 5: Success
//       setSuccess(true);
//       clearCart();

//       toast.success('Order placed successfully! 🎉', {
//         duration: 1000,
//         position: 'top-right',
//         icon: '🎉'
//       });

//       setTimeout(() => {
//         router.push(`/order-success?orderId=${orderId}`);
//       }, 1500);

//     } catch (err) {
//       console.error('❌ CRITICAL Error:', err);
      
//       if (err instanceof Error && err.message.includes('permission_denied')) {
//         setError('Unable to place order. Please try logging in.');
//       } else {
//         setError('Failed to place order. Please try again.');
//       }
      
//       toast.error('Failed to place order. Please try again.', {
//         duration: 2000,
//         position: 'top-right',
//         icon: '❌'
//       });
      
//       // ✅ AUTO-RELOAD ON ERROR
//       setTimeout(() => {
//         window.location.reload();
//       }, 2000);
      
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 1000,
//           style: {
//             background: '#333',
//             color: '#fff',
//             padding: '16px',
//             borderRadius: '12px',
//           },
//         }}
//       />

//       <section className="py-12 px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//                 <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

//                 {!user && (
//                   <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center gap-2">
//                     <span>🛒</span>
//                     You are checking out as a guest. 
//                     <Link href="/login?from=checkout" className="text-primary font-semibold hover:underline ml-1">Login</Link>
//                     <span className="text-yellow-600 ml-auto">to save your orders</span>
//                   </div>
//                 )}

//                 {user && (
//                   <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
//                     <span>👤</span>
//                     {user.email}
//                     <span className="text-green-600 ml-auto">✓ Logged in</span>
//                   </div>
//                 )}

//                 {error && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
//                   >
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <p className="text-red-700">{error}</p>
//                   </motion.div>
//                 )}

//                 {success && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
//                   >
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <p className="text-green-700">Order placed successfully! Redirecting...</p>
//                   </motion.div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Personal Information */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         name="fullName"
//                         placeholder="Full Name *"
//                         value={formData.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <input
//                         type="email"
//                         name="email"
//                         placeholder="Email * (orders will be saved to this email)"
//                         value={formData.email}
//                         onChange={handleInputChange}
//                         required
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           placeholder="WhatsApp Number *"
//                           value={formData.phoneNumber}
//                           onChange={handleInputChange}
//                           required
//                           className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input ${
//                             phoneError ? 'border-red-500 focus:ring-red-500' : 'border-border'
//                           }`}
//                         />
//                         {phoneError && (
//                           <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
//                             <AlertCircle className="w-3 h-3" />
//                             {phoneError}
//                           </p>
//                         )}
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Format: 03XXXXXXXXX (03 + 9 digits)
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Delivery Address */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
//                     <div className="space-y-4">
//                       <textarea
//                         name="address"
//                         placeholder="Full Address *"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         required
//                         rows={3}
//                         className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                       />
//                       <div className="grid grid-cols-2 gap-4">
//                         <input
//                           type="text"
//                           name="city"
//                           placeholder="City *"
//                           value={formData.city}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                         <input
//                           type="text"
//                           name="zipCode"
//                           placeholder="Zip Code *"
//                           value={formData.zipCode}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Wax Variants Section */}
//                   {cartItems.some(item => {
//                     const product = productDetails[item.id];
//                     return product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0;
//                   }) && (
//                     <div>
//                       <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
//                         <span>🕯️</span> Select Your Wax Variants
//                       </h2>
//                       <p className="text-sm text-gray-500 mb-4">
//                         You must select exactly <span className="font-bold text-purple-600">
//                           {Math.max(...cartItems.map(item => {
//                             const product = productDetails[item.id];
//                             return product?.totalAllowWax || 3;
//                           }))}
//                         </span> wax items per product.
//                       </p>
//                       <div className="space-y-4">
//                         {cartItems.map((item) => {
//                           const product = productDetails[item.id];
//                           if (!product?.waxIncluded || !product?.waxVariants || product.waxVariants.length === 0) {
//                             return null;
//                           }

//                           const selectedVariants = getSelectedWaxVariants(item.id);
//                           const maxAllow = getMaxWaxForProduct(item.id);
//                           const totalSelected = getTotalWaxQuantity(item.id);
//                           const remaining = maxAllow - totalSelected;
//                           const isComplete = totalSelected === maxAllow;

//                           return (
//                             <div key={item.id} className={`p-4 rounded-lg border ${isComplete ? 'bg-green-50 border-green-300' : 'bg-purple-50 border-purple-200'}`}>
//                               <div className="flex justify-between items-center mb-3">
//                                 <p className="font-medium text-gray-800">{item.name}</p>
//                                 <div className={`text-xs font-semibold ${isComplete ? 'text-green-600' : 'text-purple-600'}`}>
//                                   {isComplete ? '✅ Complete' : '❌ Incomplete'}
//                                   <span className="ml-2">
//                                     {totalSelected} / {maxAllow}
//                                   </span>
//                                 </div>
//                               </div>

//                               {selectedVariants.length > 0 && (
//                                 <div className="mb-3 space-y-2">
//                                   {selectedVariants.map((sel, idx) => (
//                                     <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-purple-200">
//                                       <span className="text-sm font-medium text-purple-700 flex-1">{sel.variant}</span>
//                                       <div className="flex items-center gap-2">
//                                         <button
//                                           type="button"
//                                           onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity - 1)}
//                                           className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                           disabled={sel.quantity <= 1}
//                                         >
//                                           <Minus size={14} />
//                                         </button>
//                                         <span className="w-8 text-center font-semibold text-sm">{sel.quantity}</span>
//                                         <button
//                                           type="button"
//                                           onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity + 1)}
//                                           className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                           disabled={remaining === 0}
//                                         >
//                                           <Plus size={14} />
//                                         </button>
//                                         <button
//                                           type="button"
//                                           onClick={() => removeWaxVariant(item.id, sel.variant)}
//                                           className="text-red-500 hover:text-red-700 p-1"
//                                         >
//                                           <X size={14} />
//                                         </button>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               )}

//                               {remaining > 0 && (
//                                 <div className="flex gap-3">
//                                   <select
//                                     onChange={(e) => {
//                                       const variant = e.target.value;
//                                       if (variant) {
//                                         updateWaxVariant(item.id, variant, 1);
//                                         e.target.value = '';
//                                       }
//                                     }}
//                                     className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
//                                     defaultValue=""
//                                   >
//                                     <option value="">+ Add wax variant...</option>
//                                     {product.waxVariants
//                                       .filter((v: string) => !selectedVariants.some(s => s.variant === v))
//                                       .map((v: string) => (
//                                         <option key={v} value={v}>{v}</option>
//                                       ))}
//                                   </select>
//                                 </div>
//                               )}

//                               {isComplete && (
//                                 <p className="text-sm text-green-600 mt-2">✅ All {maxAllow} slots filled - Ready to checkout!</p>
//                               )}

//                               {!isComplete && totalSelected > 0 && (
//                                 <p className="text-sm text-orange-600 mt-2">⚠️ Need {remaining} more wax selection{remaining > 1 ? 's' : ''}</p>
//                               )}

//                               {selectedVariants.length === 0 && (
//                                 <p className="text-sm text-red-500 mt-2">⚠️ No variants selected yet. Please select {maxAllow} wax items.</p>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   {/* Order Notes */}
//                   <div>
//                     <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
//                     <textarea
//                       name="orderNotes"
//                       placeholder="Any special instructions..."
//                       value={formData.orderNotes}
//                       onChange={handleInputChange}
//                       rows={2}
//                       className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading || hasIncompleteWaxSelections()}
//                     className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
//                       loading || hasIncompleteWaxSelections()
//                         ? 'bg-gray-400 cursor-not-allowed text-gray-200'
//                         : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
//                     }`}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         Processing...
//                       </>
//                     ) : hasIncompleteWaxSelections() ? (
//                       'Complete Wax Selections First'
//                     ) : (
//                       `Place Order • ${formatPrice(grandTotal)}`
//                     )}
//                   </button>
//                   {hasIncompleteWaxSelections() && (
//                     <p className="text-sm text-red-500 text-center -mt-2">
//                       Please select exactly the required number of wax items for all products
//                     </p>
//                   )}
//                 </form>
//               </div>
//             </motion.div>

//             {/* Order Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
//                 <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>
//                 <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
//                   {cartItems.map((item) => {
//                     const finalPrice = item.price - (item.discount || 0);
//                     const product = productDetails[item.id];
//                     let qty = item.quantity;
//                     let extraInfo = '';
//                     if (product?.hasFlavors) {
//                       qty = getTotalFlavorQuantityForProduct(item.id);
//                       const selection = flavorSelections[item.id];
//                       if (selection?.selectedFlavors) {
//                         extraInfo = `Flavors: ${selection.selectedFlavors.map((f: any) => `${f.flavorName} (x${f.quantity})`).join(', ')}`;
//                       }
//                     }
//                     if (product?.waxIncluded && product?.waxVariants) {
//                       const selection = waxSelections[item.id] || [];
//                       if (selection.length > 0) {
//                         const waxStr = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
//                         extraInfo = extraInfo ? `${extraInfo} | Wax: ${waxStr}` : `Wax: ${waxStr}`;
//                       }
//                     }
//                     return (
//                       <div key={item.id} className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <p className="font-medium text-foreground">{item.name}</p>
//                           <p className="text-sm text-muted-foreground">{qty} x {formatPrice(finalPrice)}</p>
//                           {extraInfo && <p className="text-xs text-purple-600 mt-1">{extraInfo}</p>}
//                         </div>
//                         <p className="font-semibold text-primary">{formatPrice(finalPrice * qty)}</p>
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Total Items:</span>
//                     <span className="font-medium text-foreground">{totalQuantity} units</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Subtotal:</span>
//                     <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Delivery Charge:</span>
//                     <span className="font-medium text-foreground">{formatPrice(calculatedDeliveryCharge)}</span>
//                   </div>
//                   {calculatedDeliveryCharge === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                     <div className="text-sm text-green-600 text-right -mt-1">🎉 Free delivery applied!</div>
//                   )}
//                   <div className="border-t border-border pt-3 flex justify-between">
//                     <span className="font-semibold text-foreground">Total:</span>
//                     <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
//                   </div>
//                 </div>
//                 <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
//                   <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
//                   <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
//                   <p className="text-xs text-muted-foreground mt-2">Pay when your order arrives</p>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }

//with email local storage used

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2, Plus, Minus, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, set, onValue, get, update } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState(0);
  const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
  const [phoneError, setPhoneError] = useState('');
  const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: any }>({});
  const [productDetails, setProductDetails] = useState<{ [key: string]: any }>({});
  const [waxSelections, setWaxSelections] = useState<{ [key: string]: { variant: string; quantity: number }[] }>({});

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '03',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    orderNotes: ''
  });

  // ✅ Load saved guest info from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('guestEmail');
      const savedName = localStorage.getItem('guestName');
      const savedPhone = localStorage.getItem('guestPhone');
      
      // ✅ Only set if user is NOT logged in (guest)
      if (!user) {
        setFormData(prev => ({
          ...prev,
          email: savedEmail || '',
          fullName: savedName || '',
          phoneNumber: savedPhone || '03'
        }));
      }
    }
  }, [user]);

  // ✅ Update email when user changes (if logged in)
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  // ✅ Save guest info to localStorage
  const saveGuestInfo = (email: string, name: string, phone: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('guestEmail', email);
      localStorage.setItem('guestName', name);
      localStorage.setItem('guestPhone', phone);
    }
  };

  // ✅ Save email on change (for guest users) - with debounce
  useEffect(() => {
    if (!user && formData.email && formData.email.includes('@')) {
      const timer = setTimeout(() => {
        saveGuestInfo(formData.email, formData.fullName, formData.phoneNumber);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.email, formData.fullName, formData.phoneNumber, user]);

  // ✅ Load flavor selections from RTDB
  useEffect(() => {
    const loadFlavorSelections = async () => {
      if (!user) return;
      try {
        const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
        const snapshot = await get(selectionsRef);
        if (snapshot.exists()) {
          setFlavorSelections(snapshot.val());
        }
      } catch (error) {
        console.error('Error loading flavor selections:', error);
      }
    };
    loadFlavorSelections();
  }, [user]);

  // ✅ Load product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      const details: { [key: string]: any } = {};
      for (const item of cartItems) {
        if (!details[item.id]) {
          try {
            const snapshot = await get(ref(rtdb, `products/${item.id}`));
            if (snapshot.exists()) {
              details[item.id] = { id: item.id, ...snapshot.val() };
            }
          } catch (error) {
            console.error('Error fetching product:', error);
          }
        }
      }
      setProductDetails(details);
    };
    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTotalFlavorQuantityForProduct = (productId: string) => {
    const selection = flavorSelections[productId];
    if (!selection || !selection.selectedFlavors) return 0;
    return selection.selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
  };

  const getTotalWaxQuantityForProduct = (productId: string) => {
    const selection = waxSelections[productId];
    if (!selection || selection.length === 0) return 0;
    return selection.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalCartQuantity = () => {
    let total = 0;
    for (const item of cartItems) {
      const product = productDetails[item.id];
      if (product?.hasFlavors) {
        total += getTotalFlavorQuantityForProduct(item.id);
      } else {
        total += item.quantity;
      }
    }
    return total;
  };

  const getTotalCartPrice = () => {
    let total = 0;
    for (const item of cartItems) {
      const product = productDetails[item.id];
      const finalPrice = item.price - (item.discount || 0);
      
      if (product?.hasFlavors) {
        const qty = getTotalFlavorQuantityForProduct(item.id);
        total += finalPrice * qty;
      } else {
        total += finalPrice * item.quantity;
      }
    }
    return total;
  };

  const totalPrice = getTotalCartPrice();
  const totalQuantity = getTotalCartQuantity();

  const getCalculatedDeliveryCharge = () => {
    if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
      return 0;
    }
    return deliveryCharge;
  };

  const calculatedDeliveryCharge = getCalculatedDeliveryCharge();
  const grandTotal = totalPrice + calculatedDeliveryCharge;

  // Fetch delivery charges
  useEffect(() => {
    const settingsRef = ref(rtdb, 'admin_settings/banner');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.deliveryCharges !== undefined) setDeliveryCharge(data.deliveryCharges);
        if (data.minOrderForFreeDelivery !== undefined) setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check stock
  useEffect(() => {
    const checkStock = async () => {
      const errors: { [key: string]: string } = {};
      for (const item of cartItems) {
        try {
          const productRef = ref(rtdb, `products/${item.id}`);
          const snapshot = await get(productRef);
          if (snapshot.exists()) {
            const product = snapshot.val();
            const availableStock = product.stock || 0;
            const productDetail = productDetails[item.id];
            let totalQty = item.quantity;
            if (productDetail?.hasFlavors) {
              totalQty = getTotalFlavorQuantityForProduct(item.id);
            }
            if (totalQty > availableStock) {
              errors[item.id] = `Only ${availableStock} items of "${item.name}" available (${totalQty} requested)`;
            }
          } else {
            errors[item.id] = `Product "${item.name}" not found`;
          }
        } catch (error) {
          console.error('Error checking stock:', error);
        }
      }
      setStockErrors(errors);
    };
    if (cartItems.length > 0 && Object.keys(productDetails).length > 0) {
      checkStock();
    }
  }, [cartItems, productDetails, flavorSelections]);

  const validatePhoneNumber = (phone: string) => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (!phone.startsWith('03')) {
      setPhoneError('Must start with 03');
      return false;
    }
    if (digitsOnly.length !== 11) {
      setPhoneError(`Must be 11 digits (03 + 9 digits)`);
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length > 11) return;
    if (digitsOnly.length === 0) {
      setFormData(prev => ({ ...prev, phoneNumber: '03' }));
      setPhoneError('');
      return;
    }
    let formattedValue = digitsOnly;
    if (formattedValue.length >= 2) {
      if (!formattedValue.startsWith('03')) {
        formattedValue = '03' + formattedValue.slice(2);
      }
    }
    if (formattedValue.length > 2) {
      if (formattedValue.length > 11) {
        formattedValue = formattedValue.slice(0, 11);
      }
      setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, phoneNumber: formattedValue }));
    }
    validatePhoneNumber(formattedValue);
  };

  const updateWaxVariant = (productId: string, variantName: string, newQuantity: number) => {
    const product = productDetails[productId];
    const maxAllow = product?.totalAllowWax || 3;
    if (newQuantity < 0) newQuantity = 0;
    if (newQuantity > maxAllow) newQuantity = maxAllow;
    const currentSelections = waxSelections[productId] || [];
    const existingIndex = currentSelections.findIndex(item => item.variant === variantName);
    let newSelections = [...currentSelections];
    const currentTotal = currentSelections.reduce((sum, item) => sum + item.quantity, 0);
    const otherTotal = currentTotal - (existingIndex !== -1 ? currentSelections[existingIndex].quantity : 0);
    if (otherTotal + newQuantity > maxAllow) {
      toast.error(`Maximum ${maxAllow} wax items allowed for this deal!`, {
        duration: 1000,
        position: 'top-right',
        icon: '⚠️'
      });
      return;
    }
    if (existingIndex !== -1) {
      if (newQuantity === 0) {
        newSelections.splice(existingIndex, 1);
      } else {
        newSelections[existingIndex] = { variant: variantName, quantity: newQuantity };
      }
    } else {
      if (newQuantity > 0) {
        newSelections.push({ variant: variantName, quantity: newQuantity });
      }
    }
    if (newSelections.length === 0) {
      const newState = { ...waxSelections };
      delete newState[productId];
      setWaxSelections(newState);
    } else {
      setWaxSelections(prev => ({
        ...prev,
        [productId]: newSelections
      }));
    }
  };

  const removeWaxVariant = (productId: string, variantName: string) => {
    const currentSelections = waxSelections[productId] || [];
    const newSelections = currentSelections.filter(item => item.variant !== variantName);
    if (newSelections.length === 0) {
      const newState = { ...waxSelections };
      delete newState[productId];
      setWaxSelections(newState);
    } else {
      setWaxSelections(prev => ({
        ...prev,
        [productId]: newSelections
      }));
    }
  };

  const getSelectedWaxVariants = (productId: string) => {
    return waxSelections[productId] || [];
  };

  const getMaxWaxForProduct = (productId: string) => {
    const product = productDetails[productId];
    if (!product) return 3;
    return product.totalAllowWax || 3;
  };

  const getTotalWaxQuantity = (productId: string) => {
    return getTotalWaxQuantityForProduct(productId);
  };

  const isWaxSelectionComplete = (productId: string) => {
    const maxAllow = getMaxWaxForProduct(productId);
    const totalSelected = getTotalWaxQuantity(productId);
    return totalSelected === maxAllow;
  };

  const hasIncompleteWaxSelections = () => {
    for (const item of cartItems) {
      const product = productDetails[item.id];
      if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
        if (!isWaxSelectionComplete(item.id)) {
          return true;
        }
      }
    }
    return false;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Toaster position="top-right" />
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">Your cart is empty</h1>
            <Link href="/products" className="text-primary hover:underline">Continue shopping</Link>
          </div>
        </section>
      </div>
    );
  }

  if (Object.keys(stockErrors).length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Toaster position="top-right" />
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-8 text-center"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-4">Stock Issues</h2>
              <div className="text-left mb-6">
                {Object.values(stockErrors).map((error, index) => (
                  <p key={index} className="text-red-600 mb-2">• {error}</p>
                ))}
              </div>
              <Link href="/cart" className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Return to Cart
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      handlePhoneChange(e as React.ChangeEvent<HTMLInputElement>);
      return;
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Please enter a valid phone number (03XXXXXXXXX)');
      return;
    }

    if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
      setError('Please fill all required fields');
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // ✅ Wax validation
    for (const item of cartItems) {
      const product = productDetails[item.id];
      if (product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0) {
        const maxAllow = getMaxWaxForProduct(item.id);
        const totalSelected = getTotalWaxQuantity(item.id);
        if (totalSelected !== maxAllow) {
          toast.error(`Please select exactly ${maxAllow} wax items for "${item.name}" (currently ${totalSelected} selected)`, { 
            duration: 3000, 
            position: 'top-right', 
            icon: '⚠️' 
          });
          return;
        }
      }
    }

    setLoading(true);
    setError('');

    try {
      // ✅ FINAL STOCK CHECK
      for (const item of cartItems) {
        try {
          const productRef = ref(rtdb, `products/${item.id}`);
          const snapshot = await get(productRef);
          if (snapshot.exists()) {
            const product = snapshot.val();
            const availableStock = product.stock || 0;
            const productDetail = productDetails[item.id];
            let totalQty = item.quantity;
            if (productDetail?.hasFlavors) {
              totalQty = getTotalFlavorQuantityForProduct(item.id);
            }
            if (totalQty > availableStock) {
              setError(`"${item.name}" is out of stock. Only ${availableStock} available. (${totalQty} requested)`);
              setLoading(false);
              return;
            }
          } else {
            setError(`Product "${item.name}" not found.`);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error checking stock:', error);
          setError('Error checking stock. Please try again.');
          setLoading(false);
          return;
        }
      }

      const orderId = Date.now().toString();
      
      const orderItems = cartItems.map(item => {
        const productDetail = productDetails[item.id];
        let finalItem: any = {
          ...item,
          finalPrice: item.price - (item.discount || 0)
        };
        if (productDetail?.hasFlavors) {
          const selection = flavorSelections[item.id];
          const selectedFlavors = selection?.selectedFlavors || [];
          const totalQty = selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
          finalItem = {
            ...finalItem,
            quantity: totalQty,
            selectedFlavors: selectedFlavors,
            isFlavorProduct: true
          };
        }
        return finalItem;
      });

      let waxNotes = '';
      for (const item of cartItems) {
        const product = productDetails[item.id];
        if (product?.waxIncluded && product?.waxVariants) {
          const selection = waxSelections[item.id] || [];
          if (selection.length > 0) {
            const details = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
            waxNotes += `\n• ${item.name}: ${details}`;
          }
        }
      }

      const userId = user?.uid || `guest_${formData.email.replace(/[.#$]/g, '_')}`;

      const orderData = {
        id: orderId,
        userId: userId,
        customerName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        orderNotes: formData.orderNotes + (waxNotes ? `\n\n🕯️ Wax Selections:${waxNotes}` : ''),
        items: orderItems,
        subtotal: totalPrice,
        totalQuantity: totalQuantity,
        deliveryCharge: calculatedDeliveryCharge,
        total: grandTotal,
        status: 'pending',
        isGuest: !user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // ✅ STEP 1: Save order
      const orderRef = ref(rtdb, `orders/${orderId}`);
      await set(orderRef, orderData);
      console.log('✅ Order saved');

      // ✅ STEP 2: Save guest info
      if (!user) {
        saveGuestInfo(formData.email, formData.fullName, formData.phoneNumber);
      }

      // ✅ STEP 3: Save user_orders (non-critical)
      try {
        if (!user) {
          const emailKey = formData.email.replace(/[.#$]/g, '_');
          await set(ref(rtdb, `user_orders/${emailKey}/${orderId}`), true);
        } else {
          await set(ref(rtdb, `user_orders/${user.uid}/${orderId}`), true);
        }
      } catch (userOrderError) {
        console.warn('⚠️ user_orders save failed:', userOrderError);
      }

      // ✅ STEP 4: Update stock (non-critical - silent fail)
      try {
        for (const item of cartItems) {
          const productRef = ref(rtdb, `products/${item.id}`);
          const snapshot = await get(productRef);
          if (snapshot.exists()) {
            const product = snapshot.val();
            const currentStock = product.stock || 0;
            const productDetail = productDetails[item.id];
            let quantityToDeduct = item.quantity;
            if (productDetail?.hasFlavors) {
              quantityToDeduct = getTotalFlavorQuantityForProduct(item.id);
            }
            const newStock = currentStock - quantityToDeduct;
            await update(productRef, { stock: Math.max(0, newStock) }).catch(() => {});
          }
        }
      } catch (stockError) {
        console.warn('⚠️ Stock update failed:', stockError);
      }

      // ✅ STEP 5: Success
      setSuccess(true);
      clearCart();

      toast.success('Order placed successfully! 🎉', {
        duration: 1000,
        position: 'top-right',
        icon: '🎉'
      });

      setTimeout(() => {
        router.push(`/order-success?orderId=${orderId}`);
      }, 1500);

    } catch (err) {
      console.error('❌ CRITICAL Error:', err);
      
      if (err instanceof Error && err.message.includes('permission_denied')) {
        setError('Unable to place order. Please try logging in.');
      } else {
        setError('Failed to place order. Please try again.');
      }
      
      toast.error('Failed to place order. Please try again.', {
        duration: 2000,
        position: 'top-right',
        icon: '❌'
      });
      
      // ✅ AUTO-RELOAD ON ERROR
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: {
            background: '#333',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
          },
        }}
      />

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
                <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

                {/* {!user && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center gap-2">
                    <span>🛒</span>
                    You are checking out as a guest. 
                    <Link href="/login?from=checkout" className="text-primary font-semibold hover:underline ml-1">Login</Link>
                    <span className="text-yellow-600 ml-auto">to save your orders</span>
                  </div>
                )} */}

                {user && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                    <span>👤</span>
                    {user.email}
                    <span className="text-green-600 ml-auto">✓ Logged in</span>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <p className="text-green-700">Order placed successfully! Redirecting...</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Personal Information</h2>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name *"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email * (orders will be saved to this email)"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                      />
                      <div>
                        <input
                          type="tel"
                          name="phoneNumber"
                          placeholder="WhatsApp Number *"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input ${
                            phoneError ? 'border-red-500 focus:ring-red-500' : 'border-border'
                          }`}
                        />
                        {phoneError && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {phoneError}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Format: 03XXXXXXXXX (03 + 9 digits)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Delivery Address</h2>
                    <div className="space-y-4">
                      <textarea
                        name="address"
                        placeholder="Full Address *"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City *"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                        />
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="Zip Code *"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wax Variants Section */}
                  {cartItems.some(item => {
                    const product = productDetails[item.id];
                    return product?.waxIncluded && product?.waxVariants && product.waxVariants.length > 0;
                  }) && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
                        <span>🕯️</span> Select Your Wax Variants
                      </h2>
                      <p className="text-sm text-gray-500 mb-4">
                        You must select exactly <span className="font-bold text-purple-600">
                          {Math.max(...cartItems.map(item => {
                            const product = productDetails[item.id];
                            return product?.totalAllowWax || 3;
                          }))}
                        </span> wax items per product.
                      </p>
                      <div className="space-y-4">
                        {cartItems.map((item) => {
                          const product = productDetails[item.id];
                          if (!product?.waxIncluded || !product?.waxVariants || product.waxVariants.length === 0) {
                            return null;
                          }

                          const selectedVariants = getSelectedWaxVariants(item.id);
                          const maxAllow = getMaxWaxForProduct(item.id);
                          const totalSelected = getTotalWaxQuantity(item.id);
                          const remaining = maxAllow - totalSelected;
                          const isComplete = totalSelected === maxAllow;

                          return (
                            <div key={item.id} className={`p-4 rounded-lg border ${isComplete ? 'bg-green-50 border-green-300' : 'bg-purple-50 border-purple-200'}`}>
                              <div className="flex justify-between items-center mb-3">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <div className={`text-xs font-semibold ${isComplete ? 'text-green-600' : 'text-purple-600'}`}>
                                  {isComplete ? '✅ Complete' : '❌ Incomplete'}
                                  <span className="ml-2">
                                    {totalSelected} / {maxAllow}
                                  </span>
                                </div>
                              </div>

                              {selectedVariants.length > 0 && (
                                <div className="mb-3 space-y-2">
                                  {selectedVariants.map((sel, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-purple-200">
                                      <span className="text-sm font-medium text-purple-700 flex-1">{sel.variant}</span>
                                      <div className="flex items-center gap-2">
                                        <button
                                          type="button"
                                          onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity - 1)}
                                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                                          disabled={sel.quantity <= 1}
                                        >
                                          <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-semibold text-sm">{sel.quantity}</span>
                                        <button
                                          type="button"
                                          onClick={() => updateWaxVariant(item.id, sel.variant, sel.quantity + 1)}
                                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                                          disabled={remaining === 0}
                                        >
                                          <Plus size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => removeWaxVariant(item.id, sel.variant)}
                                          className="text-red-500 hover:text-red-700 p-1"
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {remaining > 0 && (
                                <div className="flex gap-3">
                                  <select
                                    onChange={(e) => {
                                      const variant = e.target.value;
                                      if (variant) {
                                        updateWaxVariant(item.id, variant, 1);
                                        e.target.value = '';
                                      }
                                    }}
                                    className="flex-1 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-sm"
                                    defaultValue=""
                                  >
                                    <option value="">+ Add wax variant...</option>
                                    {product.waxVariants
                                      .filter((v: string) => !selectedVariants.some(s => s.variant === v))
                                      .map((v: string) => (
                                        <option key={v} value={v}>{v}</option>
                                      ))}
                                  </select>
                                </div>
                              )}

                              {isComplete && (
                                <p className="text-sm text-green-600 mt-2">✅ All {maxAllow} slots filled - Ready to checkout!</p>
                              )}

                              {!isComplete && totalSelected > 0 && (
                                <p className="text-sm text-orange-600 mt-2">⚠️ Need {remaining} more wax selection{remaining > 1 ? 's' : ''}</p>
                              )}

                              {selectedVariants.length === 0 && (
                                <p className="text-sm text-red-500 mt-2">⚠️ No variants selected yet. Please select {maxAllow} wax items.</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Notes */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-foreground">Order Notes (Optional)</h2>
                    <textarea
                      name="orderNotes"
                      placeholder="Any special instructions..."
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || hasIncompleteWaxSelections()}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      loading || hasIncompleteWaxSelections()
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : hasIncompleteWaxSelections() ? (
                      'Complete Wax Selections First'
                    ) : (
                      `Place Order • ${formatPrice(grandTotal)}`
                    )}
                  </button>
                  {hasIncompleteWaxSelections() && (
                    <p className="text-sm text-red-500 text-center -mt-2">
                      Please select exactly the required number of wax items for all products
                    </p>
                  )}
                </form>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-20">
                <h2 className="text-xl font-semibold mb-6 text-foreground">Order Summary</h2>
                <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const finalPrice = item.price - (item.discount || 0);
                    const product = productDetails[item.id];
                    let qty = item.quantity;
                    let extraInfo = '';
                    if (product?.hasFlavors) {
                      qty = getTotalFlavorQuantityForProduct(item.id);
                      const selection = flavorSelections[item.id];
                      if (selection?.selectedFlavors) {
                        extraInfo = `Flavors: ${selection.selectedFlavors.map((f: any) => `${f.flavorName} (x${f.quantity})`).join(', ')}`;
                      }
                    }
                    if (product?.waxIncluded && product?.waxVariants) {
                      const selection = waxSelections[item.id] || [];
                      if (selection.length > 0) {
                        const waxStr = selection.map(s => `${s.variant} (x${s.quantity})`).join(', ');
                        extraInfo = extraInfo ? `${extraInfo} | Wax: ${waxStr}` : `Wax: ${waxStr}`;
                      }
                    }
                    return (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{qty} x {formatPrice(finalPrice)}</p>
                          {extraInfo && <p className="text-xs text-purple-600 mt-1">{extraInfo}</p>}
                        </div>
                        <p className="font-semibold text-primary">{formatPrice(finalPrice * qty)}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-medium text-foreground">{totalQuantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge:</span>
                    <span className="font-medium text-foreground">{formatPrice(calculatedDeliveryCharge)}</span>
                  </div>
                  {calculatedDeliveryCharge === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
                    <div className="text-sm text-green-600 text-right -mt-1">🎉 Free delivery applied!</div>
                  )}
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total:</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
                  <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground mt-2">Pay when your order arrives</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
}