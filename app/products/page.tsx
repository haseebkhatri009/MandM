// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle } from 'lucide-react';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   description?: string;
//   stock?: number;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stockAlert, setStockAlert] = useState<string | null>(null);

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const categorySet = new Set<string>();
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const product = {
//             id: key,
//             ...data[key]
//           } as Product;
//           productsData.push(product);
//           if (product.category) {
//             categorySet.add(product.category);
//           }
//         });

//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         setCategories(Array.from(categorySet).sort());
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter products based on search and category
//   useEffect(() => {
//     let filtered = products;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, selectedCategory, products]);

//   const handleAddToCart = (product: Product) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     const currentStock = product.stock || 0;
//     if (currentStock <= 0) {
//       setStockAlert(product.name);
//       setTimeout(() => setStockAlert(null), 3000);
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

//       {/* Watermark - Same as orders page */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.08] z-20 flex items-center justify-center"
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
//         {/* Header - Full height on all devices */}
//         <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-secondary/90 to-background/90 backdrop-blur-sm flex items-center">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
//           <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: -30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="mb-6"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
//               >
//                 Our Collection
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
//               >
//                 Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
//               </motion.p>
//             </motion.div>

//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
//             />
//           </div>
//         </section>

//         {/* Stock Alert */}
//         {stockAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="relative z-20 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
//           >
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-600" size={20} />
//               <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
//             </div>
//           </motion.div>
//         )}

//         {/* Search & Filters */}
//         <motion.section
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-card/80 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-border shadow-sm"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
//               {/* Search */}
//               <motion.div
//                 className="flex-1 relative"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input/90 backdrop-blur-sm focus:border-primary transition-all text-sm sm:text-base"
//                 />
//               </motion.div>

//               {/* Category Filter */}
//               <div className="flex gap-1.5 sm:gap-2 flex-wrap overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
//                 <motion.button
//                   onClick={() => setSelectedCategory('all')}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                     selectedCategory === 'all'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-secondary/80 backdrop-blur-sm text-foreground hover:bg-muted border border-border'
//                   }`}
//                 >
//                   All
//                 </motion.button>
//                 {categories.map((cat, idx) => (
//                   <motion.button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                       selectedCategory === cat
//                         ? 'bg-primary text-white shadow-lg'
//                         : 'bg-secondary/80 backdrop-blur-sm text-foreground hover:bg-muted border border-border'
//                     }`}
//                   >
//                     {cat}
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Products Grid */}
//         <section className="py-8 sm:py-16 px-4">
//           <div className="max-w-7xl mx-auto">
//             {loading ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-20"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-muted-foreground">Loading premium products...</p>
//               </motion.div>
//             ) : filteredProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
//               >
//                 {filteredProducts.map((product, index) => (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     transition={{
//                       delay: index * 0.08,
//                       type: "spring",
//                       stiffness: 100,
//                       damping: 15
//                     }}
//                     whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                     className="bg-card/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-border/50 flex flex-col"
//                   >
//                     {/* Clickable Image Container */}
//                     <Link href={`/product/${product.id}`}>
//                       <div className="relative w-full aspect-square bg-secondary/50 overflow-hidden cursor-pointer rounded-t-lg">
//                         <motion.img
//                           whileHover={{ scale: 1.08 }}
//                           transition={{ duration: 0.3 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src =
//                               'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />

//                         {/* Discount Badge */}
//                         {product.discount && (
//                           <motion.div
//                             initial={{ scale: 0, rotate: -180 }}
//                             animate={{ scale: 1, rotate: 0 }}
//                             transition={{ delay: 0.2, type: "spring" }}
//                             className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg"
//                           >
//                             -{Math.round((product.discount / product.price) * 100)}%
//                           </motion.div>
//                         )}

//                         {/* Stock Status Badge */}
//                         <div className="absolute bottom-2 left-2">
//                           {(product.stock || 0) <= 0 ? (
//                             <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm">
//                               Out of Stock
//                             </span>
//                           ) : (product.stock || 0) < 5 ? (
//                             <span className="bg-yellow-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm">
//                               Only {product.stock} left
//                             </span>
//                           ) : (
//                             <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm">
//                               In Stock
//                             </span>
//                           )}
//                         </div>

//                         {/* Overlay on Hover */}
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           whileHover={{ opacity: 1 }}
//                           className="absolute inset-0 bg-black/40 flex items-center justify-center"
//                         >
//                           <motion.span
//                             initial={{ scale: 0 }}
//                             whileHover={{ scale: 1 }}
//                             className="text-white font-semibold text-xs sm:text-sm bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
//                           >
//                             View Details
//                           </motion.span>
//                         </motion.div>
//                       </div>
//                     </Link>

//                     {/* Product Info */}
//                     <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3 flex-1 flex flex-col">
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.1 }}
//                       >
//                         <p className="text-[10px] sm:text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                           {product.category}
//                         </p>
//                         <h3 className="font-serif font-bold text-foreground mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-base leading-snug">
//                           {product.name}
//                         </h3>
//                       </motion.div>

//                       {product.description && (
//                         <motion.p
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.15 }}
//                           className="text-[10px] sm:text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed hidden sm:block"
//                         >
//                           {product.description}
//                         </motion.p>
//                       )}
                      
//                       {/* Price */}
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.2 }}
//                         className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2"
//                       >
//                         <span className="text-sm sm:text-2xl font-bold text-primary">
//                           ₹{Math.round(product.price - (product.discount || 0))}
//                         </span>
//                         {product.discount && (
//                           <span className="text-[10px] sm:text-sm text-muted-foreground line-through font-medium">
//                             ₹{product.price}
//                           </span>
//                         )}
//                       </motion.div>

//                       {/* Add to Cart Button */}
//                       <motion.button
//                         onClick={() => handleAddToCart(product)}
//                         whileHover={{ scale: (product.stock || 0) > 0 ? 1.05 : 1 }}
//                         whileTap={{ scale: (product.stock || 0) > 0 ? 0.95 : 1 }}
//                         disabled={(product.stock || 0) <= 0}
//                         className={`w-full py-1.5 sm:py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-auto text-[10px] sm:text-sm md:text-base ${
//                           (product.stock || 0) <= 0
//                             ? 'bg-muted/70 text-muted-foreground cursor-not-allowed opacity-50 backdrop-blur-sm'
//                             : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md'
//                         }`}
//                       >
//                         {(product.stock || 0) > 0 ? (
//                           <>
//                             <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Add to Cart</span>
//                             <span className="xs:hidden">Add</span>
//                           </>
//                         ) : (
//                           <>
//                             <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Out of Stock</span>
//                             <span className="xs:hidden">OOS</span>
//                           </>
//                         )}
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-12 sm:py-20 bg-card/90 backdrop-blur-sm rounded-lg border border-border"
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mb-4 sm:mb-6"
//                 >
//                   <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-muted-foreground mx-auto opacity-30" />
//                 </motion.div>
//                 <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
//                 <motion.button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedCategory('all');
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
//                 >
//                   Clear Filters
//                   <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-muted-foreground text-xs sm:text-sm">
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
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle } from 'lucide-react';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   description?: string;
//   stock?: number;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stockAlert, setStockAlert] = useState<string | null>(null);

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const categorySet = new Set<string>();
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const product = {
//             id: key,
//             ...data[key]
//           } as Product;
//           productsData.push(product);
//           if (product.category) {
//             categorySet.add(product.category);
//           }
//         });

//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         setCategories(Array.from(categorySet).sort());
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter products based on search and category
//   useEffect(() => {
//     let filtered = products;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, selectedCategory, products]);

//   const handleAddToCart = (product: Product) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     const currentStock = product.stock || 0;
//     if (currentStock <= 0) {
//       setStockAlert(product.name);
//       setTimeout(() => setStockAlert(null), 3000);
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
//     <div className="min-h-screen bg-white text-gray-900 relative">
//       <Navbar />

//       {/* Watermark - Same as orders page */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-20 flex items-center justify-center"
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
//         {/* Header - Full height on all devices */}
//         <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-gray-50 to-white backdrop-blur-sm flex items-center">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
//           <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: -30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="mb-6"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-gray-900 to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
//               >
//                 Our Collection
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed"
//               >
//                 Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
//               </motion.p>
//             </motion.div>

//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
//             />
//           </div>
//         </section>

//         {/* Stock Alert */}
//         {stockAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="relative z-20 bg-red-50 border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
//           >
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-600" size={20} />
//               <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
//             </div>
//           </motion.div>
//         )}

//         {/* Search & Filters */}
//         <motion.section
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white/95 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-gray-200 shadow-sm"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
//               {/* Search */}
//               <motion.div
//                 className="flex-1 relative"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white focus:border-primary transition-all text-sm sm:text-base text-gray-900"
//                 />
//               </motion.div>

//               {/* Category Filter */}
//               <div className="flex gap-1.5 sm:gap-2 flex-wrap overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
//                 <motion.button
//                   onClick={() => setSelectedCategory('all')}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                     selectedCategory === 'all'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
//                   }`}
//                 >
//                   All
//                 </motion.button>
//                 {categories.map((cat, idx) => (
//                   <motion.button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                       selectedCategory === cat
//                         ? 'bg-primary text-white shadow-lg'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
//                     }`}
//                   >
//                     {cat}
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Products Grid */}
//         <section className="py-8 sm:py-16 px-4 bg-white">
//           <div className="max-w-7xl mx-auto">
//             {loading ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-20"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading premium products...</p>
//               </motion.div>
//             ) : filteredProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
//               >
//                 {filteredProducts.map((product, index) => (
//                   <motion.div
//                     key={product.id}
//                     initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     transition={{
//                       delay: index * 0.08,
//                       type: "spring",
//                       stiffness: 100,
//                       damping: 15
//                     }}
//                     whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                     className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-200 flex flex-col"
//                   >
//                     {/* Clickable Image Container */}
//                     <Link href={`/product/${product.id}`}>
//                       <div className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer rounded-t-lg">
//                         <motion.img
//                           whileHover={{ scale: 1.08 }}
//                           transition={{ duration: 0.3 }}
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-full object-contain p-2"
//                           onError={(e) => {
//                             e.currentTarget.src =
//                               'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                           }}
//                         />

