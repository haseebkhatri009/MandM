// 'use client';

// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { motion } from 'framer-motion';
// import { CheckCircle, ArrowRight } from 'lucide-react';
// import Navbar from '@/components/Navbar';

// export default function OrderSuccessContent() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get('orderId') || 'N/A';

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <section className="py-20 px-4">
//         <div className="max-w-2xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5 }}
//             className="text-center"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
//               className="flex justify-center mb-6"
//             >
//               <CheckCircle className="w-24 h-24 text-primary" />
//             </motion.div>

//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
//             >
//               Order Placed Successfully!
//             </motion.h1>

//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto"
//             >
//               Thank you for your order! We&apos;ll contact you soon on WhatsApp to confirm delivery and payment details.
//             </motion.p>

//             {/* Order ID */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="bg-card rounded-lg p-6 mb-8 border border-border shadow-lg"
//             >
//               <p className="text-muted-foreground mb-2">Your Order ID</p>
//               <p className="text-2xl font-bold text-primary font-mono break-all">
//                 {orderId}
//               </p>
//               <p className="text-sm text-muted-foreground mt-4">
//                 Keep this ID for reference
//               </p>
//             </motion.div>

//             {/* What's Next */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               className="bg-secondary rounded-lg p-6 mb-8 text-left"
//             >
//               <h2 className="text-xl font-semibold text-foreground mb-4">What&apos;s Next?</h2>
//               <ul className="space-y-3">
//                 <li className="flex gap-3">
//                   <span className="text-primary font-bold flex-shrink-0">1.</span>
//                   <span className="text-muted-foreground">
//                     Our team will contact you within 24 hours on WhatsApp
//                   </span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="text-primary font-bold flex-shrink-0">2.</span>
//                   <span className="text-muted-foreground">
//                     We&apos;ll confirm your delivery address and payment method
//                   </span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="text-primary font-bold flex-shrink-0">3.</span>
//                   <span className="text-muted-foreground">
//                     Your products will be delivered to your location
//                   </span>
//                 </li>
//                 <li className="flex gap-3">
//                   <span className="text-primary font-bold flex-shrink-0">4.</span>
//                   <span className="text-muted-foreground">
//                     Pay the delivery executive on delivery (Cash on Delivery)
//                   </span>
//                 </li>
//               </ul>
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.7 }}
//               className="flex flex-col sm:flex-row gap-4 justify-center"
//             >
//               <Link
//                 href="/"
//                 className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Back to Home
//               </Link>
//               <Link
//                 href="/products"
//                 className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
//               >
//                 Continue Shopping
//                 <ArrowRight size={18} />
//               </Link>
//             </motion.div>
//           </motion.div>
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


//without logged in scene

// app/order-success/OrderSuccessContent.tsx

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { rtdb } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export default function OrderSuccessContent() {
  // ✅ HOOKS - SAB SE PEHLE
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadAttempted, setReloadAttempted] = useState(false);

  // ✅ Helper functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getFinalPrice = (item: any) => {
    const price = item.price || 0;
    const discount = item.discount || 0;
    if (discount > 0 && discount < price) {
      return price - discount;
    }
    return price;
  };

  const getItemQuantity = (item: any) => {
    if (item.isFlavorProduct && item.selectedFlavors && item.selectedFlavors.length > 0) {
      return item.selectedFlavors.reduce((sum: number, f: any) => sum + f.quantity, 0);
    }
    return item.quantity || 1;
  };

  const getItemDisplayName = (item: any) => {
    if (item.isFlavorProduct && item.selectedFlavors && item.selectedFlavors.length > 0) {
      const flavorNames = item.selectedFlavors.map((f: any) => f.flavorName).join(', ');
      return `${item.name} (${flavorNames})`;
    }
    return item.name;
  };

  const getItemTotal = (item: any) => {
    const qty = getItemQuantity(item);
    const finalPrice = getFinalPrice(item);
    return finalPrice * qty;
  };

  // ✅ useEffect - ORDER FETCH
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Order ID not found');
        setLoading(false);
        return;
      }

      try {
        const orderRef = ref(rtdb, `orders/${orderId}`);
        const snapshot = await get(orderRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.items) {
            data.items = data.items.map((item: any) => ({
              ...item,
              selectedFlavors: item.selectedFlavors || [],
              isFlavorProduct: item.isFlavorProduct || false,
              discount: item.discount || 0,
            }));
          }
          setOrder(data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // ✅ 🔥 AUTO-RELOAD ON ERROR (Sirf 1 baar)
  useEffect(() => {
    if (error && !reloadAttempted) {
      setReloadAttempted(true);
      console.log('🔄 Error detected, reloading page...');
      
      // ✅ 1.5 second baad page reload
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [error, reloadAttempted]);

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE - Auto-reload ho raha hai, but agar nahi ho toh
  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🔄</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Reloading...</h1>
            <p className="text-muted-foreground mb-6">Page is refreshing to fix the issue.</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ MAIN RENDER
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle className="w-24 h-24 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
            >
              Order Placed Successfully! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto"
            >
              Thank you for your order! We'll contact you soon on WhatsApp to confirm delivery and payment details.
            </motion.p>

            {/* Order ID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-lg p-6 mb-8 border border-border shadow-lg"
            >
              <p className="text-muted-foreground mb-2">Your Order ID</p>
              <p className="text-2xl font-bold text-primary font-mono break-all">
                {order.id || 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Keep this ID for reference
              </p>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-card rounded-lg p-6 mb-8 border border-border shadow-lg text-left"
            >
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Summary
              </h2>
              <div className="space-y-3 text-sm">
                {order.items?.map((item: any, idx: number) => {
                  const qty = getItemQuantity(item);
                  const finalPrice = getFinalPrice(item);
                  const itemTotal = getItemTotal(item);
                  const hasDiscount = item.discount && item.discount > 0 && item.discount < item.price;
                  
                  return (
                    <div key={idx} className="py-2 border-b border-border/50 last:border-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{getItemDisplayName(item)}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold text-primary">
                              {formatPrice(finalPrice)}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(item.price)}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">× {qty}</span>
                          </div>
                          {item.selectedFlavors && item.selectedFlavors.length > 0 && (
                            <div className="text-xs text-green-600 mt-0.5">
                              Flavors: {item.selectedFlavors.map((f: any) => 
                                `${f.flavorName} (×${f.quantity})`
                              ).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatPrice(itemTotal)}
                          </p>
                          {hasDiscount && (
                            <p className="text-xs text-green-600">
                              Saved {formatPrice((item.price - finalPrice) * qty)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span className="text-foreground">
                    {order.deliveryCharge > 0 ? formatPrice(order.deliveryCharge) : 'Free ✅'}
                  </span>
                </div>
                {order.deliveryCharge === 0 && order.subtotal > 0 && (
                  <div className="text-xs text-green-600 text-right -mt-1">
                    🎉 Free delivery applied!
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.total || 0)}</span>
                </div>
              </div>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-secondary rounded-lg p-6 mb-8 text-left"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">What's Next?</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">1.</span>
                  <span className="text-muted-foreground">
                    Our team will contact you within 24 hours on WhatsApp
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">2.</span>
                  <span className="text-muted-foreground">
                    We'll confirm your delivery address and payment method
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">3.</span>
                  <span className="text-muted-foreground">
                    Your products will be delivered to your location
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">4.</span>
                  <span className="text-muted-foreground">
                    Pay the delivery executive on delivery (Cash on Delivery)
                  </span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Home
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-foreground rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Continue Shopping
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2026 M&M Scents. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}