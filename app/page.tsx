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

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount - ONLY if discount > 0
//   const hasValidDiscount = (product: Product) => {
//     // Strictly check: discount must exist, be greater than 0, and less than price
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   // Calculate discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get final price after discount
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

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
//       <div className="relative">
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
//               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900">
//                 Featured Products
//               </h2>
//               <p className="text-gray-600 max-w-lg mx-auto">
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
//                 <p className="text-gray-600">Loading products...</p>
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
//                     className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-200"
//                   >
//                     {/* Product Image */}
//                     <div className="relative h-48 bg-gray-100 overflow-hidden">
//                       <motion.img
//                         whileHover={{ scale: 1.05 }}
//                         src={product.image}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23e8e3dc" width="200" height="200"/%3E%3C/svg%3E';
//                         }}
//                       />
//                       {/* Discount Badge - Only show if discount > 0 */}
//                       {hasValidDiscount(product) && (
//                         <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
//                           -{getDiscountPercentage(product)}%
//                         </div>
//                       )}
//                     </div>

//                     {/* Product Info */}
//                     <div className="p-4">
//                       <p className="text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                         {product.category}
//                       </p>
//                       <h3 className="font-serif font-semibold text-gray-900 mb-2 line-clamp-2">
//                         {product.name}
//                       </h3>
                      
//                       {/* Price - Only show discount if discount > 0 */}
//                       <div className="flex items-center gap-2 mb-4">
//                         <span className="text-lg font-bold text-primary">
//                           {formatPrice(getFinalPrice(product))}
//                         </span>
//                         {hasValidDiscount(product) && (
//                           <span className="text-sm text-gray-500 line-through">
//                             {formatPrice(product.price)}
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
//                           className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200"
//                         >
//                           View
//                         </Link>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
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
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
//             <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import toast, { Toaster } from 'react-hot-toast';

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
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();

//   // Check if product is in cart
//   const isProductInCart = (productId: string) => {
//     return cartItems.some(item => item.id === productId);
//   };

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount - ONLY if discount > 0
//   const hasValidDiscount = (product: Product) => {
//     // Strictly check: discount must exist, be greater than 0, and less than price
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   // Calculate discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get final price after discount
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

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
//       // Redirect to login with toast
//       toast.error('Please login first to add items to cart', {
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
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     // Check if product is already in cart
//     if (isProductInCart(product.id)) {
//       toast.error(`${product.name} is already in your cart!`, {
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

//     // Show success toast
//     toast.success(`${product.name} added to cart!`, {
//       duration: 3000,
//       position: 'top-right',
//       style: {
//         background: '#10B981',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🛒',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background relative">
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
//       <div className="relative">
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
//               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900">
//                 Featured Products
//               </h2>
//               <p className="text-gray-600 max-w-lg mx-auto">
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
//                 <p className="text-gray-600">Loading products...</p>
//               </div>
//             ) : products.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//               >
//                 {products.slice(0, 4).map((product, index) => {
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-200"
//                     >
//                       {/* Product Image - Now using aspect-square like products page */}
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         {/* Removed discount badge from image */}
//                       </div>

//                       {/* Product Info */}
//                       <div className="p-4">
//                         <p className="text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                           {product.category}
//                         </p>
//                         <div className="flex items-center flex-wrap gap-1.5 mb-2">
//                           <h3 className="font-serif font-semibold text-gray-900 line-clamp-2">
//                             {product.name}
//                           </h3>
//                           {/* Discount badge next to name */}
//                           {hasValidDiscount(product) && (
//                             <span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold align-middle whitespace-nowrap shadow-sm">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Price - Only show discount if discount > 0 */}
//                         <div className="flex items-center gap-2 mb-4">
//                           <span className="text-lg font-bold text-primary">
//                             {formatPrice(getFinalPrice(product))}
//                           </span>
//                           {hasValidDiscount(product) && (
//                             <span className="text-sm text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex gap-2">
//                           {inCart ? (
//                             <button
//                               disabled
//                               className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-sm cursor-default opacity-80"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               In Cart
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all cursor-pointer text-sm"
//                             >
//                               Add to Cart
//                             </button>
//                           )}
//                           <Link
//                             href={`/product/${product.id}`}
//                             className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-sm"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
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
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
//             <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

//isfeatured funtionality for 4 product display
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   isFeatured?: boolean;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg'
//   });
//   const [loading, setLoading] = useState(true);
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();

//   // Check if product is in cart
//   const isProductInCart = (productId: string) => {
//     return cartItems.some(item => item.id === productId);
//   };

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount - ONLY if discount > 0
//   const hasValidDiscount = (product: Product) => {
//     // Strictly check: discount must exist, be greater than 0, and less than price
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   // Calculate discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get final price after discount
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   // Shuffle array function for random products
//   const shuffleArray = (array: Product[]) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

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

//           // Filter and set display products
//           const featuredProducts = productsData.filter(p => p.isFeatured === true);
          
//           if (featuredProducts.length > 0) {
//             // If featured products exist, show them (max 4)
//             setDisplayProducts(featuredProducts.slice(0, 4));
//           } else {
//             // If no featured products, show 4 random products
//             const shuffled = shuffleArray(productsData);
//             setDisplayProducts(shuffled.slice(0, 4));
//           }
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
//       // Redirect to login with toast
//       toast.error('Please login first to add items to cart', {
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
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     // Check if product is already in cart
//     if (isProductInCart(product.id)) {
//       toast.error(`${product.name} is already in your cart!`, {
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

//     // Show success toast
//     toast.success(`${product.name} added to cart!`, {
//       duration: 3000,
//       position: 'top-right',
//       style: {
//         background: '#10B981',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🛒',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background relative">
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
//       <div className="relative">
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
//               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900">
//                 {products.filter(p => p.isFeatured === true).length > 0 
//                   ? '⭐ Featured Products' 
//                   : '✨ Our Products'}
//               </h2>
//               <p className="text-gray-600 max-w-lg mx-auto">
//                 {products.filter(p => p.isFeatured === true).length > 0
//                   ? 'Handpicked selections just for you'
//                   : 'Discover our curated collection of premium beauty products'}
//               </p>
//             </motion.div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading products...</p>
//               </div>
//             ) : displayProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//               >
//                 {displayProducts.map((product, index) => {
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-200"
//                     >
//                       {/* Product Image - Now using aspect-square like products page */}
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         {/* Featured Badge on Image */}
//                         {product.isFeatured && (
//                           <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
//                             ⭐ Featured
//                           </div>
//                         )}
//                       </div>

//                       {/* Product Info */}
//                       <div className="p-4">
//                         <p className="text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                           {product.category}
//                         </p>
//                         <div className="flex items-center flex-wrap gap-1.5 mb-2">
//                           <h3 className="font-serif font-semibold text-gray-900 line-clamp-2">
//                             {product.name}
//                           </h3>
//                           {/* Discount badge next to name */}
//                           {hasValidDiscount(product) && (
//                             <span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold align-middle whitespace-nowrap shadow-sm">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Price - Only show discount if discount > 0 */}
//                         <div className="flex items-center gap-2 mb-4">
//                           <span className="text-lg font-bold text-primary">
//                             {formatPrice(getFinalPrice(product))}
//                           </span>
//                           {hasValidDiscount(product) && (
//                             <span className="text-sm text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex gap-2">
//                           {inCart ? (
//                             <button
//                               disabled
//                               className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-sm cursor-default opacity-80"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               In Cart
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all cursor-pointer text-sm"
//                             >
//                               Add to Cart
//                             </button>
//                           )}
//                           <Link
//                             href={`/product/${product.id}`}
//                             className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-sm"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
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
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
//             <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

//with marquee

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   isFeatured?: boolean;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   marqueeText?: string;        // ✅ Added
//   minOrderForFreeDelivery?: number; // ✅ Added
//   deliveryCharges?: number;    // ✅ Added
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//     marqueeText: '',
//     minOrderForFreeDelivery: 0,
//     deliveryCharges: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();

//   // Check if product is in cart
//   const isProductInCart = (productId: string) => {
//     return cartItems.some(item => item.id === productId);
//   };

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount - ONLY if discount > 0
//   const hasValidDiscount = (product: Product) => {
//     // Strictly check: discount must exist, be greater than 0, and less than price
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   // Calculate discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get final price after discount
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   // Shuffle array function for random products
//   const shuffleArray = (array: Product[]) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   useEffect(() => {
//     try {
//       // Fetch banner data from Firebase Realtime Database
//       const bannerRef = ref(rtdb, 'admin_settings/banner');
//       const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setBanner({
//             heading: data.heading || '',
//             subheading: data.subheading || '',
//             buttonText: data.buttonText || 'Shop Now',
//             backgroundImage: data.backgroundImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//             marqueeText: data.marqueeText || '',
//             minOrderForFreeDelivery: data.minOrderForFreeDelivery || 0,
//             deliveryCharges: data.deliveryCharges || 0
//           });
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

//           // Filter and set display products
//           const featuredProducts = productsData.filter(p => p.isFeatured === true);
          
//           if (featuredProducts.length > 0) {
//             // If featured products exist, show them (max 4)
//             setDisplayProducts(featuredProducts.slice(0, 4));
//           } else {
//             // If no featured products, show 4 random products
//             const shuffled = shuffleArray(productsData);
//             setDisplayProducts(shuffled.slice(0, 4));
//           }
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
//       // Redirect to login with toast
//       toast.error('Please login first to add items to cart', {
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
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     // Check if product is already in cart
//     if (isProductInCart(product.id)) {
//       toast.error(`${product.name} is already in your cart!`, {
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

