// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { ArrowLeft, Upload } from 'lucide-react';
// import Link from 'next/link';

// interface Settings {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   deliveryCharges: number;
// }

// export default function AdminSettingsPage() {
//   const { user, isAdmin, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [imagePreview, setImagePreview] = useState('');

//   const [settings, setSettings] = useState<Settings>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: '',
//     deliveryCharges: 0
//   });

//   const [bannerImage, setBannerImage] = useState<File | null>(null);

//   // Check admin access - wait for auth to load first
//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch settings from Realtime Database
//   useEffect(() => {
//     if (!isAdmin) return;

//     const bannerRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(bannerRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setSettings(prev => ({
//           ...prev,
//           ...data
//         }));
//         setImagePreview(data.backgroundImage);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);

//     setBannerImage(file);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       let imageUrl = settings.backgroundImage;

//       // Upload new banner image to ImgBB if selected
//       if (bannerImage) {
//         imageUrl = await uploadToImgBB(bannerImage);
//       }

//       const settingsData = {
//         heading: settings.heading,
//         subheading: settings.subheading,
//         buttonText: settings.buttonText,
//         backgroundImage: imageUrl,
//         deliveryCharges: parseFloat(settings.deliveryCharges.toString()),
//         updatedAt: new Date().toISOString()
//       };

//       // Save to Firebase Realtime Database
//       await set(ref(rtdb, 'admin_settings/banner'), settingsData);

//       alert('Settings saved successfully!');
//       setBannerImage(null);
//     } catch (error) {
//       console.error('[v0] Error saving settings:', error);
//       alert('Error saving settings. Check ImgBB API key.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!isAdmin) {
//     return <div className="p-8">Access Denied</div>;
//   }

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading settings...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-4">
//             <Link href="/admin" className="text-muted-foreground hover:text-foreground">
//               <ArrowLeft size={24} />
//             </Link>
//             <h1 className="text-3xl font-bold">Admin Settings</h1>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-card rounded-lg border border-border shadow-lg p-8"
//         >
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Banner Settings */}
//             <div>
//               <h2 className="text-2xl font-bold mb-6">Banner Settings</h2>
              
//               <div className="space-y-6">
//                 {/* Banner Heading */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Heading</label>
//                   <input
//                     type="text"
//                     value={settings.heading}
//                     onChange={(e) => setSettings(prev => ({...prev, heading: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., M&M Scents Collection"
//                   />
//                 </div>

//                 {/* Banner Subheading */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Subheading</label>
//                   <input
//                     type="text"
//                     value={settings.subheading}
//                     onChange={(e) => setSettings(prev => ({...prev, subheading: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Premium Perfumes, Wax & Skincare"
//                   />
//                 </div>

//                 {/* Button Text */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Button Text</label>
//                   <input
//                     type="text"
//                     value={settings.buttonText}
//                     onChange={(e) => setSettings(prev => ({...prev, buttonText: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Shop Now"
//                   />
//                 </div>

//                 {/* Banner Image Upload */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Image</label>
//                   <div className="flex gap-4">
//                     <div className="flex-1">
//                       <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                         onClick={() => document.getElementById('bannerImageInput')?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground" />
//                         <p className="text-sm text-muted-foreground">Click to upload banner image</p>
//                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
//                       </div>
//                       <input
//                         id="bannerImageInput"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                       />
//                     </div>

