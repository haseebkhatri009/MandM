// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowLeft, ShoppingCart, Minus, Plus, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
// import Navbar from '@/components/Navbar';
// import { rtdb } from '@/lib/firebase';
// import { ref, get } from 'firebase/database';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';

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
// }

// export default function ProductDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const productId = params.id as string;
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);
//   const [addedToCart, setAddedToCart] = useState(false);
//   const [mainImageIndex, setMainImageIndex] = useState(0);
//   const { addToCart } = useCart();
//   const { user } = useAuth();

//   const allImages = product ? [product.image, ...(product.additionalImages || [])] : [];

//   // Fetch product from RTDB
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const productRef = ref(rtdb, `products/${productId}`);
//         const snapshot = await get(productRef);
        
//         if (snapshot.exists()) {
//           setProduct({ id: productId, ...snapshot.val() } as Product);
//         } else {
//           router.push('/products');
//         }
//       } catch (error) {
//         console.error('Error fetching product:', error);
//         router.push('/products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (productId) {
//       fetchProduct();
//     }
//   }, [productId, router]);

//   const handleAddToCart = () => {
//     if (product && quantity > 0) {
//       const cartItem: CartItem = {
//         id: product.id,
//         name: product.name,
//         price: product.price - (product.discount || 0),
//         quantity: quantity,
//         image: product.image
//       };
//       addToCart(cartItem);
//       setAddedToCart(true);
//       setTimeout(() => setAddedToCart(false), 2000);
//     }
//   };

//   const isOutOfStock = product && (product.stock === undefined || product.stock === 0);
//   const canAddToCart = product && quantity > 0 && !isOutOfStock && quantity <= (product.stock || 1);
//   const stockStatus = product?.stock || 0;

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
//         <Navbar />
//         <div className="flex items-center justify-center h-96">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//             className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
//           />
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30 relative overflow-hidden">
//       {/* Animated Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-8 z-0"
//         animate={{
//           scale: [1, 1.05, 1],
//           rotate: [0, 5, 0]
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       >
//         <img
//           src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
//           alt="Watermark"
//           className="w-96 h-96 object-contain mx-auto mt-20"
//         />
//       </motion.div>

//       <Navbar />

//       {/* Breadcrumb */}
//       <motion.div
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-7xl mx-auto px-4 py-6 relative z-10"
//       >
//         <Link href="/products" className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-semibold">
//           <ArrowLeft size={18} />
//           Back to Products
//         </Link>
//       </motion.div>

//       {/* Main Content */}
//       <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
//         >
//           {/* Image Gallery */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="flex flex-col gap-4"
//           >
//             {/* Main Image */}
//             <div className="relative aspect-square bg-secondary rounded-lg overflow-hidden border-2 border-border shadow-lg group">
//               <motion.img
//                 key={mainImageIndex}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3 }}
//                 src={allImages[mainImageIndex]}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e8e3dc" width="400" height="400"/%3E%3C/svg%3E';
//                 }}
//               />

//               {/* Stock Badge */}
//               {isOutOfStock ? (
//                 <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
//                   Out of Stock
//                 </div>
//               ) : stockStatus < 5 ? (
//                 <div className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
//                   Only {stockStatus} left
//                 </div>
//               ) : (
//                 <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
//                   In Stock
//                 </div>
//               )}

//               {/* Discount Badge */}
//               {product.discount && (
//                 <motion.div
//                   initial={{ scale: 0, rotate: -180 }}
//                   animate={{ scale: 1, rotate: 0 }}
//                   transition={{ delay: 0.2, type: "spring" }}
//                   className="absolute bottom-4 left-4 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
//                 >
//                   Save ₹{Math.round(product.discount)}
//                 </motion.div>
//               )}

