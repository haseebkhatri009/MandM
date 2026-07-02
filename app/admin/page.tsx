'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { Package, ShoppingCart, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, userData } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  // Check admin access - wait for auth to load first
  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading

    console.log('[v0] Admin check:', { user: user?.email, isAdmin, userData });
    
    if (!user) {
      console.log('[v0] No user, redirecting to login');
      router.push('/login');
    } else if (!isAdmin) {
      console.log('[v0] Not admin, redirecting to home');
      router.push('/');
    } else {
      console.log('[v0] Admin access granted');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch statistics from RTDB
  useEffect(() => {
    if (!isAdmin) return;

    // Fetch products
    const productsRef = ref(rtdb, 'products');
    const productsUnsubscribe = onValue(productsRef, (snapshot) => {
      const productCount = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      setStats(prev => ({ ...prev, totalProducts: productCount }));
    });

    // Fetch orders
    const ordersRef = ref(rtdb, 'orders');
    const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.values(data) as any[];
        const totalOrders = orders.length;
        let totalRevenue = 0;
        let pendingOrders = 0;

        orders.forEach((order) => {
          totalRevenue += order.total || 0;
          if (order.status === 'pending') {
            pendingOrders++;
          }
        });

        setStats(prev => ({
          ...prev,
          totalOrders,
          totalRevenue,
          pendingOrders
        }));
      } else {
        setStats(prev => ({
          ...prev,
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0
        }));
      }
      setLoading(false);
    });

    return () => {
      productsUnsubscribe();
      ordersUnsubscribe();
    };
  }, [isAdmin]);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect happens via useEffect, show blank while redirecting
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-secondary border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your M&M Scents overview</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {/* Total Products */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Total Products</h3>
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
                  <p className="text-xs text-muted-foreground mt-2">Products in catalog</p>
                </motion.div>

                {/* Total Orders */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Total Orders</h3>
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground mt-2">All time orders</p>
                </motion.div>

                {/* Total Revenue */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Total Revenue</h3>
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary">₹{Math.round(stats.totalRevenue).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-2">From completed orders</p>
                </motion.div>

                {/* Pending Orders */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-muted-foreground text-sm font-semibold">Pending Orders</h3>
                    <ShoppingCart className="w-5 h-5 text-yellow-500" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                  <p className="text-xs text-muted-foreground mt-2">Need attention</p>
                </motion.div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Manage Products */}
                <Link
                  href="/admin/products"
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Manage Products</h3>
                      <p className="text-sm text-muted-foreground">Add, edit or delete products</p>
                    </div>
                    <Package className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalProducts} products created
                  </p>
                </Link>

                {/* Manage Orders */}
                <Link
                  href="/admin/orders"
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Manage Orders</h3>
                      <p className="text-sm text-muted-foreground">View and update orders</p>
                    </div>
                    <ShoppingCart className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground text-yellow-600 font-semibold">
                    {stats.pendingOrders} pending orders
                  </p>
                </Link>

                {/* Store Settings */}
                <Link
                  href="/admin/settings"
                  className="bg-card rounded-lg shadow-lg p-6 border border-border hover:shadow-xl hover:border-primary transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Store Settings</h3>
                      <p className="text-sm text-muted-foreground">Banner & delivery charges</p>
                    </div>
                    <Settings className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customize your store
                  </p>
                </Link>

                {/* Analytics */}
                <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Quick Stats</h3>
                      <p className="text-sm text-muted-foreground">Summary view</p>
                    </div>
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>✓ {stats.totalOrders} total orders</p>
                    <p>✓ ₹{Math.round(stats.totalRevenue / Math.max(stats.totalOrders, 1))} avg order</p>
                    <p>✓ {stats.totalProducts} products active</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; 2024 M&M Scents Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
