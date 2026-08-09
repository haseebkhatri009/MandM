"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Heart } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Instagram",
      icon: FaInstagram,
      href: "https://www.instagram.com/mandmscentsandglow?igsh=NXVleHFocXI2N2Mx",
      color: "hover:text-pink-500",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      href: "https://www.facebook.com/share/1Ck2neszuH/",
      color: "hover:text-blue-600",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      href: "https://wa.me/923312885639",
      color: "hover:text-green-500",
    },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
    { name: "About Us", href: "/about" },
  ];

  const categories = [
    { name: "Perfumes" },
    { name: "Wax" },
    { name: "Facial Cream" },
    { name: "Body Lotion" },
    { name: "Deals" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-secondary to-background border-t border-border mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <Link href="/" className="block">
              <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                M&M Scents
              </h2>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium perfumes, luxurious wax collections, and skincare
              essentials crafted for elegance and quality.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-all duration-300 ${social.color}`}
                    aria-label={social.name}
                  >
                    <Icon size={20} className="text-foreground/70" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary/30 rounded-full group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Categories - Non-clickable */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 bg-primary/30 rounded-full" />
                    {cat.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <span>Pakistan</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <a
                  href="tel:+923001234567"
                  className="hover:text-primary transition-colors"
                >
                  +92 331 2885639
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:mandmscents@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  mandscents@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock
                  size={16}
                  className="text-primary mt-0.5 flex-shrink-0"
                />
                <span>Mon-Sat: 9:00 AM - 9:00 PM</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8"
        />

        {/* Bottom Bar - Sirf Copyright Center Mein */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>&copy; {currentYear} M&M Scents. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
