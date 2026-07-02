'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';

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
              Order Placed Successfully!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto"
            >
              Thank you for your order! We&apos;ll contact you soon on WhatsApp to confirm delivery and payment details.
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
                {orderId}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Keep this ID for reference
              </p>
            </motion.div>

            {/* What's Next */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-secondary rounded-lg p-6 mb-8 text-left"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">What&apos;s Next?</h2>
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
                    We&apos;ll confirm your delivery address and payment method
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
          <p>&copy; 2024 Luxe Beauty. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}