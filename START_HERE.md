# 🛍️ M&M Scents - Start Here!

**Your complete e-commerce website is ready. Follow these 5 steps to launch!**

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Get Firebase Realtime Database Credentials

1. Go to **https://console.firebase.google.com**
2. Click **"Create Project"** → Type "M&M Scents"
3. Click **"Create"** (skip analytics)
4. Go to **Build** → **Realtime Database** → **"Create Database"**
5. Select location → Choose **"Start in production mode"**
6. Click **"Rules"** tab and paste:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```
Click **"Publish"**

7. Go to **Project Settings** (gear icon top-left) → **General tab**
8. You'll see "Your Apps" section with Firebase config. Copy:
   - API Key
   - Auth Domain
   - Project ID
   - Database URL
   - Messaging Sender ID
   - App ID

---

### Step 2: Get FREE ImgBB API Key for Image Hosting

1. Go to **https://imgbb.com/**
2. Click **"Sign Up"** → Create account
3. Go to **https://imgbb.com/api**
4. Copy your **API Key**

**Why ImgBB?** FREE image hosting. No Firebase Storage bills!

---

### Step 3: Add Credentials to `.env.local`

Create file at `/vercel/share/v0-project/.env.local` with:

```env
# Firebase Realtime Database (from Step 1)
NEXT_PUBLIC_FIREBASE_API_KEY=paste_your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=paste_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=paste_app_id_here

# ImgBB API Key (from Step 2)
NEXT_PUBLIC_IMGBB_API_KEY=paste_your_imgbb_key_here
```

---

### Step 4: Run Website

```bash
npm run dev
# or
pnpm dev
```

Website opens at: **http://localhost:3000**

---

### Step 5: Create Admin Account

1. Go to **http://localhost:3000/signup**
2. Email: **abc@gmail.com**
3. Password: Any password you want
4. Click **Sign Up**
5. Check navbar → Admin button appears! ✅

---

## 🎯 Next: Add Your First Product

1. Go to **http://localhost:3000/admin**
2. Click **Product Management**
3. Click **+ Add Product**
4. Fill form:
   - Product Name: "Jasmine Perfume"
   - Category: "Perfume"
   - Price: "499"
   - Discount Price: "399"
   - Description: (optional)
   - **Upload Image** (uses ImgBB)
5. Click **Add Product** ✅

Image is automatically hosted on ImgBB for FREE!

---

## 🎨 Customize Banner

1. Go to **http://localhost:3000/admin/settings**
2. Change:
   - Banner Heading: "M&M Scents Collection"
   - Subheading: "Premium Perfumes, Wax & Skincare"
   - Button Text: "Shop Now"
   - **Upload Banner Image**
3. Set **Delivery Charges** (e.g., 50 rupees)
4. Click **Save Settings** ✅

---

## 🧪 Test Checkout

1. Go to **http://localhost:3000** (homepage)
2. Click **+ Add to Cart** on any product
3. Get redirected to login
4. Click **Sign Up** → Create NEW customer account
5. Add product to cart
6. Go to **Cart** → **Checkout**
7. Fill:
   - WhatsApp Number: +919876543210
   - Address: 123 Main Street, City
   - Quantity: 1
8. Click **Place Order** ✅
9. See confirmation page
10. Go to **Admin** → **Orders** → See customer's WhatsApp number

---

## 📱 Features

### Customer Side
✅ Browse products (no login needed)
✅ View product details
✅ Add to cart
✅ Login/Sign up
✅ Checkout with address & WhatsApp
✅ Track order status
✅ Responsive mobile design

### Admin Side
✅ Add/Edit/Delete products
✅ Upload images (ImgBB - FREE)
✅ View customer orders
✅ See WhatsApp numbers
✅ Customize banner
✅ Set delivery charges
✅ Real-time updates

---

## 📂 What's Inside

```
Your Website Has:
├── Home Page (with animated banner)
├── Products Page (all items)
├── Product Details
├── Shopping Cart
├── Checkout (COD)
├── Login/Signup
└── Admin Dashboard
    ├── Product Management
    ├── Order Management
    └── Settings (Banner + Delivery)
```

---

## ❓ Troubleshooting

### "ImgBB API key error"
- Check `.env.local` has `NEXT_PUBLIC_IMGBB_API_KEY`
- Restart dev server: `pnpm dev`

### "Firebase config error"
- Verify all Firebase credentials in `.env.local`
- Make sure DATABASE_URL is: `https://your-project.firebaseio.com`

### "Admin button not showing"
- Signup with email: **abc@gmail.com** (exactly)
- Reload page

### Images not uploading
- Check ImgBB account is active
- Check API key is correct
- Check network in browser console

---

## 🚀 Deploy to Vercel

```bash
# Push to GitHub
git init
git add .
git commit -m "M&M Scents"
git push origin main

# Then:
# 1. Go to vercel.com
# 2. Import your GitHub repo
# 3. Add all NEXT_PUBLIC_* env variables
# 4. Deploy!
```

---

## 📚 Full Documentation

- **README_M&M_SCENTS.md** - Complete overview
- **SETUP_IMGBB.md** - Detailed setup guide
- **FEATURES.md** - All features explained
- **QUICK_START.md** - Quick reference

---

## 🎯 Admin Email

- **Email**: abc@gmail.com
- **Password**: Set during signup

---

## 💡 Tech Stack

- React + Next.js 16
- Firebase Realtime Database
- ImgBB (FREE image hosting)
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)

---

## ✅ Checklist

- [ ] Got Firebase Realtime Database credentials
- [ ] Got ImgBB API key
- [ ] Created `.env.local` with all variables
- [ ] Ran `npm run dev`
- [ ] Website opens at localhost:3000
- [ ] Created admin account (abc@gmail.com)
- [ ] Added first product
- [ ] Customized banner
- [ ] Tested checkout flow
- [ ] Ready to deploy!

---

## 🎉 You're All Set!

**Your M&M Scents e-commerce website is:**
- ✅ Fully functional
- ✅ Mobile responsive
- ✅ Production ready
- ✅ With FREE image hosting
- ✅ Real-time database

**Start selling today!** 💫

---

## Need Help?

1. Check documentation files (README_M&M_SCENTS.md, SETUP_IMGBB.md)
2. Verify all .env.local variables
3. Restart dev server
4. Check browser console for errors
5. Check Firebase Realtime Database permissions

---

**Built with ❤️ using React, Next.js, Firebase & ImgBB**

Your shop is ready! 🛍️