//                         {/* Discount Badge */}
//                         {product.discount && (
//                           <motion.div
//                             initial={{ scale: 0, rotate: -180 }}
//                             animate={{ scale: 1, rotate: 0 }}
//                             transition={{ delay: 0.2, type: "spring" }}
//                             className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg"
//                           >
//                             -{Math.round((product.discount / product.price) * 100)}%
//                           </motion.div>
//                         )}

//                         {/* Stock Status Badge */}
//                         <div className="absolute bottom-2 left-2">
//                           {(product.stock || 0) <= 0 ? (
//                             <span className="bg-red-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm">
//                               Out of Stock
//                             </span>
//                           ) : (product.stock || 0) < 5 ? (
//                             <span className="bg-yellow-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm">
//                               Only {product.stock} left
//                             </span>
//                           ) : (
//                             <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold backdrop-blur-sm">
//                               In Stock
//                             </span>
//                           )}
//                         </div>

//                         {/* Overlay on Hover */}
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           whileHover={{ opacity: 1 }}
//                           className="absolute inset-0 bg-black/40 flex items-center justify-center"
//                         >
//                           <motion.span
//                             initial={{ scale: 0 }}
//                             whileHover={{ scale: 1 }}
//                             className="text-white font-semibold text-xs sm:text-sm bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
//                           >
//                             View Details
//                           </motion.span>
//                         </motion.div>
//                       </div>
//                     </Link>

//                     {/* Product Info */}
//                     <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3 flex-1 flex flex-col">
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.1 }}
//                       >
//                         <p className="text-[10px] sm:text-xs text-primary mb-1 uppercase tracking-widest font-bold">
//                           {product.category}
//                         </p>
//                         <h3 className="font-serif font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-base leading-snug">
//                           {product.name}
//                         </h3>
//                       </motion.div>

//                       {product.description && (
//                         <motion.p
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.15 }}
//                           className="text-[10px] sm:text-sm text-gray-600 line-clamp-2 flex-1 leading-relaxed hidden sm:block"
//                         >
//                           {product.description}
//                         </motion.p>
//                       )}
                      
//                       {/* Price */}
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.2 }}
//                         className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2"
//                       >
//                         <span className="text-sm sm:text-2xl font-bold text-primary">
//                           ₹{Math.round(product.price - (product.discount || 0))}
//                         </span>
//                         {product.discount && (
//                           <span className="text-[10px] sm:text-sm text-gray-500 line-through font-medium">
//                             ₹{product.price}
//                           </span>
//                         )}
//                       </motion.div>

//                       {/* Add to Cart Button */}
//                       <motion.button
//                         onClick={() => handleAddToCart(product)}
//                         whileHover={{ scale: (product.stock || 0) > 0 ? 1.05 : 1 }}
//                         whileTap={{ scale: (product.stock || 0) > 0 ? 0.95 : 1 }}
//                         disabled={(product.stock || 0) <= 0}
//                         className={`w-full py-1.5 sm:py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-auto text-[10px] sm:text-sm md:text-base ${
//                           (product.stock || 0) <= 0
//                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                             : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md'
//                         }`}
//                       >
//                         {(product.stock || 0) > 0 ? (
//                           <>
//                             <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Add to Cart</span>
//                             <span className="xs:hidden">Add</span>
//                           </>
//                         ) : (
//                           <>
//                             <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Out of Stock</span>
//                             <span className="xs:hidden">OOS</span>
//                           </>
//                         )}
//                       </motion.button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-12 sm:py-20 bg-white rounded-lg border border-gray-200"
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mb-4 sm:mb-6"
//                 >
//                   <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-gray-400 mx-auto opacity-30" />
//                 </motion.div>
//                 <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
//                 <motion.button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedCategory('all');
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
//                 >
//                   Clear Filters
//                   <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
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
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   description?: string;
//   stock?: number;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stockAlert, setStockAlert] = useState<string | null>(null);

//   // Format price in PKR
//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat('ur-PK', {
//       style: 'currency',
//       currency: 'PKR',
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   // Check if product has valid discount (discount > 0)
//   const hasValidDiscount = (product: Product) => {
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   // Get final price
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   // Get discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get stock status and color
//   const getStockStatus = (stock: number = 0) => {
//     if (stock <= 0) {
//       return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
//     } else if (stock < 5) {
//       return { label: `Only ${stock} left`, color: 'text-yellow-600 bg-yellow-50' };
//     } else {
//       return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
//     }
//   };

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const categorySet = new Set<string>();
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const product = {
//             id: key,
//             ...data[key]
//           } as Product;
//           productsData.push(product);
//           if (product.category) {
//             categorySet.add(product.category);
//           }
//         });

//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         setCategories(Array.from(categorySet).sort());
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter products based on search and category
//   useEffect(() => {
//     let filtered = products;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, selectedCategory, products]);

//   const handleAddToCart = (product: Product) => {
//     if (!user) {
//       router.push('/login');
//       return;
//     }

//     const currentStock = product.stock || 0;
//     if (currentStock <= 0) {
//       setStockAlert(product.name);
//       setTimeout(() => setStockAlert(null), 3000);
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
//     <div className="min-h-screen bg-white text-gray-900 relative">
//       <Navbar />

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-20 flex items-center justify-center"
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
//         <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-gray-50 to-white backdrop-blur-sm flex items-center">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
//           <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: -30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="mb-6"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-gray-900 to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
//               >
//                 Our Collection
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed"
//               >
//                 Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
//               </motion.p>
//             </motion.div>

//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
//             />
//           </div>
//         </section>

//         {/* Stock Alert */}
//         {stockAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="relative z-20 bg-red-50 border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
//           >
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-600" size={20} />
//               <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
//             </div>
//           </motion.div>
//         )}

//         {/* Search & Filters */}
//         <motion.section
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white/95 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-gray-200 shadow-sm"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
//               {/* Search */}
//               <motion.div
//                 className="flex-1 relative"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white focus:border-primary transition-all text-sm sm:text-base text-gray-900"
//                 />
//               </motion.div>

//               {/* Category Filter */}
//               <div className="flex gap-1.5 sm:gap-2 flex-wrap overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
//                 <motion.button
//                   onClick={() => setSelectedCategory('all')}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                     selectedCategory === 'all'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
//                   }`}
//                 >
//                   All
//                 </motion.button>
//                 {categories.map((cat, idx) => (
//                   <motion.button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                       selectedCategory === cat
//                         ? 'bg-primary text-white shadow-lg'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
//                     }`}
//                   >
//                     {cat}
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Products Grid */}
//         <section className="py-8 sm:py-16 px-4 bg-white">
//           <div className="max-w-7xl mx-auto">
//             {loading ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-20"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading premium products...</p>
//               </motion.div>
//             ) : filteredProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
//               >
//                 {filteredProducts.map((product, index) => {
//                   const stockStatus = getStockStatus(product.stock);
//                   const isOutOfStock = (product.stock || 0) <= 0;
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       transition={{
//                         delay: index * 0.08,
//                         type: "spring",
//                         stiffness: 100,
//                         damping: 15
//                       }}
//                       whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-200 flex flex-col"
//                     >
//                       {/* Clickable Image Container */}
//                       <Link href={`/product/${product.id}`}>
//                         <div className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer rounded-t-lg">
//                           <motion.img
//                             whileHover={{ scale: 1.08 }}
//                             transition={{ duration: 0.3 }}
//                             src={product.image}
//                             alt={product.name}
//                             className="w-full h-full object-contain p-2"
//                             onError={(e) => {
//                               e.currentTarget.src =
//                                 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                             }}
//                           />

//                           {/* Discount Badge - Only show if discount > 0 */}
//                           {hasValidDiscount(product) && (
//                             <motion.div
//                               initial={{ scale: 0, rotate: -180 }}
//                               animate={{ scale: 1, rotate: 0 }}
//                               transition={{ delay: 0.2, type: "spring" }}
//                               className="absolute top-2 right-2 bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg"
//                             >
//                               -{getDiscountPercentage(product)}%
//                             </motion.div>
//                           )}

//                           {/* Overlay on Hover */}
//                           <motion.div
//                             initial={{ opacity: 0 }}
//                             whileHover={{ opacity: 1 }}
//                             className="absolute inset-0 bg-black/40 flex items-center justify-center"
//                           >
//                             <motion.span
//                               initial={{ scale: 0 }}
//                               whileHover={{ scale: 1 }}
//                               className="text-white font-semibold text-xs sm:text-sm bg-black/50 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
//                             >
//                               View Details
//                             </motion.span>
//                           </motion.div>
//                         </div>
//                       </Link>

//                       {/* Product Info - Reduced gap between name and price */}
//                       <div className="p-2 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col">
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.1 }}
//                         >
//                           <p className="text-[10px] sm:text-xs text-primary mb-0.5 uppercase tracking-widest font-bold">
//                             {product.category}
//                           </p>
//                           <h3 className="font-serif font-bold text-gray-900 line-clamp-2 text-xs sm:text-base leading-snug">
//                             {product.name}
//                           </h3>
//                         </motion.div>
                        