//               {/* Navigation Arrows - Show only if multiple images */}
//               {allImages.length > 1 && (
//                 <>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setMainImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20"
//                   >
//                     <ChevronLeft size={24} />
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setMainImageIndex((prev) => (prev + 1) % allImages.length)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20"
//                   >
//                     <ChevronRight size={24} />
//                   </motion.button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnail Images - Show only if multiple images */}
//             {allImages.length > 1 && (
//               <div className="flex gap-3 overflow-x-auto pb-2">
//                 {allImages.map((img, idx) => (
//                   <motion.button
//                     key={idx}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => setMainImageIndex(idx)}
//                     className={`relative w-20 h-20 rounded-lg overflow-hidden border-3 flex-shrink-0 transition-all ${
//                       mainImageIndex === idx ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-border hover:border-primary'
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt={`${product.name} view ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
//                       }}
//                     />
//                     {mainImageIndex === idx && (
//                       <motion.div
//                         layoutId="active-indicator"
//                         className="absolute inset-0 border-2 border-primary rounded-lg"
//                       />
//                     )}
//                   </motion.button>
//                 ))}
//               </div>
//             )}
//           </motion.div>

//           {/* Product Info */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="flex flex-col gap-6"
//           >
//             {/* Category & Title */}
//             <div>
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//                 className="text-sm uppercase tracking-widest font-bold text-primary mb-2"
//               >
//                 {product.category}
//               </motion.p>
//               <motion.h1
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.35 }}
//                 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight text-balance"
//               >
//                 {product.name}
//               </motion.h1>
//             </div>

//             {/* Description */}
//             {product.description && (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.4 }}
//                 className="text-base text-muted-foreground leading-relaxed"
//               >
//                 {product.description}
//               </motion.p>
//             )}

//             {/* Price */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.45 }}
//               className="flex items-baseline gap-4"
//             >
//               <span className="text-4xl md:text-5xl font-bold text-primary">
//                 ₹{Math.round(product.price - (product.discount || 0))}
//               </span>
//               {product.discount && (
//                 <span className="text-xl text-muted-foreground line-through">
//                   ₹{product.price}
//                 </span>
//               )}
//             </motion.div>

//             {/* Divider */}
//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//               className="h-1 bg-gradient-to-r from-primary to-accent w-16 origin-left"
//             />

//             {/* Quantity Selector */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.55 }}
//               className="flex flex-col gap-3"
//             >
//               <label className="font-semibold text-foreground">Quantity:</label>
//               <div className="flex items-center gap-4">
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                   disabled={isOutOfStock}
//                   className="bg-secondary hover:bg-muted disabled:opacity-50 text-foreground p-3 rounded-lg transition-all"
//                 >
//                   <Minus size={20} />
//                 </motion.button>
                
//                 <motion.div
//                   key={quantity}
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className="bg-card border-2 border-border px-6 py-3 rounded-lg font-bold text-xl text-foreground min-w-20 text-center"
//                 >
//                   {quantity}
//                 </motion.div>

//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => {
//                     if (quantity < (product.stock || 1)) {
//                       setQuantity(quantity + 1);
//                     }
//                   }}
//                   disabled={isOutOfStock || quantity >= (product.stock || 1)}
//                   className="bg-secondary hover:bg-muted disabled:opacity-50 text-foreground p-3 rounded-lg transition-all"
//                 >
//                   <Plus size={20} />
//                 </motion.button>
//               </div>

//               {!isOutOfStock && quantity > (product.stock || 0) && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="flex items-start gap-2 text-red-500 text-sm"
//                 >
//                   <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
//                   <span>Quantity exceeds available stock</span>
//                 </motion.div>
//               )}
//             </motion.div>

//             {/* Add to Cart Button */}
//             <motion.button
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//               whileHover={canAddToCart ? { scale: 1.05 } : {}}
//               whileTap={canAddToCart ? { scale: 0.95 } : {}}
//               onClick={handleAddToCart}
//               disabled={!canAddToCart}
//               className={`relative w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
//                 canAddToCart
//                   ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
//                   : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
//               }`}
//             >
//               {isOutOfStock ? (
//                 <>
//                   <AlertCircle size={20} />
//                   Out of Stock
//                 </>
//               ) : (
//                 <>
//                   <ShoppingCart size={20} />
//                   Add to Cart
//                 </>
//               )}
//             </motion.button>

//             {/* Success Message */}
//             <AnimatePresence>
//               {addedToCart && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="flex items-center gap-2 bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-lg font-semibold"
//                 >
//                   <CheckCircle size={20} />
//                   Added to cart successfully!
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Continue Shopping Link */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.65 }}
//             >
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-semibold group"
//               >
//                 Continue Shopping
//                 <motion.span
//                   group-hover={{ x: 5 }}
//                 >
//                   →
//                 </motion.span>
//               </Link>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </section>

//       {/* Footer */}
//       <motion.footer
//         initial={{ opacity: 0, y: 20 }}
//         whileInView={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         viewport={{ once: true }}
//         className="bg-gradient-to-t from-secondary to-background py-12 px-4 mt-16 border-t border-border relative z-10"
//       >
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//         </div>
//       </motion.footer>
//     </div>
//   );
// }












