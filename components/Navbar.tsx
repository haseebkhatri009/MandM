'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCart } from '@/lib/cartContext';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg" 
              alt="M&M Scents Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="hidden sm:inline font-serif text-lg text-primary font-semibold">
              M&M Scents
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/products" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Shop
            </Link>
            {user && (
              <Link 
                href="/orders" 
                className="text-foreground hover:text-primary transition-colors"
              >
                My Orders
            </Link>)}
            
            {isAdmin && (
              <Link 
                href="/admin" 
                className="px-3 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Admin
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-3 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                Login
              </Link>
            )}

            {/* Cart Icon */}
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground"
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
            className="md:hidden pb-4 border-t border-border"
          >
            <div className="flex flex-col gap-3 pt-4">
              <Link 
                href="/products" 
                className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>

              {user && (
                <Link 
                  href="/orders" 
                  className="px-4 py-2 hover:bg-secondary rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
              )}
              
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}

              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors"
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
