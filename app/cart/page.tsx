// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';

// export default function CartPage() {
//   const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

//   const totalPrice = getTotalPrice();

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
        
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center"
//             >
//               <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//                 Your cart is empty
//               </h1>
//               <p className="text-muted-foreground mb-8">
//                 Start shopping and add some beautiful products to your cart
//               </p>
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Continue Shopping
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <Link
//               href="/products"
//               className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
//             >
//               <ArrowLeft size={18} />
//               Back to shopping
//             </Link>
//             <h1 className="text-4xl font-serif font-bold text-foreground">
//               Shopping Cart
//             </h1>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg overflow-hidden">
//                 {cartItems.map((item, index) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className="p-6 border-b border-border last:border-b-0 flex gap-4"
//                   >
//                     {/* Product Image */}
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-24 h-24 object-cover rounded-lg bg-secondary"
//                       onError={(e) => {
//                         e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E';
//                       }}
//                     />

//                     {/* Product Details */}
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-foreground mb-1">
//                         {item.name}
//                       </h3>
//                       <p className="text-xs text-muted-foreground mb-2 uppercase">
//                         {item.category}
//                       </p>

//                       {/* Price */}
//                       <div className="flex items-center gap-2 mb-3">
//                         <span className="font-bold text-primary">
//                           ₹{Math.round(item.price - (item.discount || 0))}
//                         </span>
//                         {item.discount && (
//                           <span className="text-sm text-muted-foreground line-through">
//                             ₹{item.price}
//                           </span>
//                         )}
//                       </div>

//                       {/* Quantity Controls */}
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                           className="p-1 bg-secondary hover:bg-muted rounded transition-colors"
//                         >
//                           <Minus size={16} className="text-foreground" />
//                         </button>
//                         <span className="w-8 text-center font-semibold">
//                           {item.quantity}
//                         </span>
//                         <button
//                           onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                           className="p-1 bg-secondary hover:bg-muted rounded transition-colors"
//                         >
//                           <Plus size={16} className="text-foreground" />
//                         </button>
//                       </div>
//                     </div>

//                     {/* Total Price & Remove */}
//                     <div className="text-right flex flex-col justify-between">
//                       <div>
//                         <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
//                         <p className="text-lg font-bold text-foreground">
//                           ₹{Math.round((item.price - (item.discount || 0)) * item.quantity)}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => removeFromCart(item.id)}
//                         className="text-red-500 hover:text-red-700 transition-colors"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             {/* Cart Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
//                 <h2 className="text-xl font-serif font-bold text-foreground mb-4">
//                   Order Summary
//                 </h2>

//                 {/* Subtotal */}
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-semibold text-foreground">
//                     ₹{Math.round(totalPrice)}
//                   </span>
//                 </div>

//                 {/* Delivery Charges */}
//                 <div className="flex justify-between mb-4 pb-4 border-b border-border">
//                   <span className="text-muted-foreground">Delivery Charges</span>
//                   <span className="font-semibold text-foreground">TBD</span>
//                 </div>

//                 {/* Total */}
//                 <div className="flex justify-between mb-6">
//                   <span className="text-lg font-bold text-foreground">Total</span>
//                   <span className="text-xl font-bold text-primary">
//                     ₹{Math.round(totalPrice)}
//                   </span>
//                 </div>

//                 {/* Checkout Button */}
//                 <Link
//                   href="/checkout"
//                   className="block w-full bg-primary text-white py-3 rounded-lg font-semibold text-center hover:opacity-90 transition-opacity mb-3"
//                 >
//                   Proceed to Checkout
//                 </Link>

//                 {/* Continue Shopping */}
//                 <Link
//                   href="/products"
//                   className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors"
//                 >
//                   Continue Shopping
//                 </Link>

//                 {/* Clear Cart */}
//                 <button
//                   onClick={() => {
//                     if (confirm('Are you sure you want to clear your cart?')) {
//                       clearCart();
//                     }
//                   }}
//                   className="w-full mt-3 text-red-500 hover:text-red-700 transition-colors text-sm font-semibold"
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 Luxe Beauty. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }






// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, get } from 'firebase/database';

// export default function CartPage() {
//   const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
//   const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
//   const [loadingDelivery, setLoadingDelivery] = useState(true);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [productStocks, setProductStocks] = useState<{ [key: string]: number }>({});

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount
//   const hasValidDiscount = (item: any) => {
//     return item.discount !== undefined && 
//            item.discount !== null && 
//            item.discount > 0 && 
//            item.discount < item.price;
//   };

//   // Get final price
//   const getFinalPrice = (item: any) => {
//     if (hasValidDiscount(item)) {
//       return item.price - item.discount;
//     }
//     return item.price;
//   };

//   // Fetch delivery charges from Firebase
//   useEffect(() => {
//     const fetchDeliveryCharges = async () => {
//       try {
//         const bannerRef = ref(rtdb, 'admin_settings/banner');
//         const snapshot = await get(bannerRef);
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//             setDeliveryCharges(data.deliveryCharges);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching delivery charges:', error);
//       } finally {
//         setLoadingDelivery(false);
//       }
//     };

//     fetchDeliveryCharges();
//   }, []);

//   // Fetch stock for all cart items - ONLY for checking availability, NOT cutting stock
//   useEffect(() => {
//     const fetchStocks = async () => {
//       const stocks: { [key: string]: number } = {};
//       const errors: { [key: string]: string } = {};

//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             stocks[item.id] = availableStock;
            
//             if (item.quantity > availableStock) {
//               errors[item.id] = `Only ${availableStock} items available`;
//             }
//           } else {
//             errors[item.id] = 'Product not found';
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }

//       setProductStocks(stocks);
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0) {
//       fetchStocks();
//     } else {
//       setProductStocks({});
//       setStockErrors({});
//     }
//   }, [cartItems]);

//   const totalPrice = getTotalPrice();
//   const totalWithDelivery = totalPrice + (deliveryCharges || 0);

//   // Handle quantity update with stock check
//   const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
//     if (newQuantity < 1) return;

//     const availableStock = productStocks[itemId] || 0;
    
//     if (newQuantity > availableStock) {
//       setStockErrors(prev => ({
//         ...prev,
//         [itemId]: `Only ${availableStock} items available`
//       }));
//       return;
//     } else {
//       setStockErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[itemId];
//         return newErrors;
//       });
//     }

//     // Just update cart quantity - NO stock change
//     updateQuantity(itemId, newQuantity);
//   };

//   // Handle remove from cart - NO stock restore (stock was never cut)
//   const handleRemoveFromCart = (itemId: string) => {
//     removeFromCart(itemId);
//   };

//   // Handle clear cart - NO stock restore (stock was never cut)
//   const handleClearCart = () => {
//     if (!confirm('Are you sure you want to clear your cart?')) return;
//     clearCart();
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
        
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center"
//             >
//               <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//                 Your cart is empty
//               </h1>
//               <p className="text-muted-foreground mb-8">
//                 Start shopping and add some beautiful products to your cart
//               </p>
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Continue Shopping
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <Link
//               href="/products"
//               className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
//             >
//               <ArrowLeft size={18} />
//               Back to shopping
//             </Link>
//             <h1 className="text-4xl font-serif font-bold text-foreground">
//               Shopping Cart
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg overflow-hidden">
//                 {cartItems.map((item, index) => {
//                   const finalPrice = getFinalPrice(item);
//                   const hasDiscount = hasValidDiscount(item);
//                   const stockError = stockErrors[item.id];
//                   const availableStock = productStocks[item.id] || 0;
                  
//                   return (
//                     <motion.div
//                       key={item.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="p-6 border-b border-border last:border-b-0 flex gap-4"
//                     >
//                       {/* Product Image */}
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-24 h-24 object-cover rounded-lg bg-secondary"
//                         onError={(e) => {
//                           e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E';
//                         }}
//                       />

//                       {/* Product Details */}
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-foreground mb-1">
//                           {item.name}
//                         </h3>
//                         <p className="text-xs text-muted-foreground mb-2 uppercase">
//                           {item.category}
//                         </p>

//                         {/* Price - PKR format */}
//                         <div className="flex items-center gap-2 mb-3">
//                           <span className="font-bold text-primary">
//                             {formatPrice(finalPrice)}
//                           </span>
//                           {hasDiscount && (
//                             <span className="text-sm text-muted-foreground line-through">
//                               {formatPrice(item.price)}
//                             </span>
//                           )}
//                         </div>

//                         {/* Quantity Controls with Stock Limit */}
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
//                             disabled={item.quantity <= 1}
//                             className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Minus size={16} className="text-foreground" />
//                           </button>
//                           <span className="w-8 text-center font-semibold">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
//                             disabled={item.quantity >= availableStock}
//                             className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Plus size={16} className="text-foreground" />
//                           </button>
//                           <span className="text-xs text-muted-foreground ml-2">
//                             (Max: {availableStock})
//                           </span>
//                         </div>

//                         {/* Stock Error Message */}
//                         {stockError && (
//                           <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
//                             <AlertCircle size={14} />
//                             <span>{stockError}</span>
//                           </div>
//                         )}
//                       </div>

//                       {/* Total Price & Remove */}
//                       <div className="text-right flex flex-col justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
//                           <p className="text-lg font-bold text-foreground">
//                             {formatPrice(finalPrice * item.quantity)}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveFromCart(item.id)}
//                           className="text-red-500 hover:text-red-700 transition-colors"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </motion.div>

//             {/* Cart Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
//                 <h2 className="text-xl font-serif font-bold text-foreground mb-4">
//                   Order Summary
//                 </h2>

//                 {/* Subtotal */}
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-semibold text-foreground">
//                     {formatPrice(totalPrice)}
//                   </span>
//                 </div>

//                 {/* Delivery Charges - From Firebase */}
//                 <div className="flex justify-between mb-4 pb-4 border-b border-border">
//                   <span className="text-muted-foreground">Delivery Charges</span>
//                   <span className="font-semibold text-foreground">
//                     {loadingDelivery ? '...' : formatPrice(deliveryCharges || 0)}
//                   </span>
//                 </div>

//                 {/* Total */}
//                 <div className="flex justify-between mb-6">
//                   <span className="text-lg font-bold text-foreground">Total</span>
//                   <span className="text-xl font-bold text-primary">
//                     {formatPrice(totalWithDelivery)}
//                   </span>
//                 </div>

//                 {/* Checkout Button */}
//                 <Link
//                   href="/checkout"
//                   className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
//                     Object.keys(stockErrors).length > 0
//                       ? 'bg-gray-400 text-white cursor-not-allowed'
//                       : 'bg-primary text-white hover:opacity-90'
//                   }`}
//                   onClick={(e) => {
//                     if (Object.keys(stockErrors).length > 0) {
//                       e.preventDefault();
//                       alert('Please fix stock issues before proceeding to checkout.');
//                     }
//                   }}
//                 >
//                   {Object.keys(stockErrors).length > 0 ? 'Fix Stock Issues' : 'Proceed to Checkout'}
//                 </Link>

//                 {/* Continue Shopping */}
//                 <Link
//                   href="/products"
//                   className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors mt-3"
//                 >
//                   Continue Shopping
//                 </Link>

//                 {/* Clear Cart */}
//                 <button
//                   onClick={handleClearCart}
//                   className="w-full mt-3 text-red-500 hover:text-red-700 transition-colors text-sm font-semibold"
//                 >
//                   Clear Cart
//                 </button>
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

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, get } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CartPage() {
//   const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
//   const [loadingDelivery, setLoadingDelivery] = useState(true);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [productStocks, setProductStocks] = useState<{ [key: string]: number }>({});

//   // ✅ Redirect with query param - NO TOAST HERE
//   useEffect(() => {
//     if (!user) {
//       // ✅ Sirf redirect karo, toast nahi
//       const timer = setTimeout(() => {
//         router.push('/login?from=cart');
//       }, 500);
      
//       return () => clearTimeout(timer);
//     }
//   }, [user, router]);

//   // Clear cart when user logs out
//   useEffect(() => {
//     if (!user && cartItems.length > 0) {
//       clearCart();
//     }
//   }, [user, cartItems.length, clearCart]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount
//   const hasValidDiscount = (item: any) => {
//     return item.discount !== undefined && 
//            item.discount !== null && 
//            item.discount > 0 && 
//            item.discount < item.price;
//   };

//   // Get final price
//   const getFinalPrice = (item: any) => {
//     if (hasValidDiscount(item)) {
//       return item.price - item.discount;
//     }
//     return item.price;
//   };

//   // Fetch delivery charges from Firebase
//   useEffect(() => {
//     const fetchDeliveryCharges = async () => {
//       try {
//         const bannerRef = ref(rtdb, 'admin_settings/banner');
//         const snapshot = await get(bannerRef);
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//             setDeliveryCharges(data.deliveryCharges);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching delivery charges:', error);
//       } finally {
//         setLoadingDelivery(false);
//       }
//     };

//     fetchDeliveryCharges();
//   }, []);

//   // Fetch stock for all cart items
//   useEffect(() => {
//     const fetchStocks = async () => {
//       const stocks: { [key: string]: number } = {};
//       const errors: { [key: string]: string } = {};

//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             stocks[item.id] = availableStock;
            
//             if (item.quantity > availableStock) {
//               errors[item.id] = `Only ${availableStock} items available`;
//             }
//           } else {
//             errors[item.id] = 'Product not found';
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }

