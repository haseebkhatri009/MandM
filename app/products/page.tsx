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
import { Search, Filter, ArrowRight, ShoppingCart, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  description?: string;
  stock?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [stockAlert, setStockAlert] = useState<string | null>(null);

  // Fetch products from Realtime Database
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

  // Filter products based on search and category
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
      router.push('/login');
      return;
    }

    const currentStock = product.stock || 0;
    if (currentStock <= 0) {
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
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {/* Watermark - Same as orders page */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.08] z-20 flex items-center justify-center"
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
        <section className="bg-gradient-to-b from-secondary/90 to-background/90 border-b border-border/50 py-24 px-4 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
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
                className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent mb-6 leading-tight text-balance"
              >
                Our Collection
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
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
            className="relative z-20 bg-red-50/90 backdrop-blur-sm border-l-4 border-red-500 p-4 m-4 max-w-7xl mx-auto rounded"
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
          className="bg-card/80 backdrop-blur-sm sticky top-14 z-10 py-6 px-4 border-b border-border shadow-sm "
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center ">
              {/* Search */}
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input/90 backdrop-blur-sm focus:border-primary transition-all"
                />
              </motion.div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  onClick={() => setSelectedCategory('all')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-secondary/80 backdrop-blur-sm text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  All
                </motion.button>
                {categories.map((cat, idx) => (
                  <motion.button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-secondary/80 backdrop-blur-sm text-foreground hover:bg-muted border border-border'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Products Grid */}
        <section className="py-16 px-4">
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
                <p className="text-muted-foreground">Loading premium products...</p>
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => (
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
                    className="bg-card/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all group border border-border/50 flex flex-col"
                  >
                    {/* Clickable Image Container */}
                    <Link href={`/product/${product.id}`}>
                      <div className="relative w-full aspect-square bg-secondary/50 overflow-hidden cursor-pointer rounded-t-lg">
                        <motion.img
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.3 }}
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
                          }}
                        />

                        {/* Discount Badge */}
                        {product.discount && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="absolute top-3 right-3 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                          >
                            -{Math.round((product.discount / product.price) * 100)}%
                          </motion.div>
                        )}

                        {/* Stock Status Badge */}
                        <div className="absolute bottom-3 left-3">
                          {(product.stock || 0) <= 0 ? (
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                              Out of Stock
                            </span>
                          ) : (product.stock || 0) < 5 ? (
                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                              Only {product.stock} left
                            </span>
                          ) : (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                              In Stock
                            </span>
                          )}
                        </div>

                        {/* Overlay on Hover */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center"
                        >
                          <motion.span
                            initial={{ scale: 0 }}
                            whileHover={{ scale: 1 }}
                            className="text-white font-semibold text-sm bg-black/50 px-4 py-2 rounded backdrop-blur-sm"
                          >
                            View Details
                          </motion.span>
                        </motion.div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <p className="text-xs text-primary mb-2 uppercase tracking-widest font-bold letter-spacing">
                          {product.category}
                        </p>
                        <h3 className="font-serif font-bold text-foreground mb-2 line-clamp-2 text-base leading-snug">
                          {product.name}
                        </h3>
                      </motion.div>

                      {product.description && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed"
                        >
                          {product.description}
                        </motion.p>
                      )}
                      
                      {/* Price */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 pt-2"
                      >
                        <span className="text-2xl font-bold text-primary">
                          ₹{Math.round(product.price - (product.discount || 0))}
                        </span>
                        {product.discount && (
                          <span className="text-sm text-muted-foreground line-through font-medium">
                            ₹{product.price}
                          </span>
                        )}
                      </motion.div>

                      {/* Add to Cart Button */}
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        whileHover={{ scale: (product.stock || 0) > 0 ? 1.05 : 1 }}
                        whileTap={{ scale: (product.stock || 0) > 0 ? 0.95 : 1 }}
                        disabled={(product.stock || 0) <= 0}
                        className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 mt-auto text-sm md:text-base ${
                          (product.stock || 0) <= 0
                            ? 'bg-muted/70 text-muted-foreground cursor-not-allowed opacity-50 backdrop-blur-sm'
                            : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg active:shadow-md'
                        }`}
                      >
                        {(product.stock || 0) > 0 ? (
                          <>
                            <ShoppingCart size={18} />
                            Add to Cart
                          </>
                        ) : (
                          <>
                            <AlertCircle size={18} />
                            Out of Stock
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-card/90 backdrop-blur-sm rounded-lg border border-border"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-6"
                >
                  <Filter size={48} className="text-muted-foreground mx-auto opacity-30" />
                </motion.div>
                <p className="text-muted-foreground mb-6 text-lg">No products found matching your criteria</p>
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                >
                  Clear Filters
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Footer */}
        {/* <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-t from-secondary/90 to-background/90 py-12 px-4 mt-16 border-t border-border backdrop-blur-sm"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
                alt="M&M Scents"
                className="h-16 w-auto mx-auto mb-4 opacity-60 hover:opacity-100 transition-opacity"
                whileHover={{ scale: 1.1 }}
              />
            </motion.div>

            <motion.div
              className="text-center text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="mb-2">&copy; 2024 M&M Scents. All rights reserved.</p>
              <p className="text-xs text-muted-foreground/60">Crafted with care for your beauty</p>
            </motion.div>
          </div>
        </motion.footer> */}
        <footer className="bg-white py-8 px-4 border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
  <div className="max-w-7xl mx-auto text-center text-muted-foreground text-sm">
    <p>&copy; 2024 M&M Scents. All rights reserved.</p>
  </div>
</footer>
      </div>
    </div>
  );
}