//                     {/* Image Preview */}
//                     {imagePreview && (
//                       <div className="w-32 h-32 rounded-lg overflow-hidden border border-border">
//                         <img
//                           src={imagePreview}
//                           alt="Preview"
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   {bannerImage && (
//                     <p className="text-sm text-green-600 mt-2">
//                       ✓ New image selected: {bannerImage.name}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Charges */}
//             <div className="border-t border-border pt-8">
//               <h2 className="text-2xl font-bold mb-6">Delivery Settings</h2>
              
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Delivery Charges (₹)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={settings.deliveryCharges}
//                   onChange={(e) => setSettings(prev => ({...prev, deliveryCharges: parseFloat(e.target.value) || 0}))}
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   placeholder="0"
//                 />
//                 <p className="text-xs text-muted-foreground mt-2">
//                   Set delivery charges that will be added to customer orders
//                 </p>
//               </div>
//             </div>

//             {/* Save Button */}
//             <div className="flex gap-4 pt-8 border-t border-border">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold"
//               >
//                 {saving ? 'Saving...' : 'Save Settings'}
//               </button>
//               <Link
//                 href="/admin"
//                 className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:bg-muted transition-colors font-semibold"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </motion.div>

//         {/* Help Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mt-8 bg-secondary rounded-lg border border-border p-6"
//         >
//           <h3 className="font-bold mb-4">Quick Setup Tips:</h3>
//           <ul className="space-y-2 text-sm text-muted-foreground">
//             <li>• Upload a high-quality banner image (recommended: 1920x600px)</li>
//             <li>• Banner heading and subheading appear over the image</li>
//             <li>• Delivery charges are added to all orders automatically</li>
//             <li>• Changes take effect immediately across the website</li>
//           </ul>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


//with marquee and dc free min order

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { ArrowLeft, Upload } from 'lucide-react';
// import Link from 'next/link';

// interface Settings {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   deliveryCharges: number;
//   minOrderForFreeDelivery: number;  // ✅ New field
//   marqueeText: string;              // ✅ New field
// }

// export default function AdminSettingsPage() {
//   const { user, isAdmin, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [imagePreview, setImagePreview] = useState('');

//   const [settings, setSettings] = useState<Settings>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: '',
//     deliveryCharges: 0,
//     minOrderForFreeDelivery: 0,   // ✅ Default 0
//     marqueeText: ''               // ✅ Default empty
//   });

//   const [bannerImage, setBannerImage] = useState<File | null>(null);

//   // Check admin access - wait for auth to load first
//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch settings from Realtime Database
//   useEffect(() => {
//     if (!isAdmin) return;

//     const bannerRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(bannerRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setSettings(prev => ({
//           ...prev,
//           ...data
//         }));
//         setImagePreview(data.backgroundImage);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);

//     setBannerImage(file);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       let imageUrl = settings.backgroundImage;

//       // Upload new banner image to ImgBB if selected
//       if (bannerImage) {
//         imageUrl = await uploadToImgBB(bannerImage);
//       }

//       const settingsData = {
//         heading: settings.heading,
//         subheading: settings.subheading,
//         buttonText: settings.buttonText,
//         backgroundImage: imageUrl,
//         deliveryCharges: parseFloat(settings.deliveryCharges.toString()),
//         minOrderForFreeDelivery: parseFloat(settings.minOrderForFreeDelivery.toString()),
//         marqueeText: settings.marqueeText,
//         updatedAt: new Date().toISOString()
//       };

//       // Save to Firebase Realtime Database
//       await set(ref(rtdb, 'admin_settings/banner'), settingsData);

//       alert('Settings saved successfully!');
//       setBannerImage(null);
//     } catch (error) {
//       console.error('[v0] Error saving settings:', error);
//       alert('Error saving settings. Check ImgBB API key.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!isAdmin) {
//     return <div className="p-8">Access Denied</div>;
//   }

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading settings...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-4">
//             <Link href="/admin" className="text-muted-foreground hover:text-foreground">
//               <ArrowLeft size={24} />
//             </Link>
//             <h1 className="text-3xl font-bold">Admin Settings</h1>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-card rounded-lg border border-border shadow-lg p-8"
//         >
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Banner Settings */}
//             <div>
//               <h2 className="text-2xl font-bold mb-6">Banner Settings</h2>
              
//               <div className="space-y-6">
//                 {/* Banner Heading */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Heading</label>
//                   <input
//                     type="text"
//                     value={settings.heading}
//                     onChange={(e) => setSettings(prev => ({...prev, heading: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., M&M Scents Collection"
//                   />
//                 </div>

//                 {/* Banner Subheading */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Subheading</label>
//                   <input
//                     type="text"
//                     value={settings.subheading}
//                     onChange={(e) => setSettings(prev => ({...prev, subheading: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Premium Perfumes, Wax & Skincare"
//                   />
//                 </div>

//                 {/* Button Text */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Button Text</label>
//                   <input
//                     type="text"
//                     value={settings.buttonText}
//                     onChange={(e) => setSettings(prev => ({...prev, buttonText: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Shop Now"
//                   />
//                 </div>

//                 {/* Banner Image Upload */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Image</label>
//                   <div className="flex gap-4">
//                     <div className="flex-1">
//                       <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                         onClick={() => document.getElementById('bannerImageInput')?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground" />
//                         <p className="text-sm text-muted-foreground">Click to upload banner image</p>
//                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
//                       </div>
//                       <input
//                         id="bannerImageInput"
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                       />
//                     </div>

//                     {/* Image Preview */}
//                     {imagePreview && (
//                       <div className="w-32 h-32 rounded-lg overflow-hidden border border-border">
//                         <img
//                           src={imagePreview}
//                           alt="Preview"
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   {bannerImage && (
//                     <p className="text-sm text-green-600 mt-2">
//                       ✓ New image selected: {bannerImage.name}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Settings */}
//             <div className="border-t border-border pt-8">
//               <h2 className="text-2xl font-bold mb-6">Delivery Settings</h2>
              
//               <div className="space-y-6">
//                 {/* Delivery Charges */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Delivery Charges (₹)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={settings.deliveryCharges}
//                     onChange={(e) => setSettings(prev => ({...prev, deliveryCharges: parseFloat(e.target.value) || 0}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="0"
//                   />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Set delivery charges that will be added to customer orders
//                   </p>
//                 </div>

//                 {/* ✅ Minimum Order for Free Delivery */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Minimum Order for Free Delivery (₹)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={settings.minOrderForFreeDelivery}
//                     onChange={(e) => setSettings(prev => ({...prev, minOrderForFreeDelivery: parseFloat(e.target.value) || 0}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="0"
//                   />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     If order total is equal to or greater than this amount, delivery will be free
//                   </p>
//                   {settings.minOrderForFreeDelivery > 0 && (
//                     <p className="text-xs text-green-600 mt-1">
//                       ✅ Free delivery on orders above ₹{settings.minOrderForFreeDelivery}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* ✅ Marquee Text Settings */}
//             <div className="border-t border-border pt-8">
//               <h2 className="text-2xl font-bold mb-6">Marquee / Announcement Bar</h2>
              
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Marquee / Announcement Text</label>
//                 <textarea
//                   value={settings.marqueeText}
//                   onChange={(e) => setSettings(prev => ({...prev, marqueeText: e.target.value}))}
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   placeholder="Enter your announcement text here..."
//                   rows={3}
//                 />
//                 <p className="text-xs text-muted-foreground mt-2">
//                   This text will scroll across the top of your website as a marquee/announcement bar
//                 </p>
//                 {settings.marqueeText && (
//                   <div className="mt-3 p-3 bg-secondary rounded-lg border border-border">
//                     <p className="text-sm text-muted-foreground font-medium">Preview:</p>
//                     <div className="mt-1 overflow-hidden bg-primary/10 rounded-lg py-2 px-4">
//                       <div className="animate-[scroll_10s_linear_infinite] whitespace-nowrap">
//                         <span className="text-primary font-medium">
//                           {settings.marqueeText}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Save Button */}
//             <div className="flex gap-4 pt-8 border-t border-border">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold"
//               >
//                 {saving ? 'Saving...' : 'Save Settings'}
//               </button>
//               <Link
//                 href="/admin"
//                 className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:bg-muted transition-colors font-semibold"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </motion.div>

//         {/* Help Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mt-8 bg-secondary rounded-lg border border-border p-6"
//         >
//           <h3 className="font-bold mb-4">Quick Setup Tips:</h3>
//           <ul className="space-y-2 text-sm text-muted-foreground">
//             <li>• Upload a high-quality banner image (recommended: 1920x600px)</li>
//             <li>• Banner heading and subheading appear over the image</li>
//             <li>• Delivery charges are added to all orders automatically</li>
//             <li>• Set minimum order amount for free delivery (0 = never free)</li>
//             <li>• Marquee text will scroll across the top of your website</li>
//             <li>• Changes take effect immediately across the website</li>
//           </ul>
//         </motion.div>
//       </div>
//     </div>
//   );
// }











//mobile table pc different bg and without multiple mobile mode img

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { ArrowLeft, Upload, Smartphone, Tablet, Monitor } from 'lucide-react';
// import Link from 'next/link';

// interface Settings {
//   heading: string;
//   subheading: string;
//   buttonText: string;
//   backgroundImage: string;
//   backgroundImageMobile: string;
//   backgroundImageTablet: string;
//   deliveryCharges: number;
//   minOrderForFreeDelivery: number;
//   marqueeText: string;
// }

// export default function AdminSettingsPage() {
//   const { user, isAdmin, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [imagePreview, setImagePreview] = useState('');
//   const [mobileImagePreview, setMobileImagePreview] = useState('');
//   const [tabletImagePreview, setTabletImagePreview] = useState('');

//   const [settings, setSettings] = useState<Settings>({
//     heading: 'M&M Scents Collection',
//     subheading: 'Premium Perfumes, Wax & Skincare',
//     buttonText: 'Shop Now',
//     backgroundImage: '',
//     backgroundImageMobile: '',
//     backgroundImageTablet: '',
//     deliveryCharges: 0,
//     minOrderForFreeDelivery: 0,
//     marqueeText: ''
//   });

//   const [bannerImage, setBannerImage] = useState<File | null>(null);
//   const [mobileBannerImage, setMobileBannerImage] = useState<File | null>(null);
//   const [tabletBannerImage, setTabletBannerImage] = useState<File | null>(null);

//   // Check admin access
//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch settings from Realtime Database
//   useEffect(() => {
//     if (!isAdmin) return;

//     const bannerRef = ref(rtdb, 'admin_settings/banner');
//     const unsubscribe = onValue(bannerRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setSettings(prev => ({
//           ...prev,
//           ...data
//         }));
//         setImagePreview(data.backgroundImage || '');
//         setMobileImagePreview(data.backgroundImageMobile || '');
//         setTabletImagePreview(data.backgroundImageTablet || '');
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile' | 'tablet') => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (type === 'desktop') {
//         setImagePreview(reader.result as string);
//         setBannerImage(file);
//       } else if (type === 'mobile') {
//         setMobileImagePreview(reader.result as string);
//         setMobileBannerImage(file);
//       } else if (type === 'tablet') {
//         setTabletImagePreview(reader.result as string);
//         setTabletBannerImage(file);
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       let imageUrl = settings.backgroundImage;
//       let mobileImageUrl = settings.backgroundImageMobile;
//       let tabletImageUrl = settings.backgroundImageTablet;

//       // Upload desktop image
//       if (bannerImage) {
//         imageUrl = await uploadToImgBB(bannerImage);
//       }

//       // Upload mobile image
//       if (mobileBannerImage) {
//         mobileImageUrl = await uploadToImgBB(mobileBannerImage);
//       }

//       // Upload tablet image
//       if (tabletBannerImage) {
//         tabletImageUrl = await uploadToImgBB(tabletBannerImage);
//       }

//       const settingsData = {
//         heading: settings.heading,
//         subheading: settings.subheading,
//         buttonText: settings.buttonText,
//         backgroundImage: imageUrl,
//         backgroundImageMobile: mobileImageUrl,
//         backgroundImageTablet: tabletImageUrl,
//         deliveryCharges: parseFloat(settings.deliveryCharges.toString()),
//         minOrderForFreeDelivery: parseFloat(settings.minOrderForFreeDelivery.toString()),
//         marqueeText: settings.marqueeText,
//         updatedAt: new Date().toISOString()
//       };

//       await set(ref(rtdb, 'admin_settings/banner'), settingsData);

//       alert('Settings saved successfully!');
//       setBannerImage(null);
//       setMobileBannerImage(null);
//       setTabletBannerImage(null);
//     } catch (error) {
//       console.error('[v0] Error saving settings:', error);
//       alert('Error saving settings. Check ImgBB API key.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!isAdmin) {
//     return <div className="p-8">Access Denied</div>;
//   }

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-4xl mx-auto px-4 py-6">
//           <div className="flex items-center gap-4">
//             <Link href="/admin" className="text-muted-foreground hover:text-foreground">
//               <ArrowLeft size={24} />
//             </Link>
//             <h1 className="text-3xl font-bold">Admin Settings</h1>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-card rounded-lg border border-border shadow-lg p-8"
//         >
//           <form onSubmit={handleSubmit} className="space-y-8">
//             {/* Banner Settings */}
//             <div>
//               <h2 className="text-2xl font-bold mb-6">Banner Settings</h2>
              
//               <div className="space-y-6">
//                 {/* Banner Heading */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Heading</label>
//                   <input
//                     type="text"
//                     value={settings.heading}
//                     onChange={(e) => setSettings(prev => ({...prev, heading: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., M&M Scents Collection"
//                   />
//                 </div>

//                 {/* Banner Subheading */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Banner Subheading</label>
//                   <input
//                     type="text"
//                     value={settings.subheading}
//                     onChange={(e) => setSettings(prev => ({...prev, subheading: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Premium Perfumes, Wax & Skincare"
//                   />
//                 </div>

//                 {/* Button Text */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Button Text</label>
//                   <input
//                     type="text"
//                     value={settings.buttonText}
//                     onChange={(e) => setSettings(prev => ({...prev, buttonText: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Shop Now"
//                   />
//                 </div>

//                 {/* ✅ Desktop Banner Image */}
//                 <div className="border-t border-border pt-6">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Monitor className="w-5 h-5 text-muted-foreground" />
//                     <label className="text-sm font-semibold">Desktop Banner Image</label>
//                     <span className="text-xs text-muted-foreground">(lg: 1024px+)</span>
//                   </div>
//                   <div className="flex gap-4">
//                     <div className="flex-1">
//                       <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                         onClick={() => document.getElementById('bannerImageInput')?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground" />
//                         <p className="text-sm text-muted-foreground">Click to upload desktop banner</p>
//                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB (1920x600px)</p>
//                       </div>
//                       <input
//                         id="bannerImageInput"
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleImageChange(e, 'desktop')}
//                         className="hidden"
//                       />
//                     </div>
//                     {imagePreview && (
//                       <div className="w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                         <img
//                           src={imagePreview}
//                           alt="Desktop Preview"
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   {bannerImage && (
//                     <p className="text-sm text-green-600 mt-2">✓ New desktop image selected: {bannerImage.name}</p>
//                   )}
//                 </div>

//                 {/* ✅ Tablet Banner Image */}
//                 <div className="border-t border-border pt-6">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Tablet className="w-5 h-5 text-muted-foreground" />
//                     <label className="text-sm font-semibold">Tablet Banner Image</label>
//                     <span className="text-xs text-muted-foreground">(md: 768-1023px)</span>
//                   </div>
//                   <div className="flex gap-4">
//                     <div className="flex-1">
//                       <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                         onClick={() => document.getElementById('tabletBannerImageInput')?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground" />
//                         <p className="text-sm text-muted-foreground">Click to upload tablet banner</p>
//                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB (1024x600px)</p>
//                       </div>
//                       <input
//                         id="tabletBannerImageInput"
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleImageChange(e, 'tablet')}
//                         className="hidden"
//                       />
//                     </div>
//                     {tabletImagePreview && (
//                       <div className="w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                         <img
//                           src={tabletImagePreview}
//                           alt="Tablet Preview"
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   {tabletBannerImage && (
//                     <p className="text-sm text-green-600 mt-2">✓ New tablet image selected: {tabletBannerImage.name}</p>
//                   )}
//                   <p className="text-xs text-muted-foreground mt-2">
//                     ⚠️ If no tablet image is set, desktop image will be used on tablets
//                   </p>
//                 </div>

//                 {/* ✅ Mobile Banner Image */}
//                 <div className="border-t border-border pt-6">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Smartphone className="w-5 h-5 text-muted-foreground" />
//                     <label className="text-sm font-semibold">Mobile Banner Image</label>
//                     <span className="text-xs text-muted-foreground">(below 768px)</span>
//                   </div>
//                   <div className="flex gap-4">
//                     <div className="flex-1">
//                       <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                         onClick={() => document.getElementById('mobileBannerImageInput')?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground" />
//                         <p className="text-sm text-muted-foreground">Click to upload mobile banner</p>
//                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB (768x600px)</p>
//                       </div>
//                       <input
//                         id="mobileBannerImageInput"
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleImageChange(e, 'mobile')}
//                         className="hidden"
//                       />
//                     </div>
//                     {mobileImagePreview && (
//                       <div className="w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                         <img
//                           src={mobileImagePreview}
//                           alt="Mobile Preview"
//                           className="w-full h-full object-cover"
//                           onError={(e) => {
//                             e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                   {mobileBannerImage && (
//                     <p className="text-sm text-green-600 mt-2">✓ New mobile image selected: {mobileBannerImage.name}</p>
//                   )}
//                   <p className="text-xs text-muted-foreground mt-2">
//                     ⚠️ If no mobile image is set, desktop image will be used on mobile
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Settings */}
//             <div className="border-t border-border pt-8">
//               <h2 className="text-2xl font-bold mb-6">Delivery Settings</h2>
              
//               <div className="space-y-6">
//                 {/* Delivery Charges */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Delivery Charges (₹)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={settings.deliveryCharges}
//                     onChange={(e) => setSettings(prev => ({...prev, deliveryCharges: parseFloat(e.target.value) || 0}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="0"
//                   />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     Set delivery charges that will be added to customer orders
//                   </p>
//                 </div>

//                 {/* Minimum Order for Free Delivery */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Minimum Order for Free Delivery (₹)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={settings.minOrderForFreeDelivery}
//                     onChange={(e) => setSettings(prev => ({...prev, minOrderForFreeDelivery: parseFloat(e.target.value) || 0}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="0"
//                   />
//                   <p className="text-xs text-muted-foreground mt-2">
//                     If order total is equal to or greater than this amount, delivery will be free
//                   </p>
//                   {settings.minOrderForFreeDelivery > 0 && (
//                     <p className="text-xs text-green-600 mt-1">
//                       ✅ Free delivery on orders above ₹{settings.minOrderForFreeDelivery}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Marquee Text Settings */}
//             <div className="border-t border-border pt-8">
//               <h2 className="text-2xl font-bold mb-6">Marquee / Announcement Bar</h2>
              
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Marquee / Announcement Text</label>
//                 <textarea
//                   value={settings.marqueeText}
//                   onChange={(e) => setSettings(prev => ({...prev, marqueeText: e.target.value}))}
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   placeholder="Enter your announcement text here..."
//                   rows={3}
//                 />
//                 <p className="text-xs text-muted-foreground mt-2">
//                   This text will scroll across the top of your website as a marquee/announcement bar
//                 </p>
//                 {settings.marqueeText && (
//                   <div className="mt-3 p-3 bg-secondary rounded-lg border border-border">
//                     <p className="text-sm text-muted-foreground font-medium">Preview:</p>
//                     <div className="mt-1 overflow-hidden bg-primary/10 rounded-lg py-2 px-4">
//                       <div className="animate-[scroll_10s_linear_infinite] whitespace-nowrap">
//                         <span className="text-primary font-medium">
//                           {settings.marqueeText}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Save Button */}
//             <div className="flex gap-4 pt-8 border-t border-border">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold"
//               >
//                 {saving ? 'Saving...' : 'Save Settings'}
//               </button>
//               <Link
//                 href="/admin"
//                 className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:bg-muted transition-colors font-semibold"
//               >
//                 Cancel
//               </Link>
//             </div>
//           </form>
//         </motion.div>

//         {/* Help Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="mt-8 bg-secondary rounded-lg border border-border p-6"
//         >
//           <h3 className="font-bold mb-4">Quick Setup Tips:</h3>
//           <ul className="space-y-2 text-sm text-muted-foreground">
//             <li>• <strong>Desktop:</strong> Upload a high-quality image (1920x600px) for large screens</li>
//             <li>• <strong>Tablet:</strong> Upload optimized image (1024x600px) for tablet devices</li>
//             <li>• <strong>Mobile:</strong> Upload optimized image (768x600px) for mobile devices</li>
//             <li>• If tablet/mobile images are not set, desktop image will be used as fallback</li>
//             <li>• Banner heading and subheading appear over the image</li>
//             <li>• Delivery charges are added to all orders automatically</li>
//             <li>• Set minimum order amount for free delivery (0 = never free)</li>
//             <li>• Marquee text will scroll across the top of your website</li>
//             <li>• Changes take effect immediately across the website</li>
//           </ul>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


//mobile mode multiple img

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { uploadToImgBB } from '@/lib/imgbb';
import { ArrowLeft, Upload, Smartphone, Tablet, Monitor, X, Plus } from 'lucide-react';
import Link from 'next/link';

interface Settings {
  heading: string;
  subheading: string;
  buttonText: string;
  backgroundImage: string;
  backgroundImageTablet: string;
  backgroundImageMobile: string;
  backgroundImageMobile2: string;
  backgroundImageMobile3: string;
  backgroundImageMobile4: string;
  backgroundImageMobile5: string;
  deliveryCharges: number;
  minOrderForFreeDelivery: number;
  marqueeText: string;
}

export default function AdminSettingsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [tabletImagePreview, setTabletImagePreview] = useState('');
  const [mobileImagePreviews, setMobileImagePreviews] = useState<string[]>([]);

  const [settings, setSettings] = useState<Settings>({
    heading: 'M&M Scents Collection',
    subheading: 'Premium Perfumes, Wax & Skincare',
    buttonText: 'Shop Now',
    backgroundImage: '',
    backgroundImageTablet: '',
    backgroundImageMobile: '',
    backgroundImageMobile2: '',
    backgroundImageMobile3: '',
    backgroundImageMobile4: '',
    backgroundImageMobile5: '',
    deliveryCharges: 0,
    minOrderForFreeDelivery: 0,
    marqueeText: ''
  });

  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [tabletBannerImage, setTabletBannerImage] = useState<File | null>(null);
  const [mobileBannerImages, setMobileBannerImages] = useState<(File | null)[]>([null, null, null, null, null]);

  // Check admin access
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch settings from Realtime Database
  useEffect(() => {
    if (!isAdmin) return;

    const bannerRef = ref(rtdb, 'admin_settings/banner');
    const unsubscribe = onValue(bannerRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSettings(prev => ({
          ...prev,
          ...data
        }));
        setImagePreview(data.backgroundImage || '');
        setTabletImagePreview(data.backgroundImageTablet || '');
        
        // Set mobile previews
        const mobilePreviews = [];
        if (data.backgroundImageMobile) mobilePreviews.push(data.backgroundImageMobile);
        if (data.backgroundImageMobile2) mobilePreviews.push(data.backgroundImageMobile2);
        if (data.backgroundImageMobile3) mobilePreviews.push(data.backgroundImageMobile3);
        if (data.backgroundImageMobile4) mobilePreviews.push(data.backgroundImageMobile4);
        if (data.backgroundImageMobile5) mobilePreviews.push(data.backgroundImageMobile5);
        setMobileImagePreviews(mobilePreviews);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'tablet') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'desktop') {
        setImagePreview(reader.result as string);
        setBannerImage(file);
      } else if (type === 'tablet') {
        setTabletImagePreview(reader.result as string);
        setTabletBannerImage(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMobileImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...mobileImagePreviews];
      newPreviews[index] = reader.result as string;
      setMobileImagePreviews(newPreviews);
      
      const newFiles = [...mobileBannerImages];
      newFiles[index] = file;
      setMobileBannerImages(newFiles);
    };
    reader.readAsDataURL(file);
  };

  const removeMobileImage = (index: number) => {
    const newPreviews = [...mobileImagePreviews];
    newPreviews[index] = '';
    setMobileImagePreviews(newPreviews);
    
    const newFiles = [...mobileBannerImages];
    newFiles[index] = null;
    setMobileBannerImages(newFiles);
    
    // Clear the corresponding setting
    const fieldName = `backgroundImageMobile${index === 0 ? '' : index + 1}` as keyof Settings;
    setSettings(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = settings.backgroundImage;
      let tabletImageUrl = settings.backgroundImageTablet;
      let mobileImageUrls = [
        settings.backgroundImageMobile,
        settings.backgroundImageMobile2,
        settings.backgroundImageMobile3,
        settings.backgroundImageMobile4,
        settings.backgroundImageMobile5
      ];

      // Upload desktop image
      if (bannerImage) {
        imageUrl = await uploadToImgBB(bannerImage);
      }

      // Upload tablet image
      if (tabletBannerImage) {
        tabletImageUrl = await uploadToImgBB(tabletBannerImage);
      }

      // Upload mobile images
      for (let i = 0; i < mobileBannerImages.length; i++) {
        if (mobileBannerImages[i]) {
          mobileImageUrls[i] = await uploadToImgBB(mobileBannerImages[i]!);
        }
      }

      const settingsData = {
        heading: settings.heading,
        subheading: settings.subheading,
        buttonText: settings.buttonText,
        backgroundImage: imageUrl,
        backgroundImageTablet: tabletImageUrl,
        backgroundImageMobile: mobileImageUrls[0] || '',
        backgroundImageMobile2: mobileImageUrls[1] || '',
        backgroundImageMobile3: mobileImageUrls[2] || '',
        backgroundImageMobile4: mobileImageUrls[3] || '',
        backgroundImageMobile5: mobileImageUrls[4] || '',
        deliveryCharges: parseFloat(settings.deliveryCharges.toString()),
        minOrderForFreeDelivery: parseFloat(settings.minOrderForFreeDelivery.toString()),
        marqueeText: settings.marqueeText,
        updatedAt: new Date().toISOString()
      };

      await set(ref(rtdb, 'admin_settings/banner'), settingsData);

      alert('Settings saved successfully!');
      setBannerImage(null);
      setTabletBannerImage(null);
      setMobileBannerImages([null, null, null, null, null]);
    } catch (error) {
      console.error('[v0] Error saving settings:', error);
      alert('Error saving settings. Check ImgBB API key.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return <div className="p-8">Access Denied</div>;
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold">Admin Settings</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border border-border shadow-lg p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Banner Settings */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Banner Settings</h2>
              
              <div className="space-y-6">
                {/* Banner Heading */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Banner Heading</label>
                  <input
                    type="text"
                    value={settings.heading}
                    onChange={(e) => setSettings(prev => ({...prev, heading: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="e.g., M&M Scents Collection"
                  />
                </div>

                {/* Banner Subheading */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Banner Subheading</label>
                  <input
                    type="text"
                    value={settings.subheading}
                    onChange={(e) => setSettings(prev => ({...prev, subheading: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="e.g., Premium Perfumes, Wax & Skincare"
                  />
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Button Text</label>
                  <input
                    type="text"
                    value={settings.buttonText}
                    onChange={(e) => setSettings(prev => ({...prev, buttonText: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="e.g., Shop Now"
                  />
                </div>

                {/* Desktop Banner Image */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-5 h-5 text-muted-foreground" />
                    <label className="text-sm font-semibold">Desktop Banner Image</label>
                    <span className="text-xs text-muted-foreground">(lg: 1024px+)</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                        onClick={() => document.getElementById('bannerImageInput')?.click()}
                      >
                        <Upload className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload desktop banner</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB (1920x600px)</p>
                      </div>
                      <input
                        id="bannerImageInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'desktop')}
                        className="hidden"
                      />
                    </div>
                    {imagePreview && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Desktop Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {bannerImage && (
                    <p className="text-sm text-green-600 mt-2">✓ New desktop image selected: {bannerImage.name}</p>
                  )}
                </div>

                {/* Tablet Banner Image */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tablet className="w-5 h-5 text-muted-foreground" />
                    <label className="text-sm font-semibold">Tablet Banner Image</label>
                    <span className="text-xs text-muted-foreground">(md: 768-1023px)</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                        onClick={() => document.getElementById('tabletBannerImageInput')?.click()}
                      >
                        <Upload className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload tablet banner</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB (1024x600px)</p>
                      </div>
                      <input
                        id="tabletBannerImageInput"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'tablet')}
                        className="hidden"
                      />
                    </div>
                    {tabletImagePreview && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <img
                          src={tabletImagePreview}
                          alt="Tablet Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {tabletBannerImage && (
                    <p className="text-sm text-green-600 mt-2">✓ New tablet image selected: {tabletBannerImage.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ If no tablet image is set, desktop image will be used on tablets
                  </p>
                </div>

                {/* ✅ Multiple Mobile Banner Images */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone className="w-5 h-5 text-muted-foreground" />
                    <label className="text-sm font-semibold">Mobile Banner Images (Slideshow)</label>
                    <span className="text-xs text-muted-foreground">(below 768px)</span>
                  </div>
                  
                  <div className="space-y-4">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const fieldName = index === 0 ? 'backgroundImageMobile' : `backgroundImageMobile${index + 1}`;
                      const hasImage = mobileImagePreviews[index] || settings[fieldName as keyof Settings];
                      
                      return (
                        <div key={index} className="flex gap-4 items-start">
                          <div className="flex-1">
                            <div className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer ${
                              hasImage ? 'border-green-500 bg-green-50/10' : 'border-border'
                            }`}
                              onClick={() => document.getElementById(`mobileImageInput${index}`)?.click()}
                            >
                              <Upload className="mx-auto mb-1 text-muted-foreground" size={20} />
                              <p className="text-xs text-muted-foreground">
                                {hasImage ? 'Change image' : `Upload mobile image ${index + 1}`}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                              id={`mobileImageInput${index}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleMobileImageChange(e, index)}
                              className="hidden"
                            />
                          </div>
                          {(mobileImagePreviews[index] || settings[fieldName as keyof Settings]) && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border flex-shrink-0 group">
                              <img
                                src={mobileImagePreviews[index] || settings[fieldName as keyof Settings] as string}
                                alt={`Mobile ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23e8e3dc" width="80" height="80"/%3E%3C/svg%3E';
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeMobileImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                          {mobileBannerImages[index] && (
                            <p className="text-xs text-green-600 mt-1">✓ New: {mobileBannerImages[index]?.name}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-3">
                    📱 Upload multiple images for mobile slideshow. They will auto-slide every 3 seconds.
                    {mobileImagePreviews.filter(p => p).length > 0 && (
                      <span className="block text-green-600 mt-1">
                        ✅ {mobileImagePreviews.filter(p => p).length} image(s) uploaded
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ⚠️ If no mobile images are set, desktop image will be used on mobile
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-6">Delivery Settings</h2>
              
              <div className="space-y-6">
                {/* Delivery Charges */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Delivery Charges (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.deliveryCharges}
                    onChange={(e) => setSettings(prev => ({...prev, deliveryCharges: parseFloat(e.target.value) || 0}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Set delivery charges that will be added to customer orders
                  </p>
                </div>

                {/* Minimum Order for Free Delivery */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Minimum Order for Free Delivery (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settings.minOrderForFreeDelivery}
                    onChange={(e) => setSettings(prev => ({...prev, minOrderForFreeDelivery: parseFloat(e.target.value) || 0}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    If order total is equal to or greater than this amount, delivery will be free
                  </p>
                  {settings.minOrderForFreeDelivery > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ Free delivery on orders above ₹{settings.minOrderForFreeDelivery}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Marquee Text Settings */}
            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-6">Marquee / Announcement Bar</h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Marquee / Announcement Text</label>
                <textarea
                  value={settings.marqueeText}
                  onChange={(e) => setSettings(prev => ({...prev, marqueeText: e.target.value}))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                  placeholder="Enter your announcement text here..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This text will scroll across the top of your website as a marquee/announcement bar
                </p>
                {settings.marqueeText && (
                  <div className="mt-3 p-3 bg-secondary rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground font-medium">Preview:</p>
                    <div className="mt-1 overflow-hidden bg-primary/10 rounded-lg py-2 px-4">
                      <div className="animate-[scroll_10s_linear_infinite] whitespace-nowrap">
                        <span className="text-primary font-medium">
                          {settings.marqueeText}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4 pt-8 border-t border-border">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <Link
                href="/admin"
                className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:bg-muted transition-colors font-semibold"
              >
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-secondary rounded-lg border border-border p-6"
        >
          <h3 className="font-bold mb-4">Quick Setup Tips:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <strong>Desktop:</strong> Upload a high-quality image (1920x600px) for large screens</li>
            <li>• <strong>Tablet:</strong> Upload optimized image (1024x600px) for tablet devices</li>
            <li>• <strong>Mobile (Multiple):</strong> Upload up to 5 images for mobile slideshow</li>
            <li>• Mobile images will auto-slide every 3 seconds with smooth animation</li>
            <li>• If tablet/mobile images are not set, desktop image will be used as fallback</li>
            <li>• Banner heading and subheading appear over the image</li>
            <li>• Delivery charges are added to all orders automatically</li>
            <li>• Set minimum order amount for free delivery (0 = never free)</li>
            <li>• Marquee text will scroll across the top of your website</li>
            <li>• Changes take effect immediately across the website</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}