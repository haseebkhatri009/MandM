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






'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingCart, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useCart } from '@/lib/cartContext';
import { rtdb } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [deliveryCharges, setDeliveryCharges] = useState<number>(0);
  const [loadingDelivery, setLoadingDelivery] = useState(true);
  const [stockErrors, setStockErrors] = useState<{ [key: string]: string }>({});
  const [productStocks, setProductStocks] = useState<{ [key: string]: number }>({});

  // Format price in PKR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Check if product has valid discount
  const hasValidDiscount = (item: any) => {
    return item.discount !== undefined && 
           item.discount !== null && 
           item.discount > 0 && 
           item.discount < item.price;
  };

  // Get final price
  const getFinalPrice = (item: any) => {
    if (hasValidDiscount(item)) {
      return item.price - item.discount;
    }
    return item.price;
  };

  // Fetch delivery charges from Firebase
  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        const bannerRef = ref(rtdb, 'admin_settings/banner');
        const snapshot = await get(bannerRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.deliveryCharges !== undefined && data.deliveryCharges !== null) {
            setDeliveryCharges(data.deliveryCharges);
          }
        }
      } catch (error) {
        console.error('Error fetching delivery charges:', error);
      } finally {
        setLoadingDelivery(false);
      }
    };

    fetchDeliveryCharges();
  }, []);

  // Fetch stock for all cart items - ONLY for checking availability, NOT cutting stock
  useEffect(() => {
    const fetchStocks = async () => {
      const stocks: { [key: string]: number } = {};
      const errors: { [key: string]: string } = {};

      for (const item of cartItems) {
        try {
          const productRef = ref(rtdb, `products/${item.id}`);
          const snapshot = await get(productRef);
          if (snapshot.exists()) {
            const product = snapshot.val();
            const availableStock = product.stock || 0;
            stocks[item.id] = availableStock;
            
            if (item.quantity > availableStock) {
              errors[item.id] = `Only ${availableStock} items available`;
            }
          } else {
            errors[item.id] = 'Product not found';
          }
        } catch (error) {
          console.error('Error checking stock:', error);
        }
      }

      setProductStocks(stocks);
      setStockErrors(errors);
    };

    if (cartItems.length > 0) {
      fetchStocks();
    } else {
      setProductStocks({});
      setStockErrors({});
    }
  }, [cartItems]);

  const totalPrice = getTotalPrice();
  const totalWithDelivery = totalPrice + (deliveryCharges || 0);

  // Handle quantity update with stock check
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const availableStock = productStocks[itemId] || 0;
    
    if (newQuantity > availableStock) {
      setStockErrors(prev => ({
        ...prev,
        [itemId]: `Only ${availableStock} items available`
      }));
      return;
    } else {
      setStockErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });
    }

    // Just update cart quantity - NO stock change
    updateQuantity(itemId, newQuantity);
  };

  // Handle remove from cart - NO stock restore (stock was never cut)
  const handleRemoveFromCart = (itemId: string) => {
    removeFromCart(itemId);
  };

  // Handle clear cart - NO stock restore (stock was never cut)
  const handleClearCart = () => {
    if (!confirm('Are you sure you want to clear your cart?')) return;
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Start shopping and add some beautiful products to your cart
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
            >
              <ArrowLeft size={18} />
              Back to shopping
            </Link>
            <h1 className="text-4xl font-serif font-bold text-foreground">
              Shopping Cart
            </h1>
            <p className="text-muted-foreground mt-1">
              {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-lg shadow-lg overflow-hidden">
                {cartItems.map((item, index) => {
                  const finalPrice = getFinalPrice(item);
                  const hasDiscount = hasValidDiscount(item);
                  const stockError = stockErrors[item.id];
                  const availableStock = productStocks[item.id] || 0;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-6 border-b border-border last:border-b-0 flex gap-4"
                    >
                      {/* Product Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg bg-secondary"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e8e3dc" width="96" height="96"/%3E%3C/svg%3E';
                        }}
                      />

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2 uppercase">
                          {item.category}
                        </p>

                        {/* Price - PKR format */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-primary">
                            {formatPrice(finalPrice)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.price)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls with Stock Limit */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} className="text-foreground" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= availableStock}
                            className="p-1 bg-secondary hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus size={16} className="text-foreground" />
                          </button>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Max: {availableStock})
                          </span>
                        </div>

                        {/* Stock Error Message */}
                        {stockError && (
                          <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                            <AlertCircle size={14} />
                            <span>{stockError}</span>
                          </div>
                        )}
                      </div>

                      {/* Total Price & Remove */}
                      <div className="text-right flex flex-col justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                          <p className="text-lg font-bold text-foreground">
                            {formatPrice(finalPrice * item.quantity)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-lg shadow-lg p-6 border border-border sticky top-24">
                <h2 className="text-xl font-serif font-bold text-foreground mb-4">
                  Order Summary
                </h2>

                {/* Subtotal */}
                <div className="flex justify-between mb-3 pb-3 border-b border-border">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Delivery Charges - From Firebase */}
                <div className="flex justify-between mb-4 pb-4 border-b border-border">
                  <span className="text-muted-foreground">Delivery Charges</span>
                  <span className="font-semibold text-foreground">
                    {loadingDelivery ? '...' : formatPrice(deliveryCharges || 0)}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(totalWithDelivery)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className={`block w-full py-3 rounded-lg font-semibold text-center transition-opacity ${
                    Object.keys(stockErrors).length > 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-primary text-white hover:opacity-90'
                  }`}
                  onClick={(e) => {
                    if (Object.keys(stockErrors).length > 0) {
                      e.preventDefault();
                      alert('Please fix stock issues before proceeding to checkout.');
                    }
                  }}
                >
                  {Object.keys(stockErrors).length > 0 ? 'Fix Stock Issues' : 'Proceed to Checkout'}
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="block w-full bg-secondary text-foreground py-3 rounded-lg font-semibold text-center hover:bg-muted transition-colors mt-3"
                >
                  Continue Shopping
                </Link>

                {/* Clear Cart */}
                <button
                  onClick={handleClearCart}
                  className="w-full mt-3 text-red-500 hover:text-red-700 transition-colors text-sm font-semibold"
                >
                  Clear Cart
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2024 M&M Scents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}