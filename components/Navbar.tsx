// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/authContext';
// import { useCart } from '@/lib/cartContext';
// import { ShoppingCart, Menu, X } from 'lucide-react';
// import { useState } from 'react';
// import { motion } from 'framer-motion';

// export default function Navbar() {
//   const { user, isAdmin, logout } = useAuth();
//   const { cartItems } = useCart();
//   const router = useRouter();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.push('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-white  border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <motion.img 
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg" 
//               alt="M&M Scents Logo" 
//               className="w-10 h-10 object-contain"
//               whileHover={{ scale: 1.05, rotate: -5 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             />
// <span className="font-serif text-base sm:text-lg text-primary font-bold">
//               M&M Scents
//             </span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             <Link 
//               href="/products" 
//               className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
//             >
//               Shop
//             </Link>
//             {user && (
//               <Link 
//                 href="/orders" 
//                 className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
//               >
//                 My Orders
//               </Link>
//             )}
            
//             {isAdmin && (
//               <Link 
//                 href="/admin" 
//                 className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg"
//               >
//                 Admin
//               </Link>
//             )}

//             {user ? (
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-105"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 href="/login" 
//                 className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg hover:scale-105"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Cart Icon */}
//             <Link href="/cart" className="relative group">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors duration-300" />
//               </motion.div>
//               {cartCount > 0 && (
//                 <motion.span 
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
//                 >
//                   {cartCount}
//                 </motion.span>
//               )}
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-4">
//             <Link href="/cart" className="relative">
//               <ShoppingCart className="w-5 h-5 text-gray-700" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-md">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="text-gray-700 hover:text-primary transition-colors"
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="md:hidden pb-4 border-t border-gray-200 bg-white"
//           >
//             <div className="flex flex-col gap-3 pt-4">
//               <Link 
//                 href="/products" 
//                 className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Shop
//               </Link>

//               {user && (
//                 <Link 
//                   href="/orders" 
//                   className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   My Orders
//                 </Link>
//               )}
              
//               {isAdmin && (
//                 <Link 
//                   href="/admin" 
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Admin
//                 </Link>
//               )}

//               {user ? (
//                 <>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuOpen(false);
//                     }}
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 text-left font-medium"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link 
//                   href="/login" 
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </nav>
//   );
// }




// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/authContext';
// import { useCart } from '@/lib/cartContext';
// import { ShoppingCart, Menu, X, User } from 'lucide-react';
// import { useState } from 'react';
// import { motion } from 'framer-motion';

// export default function Navbar() {
//   const { user, isAdmin, logout } = useAuth();
//   const { cartItems } = useCart();
//   const router = useRouter();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.push('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-white  border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <motion.img 
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg" 
//               alt="M&M Scents Logo" 
//               className="w-10 h-10 object-contain"
//               whileHover={{ scale: 1.05, rotate: -5 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             />
//             <span className="font-serif text-base sm:text-lg text-primary font-bold">
//               M&M Scents
//             </span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             <Link 
//               href="/products" 
//               className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
//             >
//               Shop
//             </Link>
//             {user && (
//               <Link 
//                 href="/orders" 
//                 className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
//               >
//                 My Orders
//               </Link>
//             )}
            
//             {user && (
//               isAdmin ? (
//                 <Link 
//                   href="/admin" 
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg"
//                 >
//                   Admin
//                 </Link>
//               ) : (
//                 <Link 
//                   href="/profile" 
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-105 flex items-center gap-2"
//                 >
//                   <User className="w-4 h-4" />
//                   Profile
//                 </Link>
//               )
//             )}

//             {user ? (
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-105"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 href="/login" 
//                 className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg hover:scale-105"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Cart Icon */}
//             <Link href="/cart" className="relative group">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors duration-300" />
//               </motion.div>
//               {cartCount > 0 && (
//                 <motion.span 
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
//                 >
//                   {cartCount}
//                 </motion.span>
//               )}
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-4">
//             <Link href="/cart" className="relative">
//               <ShoppingCart className="w-5 h-5 text-gray-700" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-md">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="text-gray-700 hover:text-primary transition-colors"
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="md:hidden pb-4 border-t border-gray-200 bg-white"
//           >
//             <div className="flex flex-col gap-3 pt-4">
//               <Link 
//                 href="/products" 
//                 className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Shop
//               </Link>

//               {user && (
//                 <Link 
//                   href="/orders" 
//                   className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   My Orders
//                 </Link>
//               )}
              
//               {user && (
//                 isAdmin ? (
//                   <Link 
//                     href="/admin" 
//                     className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Admin
//                   </Link>
//                 ) : (
//                   <Link 
//                     href="/profile" 
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <User className="w-4 h-4" />
//                     Profile
//                   </Link>
//                 )
//               )}

//               {user ? (
//                 <>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuOpen(false);
//                     }}
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 text-left font-medium"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link 
//                   href="/login" 
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </nav>
//   );
// }