//       setProductStocks(stocks);
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && user) {
//       fetchStocks();
//     } else {
//       setProductStocks({});
//       setStockErrors({});
//     }
//   }, [cartItems, user]);

//   const totalPrice = getTotalPrice();
//   const totalWithDelivery = totalPrice + (deliveryCharges || 0);

//   // Handle quantity update with stock check
//   const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
//     if (newQuantity < 1) return;

//     const availableStock = productStocks[itemId] || 0;
    
//     if (newQuantity > availableStock) {
//       setStockErrors(prev => ({
//         ...prev,
//         [itemId]: `Only ${availableStock} items available`
//       }));
//       return;
//     } else {
//       setStockErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[itemId];
//         return newErrors;
//       });
//     }

//     updateQuantity(itemId, newQuantity);
//   };

//   // Handle remove from cart
//   const handleRemoveFromCart = (itemId: string) => {
//     removeFromCart(itemId);
//     toast.success('Item removed from cart', {
//       duration: 2000,
//       position: 'top-right',
//       style: {
//         background: '#F59E0B',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🗑️',
//     });
//   };

//   // Handle clear cart
//   const handleClearCart = () => {
//     if (!confirm('Are you sure you want to clear your cart?')) return;
//     clearCart();
//     toast.success('Cart cleared successfully', {
//       duration: 2000,
//       position: 'top-right',
//       style: {
//         background: '#F59E0B',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🧹',
//     });
//   };

//   // Handle checkout with authentication check
//   const handleCheckout = () => {
//     if (!user) {
//       toast.error('Please login to proceed to checkout', {
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

//     if (Object.keys(stockErrors).length > 0) {
//       toast.error('Please fix stock issues before proceeding to checkout', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#F59E0B',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '⚠️',
//       });
//       return;
//     }

//     router.push('/checkout');
//   };

//   // ✅ If user is not logged in, show loading (redirect happening in useEffect)
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
//           </div>
//         </div>
//       </div>
//     );
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
//           <div className="max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center"
//             >
//               <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//                 Your cart is empty
//               </h1>
//               <p className="text-muted-foreground mb-8">
//                 Start shopping and add some beautiful products to your cart
//               </p>
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Continue Shopping
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

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
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <Link
//               href="/products"
//               className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
//             >
//               <ArrowLeft size={18} />
//               Back to shopping
//             </Link>
//             <h1 className="text-4xl font-serif font-bold text-foreground">
//               Shopping Cart
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg overflow-hidden">
//                 {cartItems.map((item, index) => {
//                   const finalPrice = getFinalPrice(item);
//                   const hasDiscount = hasValidDiscount(item);
//                   const stockError = stockErrors[item.id];
//                   const availableStock = productStocks[item.id] || 0;
                  
//                   return (
//                     <motion.div
//                       key={item.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="p-6 border-b border-border last:border-b-0 flex gap-4"
//                     >
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-24 h-24 object-cover rounded-lg bg-secondary"
//                         onError={(e) => {
//                           e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E';
//                         }}
//                       />
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-foreground mb-1">
//                           {item.name}
//                         </h3>
//                         <p className="text-xs text-muted-foreground mb-2 uppercase">
//                           {item.category}
//                         </p>
//                         <div className="flex items-center gap-2 mb-3">
//                           <span className="font-bold text-primary">
//                             {formatPrice(finalPrice)}
//                           </span>
//                           {hasDiscount && (
//                             <span className="text-sm text-muted-foreground line-through">
//                               {formatPrice(item.price)}
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
//                             disabled={item.quantity <= 1}
//                             className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Minus size={16} className="text-foreground" />
//                           </button>
//                           <span className="w-8 text-center font-semibold">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
//                             disabled={item.quantity >= availableStock}
//                             className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Plus size={16} className="text-foreground" />
//                           </button>
//                           <span className="text-xs text-muted-foreground ml-2">
//                             (Max: {availableStock})
//                           </span>
//                         </div>
//                         {stockError && (
//                           <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
//                             <AlertCircle size={14} />
//                             <span>{stockError}</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="text-right flex flex-col justify-between">
//                         <div>
//                           <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
//                           <p className="text-lg font-bold text-foreground">
//                             {formatPrice(finalPrice * item.quantity)}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveFromCart(item.id)}
//                           className="text-red-500 hover:text-red-700 transition-colors"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </motion.div>

//             {/* Cart Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
//                 <h2 className="text-xl font-serif font-bold text-foreground mb-4">
//                   Order Summary
//                 </h2>
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-semibold text-foreground">
//                     {formatPrice(totalPrice)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between mb-4 pb-4 border-b border-border">
//                   <span className="text-muted-foreground">Delivery Charges</span>
//                   <span className="font-semibold text-foreground">
//                     {loadingDelivery ? '...' : formatPrice(deliveryCharges || 0)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between mb-6">
//                   <span className="text-lg font-bold text-foreground">Total</span>
//                   <span className="text-xl font-bold text-primary">
//                     {formatPrice(totalWithDelivery)}
//                   </span>
//                 </div>
//                 <button
//                   onClick={handleCheckout}
//                   className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
//                     Object.keys(stockErrors).length > 0
//                       ? 'bg-gray-400 text-white cursor-not-allowed'
//                       : 'bg-primary text-white hover:opacity-90'
//                   }`}
//                   disabled={Object.keys(stockErrors).length > 0}
//                 >
//                   {Object.keys(stockErrors).length > 0 ? 'Fix Stock Issues' : 'Proceed to Checkout'}
//                 </button>
//                 <Link
//                   href="/products"
//                   className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors mt-3"
//                 >
//                   Continue Shopping
//                 </Link>
//                 <button
//                   onClick={handleClearCart}
//                   className="w-full mt-3 text-red-500 hover:text-red-700 transition-colors text-sm font-semibold"
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }




//responsive and upto eg price dc will 0

// 'use client';

// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, get } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// export default function CartPage() {
//   const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState<number>(0);
//   const [loadingDelivery, setLoadingDelivery] = useState(true);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [productStocks, setProductStocks] = useState<{ [key: string]: number }>({});

//   // ✅ Redirect with query param - NO TOAST HERE
//   useEffect(() => {
//     if (!user) {
//       // ✅ Sirf redirect karo, toast nahi
//       const timer = setTimeout(() => {
//         router.push('/login?from=cart');
//       }, 500);
      
//       return () => clearTimeout(timer);
//     }
//   }, [user, router]);

//   // Clear cart when user logs out
//   useEffect(() => {
//     if (!user && cartItems.length > 0) {
//       clearCart();
//     }
//   }, [user, cartItems.length, clearCart]);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount
//   const hasValidDiscount = (item: any) => {
//     return item.discount !== undefined && 
//            item.discount !== null && 
//            item.discount > 0 && 
//            item.discount < item.price;
//   };

//   // Get final price
//   const getFinalPrice = (item: any) => {
//     if (hasValidDiscount(item)) {
//       return item.price - item.discount;
//     }
//     return item.price;
//   };

//   // Fetch delivery charges and min order from Firebase
//   useEffect(() => {
//     const fetchDeliveryCharges = async () => {
//       try {
//         const bannerRef = ref(rtdb, 'admin_settings/banner');
//         const snapshot = await get(bannerRef);
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
//             setDeliveryCharges(data.deliveryCharges);
//           }
//           if (data.minOrderForFreeDelivery !== undefined && data.minOrderForFreeDelivery !== null) {
//             setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching delivery charges:', error);
//       } finally {
//         setLoadingDelivery(false);
//       }
//     };

//     fetchDeliveryCharges();
//   }, []);

//   // Fetch stock for all cart items
//   useEffect(() => {
//     const fetchStocks = async () => {
//       const stocks: { [key: string]: number } = {};
//       const errors: { [key: string]: string } = {};

//       for (const item of cartItems) {
//         try {
//           const productRef = ref(rtdb, `products/${item.id}`);
//           const snapshot = await get(productRef);
//           if (snapshot.exists()) {
//             const product = snapshot.val();
//             const availableStock = product.stock || 0;
//             stocks[item.id] = availableStock;
            
//             if (item.quantity > availableStock) {
//               errors[item.id] = `Only ${availableStock} items available`;
//             }
//           } else {
//             errors[item.id] = 'Product not found';
//           }
//         } catch (error) {
//           console.error('Error checking stock:', error);
//         }
//       }

//       setProductStocks(stocks);
//       setStockErrors(errors);
//     };

//     if (cartItems.length > 0 && user) {
//       fetchStocks();
//     } else {
//       setProductStocks({});
//       setStockErrors({});
//     }
//   }, [cartItems, user]);

//   const totalPrice = getTotalPrice();
  
//   // ✅ Calculate delivery charges based on min order
//   const getCalculatedDeliveryCharges = () => {
//     if (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) {
//       return 0; // Free delivery if order meets minimum
//     }
//     return deliveryCharges || 0;
//   };

//   const calculatedDeliveryCharges = getCalculatedDeliveryCharges();
//   const totalWithDelivery = totalPrice + calculatedDeliveryCharges;

//   // Handle quantity update with stock check
//   const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
//     if (newQuantity < 1) return;

//     const availableStock = productStocks[itemId] || 0;
    
//     if (newQuantity > availableStock) {
//       setStockErrors(prev => ({
//         ...prev,
//         [itemId]: `Only ${availableStock} items available`
//       }));
//       return;
//     } else {
//       setStockErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[itemId];
//         return newErrors;
//       });
//     }

//     updateQuantity(itemId, newQuantity);
//   };

//   // Handle remove from cart
//   const handleRemoveFromCart = (itemId: string) => {
//     removeFromCart(itemId);
//     toast.success('Item removed from cart', {
//       duration: 2000,
//       position: 'top-right',
//       style: {
//         background: '#F59E0B',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🗑️',
//     });
//   };

//   // Handle clear cart
//   const handleClearCart = () => {
//     if (!confirm('Are you sure you want to clear your cart?')) return;
//     clearCart();
//     toast.success('Cart cleared successfully', {
//       duration: 2000,
//       position: 'top-right',
//       style: {
//         background: '#F59E0B',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🧹',
//     });
//   };

//   // Handle checkout with authentication check
//   const handleCheckout = () => {
//     if (!user) {
//       toast.error('Please login to proceed to checkout', {
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

//     if (Object.keys(stockErrors).length > 0) {
//       toast.error('Please fix stock issues before proceeding to checkout', {
//         duration: 3000,
//         position: 'top-right',
//         style: {
//           background: '#F59E0B',
//           color: '#fff',
//           padding: '16px',
//           borderRadius: '12px',
//         },
//         icon: '⚠️',
//       });
//       return;
//     }

//     router.push('/checkout');
//   };

//   // ✅ If user is not logged in, show loading (redirect happening in useEffect)
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
//           </div>
//         </div>
//       </div>
//     );
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
//           <div className="max-w-4xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-center"
//             >
//               <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//               <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
//                 Your cart is empty
//               </h1>
//               <p className="text-muted-foreground mb-8">
//                 Start shopping and add some beautiful products to your cart
//               </p>
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Continue Shopping
//               </Link>
//             </motion.div>
//           </div>
//         </section>
//       </div>
//     );
//   }

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
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="mb-8"
//           >
//             <Link
//               href="/products"
//               className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
//             >
//               <ArrowLeft size={18} />
//               Back to shopping
//             </Link>
//             <h1 className="text-4xl font-serif font-bold text-foreground">
//               Shopping Cart
//             </h1>
//             <p className="text-muted-foreground mt-1">
//               {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="lg:col-span-2"
//             >
//               <div className="bg-card rounded-lg shadow-lg overflow-hidden">
//                 {cartItems.map((item, index) => {
//                   const finalPrice = getFinalPrice(item);
//                   const hasDiscount = hasValidDiscount(item);
//                   const stockError = stockErrors[item.id];
//                   const availableStock = productStocks[item.id] || 0;
                  
