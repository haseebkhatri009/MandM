# M&M Scents - Google Auth + RTDB Setup Guide

## Admin Email Configuration
**Your Admin Email**: `abdulhaseebkhatri123@gmail.com`

When this email logs in (via email/password or Google), they get admin access automatically.

---

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project
```
1. Go to: https://console.firebase.google.com
2. Click "Add project" → Name: "M&M Scents"
3. Enable Google Analytics (optional)
4. Click "Create project"
```

### 1.2 Enable Realtime Database
```
1. Left sidebar → Build → Realtime Database
2. Click "Create Database"
3. Start in "Test Mode" (for development)
4. Choose region closest to you
5. Click "Enable"
```

### 1.3 Enable Authentication
```
1. Left sidebar → Build → Authentication
2. Click "Get started"
3. Sign-in method → Email/Password → Enable → Save
4. Sign-in method → Google → Enable → Setup OAuth Consent Screen
5. Click "Create" (for external)
6. Add app name "M&M Scents"
7. Add your email
8. Save and Continue
9. Go back to Sign-in Methods → Google → Edit
10. Choose your Firebase project → Save
```

### 1.4 Get Firebase Credentials
```
1. Project Settings (gear icon, top right)
2. General tab
3. Scroll down to "Your apps"
4. Copy all 6 values:
   - apiKey
   - authDomain
   - projectId
   - databaseURL (will be https://your-project.firebaseio.com)
   - messagingSenderId
   - appId
```

---

## Step 2: Google OAuth Setup (for Continue with Google)

### 2.1 Create Google OAuth Credentials
```
1. Go to: https://console.cloud.google.com
2. Select your Firebase project from dropdown
3. Left sidebar → APIs & Services → Credentials
4. Click "+ Create Credentials" → OAuth 2.0 Client ID
5. Choose "Web application"
6. Name: "M&M Scents Web"
7. Add Authorized redirect URIs:
   - http://localhost:3000
   - http://localhost:3000/auth/callback (optional)
   - https://your-domain.vercel.app (when deployed)
8. Click "Create"
9. Copy Client ID and Secret (you won't need these - Firebase handles it)
```

### 2.2 Enable Google+ API
```
1. Left sidebar → APIs & Services → Library
2. Search for "Google+ API"
3. Click it → Click "Enable"
```

---

## Step 3: Fill .env.local

Create `.env.local` file in project root with:

```env
# Firebase Credentials (from Step 1.4)
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://YOUR_PROJECT.firebaseio.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# ImgBB API Key (from https://imgbb.com/api)
NEXT_PUBLIC_IMGBB_API_KEY=YOUR_IMGBB_KEY
```

---

## Step 4: Test Setup

```bash
# Install dependencies (if not done)
npm install
# or
pnpm install

# Run locally
npm run dev
# or
pnpm dev

# Open http://localhost:3000
```

---

## Step 5: Create Admin Account

### Option A: Email/Password
```
1. Go to http://localhost:3000/signup
2. Fill form:
   - Name: Your Name
   - Email: abdulhaseebkhatri123@gmail.com
   - Password: Your secure password
3. Click "Create Account"
4. You'll have admin access
```

### Option B: Google Sign-In
```
1. Go to http://localhost:3000/login
2. Click "Continue with Google"
3. Sign in with: abdulhaseebkhatri123@gmail.com
4. You'll have admin access
```

---

## Step 6: Test Admin Access

1. After login, go to `/admin`
2. Should see admin dashboard
3. Click "Product Management" to add products
4. Upload images via ImgBB (free)
5. Set prices, discounts, descriptions

---

## Key Files Updated

- `lib/authContext.tsx` - RTDB + Google Auth
- `lib/firebase.js` - RTDB config only
- `app/login/page.tsx` - Google Auth button
- `app/signup/page.tsx` - Google Auth button
- `app/admin/page.tsx` - RTDB dashboard
- `app/admin/products/page.tsx` - ImgBB upload
- `app/checkout/page.tsx` - Order to RTDB
- `.env.local` - Credentials

---

## Deployment to Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "M&M Scents with Google Auth"
git push origin main

# 2. Go to https://vercel.com
# 3. Connect GitHub repo
# 4. Add environment variables:
#    - All 6 Firebase values
#    - IMGBB_API_KEY
# 5. Deploy

# 6. Update Google OAuth redirect URIs:
#    https://your-domain.vercel.app
```

---

## Troubleshooting

### "Firebase is not initialized"
- Check `.env.local` has all 6 Firebase values
- Restart dev server: `npm run dev`

### Google Auth button doesn't work
- Make sure Google Sign-In is enabled in Firebase Console
- Check authorized redirect URIs include your domain

### Admin page shows "Access Denied"
- Make sure you're logged in as `abdulhaseebkhatri123@gmail.com`
- Check Firebase Authentication shows the user

### Images not uploading
- Check `NEXT_PUBLIC_IMGBB_API_KEY` in `.env.local`
- Get free API key from https://imgbb.com/api

---

## Database Structure (Realtime DB)

```
root
├── users/
│   ├── {uid1}/
│   │   ├── email: "abdulhaseebkhatri123@gmail.com"
│   │   ├── isAdmin: true
│   │   ├── name: "Your Name"
│   │   └── phone: ""
│   └── {uid2}/
│       ├── email: "customer@example.com"
│       ├── isAdmin: false
│       ├── name: "Customer"
│       └── phone: ""
│
├── products/
│   ├── {productId1}/
│   │   ├── name: "Perfume Name"
│   │   ├── price: 499
│   │   ├── discount: 99
│   │   ├── category: "Perfume"
│   │   ├── image: "https://imgbb.com/image.jpg"
│   │   └── description: "..."
│   └── {productId2}/
│       └── ...
│
├── orders/
│   ├── {orderId1}/
│   │   ├── userId: "{uid}"
│   │   ├── items: [{...}, {...}]
│   │   ├── whatsapp: "+92123456789"
│   │   ├── address: "..."
│   │   ├── total: 500
│   │   ├── status: "pending"
│   │   └── createdAt: "2024-01-01T00:00:00Z"
│   └── {orderId2}/
│       └── ...
│
├── admin_settings/
│   └── banner/
│       ├── heading: "M&M Scents Collection"
│       ├── subheading: "Premium Perfumes"
│       ├── backgroundImage: "https://..."
│       └── buttonText: "Shop Now"
│
└── delivery_charges/
    └── charge: 50
```

---

**You're all set! Your M&M Scents store is ready to launch! 🎉**
