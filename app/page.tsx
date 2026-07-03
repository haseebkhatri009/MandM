// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg'
//   });
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();
//   const { user } = useAuth();

//   useEffect(() => {
//     try {
//       // Fetch banner data from Firebase Realtime Database
//       const bannerRef = ref(rtdb, 'admin_settings/banner');
//       const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
//         if (snapshot.exists()) {
//           setBanner(snapshot.val() as BannerData);
//         }
//       });

//       // Fetch products from Firebase Realtime Database
//       const productsRef = ref(rtdb, 'products');
//       const unsubscribeProducts = onValue(productsRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const productsData: Product[] = [];
//           const data = snapshot.val();
          
//           Object.keys(data).forEach((key) => {
//             productsData.push({
//               id: key,
//               ...data[key]
//             } as Product);
//           });
          
//           setProducts(productsData);
//         }
//         setLoading(false);
//       });

//       // Cleanup listeners
//       return () => {
//         unsubscribeBanner();
//         unsubscribeProducts();
//       };
//     } catch (error) {
//       console.log('[v0] Error fetching data:', error);
//       setLoading(false);
//     }
//   }, []);

//   const handleAddToCart = (product: Product) => {
//     if (!user) {
//       // Redirect to login
//       window.location.href = '/login';
//       return;
//     }

//     const cartItem: CartItem = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       discount: product.discount,
//       image: product.image,
//       quantity: 1,
//       category: product.category
//     };

//     addToCart(cartItem);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       {/* Hero Banner */}
//       <section className="relative w-full h-screen max-h-[600px] overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20">
//         <motion.div
//           initial={{ scale: 1.1, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 0.8 }}
//           className="absolute inset-0 bg-cover bg-center brightness-8 5"
//           style={{
//             backgroundImage: `url('${banner.backgroundImage}')`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center'
//           }}
//         />
        
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-white/10" />

//         {/* Content */}
//         <div className="relative h-full flex items-center justify-center px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             className="text-center text-white max-w-2xl"
//           >
//             <motion.h1
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.3 }}
//               className="text-4xl md:text-6xl font-serif font-bold mb-4 text-balance"
//             >
//               {banner.heading}
//             </motion.h1>
            
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//               className="text-lg md:text-xl mb-8 text-gray-100 text-balance"
//             >
//               {banner.subheading}
//             </motion.p>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.5 }}
//             >
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 {banner.buttonText}
//                 <ArrowRight size={20} />
//               </Link>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-16 px-4">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-12"
//           >
//             <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
//               Featured Products
//             </h2>
//             <p className="text-muted-foreground max-w-lg mx-auto">
//               Discover our curated collection of premium beauty products
//             </p>
//           </motion.div>

//           {loading ? (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground">Loading products...</p>
//             </div>
//           ) : products.length > 0 ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ duration: 0.6 }}
//               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//             >
//               {products.slice(0, 8).map((product, index) => (
//                 <motion.div
//                   key={product.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group"
//                 >
//                   {/* Product Image */}
//                   <div className="relative h-48 bg-secondary overflow-hidden">
//                     <motion.img
//                       whileHover={{ scale: 1.05 }}
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e8e3dc" width="200" height="200"/%3E%3C/svg%3E';
//                       }}
//                     />
//                     {product.discount && (
//                       <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
//                         -{Math.round((product.discount / product.price) * 100)}%
//                       </div>
//                     )}
//                   </div>

//                   {/* Product Info */}
//                   <div className="p-4">
//                     <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
//                       {product.category}
//                     </p>
//                     <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
//                       {product.name}
//                     </h3>
                    
//                     {/* Price */}
//                     <div className="flex items-center gap-2 mb-4">
//                       <span className="text-lg font-bold text-primary">
//                         ₹{Math.round(product.price - (product.discount || 0))}
//                       </span>
//                       {product.discount && (
//                         <span className="text-sm text-muted-foreground line-through">
//                           ₹{product.price}
//                         </span>
//                       )}
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => handleAddToCart(product)}
//                         className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//                       >
//                         Add to Cart
//                       </button>
//                       <Link
//                         href={`/product/${product.id}`}
//                         className="flex-1 bg-secondary text-foreground py-2 rounded-lg font-semibold hover:bg-muted transition-colors text-center"
//                       >
//                         View
//                       </Link>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           ) : (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground mb-4">No products available yet</p>
//               <p className="text-sm text-muted-foreground">Admin needs to add products first</p>
//             </div>
//           )}

//           {/* View All Button */}
//           {products.length > 0 && (
//             <div className="text-center mt-12">
//               <Link
//                 href="/products"
//                 className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
//               >
//                 View All Products
//                 <ArrowRight size={20} />
//               </Link>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-secondary py-8 px-4">
//         <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//           <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//         </div>
//       </footer>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg'
//   });
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();
//   const { user } = useAuth();