'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Minus, Plus, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { rtdb } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { CartItem, useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';

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
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const { addToCart, cartItems } = useCart(); // Changed: get cartItems directly
  const { user } = useAuth();

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
  const hasValidDiscount = (product: Product) => {
    return product.discount !== undefined && 
           product.discount !== null && 
           product.discount > 0 && 
           product.discount < product.price;
  };

  // Get final price
  const getFinalPrice = (product: Product) => {
    if (hasValidDiscount(product)) {
      return product.price - product.discount!;
    }
    return product.price;
  };

  const allImages = product ? [product.image, ...(product.additionalImages || [])] : [];

  // Fetch product from RTDB
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = ref(rtdb, `products/${productId}`);
        const snapshot = await get(productRef);
        
        if (snapshot.exists()) {
          setProduct({ id: productId, ...snapshot.val() } as Product);
        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, router]);

  // Check if product is in cart - Fixed: use cartItems from useCart
  useEffect(() => {
    if (product && user) {
      const exists = cartItems.some(item => item.id === product.id);
      setIsInCart(exists);
    }
  }, [product, user, cartItems]);

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        discount: product.discount,
        image: product.image,
        quantity: quantity,
        category: product.category
      };
      addToCart(cartItem);
      setAddedToCart(true);
      setIsInCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const isOutOfStock = product && (product.stock === undefined || product.stock === 0);
  const canAddToCart = product && quantity > 0 && !isOutOfStock && quantity <= (product.stock || 1) && !isInCart;
  const stockStatus = product?.stock || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30 relative overflow-hidden">
      {/* Animated Watermark */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-8 z-0"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
          alt="Watermark"
          className="w-96 h-96 object-contain mx-auto mt-20"
        />
      </motion.div>

      <Navbar />

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-6 relative z-10"
      >
        <Link href="/products" className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-semibold">
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </motion.div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {/* Image Gallery - Smaller image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {/* Main Image - Smaller aspect ratio */}
            <div className="relative aspect-[3/4] max-h-[500px] bg-secondary rounded-lg overflow-hidden border-2 border-border shadow-lg group">
              <motion.img
                key={mainImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                src={allImages[mainImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23e8e3dc" width="400" height="500"/%3E%3C/svg%3E';
                }}
              />

              {/* Stock Badge */}
              {isOutOfStock ? (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  Out of Stock
                </div>
              ) : stockStatus < 5 ? (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  Only {stockStatus} left
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                  In Stock
                </div>
              )}

              {/* Discount Badge - Only show if discount > 0 */}
              {hasValidDiscount(product) && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute bottom-4 left-4 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"
                >
                  Save {formatPrice(product.discount!)}
                </motion.div>
              )}

              {/* Navigation Arrows - Show only if multiple images */}
              {allImages.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMainImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMainImageIndex((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all z-20"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}
            </div>

            {/* Thumbnail Images - Show only if multiple images */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMainImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      mainImageIndex === idx ? 'border-primary ring-2 ring-primary shadow-lg' : 'border-border hover:border-primary'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
                      }}
                    />
                    {mainImageIndex === idx && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute inset-0 border-2 border-primary rounded-lg"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Category & Title */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm uppercase tracking-widest font-bold text-primary mb-2"
              >
                {product.category}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight text-balance"
              >
                {product.name}
              </motion.h1>
            </div>

            {/* Description */}
            {product.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base text-muted-foreground leading-relaxed"
              >
                {product.description}
              </motion.p>
            )}

            {/* Price - PKR format */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex items-baseline gap-4"
            >
              <span className="text-4xl md:text-5xl font-bold text-primary">
                {formatPrice(getFinalPrice(product))}
              </span>
              {hasValidDiscount(product) && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="h-1 bg-gradient-to-r from-primary to-accent w-16 origin-left"
            />

            {/* Quantity Selector - Hide if in cart or out of stock */}
            {!isInCart && !isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-col gap-3"
              >
                <label className="font-semibold text-foreground">Quantity:</label>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="bg-secondary hover:bg-muted disabled:opacity-50 text-foreground p-3 rounded-lg transition-all"
                  >
                    <Minus size={20} />
                  </motion.button>
                  
                  <motion.div
                    key={quantity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-card border-2 border-border px-6 py-3 rounded-lg font-bold text-xl text-foreground min-w-20 text-center"
                  >
                    {quantity}
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      if (quantity < (product.stock || 1)) {
                        setQuantity(quantity + 1);
                      }
                    }}
                    disabled={isOutOfStock || quantity >= (product.stock || 1)}
                    className="bg-secondary hover:bg-muted disabled:opacity-50 text-foreground p-3 rounded-lg transition-all"
                  >
                    <Plus size={20} />
                  </motion.button>
                </div>

                {!isOutOfStock && quantity > (product.stock || 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 text-red-500 text-sm"
                  >
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>Quantity exceeds available stock</span>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Add to Cart Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={canAddToCart ? { scale: 1.05 } : {}}
              whileTap={canAddToCart ? { scale: 0.95 } : {}}
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`relative w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isInCart
                  ? 'bg-green-500 text-white cursor-default'
                  : isOutOfStock
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg'
              }`}
            >
              {isInCart ? (
                <>
                  <CheckCircle size={20} />
                  Already in Cart
                </>
              ) : isOutOfStock ? (
                <>
                  <AlertCircle size={20} />
                  Out of Stock
                </>
              ) : (
                <>
                  <ShoppingCart size={20} />
                  Add to Cart
                </>
              )}
            </motion.button>

            {/* Success Message */}
            <AnimatePresence>
              {addedToCart && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 bg-green-500/10 border border-green-500 text-green-600 px-4 py-3 rounded-lg font-semibold"
                >
                  <CheckCircle size={20} />
                  Added to cart successfully!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Continue Shopping Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-semibold group"
              >
                Continue Shopping
                <motion.span
                  whileHover={{ x: 5 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-gradient-to-t from-secondary to-background py-12 px-4 mt-16 border-t border-border relative z-10"
      >
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2024 M&M Scents. All rights reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}