//                   return (
//                     <motion.div
//                       key={item.id}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className="p-6 border-b border-border last:border-b-0 flex flex-col sm:flex-row gap-4"
//                     >
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-24 h-24 object-cover rounded-lg bg-secondary flex-shrink-0 mx-auto sm:mx-0"
//                         onError={(e) => {
//                           e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E';
//                         }}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">
//                           {item.name}
//                         </h3>
//                         <p className="text-xs text-muted-foreground mb-2 uppercase truncate">
//                           {item.category}
//                         </p>
//                         <div className="flex items-center gap-2 mb-3 flex-wrap">
//                           <span className="font-bold text-primary text-sm sm:text-base">
//                             {formatPrice(finalPrice)}
//                           </span>
//                           {hasDiscount && (
//                             <span className="text-sm text-muted-foreground line-through">
//                               {formatPrice(item.price)}
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <button
//                             onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
//                             disabled={item.quantity <= 1}
//                             className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Minus size={16} className="text-foreground" />
//                           </button>
//                           <span className="w-8 text-center font-semibold">
//                             {item.quantity}
//                           </span>
//                           <button
//                             onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
//                             disabled={item.quantity >= availableStock}
//                             className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           >
//                             <Plus size={16} className="text-foreground" />
//                           </button>
//                           <span className="text-xs text-muted-foreground">
//                             (Max: {availableStock})
//                           </span>
//                         </div>
//                         {stockError && (
//                           <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
//                             <AlertCircle size={14} />
//                             <span>{stockError}</span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 sm:gap-0">
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
//                           <p className="text-base sm:text-lg font-bold text-foreground">
//                             {formatPrice(finalPrice * item.quantity)}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveFromCart(item.id)}
//                           className="text-red-500 hover:text-red-700 transition-colors"
//                         >
//                           <Trash2 size={20} />
//                         </button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </div>
//             </motion.div>

//             {/* Cart Summary */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="lg:col-span-1"
//             >
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
//                 <h2 className="text-xl font-serif font-bold text-foreground mb-4">
//                   Order Summary
//                 </h2>
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-semibold text-foreground">
//                     {formatPrice(totalPrice)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between mb-4 pb-4 border-b border-border">
//                   <span className="text-muted-foreground">Delivery Charges</span>
//                   <span className="font-semibold text-foreground">
//                     {loadingDelivery ? '...' : formatPrice(calculatedDeliveryCharges)}
//                   </span>
//                 </div>
//                 {calculatedDeliveryCharges === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                   <div className="text-sm text-green-600 text-right -mt-3 mb-3">
//                     🎉 Free delivery applied!
//                   </div>
//                 )}
//                 <div className="flex justify-between mb-6">
//                   <span className="text-lg font-bold text-foreground">Total</span>
//                   <span className="text-xl font-bold text-primary">
//                     {formatPrice(totalWithDelivery)}
//                   </span>
//                 </div>
//                 <button
//                   onClick={handleCheckout}
//                   className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
//                     Object.keys(stockErrors).length > 0
//                       ? 'bg-gray-400 text-white cursor-not-allowed'
//                       : 'bg-primary text-white hover:opacity-90'
//                   }`}
//                   disabled={Object.keys(stockErrors).length > 0}
//                 >
//                   {Object.keys(stockErrors).length > 0 ? 'Fix Stock Issues' : 'Proceed to Checkout'}
//                 </button>
//                 <Link
//                   href="/products"
//                   className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors mt-3"
//                 >
//                   Continue Shopping
//                 </Link>
//                 <button
//                   onClick={handleClearCart}
//                   className="w-full mt-3 text-red-500 hover:text-red-700 transition-colors text-sm font-semibold"
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       <footer className="bg-secondary py-8 px-4 mt-12">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



//ok without cart in local storage 
// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, AlertCircle, Package, X, Check } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, get, set } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// interface ExtendedCartItem {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   quantity: number;
//   flavorId?: string | null;
//   flavorName?: string | null;
//   flavorPrice?: number;
//   flavorDiscount?: number;
//   flavorStock?: number;
//   flavorImage?: string | null;
//   isFlavor?: boolean;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   additionalImages?: string[];
//   category: string;
//   description?: string;
//   stock?: number;
//   hasFlavors?: boolean;
//   flavors?: string[];
// }

// interface CartFlavorSelection {
//   productId: string;
//   selectedFlavors: { flavorName: string; quantity: number }[];
// }

// export default function CartPage() {
//   const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState<number>(0);
//   const [loadingDelivery, setLoadingDelivery] = useState(true);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [productStocks, setProductStocks] = useState<{ [key: string]: number }>({});
//   const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});
  
//   const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
//   const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: CartFlavorSelection }>({});
//   const [tempFlavorSelection, setTempFlavorSelection] = useState<CartFlavorSelection | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // ✅ Calculate total quantity from flavor selections
//   const getTotalFlavorQuantityForProduct = (productId: string) => {
//     const selection = flavorSelections[productId];
//     if (!selection || !selection.selectedFlavors) return 0;
//     return selection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
//   };

//   // ✅ Get total quantity from all cart items including flavors
//   const getTotalCartQuantity = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const extendedItem = item as ExtendedCartItem;
//       if (productDetails[item.id]?.hasFlavors) {
//         total += getTotalFlavorQuantityForProduct(item.id);
//       } else {
//         total += item.quantity;
//       }
//     }
//     return total;
//   };

//   // ✅ Get total price from all cart items including flavors
//   const getTotalCartPrice = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const extendedItem = item as ExtendedCartItem;
//       const price = getItemPrice(extendedItem);
//       const discount = getItemDiscount(extendedItem);
//       const finalPrice = price - discount;
      
//       if (productDetails[item.id]?.hasFlavors) {
//         const qty = getTotalFlavorQuantityForProduct(item.id);
//         total += finalPrice * qty;
//       } else {
//         total += finalPrice * item.quantity;
//       }
//     }
//     return total;
//   };

//   useEffect(() => {
//     if (!user) {
//       const timer = setTimeout(() => router.push('/login?from=cart'), 500);
//       return () => clearTimeout(timer);
//     }
//   }, [user, router]);

//   useEffect(() => {
//     if (!user && cartItems.length > 0) clearCart();
//   }, [user, cartItems.length, clearCart]);

//   const formatPrice = (price: number) => new Intl.NumberFormat('ur-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

//   const hasValidDiscount = (item: any) => item.discount !== undefined && item.discount !== null && item.discount > 0 && item.discount < item.price;
//   const getFinalPrice = (item: any) => hasValidDiscount(item) ? item.price - item.discount : item.price;

//   const getItemKey = (item: ExtendedCartItem) => item.isFlavor && item.flavorId ? `${item.id}_${item.flavorId}` : item.id;
//   const getDisplayName = (item: ExtendedCartItem) => item.isFlavor && item.flavorName ? `${item.name} (${item.flavorName})` : item.name;
//   const getItemImage = (item: ExtendedCartItem) => item.isFlavor && item.flavorImage ? item.flavorImage : item.image;
//   const getItemPrice = (item: ExtendedCartItem) => item.isFlavor && item.flavorPrice !== undefined ? item.flavorPrice : item.price;
//   const getItemDiscount = (item: ExtendedCartItem) => item.isFlavor && item.flavorDiscount !== undefined ? item.flavorDiscount : item.discount || 0;
//   const getItemStock = (item: ExtendedCartItem) => item.isFlavor && item.flavorStock !== undefined ? item.flavorStock : productStocks[item.id] || 0;

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       const details: { [key: string]: Product } = {};
//       for (const item of cartItems) {
//         if (!details[item.id]) {
//           try {
//             const snapshot = await get(ref(rtdb, `products/${item.id}`));
//             if (snapshot.exists()) details[item.id] = { id: item.id, ...snapshot.val() };
//           } catch (error) { console.error('Error fetching product:', error); }
//         }
//       }
//       setProductDetails(details);
//     };
//     if (cartItems.length > 0 && user) fetchProductDetails();
//   }, [cartItems, user]);

//   // ✅ Load flavor selections from RTDB
//   useEffect(() => {
//     const loadFlavorSelections = async () => {
//       if (!user) return;
//       try {
//         const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//         const snapshot = await get(selectionsRef);
//         if (snapshot.exists()) {
//           setFlavorSelections(snapshot.val());
//         } else {
//           await set(selectionsRef, {});
//           setFlavorSelections({});
//         }
//       } catch (error) {
//         console.error('Error loading flavor selections:', error);
//         if (error instanceof Error && error.message.includes('Permission denied')) {
//           try {
//             const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//             await set(selectionsRef, {});
//             setFlavorSelections({});
//           } catch (createError) {
//             console.error('Failed to create cart_selections:', createError);
//           }
//         }
//       }
//     };
//     loadFlavorSelections();
//   }, [user]);

//   useEffect(() => {
//     const fetchDeliveryCharges = async () => {
//       try {
//         const snapshot = await get(ref(rtdb, 'admin_settings/banner'));
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           if (data.deliveryCharges !== undefined) setDeliveryCharges(data.deliveryCharges);
//           if (data.minOrderForFreeDelivery !== undefined) setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//         }
//       } catch (error) { console.error('Error fetching delivery charges:', error); } finally { setLoadingDelivery(false); }
//     };
//     fetchDeliveryCharges();
//   }, []);

//   useEffect(() => {
//     const fetchStocks = async () => {
//       const stocks: { [key: string]: number } = {};
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         const extendedItem = item as ExtendedCartItem;
//         const key = getItemKey(extendedItem);
//         try {
//           let availableStock = 0;
//           if (extendedItem.isFlavor && extendedItem.flavorId) {
//             availableStock = extendedItem.flavorStock || 0;
//           } else {
//             const snapshot = await get(ref(rtdb, `products/${extendedItem.id}`));
//             if (snapshot.exists()) availableStock = snapshot.val().stock || 0;
//           }
//           stocks[key] = availableStock;
//           if (extendedItem.quantity > availableStock && availableStock > 0) {
//             errors[key] = `Only ${availableStock} items available`;
//           } else if (availableStock === 0) {
//             errors[key] = 'Out of stock';
//           }
//         } catch (error) { console.error('Error checking stock:', error); }
//       }
//       setProductStocks(stocks);
//       setStockErrors(errors);
//     };
//     if (cartItems.length > 0 && user) fetchStocks();
//     else { setProductStocks({}); setStockErrors({}); }
//   }, [cartItems, user]);

//   const totalPrice = getTotalCartPrice();
//   const totalQuantity = getTotalCartQuantity();
  
//   const calculatedDeliveryCharges = (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) ? 0 : (deliveryCharges || 0);
//   const totalWithDelivery = totalPrice + calculatedDeliveryCharges;

//   // ✅ Handle quantity update for non-flavor items
//   const handleUpdateQuantity = (item: ExtendedCartItem, newQuantity: number) => {
//     if (newQuantity < 1) return;
//     const key = getItemKey(item);
//     const availableStock = getItemStock(item);
//     if (newQuantity > availableStock) {
//       setStockErrors(prev => ({ ...prev, [key]: `Only ${availableStock} items available` }));
//       return;
//     } else {
//       setStockErrors(prev => { const newErrors = { ...prev }; delete newErrors[key]; return newErrors; });
//     }
//     updateQuantity(item.id, newQuantity);
//   };

//   const handleRemoveFromCart = (item: ExtendedCartItem) => {
//     removeFromCart(item.id);
//     toast.success('Item removed from cart', { duration: 2000, position: 'top-right', icon: '🗑️' });
//   };

//   const handleClearCart = () => {
//     if (!confirm('Are you sure you want to clear your cart?')) return;
//     clearCart();
//     toast.success('Cart cleared successfully', { duration: 2000, position: 'top-right', icon: '🧹' });
//   };

//   // ✅ Open flavor selection modal
//   const openFlavorModal = (productId: string) => {
//     const product = productDetails[productId];
//     if (!product || !product.hasFlavors || !product.flavors) return;

//     const existingSelection = flavorSelections[productId];
    
