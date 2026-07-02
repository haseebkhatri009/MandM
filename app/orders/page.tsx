'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'dispatched' | 'delivered';
  userEmail: string;
  userPhone: string;
  userAddress: string;
  createdAt: number;
  adminNotes?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    // Fetch user's orders
    const ordersRef = ref(rtdb, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const userOrders: Order[] = [];
        const data = snapshot.val();

        Object.keys(data).forEach((key) => {
          const order = { id: key, ...data[key] } as Order;
          if (order.userId === user.uid) {
            userOrders.push(order);
          }
        });

        // Sort by date (newest first)
        userOrders.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(userOrders);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'dispatched':
        return <Truck className="text-blue-600" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'dispatched':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'delivered':
        return 'bg-green-100 border-green-300 text-green-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {/* Watermark - Positioned absolutely behind content */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.08] z-0 flex items-center justify-center"
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
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
          alt="M&M Watermark"
          className="w-96 h-96 object-contain"
        />
      </motion.div>

      {/* Main Content - Positioned above watermark */}
      <div className="relative z-10">
        {/* Header */}
        {/* <section className="bg-gradient-to-b from-secondary/90 to-background/90 border-b border-border py-12 px-4 backdrop-blur-sm"> */}
        <section className="relative z-0 bg-gradient-to-b from-secondary/40 to-background/40 py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-serif font-bold mb-2 text-foreground">My Orders</h1>
              <p className="text-muted-foreground">Track your M&M Scents orders</p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
  {orders.length === 0 ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 bg-transparent backdrop-blur-none rounded-lg border border-gray-200/30 shadow-sm"
    >
      <Package size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
      <p className="text-gray-600 mb-6">You haven&apos;t placed any orders yet</p>
      <motion.a
        href="/products"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg"
      >
        Start Shopping
      </motion.a>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {orders.map((order, idx) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className=" bg-transparent backdrop-blur-none border border-gray-700/20 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
        >
          <div className=" grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Order ID & Date */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Order ID</p>
              <p className="font-mono text-sm font-bold text-gray-800">{order.id.slice(0, 8)}...</p>
              <p className="text-xs text-gray-500 mt-2">{formatDate(order.createdAt)}</p>
            </div>

            {/* Items Count */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Items</p>
              <p className="text-lg font-bold text-gray-800">{order.items.length}</p>
              <p className="text-xs text-gray-500">Total: {order.items.reduce((sum, item) => sum + item.quantity, 0)} units</p>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Total</p>
              <p className="text-lg font-bold text-primary">₹{order.total}</p>
            </div>

            {/* Status & Action */}
            <div className="flex flex-col gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="font-semibold capitalize">{order.status}</span>
              </div>
              <motion.button
                onClick={() => {
                  setSelectedOrder(order);
                  setShowModal(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Eye size={16} />
                View Details
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )}
</div>
        </section>
      </div>

      {/* Modal */}
      {showModal && selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-secondary to-background border-b border-border p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-serif font-bold">Order Details</h2>
                <p className="text-sm text-muted-foreground mt-1">ID: {selectedOrder.id}</p>
              </div>
              <motion.button
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.1 }}
                className="text-2xl font-bold text-muted-foreground hover:text-foreground"
              >
                ×
              </motion.button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(selectedOrder.status)}`}>
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(selectedOrder.status)}
                  <span className="font-bold capitalize text-lg">{selectedOrder.status.toUpperCase()}</span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-bold mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 p-4 bg-secondary rounded-lg border border-border"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="font-bold text-primary">₹{item.price} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-bold mb-4">Delivery Information</h3>
                <div className="space-y-3 p-4 bg-secondary rounded-lg border border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold">{selectedOrder.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-semibold">{selectedOrder.userPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semibold">{selectedOrder.userAddress}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedOrder.adminNotes && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold text-blue-900 mb-2">Order Notes</h4>
                  <p className="text-blue-800">{selectedOrder.adminNotes}</p>
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => setShowModal(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}