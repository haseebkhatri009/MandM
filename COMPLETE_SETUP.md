# M&M Scents - Complete Setup Guide

## 🎯 Step-by-Step Setup (15 minutes)

### STEP 1: Firebase Realtime Database Setup

1. Go to https://console.firebase.google.com
2. Click "Create Project" 
3. Name: `M&M Scents` → Continue
4. Disable Google Analytics → Create Project
5. Wait for project to be created
6. Click "Realtime Database" from left menu
7. Click "Create Database"
8. Select region (closest to you)
9. Click "Next"
10. Select "Start in test mode" → Enable

**Now get your credentials:**
1. Click "Project Settings" (gear icon top left)
2. Click "General" tab
3. Find your app configuration
4. Copy the following values:

```
apiKey → NEXT_PUBLIC_FIREBASE_API_KEY
authDomain → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN (format: project-id.firebaseapp.com)
projectId → NEXT_PUBLIC_FIREBASE_PROJECT_ID
databaseURL → NEXT_PUBLIC_FIREBASE_DATABASE_URL (format: https://project-id.firebaseio.com)
messagingSenderId → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
appId → NEXT_PUBLIC_FIREBASE_APP_ID
```

5. Also enable Email/Password Authentication:
   - Go to "Authentication" from left menu
   - Click "Get Started"
   - Click "Email/Password"
   - Enable it → Save

---

### STEP 2: ImgBB FREE API Key Setup

1. Go to https://imgbb.com
2. Click "Sign Up" (or login if you have account)
3. Go to https://imgbb.com/api
4. Copy your API key (you'll see it at top of page)
5. This is your `NEXT_PUBLIC_IMGBB_API_KEY`

---

### STEP 3: Update `.env.local` File

Open `.env.local` in your project root and fill in all values:

```env
## Firebase Realtime Database Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mandmscents.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mandmscents-12345
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://mandmscents-12345.firebaseio.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

## ImgBB API Key
NEXT_PUBLIC_IMGBB_API_KEY=abcdef1234567890abcdef1234567890
```

**IMPORTANT**: 
- Replace all `YOUR_*` values with actual values from Firebase
- Replace `YOUR_IMGBB_API_KEY` with actual ImgBB API key
- Save the file
- Do NOT share this file with anyone!

---

### STEP 4: Run the Project

```bash
npm run dev
```

or 

```bash
pnpm dev
```

Open: http://localhost:3000

---

### STEP 5: Create Admin Account

1. Go to http://localhost:3000/signup
2. Email: `abc@gmail.com`
3. Password: anything you want (e.g., `Admin@123`)
4. Click "Create Account"
5. You'll be logged in as admin

---

### STEP 6: Go to Admin Dashboard

1. Click the "Admin" button in top navbar (only shows if you're admin)
2. Go to Admin Dashboard
3. You should see:
   - Products Management
   - Orders Management
   - Settings (for banner & delivery charges)

---

### STEP 7: Add Your First Product

1. Click "Product Management"
2. Click "+ Add Product"
3. Fill details:
   - **Product Name**: e.g., "Jasmine Perfume"
   - **Category**: Choose from Perfume, Wax, or Facial Cream
   - **Price**: e.g., 499
   - **Discount Price** (optional): e.g., 399
   - **Description**: e.g., "Premium jasmine fragrance"
   - **Image**: Click to upload (will use ImgBB)
4. Click "Add Product"
5. Image uploads to ImgBB, URL saved to Firebase!

---

### STEP 8: Customize Banner

1. Go to Admin Dashboard
2. Click "Settings"
3. Fill:
   - **Banner Heading**: e.g., "M&M Scents Collection"
   - **Banner Subheading**: e.g., "Premium Perfumes & Skincare"
   - **Button Text**: e.g., "Shop Now"
   - **Banner Image**: Upload your banner
   - **Delivery Charges**: e.g., 50
4. Click "Save Settings"
5. Go to home page - banner updated instantly!

---

## 🎯 Testing the Store

### As Customer:
1. Go to http://localhost:3000
2. Browse products (no login needed!)
3. Click "Add to Cart"
4. Click "Cart" in navbar
5. Increase/decrease quantity
6. Click "Checkout"
7. Login with any email
8. Fill address, WhatsApp number
9. Click "Place Order"
10. Order saved to Firebase!

### As Admin:
1. Click "Admin" in navbar
2. Go to "Orders" 
3. See customer orders with WhatsApp numbers
4. Update order status: Pending → Shipped → Delivered
5. Customer info shows up!

---

## 📊 Database Structure

Your Firebase Realtime Database looks like:

```
M&M Scents (Root)
├── products/
│   ├── 1701234567890/
│   │   ├── name: "Jasmine Perfume"
│   │   ├── price: 499
│   │   ├── discount: 50
│   │   ├── image: "https://imgbb.com/image/abc123"
│   │   └── category: "Perfume"
│   └── ...more products
├── orders/
│   ├── order-id-1/
│   │   ├── customer: "user@email.com"
│   │   ├── whatsapp: "923001234567"
│   │   ├── address: "123 Main St"
│   │   ├── items: [...]
│   │   └── status: "Pending"
│   └── ...more orders
└── admin_settings/
    └── banner/
        ├── heading: "M&M Scents Collection"
        ├── subheading: "Premium Products"
        ├── buttonText: "Shop Now"
        ├── backgroundImage: "https://imgbb.com/..."
        └── deliveryCharges: 50
```

---

## ✅ Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Email/Password auth enabled
- [ ] ImgBB account created
- [ ] `.env.local` filled with all credentials
- [ ] `npm run dev` working
- [ ] Admin account created (abc@gmail.com)
- [ ] First product added
- [ ] Banner customized
- [ ] Store tested as customer

---

## 🚀 Deploy to Production

When ready to go live:

```bash
# Option 1: GitHub + Vercel
git init
git add .
git commit -m "M&M Scents Launch"
git push origin main
# Connect to Vercel from GitHub

# Option 2: Vercel CLI
npm i -g vercel
vercel
```

Add environment variables to Vercel dashboard with same `.env.local` values.

---

## 💡 Important Notes

- `.env.local` contains secrets - NEVER commit to GitHub
- Add `.env.local` to `.gitignore`
- ImgBB is FREE - unlimited image hosting
- Firebase Realtime DB is FREE tier
- Everything works instantly, no build needed

---

## ❓ Troubleshooting

**Products not showing?**
- Check `.env.local` has correct Firebase credentials
- Check Firebase Database URL is correct
- Refresh page

**Image upload fails?**
- Check ImgBB API key is correct
- Check internet connection
- Verify image file is < 5MB

**Admin access denied?**
- Must signup/login with `abc@gmail.com` exactly
- Check database rules allow reads/writes

---

## 📞 Support Files

- `SETUP_IMGBB.md` - Detailed ImgBB setup
- `README_M&M_SCENTS.md` - Feature overview
- `PROJECT_STATUS.txt` - Project summary

Good luck with M&M Scents! 🎉