//     if (existingSelection && existingSelection.selectedFlavors.length > 0) {
//       setTempFlavorSelection({
//         productId: productId,
//         selectedFlavors: existingSelection.selectedFlavors.map(f => ({
//           flavorName: f.flavorName,
//           quantity: f.quantity
//         }))
//       });
//     } else {
//       const initialFlavors = product.flavors.map(f => ({
//         flavorName: f,
//         quantity: 0
//       }));
//       setTempFlavorSelection({
//         productId: productId,
//         selectedFlavors: initialFlavors
//       });
//     }
//     setSelectedProductId(productId);
//     setIsFlavorModalOpen(true);
//   };

//   // ✅ Toggle flavor selection
//   const toggleFlavorSelection = (flavorName: string) => {
//     if (!tempFlavorSelection) return;
//     const newSelectedFlavors = tempFlavorSelection.selectedFlavors.map(f => {
//       if (f.flavorName === flavorName) {
//         return { ...f, quantity: f.quantity === 0 ? 1 : 0 };
//       }
//       return f;
//     });
//     setTempFlavorSelection({ ...tempFlavorSelection, selectedFlavors: newSelectedFlavors });
//   };

//   // ✅ Update flavor quantity in temp selection
//   const updateFlavorQuantityInTemp = (flavorName: string, newQuantity: number) => {
//     if (!tempFlavorSelection) return;
//     const newSelectedFlavors = tempFlavorSelection.selectedFlavors.map(f => {
//       if (f.flavorName === flavorName) {
//         return { ...f, quantity: Math.max(0, newQuantity) };
//       }
//       return f;
//     });
//     setTempFlavorSelection({ ...tempFlavorSelection, selectedFlavors: newSelectedFlavors });
//   };

//   // ✅ Get total quantity of all selected flavors in temp
//   const getTotalFlavorQuantityTemp = () => {
//     if (!tempFlavorSelection) return 0;
//     return tempFlavorSelection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
//   };

//   // ✅ Confirm flavor selection
//   const confirmFlavorSelection = async () => {
//     if (!tempFlavorSelection || !selectedProductId) return;
    
//     setIsSaving(true);

//     const product = productDetails[selectedProductId];
//     if (!product) {
//       toast.error('Product not found!', { duration: 2000, position: 'top-right', icon: '❌' });
//       setIsSaving(false);
//       return;
//     }

//     const selectedFlavors = tempFlavorSelection.selectedFlavors.filter(f => f.quantity > 0);
    
//     try {
//       const cartSelectionsRef = ref(rtdb, `cart_selections/${user?.uid}`);
//       const currentSelections = await get(cartSelectionsRef);
//       let allSelections = currentSelections.exists() ? currentSelections.val() : {};
      
//       if (selectedFlavors.length === 0) {
//         delete allSelections[selectedProductId];
//       } else {
//         allSelections[selectedProductId] = {
//           productId: selectedProductId,
//           selectedFlavors: selectedFlavors
//         };
//       }
      
//       await set(cartSelectionsRef, allSelections);
//       setFlavorSelections(allSelections);
      
//       const totalQty = selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
//       toast.success(`✅ ${selectedFlavors.length} flavors selected (${totalQty} units)`, {
//         duration: 2000,
//         position: 'top-right',
//         icon: '✅',
//       });
//     } catch (error) {
//       console.error('Error saving flavor selections:', error);
//       if (error instanceof Error && error.message.includes('Permission denied')) {
//         toast.error('🔒 Permission denied - please check Firebase rules', { 
//           duration: 3000, 
//           position: 'top-right', 
//           icon: '🔒' 
//         });
//       } else {
//         toast.error('❌ Failed to save flavors', { duration: 2000, position: 'top-right', icon: '❌' });
//       }
//     }

//     setIsFlavorModalOpen(false);
//     setSelectedProductId(null);
//     setTempFlavorSelection(null);
//     setIsSaving(false);
//   };

//   // ✅ Handle Checkout
//   const handleCheckout = () => {
//     if (!user) {
//       toast.error('Please login to proceed to checkout', { duration: 3000, position: 'top-right', icon: '🔒' });
//       setTimeout(() => router.push('/login'), 1500);
//       return;
//     }

//     if (Object.keys(stockErrors).length > 0) {
//       toast.error('Please fix stock issues before proceeding to checkout', { duration: 3000, position: 'top-right', icon: '⚠️' });
//       return;
//     }

