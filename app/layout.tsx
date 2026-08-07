// import { Analytics } from '@vercel/analytics/next'
// import type { Metadata, Viewport } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import './globals.css'
// import RootLayoutClient from './layout-client'

// const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

// export const metadata: Metadata = {
//   title: 'M&M Scents - Premium Perfumes, Wax & Skincare',
//   description: 'Shop premium beauty products including perfumes, waxing services, and facial creams for women',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export const viewport: Viewport = {
//   colorScheme: 'light dark',
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: '#c9a87f' },
//     { media: '(prefers-color-scheme: dark)', color: '#d4a574' },
//   ],
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
//       <body className="font-sans antialiased">
//         <RootLayoutClient>
//           {children}
//           {process.env.NODE_ENV === 'production' && <Analytics />}
//         </RootLayoutClient>
//       </body>
//     </html>
//   )
// }



//with err hydration free

// import { Analytics } from '@vercel/analytics/next'
// import type { Metadata, Viewport } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import './globals.css'
// import RootLayoutClient from './layout-client'
// import { Toaster } from 'react-hot-toast'

// const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

// export const metadata: Metadata = {
//   title: 'M&M Scents - Premium Perfumes, Wax & Skincare',
//   description: 'Shop premium beauty products including perfumes, waxing services, and facial creams for women',
//   generator: 'v0.app',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export const viewport: Viewport = {
//   colorScheme: 'light dark',
//   themeColor: [
//     { media: '(prefers-color-scheme: light)', color: '#c9a87f' },
//     { media: '(prefers-color-scheme: dark)', color: '#d4a574' },
//   ],
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
//       <body className="font-sans antialiased" suppressHydrationWarning>
//         <RootLayoutClient>
//           {children}
//           <Toaster position="top-right" />
//           {process.env.NODE_ENV === 'production' && <Analytics />}
//         </RootLayoutClient>
//       </body>
//     </html>
//   )
// }


//with logged out scene

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import RootLayoutClient from './layout-client'
import { Toaster } from 'react-hot-toast'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'M&M Scents - Premium Perfumes, Wax & Skincare',
  description: 'Shop premium beauty products including perfumes, waxing services, and facial creams for women',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#c9a87f' },
    { media: '(prefers-color-scheme: dark)', color: '#d4a574' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <RootLayoutClient>
          {children}
          {/* ✅ Toaster for all pages - 1 second duration */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 1000,
              style: {
                background: '#333',
                color: '#fff',
                padding: '16px',
                borderRadius: '12px',
              },
            }}
          />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </RootLayoutClient>
      </body>
    </html>
  )
}