'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Heart, 
  Sparkles, 
  Leaf, 
  Award, 
  Users, 
  Quote, 
  Star,
  Shield,
  Gift,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Quality',
      description: 'Every product is crafted with love and attention to detail, ensuring the highest quality standards.',
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
    {
      icon: Leaf,
      title: 'Natural Ingredients',
      description: 'We believe in the power of nature. Our products are made with premium natural ingredients.',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      icon: Sparkles,
      title: 'Luxury Experience',
      description: 'From packaging to fragrance, every element is designed to provide a luxurious experience.',
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We are committed to honesty and transparency in everything we do.',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ];

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Handpicked ingredients and meticulous crafting process',
    },
    {
      icon: Users,
      title: 'Customer First',
      description: 'Your satisfaction is our top priority',
    },
    {
      icon: Clock,
      title: 'Timeless Elegance',
      description: 'Classic fragrances that never go out of style',
    },
    {
      icon: Gift,
      title: 'Perfect Gifts',
      description: 'Beautifully packaged products for every occasion',
    },
  ];

  const teamMembers = [
    {
      name: 'M&M Scents Team',
      role: 'Founders & Creators',
      description: 'Passionate about bringing luxury fragrances to everyone',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30 relative overflow-hidden">
      {/* Watermark */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-[0.04] z-0 flex items-center justify-center"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-JcYvSSgzZgAPnalbf3iR7aptCoX1JC.jpg"
          alt="Watermark"
          className="w-96 h-96 object-contain"
        />
      </motion.div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
            >
              <Heart size={16} className="text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">Our Story</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent"
            >
              Crafting Elegance,<br />
              <span className="text-primary">One Scent at a Time</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
            >
              Welcome to M&M Scents, where luxury meets nature. We are passionate about creating 
              premium perfumes, luxurious wax collections, and skincare essentials that elevate 
              your everyday experience.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
              >
                Explore Our Collection
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm font-medium text-primary">Our Story</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                The Story Behind <br />
                <span className="text-primary">M&M Scents</span>
              </h2>
              
              <p className="text-muted-foreground leading-relaxed">
                M&M Scents was born from a simple yet profound love for fragrances and the desire to 
                create products that make people feel special. Our journey began with a vision to 
                bring premium quality perfumes, wax collections, and skincare essentials to everyone 
                who appreciates the finer things in life.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                What started as a passion project has grown into a brand that stands for quality, 
                elegance, and authenticity. Every product we create is a testament to our commitment 
                to excellence and our love for the art of perfumery.
              </p>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">M</div>
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">M</div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">M&M Scents</p>
                  <p className="text-sm text-muted-foreground">Est. 2026</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl" />
                <div className="absolute inset-4 bg-gradient-to-tr from-primary/5 to-accent/5 rounded-2xl" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-8xl mb-4">✨</div>
                    <h3 className="text-2xl font-serif font-bold text-foreground">Quality You Can Smell</h3>
                    <p className="text-muted-foreground mt-2">Premium fragrances crafted with love</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"
                />
                <motion.div
                  animate={{ 
                    rotate: -360,
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                    scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-16 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Quote size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Our Mission</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
              Our Mission & Vision
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              To create luxurious, high-quality products that bring joy and elegance to everyday life. 
              We believe that everyone deserves to experience the finest fragrances and skincare, 
              crafted with care and made accessible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-4 bg-white/50 rounded-xl border border-border backdrop-blur-sm"
                >
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why M&M Scents */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Star size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Why Choose Us</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              What Makes <span className="text-primary">M&M Scents</span> Special?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-16 h-16 ${value.bg} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-8 h-8 ${value.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Special Section */}
      <section className="relative z-10 py-16 px-4 bg-gradient-to-b from-secondary/30 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">What's Special</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
              Our Promise to You
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h4 className="font-semibold text-foreground">100% Authentic</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Every product is genuine and crafted with the finest ingredients.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="p-6 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <h4 className="font-semibold text-foreground">Made with Love</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Each product is created with passion and attention to detail.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="p-6 bg-card rounded-xl border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <h4 className="font-semibold text-foreground">Premium Quality</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  We never compromise on quality. Only the best for our customers.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12"
            >
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                Discover Our Products
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
}