//   useEffect(() => {
//     try {
//       // Fetch banner data from Firebase Realtime Database
//       const bannerRef = ref(rtdb, 'admin_settings/banner');
//       const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
//         if (snapshot.exists()) {
//           setBanner(snapshot.val() as BannerData);
//         }
//       });

//       // Fetch products from Firebase Realtime Database
//       const productsRef = ref(rtdb, 'products');
//       const unsubscribeProducts = onValue(productsRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const productsData: Product[] = [];
//           const data = snapshot.val();
          
//           Object.keys(data).forEach((key) => {
//             productsData.push({
//               id: key,
//               ...data[key]
//             } as Product);
//           });
          
//           setProducts(productsData);
//         }
//         setLoading(false);
//       });

//       // Cleanup listeners
//       return () => {
//         unsubscribeBanner();
//         unsubscribeProducts();
//       };
//     } catch (error) {
//       console.log('[v0] Error fetching data:', error);
//       setLoading(false);
//     }
//   }, []);

//   const handleAddToCart = (product: Product) => {
//     if (!user) {
//       // Redirect to login
//       window.location.href = '/login';
//       return;
//     }

//     const cartItem: CartItem = {
//       id: product.id,
//       name: product.name,
//       price: product.price,
//       discount: product.discount,
//       image: product.image,
//       quantity: 1,
//       category: product.category
//     };

//     addToCart(cartItem);
//   };

//   return (
//     <div className="min-h-screen bg-background relative">
//       <Navbar />

//       {/* Watermark - Same as other pages */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.08] z-15 flex items-center justify-center"
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
//           src="https://i.ibb.co/7NLfzpHj/LOGO-removebg-preview.png"
//           alt="M&M Watermark"
//           className="w-96 h-96 object-contain"
//         />
//       </motion.div>

//       {/* Main Content - Positioned above watermark */}
//       <div className="relative ">
//         {/* Hero Banner */}
//         <section className="relative w-full h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20 z-15">
//           <motion.div
//             initial={{ scale: 1.1, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="absolute inset-0 bg-cover bg-center brightness-50"
//             style={{
//               backgroundImage: `url('${banner.backgroundImage}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center 40%'
//             }}
//           />
          
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-black/60" />

//           {/* Content */}
//           <div className="relative h-full flex items-center justify-center px-4">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="text-center text-white max-w-2xl"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 className="text-4xl md:text-6xl font-serif font-bold mb-4 text-balance"
//               >
//                 {banner.heading}
//               </motion.h1>
              
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}
//                 className="text-lg md:text-xl mb-8 text-gray-100 text-balance"
//               >
//                 {banner.subheading}
//               </motion.p>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.5 }}
//               >
//                 <Link
//                   href="/products"
//                   className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//                 >
//                   {banner.buttonText}
//                   <ArrowRight size={20} />
//                 </Link>
//               </motion.div>
//             </motion.div>
//           </div>
//         </section>

//         {/* Featured Products */}
//         <section className="py-16 px-4 relative bg-white">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-12"
//             >
//               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
//                 Featured Products
//               </h2>
//               <p className="text-muted-foreground max-w-lg mx-auto">
//                 Discover our curated collection of premium beauty products
//               </p>
//             </motion.div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-muted-foreground">Loading products...</p>
//               </div>
//             ) : products.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//               >
//                 {products.slice(0, 8).map((product, index) => (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     className="bg-card/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-border/50"
//                   >
//                     {/* Product Image */}
//                     <div className="relative h-48 bg-secondary/50 overflow-hidden">
//                       <motion.img
//                         whileHover={{ scale: 1.05 }}
//                         src={product.image}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e8e3dc" width="200" height="200"/%3E%3C/svg%3E';
//                         }}
//                       />
//                       {product.discount && (
//                         <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
//                           -{Math.round((product.discount / product.price) * 100)}%
//                         </div>
//                       )}
//                     </div>

//                     {/* Product Info */}
//                     <div className="p-4">
//                       <p className="text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                         {product.category}
//                       </p>
//                       <h3 className="font-serif font-semibold text-foreground mb-2 line-clamp-2">
//                         {product.name}
//                       </h3>
                      