//     // Show success toast
//     toast.success(`${product.name} added to cart!`, {
//       duration: 3000,
//       position: 'top-right',
//       style: {
//         background: '#10B981',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🛒',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background relative">
//       {/* ✅ Marquee Bar - Above Navbar */}
//       {/* ✅ Marquee Bar - Above Navbar */}
// {banner.marqueeText && (
//   <div className="bg-black py-2.5 overflow-hidden border-b border-white/10 sticky top-0 z-50 shadow-md">
//     <div className="max-w-7xl mx-auto relative">
//       <div className="overflow-hidden">
//         <motion.div
//           animate={{ x: ['100%', '-100%'] }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//           className="flex whitespace-nowrap"
//         >
//           {/* Double the content for seamless loop */}
//           {[...Array(2)].map((_, index) => (
//             <span key={index} className="text-white font-medium text-sm md:text-base tracking-wide flex items-center gap-8 mx-4">
//               <span className="flex items-center gap-3">
//                 <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
//                 {banner.marqueeText}
//                 <span className="inline-block w-1 h-1 rounded-full bg-white/50 mx-2"></span>
                
//                 {/* Show Min Order for Free Delivery - ONLY if > 0 */}
//                 {banner.minOrderForFreeDelivery > 0 && (
//                   <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-400">
//                     🎯 Free delivery above {formatPrice(banner.minOrderForFreeDelivery)}
//                   </span>
//                 )}
                
//                 {/* ONLY show Free Delivery when deliveryCharges === 0 */}
//                 {banner.deliveryCharges === 0 && (
//                   <span className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-green-400">
//                     🎉 Free Delivery
//                   </span>
//                 )}
                
//                 {/* DO NOTHING when deliveryCharges > 0 - No badge shown */}
//               </span>
//             </span>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   </div>
// )}

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
//       <div className="relative">
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
//               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900">
//                 {products.filter(p => p.isFeatured === true).length > 0 
//                   ? '⭐ Featured Products' 
//                   : '✨ Our Products'}
//               </h2>
//               <p className="text-gray-600 max-w-lg mx-auto">
//                 {products.filter(p => p.isFeatured === true).length > 0
//                   ? 'Handpicked selections just for you'
//                   : 'Discover our curated collection of premium beauty products'}
//               </p>
//             </motion.div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading products...</p>
//               </div>
//             ) : displayProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//               >
//                 {displayProducts.map((product, index) => {
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-200"
//                     >
//                       {/* Product Image */}
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         {/* Featured Badge on Image */}
//                         {product.isFeatured && (
//                           <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
//                             ⭐ Featured
//                           </div>
//                         )}
//                       </div>

//                       {/* Product Info */}
//                       <div className="p-4">
//                         <p className="text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                           {product.category}
//                         </p>
//                         <div className="flex items-center flex-wrap gap-1.5 mb-2">
//                           <h3 className="font-serif font-semibold text-gray-900 line-clamp-2">
//                             {product.name}
//                           </h3>
//                           {hasValidDiscount(product) && (
//                             <span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold align-middle whitespace-nowrap shadow-sm">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Price */}
//                         <div className="flex items-center gap-2 mb-4">
//                           <span className="text-lg font-bold text-primary">
//                             {formatPrice(getFinalPrice(product))}
//                           </span>
//                           {hasValidDiscount(product) && (
//                             <span className="text-sm text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex gap-2">
//                           {inCart ? (
//                             <button
//                               disabled
//                               className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-sm cursor-default opacity-80"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               In Cart
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all cursor-pointer text-sm"
//                             >
//                               Add to Cart
//                             </button>
//                           )}
//                           <Link
//                             href={`/product/${product.id}`}
//                             className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-sm"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
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
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
//             <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   isFeatured?: boolean;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   backgroundImageMobile?: string;
//   marqueeText?: string;
//   minOrderForFreeDelivery?: number;
//   deliveryCharges?: number;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//     backgroundImageMobile: '',
//     marqueeText: '',
//     minOrderForFreeDelivery: 0,
//     deliveryCharges: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();

//   // Check if product is in cart
//   const isProductInCart = (productId: string) => {
//     return cartItems.some(item => item.id === productId);
//   };

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
//   const hasValidDiscount = (product: Product) => {
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   // Calculate discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get final price after discount
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   // Shuffle array function for random products
//   const shuffleArray = (array: Product[]) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   // ✅ Check if heading and subheading are empty
//   const hasHeadingOrSubheading = () => {
//     return (banner.heading && banner.heading.trim() !== '') || 
//            (banner.subheading && banner.subheading.trim() !== '');
//   };

//   useEffect(() => {
//     try {
//       const bannerRef = ref(rtdb, 'admin_settings/banner');
//       const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setBanner({
//             heading: data.heading || '',
//             subheading: data.subheading || '',
//             buttonText: data.buttonText || 'Shop Now',
//             backgroundImage: data.backgroundImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//             backgroundImageMobile: data.backgroundImageMobile || '',
//             marqueeText: data.marqueeText || '',
//             minOrderForFreeDelivery: data.minOrderForFreeDelivery || 0,
//             deliveryCharges: data.deliveryCharges || 0
//           });
//         }
//       });

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

//           const featuredProducts = productsData.filter(p => p.isFeatured === true);
          
//           if (featuredProducts.length > 0) {
//             setDisplayProducts(featuredProducts.slice(0, 4));
//           } else {
//             const shuffled = shuffleArray(productsData);
//             setDisplayProducts(shuffled.slice(0, 4));
//           }
//         }
//         setLoading(false);
//       });

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
//       toast.error('Please login first to add items to cart', {
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
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     if (isProductInCart(product.id)) {
//       toast.error(`${product.name} is already in your cart!`, {
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

//     toast.success(`${product.name} added to cart!`, {
//       duration: 3000,
//       position: 'top-right',
//       style: {
//         background: '#10B981',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🛒',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background relative">
//       {/* Marquee Bar */}
//       {banner.marqueeText && (
//         <div className="bg-black py-2.5 overflow-hidden border-b border-white/10 sticky top-0 z-50 shadow-md">
//           <div className="max-w-7xl mx-auto relative">
//             <div className="overflow-hidden">
//               <motion.div
//                 animate={{ x: ['100%', '-100%'] }}
//                 transition={{
//                   duration: 20,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//                 className="flex whitespace-nowrap"
//               >
//                 {[...Array(2)].map((_, index) => (
//                   <span key={index} className="text-white font-medium text-sm md:text-base tracking-wide flex items-center gap-8 mx-4">
//                     <span className="flex items-center gap-3">
//                       <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
//                       {banner.marqueeText}
//                       <span className="inline-block w-1 h-1 rounded-full bg-white/50 mx-2"></span>
                      
//                       {banner.minOrderForFreeDelivery > 0 && (
//                         <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-400">
//                           🎯 Free delivery above {formatPrice(banner.minOrderForFreeDelivery)}
//                         </span>
//                       )}
                      
//                       {banner.deliveryCharges === 0 && (
//                         <span className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-green-400">
//                           🎉 Free Delivery
//                         </span>
//                       )}
//                     </span>
//                   </span>
//                 ))}
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       )}

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

//       {/* Watermark */}
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

//       {/* Main Content */}
//       <div className="relative">
//         {/* Hero Banner */}
//         <section className="relative w-full h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-r from-primary/20 to-accent/20 z-15">
//           {/* Desktop Background */}
//           <motion.div
//             initial={{ scale: 1.1, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="absolute inset-0 bg-cover bg-center brightness-50 hidden md:block"
//             style={{
//               backgroundImage: `url('${banner.backgroundImage}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center 40%'
//             }}
//           />
          
//           {/* Mobile Background */}
//           {banner.backgroundImageMobile && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center brightness-50 md:hidden"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImageMobile}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* Fallback if no mobile image */}
//           {!banner.backgroundImageMobile && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center brightness-50 md:hidden"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImage}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* Overlay */}
//           <div className="absolute inset-0 bg-black/60" />

//           {/* Content */}
//           <div className="relative h-full flex items-center justify-center px-4">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className={`text-white ${hasHeadingOrSubheading() ? 'text-center max-w-2xl' : 'w-full text-center'}`}
//             >
//               {/* ✅ Only show heading if it has value */}
//               {banner.heading && banner.heading.trim() !== '' && (
//                 <motion.h1
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 0.3 }}
//                   className="text-4xl md:text-6xl font-serif font-bold mb-4 text-balance"
//                 >
//                   {banner.heading}
//                 </motion.h1>
//               )}
              
//               {/* ✅ Only show subheading if it has value */}
//               {banner.subheading && banner.subheading.trim() !== '' && (
//                 <motion.p
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.6, delay: 0.4 }}
//                   className="text-lg md:text-xl mb-8 text-gray-100 text-balance"
//                 >
//                   {banner.subheading}
//                 </motion.p>
//               )}

//               {/* ✅ Button - Different styling when heading/subheading empty */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.5 }}
//               >
//                 {hasHeadingOrSubheading() ? (
//                   // ✅ Normal button style when heading/subheading exist
//                   <Link
//                     href="/products"
//                     className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
//                   >
//                     {banner.buttonText}
//                     <ArrowRight size={20} />
//                   </Link>
//                 ) : (
//                   // ✅ Big stylish text-only button when heading/subheading are empty
//                  <motion.div
//   initial={{ opacity: 0, y: 30 }}
//   animate={{ opacity: 1, y: 0 }}
//   transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
// >
//   <Link
//     href="/products"
//     className="inline-flex items-center gap-5 text-white hover:scale-105 transition-all duration-300 group relative"
//     style={{
//       fontSize: 'clamp(3rem, 10vw, 6rem)',
//       fontFamily: "'Playfair Display', 'Georgia', serif",
//       fontStyle: 'italic',
//       fontWeight: '700',
//       letterSpacing: '0.08em',
//       marginTop: '14rem',
//       textShadow: '0 4px 30px rgba(0,0,0,0.5)'
//     }}
//   >
//     {/* Golden Gradient Text */}
//     <span className="relative">
//       <span 
//         className="relative z-10"
//         style={{
//           background: 'linear-gradient(135deg, #ffffff 0%, #f5e6d3 30%, #ffd700 60%, #f5e6d3 80%, #ffffff 100%)',
//           backgroundSize: '200% 200%',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//           animation: 'shimmer 3s ease-in-out infinite'
//         }}
//       >
//         {banner.buttonText}
//       </span>
      
