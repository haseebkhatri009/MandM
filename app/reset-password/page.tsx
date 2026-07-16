'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getDatabase, ref, get, update } from 'firebase/database';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    const apiKey = searchParams.get('apiKey');
    
    console.log('🔍 Mode:', mode);
    console.log('🔍 API Key:', apiKey);
    console.log('🔍 All Params:', Object.fromEntries(searchParams.entries()));

    // ✅ Firebase default page se redirect ho rahe ho
    if (apiKey && mode === 'resetPassword') {
      console.log('✅ Firebase default page se redirect!');
      
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const email = currentUser.email || '';
          console.log('✅ User email:', email);
          
          // ✅ DIRECT RTDB UPDATE - SAB SE SIMPLE
          try {
            const db = getDatabase();
            const usersRef = ref(db, 'users');
            const snapshot = await get(usersRef);
            
            if (snapshot.exists()) {
              const data = snapshot.val();
              let userUid = null;
              
              // Find user by email
              Object.keys(data).forEach((key) => {
                const userData = data[key];
                const userEmail = userData.email || '';
                const phoneEmail = `${userData.phone || ''}@phone.auth`;
                
                if (userEmail === email || userEmail === `${email}@phone.auth` || phoneEmail === email) {
                  userUid = key;
                  console.log('✅ Found user in RTDB:', key);
                }
              });
              
              if (userUid) {
                // ✅ DIRECT UPDATE - passwordReset: true
                await update(ref(db, `users/${userUid}`), {
                  passwordReset: true,
                  passwordResetAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                });
                console.log('✅ passwordReset flag set to TRUE for:', email);
              } else {
                console.warn('⚠️ User NOT found in RTDB for email:', email);
              }
            }
          } catch (error) {
            console.error('❌ Error updating RTDB:', error);
            setError('Failed to update password reset status. Please try again.');
          }
          
          setSuccess(true);
          setLoading(false);
          
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          // ✅ Agar user login nahi hai toh login page bhejo
          setLoading(false);
          setTimeout(() => router.push('/login'), 2000);
        }
        unsubscribe();
      });
      
      return;
    }

    // ✅ Agar code nahi hai toh error
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Processing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 border border-border text-center">
          {error ? (
            <div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-semibold">❌ {error}</p>
              </div>
              <Link href="/login" className="mt-4 inline-block text-primary hover:underline">
                ← Back to Login
              </Link>
            </div>
          ) : success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <p className="font-semibold">✅ Password reset successfully!</p>
              <p className="text-sm mt-1">Redirecting to login...</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-4">No reset code found.</p>
              <Link href="/login" className="text-primary hover:underline">
                ← Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}