//                       {/* Price */}
//                       <div className="flex items-center gap-2 mb-4">
//                         <span className="text-lg font-bold text-primary">
//                           ₹{Math.round(product.price - (product.discount || 0))}
//                         </span>
//                         {product.discount && (
//                           <span className="text-sm text-muted-foreground line-through">
//                             ₹{product.price}
//                           </span>
//                         )}
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleAddToCart(product)}
//                           className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
//                         >
//                           Add to Cart
//                         </button>
//                         <Link
//                           href={`/product/${product.id}`}
//                           className="flex-1 bg-secondary/80 backdrop-blur-sm text-foreground py-2 rounded-lg font-semibold hover:bg-muted transition-colors text-center border border-border"
//                         >
//                           View
//                         </Link>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-card/90 backdrop-blur-sm rounded-lg border border-border">
//                 <p className="text-muted-foreground mb-4">No products available yet</p>
//                 <p className="text-sm text-muted-foreground">Admin needs to add products first</p>
//               </div>
//             )}

//             {/* View All Button */}
//             {products.length > 0 && (
//               <div className="text-center mt-12">
//                 <Link
//                   href="/products"
//                   className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all"
//                 >
//                   View All Products
//                   <ArrowRight size={20} />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//   <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
//     <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//   </div>
// </footer>
//       </div>
//     </div>
//   );
// }





'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Navbar from '@/components/Navbar';
import { CartItem, useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
}

interface BannerData {
  heading: string;
  subheading: string;
  buttonText: string;
  backgroundImage: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<BannerData>({
    heading: 'M&M Scents Collection',
    subheading: 'Premium Perfumes, Wax & Skincare',
    buttonText: 'Shop Now',
    backgroundImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg'
  });
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
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

  // Check if product has valid discount - ONLY if discount > 0
  const hasValidDiscount = (product: Product) => {
    // Strictly check: discount must exist, be greater than 0, and less than price
    return product.discount !== undefined && 
           product.discount !== null && 
           product.discount > 0 && 
           product.discount < product.price;
  };

  // Calculate discount percentage
  const getDiscountPercentage = (product: Product) => {
    if (!hasValidDiscount(product)) return 0;
    return Math.round((product.discount! / product.price) * 100);
  };

  // Get final price after discount
  const getFinalPrice = (product: Product) => {
    if (hasValidDiscount(product)) {
      return product.price - product.discount!;
    }
    return product.price;
  };

  useEffect(() => {
    try {
      // Fetch banner data from Firebase Realtime Database
      const bannerRef = ref(rtdb, 'admin_settings/banner');
      const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
        if (snapshot.exists()) {
          setBanner(snapshot.val() as BannerData);
        }
      });

      // Fetch products from Firebase Realtime Database
      const productsRef = ref(rtdb, 'products');
      const unsubscribeProducts = onValue(productsRef, (snapshot) => {
        if (snapshot.exists()) {
          const productsData: Product[] = [];
          const data = snapshot.val();
          
          Object.keys(data).forEach((key) => {
            productsData.push({
              id: key,
              ...data[key]
            } as Product);
          });
          
          setProducts(productsData);
        }
        setLoading(false);
      });

      // Cleanup listeners
      return () => {
        unsubscribeBanner();
        unsubscribeProducts();
      };
    } catch (error) {
      console.log('[v0] Error fetching data:', error);
      setLoading(false);
    }
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      image: product.image,
      quantity: 1,
      category: product.category
    };

    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {/* Watermark - Same as other pages */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.08] z-15 flex items-center justify-center"
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
          src="https://i.ibb.co/7NLfzpHj/LOGO-removebg-preview.png"
          alt="M&M Watermark"
          className="w-96 h-96 object-contain"
        />
      </motion.div>

      {/* Main Content - Positioned above watermark */}
      <div className="relative">
        {/* Hero Banner */}
        <section className="relative w-full h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20 z-15">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center brightness-50"
            style={{
              backgroundImage: `url('${banner.backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%'
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Content */}
          <div className="relative h-full flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center text-white max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-6xl font-serif font-bold mb-4 text-balance"
              >
                {banner.heading}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg md:text-xl mb-8 text-gray-100 text-balance"
              >
                {banner.subheading}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  {banner.buttonText}
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 px-4 relative bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Discover our curated collection of premium beauty products
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {products.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-200"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e8e3dc" width="200" height="200"/%3E%3C/svg%3E';
                        }}
                      />
                      {/* Discount Badge - Only show if discount > 0 */}
                      {hasValidDiscount(product) && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          -{getDiscountPercentage(product)}%
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-primary mb-1 uppercase tracking-widest font-bold">
                        {product.category}
                      </p>
                      <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Price - Only show discount if discount > 0 */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(getFinalPrice(product))}
                        </span>
                        {hasValidDiscount(product) && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                          Add to Cart
                        </button>
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">No products available yet</p>
                <p className="text-sm text-gray-500">Admin needs to add products first</p>
              </div>
            )}

            {/* View All Button */}
            {products.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  View All Products
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
            <p>&copy; 2024 M&M Scents. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}