//     // ✅ Check if all flavored products have selections
//     const unselectedFlavors: string[] = [];
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.hasFlavors) {
//         const selection = flavorSelections[item.id];
//         if (!selection || selection.selectedFlavors.length === 0) {
//           unselectedFlavors.push(item.name);
//         }
//       }
//     }

//     if (unselectedFlavors.length > 0) {
//       toast.error(`Please select flavors for: ${unselectedFlavors.join(', ')}`, { 
//         duration: 4000, 
//         position: 'top-right', 
//         icon: '⚠️' 
//       });
//       return;
//     }

//     router.push('/checkout');
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <div className="flex items-center justify-center h-[80vh]">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster position="top-right" />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//             <h1 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h1>
//             <p className="text-muted-foreground mb-8">Start shopping and add some beautiful products to your cart</p>
//             <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90">Continue Shopping</Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <Toaster position="top-right" />

//       <section className="py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="mb-8">
//             <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-4"><ArrowLeft size={18} /> Back to shopping</Link>
//             <h1 className="text-4xl font-serif font-bold">Shopping Cart</h1>
//             <p className="text-muted-foreground mt-1">{totalQuantity} items in your cart</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <div className="bg-card rounded-lg shadow-lg overflow-hidden">
//                 {cartItems.map((item, index) => {
//                   const extendedItem = item as ExtendedCartItem;
//                   const key = getItemKey(extendedItem);
//                   const price = getItemPrice(extendedItem);
//                   const discount = getItemDiscount(extendedItem);
//                   const finalPrice = price - discount;
//                   const hasDiscount = discount > 0 && discount < price;
//                   const stockError = stockErrors[key];
//                   const availableStock = getItemStock(extendedItem);
//                   const displayName = getDisplayName(extendedItem);
//                   const image = getItemImage(extendedItem);
//                   const product = productDetails[item.id];
//                   const hasFlavors = product?.hasFlavors && product?.flavors && product.flavors.length > 0;
//                   const flavorSelection = flavorSelections[item.id];
//                   const hasFlavorSelected = flavorSelection && flavorSelection.selectedFlavors.length > 0;
//                   const totalFlavorQty = hasFlavorSelected 
//                     ? flavorSelection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0)
//                     : 0;
//                   const displayQty = hasFlavors ? totalFlavorQty : item.quantity;

//                   return (
//                     <div key={key} className="p-6 border-b border-border last:border-b-0 flex flex-col sm:flex-row gap-4">
//                       <img src={image} alt={displayName} className="w-24 h-24 object-cover rounded-lg bg-secondary flex-shrink-0 mx-auto sm:mx-0" onError={(e) => e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E'} />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{displayName}</h3>
//                             <p className="text-xs text-muted-foreground mb-2 uppercase truncate">{item.category}</p>
//                           </div>
//                           {hasFlavors && (
//                             <button
//                               onClick={() => openFlavorModal(item.id)}
//                               className={`ml-2 px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0 ${
//                                 hasFlavorSelected ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
//                               }`}
//                             >
//                               <Package size={14} />
//                               {hasFlavorSelected ? `✓ ${totalFlavorQty} items` : 'Select Flavors'}
//                             </button>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2 mb-3 flex-wrap">
//                           <span className="font-bold text-primary text-sm sm:text-base">{formatPrice(finalPrice)}</span>
//                           {hasDiscount && <span className="text-sm text-muted-foreground line-through">{formatPrice(price)}</span>}
//                         </div>
                        
//                         {/* ✅ Quantity Controls - For both flavor and non-flavor */}
//                         <div className="flex items-center gap-3">
//                           <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
//                             <button
//                               onClick={() => {
//                                 if (hasFlavors) {
//                                   // For flavor products, open modal
//                                   openFlavorModal(item.id);
//                                 } else {
//                                   handleUpdateQuantity(extendedItem, item.quantity - 1);
//                                 }
//                               }}
//                               className="p-1.5 hover:bg-gray-200 rounded-l-lg transition"
//                               disabled={!hasFlavors && item.quantity <= 1}
//                             >
//                               <Minus size={16} />
//                             </button>
//                             <span className="w-10 text-center font-semibold text-sm">{displayQty}</span>
//                             <button
//                               onClick={() => {
//                                 if (hasFlavors) {
//                                   // For flavor products, open modal
//                                   openFlavorModal(item.id);
//                                 } else {
//                                   handleUpdateQuantity(extendedItem, item.quantity + 1);
//                                 }
//                               }}
//                               className="p-1.5 hover:bg-gray-200 rounded-r-lg transition"
//                             >
//                               <Plus size={16} />
//                             </button>
//                           </div>
//                           {stockError && <div className="flex items-center gap-1 text-red-500 text-xs"><AlertCircle size={14} /> {stockError}</div>}
//                         </div>

//                         {hasFlavors && hasFlavorSelected && (
//                           <div className="mt-2 text-xs text-green-600 font-medium">
//                             ✓ Flavors: {flavorSelection.selectedFlavors.map(f => `${f.flavorName} (x${f.quantity})`).join(', ')}
//                           </div>
//                         )}
//                       </div>
//                       <div className="text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 sm:gap-0">
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
//                           <p className="text-base sm:text-lg font-bold text-foreground">{formatPrice(finalPrice * displayQty)}</p>
//                         </div>
//                         <button onClick={() => handleRemoveFromCart(extendedItem)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="lg:col-span-1">
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
//                 <h2 className="text-xl font-serif font-bold mb-4">Order Summary</h2>
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Items</span>
//                   <span className="font-semibold">{totalQuantity} units</span>
//                 </div>
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-semibold">{formatPrice(totalPrice)}</span>
//                 </div>
//                 <div className="flex justify-between mb-4 pb-4 border-b border-border">
//                   <span className="text-muted-foreground">Delivery Charges</span>
//                   <span className="font-semibold">{loadingDelivery ? '...' : formatPrice(calculatedDeliveryCharges)}</span>
//                 </div>
//                 {calculatedDeliveryCharges === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                   <div className="text-sm text-green-600 text-right -mt-3 mb-3">🎉 Free delivery applied!</div>
//                 )}
//                 <div className="flex justify-between mb-6">
//                   <span className="text-lg font-bold">Total</span>
//                   <span className="text-xl font-bold text-primary">{formatPrice(totalWithDelivery)}</span>
//                 </div>
//                 <button
//                   onClick={handleCheckout}
//                   className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
//                     Object.keys(stockErrors).length > 0
//                       ? 'bg-gray-400 text-white cursor-not-allowed'
//                       : 'bg-primary text-white hover:opacity-90'
//                   }`}
//                   disabled={Object.keys(stockErrors).length > 0}
//                 >
//                   {Object.keys(stockErrors).length > 0 ? 'Fix Stock Issues' : `Proceed to Checkout (${totalQuantity} items)`}
//                 </button>
//                 <Link href="/products" className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors mt-3">Continue Shopping</Link>
//                 <button onClick={handleClearCart} className="w-full mt-3 text-red-500 hover:text-red-700 text-sm font-semibold">Clear Cart</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ✅ Flavor Selection Modal */}
//       <AnimatePresence>
//         {isFlavorModalOpen && selectedProductId && tempFlavorSelection && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsFlavorModalOpen(false)} className="fixed inset-0 bg-black z-40" />
//             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
//                 <div className="p-4 border-b flex justify-between items-center">
//                   <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Select Flavors</h2>
//                   <button onClick={() => setIsFlavorModalOpen(false)} className="hover:bg-gray-100 p-1.5 rounded-full"><X className="w-6 h-6" /></button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   <p className="text-sm text-muted-foreground">
//                     Select flavors for <strong>{productDetails[selectedProductId]?.name}</strong>
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Total Quantity: <span className="font-bold text-primary">{getTotalFlavorQuantityTemp()}</span>
//                   </p>

//                   <div className="space-y-2">
//                     {tempFlavorSelection.selectedFlavors.map((flavor, idx) => {
//                       const isSelected = flavor.quantity > 0;
                      
//                       return (
//                         <div key={`flavor_${selectedProductId}_${idx}`} className="border rounded-xl p-3 hover:border-primary/50 transition-colors">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                               <button
//                                 onClick={() => toggleFlavorSelection(flavor.flavorName)}
//                                 className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
//                                   isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 hover:border-primary'
//                                 }`}
//                               >
//                                 {isSelected && <Check className="w-3 h-3" />}
//                               </button>
//                               <span className="font-medium">{flavor.flavorName}</span>
//                             </div>
//                             {isSelected && (
//                               <div className="flex items-center gap-2">
//                                 <button
//                                   onClick={() => updateFlavorQuantityInTemp(flavor.flavorName, flavor.quantity - 1)}
//                                   className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                 >
//                                   <Minus size={14} />
//                                 </button>
//                                 <span className="w-8 text-center font-semibold text-sm">{flavor.quantity}</span>
//                                 <button
//                                   onClick={() => updateFlavorQuantityInTemp(flavor.flavorName, flavor.quantity + 1)}
//                                   className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                 >
//                                   <Plus size={14} />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {getTotalFlavorQuantityTemp() > 0 && (
//                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <p className="text-sm font-semibold text-gray-700 mb-2">Selected Flavors:</p>
//                       {tempFlavorSelection.selectedFlavors.filter(f => f.quantity > 0).map((f, idx) => (
//                         <div key={`summary_${idx}`} className="flex justify-between text-sm text-gray-600 py-1">
//                           <span>{f.flavorName}</span>
//                           <span>× {f.quantity}</span>
//                         </div>
//                       ))}
//                       <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-primary">
//                         <span>Total</span>
//                         <span>{getTotalFlavorQuantityTemp()} items</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-4 border-t flex gap-3">
//                   <button onClick={() => setIsFlavorModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
//                   <button
//                     onClick={confirmFlavorSelection}
//                     disabled={isSaving}
//                     className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
//                       isSaving
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-primary text-white hover:opacity-90'
//                     }`}
//                   >
//                     {isSaving ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                     ) : (
//                       <>
//                         <Check className="w-5 h-5" />
//                         Save Flavors
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       <footer className="bg-secondary py-8 px-4 mt-12 text-center text-muted-foreground text-sm">
//         <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }



//cart in local storage without flavours empty
// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, AlertCircle, Package, X, Check } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import Navbar from '@/components/Navbar';
// import { useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, get, set } from 'firebase/database';
// import toast, { Toaster } from 'react-hot-toast';

// interface ExtendedCartItem {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   quantity: number;
//   flavorId?: string | null;
//   flavorName?: string | null;
//   flavorPrice?: number;
//   flavorDiscount?: number;
//   flavorStock?: number;
//   flavorImage?: string | null;
//   isFlavor?: boolean;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   additionalImages?: string[];
//   category: string;
//   description?: string;
//   stock?: number;
//   hasFlavors?: boolean;
//   flavors?: string[];
// }

// interface CartFlavorSelection {
//   productId: string;
//   selectedFlavors: { flavorName: string; quantity: number }[];
// }

// export default function CartPage() {
//   const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
//   const { user, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
//   const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState<number>(0);
//   const [loadingDelivery, setLoadingDelivery] = useState(true);
//   const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
//   const [productStocks, setProductStocks] = useState<{ [key: string]: number }>({});
//   const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});
//   const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
//   const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
//   const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: CartFlavorSelection }>({});
//   const [tempFlavorSelection, setTempFlavorSelection] = useState<CartFlavorSelection | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // ✅ Calculate total quantity from flavor selections
//   const getTotalFlavorQuantityForProduct = (productId: string) => {
//     const selection = flavorSelections[productId];
//     if (!selection || !selection.selectedFlavors) return 0;
//     return selection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
//   };

//   // ✅ Get total quantity from all cart items including flavors
//   const getTotalCartQuantity = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const extendedItem = item as ExtendedCartItem;
//       if (productDetails[item.id]?.hasFlavors) {
//         total += getTotalFlavorQuantityForProduct(item.id);
//       } else {
//         total += item.quantity;
//       }
//     }
//     return total;
//   };

//   // ✅ Get total price from all cart items including flavors
//   const getTotalCartPrice = () => {
//     let total = 0;
//     for (const item of cartItems) {
//       const extendedItem = item as ExtendedCartItem;
//       const price = getItemPrice(extendedItem);
//       const discount = getItemDiscount(extendedItem);
//       const finalPrice = price - discount;
      
//       if (productDetails[item.id]?.hasFlavors) {
//         const qty = getTotalFlavorQuantityForProduct(item.id);
//         total += finalPrice * qty;
//       } else {
//         total += finalPrice * item.quantity;
//       }
//     }
//     return total;
//   };

//   // ✅ Check auth and redirect - WITHOUT toast
//   useEffect(() => {
//     if (authLoading) return;
    
//     setIsCheckingAuth(false);
    
//     if (!user) {
//       // ✅ Only redirect without toast on initial load
//       const timer = setTimeout(() => {
//         router.push('/login?from=cart');
//       }, 500);
//       return () => clearTimeout(timer);
//     }
//   }, [user, authLoading, router]);

//   // ✅ Only show toast when user tries to interact with cart while not logged in
//   const handleUnauthorizedAction = () => {
//     if (!user) {
//       toast.error('Please login to manage your cart', {
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
//         router.push('/login?from=cart');
//       }, 1500);
//       return true;
//     }
//     return false;
//   };

//   const formatPrice = (price: number) => new Intl.NumberFormat('ur-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

//   const hasValidDiscount = (item: any) => item.discount !== undefined && item.discount !== null && item.discount > 0 && item.discount < item.price;
//   const getFinalPrice = (item: any) => hasValidDiscount(item) ? item.price - item.discount : item.price;

//   const getItemKey = (item: ExtendedCartItem) => item.isFlavor && item.flavorId ? `${item.id}_${item.flavorId}` : item.id;
//   const getDisplayName = (item: ExtendedCartItem) => item.isFlavor && item.flavorName ? `${item.name} (${item.flavorName})` : item.name;
//   const getItemImage = (item: ExtendedCartItem) => item.isFlavor && item.flavorImage ? item.flavorImage : item.image;
//   const getItemPrice = (item: ExtendedCartItem) => item.isFlavor && item.flavorPrice !== undefined ? item.flavorPrice : item.price;
//   const getItemDiscount = (item: ExtendedCartItem) => item.isFlavor && item.flavorDiscount !== undefined ? item.flavorDiscount : item.discount || 0;
//   const getItemStock = (item: ExtendedCartItem) => item.isFlavor && item.flavorStock !== undefined ? item.flavorStock : productStocks[item.id] || 0;

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       const details: { [key: string]: Product } = {};
//       for (const item of cartItems) {
//         if (!details[item.id]) {
//           try {
//             const snapshot = await get(ref(rtdb, `products/${item.id}`));
//             if (snapshot.exists()) details[item.id] = { id: item.id, ...snapshot.val() };
//           } catch (error) { console.error('Error fetching product:', error); }
//         }
//       }
//       setProductDetails(details);
//     };
//     if (cartItems.length > 0 && user) fetchProductDetails();
//   }, [cartItems, user]);

//   // ✅ Load flavor selections from RTDB
//   useEffect(() => {
//     const loadFlavorSelections = async () => {
//       if (!user) return;
//       try {
//         const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//         const snapshot = await get(selectionsRef);
//         if (snapshot.exists()) {
//           setFlavorSelections(snapshot.val());
//         } else {
//           await set(selectionsRef, {});
//           setFlavorSelections({});
//         }
//       } catch (error) {
//         console.error('Error loading flavor selections:', error);
//         if (error instanceof Error && error.message.includes('Permission denied')) {
//           try {
//             const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
//             await set(selectionsRef, {});
//             setFlavorSelections({});
//           } catch (createError) {
//             console.error('Failed to create cart_selections:', createError);
//           }
//         }
//       }
//     };
//     loadFlavorSelections();
//   }, [user]);

//   useEffect(() => {
//     const fetchDeliveryCharges = async () => {
//       try {
//         const snapshot = await get(ref(rtdb, 'admin_settings/banner'));
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           if (data.deliveryCharges !== undefined) setDeliveryCharges(data.deliveryCharges);
//           if (data.minOrderForFreeDelivery !== undefined) setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
//         }
//       } catch (error) { console.error('Error fetching delivery charges:', error); } finally { setLoadingDelivery(false); }
//     };
//     fetchDeliveryCharges();
//   }, []);

//   useEffect(() => {
//     const fetchStocks = async () => {
//       const stocks: { [key: string]: number } = {};
//       const errors: { [key: string]: string } = {};
//       for (const item of cartItems) {
//         const extendedItem = item as ExtendedCartItem;
//         const key = getItemKey(extendedItem);
//         try {
//           let availableStock = 0;
//           if (extendedItem.isFlavor && extendedItem.flavorId) {
//             availableStock = extendedItem.flavorStock || 0;
//           } else {
//             const snapshot = await get(ref(rtdb, `products/${extendedItem.id}`));
//             if (snapshot.exists()) availableStock = snapshot.val().stock || 0;
//           }
//           stocks[key] = availableStock;
//           if (extendedItem.quantity > availableStock && availableStock > 0) {
//             errors[key] = `Only ${availableStock} items available`;
//           } else if (availableStock === 0) {
//             errors[key] = 'Out of stock';
//           }
//         } catch (error) { console.error('Error checking stock:', error); }
//       }
//       setProductStocks(stocks);
//       setStockErrors(errors);
//     };
//     if (cartItems.length > 0 && user) fetchStocks();
//     else { setProductStocks({}); setStockErrors({}); }
//   }, [cartItems, user]);

//   const totalPrice = getTotalCartPrice();
//   const totalQuantity = getTotalCartQuantity();
  
//   const calculatedDeliveryCharges = (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) ? 0 : (deliveryCharges || 0);
//   const totalWithDelivery = totalPrice + calculatedDeliveryCharges;

//   // ✅ Handle quantity update for non-flavor items
//   const handleUpdateQuantity = (item: ExtendedCartItem, newQuantity: number) => {
//     if (handleUnauthorizedAction()) return;
    
//     if (newQuantity < 1) return;
//     const key = getItemKey(item);
//     const availableStock = getItemStock(item);
//     if (newQuantity > availableStock) {
//       setStockErrors(prev => ({ ...prev, [key]: `Only ${availableStock} items available` }));
//       return;
//     } else {
//       setStockErrors(prev => { const newErrors = { ...prev }; delete newErrors[key]; return newErrors; });
//     }
//     updateQuantity(item.id, newQuantity);
//   };

//   const handleRemoveFromCart = (item: ExtendedCartItem) => {
//     if (handleUnauthorizedAction()) return;
    
//     removeFromCart(item.id);
//     toast.success('Item removed from cart', { duration: 2000, position: 'top-right', icon: '🗑️' });
//   };

//   const handleClearCart = () => {
//     if (handleUnauthorizedAction()) return;
    
//     if (!confirm('Are you sure you want to clear your cart?')) return;
//     clearCart();
//     toast.success('Cart cleared successfully', { duration: 2000, position: 'top-right', icon: '🧹' });
//   };

//   // ✅ Open flavor selection modal
//   const openFlavorModal = (productId: string) => {
//     if (handleUnauthorizedAction()) return;
    
//     const product = productDetails[productId];
//     if (!product || !product.hasFlavors || !product.flavors) return;

//     const existingSelection = flavorSelections[productId];
    
//     if (existingSelection && existingSelection.selectedFlavors.length > 0) {
//       setTempFlavorSelection({
//         productId: productId,
//         selectedFlavors: existingSelection.selectedFlavors.map(f => ({
//           flavorName: f.flavorName,
//           quantity: f.quantity
//         }))
//       });
//     } else {
//       const initialFlavors = product.flavors.map(f => ({
//         flavorName: f,
//         quantity: 0
//       }));
//       setTempFlavorSelection({
//         productId: productId,
//         selectedFlavors: initialFlavors
//       });
//     }
//     setSelectedProductId(productId);
//     setIsFlavorModalOpen(true);
//   };

//   // ✅ Toggle flavor selection
//   const toggleFlavorSelection = (flavorName: string) => {
//     if (!tempFlavorSelection) return;
//     const newSelectedFlavors = tempFlavorSelection.selectedFlavors.map(f => {
//       if (f.flavorName === flavorName) {
//         return { ...f, quantity: f.quantity === 0 ? 1 : 0 };
//       }
//       return f;
//     });
//     setTempFlavorSelection({ ...tempFlavorSelection, selectedFlavors: newSelectedFlavors });
//   };

//   // ✅ Update flavor quantity in temp selection
//   const updateFlavorQuantityInTemp = (flavorName: string, newQuantity: number) => {
//     if (!tempFlavorSelection) return;
//     const newSelectedFlavors = tempFlavorSelection.selectedFlavors.map(f => {
//       if (f.flavorName === flavorName) {
//         return { ...f, quantity: Math.max(0, newQuantity) };
//       }
//       return f;
//     });
//     setTempFlavorSelection({ ...tempFlavorSelection, selectedFlavors: newSelectedFlavors });
//   };

//   // ✅ Get total quantity of all selected flavors in temp
//   const getTotalFlavorQuantityTemp = () => {
//     if (!tempFlavorSelection) return 0;
//     return tempFlavorSelection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
//   };

//   // ✅ Confirm flavor selection
//   const confirmFlavorSelection = async () => {
//     if (!tempFlavorSelection || !selectedProductId) return;
    
//     setIsSaving(true);

//     const product = productDetails[selectedProductId];
//     if (!product) {
//       toast.error('Product not found!', { duration: 2000, position: 'top-right', icon: '❌' });
//       setIsSaving(false);
//       return;
//     }

//     const selectedFlavors = tempFlavorSelection.selectedFlavors.filter(f => f.quantity > 0);
    
//     try {
//       const cartSelectionsRef = ref(rtdb, `cart_selections/${user?.uid}`);
//       const currentSelections = await get(cartSelectionsRef);
//       let allSelections = currentSelections.exists() ? currentSelections.val() : {};
      
//       if (selectedFlavors.length === 0) {
//         delete allSelections[selectedProductId];
//       } else {
//         allSelections[selectedProductId] = {
//           productId: selectedProductId,
//           selectedFlavors: selectedFlavors
//         };
//       }
      
//       await set(cartSelectionsRef, allSelections);
//       setFlavorSelections(allSelections);
      
//       const totalQty = selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
//       toast.success(`✅ ${selectedFlavors.length} flavors selected (${totalQty} units)`, {
//         duration: 2000,
//         position: 'top-right',
//         icon: '✅',
//       });
//     } catch (error) {
//       console.error('Error saving flavor selections:', error);
//       if (error instanceof Error && error.message.includes('Permission denied')) {
//         toast.error('🔒 Permission denied - please check Firebase rules', { 
//           duration: 3000, 
//           position: 'top-right', 
//           icon: '🔒' 
//         });
//       } else {
//         toast.error('❌ Failed to save flavors', { duration: 2000, position: 'top-right', icon: '❌' });
//       }
//     }

//     setIsFlavorModalOpen(false);
//     setSelectedProductId(null);
//     setTempFlavorSelection(null);
//     setIsSaving(false);
//   };

//   // ✅ Handle Checkout
//   const handleCheckout = () => {
//     if (handleUnauthorizedAction()) return;

//     if (Object.keys(stockErrors).length > 0) {
//       toast.error('Please fix stock issues before proceeding to checkout', { duration: 3000, position: 'top-right', icon: '⚠️' });
//       return;
//     }

//     // ✅ Check if all flavored products have selections
//     const unselectedFlavors: string[] = [];
//     for (const item of cartItems) {
//       const product = productDetails[item.id];
//       if (product?.hasFlavors) {
//         const selection = flavorSelections[item.id];
//         if (!selection || selection.selectedFlavors.length === 0) {
//           unselectedFlavors.push(item.name);
//         }
//       }
//     }

//     if (unselectedFlavors.length > 0) {
//       toast.error(`Please select flavors for: ${unselectedFlavors.join(', ')}`, { 
//         duration: 4000, 
//         position: 'top-right', 
//         icon: '⚠️' 
//       });
//       return;
//     }

//     router.push('/checkout');
//   };

//   // ✅ Show loading while checking auth
//   if (authLoading || isCheckingAuth) {
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

//   // ✅ If user is not logged in, show login prompt (without toast)
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster position="top-right" />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
//               <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//               <h1 className="text-3xl font-serif font-bold mb-4">Login to View Cart</h1>
//               <p className="text-muted-foreground mb-8">Please login to view and manage your cart items</p>
//               <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                 <Link 
//                   href="/login?from=cart" 
//                   className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
//                 >
//                   Login
//                 </Link>
//                 <Link 
//                   href="/products" 
//                   className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-muted"
//                 >
//                   Continue Shopping
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-background">
//         <Navbar />
//         <Toaster position="top-right" />
//         <section className="py-20 px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
//             <h1 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h1>
//             <p className="text-muted-foreground mb-8">Start shopping and add some beautiful products to your cart</p>
//             <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90">Continue Shopping</Link>
//           </div>
//         </section>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <Toaster position="top-right" />

//       <section className="py-12 px-4">
//         <div className="max-w-4xl mx-auto">
//           <div className="mb-8">
//             <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-4"><ArrowLeft size={18} /> Back to shopping</Link>
//             <h1 className="text-4xl font-serif font-bold">Shopping Cart</h1>
//             <p className="text-muted-foreground mt-1">{totalQuantity} items in your cart</p>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <div className="bg-card rounded-lg shadow-lg overflow-hidden">
//                 {cartItems.map((item, index) => {
//                   const extendedItem = item as ExtendedCartItem;
//                   const key = getItemKey(extendedItem);
//                   const price = getItemPrice(extendedItem);
//                   const discount = getItemDiscount(extendedItem);
//                   const finalPrice = price - discount;
//                   const hasDiscount = discount > 0 && discount < price;
//                   const stockError = stockErrors[key];
//                   const availableStock = getItemStock(extendedItem);
//                   const displayName = getDisplayName(extendedItem);
//                   const image = getItemImage(extendedItem);
//                   const product = productDetails[item.id];
//                   const hasFlavors = product?.hasFlavors && product?.flavors && product.flavors.length > 0;
//                   const flavorSelection = flavorSelections[item.id];
//                   const hasFlavorSelected = flavorSelection && flavorSelection.selectedFlavors.length > 0;
//                   const totalFlavorQty = hasFlavorSelected 
//                     ? flavorSelection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0)
//                     : 0;
//                   const displayQty = hasFlavors ? totalFlavorQty : item.quantity;

//                   return (
//                     <div key={key} className="p-6 border-b border-border last:border-b-0 flex flex-col sm:flex-row gap-4">
//                       <img src={image} alt={displayName} className="w-24 h-24 object-cover rounded-lg bg-secondary flex-shrink-0 mx-auto sm:mx-0" onError={(e) => e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E'} />
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{displayName}</h3>
//                             <p className="text-xs text-muted-foreground mb-2 uppercase truncate">{item.category}</p>
//                           </div>
//                           {hasFlavors && (
//                             <button
//                               onClick={() => openFlavorModal(item.id)}
//                               className={`ml-2 px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0 ${
//                                 hasFlavorSelected ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
//                               }`}
//                             >
//                               <Package size={14} />
//                               {hasFlavorSelected ? `✓ ${totalFlavorQty} items` : 'Select Flavors'}
//                             </button>
//                           )}
//                         </div>
//                         <div className="flex items-center gap-2 mb-3 flex-wrap">
//                           <span className="font-bold text-primary text-sm sm:text-base">{formatPrice(finalPrice)}</span>
//                           {hasDiscount && <span className="text-sm text-muted-foreground line-through">{formatPrice(price)}</span>}
//                         </div>
                        
//                         {/* ✅ Quantity Controls */}
//                         <div className="flex items-center gap-3">
//                           <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
//                             <button
//                               onClick={() => {
//                                 if (hasFlavors) {
//                                   openFlavorModal(item.id);
//                                 } else {
//                                   handleUpdateQuantity(extendedItem, item.quantity - 1);
//                                 }
//                               }}
//                               className="p-1.5 hover:bg-gray-200 rounded-l-lg transition"
//                               disabled={!hasFlavors && item.quantity <= 1}
//                             >
//                               <Minus size={16} />
//                             </button>
//                             <span className="w-10 text-center font-semibold text-sm">{displayQty}</span>
//                             <button
//                               onClick={() => {
//                                 if (hasFlavors) {
//                                   openFlavorModal(item.id);
//                                 } else {
//                                   handleUpdateQuantity(extendedItem, item.quantity + 1);
//                                 }
//                               }}
//                               className="p-1.5 hover:bg-gray-200 rounded-r-lg transition"
//                             >
//                               <Plus size={16} />
//                             </button>
//                           </div>
//                           {stockError && <div className="flex items-center gap-1 text-red-500 text-xs"><AlertCircle size={14} /> {stockError}</div>}
//                         </div>

//                         {hasFlavors && hasFlavorSelected && (
//                           <div className="mt-2 text-xs text-green-600 font-medium">
//                             ✓ Flavors: {flavorSelection.selectedFlavors.map(f => `${f.flavorName} (x${f.quantity})`).join(', ')}
//                           </div>
//                         )}
//                       </div>
//                       <div className="text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 sm:gap-0">
//                         <div>
//                           <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
//                           <p className="text-base sm:text-lg font-bold text-foreground">{formatPrice(finalPrice * displayQty)}</p>
//                         </div>
//                         <button onClick={() => handleRemoveFromCart(extendedItem)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="lg:col-span-1">
//               <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
//                 <h2 className="text-xl font-serif font-bold mb-4">Order Summary</h2>
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Items</span>
//                   <span className="font-semibold">{totalQuantity} units</span>
//                 </div>
//                 <div className="flex justify-between mb-3 pb-3 border-b border-border">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span className="font-semibold">{formatPrice(totalPrice)}</span>
//                 </div>
//                 <div className="flex justify-between mb-4 pb-4 border-b border-border">
//                   <span className="text-muted-foreground">Delivery Charges</span>
//                   <span className="font-semibold">{loadingDelivery ? '...' : formatPrice(calculatedDeliveryCharges)}</span>
//                 </div>
//                 {calculatedDeliveryCharges === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
//                   <div className="text-sm text-green-600 text-right -mt-3 mb-3">🎉 Free delivery applied!</div>
//                 )}
//                 <div className="flex justify-between mb-6">
//                   <span className="text-lg font-bold">Total</span>
//                   <span className="text-xl font-bold text-primary">{formatPrice(totalWithDelivery)}</span>
//                 </div>
//                 <button
//                   onClick={handleCheckout}
//                   className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
//                     Object.keys(stockErrors).length > 0
//                       ? 'bg-gray-400 text-white cursor-not-allowed'
//                       : 'bg-primary text-white hover:opacity-90'
//                   }`}
//                   disabled={Object.keys(stockErrors).length > 0}
//                 >
//                   {Object.keys(stockErrors).length > 0 ? 'Fix Stock Issues' : `Proceed to Checkout (${totalQuantity} items)`}
//                 </button>
//                 <Link href="/products" className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors mt-3">Continue Shopping</Link>
//                 <button onClick={handleClearCart} className="w-full mt-3 text-red-500 hover:text-red-700 text-sm font-semibold">Clear Cart</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ✅ Flavor Selection Modal */}
//       <AnimatePresence>
//         {isFlavorModalOpen && selectedProductId && tempFlavorSelection && (
//           <>
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsFlavorModalOpen(false)} className="fixed inset-0 bg-black z-40" />
//             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
//               <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
//                 <div className="p-4 border-b flex justify-between items-center">
//                   <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Select Flavors</h2>
//                   <button onClick={() => setIsFlavorModalOpen(false)} className="hover:bg-gray-100 p-1.5 rounded-full"><X className="w-6 h-6" /></button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   <p className="text-sm text-muted-foreground">
//                     Select flavors for <strong>{productDetails[selectedProductId]?.name}</strong>
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     Total Quantity: <span className="font-bold text-primary">{getTotalFlavorQuantityTemp()}</span>
//                   </p>