//cart icon qty issue resolved 
// 'use client';

// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/authContext';
// import { useCart } from '@/lib/cartContext';
// import { ShoppingCart, Menu, X, User } from 'lucide-react';
// import { useState } from 'react';
// import { motion } from 'framer-motion';

// export default function Navbar() {
//   const { user, isAdmin, logout } = useAuth();
//   const { cartItems } = useCart();
//   const router = useRouter();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   // Get the number of unique products (types) in cart
//   const uniqueProductCount = cartItems.length;

//   const handleLogout = async () => {
//     try {
//       await logout();
//       router.push('/');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-white  border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <motion.img 
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg" 
//               alt="M&M Scents Logo" 
//               className="w-10 h-10 object-contain"
//               whileHover={{ scale: 1.05, rotate: -5 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             />
//             <span className="font-serif text-base sm:text-lg text-primary font-bold">
//               M&M Scents
//             </span>
//           </Link>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-6">
//             <Link 
//               href="/products" 
//               className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
//             >
//               Shop
//             </Link>
//             {user && (
//               <Link 
//                 href="/orders" 
//                 className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
//               >
//                 My Orders
//               </Link>
//             )}
            
//             {user && (
//               isAdmin ? (
//                 <Link 
//                   href="/admin" 
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg"
//                 >
//                   Admin
//                 </Link>
//               ) : (
//                 <Link 
//                   href="/profile" 
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-105 flex items-center gap-2"
//                 >
//                   <User className="w-4 h-4" />
//                   Profile
//                 </Link>
//               )
//             )}

//             {user ? (
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={handleLogout}
//                   className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-105"
//                 >
//                   Logout
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 href="/login" 
//                 className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg hover:scale-105"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Cart Icon */}
//             <Link href="/cart" className="relative group">
//               <motion.div
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors duration-300" />
//               </motion.div>
//               {uniqueProductCount > 0 && (
//                 <motion.span 
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
//                 >
//                   {uniqueProductCount}
//                 </motion.span>
//               )}
//             </Link>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center gap-4">
//             <Link href="/cart" className="relative">
//               <ShoppingCart className="w-5 h-5 text-gray-700" />
//               {uniqueProductCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-md">
//                   {uniqueProductCount}
//                 </span>
//               )}
//             </Link>
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="text-gray-700 hover:text-primary transition-colors"
//             >
//               {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="md:hidden pb-4 border-t border-gray-200 bg-white"
//           >
//             <div className="flex flex-col gap-3 pt-4">
//               <Link 
//                 href="/products" 
//                 className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Shop
//               </Link>

//               {user && (
//                 <Link 
//                   href="/orders" 
//                   className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   My Orders
//                 </Link>
//               )}
              
//               {user && (
//                 isAdmin ? (
//                   <Link 
//                     href="/admin" 
//                     className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     Admin
//                   </Link>
//                 ) : (
//                   <Link 
//                     href="/profile" 
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <User className="w-4 h-4" />
//                     Profile
//                   </Link>
//                 )
//               )}

//               {user ? (
//                 <>
//                   <button
//                     onClick={() => {
//                       handleLogout();
//                       setMobileMenuOpen(false);
//                     }}
//                     className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 text-left font-medium"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <Link 
//                   href="/login" 
//                   className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   Login
//                 </Link>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </div>
//     </nav>
//   );
// }






'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get the number of unique products (types) in cart
  const uniqueProductCount = cartItems.length;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Only your logo image */}
          <Link href="/" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-shrink-0"
            >
              <img 
                src="https://i.ibb.co/G3JRrdXQ/Logo2-removebg-preview.png " 
                alt="M&M Scents Logo" 
                className="h-10 sm:h-12 md:h-14 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
            >
              Shop
            </Link>
            {user && (
              <Link 
                href="/orders" 
                className="text-gray-700 hover:text-primary transition-all duration-300 font-medium hover:scale-105"
              >
                My Orders
              </Link>
            )}
            
            {user && (
              isAdmin ? (
                <Link 
                  href="/admin" 
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg"
                >
                  Admin
                </Link>
              ) : (
                <Link 
                  href="/profile" 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-105 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
              )
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium hover:shadow-lg hover:scale-105"
              >
                Login
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative group">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors duration-300" />
              </motion.div>
              {uniqueProductCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md"
                >
                  {uniqueProductCount}
                </motion.span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {uniqueProductCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-md">
                  {uniqueProductCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden pb-4 border-t border-gray-200 bg-white"
          >
            <div className="flex flex-col gap-3 pt-4">
              <Link 
                href="/products" 
                className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>

              {user && (
                <Link 
                  href="/orders" 
                  className="px-4 py-2 hover:bg-gray-50 rounded-lg transition-all duration-300 text-gray-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              
              {user && (
                isAdmin ? (
                  <Link 
                    href="/admin" 
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                ) : (
                  <Link 
                    href="/profile" 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-center flex items-center justify-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                )
              )}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 text-left font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}