//                         {/* Price and Stock Status - Closer to name */}
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.2 }}
//                           className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1"
//                         >
//                           {/* Price Row */}
//                           <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//                             <span className="text-sm sm:text-2xl font-bold text-primary">
//                               {formatPrice(getFinalPrice(product))}
//                             </span>
//                             {hasValidDiscount(product) && (
//                               <span className="text-[10px] sm:text-sm text-gray-500 line-through font-medium">
//                                 {formatPrice(product.price)}
//                               </span>
//                             )}
//                           </div>

//                           {/* Stock Status Badge - Below price */}
//                           <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.color}`}>
//                             {isOutOfStock ? (
//                               <AlertCircle size={12} className="sm:w-4 sm:h-4" />
//                             ) : (product.stock || 0) < 5 ? (
//                               <Clock size={12} className="sm:w-4 sm:h-4" />
//                             ) : (
//                               <CheckCircle size={12} className="sm:w-4 sm:h-4" />
//                             )}
//                             <span>{stockStatus.label}</span>
//                           </div>
//                         </motion.div>

//                         {/* Add to Cart Button */}
//                         <motion.button
//                           onClick={() => handleAddToCart(product)}
//                           whileHover={{ scale: !isOutOfStock ? 1.05 : 1 }}
//                           whileTap={{ scale: !isOutOfStock ? 0.95 : 1 }}
//                           disabled={isOutOfStock}
//                           className={`w-full py-1.5 sm:py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base ${
//                             isOutOfStock
//                               ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                               : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md'
//                           }`}
//                         >
//                           {!isOutOfStock ? (
//                             <>
//                               <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
//                               <span className="hidden xs:inline">Add to Cart</span>
//                               <span className="xs:hidden">Add</span>
//                             </>
//                           ) : (
//                             <>
//                               <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                               <span className="hidden xs:inline">Out of Stock</span>
//                               <span className="xs:hidden">OOS</span>
//                             </>
//                           )}
//                         </motion.button>
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-12 sm:py-20 bg-white rounded-lg border border-gray-200"
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mb-4 sm:mb-6"
//                 >
//                   <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-gray-400 mx-auto opacity-30" />
//                 </motion.div>
//                 <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
//                 <motion.button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedCategory('all');
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
//                 >
//                   Clear Filters
//                   <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
//             <p>&copy; 2024 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }


//correct code without dropdown category
// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle, CheckCircle, Clock } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   description?: string;
//   stock?: number;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stockAlert, setStockAlert] = useState<string | null>(null);

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

//   // Check if product has valid discount (discount > 0)
//   const hasValidDiscount = (product: Product) => {
//     return product.discount !== undefined && 
//            product.discount !== null && 
//            product.discount > 0 && 
//            product.discount < product.price;
//   };

//   // Get final price
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   // Get discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get stock status and color
//   const getStockStatus = (stock: number = 0) => {
//     if (stock <= 0) {
//       return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
//     } else if (stock < 5) {
//       return { label: `Only ${stock} left`, color: 'text-yellow-600 bg-yellow-50' };
//     } else {
//       return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
//     }
//   };

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const categorySet = new Set<string>();
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const product = {
//             id: key,
//             ...data[key]
//           } as Product;
//           productsData.push(product);
//           if (product.category) {
//             categorySet.add(product.category);
//           }
//         });

//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         setCategories(Array.from(categorySet).sort());
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter products based on search and category
//   useEffect(() => {
//     let filtered = products;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, selectedCategory, products]);

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
//         router.push('/login');
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

//     const currentStock = product.stock || 0;
//     if (currentStock <= 0) {
//       setStockAlert(product.name);
//       setTimeout(() => setStockAlert(null), 3000);
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
//     <div className="min-h-screen bg-white text-gray-900 relative">
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

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-20 flex items-center justify-center"
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
//         <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-gray-50 to-white backdrop-blur-sm flex items-center">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
//           <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: -30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="mb-6"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-gray-900 to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
//               >
//                 Our Collection
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed"
//               >
//                 Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
//               </motion.p>
//             </motion.div>

//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
//             />
//           </div>
//         </section>

//         {/* Stock Alert */}
//         {stockAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="relative z-20 bg-red-50 border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
//           >
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-600" size={20} />
//               <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
//             </div>
//           </motion.div>
//         )}

//         {/* Search & Filters */}
//         <motion.section
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white/95 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-gray-200 shadow-sm"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
//               {/* Search */}
//               <motion.div
//                 className="flex-1 relative"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white focus:border-primary transition-all text-sm sm:text-base text-gray-900"
//                 />
//               </motion.div>

//               {/* Category Filter */}
//               <div className="flex gap-1.5 sm:gap-2 flex-wrap overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
//                 <motion.button
//                   onClick={() => setSelectedCategory('all')}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                     selectedCategory === 'all'
//                       ? 'bg-primary text-white shadow-lg'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
//                   }`}
//                 >
//                   All
//                 </motion.button>
//                 {categories.map((cat, idx) => (
//                   <motion.button
//                     key={cat}
//                     onClick={() => setSelectedCategory(cat)}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-semibold transition-all text-xs sm:text-sm whitespace-nowrap ${
//                       selectedCategory === cat
//                         ? 'bg-primary text-white shadow-lg'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
//                     }`}
//                   >
//                     {cat}
//                   </motion.button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Products Grid */}
//         <section className="py-8 sm:py-16 px-4 bg-white">
//           <div className="max-w-7xl mx-auto">
//             {loading ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-20"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading premium products...</p>
//               </motion.div>
//             ) : filteredProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
//               >
//                 {filteredProducts.map((product, index) => {
//                   const stockStatus = getStockStatus(product.stock);
//                   const isOutOfStock = (product.stock || 0) <= 0;
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       transition={{
//                         delay: index * 0.08,
//                         type: "spring",
//                         stiffness: 100,
//                         damping: 15
//                       }}
//                       whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-200 flex flex-col"
//                     >
//                       {/* Clickable Image Container */}
//                       <Link href={`/product/${product.id}`}>
//                         <div className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer rounded-t-lg">
//                           <motion.img
//                             whileHover={{ scale: 1.08 }}
//                             transition={{ duration: 0.3 }}
//                             src={product.image}
//                             alt={product.name}
//                             className="w-full h-full object-contain p-2"
//                             onError={(e) => {
//                               e.currentTarget.src =
//                                 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                             }}
//                           />

//                           {/* Overlay on Hover - Reduced opacity for subtle effect */}
//                           <motion.div
//                             initial={{ opacity: 0 }}
//                             whileHover={{ opacity: 1 }}
//                             className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300"
//                           >
//                             <motion.span
//                               initial={{ scale: 0 }}
//                               whileHover={{ scale: 1 }}
//                               className="text-white font-semibold text-xs sm:text-sm bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
//                             >
//                               View Details
//                             </motion.span>
//                           </motion.div>
//                         </div>
//                       </Link>

//                       {/* Product Info - Reduced gap between name and price */}
//                       <div className="p-2 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col">
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.1 }}
//                         >
//                           <p className="text-[10px] sm:text-xs text-primary mb-0.5 uppercase tracking-widest font-bold">
//                             {product.category}
//                           </p>
//                           <div className="flex items-center flex-wrap gap-1.5">
//                             <h3 className="font-serif font-bold text-gray-900 line-clamp-2 text-xs sm:text-base leading-snug">
//                               {product.name}
//                             </h3>
//                             {/* Discount badge next to name - More visible */}
//                             {/* {hasValidDiscount(product) && (
//                               <span className="inline-block bg-gradient-to-r from-primary to-accent text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold align-middle whitespace-nowrap shadow-sm">
//                                 -{discountPercent}%
//                               </span>
//                             )} */}
//                           </div>
//                         </motion.div>
                        
//                         {/* Price and Stock Status - Closer to name */}
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.2 }}
//                           className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1"
//                         >
//                           {/* Price Row */}
//                           <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//                             <span className="text-sm sm:text-2xl font-bold text-primary">
//                               {formatPrice(getFinalPrice(product))}
//                             </span>
//                             {hasValidDiscount(product) && (
//                               <span className="text-[10px] sm:text-sm text-gray-500 line-through font-medium">
//                                 {formatPrice(product.price)}
//                               </span>
//                             )}
//                           </div>

