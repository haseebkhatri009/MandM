'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, update, get } from 'firebase/database';
import { ArrowLeft, MessageCircle, Eye, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
}

interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  orderNotes?: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
  shipped: 'bg-purple-100 text-purple-800 border-purple-300',
  delivered: 'bg-green-100 text-green-800 border-green-300',
  cancelled: 'bg-red-100 text-red-800 border-red-300'
};

const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

// Only "confirmed" status counts as total income
const CONFIRMED_STATUS = 'confirmed';

// Statuses that count as pending income (all except confirmed and cancelled)
const PENDING_STATUSES = ['pending', 'shipped', 'delivered'];

export default function AdminOrdersPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Check admin access - wait for auth to load first
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch orders from RTDB
  useEffect(() => {
    if (!isAdmin) return;

    const ordersRef = ref(rtdb, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const ordersData: Order[] = [];
        const data = snapshot.val();
        
        Object.keys(data).forEach((key) => {
          ordersData.push({
            id: key,
            ...data[key]
          } as Order);
        });
        
        // Sort by newest first
        ordersData.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setOrders(ordersData);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Calculate income statistics
  const calculateIncome = () => {
    let totalIncome = 0;      // Only from "confirmed" orders
    let pendingIncome = 0;    // From "pending", "shipped", "delivered" orders

    orders.forEach(order => {
      // Skip cancelled orders
      if (order.status === 'cancelled') return;

      // Total Income: ONLY "confirmed" orders
      if (order.status === CONFIRMED_STATUS) {
        totalIncome += order.total;
      } 
      // Pending Income: "pending", "shipped", "delivered" orders
      else if (PENDING_STATUSES.includes(order.status)) {
        pendingIncome += order.total;
      }
    });

    return { totalIncome, pendingIncome };
  };

  const { totalIncome, pendingIncome } = calculateIncome();

  // Count orders by status for display
  const pendingCount = orders.filter(o => PENDING_STATUSES.includes(o.status)).length;
  const confirmedCount = orders.filter(o => o.status === CONFIRMED_STATUS).length;

  // Restore stock function (add stock back)
  const restoreStock = async (items: OrderItem[]) => {
    for (const item of items) {
      try {
        const productRef = ref(rtdb, `products/${item.id}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const product = snapshot.val();
          const currentStock = product.stock || 0;
          const newStock = currentStock + item.quantity;
          
          await update(productRef, {
            stock: newStock
          });
          console.log(`✅ Stock restored for ${item.name}: ${currentStock} -> ${newStock}`);
        }
      } catch (error) {
        console.error(`Error restoring stock for ${item.name}:`, error);
      }
    }
  };

  // Cut stock function (subtract stock)
  const cutStock = async (items: OrderItem[]) => {
    for (const item of items) {
      try {
        const productRef = ref(rtdb, `products/${item.id}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const product = snapshot.val();
          const currentStock = product.stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          
          await update(productRef, {
            stock: newStock
          });
          console.log(`✅ Stock cut for ${item.name}: ${currentStock} -> ${newStock}`);
        }
      } catch (error) {
        console.error(`Error cutting stock for ${item.name}:`, error);
      }
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string, order: Order) => {
    const oldStatus = order.status;

    // If status is being changed to cancelled
    if (newStatus === 'cancelled') {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will cancel the order and restore all items to stock!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel order!',
        cancelButtonText: 'No, keep it'
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        // Restore stock for all items in the order
        await restoreStock(order.items);
        
        // Update order status to cancelled
        const orderRef = ref(rtdb, `orders/${orderId}`);
        await update(orderRef, {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });

        await Swal.fire({
          icon: 'success',
          title: 'Order Cancelled!',
          text: 'Order has been cancelled and stock has been restored.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('[v0] Error cancelling order:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to cancel order. Please try again.'
        });
      }
      return;
    }

    // If changing from cancelled to any other status (pending/confirmed/shipped/delivered)
    if (oldStatus === 'cancelled' && newStatus !== 'cancelled') {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This will cut stock for all items in this order!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, restore order!',
        cancelButtonText: 'No, keep cancelled'
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        // Cut stock (subtract) for all items
        await cutStock(order.items);
        
        // Update order status
        const orderRef = ref(rtdb, `orders/${orderId}`);
        await update(orderRef, {
          status: newStatus,
          updatedAt: new Date().toISOString()
        });

        await Swal.fire({
          icon: 'success',
          title: 'Order Restored!',
          text: `Order has been restored to ${newStatus} and stock has been updated.`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('[v0] Error restoring order:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to restore order. Please try again.'
        });
      }
      return;
    }

    // For normal status changes (pending -> confirmed -> shipped -> delivered)
    try {
      const orderRef = ref(rtdb, `orders/${orderId}`);
      await update(orderRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      await Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Order status changed to ${newStatus}`,
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('[v0] Error updating order:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update order status. Please try again.'
      });
    }
  };

  // Wrapper function to handle status change with SweetAlert
  const onStatusChange = async (orderId: string, newStatus: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // If changing to same status, do nothing
    if (order.status === newStatus) return;

    await handleStatusChange(orderId, newStatus, order);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const whatsappUrl = (phoneNumber: string, orderID: string) => {
    const message = encodeURIComponent(
      `Hi! Your order #${orderID} has been confirmed. We will contact you soon with delivery details.`
    );
    return `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Orders Management</h1>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Income Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Total Income Card - Only Confirmed Orders */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">💰 Total Income</p>
                <p className="text-3xl font-bold text-green-800">
                  PKR {totalIncome.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {confirmedCount} confirmed orders
                </p>
                <p className="text-xs text-green-600">
                  (Only confirmed orders included)
                </p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </motion.div>

          {/* Pending Income Card - Pending, Shipped, Delivered Orders */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium mb-1">⏳ Pending Income</p>
                <p className="text-3xl font-bold text-yellow-800">
                  PKR {pendingIncome.toLocaleString()}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  {pendingCount} orders (Pending, Shipped, Delivered)
                </p>
                <p className="text-xs text-yellow-600">
                  (All non-confirmed & non-cancelled orders)
                </p>
              </div>
              <div className="bg-yellow-200 p-3 rounded-full">
                <Clock className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-white'
                : 'bg-secondary text-foreground hover:bg-muted'
            }`}
          >
            All ({orders.length})
          </button>
          {statusOptions.map((status) => {
            const count = orders.filter(o => o.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-foreground hover:bg-muted'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-lg border border-border shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="p-4 bg-secondary border-b border-border">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                      <p className="font-mono font-semibold text-sm">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Customer</p>
                      <p className="font-semibold text-sm">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                      <p className="font-semibold text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount</p>
                      <p className="font-bold text-lg text-primary">PKR {Math.round(order.total).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Customer Info */}
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Customer Info</h3>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>📱 {order.phoneNumber}</p>
                        <p>📧 {order.email}</p>
                        <p>📍 {order.address}, {order.city} - {order.zipCode}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Items</h3>
                      <div className="text-sm space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {item.name} x{item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div>
                      <h3 className="font-semibold mb-3 text-foreground">Status</h3>
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm font-semibold transition-all ${statusColors[order.status]} cursor-pointer`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      {order.status === 'cancelled' && (
                        <p className="text-xs text-red-500 mt-1">
                          ⚠️ Stock restored • Not counted in income
                        </p>
                      )}
                      {order.status === 'confirmed' && (
                        <p className="text-xs text-blue-500 mt-1">
                          💰 Added to Total Income
                        </p>
                      )}
                      {PENDING_STATUSES.includes(order.status) && (
                        <p className="text-xs text-yellow-500 mt-1">
                          ⏳ Added to Pending Income
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {order.orderNotes && (
                    <div className="mb-4 p-3 bg-secondary rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Order Notes</p>
                      <p className="text-sm text-foreground">{order.orderNotes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href={whatsappUrl(order.phoneNumber, order.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
                    >
                      <MessageCircle size={16} />
                      WhatsApp Message
                    </a>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold text-sm"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        )}
      </div>

      {/* Modal for order details */}
      {selectedOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-lg max-w-2xl w-full p-6 border border-border max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Order #{selectedOrder.id}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {selectedOrder.customerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Phone:</strong> {selectedOrder.phoneNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {selectedOrder.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city} - {selectedOrder.zipCode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm p-2 bg-secondary rounded">
                      <span>{item.name}</span>
                      <span>x{item.quantity}</span>
                      <span className="font-semibold">PKR {Math.round(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-lg font-bold">
                  Total: PKR {Math.round(selectedOrder.total).toLocaleString()}
                </p>
                {selectedOrder.status === 'confirmed' && (
                  <p className="text-sm text-green-600 mt-1">
                    ✅ This order is included in Total Income
                  </p>
                )}
                {PENDING_STATUSES.includes(selectedOrder.status) && (
                  <p className="text-sm text-yellow-600 mt-1">
                    ⏳ This order is included in Pending Income
                  </p>
                )}
                {selectedOrder.status === 'cancelled' && (
                  <p className="text-sm text-red-600 mt-1">
                    ❌ Cancelled order - not counted in any income
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-muted transition-colors font-semibold"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}