'use client';

import { AuthProvider } from '@/lib/authContext'
import { CartProvider } from '@/lib/cartContext'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  )
}