//       {/* Glow Effect Behind Text */}
//       <span 
//         className="absolute inset-0 blur-3xl opacity-30 -z-0"
//         style={{
//           background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
//           transform: 'scale(1.2)'
//         }}
//       />
//     </span>

//     {/* Animated Arrow */}
//     <motion.span
//       animate={{ x: [0, 8, 0] }}
//       transition={{ 
//         duration: 1.5, 
//         repeat: Infinity,
//         ease: "easeInOut"
//       }}
//       className="relative"
//     >
//       <ArrowRight 
//         size={60} 
//         strokeWidth={1.5} 
//         className="inline-block"
//         style={{ 
//           color: '#ffd700',
//           filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.4))'
//         }} 
//       />
//     </motion.span>
//   </Link>
// </motion.div>
//                 )}
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
//               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900">
//                 {products.filter(p => p.isFeatured === true).length > 0 
//                   ? '⭐ Featured Products' 
//                   : '✨ Our Products'}
//               </h2>
//               <p className="text-gray-600 max-w-lg mx-auto">
//                 {products.filter(p => p.isFeatured === true).length > 0
//                   ? 'Handpicked selections just for you'
//                   : 'Discover our curated collection of premium beauty products'}
//               </p>
//             </motion.div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading products...</p>
//               </div>
//             ) : displayProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
//               >
//                 {displayProducts.map((product, index) => {
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all group border border-gray-200"
//                     >
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         {product.isFeatured && (
//                           <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
//                             ⭐ Featured
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-4">
//                         <p className="text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                           {product.category}
//                         </p>
//                         <div className="flex items-center flex-wrap gap-1.5 mb-2">
//                           <h3 className="font-serif font-semibold text-gray-900 line-clamp-2">
//                             {product.name}
//                           </h3>
//                           {hasValidDiscount(product) && (
//                             <span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold align-middle whitespace-nowrap shadow-sm">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>
                        
//                         <div className="flex items-center gap-2 mb-4">
//                           <span className="text-lg font-bold text-primary">
//                             {formatPrice(getFinalPrice(product))}
//                           </span>
//                           {hasValidDiscount(product) && (
//                             <span className="text-sm text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex gap-2">
//                           {inCart ? (
//                             <button
//                               disabled
//                               className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-sm cursor-default opacity-80"
//                             >
//                               <CheckCircle className="w-4 h-4" />
//                               In Cart
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:opacity-90 transition-all cursor-pointer text-sm"
//                             >
//                               Add to Cart
//                             </button>
//                           )}
//                           <Link
//                             href={`/product/${product.id}`}
//                             className="flex-1 bg-gray-100 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-sm"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
//               </div>
//             )}

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

//         <footer className="bg-white py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-sm">
//             <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }












//chatgpt img

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   isFeatured?: boolean;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   backgroundImageMobile?: string;
//   backgroundImageTablet?: string;
//   marqueeText?: string;
//   minOrderForFreeDelivery?: number;
//   deliveryCharges?: number;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: '',
//     subheading: '',
//     buttonText: 'SHOP NOW',
//     backgroundImage: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//     backgroundImageMobile: '',
//     backgroundImageTablet: '',
//     marqueeText: '',
//     minOrderForFreeDelivery: 0,
//     deliveryCharges: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();

//   const isProductInCart = (productId: string) => {
//     return cartItems.some(item => item.id === productId);
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const hasValidDiscount = (product: Product) => {
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   const shuffleArray = (array: Product[]) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   useEffect(() => {
//     try {
//       const bannerRef = ref(rtdb, 'admin_settings/banner');
//       const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setBanner({
//             heading: data.heading || '',
//             subheading: data.subheading || '',
//             buttonText: data.buttonText || 'SHOP NOW',
//             backgroundImage: data.backgroundImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//             backgroundImageMobile: data.backgroundImageMobile || '',
//             backgroundImageTablet: data.backgroundImageTablet || '',
//             marqueeText: data.marqueeText || '',
//             minOrderForFreeDelivery: data.minOrderForFreeDelivery || 0,
//             deliveryCharges: data.deliveryCharges || 0
//           });
//         }
//       });

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

//           const featuredProducts = productsData.filter(p => p.isFeatured === true);
          
//           if (featuredProducts.length > 0) {
//             setDisplayProducts(featuredProducts.slice(0, 4));
//           } else {
//             const shuffled = shuffleArray(productsData);
//             setDisplayProducts(shuffled.slice(0, 4));
//           }
//         }
//         setLoading(false);
//       });

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
//       toast.error('Please login first to add items to cart', {
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
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     if (isProductInCart(product.id)) {
//       toast.error(`${product.name} is already in your cart!`, {
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

//     toast.success(`${product.name} added to cart!`, {
//       duration: 3000,
//       position: 'top-right',
//       style: {
//         background: '#10B981',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🛒',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background relative">
//       {/* Marquee Bar */}
//       {banner.marqueeText && (
//         <div className="bg-black py-2.5 overflow-hidden border-b border-white/10 sticky top-0 z-50 shadow-md">
//           <div className="max-w-7xl mx-auto relative">
//             <div className="overflow-hidden">
//               <motion.div
//                 animate={{ x: ['100%', '-100%'] }}
//                 transition={{
//                   duration: 20,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//                 className="flex whitespace-nowrap"
//               >
//                 {[...Array(2)].map((_, index) => (
//                   <span key={index} className="text-white font-medium text-sm md:text-base tracking-wide flex items-center gap-8 mx-4">
//                     <span className="flex items-center gap-3">
//                       <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
//                       {banner.marqueeText}
//                       <span className="inline-block w-1 h-1 rounded-full bg-white/50 mx-2"></span>
                      
//                       {banner.minOrderForFreeDelivery > 0 && (
//                         <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-400">
//                           🎯 Free delivery above {formatPrice(banner.minOrderForFreeDelivery)}
//                         </span>
//                       )}
                      
//                       {banner.deliveryCharges === 0 && (
//                         <span className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-green-400">
//                           🎉 Free Delivery
//                         </span>
//                       )}
//                     </span>
//                   </span>
//                 ))}
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       )}

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

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-15 flex items-center justify-center"
//         animate={{
//           scale: [1, 1.05, 1],
//           opacity: [0.05, 0.08, 0.05]
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       >
//         <div className="relative w-[80%] max-w-4xl">
//           <img
//             src="https://i.ibb.co/7NLfzpHj/LOGO-removebg-preview.png"
//             alt="M&M Watermark"
//             className="w-full h-auto object-contain"
//           />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center font-serif text-[#8B7355] opacity-30">
//               <div className="text-xs md:text-sm tracking-[0.3em] uppercase">GLOW WITH BEAUTY,</div>
//               <div className="text-xl md:text-3xl font-bold tracking-[0.2em]">M&M</div>
//               <div className="text-xs md:text-sm tracking-[0.3em] uppercase">STAY WITH SCENT</div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="relative">
//         {/* Hero Banner */}
//         <section className="relative w-full h-[calc(100vh-64px)] max-h-[600px] overflow-hidden z-15">
//           {/* ✅ Desktop Background (lg and above) */}
//           <motion.div
//             initial={{ scale: 1.1, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="absolute inset-0 bg-cover bg-center hidden lg:block brightness-50"
//             style={{
//               backgroundImage: `url('${banner.backgroundImage}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center 40%'
//             }}
//           />
          
//           {/* ✅ Tablet Background (md to lg) */}
//           {banner.backgroundImageTablet && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center hidden md:block lg:hidden brightness-50"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImageTablet}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* ✅ Fallback Tablet - if no tablet image, use desktop */}
//           {!banner.backgroundImageTablet && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center hidden md:block lg:hidden brightness-50"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImage}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* ✅ Mobile Background (below md) */}
//           {banner.backgroundImageMobile && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center md:hidden brightness-50"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImageMobile}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* ✅ Fallback Mobile - if no mobile image, use desktop */}
//           {!banner.backgroundImageMobile && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center md:hidden brightness-50"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImage}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* ✅ Lighter Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

//           {/* Gold Border Lines */}
//           <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
//           <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

//           {/* Content */}
//           <div className="relative h-full flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20 px-4">
//             {/* Brand Text - Hidden on mobile, shown on tablet/desktop */}
//             {/* <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="hidden sm:block text-center mb-6"
//             >
//               <div className="text-white/60 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] uppercase font-light">
//                 BEAUTY & SKINCARE · PERFUME & WAX
//               </div>
//               <div className="text-white/40 text-[8px] sm:text-[10px] md:text-xs tracking-[0.4em] uppercase font-light mt-1">
//                 HAIR CARE · SELF CARE
//               </div>
//             </motion.div> */}

//             {/* SHOP NOW Button - Different sizes for different devices */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
//             >
//               <Link
//                 href="/products"
//                   className="
//     group
//     relative
//     inline-block

// max-[649px]:

// min-[650px]:max-[767px]:bottom-[110px]

// min-[768px]:max-[799px]:bottom-[90px]

// min-[800px]:max-[1023px]:bottom-[80px]

// min-[1024px]:max-[1099px]:bottom-[70px]

// min-[1100px]:max-[1199px]:bottom-[60px]

// min-[1200px]:max-[1299px]:bottom-[50px]

// min-[1300px]:max-[1359px]:bottom-[37px]

// min-[1360px]:right-[0px] min-[1360px]:bottom-[23px]
//   "
//               >
//                 {/* Button Glow */}
//                 <span className="absolute inset-0 bg-gradient-to-r from-[#C9A84C] to-[#A8893A] rounded-full blur opacity-20 sm:opacity-30" />
                
//                 {/* ✅ Main Button - Responsive sizing */}
//                 <span className="relative flex items-center justify-center 
//                   px-6 py-2.5 sm:px-8 sm:py-3 md:px-10 md:py-3.5 lg:px-14 lg:py-4.5 
//                   bg-[#C9A84C] border-2 border-[#C9A84C] rounded-full 
//                   overflow-hidden transition-all duration-500 
//                   hover:bg-[#B8963E] hover:border-[#B8963E]
                 
//                 ">
//                   {/* Button Text - Responsive font size */}
//                   <span className="relative z-10 text-black 
//                     font-serif font-bold tracking-[0.15em] sm:tracking-[0.2em] 
//                     text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-base lg:px-4  
//                     uppercase
//                      min-[800px]:max-[1023px]:px-10
//                      min-[650px]:max-[767px]:px-20
//                   ">
//                     {banner.buttonText}
//                   </span>
//                 </span>
//               </Link>
//             </motion.div>

//             {/* Decorative Bottom Line - Smaller on mobile */}
//             <motion.div
//               initial={{ opacity: 0, width: 0 }}
//               animate={{ opacity: 1, width: "80px" }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="h-[1px] mx-auto mt-4 sm:mt-6 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"
//               style={{ width: 'clamp(60px, 20vw, 120px)' }}
//             />
//           </div>
//         </section>

//         {/* Featured Products */}
//         <section className="py-12 sm:py-16 px-4 relative bg-white">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-8 sm:mb-12"
//             >
//               <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//                 <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A84C]" />
//                 <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C9A84C]" />
//                 <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A84C]" />
//               </div>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 sm:mb-4 text-gray-900">
//                 {products.filter(p => p.isFeatured === true).length > 0 
//                   ? '⭐ Featured Products' 
//                   : '✨ Our Products'}
//               </h2>
//               <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto font-light tracking-wide px-4">
//                 {products.filter(p => p.isFeatured === true).length > 0
//                   ? 'Handpicked selections just for you'
//                   : 'Discover our curated collection of premium beauty products'}
//               </p>
//             </motion.div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading products...</p>
//               </div>
//             ) : displayProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
//               >
//                 {displayProducts.map((product, index) => {
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 hover:border-[#C9A84C]/30"
//                     >
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         {product.isFeatured && (
//                           <div className="absolute top-2 left-2 bg-gradient-to-r from-[#C9A84C] to-[#8B7355] text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg">
//                             ⭐ Featured
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-2 sm:p-3 md:p-4">
//                         <p className="text-[8px] sm:text-xs text-[#C9A84C] mb-0.5 sm:mb-1 uppercase tracking-widest font-bold truncate">
//                           {product.category}
//                         </p>
//                         <div className="flex items-center flex-wrap gap-1 mb-1 sm:mb-2">
//                           <h3 className="font-serif font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm md:text-base">
//                             {product.name}
//                           </h3>
//                           {hasValidDiscount(product) && (
//                             <span className="inline-block bg-[#C9A84C] text-white px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold whitespace-nowrap">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>
                        
//                         <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
//                           <span className="text-xs sm:text-sm md:text-lg font-bold text-[#C9A84C]">
//                             {formatPrice(getFinalPrice(product))}
//                           </span>
//                           {hasValidDiscount(product) && (
//                             <span className="text-[8px] sm:text-xs text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex gap-1 sm:gap-2">
//                           {inCart ? (
//                             <button
//                               disabled
//                               className="flex-1 bg-green-500 text-white py-1 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-[8px] sm:text-xs cursor-default opacity-80"
//                             >
//                               <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//                               <span className="hidden xs:inline">In Cart</span>
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               className="flex-1 bg-[#C9A84C] text-white py-1 sm:py-2 rounded-lg font-semibold hover:bg-[#8B7355] transition-all cursor-pointer text-[8px] sm:text-xs"
//                             >
//                               <span className="hidden xs:inline">Add to Cart</span>
//                               <span className="xs:hidden">Add</span>
//                             </button>
//                           )}
//                           <Link
//                             href={`/product/${product.id}`}
//                             className="flex-1 bg-gray-100 text-gray-900 py-1 sm:py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-[8px] sm:text-xs"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
//               </div>
//             )}

//             {products.length > 0 && (
//               <div className="text-center mt-8 sm:mt-12">
//                 <Link
//                   href="/products"
//                   className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#C9A84C] text-white rounded-lg font-semibold hover:bg-[#8B7355] transition-all text-sm sm:text-base"
//                 >
//                   View All Products
//                   <ArrowRight size={16} className="sm:w-5 sm:h-5" />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>

//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200">
//           <div className="max-w-7xl mx-auto text-center">
//             <div className="flex justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
//               <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
//               <span className="text-[#C9A84C] text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-serif">M&M Scents & Glow</span>
//               <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
//             </div>
//             <p className="text-gray-600 text-[10px] sm:text-sm">&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }




//ok without mobile mode multiple img
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import toast, { Toaster } from 'react-hot-toast';


// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   isFeatured?: boolean;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   backgroundImageMobile?: string;
//   marqueeText?: string;
//   minOrderForFreeDelivery?: number;
//   deliveryCharges?: number;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: '',
//     subheading: '',
//     buttonText: 'SHOP NOW',
//     backgroundImage: 'https://i.ibb.co/MkhVcztQ/theme.jpg',
//     backgroundImageMobile: '',
//     marqueeText: '',
//     minOrderForFreeDelivery: 0,
//     deliveryCharges: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();

//   const isProductInCart = (productId: string) => {
//     return cartItems.some(item => item.id === productId);
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const hasValidDiscount = (product: Product) => {
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   const shuffleArray = (array: Product[]) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   useEffect(() => {
//     try {
//       const bannerRef = ref(rtdb, 'admin_settings/banner');
//       const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setBanner({
//             heading: data.heading || '',
//             subheading: data.subheading || '',
//             buttonText: data.buttonText || 'SHOP NOW',
//             backgroundImage: data.backgroundImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//             backgroundImageMobile: data.backgroundImageMobile || '',
//             marqueeText: data.marqueeText || '',
//             minOrderForFreeDelivery: data.minOrderForFreeDelivery || 0,
//             deliveryCharges: data.deliveryCharges || 0
//           });
//         }
//       });

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

//           const featuredProducts = productsData.filter(p => p.isFeatured === true);
          
//           if (featuredProducts.length > 0) {
//             setDisplayProducts(featuredProducts.slice(0, 4));
//           } else {
//             const shuffled = shuffleArray(productsData);
//             setDisplayProducts(shuffled.slice(0, 4));
//           }
//         }
//         setLoading(false);
//       });

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
//       toast.error('Please login first to add items to cart', {
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
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     if (isProductInCart(product.id)) {
//       toast.error(`${product.name} is already in your cart!`, {
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

//     toast.success(`${product.name} added to cart!`, {
//       duration: 3000,
//       position: 'top-right',
//       style: {
//         background: '#10B981',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🛒',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-black relative">
//       {/* Marquee Bar */}
//       {banner.marqueeText && (
//         <div className="bg-black py-2.5 overflow-hidden border-b border-white/10 sticky top-0 z-50 shadow-md">
//           <div className="max-w-7xl mx-auto relative">
//             <div className="overflow-hidden">
//               <motion.div
//                 animate={{ x: ['100%', '-100%'] }}
//                 transition={{
//                   duration: 20,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//                 className="flex whitespace-nowrap"
//               >
//                 {[...Array(2)].map((_, index) => (
//                   <span key={index} className="text-white font-medium text-sm md:text-base tracking-wide flex items-center gap-8 mx-4">
//                     <span className="flex items-center gap-3">
//                       <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
//                       {banner.marqueeText}
//                       <span className="inline-block w-1 h-1 rounded-full bg-white/50 mx-2"></span>
                      
//                       {banner.minOrderForFreeDelivery > 0 && (
//                         <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-400">
//                           🎯 Free delivery above {formatPrice(banner.minOrderForFreeDelivery)}
//                         </span>
//                       )}
                      
//                       {banner.deliveryCharges === 0 && (
//                         <span className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-green-400">
//                           🎉 Free Delivery
//                         </span>
//                       )}
//                     </span>
//                   </span>
//                 ))}
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       )}

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

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-15 flex items-center justify-center"
//         animate={{
//           scale: [1, 1.05, 1],
//           opacity: [0.05, 0.08, 0.05]
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       >
//         <div className="relative w-[80%] max-w-4xl">
//           <img
//             src="https://i.ibb.co/7NLfzpHj/LOGO-removebg-preview.png"
//             alt="M&M Watermark"
//             className="w-full h-auto object-contain"
//           />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center font-serif text-[#8B7355] opacity-30">
//               <div className="text-xs md:text-sm tracking-[0.3em] uppercase">GLOW WITH BEAUTY,</div>
//               <div className="text-xl md:text-3xl font-bold tracking-[0.2em]">M&M</div>
//               <div className="text-xs md:text-sm tracking-[0.3em] uppercase">STAY WITH SCENT</div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="relative">
//         {/* Hero Banner */}
//         <section className="relative w-full h-[calc(100vh-64px)] max-h-[600px] overflow-hidden z-15 bg-black">
//           {/* ✅ Desktop Background (above 400px) */}
//           <motion.div
//             initial={{ scale: 1.1, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="absolute inset-0 bg-cover bg-center brightness-50 max-[400px]:hidden"
//             style={{
//               backgroundImage: `url('${banner.backgroundImage}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center 40%'
//             }}
//           />
          
//           {/* ✅ Mobile Background (400px and below) - FULL SCREEN with SCALE */}
//           {banner.backgroundImageMobile && (
//             <motion.div
//               initial={{ scale: 1.2, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-[-20px] max-[400px]:block hidden brightness-50"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImageMobile}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 backgroundRepeat: 'no-repeat'
//               }}
//             />
//           )}
          
//           {/* ✅ Fallback Mobile - if no mobile image, use desktop with cover */}
//           {!banner.backgroundImageMobile && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center max-[400px]:block hidden brightness-50"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImage}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* ✅ Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

//           {/* Gold Border Lines */}
//           <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
//           <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

//           {/* Content */}
//           <div className="relative h-full flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20 px-4">
//             {/* SHOP NOW Button */}
//             <motion.div
//   initial={{ opacity: 0, y: 40, scale: 0.9 }}
//   animate={{
//     opacity: 1,
//     y: [0, -8, 0],
//     scale: [1, 1.02, 1],
//   }}
//   transition={{
//     opacity: {
//       duration: 0.8,
//       ease: "easeOut",
//     },
//     y: {
//       duration: 2.5,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//     scale: {
//       duration: 2.5,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   }}
// >
//   <Link
//     href="/products"
//     className="
//       group
//       relative
//       inline-block
//       transition-all
//       duration-300
//       hover:scale-105

//       max-[400px]:bottom-[0px]
//       min-[400px]:max-[650px]:bottom-[125px]
//       min-[650px]:max-[767px]:bottom-[110px]
//       min-[768px]:max-[799px]:bottom-[90px]
//       min-[800px]:max-[1023px]:bottom-[80px]
//       min-[1024px]:max-[1099px]:bottom-[70px]
//       min-[1100px]:max-[1199px]:bottom-[60px]
//       min-[1200px]:max-[1299px]:bottom-[50px]
//       min-[1300px]:max-[1359px]:bottom-[37px]
//       min-[1360px]:right-[2px]
//       min-[1360px]:bottom-[23px]
//     "
//   >
//     {/* Glow */}
//     <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#A8893A] blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500" />

//     {/* Button */}
//     <span
//       className="
//         relative
//         flex
//         items-center
//         justify-center

//         px-6 py-2.5
//         sm:px-8 sm:py-3
//         md:px-10 md:py-3.5
//         lg:px-14 lg:py-4.5

//         bg-[#C9A84C]
//         border-2
//         border-[#C9A84C]

        

//         overflow-hidden

//         transition-all
//         duration-500

//         hover:bg-[#B8963E]
//         hover:border-[#B8963E]

//         shadow-[0_10px_30px_rgba(201,168,76,0.35)]
//         group-hover:shadow-[0_15px_50px_rgba(201,168,76,0.7)]
//       "
//     >
//       <motion.span
//         animate={{
//           y: [0, -2, 0],
//         }}
//         transition={{
//           duration: 1.4,
//           repeat: Infinity,
//           ease: "easeInOut",
//         }}
//         className="
//           relative
//           z-10

//           text-black
//           font-serif
//           font-bold
//           uppercase

//           tracking-[0.15em]

//           text-[10px]

//           min-[300px]:max-[400px]:text-[14px]
//           min-[401px]:max-[649px]:text-[13px]
//           min-[650px]:max-[767px]:text-[14px]
//           min-[768px]:max-[1023px]:text-[15px]
//           min-[1024px]:text-[20px]

//           min-[800px]:max-[1023px]:px-10
//           min-[650px]:max-[767px]:px-20
//           min-[401px]:max-[649px]:px-20
//           min-[300px]:max-[400px]:px-8
//         "
//       >
//         <div className="flex items-center gap-2">
//   <span>{banner.buttonText}</span>

//   <ArrowRight
//     size={18}
//     strokeWidth={2.5}
//     className="transition-transform duration-300 group-hover:translate-x-1"
//   />
// </div>
//       </motion.span>
//     </span>
//   </Link>
// </motion.div>

//             {/* Decorative Bottom Line */}
//             <motion.div
//               initial={{ opacity: 0, width: 0 }}
//               animate={{ opacity: 1, width: "80px" }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="h-[1px] mx-auto mt-4 sm:mt-6 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"
//               style={{ width: 'clamp(60px, 20vw, 120px)' }}
//             />
//           </div>
//         </section>

//         {/* Featured Products */}
//         <section className="py-12 sm:py-16 px-4 relative bg-white">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-8 sm:mb-12"
//             >
//               <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//                 <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A84C]" />
//                 <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C9A84C]" />
//                 <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A84C]" />
//               </div>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 sm:mb-4 text-gray-900">
//                 {products.filter(p => p.isFeatured === true).length > 0 
//                   ? '⭐ Featured Products' 
//                   : '✨ Our Products'}
//               </h2>
//               <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto font-light tracking-wide px-4">
//                 {products.filter(p => p.isFeatured === true).length > 0
//                   ? 'Handpicked selections just for you'
//                   : 'Discover our curated collection of premium beauty products'}
//               </p>
//             </motion.div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading products...</p>
//               </div>
//             ) : displayProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
//               >
//                 {displayProducts.map((product, index) => {
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 hover:border-[#C9A84C]/30"
//                     >
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         {product.isFeatured && (
//                           <div className="absolute top-2 left-2 bg-gradient-to-r from-[#C9A84C] to-[#8B7355] text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg">
//                             ⭐ Featured
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-2 sm:p-3 md:p-4">
//                         <p className="text-[8px] sm:text-xs text-[#C9A84C] mb-0.5 sm:mb-1 uppercase tracking-widest font-bold truncate">
//                           {product.category}
//                         </p>
//                         <div className="flex items-center flex-wrap gap-1 mb-1 sm:mb-2">
//                           <h3 className="font-serif font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm md:text-base">
//                             {product.name}
//                           </h3>
//                           {hasValidDiscount(product) && (
//                             <span className="inline-block bg-[#C9A84C] text-white px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold whitespace-nowrap">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>
                        
//                         <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
//                           <span className="text-xs sm:text-sm md:text-lg font-bold text-[#C9A84C]">
//                             {formatPrice(getFinalPrice(product))}
//                           </span>
//                           {hasValidDiscount(product) && (
//                             <span className="text-[8px] sm:text-xs text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex gap-1 sm:gap-2">
//                           {inCart ? (
//                             <button
//                               disabled
//                               className="flex-1 bg-green-500 text-white py-1 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-[8px] sm:text-xs cursor-default opacity-80"
//                             >
//                               <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//                               <span className="hidden xs:inline">In Cart</span>
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               className="flex-1 bg-[#C9A84C] text-white py-1 sm:py-2 rounded-lg font-semibold hover:bg-[#8B7355] transition-all cursor-pointer text-[8px] sm:text-xs"
//                             >
//                               <span className="hidden xs:inline">Add to Cart</span>
//                               <span className="xs:hidden">Add</span>
//                             </button>
//                           )}
//                           <Link
//                             href={`/product/${product.id}`}
//                             className="flex-1 bg-gray-100 text-gray-900 py-1 sm:py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-[8px] sm:text-xs"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
//               </div>
//             )}

//             {products.length > 0 && (
//               <div className="text-center mt-8 sm:mt-12">
//                 <Link
//                   href="/products"
//                   className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#C9A84C] text-white rounded-lg font-semibold hover:bg-[#8B7355] transition-all text-sm sm:text-base"
//                 >
//                   View All Products
//                   <ArrowRight size={16} className="sm:w-5 sm:h-5" />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>

//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200">
//           <div className="max-w-7xl mx-auto text-center">
//             <div className="flex justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
//               <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
//               <span className="text-[#C9A84C] text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-serif">M&M Scents & Glow</span>
//               <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
//             </div>
//             <p className="text-gray-600 text-[10px] sm:text-sm">&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

//mobile mode multiple img
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import Link from 'next/link';
// import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   isFeatured?: boolean;
// }

// interface BannerData {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   backgroundImageMobile?: string;
//   backgroundImageMobile2?: string;
//   backgroundImageMobile3?: string;
//   backgroundImageMobile4?: string;
//   backgroundImageMobile5?: string;
//   marqueeText?: string;
//   minOrderForFreeDelivery?: number;
//   deliveryCharges?: number;
// }

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
//   const [banner, setBanner] = useState<BannerData>({
//     heading: '',
//     subheading: '',
//     buttonText: 'SHOP NOW',
//     backgroundImage: 'https://i.ibb.co/MkhVcztQ/theme.jpg',
//     backgroundImageMobile: '',
//     backgroundImageMobile2: '',
//     backgroundImageMobile3: '',
//     backgroundImageMobile4: '',
//     backgroundImageMobile5: '',
//     marqueeText: '',
//     minOrderForFreeDelivery: 0,
//     deliveryCharges: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();

//   // Get all mobile images in array
//   const getMobileImages = () => {
//     const images = [];
//     if (banner.backgroundImageMobile) images.push(banner.backgroundImageMobile);
//     if (banner.backgroundImageMobile2) images.push(banner.backgroundImageMobile2);
//     if (banner.backgroundImageMobile3) images.push(banner.backgroundImageMobile3);
//     if (banner.backgroundImageMobile4) images.push(banner.backgroundImageMobile4);
//     if (banner.backgroundImageMobile5) images.push(banner.backgroundImageMobile5);
//     return images;
//   };

//   const mobileImages = getMobileImages();

//   // Auto-slide effect for mobile images
//   useEffect(() => {
//     if (mobileImages.length <= 1) return;

//     const interval = setInterval(() => {
//       setCurrentMobileIndex((prev) => (prev + 1) % mobileImages.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [mobileImages.length]);

//   const isProductInCart = (productId: string) => {
//     return cartItems.some(item => item.id === productId);
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   const hasValidDiscount = (product: Product) => {
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   const shuffleArray = (array: Product[]) => {
//     const shuffled = [...array];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
//   };

//   useEffect(() => {
//     try {
//       const bannerRef = ref(rtdb, 'admin_settings/banner');
//       const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.val();
//           setBanner({
//             heading: data.heading || '',
//             subheading: data.subheading || '',
//             buttonText: data.buttonText || 'SHOP NOW',
//             backgroundImage: data.backgroundImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
//             backgroundImageMobile: data.backgroundImageMobile || '',
//             backgroundImageMobile2: data.backgroundImageMobile2 || '',
//             backgroundImageMobile3: data.backgroundImageMobile3 || '',
//             backgroundImageMobile4: data.backgroundImageMobile4 || '',
//             backgroundImageMobile5: data.backgroundImageMobile5 || '',
//             marqueeText: data.marqueeText || '',
//             minOrderForFreeDelivery: data.minOrderForFreeDelivery || 0,
//             deliveryCharges: data.deliveryCharges || 0
//           });
//         }
//       });

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

//           const featuredProducts = productsData.filter(p => p.isFeatured === true);
          
//           if (featuredProducts.length > 0) {
//             setDisplayProducts(featuredProducts.slice(0, 4));
//           } else {
//             const shuffled = shuffleArray(productsData);
//             setDisplayProducts(shuffled.slice(0, 4));
//           }
//         }
//         setLoading(false);
//       });

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
//       toast.error('Please login first to add items to cart', {
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
//         window.location.href = '/login';
//       }, 1500);
//       return;
//     }

//     if (isProductInCart(product.id)) {
//       toast.error(`${product.name} is already in your cart!`, {
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

//     toast.success(`${product.name} added to cart!`, {
//       duration: 3000,
//       position: 'top-right',
//       style: {
//         background: '#10B981',
//         color: '#fff',
//         padding: '16px',
//         borderRadius: '12px',
//       },
//       icon: '🛒',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-black relative">
//       {/* Marquee Bar */}
//       {banner.marqueeText && (
//         <div className="bg-black py-2.5 overflow-hidden border-b border-white/10 sticky top-0 z-50 shadow-md">
//           <div className="max-w-7xl mx-auto relative">
//             <div className="overflow-hidden">
//               <motion.div
//                 animate={{ x: ['100%', '-100%'] }}
//                 transition={{
//                   duration: 20,
//                   repeat: Infinity,
//                   ease: "linear",
//                 }}
//                 className="flex whitespace-nowrap"
//               >
//                 {[...Array(2)].map((_, index) => (
//                   <span key={index} className="text-white font-medium text-sm md:text-base tracking-wide flex items-center gap-8 mx-4">
//                     <span className="flex items-center gap-3">
//                       <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
//                       {banner.marqueeText}
//                       <span className="inline-block w-1 h-1 rounded-full bg-white/50 mx-2"></span>
                      
//                       {banner.minOrderForFreeDelivery > 0 && (
//                         <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-400">
//                           🎯 Free delivery above {formatPrice(banner.minOrderForFreeDelivery)}
//                         </span>
//                       )}
                      
//                       {banner.deliveryCharges === 0 && (
//                         <span className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-green-400">
//                           🎉 Free Delivery
//                         </span>
//                       )}
//                     </span>
//                   </span>
//                 ))}
//               </motion.div>
//             </div>
//           </div>
//         </div>
//       )}

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

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-15 flex items-center justify-center"
//         animate={{
//           scale: [1, 1.05, 1],
//           opacity: [0.05, 0.08, 0.05]
//         }}
//         transition={{
//           duration: 20,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//       >
//         <div className="relative w-[80%] max-w-4xl">
//           <img
//             src="https://i.ibb.co/7NLfzpHj/LOGO-removebg-preview.png"
//             alt="M&M Watermark"
//             className="w-full h-auto object-contain"
//           />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="text-center font-serif text-[#8B7355] opacity-30">
//               <div className="text-xs md:text-sm tracking-[0.3em] uppercase">GLOW WITH BEAUTY,</div>
//               <div className="text-xl md:text-3xl font-bold tracking-[0.2em]">M&M</div>
//               <div className="text-xs md:text-sm tracking-[0.3em] uppercase">STAY WITH SCENT</div>
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="relative">
//         {/* Hero Banner */}
//         <section className="relative w-full h-[calc(100vh-64px)] max-h-[600px] overflow-hidden z-15 bg-black">
//           {/* ✅ Desktop Background (above 400px) */}
//           <motion.div
//             initial={{ scale: 1.1, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="absolute inset-0 bg-cover bg-center brightness-50 max-[400px]:hidden"
//             style={{
//               backgroundImage: `url('${banner.backgroundImage}')`,
//               backgroundSize: 'cover',
//               backgroundPosition: 'center 40%'
//             }}
//           />
          
//           {/* ✅ Mobile Background (400px and below) - SLIDESHOW */}
//           {mobileImages.length > 0 && (
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={currentMobileIndex}
//                 initial={{ opacity: 0, scale: 1.1 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.8, ease: "easeInOut" }}
//                 className="absolute inset-[-20px] max-[400px]:block hidden brightness-50"
//                 style={{
//                   backgroundImage: `url('${mobileImages[currentMobileIndex]}')`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   backgroundRepeat: 'no-repeat'
//                 }}
//               />
//             </AnimatePresence>
//           )}
          
//           {/* ✅ Fallback Mobile - if no mobile images, use desktop with cover */}
//           {mobileImages.length === 0 && (
//             <motion.div
//               initial={{ scale: 1.1, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ duration: 0.8 }}
//               className="absolute inset-0 bg-cover bg-center max-[400px]:block hidden brightness-50"
//               style={{
//                 backgroundImage: `url('${banner.backgroundImage}')`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//               }}
//             />
//           )}
          
//           {/* ✅ Gradient Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

//           {/* Gold Border Lines */}
//           <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
//           <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

//           {/* ✅ Mobile Image Dots Indicator */}
//           {mobileImages.length > 1 && (
//             <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 max-[400px]:flex hidden">
//               {mobileImages.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentMobileIndex(index)}
//                   className={`h-1 rounded-full transition-all duration-300 ${
//                     currentMobileIndex === index 
//                       ? 'w-4 bg-[#C9A84C]' 
//                       : 'w-2 bg-white/40 hover:bg-white/60'
//                   }`}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Content */}
//           <div className="relative h-full flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20 px-4">
//             {/* SHOP NOW Button */}
//             <motion.div
//               initial={{ opacity: 0, y: 40, scale: 0.9 }}
//               animate={{
//                 opacity: 1,
//                 y: [0, -8, 0],
//                 scale: [1, 1.02, 1],
//               }}
//               transition={{
//                 opacity: {
//                   duration: 0.8,
//                   ease: "easeOut",
//                 },
//                 y: {
//                   duration: 2.5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 },
//                 scale: {
//                   duration: 2.5,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 },
//               }}
//             >
//               <Link
//                 href="/products"
//                 className="
//                   group
//                   relative
//                   inline-block
//                   transition-all
//                   duration-300
//                   hover:scale-105

//                   max-[400px]:bottom-[0px]
//                   min-[400px]:max-[650px]:bottom-[125px]
//                   min-[650px]:max-[767px]:bottom-[110px]
//                   min-[768px]:max-[799px]:bottom-[90px]
//                   min-[800px]:max-[1023px]:bottom-[80px]
//                   min-[1024px]:max-[1099px]:bottom-[70px]
//                   min-[1100px]:max-[1199px]:bottom-[60px]
//                   min-[1200px]:max-[1299px]:bottom-[50px]
//                   min-[1300px]:max-[1359px]:bottom-[37px]
//                   min-[1360px]:right-[2px]
//                   min-[1360px]:bottom-[23px]
//                 "
//               >
//                 {/* Glow */}
//                 <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#A8893A] blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500" />

//                 {/* Button */}
//                 <span
//                   className="
//                     relative
//                     flex
//                     items-center
//                     justify-center

//                     px-6 py-2.5
//                     sm:px-8 sm:py-3
//                     md:px-10 md:py-3.5
//                     lg:px-14 lg:py-4.5

//                     bg-[#C9A84C]
//                     border-2
//                     border-[#C9A84C]

//                     rounded-full

//                     overflow-hidden

//                     transition-all
//                     duration-500

//                     hover:bg-[#B8963E]
//                     hover:border-[#B8963E]

//                     shadow-[0_10px_30px_rgba(201,168,76,0.35)]
//                     group-hover:shadow-[0_15px_50px_rgba(201,168,76,0.7)]
//                   "
//                 >
//                   <motion.span
//                     animate={{
//                       y: [0, -2, 0],
//                     }}
//                     transition={{
//                       duration: 1.4,
//                       repeat: Infinity,
//                       ease: "easeInOut",
//                     }}
//                     className="
//                       relative
//                       z-10

//                       text-black
//                       font-serif
//                       font-bold
//                       uppercase

//                       tracking-[0.15em]

//                       text-[10px]

//                       min-[300px]:max-[400px]:text-[14px]
//                       min-[401px]:max-[649px]:text-[13px]
//                       min-[650px]:max-[767px]:text-[14px]
//                       min-[768px]:max-[1023px]:text-[15px]
//                       min-[1024px]:text-[20px]

//                       min-[800px]:max-[1023px]:px-10
//                       min-[650px]:max-[767px]:px-20
//                       min-[401px]:max-[649px]:px-20
//                       min-[300px]:max-[400px]:px-8
//                     "
//                   >
//                     <div className="flex items-center gap-2">
//                       <span>{banner.buttonText}</span>

//                       <ArrowRight
//                         size={18}
//                         strokeWidth={2.5}
//                         className="transition-transform duration-300 group-hover:translate-x-1"
//                       />
//                     </div>
//                   </motion.span>
//                 </span>
//               </Link>
//             </motion.div>

//             {/* Decorative Bottom Line */}
//             <motion.div
//               initial={{ opacity: 0, width: 0 }}
//               animate={{ opacity: 1, width: "80px" }}
//               transition={{ duration: 0.8, delay: 0.6 }}
//               className="h-[1px] mx-auto mt-4 sm:mt-6 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"
//               style={{ width: 'clamp(60px, 20vw, 120px)' }}
//             />
//           </div>
//         </section>

//         {/* Featured Products */}
//         <section className="py-12 sm:py-16 px-4 relative bg-white">
//           <div className="max-w-7xl mx-auto">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="text-center mb-8 sm:mb-12"
//             >
//               <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//                 <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A84C]" />
//                 <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C9A84C]" />
//                 <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A84C]" />
//               </div>
//               <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 sm:mb-4 text-gray-900">
//                 {products.filter(p => p.isFeatured === true).length > 0 
//                   ? '⭐ Featured Products' 
//                   : '✨ Our Products'}
//               </h2>
//               <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto font-light tracking-wide px-4">
//                 {products.filter(p => p.isFeatured === true).length > 0
//                   ? 'Handpicked selections just for you'
//                   : 'Discover our curated collection of premium beauty products'}
//               </p>
//             </motion.div>

//             {loading ? (
//               <div className="text-center py-12">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading products...</p>
//               </div>
//             ) : displayProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 whileInView={{ opacity: 1 }}
//                 transition={{ duration: 0.6 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
//               >
//                 {displayProducts.map((product, index) => {
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 20 }}
//                       whileInView={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 hover:border-[#C9A84C]/30"
//                     >
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
//                         <motion.img
//                           whileHover={{ scale: 1.05 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />
//                         {product.isFeatured && (
//                           <div className="absolute top-2 left-2 bg-gradient-to-r from-[#C9A84C] to-[#8B7355] text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg">
//                             ⭐ Featured
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-2 sm:p-3 md:p-4">
//                         <p className="text-[8px] sm:text-xs text-[#C9A84C] mb-0.5 sm:mb-1 uppercase tracking-widest font-bold truncate">
//                           {product.category}
//                         </p>
//                         <div className="flex items-center flex-wrap gap-1 mb-1 sm:mb-2">
//                           <h3 className="font-serif font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm md:text-base">
//                             {product.name}
//                           </h3>
//                           {hasValidDiscount(product) && (
//                             <span className="inline-block bg-[#C9A84C] text-white px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold whitespace-nowrap">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>
                        
//                         <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
//                           <span className="text-xs sm:text-sm md:text-lg font-bold text-[#C9A84C]">
//                             {formatPrice(getFinalPrice(product))}
//                           </span>
//                           {hasValidDiscount(product) && (
//                             <span className="text-[8px] sm:text-xs text-gray-500 line-through">
//                               {formatPrice(product.price)}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex gap-1 sm:gap-2">
//                           {inCart ? (
//                             <button
//                               disabled
//                               className="flex-1 bg-green-500 text-white py-1 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-[8px] sm:text-xs cursor-default opacity-80"
//                             >
//                               <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
//                               <span className="hidden xs:inline">In Cart</span>
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => handleAddToCart(product)}
//                               className="flex-1 bg-[#C9A84C] text-white py-1 sm:py-2 rounded-lg font-semibold hover:bg-[#8B7355] transition-all cursor-pointer text-[8px] sm:text-xs"
//                             >
//                               <span className="hidden xs:inline">Add to Cart</span>
//                               <span className="xs:hidden">Add</span>
//                             </button>
//                           )}
//                           <Link
//                             href={`/product/${product.id}`}
//                             className="flex-1 bg-gray-100 text-gray-900 py-1 sm:py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-[8px] sm:text-xs"
//                           >
//                             View
//                           </Link>
//                         </div>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
//                 <p className="text-gray-600 mb-4">No products available yet</p>
//                 <p className="text-sm text-gray-500">Admin needs to add products first</p>
//               </div>
//             )}

//             {products.length > 0 && (
//               <div className="text-center mt-8 sm:mt-12">
//                 <Link
//                   href="/products"
//                   className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#C9A84C] text-white rounded-lg font-semibold hover:bg-[#8B7355] transition-all text-sm sm:text-base"
//                 >
//                   View All Products
//                   <ArrowRight size={16} className="sm:w-5 sm:h-5" />
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>

//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200">
//           <div className="max-w-7xl mx-auto text-center">
//             <div className="flex justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
//               <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
//               <span className="text-[#C9A84C] text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-serif">M&M Scents & Glow</span>
//               <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
//             </div>
//             <p className="text-gray-600 text-[10px] sm:text-sm">&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

//mobile mode issue solved
'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Navbar from '@/components/Navbar';
import { CartItem, useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  isFeatured?: boolean;
}

interface BannerData {
  heading: string;
  subheading: string;
  buttonText: string;
  backgroundImage: string;
  backgroundImageMobile?: string;
  backgroundImageMobile2?: string;
  backgroundImageMobile3?: string;
  backgroundImageMobile4?: string;
  backgroundImageMobile5?: string;
  marqueeText?: string;
  minOrderForFreeDelivery?: number;
  deliveryCharges?: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<BannerData>({
    heading: '',
    subheading: '',
    buttonText: 'SHOP NOW',
    backgroundImage: 'https://i.ibb.co/MkhVcztQ/theme.jpg',
    backgroundImageMobile: '',
    backgroundImageMobile2: '',
    backgroundImageMobile3: '',
    backgroundImageMobile4: '',
    backgroundImageMobile5: '',
    marqueeText: '',
    minOrderForFreeDelivery: 0,
    deliveryCharges: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get all mobile images in array
  const getMobileImages = () => {
    const images = [];
    if (banner.backgroundImageMobile) images.push(banner.backgroundImageMobile);
    if (banner.backgroundImageMobile2) images.push(banner.backgroundImageMobile2);
    if (banner.backgroundImageMobile3) images.push(banner.backgroundImageMobile3);
    if (banner.backgroundImageMobile4) images.push(banner.backgroundImageMobile4);
    if (banner.backgroundImageMobile5) images.push(banner.backgroundImageMobile5);
    return images;
  };

  const mobileImages = getMobileImages();

  // Preload images
  useEffect(() => {
    if (mobileImages.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    mobileImages.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === mobileImages.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === mobileImages.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [mobileImages]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 400);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide effect for mobile images - 5 seconds
  useEffect(() => {
    if (mobileImages.length <= 1 || !isMobile) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentMobileIndex((prev) => (prev + 1) % mobileImages.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [mobileImages.length, isMobile]);

  const isProductInCart = (productId: string) => {
    return cartItems.some(item => item.id === productId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ur-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasValidDiscount = (product: Product) => {
    return product.discount !== undefined && 
           product.discount !== null && 
           product.discount > 0 && 
           product.discount < product.price;
  };

  const getDiscountPercentage = (product: Product) => {
    if (!hasValidDiscount(product)) return 0;
    return Math.round((product.discount! / product.price) * 100);
  };

  const getFinalPrice = (product: Product) => {
    if (hasValidDiscount(product)) {
      return product.price - product.discount!;
    }
    return product.price;
  };

  const shuffleArray = (array: Product[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    try {
      const bannerRef = ref(rtdb, 'admin_settings/banner');
      const unsubscribeBanner = onValue(bannerRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setBanner({
            heading: data.heading || '',
            subheading: data.subheading || '',
            buttonText: data.buttonText || 'SHOP NOW',
            backgroundImage: data.backgroundImage || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg',
            backgroundImageMobile: data.backgroundImageMobile || '',
            backgroundImageMobile2: data.backgroundImageMobile2 || '',
            backgroundImageMobile3: data.backgroundImageMobile3 || '',
            backgroundImageMobile4: data.backgroundImageMobile4 || '',
            backgroundImageMobile5: data.backgroundImageMobile5 || '',
            marqueeText: data.marqueeText || '',
            minOrderForFreeDelivery: data.minOrderForFreeDelivery || 0,
            deliveryCharges: data.deliveryCharges || 0
          });
        }
      });

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

          const featuredProducts = productsData.filter(p => p.isFeatured === true);
          
          if (featuredProducts.length > 0) {
            setDisplayProducts(featuredProducts.slice(0, 4));
          } else {
            const shuffled = shuffleArray(productsData);
            setDisplayProducts(shuffled.slice(0, 4));
          }
        }
        setLoading(false);
      });

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
      toast.error('Please login first to add items to cart', {
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
        window.location.href = '/login';
      }, 1500);
      return;
    }

    if (isProductInCart(product.id)) {
      toast.error(`${product.name} is already in your cart!`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#F59E0B',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
        icon: '⚠️',
      });
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

    toast.success(`${product.name} added to cart!`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#10B981',
        color: '#fff',
        padding: '16px',
        borderRadius: '12px',
      },
      icon: '🛒',
    });
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Marquee Bar */}
      {banner.marqueeText && (
        <div className="bg-black py-2.5 overflow-hidden border-b border-white/10 sticky top-0 z-50 shadow-md">
          <div className="max-w-7xl mx-auto relative">
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: ['100%', '-100%'] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="flex whitespace-nowrap"
              >
                {[...Array(2)].map((_, index) => (
                  <span key={index} className="text-white font-medium text-sm md:text-base tracking-wide flex items-center gap-8 mx-4">
                    <span className="flex items-center gap-3">
                      <span className="inline-block w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
                      {banner.marqueeText}
                      <span className="inline-block w-1 h-1 rounded-full bg-white/50 mx-2"></span>
                      
                      {banner.minOrderForFreeDelivery > 0 && (
                        <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-blue-400">
                          🎯 Free delivery above {formatPrice(banner.minOrderForFreeDelivery)}
                        </span>
                      )}
                      
                      {banner.deliveryCharges === 0 && (
                        <span className="bg-green-500/20 px-2 py-0.5 rounded-full text-xs font-semibold text-green-400">
                          🎉 Free Delivery
                        </span>
                      )}
                    </span>
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      )}

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

      {/* Watermark */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-15 flex items-center justify-center"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative w-[80%] max-w-4xl">
          <img
            src="https://i.ibb.co/7NLfzpHj/LOGO-removebg-preview.png"
            alt="M&M Watermark"
            className="w-full h-auto object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center font-serif text-[#8B7355] opacity-30">
              <div className="text-xs md:text-sm tracking-[0.3em] uppercase">GLOW WITH BEAUTY,</div>
              <div className="text-xl md:text-3xl font-bold tracking-[0.2em]">M&M</div>
              <div className="text-xs md:text-sm tracking-[0.3em] uppercase">STAY WITH SCENT</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative">
        {/* Hero Banner */}
        <section className="relative w-full h-[calc(100vh-64px)] max-h-[600px] overflow-hidden z-15 bg-black">
          {/* ✅ Desktop Background (above 400px) */}
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-cover bg-center brightness-50 max-[400px]:hidden"
            style={{
              backgroundImage: `url('${banner.backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%'
            }}
          />
          
          {/* ✅ Mobile Background (400px and below) - SLIDESHOW with Left to Right */}
          {mobileImages.length > 0 && isMobile && imagesLoaded && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMobileIndex}
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: '0%', opacity: 1 }}
                exit={{ x: '-100%', opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-[-20px] max-[400px]:block hidden brightness-60"
                style={{
                  backgroundImage: `url('${mobileImages[currentMobileIndex]}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </AnimatePresence>
          )}
          
          {/* ✅ Fallback Mobile - if no mobile images, use desktop with cover */}
          {mobileImages.length === 0 && (
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover bg-center max-[400px]:block hidden brightness-50"
              style={{
                backgroundImage: `url('${banner.backgroundImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
          
          {/* ✅ Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

          {/* Gold Border Lines */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

          {/* ✅ Mobile Image Dots Indicator */}
          {/* {mobileImages.length > 1 && isMobile && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 max-[400px]:flex hidden">
              {mobileImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentMobileIndex(index);
                    // Reset interval when manually clicked
                    if (intervalRef.current) {
                      clearInterval(intervalRef.current);
                      intervalRef.current = setInterval(() => {
                        setCurrentMobileIndex((prev) => (prev + 1) % mobileImages.length);
                      }, 5000);
                    }
                  }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    currentMobileIndex === index 
                      ? 'w-4 bg-[#C9A84C]' 
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )} */}

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20 px-4">
            {/* SHOP NOW Button */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: [0, -8, 0],
                scale: [1, 1.02, 1],
              }}
              transition={{
                opacity: {
                  duration: 0.8,
                  ease: "easeOut",
                },
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scale: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <Link
                href="/products"
                className="
                  group
                  relative
                  inline-block
                  transition-all
                  duration-300
                  hover:scale-105

                  max-[400px]:bottom-[0px]
                  min-[400px]:max-[650px]:bottom-[125px]
                  min-[650px]:max-[767px]:bottom-[110px]
                  min-[768px]:max-[799px]:bottom-[90px]
                  min-[800px]:max-[1023px]:bottom-[80px]
                  min-[1024px]:max-[1099px]:bottom-[70px]
                  min-[1100px]:max-[1199px]:bottom-[60px]
                  min-[1200px]:max-[1299px]:bottom-[50px]
                  min-[1300px]:max-[1359px]:bottom-[37px]
                  min-[1360px]:right-[2px]
                  min-[1360px]:bottom-[23px]
                "
              >
                {/* Glow */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#A8893A] blur-xl opacity-30 group-hover:opacity-60 transition-all duration-500" />

                {/* Button */}
                <span
                  className="
                    relative
                    flex
                    items-center
                    justify-center

                    px-6 py-2.5
                    sm:px-8 sm:py-3
                    md:px-10 md:py-3.5
                    lg:px-14 lg:py-4.5

                    bg-[#C9A84C]
                    border-2
                    border-[#C9A84C]

                    

                    overflow-hidden

                    transition-all
                    duration-500

                    hover:bg-[#B8963E]
                    hover:border-[#B8963E]

                    shadow-[0_10px_30px_rgba(201,168,76,0.35)]
                    group-hover:shadow-[0_15px_50px_rgba(201,168,76,0.7)]
                  "
                >
                  <motion.span
                    animate={{
                      y: [0, -2, 0],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="
                      relative
                      z-10

                      text-black
                      font-serif
                      font-bold
                      uppercase

                      tracking-[0.15em]

                      text-[10px]

                      min-[300px]:max-[400px]:text-[14px]
                      min-[401px]:max-[649px]:text-[13px]
                      min-[650px]:max-[767px]:text-[14px]
                      min-[768px]:max-[1023px]:text-[15px]
                      min-[1024px]:text-[20px]

                      min-[800px]:max-[1023px]:px-10
                      min-[650px]:max-[767px]:px-20
                      min-[401px]:max-[649px]:px-20
                      min-[300px]:max-[400px]:px-8
                    "
                  >
                    <div className="flex items-center gap-2">
                      <span>{banner.buttonText}</span>

                      <ArrowRight
                        size={18}
                        strokeWidth={2.5}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </motion.span>
                </span>
              </Link>
            </motion.div>

            {/* Decorative Bottom Line */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "80px" }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="h-[1px] mx-auto mt-4 sm:mt-6 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent"
              style={{ width: 'clamp(60px, 20vw, 120px)' }}
            />
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 sm:py-16 px-4 relative bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <div className="flex justify-center items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A84C]" />
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#C9A84C]" />
                <span className="w-8 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A84C]" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 sm:mb-4 text-gray-900">
                {products.filter(p => p.isFeatured === true).length > 0 
                  ? '⭐ Featured Products' 
                  : '✨ Our Products'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto font-light tracking-wide px-4">
                {products.filter(p => p.isFeatured === true).length > 0
                  ? 'Handpicked selections just for you'
                  : 'Discover our curated collection of premium beauty products'}
              </p>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#C9A84C] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : displayProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
              >
                {displayProducts.map((product, index) => {
                  const inCart = isProductInCart(product.id);
                  const discountPercent = getDiscountPercentage(product);
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-100 hover:border-[#C9A84C]/30"
                    >
                      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
                          }}
                        />
                        {product.isFeatured && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#C9A84C] to-[#8B7355] text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg">
                            ⭐ Featured
                          </div>
                        )}
                      </div>

                      <div className="p-2 sm:p-3 md:p-4">
                        <p className="text-[8px] sm:text-xs text-[#C9A84C] mb-0.5 sm:mb-1 uppercase tracking-widest font-bold truncate">
                          {product.category}
                        </p>
                        <div className="flex items-center flex-wrap gap-1 mb-1 sm:mb-2">
                          <h3 className="font-serif font-semibold text-gray-900 line-clamp-2 text-xs sm:text-sm md:text-base">
                            {product.name}
                          </h3>
                          {hasValidDiscount(product) && (
                            <span className="inline-block bg-[#C9A84C] text-white px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-bold whitespace-nowrap">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                          <span className="text-xs sm:text-sm md:text-lg font-bold text-[#C9A84C]">
                            {formatPrice(getFinalPrice(product))}
                          </span>
                          {hasValidDiscount(product) && (
                            <span className="text-[8px] sm:text-xs text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-1 sm:gap-2">
                          {inCart ? (
                            <button
                              disabled
                              className="flex-1 bg-green-500 text-white py-1 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-1 text-[8px] sm:text-xs cursor-default opacity-80"
                            >
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden xs:inline">In Cart</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-[#C9A84C] text-white py-1 sm:py-2 rounded-lg font-semibold hover:bg-[#8B7355] transition-all cursor-pointer text-[8px] sm:text-xs"
                            >
                              <span className="hidden xs:inline">Add to Cart</span>
                              <span className="xs:hidden">Add</span>
                            </button>
                          )}
                          <Link
                            href={`/product/${product.id}`}
                            className="flex-1 bg-gray-100 text-gray-900 py-1 sm:py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center border border-gray-200 text-[8px] sm:text-xs"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600 mb-4">No products available yet</p>
                <p className="text-sm text-gray-500">Admin needs to add products first</p>
              </div>
            )}

            {products.length > 0 && (
              <div className="text-center mt-8 sm:mt-12">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#C9A84C] text-white rounded-lg font-semibold hover:bg-[#8B7355] transition-all text-sm sm:text-base"
                >
                  View All Products
                  <ArrowRight size={16} className="sm:w-5 sm:h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
              <span className="text-[#C9A84C] text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-serif">M&M Scents & Glow</span>
              <span className="w-6 sm:w-8 h-[1px] bg-[#C9A84C]/50" />
            </div>
            <p className="text-gray-600 text-[10px] sm:text-sm">&copy; 2024 M&M Scents. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}