//                           {/* Stock Status Badge - Below price */}
//                           <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.color}`}>
//                             {isOutOfStock ? (
//                               <AlertCircle size={12} className="sm:w-4 sm:h-4" />
//                             ) : (product.stock || 0) < 5 ? (
//                               <Clock size={12} className="sm:w-4 sm:h-4" />
//                             ) : (
//                               <CheckCircle size={12} className="sm:w-4 sm:h-4" />
//                             )}
//                             <span>{stockStatus.label}</span>
//                           </div>
//                         </motion.div>

//                         {/* Add to Cart / In Cart Button */}
//                         {inCart ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-green-500 text-white cursor-default opacity-80"
//                           >
//                             <CheckCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">In Cart</span>
//                             <span className="xs:hidden">In Cart</span>
//                           </button>
//                         ) : isOutOfStock ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gray-100 text-gray-400 cursor-not-allowed"
//                           >
//                             <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Out of Stock</span>
//                             <span className="xs:hidden">OOS</span>
//                           </button>
//                         ) : (
//                           <motion.button
//                             onClick={() => handleAddToCart(product)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md cursor-pointer"
//                           >
//                             <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Add to Cart</span>
//                             <span className="xs:hidden">Add</span>
//                           </motion.button>
//                         )}
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-12 sm:py-20 bg-white rounded-lg border border-gray-200"
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mb-4 sm:mb-6"
//                 >
//                   <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-gray-400 mx-auto opacity-30" />
//                 </motion.div>
//                 <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
//                 <motion.button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedCategory('all');
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
//                 >
//                   Clear Filters
//                   <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
//             <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }



//with dropdown and without varient badge

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle, CheckCircle, Clock, ChevronDown } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   description?: string;
//   stock?: number;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stockAlert, setStockAlert] = useState<string | null>(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

//   // Get final price
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   // Get discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get stock status and color
//   const getStockStatus = (stock: number = 0) => {
//     if (stock <= 0) {
//       return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
//     } else if (stock < 5) {
//       return { label: `Only ${stock} left`, color: 'text-yellow-600 bg-yellow-50' };
//     } else {
//       return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
//     }
//   };

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const categorySet = new Set<string>();
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const product = {
//             id: key,
//             ...data[key]
//           } as Product;
//           productsData.push(product);
//           if (product.category) {
//             categorySet.add(product.category);
//           }
//         });

//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         setCategories(Array.from(categorySet).sort());
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter products based on search and category
//   useEffect(() => {
//     let filtered = products;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, selectedCategory, products]);

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
//         router.push('/login');
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

//     const currentStock = product.stock || 0;
//     if (currentStock <= 0) {
//       setStockAlert(product.name);
//       setTimeout(() => setStockAlert(null), 3000);
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

//   // ✅ Get selected category display name
//   const getSelectedCategoryName = () => {
//     if (selectedCategory === 'all') return 'All Categories';
//     return selectedCategory;
//   };

//   return (
//     <div className="min-h-screen bg-white text-gray-900 relative">
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
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-20 flex items-center justify-center"
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
//         <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-gray-50 to-white backdrop-blur-sm flex items-center">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
//           <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: -30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="mb-6"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-gray-900 to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
//               >
//                 Our Collection
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed"
//               >
//                 Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
//               </motion.p>
//             </motion.div>

//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
//             />
//           </div>
//         </section>

//         {/* Stock Alert */}
//         {stockAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="relative z-20 bg-red-50 border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
//           >
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-600" size={20} />
//               <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
//             </div>
//           </motion.div>
//         )}

//         {/* Search & Filters - Category Dropdown */}
//         <motion.section
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white/95 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-gray-200 shadow-sm"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
//               {/* Search */}
//               <motion.div
//                 className="flex-1 relative"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white focus:border-primary transition-all text-sm sm:text-base text-gray-900"
//                 />
//               </motion.div>

//               {/* ✅ Category Dropdown */}
//               <div className="relative w-full md:w-64">
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="w-full flex items-center justify-between px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <span className="text-sm sm:text-base font-medium text-gray-700 truncate">
//                     {getSelectedCategoryName()}
//                   </span>
//                   <motion.div
//                     animate={{ rotate: isDropdownOpen ? 180 : 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <ChevronDown className="w-5 h-5 text-gray-400" />
//                   </motion.div>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isDropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
//                   >
//                     {/* All Categories */}
//                     <button
//                       onClick={() => {
//                         setSelectedCategory('all');
//                         setIsDropdownOpen(false);
//                       }}
//                       className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
//                         selectedCategory === 'all'
//                           ? 'bg-primary/10 text-primary border-l-4 border-primary'
//                           : 'text-gray-700'
//                       }`}
//                     >
//                       All Categories
//                     </button>

//                     {/* Category List */}
//                     {categories.map((cat, idx) => (
//                       <motion.button
//                         key={cat}
//                         onClick={() => {
//                           setSelectedCategory(cat);
//                           setIsDropdownOpen(false);
//                         }}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.03 }}
//                         className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
//                           selectedCategory === cat
//                             ? 'bg-primary/10 text-primary border-l-4 border-primary'
//                             : 'text-gray-700'
//                         }`}
//                       >
//                         {cat}
//                       </motion.button>
//                     ))}

//                     {/* No categories message */}
//                     {categories.length === 0 && (
//                       <div className="px-4 py-3 text-sm text-gray-400 text-center">
//                         No categories available
//                       </div>
//                     )}
//                   </motion.div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Products Grid */}
//         <section className="py-8 sm:py-16 px-4 bg-white">
//           <div className="max-w-7xl mx-auto">
//             {loading ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-20"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading premium products...</p>
//               </motion.div>
//             ) : filteredProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
//               >
//                 {filteredProducts.map((product, index) => {
//                   const stockStatus = getStockStatus(product.stock);
//                   const isOutOfStock = (product.stock || 0) <= 0;
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       transition={{
//                         delay: index * 0.08,
//                         type: "spring",
//                         stiffness: 100,
//                         damping: 15
//                       }}
//                       whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-200 flex flex-col"
//                     >
//                       <Link href={`/product/${product.id}`}>
//                         <div className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer rounded-t-lg">
//                           <motion.img
//                             whileHover={{ scale: 1.08 }}
//                             transition={{ duration: 0.3 }}
//                             src={product.image}
//                             alt={product.name}
//                             className="w-full h-full object-contain p-2"
//                             onError={(e) => {
//                               e.currentTarget.src =
//                                 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                             }}
//                           />

//                           <motion.div
//                             initial={{ opacity: 0 }}
//                             whileHover={{ opacity: 1 }}
//                             className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300"
//                           >
//                             <motion.span
//                               initial={{ scale: 0 }}
//                               whileHover={{ scale: 1 }}
//                               className="text-white font-semibold text-xs sm:text-sm bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
//                             >
//                               View Details
//                             </motion.span>
//                           </motion.div>
//                         </div>
//                       </Link>

//                       <div className="p-2 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col">
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.1 }}
//                         >
//                           <p className="text-[10px] sm:text-xs text-primary mb-0.5 uppercase tracking-widest font-bold">
//                             {product.category}
//                           </p>
//                           <div className="flex items-center flex-wrap gap-1.5">
//                             <h3 className="font-serif font-bold text-gray-900 line-clamp-2 text-xs sm:text-base leading-snug">
//                               {product.name}
//                             </h3>
//                           </div>
//                         </motion.div>
                        
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.2 }}
//                           className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1"
//                         >
//                           <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//                             <span className="text-sm sm:text-2xl font-bold text-primary">
//                               {formatPrice(getFinalPrice(product))}
//                             </span>
//                             {hasValidDiscount(product) && (
//                               <span className="text-[10px] sm:text-sm text-gray-500 line-through font-medium">
//                                 {formatPrice(product.price)}
//                               </span>
//                             )}
//                           </div>

