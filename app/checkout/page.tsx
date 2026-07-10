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
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, set, onValue, get, update } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';

export default function CheckoutPage() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    orderNotes: ''
  });

  // Check authentication - redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to access checkout', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
        icon: '🔒',
      });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }
    setIsCheckingAuth(false);
  }, [user, router]);

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  // Format price in PKR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = getTotalPrice();
  const grandTotal = totalPrice + deliveryCharge;

  // Fetch delivery charges from RTDB
  useEffect(() => {
    const settingsRef = ref(rtdb, 'admin_settings/deliveryCharges');
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        setDeliveryCharge(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  // Check stock when component loads
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
            if (item.quantity > availableStock) {
              errors[item.id] = `Only ${availableStock} items of "${item.name}" available`;
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

    if (cartItems.length > 0 && user) {
      checkStock();
    }
  }, [cartItems, user]);

  // If still checking auth, show loading
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

  // If user is not logged in, don't render the page
  if (!user) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
            },
          }}
        />
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
              Your cart is empty
            </h1>
            <Link href="/products" className="text-primary hover:underline">
              Continue shopping
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Show stock errors if any
  if (Object.keys(stockErrors).length > 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
            },
          }}
        />
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
              <Link
                href="/cart"
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Return to Cart
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.zipCode) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 🔥 FINAL STOCK CHECK - Double check before placing order
      for (const item of cartItems) {
        try {
          const productRef = ref(rtdb, `products/${item.id}`);
          const snapshot = await get(productRef);
          if (snapshot.exists()) {
            const product = snapshot.val();
            const availableStock = product.stock || 0;
            if (item.quantity > availableStock) {
              setError(`"${item.name}" is out of stock. Only ${availableStock} available.`);
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
      
      const orderData = {
        id: orderId,
        userId: user?.uid || 'guest',
        customerName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        orderNotes: formData.orderNotes,
        items: cartItems.map(item => ({
          ...item,
          finalPrice: item.price - (item.discount || 0)
        })),
        subtotal: totalPrice,
        deliveryCharge: deliveryCharge,
        total: grandTotal,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save order to Realtime Database
      const orderRef = ref(rtdb, `orders/${orderId}`);
      await set(orderRef, orderData);

      // 🔥 UPDATE STOCK - Cut the quantity from stock
      for (const item of cartItems) {
        const productRef = ref(rtdb, `products/${item.id}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const product = snapshot.val();
          const currentStock = product.stock || 0;
          const newStock = currentStock - item.quantity;
          
          console.log(`Updating stock for ${item.name}: ${currentStock} -> ${newStock}`);
          
          // Update stock
          await update(productRef, {
            stock: Math.max(0, newStock) // Ensure stock doesn't go negative
          });
        }
      }

      setSuccess(true);
      clearCart();

      // Show success toast
      toast.success('Order placed successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
        icon: '🎉',
      });

      // Redirect to success page after 2 seconds
      setTimeout(() => {
        router.push(`/order-success?orderId=${orderId}`);
      }, 2000);
    } catch (err) {
      console.log('[v0] Error placing order:', err);
      setError('Failed to place order. Please try again.');
      toast.error('Failed to place order. Please try again.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Toaster Component */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
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
            {/* Checkout Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
                <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

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
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                        disabled
                      />
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="WhatsApp Number *"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                      />
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
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Place Order • ${formatPrice(grandTotal)}`
                    )}
                  </button>
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

                {/* Cart Items */}
                <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                  {cartItems.map((item) => {
                    const finalPrice = item.price - (item.discount || 0);
                    return (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {formatPrice(finalPrice)}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">
                          {formatPrice(finalPrice * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Charge:</span>
                    <span className="font-medium text-foreground">{formatPrice(deliveryCharge)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total:</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Payment Method:</p>
                  <p className="font-semibold text-foreground">💵 Cash on Delivery</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Pay when your order arrives
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8 px-4 mt-12 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2024 M&M Scents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}