//                   <div className="space-y-2">
//                     {tempFlavorSelection.selectedFlavors.map((flavor, idx) => {
//                       const isSelected = flavor.quantity > 0;
                      
//                       return (
//                         <div key={`flavor_${selectedProductId}_${idx}`} className="border rounded-xl p-3 hover:border-primary/50 transition-colors">
//                           <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                               <button
//                                 onClick={() => toggleFlavorSelection(flavor.flavorName)}
//                                 className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
//                                   isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 hover:border-primary'
//                                 }`}
//                               >
//                                 {isSelected && <Check className="w-3 h-3" />}
//                               </button>
//                               <span className="font-medium">{flavor.flavorName}</span>
//                             </div>
//                             {isSelected && (
//                               <div className="flex items-center gap-2">
//                                 <button
//                                   onClick={() => updateFlavorQuantityInTemp(flavor.flavorName, flavor.quantity - 1)}
//                                   className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                 >
//                                   <Minus size={14} />
//                                 </button>
//                                 <span className="w-8 text-center font-semibold text-sm">{flavor.quantity}</span>
//                                 <button
//                                   onClick={() => updateFlavorQuantityInTemp(flavor.flavorName, flavor.quantity + 1)}
//                                   className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
//                                 >
//                                   <Plus size={14} />
//                                 </button>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {getTotalFlavorQuantityTemp() > 0 && (
//                     <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <p className="text-sm font-semibold text-gray-700 mb-2">Selected Flavors:</p>
//                       {tempFlavorSelection.selectedFlavors.filter(f => f.quantity > 0).map((f, idx) => (
//                         <div key={`summary_${idx}`} className="flex justify-between text-sm text-gray-600 py-1">
//                           <span>{f.flavorName}</span>
//                           <span>× {f.quantity}</span>
//                         </div>
//                       ))}
//                       <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-primary">
//                         <span>Total</span>
//                         <span>{getTotalFlavorQuantityTemp()} items</span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-4 border-t flex gap-3">
//                   <button onClick={() => setIsFlavorModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
//                   <button
//                     onClick={confirmFlavorSelection}
//                     disabled={isSaving}
//                     className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
//                       isSaving
//                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                         : 'bg-primary text-white hover:opacity-90'
//                     }`}
//                   >
//                     {isSaving ? (
//                       <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                     ) : (
//                       <>
//                         <Check className="w-5 h-5" />
//                         Save Flavors
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>