//                           <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.color}`}>
//                             {isOutOfStock ? (
//                               <AlertCircle size={12} className="sm:w-4 sm:h-4" />
//                             ) : (product.stock || 0) < 5 ? (
//                               <Clock size={12} className="sm:w-4 sm:h-4" />
//                             ) : (
//                               <CheckCircle size={12} className="sm:w-4 sm:h-4" />
//                             )}
//                             <span>{stockStatus.label}</span>
//                           </div>
//                         </motion.div>

//                         {inCart ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-green-500 text-white cursor-default opacity-80"
//                           >
//                             <CheckCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">In Cart</span>
//                             <span className="xs:hidden">In Cart</span>
//                           </button>
//                         ) : isOutOfStock ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gray-100 text-gray-400 cursor-not-allowed"
//                           >
//                             <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Out of Stock</span>
//                             <span className="xs:hidden">OOS</span>
//                           </button>
//                         ) : (
//                           <motion.button
//                             onClick={() => handleAddToCart(product)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md cursor-pointer"
//                           >
//                             <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Add to Cart</span>
//                             <span className="xs:hidden">Add</span>
//                           </motion.button>
//                         )}
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-12 sm:py-20 bg-white rounded-lg border border-gray-200"
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mb-4 sm:mb-6"
//                 >
//                   <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-gray-400 mx-auto opacity-30" />
//                 </motion.div>
//                 <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
//                 <motion.button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedCategory('all');
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
//                 >
//                   Clear Filters
//                   <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
//             <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }



//with varient badge and without deal

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle, CheckCircle, Clock, ChevronDown } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   description?: string;
//   stock?: number;
//   hasFlavors?: boolean;
//   flavors?: Array<{ id: string; name: string; price: number; discount?: number; stock: number; image?: string; }>;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stockAlert, setStockAlert] = useState<string | null>(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

//   // Get final price
//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   // Get discount percentage
//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   // Get stock status and color
//   const getStockStatus = (stock: number = 0) => {
//     if (stock <= 0) {
//       return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
//     } else if (stock < 5) {
//       return { label: `Only ${stock} left`, color: 'text-yellow-600 bg-yellow-50' };
//     } else {
//       return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
//     }
//   };

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const categorySet = new Set<string>();
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const product = {
//             id: key,
//             ...data[key]
//           } as Product;
//           productsData.push(product);
//           if (product.category) {
//             categorySet.add(product.category);
//           }
//         });

//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         setCategories(Array.from(categorySet).sort());
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter products based on search and category
//   useEffect(() => {
//     let filtered = products;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, selectedCategory, products]);

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
//         router.push('/login');
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

//     const currentStock = product.stock || 0;
//     if (currentStock <= 0) {
//       setStockAlert(product.name);
//       setTimeout(() => setStockAlert(null), 3000);
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

//   // ✅ Get selected category display name
//   const getSelectedCategoryName = () => {
//     if (selectedCategory === 'all') return 'All Categories';
//     return selectedCategory;
//   };

//   return (
//     <div className="min-h-screen bg-white text-gray-900 relative">
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
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-20 flex items-center justify-center"
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
//         <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-gray-50 to-white backdrop-blur-sm flex items-center">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
//           <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: -30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="mb-6"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-gray-900 to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
//               >
//                 Our Collection
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed"
//               >
//                 Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
//               </motion.p>
//             </motion.div>

//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
//             />
//           </div>
//         </section>

//         {/* Stock Alert */}
//         {stockAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="relative z-20 bg-red-50 border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
//           >
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-600" size={20} />
//               <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
//             </div>
//           </motion.div>
//         )}

//         {/* Search & Filters - Category Dropdown */}
//         <motion.section
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white/95 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-gray-200 shadow-sm"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
//               {/* Search */}
//               <motion.div
//                 className="flex-1 relative"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white focus:border-primary transition-all text-sm sm:text-base text-gray-900"
//                 />
//               </motion.div>

//               {/* Category Dropdown */}
//               <div className="relative w-full md:w-64">
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="w-full flex items-center justify-between px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <span className="text-sm sm:text-base font-medium text-gray-700 truncate">
//                     {getSelectedCategoryName()}
//                   </span>
//                   <motion.div
//                     animate={{ rotate: isDropdownOpen ? 180 : 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <ChevronDown className="w-5 h-5 text-gray-400" />
//                   </motion.div>
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isDropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
//                   >
//                     <button
//                       onClick={() => {
//                         setSelectedCategory('all');
//                         setIsDropdownOpen(false);
//                       }}
//                       className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
//                         selectedCategory === 'all'
//                           ? 'bg-primary/10 text-primary border-l-4 border-primary'
//                           : 'text-gray-700'
//                       }`}
//                     >
//                       All Categories
//                     </button>

//                     {categories.map((cat, idx) => (
//                       <motion.button
//                         key={cat}
//                         onClick={() => {
//                           setSelectedCategory(cat);
//                           setIsDropdownOpen(false);
//                         }}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.03 }}
//                         className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
//                           selectedCategory === cat
//                             ? 'bg-primary/10 text-primary border-l-4 border-primary'
//                             : 'text-gray-700'
//                         }`}
//                       >
//                         {cat}
//                       </motion.button>
//                     ))}

//                     {categories.length === 0 && (
//                       <div className="px-4 py-3 text-sm text-gray-400 text-center">
//                         No categories available
//                       </div>
//                     )}
//                   </motion.div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Products Grid */}
//         <section className="py-8 sm:py-16 px-4 bg-white">
//           <div className="max-w-7xl mx-auto">
//             {loading ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-20"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading premium products...</p>
//               </motion.div>
//             ) : filteredProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
//               >
//                 {filteredProducts.map((product, index) => {
//                   const stockStatus = getStockStatus(product.stock);
//                   const isOutOfStock = (product.stock || 0) <= 0;
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
//                   const hasVariants = product.hasFlavors && product.flavors && product.flavors.length > 0;
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       transition={{
//                         delay: index * 0.08,
//                         type: "spring",
//                         stiffness: 100,
//                         damping: 15
//                       }}
//                       whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-200 flex flex-col"
//                     >
//                       <Link href={`/product/${product.id}`}>
//                         <div className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer rounded-t-lg">
//                           <motion.img
//                             whileHover={{ scale: 1.08 }}
//                             transition={{ duration: 0.3 }}
//                              src={product.image || '/placeholder-image.png'}  // ✅ Default image
//                             alt={product.name}
//                             className="w-full h-full object-contain p-2"
//                             onError={(e) => {
//                               e.currentTarget.src =
//                                 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                             }}
//                           />

//                           {/* ✅ Variants Badge - Bottom Left */}
//                           {hasVariants && (
//                             <div className="absolute bottom-2 left-2 bg-blue-500/90 text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                               <span>{product.flavors?.length || 0} Variants</span>
//                             </div>
//                           )}

//                           <motion.div
//                             initial={{ opacity: 0 }}
//                             whileHover={{ opacity: 1 }}
//                             className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300"
//                           >
//                             <motion.span
//                               initial={{ scale: 0 }}
//                               whileHover={{ scale: 1 }}
//                               className="text-white font-semibold text-xs sm:text-sm bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
//                             >
//                               View Details
//                             </motion.span>
//                           </motion.div>
//                         </div>
//                       </Link>

//                       <div className="p-2 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col">
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.1 }}
//                         >
//                           <p className="text-[10px] sm:text-xs text-primary mb-0.5 uppercase tracking-widest font-bold">
//                             {product.category}
//                           </p>
//                           <div className="flex items-center flex-wrap gap-1.5">
//                             <h3 className="font-serif font-bold text-gray-900 line-clamp-2 text-xs sm:text-base leading-snug">
//                               {product.name}
//                             </h3>
//                           </div>
//                         </motion.div>
                        
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.2 }}
//                           className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1"
//                         >
//                           <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//                             <span className="text-sm sm:text-2xl font-bold text-primary">
//                               {formatPrice(getFinalPrice(product))}
//                             </span>
//                             {hasValidDiscount(product) && (
//                               <span className="text-[10px] sm:text-sm text-gray-500 line-through font-medium">
//                                 {formatPrice(product.price)}
//                               </span>
//                             )}
//                           </div>

