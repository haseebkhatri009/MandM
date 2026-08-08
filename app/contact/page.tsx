'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MessageCircle,
  Send,
  CheckCircle,
  ArrowRight,
  User,
  AtSign,
  FileText,
  Sparkles,
  Heart
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { rtdb } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      // value: '+92 300 1234597',
      action: 'https://wa.me/923411293604',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Send us an email',
      // value: 'info@mmscents.com',
      action: 'abdulhaseebkhatri123@gmail.com',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
  ];

  // ✅ Detect if input is email or phone
  const detectInputType = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    // If it contains @ and a dot, it's email
    if (value.includes('@') && value.includes('.')) {
      return 'email';
    }
    // If it's 11 digits and starts with 03, it's phone
    if (digitsOnly.length === 11 && digitsOnly.startsWith('03')) {
      return 'phone';
    }
    // If it's 10-15 digits only, it's phone
    if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
      return 'phone';
    }
    return 'unknown';
  };

  // ✅ Get placeholder text based on input
  const getPlaceholder = (value: string) => {
    const type = detectInputType(value);
    if (type === 'email') return 'Enter your email address';
    if (type === 'phone') return 'Enter your phone number (03XXXXXXXXX)';
    return 'Email or Phone Number';
  };

  // ✅ Get icon based on input
  const getInputIcon = (value: string) => {
    const type = detectInputType(value);
    if (type === 'email') return <Mail className="w-5 h-5 text-blue-500" />;
    if (type === 'phone') return <Phone className="w-5 h-5 text-green-500" />;
    return <AtSign className="w-5 h-5 text-muted-foreground" />;
  };

  // ✅ Get input type for HTML
  const getInputType = (value: string) => {
    const type = detectInputType(value);
    if (type === 'email') return 'email';
    if (type === 'phone') return 'tel';
    return 'text';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Validate email or phone
    const inputValue = formData.emailOrPhone.trim();
    const type = detectInputType(inputValue);

    if (type === 'unknown') {
      toast.error('❌ Please enter a valid email or phone number (03XXXXXXXXX)', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
      });
      setIsSubmitting(false);
      return;
    }

    // ✅ Validate phone format if it's phone
    if (type === 'phone') {
      const digitsOnly = inputValue.replace(/\D/g, '');
      if (digitsOnly.length !== 11 || !digitsOnly.startsWith('03')) {
        toast.error('❌ Please enter a valid phone number (03XXXXXXXXX)', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            padding: '16px',
            borderRadius: '12px',
          },
        });
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const messagesRef = ref(rtdb, 'contact_messages');
      const newMessageRef = push(messagesRef);
      
      await set(newMessageRef, {
        name: formData.name,
        emailOrPhone: formData.emailOrPhone,
        contactType: type, // 'email' or 'phone'
        subject: formData.subject,
        message: formData.message,
        createdAt: new Date().toISOString(),
        status: 'unread',
      });

      toast.success('✅ Message sent successfully! We\'ll get back to you soon.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
      });

      setIsSubmitted(true);
      setFormData({ name: '', emailOrPhone: '', subject: '', message: '' });

      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('Error saving message:', error);
      toast.error('❌ Failed to send message. Please try again.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '12px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <span className="text-sm font-medium text-primary">Get in Touch</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent"
            >
              We'd Love to <br />
              <span className="text-primary">Hear From You</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
            >
              Have questions, feedback, or just want to say hello? Reach out to us through 
              WhatsApp or email. We'll get back to you as soon as possible.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards - Only WhatsApp & Email */}
      <section className="relative z-10 px-4 -mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-4 sm:gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.title}
                href={info.action}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group block bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${info.bg} group-hover:scale-110 transition-transform`}>
                    <info.icon className={`w-6 h-6 ${info.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {info.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                    <p className="text-sm font-medium text-foreground mt-1 truncate">
                      {info.value}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Quick Links */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-2xl p-8 border border-border shadow-lg">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground mb-6">
                  Fill out the form below and we'll respond within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your name"
                        className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Email or Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        {getInputIcon(formData.emailOrPhone)}
                      </div>
                      <input
                        type={getInputType(formData.emailOrPhone)}
                        name="emailOrPhone"
                        value={formData.emailOrPhone}
                        onChange={handleChange}
                        required
                        placeholder={getPlaceholder(formData.emailOrPhone)}
                        className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {formData.emailOrPhone && detectInputType(formData.emailOrPhone) === 'email' ? (
                        <span className="text-blue-500">📧 Email format detected</span>
                      ) : formData.emailOrPhone && detectInputType(formData.emailOrPhone) === 'phone' ? (
                        <span className="text-green-500">📱 Phone number detected</span>
                      ) : (
                        <span>Enter email (user@example.com) or phone (03XXXXXXXXX)</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Subject
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="What is this regarding?"
                        className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || isSubmitted}
                    className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                      isSubmitting || isSubmitted
                        ? 'bg-green-500 cursor-default'
                        : 'bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:scale-[1.02]'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Sending...
                      </>
                    ) : isSubmitted ? (
                      <>
                        <CheckCircle size={20} />
                        Sent Successfully!
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Quick Connect Section - Only WhatsApp & Email */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                  Quick Connect
                </h2>

                <div className="space-y-4">
                  {/* WhatsApp Button */}
                  <motion.a
                    href="https://wa.me/923411293604"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-all group"
                  >
                    <div className="p-3 bg-green-500 rounded-full text-white group-hover:scale-110 transition-transform">
                      <MessageCircle size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Chat on WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Quick replies within minutes</p>
                    </div>
                    <ArrowRight className="text-green-500 group-hover:translate-x-1 transition-transform" />
                  </motion.a>

                  {/* Email Button */}
                  <motion.a
                    href="mailto:abdulhaseebkhatri123@gmail.com"
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-all group"
                  >
                    <div className="p-3 bg-blue-500 rounded-full text-white group-hover:scale-110 transition-transform">
                      <Mail size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Email Us</p>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                    <ArrowRight className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Quick Response Guarantee</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      We aim to respond to all inquiries within 24 hours. For urgent matters, 
                      please reach out via WhatsApp for the fastest response.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


    </div>
  );
}