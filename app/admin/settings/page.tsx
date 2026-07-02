'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, set } from 'firebase/database';
import { uploadToImgBB } from '@/lib/imgbb';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';

interface Settings {
  heading: string;
  subheading: string;
  buttonText: string;
  backgroundImage: string;
  deliveryCharges: number;
}

export default function AdminSettingsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const [settings, setSettings] = useState<Settings>({
    heading: 'M&M Scents Collection',
    subheading: 'Premium Perfumes, Wax & Skincare',
    buttonText: 'Shop Now',
    backgroundImage: '',
    deliveryCharges: 0
  });

  const [bannerImage, setBannerImage] = useState<File | null>(null);

  // Check admin access - wait for auth to load first
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
        setImagePreview(data.backgroundImage);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setBannerImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = settings.backgroundImage;

      // Upload new banner image to ImgBB if selected
      if (bannerImage) {
        imageUrl = await uploadToImgBB(bannerImage);
      }

      const settingsData = {
        heading: settings.heading,
        subheading: settings.subheading,
        buttonText: settings.buttonText,
        backgroundImage: imageUrl,
        deliveryCharges: parseFloat(settings.deliveryCharges.toString()),
        updatedAt: new Date().toISOString()
      };

      // Save to Firebase Realtime Database
      await set(ref(rtdb, 'admin_settings/banner'), settingsData);

      alert('Settings saved successfully!');
      setBannerImage(null);
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

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
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

                {/* Banner Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Banner Image</label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                        onClick={() => document.getElementById('bannerImageInput')?.click()}
                      >
                        <Upload className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload banner image</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        id="bannerImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-border">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150"%3E%3Crect fill="%23e8e3dc" width="150" height="150"/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {bannerImage && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ New image selected: {bannerImage.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Charges */}
            <div className="border-t border-border pt-8">
              <h2 className="text-2xl font-bold mb-6">Delivery Settings</h2>
              
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
            <li>• Upload a high-quality banner image (recommended: 1920x600px)</li>
            <li>• Banner heading and subheading appear over the image</li>
            <li>• Delivery charges are added to all orders automatically</li>
            <li>• Changes take effect immediately across the website</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