//                           <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.color}`}>
//                             {isOutOfStock ? (
//                               <AlertCircle size={12} className="sm:w-4 sm:h-4" />
//                             ) : (product.stock || 0) < 5 ? (
//                               <Clock size={12} className="sm:w-4 sm:h-4" />
//                             ) : (
//                               <CheckCircle size={12} className="sm:w-4 sm:h-4" />
//                             )}
//                             <span>{stockStatus.label}</span>
//                           </div>
//                         </motion.div>

//                         {inCart ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-green-500 text-white cursor-default opacity-80"
//                           >
//                             <CheckCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">In Cart</span>
//                             <span className="xs:hidden">In Cart</span>
//                           </button>
//                         ) : isOutOfStock ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gray-100 text-gray-400 cursor-not-allowed"
//                           >
//                             <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Out of Stock</span>
//                             <span className="xs:hidden">OOS</span>
//                           </button>
//                         ) : (
//                           <motion.button
//                             onClick={() => handleAddToCart(product)}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md cursor-pointer"
//                           >
//                             <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Add to Cart</span>
//                             <span className="xs:hidden">Add</span>
//                           </motion.button>
//                         )}
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-12 sm:py-20 bg-white rounded-lg border border-gray-200"
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mb-4 sm:mb-6"
//                 >
//                   <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-gray-400 mx-auto opacity-30" />
//                 </motion.div>
//                 <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
//                 <motion.button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedCategory('all');
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
//                 >
//                   Clear Filters
//                   <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
//             <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }


//with deal without deal color

// 'use client';

// import { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue } from 'firebase/database';
// import Navbar from '@/components/Navbar';
// import { CartItem, useCart } from '@/lib/cartContext';
// import { useAuth } from '@/lib/authContext';
// import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle, CheckCircle, Clock, ChevronDown, X } from 'lucide-react';
// import toast, { Toaster } from 'react-hot-toast';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   category: string;
//   description?: string;
//   stock?: number;
//   hasFlavors?: boolean;
//   flavors?: Array<{ id: string; name: string; price: number; discount?: number; stock: number; image?: string; }>;
//   dealName?: string;
// }

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');
//   const { addToCart, cartItems } = useCart();
//   const { user } = useAuth();
//   const router = useRouter();
//   const [categories, setCategories] = useState<string[]>([]);
//   const [stockAlert, setStockAlert] = useState<string | null>(null);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

//   const getFinalPrice = (product: Product) => {
//     if (hasValidDiscount(product)) {
//       return product.price - product.discount!;
//     }
//     return product.price;
//   };

//   const getDiscountPercentage = (product: Product) => {
//     if (!hasValidDiscount(product)) return 0;
//     return Math.round((product.discount! / product.price) * 100);
//   };

//   const getStockStatus = (stock: number = 0) => {
//     if (stock <= 0) {
//       return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
//     } else if (stock < 5) {
//       return { label: `Only ${stock} left`, color: 'text-yellow-600 bg-yellow-50' };
//     } else {
//       return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
//     }
//   };

//   // ✅ Custom Toast Function
//   const showCustomToast = (message: string, icon: string = '🛒') => {
//     toast.custom((t) => (
//       <div
//         className={`${
//           t.visible ? 'animate-enter' : 'animate-leave'
//         } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col overflow-hidden border border-gray-200`}
//       >
//         <div className="flex items-center p-4 gap-4">
//           <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
//             {icon}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-gray-900 truncate">
//               {message}
//             </p>
//             <p className="text-xs text-gray-500 mt-0.5">
//               Added to your cart
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//             }}
//             className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>
//         <div className="h-1 bg-green-100 w-full overflow-hidden">
//           <motion.div
//             initial={{ width: '100%' }}
//             animate={{ width: '0%' }}
//             transition={{ duration: 2, ease: "linear" }}
//             className="h-full bg-green-500 rounded-full"
//           />
//         </div>
//       </div>
//     ), {
//       duration: 2000,
//       position: 'top-right',
//     });
//   };

//   // ✅ Error Toast
//   const showErrorToast = (message: string, icon: string = '❌') => {
//     toast.custom((t) => (
//       <div
//         className={`${
//           t.visible ? 'animate-enter' : 'animate-leave'
//         } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col overflow-hidden border border-red-200`}
//       >
//         <div className="flex items-center p-4 gap-4">
//           <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
//             {icon}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-red-700 truncate">
//               {message}
//             </p>
//             <p className="text-xs text-gray-500 mt-0.5">
//               Please try again
//             </p>
//           </div>
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//             }}
//             className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <X className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>
//         <div className="h-1 bg-red-100 w-full overflow-hidden">
//           <motion.div
//             initial={{ width: '100%' }}
//             animate={{ width: '0%' }}
//             transition={{ duration: 2, ease: "linear" }}
//             className="h-full bg-red-500 rounded-full"
//           />
//         </div>
//       </div>
//     ), {
//       duration: 2000,
//       position: 'top-right',
//     });
//   };

//   // Fetch products
//   useEffect(() => {
//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const categorySet = new Set<string>();
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           const product = {
//             id: key,
//             ...data[key]
//           } as Product;
//           productsData.push(product);
//           if (product.category) {
//             categorySet.add(product.category);
//           }
//         });

//         setProducts(productsData);
//         setFilteredProducts(productsData);
//         setCategories(Array.from(categorySet).sort());
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Filter products
//   useEffect(() => {
//     let filtered = products;

//     if (selectedCategory !== 'all') {
//       filtered = filtered.filter(p => p.category === selectedCategory);
//     }

//     if (searchTerm) {
//       filtered = filtered.filter(p =>
//         p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [searchTerm, selectedCategory, products]);

//   const handleAddToCart = (product: Product) => {
//     if (!user) {
//       showErrorToast('Please login to add items to cart', '🔒');
//       setTimeout(() => {
//         router.push('/login');
//       }, 1500);
//       return;
//     }

//     if (isProductInCart(product.id)) {
//       showErrorToast(`${product.name} is already in your cart!`, '⚠️');
//       return;
//     }

//     const currentStock = product.stock || 0;
//     if (currentStock <= 0) {
//       showErrorToast(`${product.name} is out of stock!`, '❌');
//       setStockAlert(product.name);
//       setTimeout(() => setStockAlert(null), 3000);
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

//     showCustomToast(`${product.name} added to cart!`, '🛒');
//   };

//   const getSelectedCategoryName = () => {
//     if (selectedCategory === 'all') return 'All Categories';
//     return selectedCategory;
//   };

//   return (
//     <div className="min-h-screen bg-white text-gray-900 relative">
//       <Navbar />
//       <Toaster position="top-right" />

//       {/* Watermark */}
//       <motion.div
//         className="fixed inset-0 pointer-events-none opacity-[0.06] z-20 flex items-center justify-center"
//         animate={{ scale: [1, 1.08, 1] }}
//         transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
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
//         <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-gray-50 to-white backdrop-blur-sm flex items-center">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
//           <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
//             <motion.div
//               initial={{ opacity: 0, y: -30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7 }}
//               className="mb-6"
//             >
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8, delay: 0.1 }}
//                 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-gray-900 to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
//               >
//                 Our Collection
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed"
//               >
//                 Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
//               </motion.p>
//             </motion.div>

//             <motion.div
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
//             />
//           </div>
//         </section>

//         {/* Stock Alert */}
//         {stockAlert && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="relative z-20 bg-red-50 border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
//           >
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-600" size={20} />
//               <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
//             </div>
//           </motion.div>
//         )}

//         {/* Search & Filters */}
//         <motion.section
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.3 }}
//           className="bg-white/95 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-gray-200 shadow-sm"
//         >
//           <div className="max-w-7xl mx-auto">
//             <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
//               <motion.div
//                 className="flex-1 relative"
//                 whileHover={{ scale: 1.02 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white focus:border-primary transition-all text-sm sm:text-base text-gray-900"
//                 />
//               </motion.div>

//               <div className="relative w-full md:w-64">
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className="w-full flex items-center justify-between px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <span className="text-sm sm:text-base font-medium text-gray-700 truncate">
//                     {getSelectedCategoryName()}
//                   </span>
//                   <motion.div
//                     animate={{ rotate: isDropdownOpen ? 180 : 0 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <ChevronDown className="w-5 h-5 text-gray-400" />
//                   </motion.div>
//                 </button>