//       <footer className="bg-secondary py-8 px-4 mt-12 text-center text-muted-foreground text-sm">
//         <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }



//flavours stock issue resolved in cart

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, AlertCircle, Package, X, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, get, set, remove } from 'firebase/database';
import toast, { Toaster } from 'react-hot-toast';

interface ExtendedCartItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  quantity: number;
  flavorId?: string | null;
  flavorName?: string | null;
  flavorPrice?: number;
  flavorDiscount?: number;
  flavorStock?: number;
  flavorImage?: string | null;
  isFlavor?: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  additionalImages?: string[];
  category: string;
  description?: string;
  stock?: number;
  hasFlavors?: boolean;
  flavors?: string[];
}

interface CartFlavorSelection {
  productId: string;
  selectedFlavors: { flavorName: string; quantity: number }[];
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
  const [minOrderForFreeDelivery, setMinOrderForFreeDelivery] = useState<number>(0);
  const [loadingDelivery, setLoadingDelivery] = useState(true);
  const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
  const [productStocks, setProductStocks] = useState<{ [key: string]: number }>({});
  const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [isFlavorModalOpen, setIsFlavorModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [flavorSelections, setFlavorSelections] = useState<{ [key: string]: CartFlavorSelection }>({});
  const [tempFlavorSelection, setTempFlavorSelection] = useState<CartFlavorSelection | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Calculate total quantity from flavor selections
  const getTotalFlavorQuantityForProduct = (productId: string) => {
    const selection = flavorSelections[productId];
    if (!selection || !selection.selectedFlavors) return 0;
    return selection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
  };

  // ✅ Get total quantity from all cart items including flavors
  const getTotalCartQuantity = () => {
    let total = 0;
    for (const item of cartItems) {
      const extendedItem = item as ExtendedCartItem;
      if (productDetails[item.id]?.hasFlavors) {
        total += getTotalFlavorQuantityForProduct(item.id);
      } else {
        total += item.quantity;
      }
    }
    return total;
  };

  // ✅ Get total price from all cart items including flavors
  const getTotalCartPrice = () => {
    let total = 0;
    for (const item of cartItems) {
      const extendedItem = item as ExtendedCartItem;
      const price = getItemPrice(extendedItem);
      const discount = getItemDiscount(extendedItem);
      const finalPrice = price - discount;
      
      if (productDetails[item.id]?.hasFlavors) {
        const qty = getTotalFlavorQuantityForProduct(item.id);
        total += finalPrice * qty;
      } else {
        total += finalPrice * item.quantity;
      }
    }
    return total;
  };

  // ✅ Check auth and redirect - WITHOUT toast
  useEffect(() => {
    if (authLoading) return;
    
    setIsCheckingAuth(false);
    
    if (!user) {
      const timer = setTimeout(() => {
        router.push('/login?from=cart');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, router]);

  // ✅ Only show toast when user tries to interact with cart while not logged in
  const handleUnauthorizedAction = () => {
    if (!user) {
      toast.error('Please login to manage your cart', {
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
        router.push('/login?from=cart');
      }, 1500);
      return true;
    }
    return false;
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('ur-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);

  const hasValidDiscount = (item: any) => item.discount !== undefined && item.discount !== null && item.discount > 0 && item.discount < item.price;
  const getFinalPrice = (item: any) => hasValidDiscount(item) ? item.price - item.discount : item.price;

  const getItemKey = (item: ExtendedCartItem) => item.isFlavor && item.flavorId ? `${item.id}_${item.flavorId}` : item.id;
  const getDisplayName = (item: ExtendedCartItem) => item.isFlavor && item.flavorName ? `${item.name} (${item.flavorName})` : item.name;
  const getItemImage = (item: ExtendedCartItem) => item.isFlavor && item.flavorImage ? item.flavorImage : item.image;
  const getItemPrice = (item: ExtendedCartItem) => item.isFlavor && item.flavorPrice !== undefined ? item.flavorPrice : item.price;
  const getItemDiscount = (item: ExtendedCartItem) => item.isFlavor && item.flavorDiscount !== undefined ? item.flavorDiscount : item.discount || 0;
  const getItemStock = (item: ExtendedCartItem) => item.isFlavor && item.flavorStock !== undefined ? item.flavorStock : productStocks[item.id] || 0;

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details: { [key: string]: Product } = {};
      for (const item of cartItems) {
        if (!details[item.id]) {
          try {
            const snapshot = await get(ref(rtdb, `products/${item.id}`));
            if (snapshot.exists()) details[item.id] = { id: item.id, ...snapshot.val() };
          } catch (error) { console.error('Error fetching product:', error); }
        }
      }
      setProductDetails(details);
    };
    if (cartItems.length > 0 && user) fetchProductDetails();
  }, [cartItems, user]);

  // ✅ Load flavor selections from RTDB - Only if user is logged in
  useEffect(() => {
    const loadFlavorSelections = async () => {
      if (!user) return;
      try {
        const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
        const snapshot = await get(selectionsRef);
        if (snapshot.exists()) {
          // ✅ Only load selections for products that are actually in cart
          const selections = snapshot.val();
          const filteredSelections: { [key: string]: CartFlavorSelection } = {};
          for (const productId of Object.keys(selections)) {
            if (cartItems.some(item => item.id === productId)) {
              filteredSelections[productId] = selections[productId];
            }
          }
          setFlavorSelections(filteredSelections);
        } else {
          await set(selectionsRef, {});
          setFlavorSelections({});
        }
      } catch (error) {
        console.error('Error loading flavor selections:', error);
        if (error instanceof Error && error.message.includes('Permission denied')) {
          try {
            const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
            await set(selectionsRef, {});
            setFlavorSelections({});
          } catch (createError) {
            console.error('Failed to create cart_selections:', createError);
          }
        }
      }
    };
    if (user && cartItems.length > 0) {
      loadFlavorSelections();
    } else if (user) {
      setFlavorSelections({});
    }
  }, [user, cartItems]);

  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        const snapshot = await get(ref(rtdb, 'admin_settings/banner'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.deliveryCharges !== undefined) setDeliveryCharges(data.deliveryCharges);
          if (data.minOrderForFreeDelivery !== undefined) setMinOrderForFreeDelivery(data.minOrderForFreeDelivery);
        }
      } catch (error) { console.error('Error fetching delivery charges:', error); } finally { setLoadingDelivery(false); }
    };
    fetchDeliveryCharges();
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      const stocks: { [key: string]: number } = {};
      const errors: { [key: string]: string } = {};
      for (const item of cartItems) {
        const extendedItem = item as ExtendedCartItem;
        const key = getItemKey(extendedItem);
        try {
          let availableStock = 0;
          if (extendedItem.isFlavor && extendedItem.flavorId) {
            availableStock = extendedItem.flavorStock || 0;
          } else {
            const snapshot = await get(ref(rtdb, `products/${extendedItem.id}`));
            if (snapshot.exists()) availableStock = snapshot.val().stock || 0;
          }
          stocks[key] = availableStock;
          if (extendedItem.quantity > availableStock && availableStock > 0) {
            errors[key] = `Only ${availableStock} items available`;
          } else if (availableStock === 0) {
            errors[key] = 'Out of stock';
          }
        } catch (error) { console.error('Error checking stock:', error); }
      }
      setProductStocks(stocks);
      setStockErrors(errors);
    };
    if (cartItems.length > 0 && user) fetchStocks();
    else { setProductStocks({}); setStockErrors({}); }
  }, [cartItems, user]);

  const totalPrice = getTotalCartPrice();
  const totalQuantity = getTotalCartQuantity();
  
  const calculatedDeliveryCharges = (minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery) ? 0 : (deliveryCharges || 0);
  const totalWithDelivery = totalPrice + calculatedDeliveryCharges;

  // ✅ Handle quantity update for non-flavor items
  const handleUpdateQuantity = (item: ExtendedCartItem, newQuantity: number) => {
    if (handleUnauthorizedAction()) return;
    
    if (newQuantity < 1) return;
    const key = getItemKey(item);
    const availableStock = getItemStock(item);
    if (newQuantity > availableStock) {
      setStockErrors(prev => ({ ...prev, [key]: `Only ${availableStock} items available` }));
      return;
    } else {
      setStockErrors(prev => { const newErrors = { ...prev }; delete newErrors[key]; return newErrors; });
    }
    updateQuantity(item.id, newQuantity);
  };

  const handleRemoveFromCart = (item: ExtendedCartItem) => {
    if (handleUnauthorizedAction()) return;
    
    // ✅ Remove flavor selections for this product when removing from cart
    if (user && productDetails[item.id]?.hasFlavors) {
      const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
      get(selectionsRef).then((snapshot) => {
        if (snapshot.exists()) {
          const selections = snapshot.val();
          if (selections[item.id]) {
            delete selections[item.id];
            set(selectionsRef, selections);
            setFlavorSelections(prev => {
              const newSelections = { ...prev };
              delete newSelections[item.id];
              return newSelections;
            });
          }
        }
      }).catch((error) => {
        console.error('Error removing flavor selections:', error);
      });
    }
    
    removeFromCart(item.id);
    toast.success('Item removed from cart', { duration: 2000, position: 'top-right', icon: '🗑️' });
  };

  const handleClearCart = () => {
    if (handleUnauthorizedAction()) return;
    
    if (!confirm('Are you sure you want to clear your cart?')) return;
    
    // ✅ Clear flavor selections too
    if (user) {
      const selectionsRef = ref(rtdb, `cart_selections/${user.uid}`);
      set(selectionsRef, {}).catch((error) => {
        console.error('Error clearing flavor selections:', error);
      });
      setFlavorSelections({});
    }
    
    clearCart();
    toast.success('Cart cleared successfully', { duration: 2000, position: 'top-right', icon: '🧹' });
  };

  // ✅ Open flavor selection modal
  const openFlavorModal = (productId: string) => {
    if (handleUnauthorizedAction()) return;
    
    const product = productDetails[productId];
    if (!product || !product.hasFlavors || !product.flavors) return;

    // ✅ Always initialize with all flavors, quantity 0
    const initialFlavors = product.flavors.map(f => ({
      flavorName: f,
      quantity: 0
    }));

    // ✅ Check if there's an existing selection
    const existingSelection = flavorSelections[productId];
    
    if (existingSelection && existingSelection.selectedFlavors.length > 0) {
      // ✅ Merge existing selections with all flavors (preserve quantities for selected ones)
      const mergedFlavors = initialFlavors.map(initialFlavor => {
        const existing = existingSelection.selectedFlavors.find(
          f => f.flavorName === initialFlavor.flavorName
        );
        return existing || initialFlavor;
      });
      
      setTempFlavorSelection({
        productId: productId,
        selectedFlavors: mergedFlavors
      });
    } else {
      // ✅ All flavors with 0 quantity
      setTempFlavorSelection({
        productId: productId,
        selectedFlavors: initialFlavors
      });
    }
    
    setSelectedProductId(productId);
    setIsFlavorModalOpen(true);
  };

  // ✅ Toggle flavor selection (select/deselect)
  const toggleFlavorSelection = (flavorName: string) => {
    if (!tempFlavorSelection) return;
    const newSelectedFlavors = tempFlavorSelection.selectedFlavors.map(f => {
      if (f.flavorName === flavorName) {
        return { ...f, quantity: f.quantity === 0 ? 1 : 0 };
      }
      return f;
    });
    setTempFlavorSelection({ ...tempFlavorSelection, selectedFlavors: newSelectedFlavors });
  };

  // ✅ Update flavor quantity in temp selection
  const updateFlavorQuantityInTemp = (flavorName: string, newQuantity: number) => {
    if (!tempFlavorSelection) return;
    const newSelectedFlavors = tempFlavorSelection.selectedFlavors.map(f => {
      if (f.flavorName === flavorName) {
        return { ...f, quantity: Math.max(0, newQuantity) };
      }
      return f;
    });
    setTempFlavorSelection({ ...tempFlavorSelection, selectedFlavors: newSelectedFlavors });
  };

  // ✅ Get total quantity of all selected flavors in temp
  const getTotalFlavorQuantityTemp = () => {
    if (!tempFlavorSelection) return 0;
    return tempFlavorSelection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
  };

  // ✅ Confirm flavor selection
  const confirmFlavorSelection = async () => {
    if (!tempFlavorSelection || !selectedProductId) return;
    
    setIsSaving(true);

    const product = productDetails[selectedProductId];
    if (!product) {
      toast.error('Product not found!', { duration: 2000, position: 'top-right', icon: '❌' });
      setIsSaving(false);
      return;
    }

    const selectedFlavors = tempFlavorSelection.selectedFlavors.filter(f => f.quantity > 0);
    
    try {
      const cartSelectionsRef = ref(rtdb, `cart_selections/${user?.uid}`);
      
      if (selectedFlavors.length === 0) {
        // ✅ If no flavors selected, remove from database
        const currentSelections = await get(cartSelectionsRef);
        let allSelections = currentSelections.exists() ? currentSelections.val() : {};
        delete allSelections[selectedProductId];
        await set(cartSelectionsRef, allSelections);
        setFlavorSelections(prev => {
          const newSelections = { ...prev };
          delete newSelections[selectedProductId];
          return newSelections;
        });
        toast.info('Flavors cleared', { duration: 2000, position: 'top-right', icon: '🔄' });
      } else {
        // ✅ Save selected flavors
        const currentSelections = await get(cartSelectionsRef);
        let allSelections = currentSelections.exists() ? currentSelections.val() : {};
        allSelections[selectedProductId] = {
          productId: selectedProductId,
          selectedFlavors: selectedFlavors
        };
        await set(cartSelectionsRef, allSelections);
        setFlavorSelections(allSelections);
        
        const totalQty = selectedFlavors.reduce((sum, f) => sum + f.quantity, 0);
        toast.success(`✅ ${selectedFlavors.length} flavors selected (${totalQty} units)`, {
          duration: 2000,
          position: 'top-right',
          icon: '✅',
        });
      }
    } catch (error) {
      console.error('Error saving flavor selections:', error);
      if (error instanceof Error && error.message.includes('Permission denied')) {
        toast.error('🔒 Permission denied - please check Firebase rules', { 
          duration: 3000, 
          position: 'top-right', 
          icon: '🔒' 
        });
      } else {
        toast.error('❌ Failed to save flavors', { duration: 2000, position: 'top-right', icon: '❌' });
      }
    }

    setIsFlavorModalOpen(false);
    setSelectedProductId(null);
    setTempFlavorSelection(null);
    setIsSaving(false);
  };

  // ✅ Handle Checkout
  const handleCheckout = () => {
    if (handleUnauthorizedAction()) return;

    if (Object.keys(stockErrors).length > 0) {
      toast.error('Please fix stock issues before proceeding to checkout', { duration: 3000, position: 'top-right', icon: '⚠️' });
      return;
    }

    // ✅ Check if all flavored products have selections
    const unselectedFlavors: string[] = [];
    for (const item of cartItems) {
      const product = productDetails[item.id];
      if (product?.hasFlavors) {
        const selection = flavorSelections[item.id];
        if (!selection || selection.selectedFlavors.length === 0) {
          unselectedFlavors.push(item.name);
        }
      }
    }

    if (unselectedFlavors.length > 0) {
      toast.error(`Please select flavors for: ${unselectedFlavors.join(', ')}`, { 
        duration: 4000, 
        position: 'top-right', 
        icon: '⚠️' 
      });
      return;
    }

    router.push('/checkout');
  };

  // ✅ Show loading while checking auth
  if (authLoading || isCheckingAuth) {
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

  // ✅ If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Toaster position="top-right" />
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h1 className="text-3xl font-serif font-bold mb-4">Login to View Cart</h1>
              <p className="text-muted-foreground mb-8">Please login to view and manage your cart items</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/login?from=cart" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
                >
                  Login
                </Link>
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-muted"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Toaster position="top-right" />
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h1 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Start shopping and add some beautiful products to your cart</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90">Continue Shopping</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Toaster position="top-right" />

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-4"><ArrowLeft size={18} /> Back to shopping</Link>
            <h1 className="text-4xl font-serif font-bold">Shopping Cart</h1>
            <p className="text-muted-foreground mt-1">{totalQuantity} items in your cart</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                {cartItems.map((item, index) => {
                  const extendedItem = item as ExtendedCartItem;
                  const key = getItemKey(extendedItem);
                  const price = getItemPrice(extendedItem);
                  const discount = getItemDiscount(extendedItem);
                  const finalPrice = price - discount;
                  const hasDiscount = discount > 0 && discount < price;
                  const stockError = stockErrors[key];
                  const availableStock = getItemStock(extendedItem);
                  const displayName = getDisplayName(extendedItem);
                  const image = getItemImage(extendedItem);
                  const product = productDetails[item.id];
                  const hasFlavors = product?.hasFlavors && product?.flavors && product.flavors.length > 0;
                  const flavorSelection = flavorSelections[item.id];
                  const hasFlavorSelected = flavorSelection && flavorSelection.selectedFlavors.length > 0;
                  const totalFlavorQty = hasFlavorSelected 
                    ? flavorSelection.selectedFlavors.reduce((sum, f) => sum + f.quantity, 0)
                    : 0;
                  const displayQty = hasFlavors ? totalFlavorQty : item.quantity;

                  return (
                    <div key={key} className="p-6 border-b border-border last:border-b-0 flex flex-col sm:flex-row gap-4">
                      <img src={image} alt={displayName} className="w-24 h-24 object-cover rounded-lg bg-secondary flex-shrink-0 mx-auto sm:mx-0" onError={(e) => e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E'} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base truncate">{displayName}</h3>
                            <p className="text-xs text-muted-foreground mb-2 uppercase truncate">{item.category}</p>
                          </div>
                          {hasFlavors && (
                            <button
                              onClick={() => openFlavorModal(item.id)}
                              className={`ml-2 px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 flex-shrink-0 ${
                                hasFlavorSelected ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              }`}
                            >
                              <Package size={14} />
                              {hasFlavorSelected ? `✓ ${totalFlavorQty} items` : 'Select Varients'}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="font-bold text-primary text-sm sm:text-base">{formatPrice(finalPrice)}</span>
                          {hasDiscount && <span className="text-sm text-muted-foreground line-through">{formatPrice(price)}</span>}
                        </div>
                        
                        {/* ✅ Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                            <button
                              onClick={() => {
                                if (hasFlavors) {
                                  openFlavorModal(item.id);
                                } else {
                                  handleUpdateQuantity(extendedItem, item.quantity - 1);
                                }
                              }}
                              className="p-1.5 hover:bg-gray-200 rounded-l-lg transition"
                              disabled={!hasFlavors && item.quantity <= 1}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-semibold text-sm">{displayQty}</span>
                            <button
                              onClick={() => {
                                if (hasFlavors) {
                                  openFlavorModal(item.id);
                                } else {
                                  handleUpdateQuantity(extendedItem, item.quantity + 1);
                                }
                              }}
                              className="p-1.5 hover:bg-gray-200 rounded-r-lg transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          {stockError && <div className="flex items-center gap-1 text-red-500 text-xs"><AlertCircle size={14} /> {stockError}</div>}
                        </div>

                        {hasFlavors && hasFlavorSelected && (
                          <div className="mt-2 text-xs text-green-600 font-medium">
                            ✓ Flavors: {flavorSelection.selectedFlavors.map(f => `${f.flavorName} (x${f.quantity})`).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex flex-row sm:flex-col justify-between items-center sm:items-end gap-2 sm:gap-0">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                          <p className="text-base sm:text-lg font-bold text-foreground">{formatPrice(finalPrice * displayQty)}</p>
                        </div>
                        <button onClick={() => handleRemoveFromCart(extendedItem)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
                <h2 className="text-xl font-serif font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-3 pb-3 border-b border-border">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-semibold">{totalQuantity} units</span>
                </div>
                <div className="flex justify-between mb-3 pb-3 border-b border-border">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className="font-semibold">{loadingDelivery ? '...' : formatPrice(calculatedDeliveryCharges)}</span>
                </div>
                {calculatedDeliveryCharges === 0 && totalPrice > 0 && minOrderForFreeDelivery > 0 && totalPrice >= minOrderForFreeDelivery && (
                  <div className="text-sm text-green-600 text-right -mt-3 mb-3">🎉 Free delivery applied!</div>
                )}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-primary">{formatPrice(totalWithDelivery)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
                    Object.keys(stockErrors).length > 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-primary text-white hover:opacity-90'
                  }`}
                  disabled={Object.keys(stockErrors).length > 0}
                >
                  {Object.keys(stockErrors).length > 0 ? 'Fix Stock Issues' : `Proceed to Checkout (${totalQuantity} items)`}
                </button>
                <Link href="/products" className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors mt-3">Continue Shopping</Link>
                <button onClick={handleClearCart} className="w-full mt-3 text-red-500 hover:text-red-700 text-sm font-semibold">Clear Cart</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Flavor Selection Modal - Fixed */}
      <AnimatePresence>
        {isFlavorModalOpen && selectedProductId && tempFlavorSelection && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsFlavorModalOpen(false)} className="fixed inset-0 bg-black z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] flex flex-col shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5 text-primary" /> Select Varients</h2>
                  <button onClick={() => setIsFlavorModalOpen(false)} className="hover:bg-gray-100 p-1.5 rounded-full"><X className="w-6 h-6" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select Varients for <strong>{productDetails[selectedProductId]?.name}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Quantity: <span className="font-bold text-primary">{getTotalFlavorQuantityTemp()}</span>
                  </p>

                  <div className="space-y-2">
                    {tempFlavorSelection.selectedFlavors.map((flavor, idx) => {
                      const isSelected = flavor.quantity > 0;
                      
                      return (
                        <div key={`flavor_${selectedProductId}_${idx}`} className="border rounded-xl p-3 hover:border-primary/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleFlavorSelection(flavor.flavorName)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 hover:border-primary'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </button>
                              <span className="font-medium">{flavor.flavorName}</span>
                            </div>
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateFlavorQuantityInTemp(flavor.flavorName, flavor.quantity - 1)}
                                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-8 text-center font-semibold text-sm">{flavor.quantity}</span>
                                <button
                                  onClick={() => updateFlavorQuantityInTemp(flavor.flavorName, flavor.quantity + 1)}
                                  className="p-1 bg-gray-100 hover:bg-gray-200 rounded"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {getTotalFlavorQuantityTemp() > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Selected Flavors:</p>
                      {tempFlavorSelection.selectedFlavors.filter(f => f.quantity > 0).map((f, idx) => (
                        <div key={`summary_${idx}`} className="flex justify-between text-sm text-gray-600 py-1">
                          <span>{f.flavorName}</span>
                          <span>× {f.quantity}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-primary">
                        <span>Total</span>
                        <span>{getTotalFlavorQuantityTemp()} items</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t flex gap-3">
                  <button onClick={() => setIsFlavorModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
                  <button
                    onClick={confirmFlavorSelection}
                    disabled={isSaving}
                    className={`flex-1 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                      isSaving
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white hover:opacity-90'
                    }`}
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Save Varients
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="bg-secondary py-8 px-4 mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; 2026 M&M Scents. All rights reserved.</p>
      </footer>
    </div>
  );
}