//                 {isDropdownOpen && (
//                   <motion.div
//                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                     transition={{ duration: 0.2 }}
//                     className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
//                   >
//                     <button
//                       onClick={() => {
//                         setSelectedCategory('all');
//                         setIsDropdownOpen(false);
//                       }}
//                       className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
//                         selectedCategory === 'all'
//                           ? 'bg-primary/10 text-primary border-l-4 border-primary'
//                           : 'text-gray-700'
//                       }`}
//                     >
//                       All Categories
//                     </button>

//                     {categories.map((cat, idx) => (
//                       <motion.button
//                         key={cat}
//                         onClick={() => {
//                           setSelectedCategory(cat);
//                           setIsDropdownOpen(false);
//                         }}
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: idx * 0.03 }}
//                         className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
//                           selectedCategory === cat
//                             ? 'bg-primary/10 text-primary border-l-4 border-primary'
//                             : 'text-gray-700'
//                         }`}
//                       >
//                         {cat}
//                       </motion.button>
//                     ))}
//                   </motion.div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.section>

//         {/* Products Grid */}
//         <section className="py-8 sm:py-16 px-4 bg-white">
//           <div className="max-w-7xl mx-auto">
//             {loading ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="text-center py-20"
//               >
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-gray-600">Loading premium products...</p>
//               </motion.div>
//             ) : filteredProducts.length > 0 ? (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
//               >
//                 {filteredProducts.map((product, index) => {
//                   const stockStatus = getStockStatus(product.stock);
//                   const isOutOfStock = (product.stock || 0) <= 0;
//                   const inCart = isProductInCart(product.id);
//                   const discountPercent = getDiscountPercentage(product);
//                   const hasVariants = product.hasFlavors && product.flavors && product.flavors.length > 0;
//                   const isDeal = product.category === 'Deal' && product.dealName;
                  
//                   return (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                       animate={{ opacity: 1, y: 0, scale: 1 }}
//                       transition={{
//                         delay: index * 0.08,
//                         type: "spring",
//                         stiffness: 100,
//                         damping: 15
//                       }}
//                       whileHover={{ y: -8, transition: { duration: 0.3 } }}
//                       className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-200 flex flex-col"
//                     >
//                       <Link href={`/product/${product.id}`}>
//                         <div className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer rounded-t-lg">
//                           {isDeal && (
//                             <div className="absolute left-1/2 -translate-x-1/2 top-1 z-10 w-[85%] sm:w-[80%]">
//                               <div className="relative">
//                                 <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-lg shadow-lg flex items-center justify-center gap-0.5 sm:gap-1 mx-auto w-full border-2 border-white/30 animate-pulse">
//                                   <span className="text-[6px] sm:text-[8px] md:text-[10px]">🔥</span>
//                                   <span className="truncate font-bold tracking-wide text-[7px] sm:text-[9px] md:text-xs">{product.dealName}</span>
//                                   <span className="text-[6px] sm:text-[8px] md:text-[10px]">🔥</span>
//                                 </div>
//                                 <div className="absolute -bottom-0.5 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-50"></div>
//                               </div>
//                             </div>
//                           )}

//                           <motion.img
//                             whileHover={{ scale: 1.08 }}
//                             transition={{ duration: 0.3 }}
//                             src={product.image || '/placeholder-image.png'}
//                             alt={product.name}
//                             className="w-full h-full object-contain p-2"
//                             onError={(e) => {
//                               e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                             }}
//                           />

//                           {hasVariants && (
//                             <div className="absolute bottom-2 left-2 bg-blue-500/90 text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                               <span>{product.flavors?.length || 0} Variants</span>
//                             </div>
//                           )}

//                           <motion.div
//                             initial={{ opacity: 0 }}
//                             whileHover={{ opacity: 1 }}
//                             className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300"
//                           >
//                             <motion.span
//                               initial={{ scale: 0 }}
//                               whileHover={{ scale: 1 }}
//                               className="text-white font-semibold text-xs sm:text-sm bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
//                             >
//                               View Details
//                             </motion.span>
//                           </motion.div>
//                         </div>
//                       </Link>

//                       <div className="p-2 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col">
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.1 }}
//                         >
//                           <div className="flex items-center justify-between">
//                             <p className={`text-[10px] sm:text-xs uppercase tracking-widest font-bold ${
//                               isDeal ? 'text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full' : 'text-primary'
//                             }`}>
//                               {isDeal ? ` ${product.category}` : product.category}
//                             </p>
//                           </div>
//                           <div className="flex items-center flex-wrap gap-1.5">
//                             <h3 className="font-serif font-bold text-gray-900 line-clamp-2 text-xs sm:text-base leading-snug">
//                               {product.name}
//                             </h3>
//                           </div>
//                         </motion.div>
                        
//                         <motion.div
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.2 }}
//                           className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1"
//                         >
//                           <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
//                             <span className="text-sm sm:text-2xl font-bold text-primary">
//                               {formatPrice(getFinalPrice(product))}
//                             </span>
//                             {hasValidDiscount(product) && (
//                               <span className="text-[10px] sm:text-sm text-gray-500 line-through font-medium">
//                                 {formatPrice(product.price)}
//                               </span>
//                             )}
//                           </div>

//                           <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.color}`}>
//                             {isOutOfStock ? (
//                               <AlertCircle size={12} className="sm:w-4 sm:h-4" />
//                             ) : (product.stock || 0) < 5 ? (
//                               <Clock size={12} className="sm:w-4 sm:h-4" />
//                             ) : (
//                               <CheckCircle size={12} className="sm:w-4 sm:h-4" />
//                             )}
//                             <span>{stockStatus.label}</span>
//                           </div>
//                         </motion.div>

//                         {inCart ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-green-500 text-white cursor-default opacity-80"
//                           >
//                             <CheckCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">In Cart</span>
//                             <span className="xs:hidden">In Cart</span>
//                           </button>
//                         ) : isOutOfStock ? (
//                           <button
//                             disabled
//                             className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gray-100 text-gray-400 cursor-not-allowed"
//                           >
//                             <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
//                             <span className="hidden xs:inline">Out of Stock</span>
//                             <span className="xs:hidden">OOS</span>
//                           </button>
//                         ) : (
//                           <motion.button
//   onClick={() => handleAddToCart(product)}
//   whileHover={{ scale: 1.05 }}
//   whileTap={{ scale: 0.95 }}
//   className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md cursor-pointer"
// >
//   <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
  
//   {/* ✅ 550px se upar "Add to Cart" */}
//   <span className="hidden min-[550px]:inline">Add to Cart</span>
  
//   {/* ✅ 550px se neechay "Add" (sirf text, no extra icon) */}
//   <span className="min-[550px]:hidden">Add</span>
// </motion.button>
//                         )}
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </motion.div>
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 className="text-center py-12 sm:py-20 bg-white rounded-lg border border-gray-200"
//               >
//                 <motion.div
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                   className="mb-4 sm:mb-6"
//                 >
//                   <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-gray-400 mx-auto opacity-30" />
//                 </motion.div>
//                 <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
//                 <motion.button
//                   onClick={() => {
//                     setSearchTerm('');
//                     setSelectedCategory('all');
//                   }}
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
//                 >
//                   Clear Filters
//                   <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
//                 </motion.button>
//               </motion.div>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
//           <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
//             <p>&copy; 2026 M&M Scents. All rights reserved.</p>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }



//with deal color

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Navbar from '@/components/Navbar';
import { CartItem, useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle, CheckCircle, Clock, ChevronDown, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
  hasFlavors?: boolean;
  flavors?: Array<{ id: string; name: string; price: number; discount?: number; stock: number; image?: string; }>;
  dealName?: string;
  dealColor?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [stockAlert, setStockAlert] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const getFinalPrice = (product: Product) => {
    if (hasValidDiscount(product)) {
      return product.price - product.discount!;
    }
    return product.price;
  };

  const getDiscountPercentage = (product: Product) => {
    if (!hasValidDiscount(product)) return 0;
    return Math.round((product.discount! / product.price) * 100);
  };

  const getStockStatus = (stock: number = 0) => {
    if (stock <= 0) {
      return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    } else if (stock < 5) {
      return { label: `Only ${stock} left`, color: 'text-yellow-600 bg-yellow-50' };
    } else {
      return { label: 'In Stock', color: 'text-green-600 bg-green-50' };
    }
  };

  // ✅ Custom Toast Function
  const showCustomToast = (message: string, icon: string = '🛒') => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col overflow-hidden border border-gray-200`}
      >
        <div className="flex items-center p-4 gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {message}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Added to your cart
            </p>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="h-1 bg-green-100 w-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 2, ease: "linear" }}
            className="h-full bg-green-500 rounded-full"
          />
        </div>
      </div>
    ), {
      duration: 2000,
      position: 'top-right',
    });
  };

  // ✅ Error Toast
  const showErrorToast = (message: string, icon: string = '❌') => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col overflow-hidden border border-red-200`}
      >
        <div className="flex items-center p-4 gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-700 truncate">
              {message}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Please try again
            </p>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t.id);
            }}
            className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        <div className="h-1 bg-red-100 w-full overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 2, ease: "linear" }}
            className="h-full bg-red-500 rounded-full"
          />
        </div>
      </div>
    ), {
      duration: 2000,
      position: 'top-right',
    });
  };

  // Fetch products
  useEffect(() => {
    const productsRef = ref(rtdb, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const productsData: Product[] = [];
        const categorySet = new Set<string>();
        const data = snapshot.val();
        
        Object.keys(data).forEach((key) => {
          const product = {
            id: key,
            ...data[key]
          } as Product;
          productsData.push(product);
          if (product.category) {
            categorySet.add(product.category);
          }
        });

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(Array.from(categorySet).sort());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      showErrorToast('Please login to add items to cart', '🔒');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    if (isProductInCart(product.id)) {
      showErrorToast(`${product.name} is already in your cart!`, '⚠️');
      return;
    }

    const currentStock = product.stock || 0;
    if (currentStock <= 0) {
      showErrorToast(`${product.name} is out of stock!`, '❌');
      setStockAlert(product.name);
      setTimeout(() => setStockAlert(null), 3000);
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

    showCustomToast(`${product.name} added to cart!`, '🛒');
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === 'all') return 'All Categories';
    return selectedCategory;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      <Navbar />
      <Toaster position="top-right" />

      {/* Watermark */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.06] z-20 flex items-center justify-center"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
          alt="M&M Watermark"
          className="w-96 h-96 object-contain"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <section className="relative w-full min-h-[calc(100vh-64px)] max-h-[600px] overflow-hidden bg-gradient-to-b from-gray-50 to-white backdrop-blur-sm flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          
          <div className="relative w-full max-w-7xl mx-auto px-4 py-12 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-gray-900 to-accent bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight text-balance"
              >
                Our Collection
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed"
              >
                Discover our handpicked selection of premium perfumes, luxurious wax collections, and skincare essentials. Each product is curated for quality and elegance.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-1.5 bg-gradient-to-r from-primary via-accent to-transparent w-40 origin-left rounded-full"
            />
          </div>
        </section>

        {/* Stock Alert */}
        {stockAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative z-20 bg-red-50 border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-700 font-medium">{stockAlert} is currently out of stock</p>
            </div>
          </motion.div>
        )}

        {/* Search & Filters */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm sticky top-14 z-10 py-4 sm:py-6 px-4 border-b border-gray-200 shadow-sm"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center">
              <motion.div
                className="flex-1 relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary" size={20} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white focus:border-primary transition-all text-sm sm:text-base text-gray-900"
                />
              </motion.div>

              <div className="relative w-full md:w-64">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-700 truncate">
                    {getSelectedCategoryName()}
                  </span>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
                  >
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
                        selectedCategory === 'all'
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'text-gray-700'
                      }`}
                    >
                      All Categories
                    </button>

                    {categories.map((cat, idx) => (
                      <motion.button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium ${
                          selectedCategory === cat
                            ? 'bg-primary/10 text-primary border-l-4 border-primary'
                            : 'text-gray-700'
                        }`}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Products Grid */}
        <section className="py-8 sm:py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">Loading premium products...</p>
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
              >
                {filteredProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock);
                  const isOutOfStock = (product.stock || 0) <= 0;
                  const inCart = isProductInCart(product.id);
                  const discountPercent = getDiscountPercentage(product);
                  const hasVariants = product.hasFlavors && product.flavors && product.flavors.length > 0;
                  const isDeal = product.category === 'Deal' && product.dealName;
                  const dealColor = product.dealColor || '#FF6B35';
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: index * 0.08,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-gray-200 flex flex-col"
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer rounded-t-lg">
                          {/* ✅ DEAL BADGE - WITH ADMIN COLOR */}
                          {isDeal && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-1 z-10 w-[85%] sm:w-[80%]">
                              <div className="relative">
                                <div 
                                  className="text-white text-[8px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-lg shadow-lg flex items-center justify-center gap-0.5 sm:gap-1 mx-auto w-full border-2 border-white/30 animate-pulse"
                                  style={{ backgroundColor: dealColor }}
                                >
                                  <span className="text-[6px] sm:text-[8px] md:text-[10px]">🔥</span>
                                  <span className="truncate font-bold tracking-wide text-[7px] sm:text-[9px] md:text-xs">{product.dealName}</span>
                                  <span className="text-[6px] sm:text-[8px] md:text-[10px]">🔥</span>
                                </div>
                                <div 
                                  className="absolute -bottom-0.5 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-50"
                                  style={{
                                    backgroundImage: `linear-gradient(to right, transparent, ${dealColor}80, transparent)`,
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <motion.img
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.3 }}
                            src={product.image || '/placeholder-image.png'}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
                            }}
                          />

                          {hasVariants && (
                            <div className="absolute bottom-2 left-2 bg-blue-500/90 text-white text-[8px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                              <span>{product.flavors?.length || 0} Variants</span>
                            </div>
                          )}

                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300"
                          >
                            <motion.span
                              initial={{ scale: 0 }}
                              whileHover={{ scale: 1 }}
                              className="text-white font-semibold text-xs sm:text-sm bg-black/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded backdrop-blur-sm"
                            >
                              View Details
                            </motion.span>
                          </motion.div>
                        </div>
                      </Link>

                      <div className="p-2 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <p className={`text-[10px] sm:text-xs uppercase tracking-widest font-bold ${
                              isDeal ? 'text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full' : 'text-primary'
                            }`}>
                              {isDeal ? ` ${product.category}` : product.category}
                            </p>
                          </div>
                          <div className="flex items-center flex-wrap gap-1.5">
                            <h3 className="font-serif font-bold text-gray-900 line-clamp-2 text-xs sm:text-base leading-snug">
                              {product.name}
                            </h3>
                          </div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="space-y-1 sm:space-y-1.5 pt-0.5 sm:pt-1"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className="text-sm sm:text-2xl font-bold text-primary">
                              {formatPrice(getFinalPrice(product))}
                            </span>
                            {hasValidDiscount(product) && (
                              <span className="text-[10px] sm:text-sm text-gray-500 line-through font-medium">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>

                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.color}`}>
                            {isOutOfStock ? (
                              <AlertCircle size={12} className="sm:w-4 sm:h-4" />
                            ) : (product.stock || 0) < 5 ? (
                              <Clock size={12} className="sm:w-4 sm:h-4" />
                            ) : (
                              <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                            )}
                            <span>{stockStatus.label}</span>
                          </div>
                        </motion.div>

                        {inCart ? (
                          <button
                            disabled
                            className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-green-500 text-white cursor-default opacity-80"
                          >
                            <CheckCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden xs:inline">In Cart</span>
                            <span className="xs:hidden">In Cart</span>
                          </button>
                        ) : isOutOfStock ? (
                          <button
                            disabled
                            className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gray-100 text-gray-400 cursor-not-allowed"
                          >
                            <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
                            <span className="hidden xs:inline">Out of Stock</span>
                            <span className="xs:hidden">OOS</span>
                          </button>
                        ) : (
                          <motion.button
                            onClick={() => handleAddToCart(product)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-1.5 sm:py-3 rounded-lg font-bold flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm md:text-base bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md cursor-pointer"
                          >
                            <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px]" />
                            
                            {/* ✅ 550px se upar "Add to Cart" */}
                            <span className="hidden min-[550px]:inline">Add to Cart</span>
                            
                            {/* ✅ 550px se neechay "Add" */}
                            <span className="min-[550px]:hidden">Add</span>
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 sm:py-20 bg-white rounded-lg border border-gray-200"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-4 sm:mb-6"
                >
                  <Filter size={36} className="sm:w-[48px] sm:h-[48px] text-gray-400 mx-auto opacity-30" />
                </motion.div>
                <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg">No products found matching your criteria</p>
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
                >
                  Clear Filters
                  <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-6 sm:py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="max-w-7xl mx-auto text-center text-gray-600 text-xs sm:text-sm">
            <p>&copy; 2026 M&M Scents. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}