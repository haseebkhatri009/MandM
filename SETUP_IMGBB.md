# M&M Scents - Setup Guide (ImgBB + Firebase Realtime Database)

## Quick Start - 3 Steps

### Step 1: Get Firebase Credentials
1. Go to https://console.firebase.google.com
2. Click "Create Project" → "M&M Scents"
3. Click "Create" (skip analytics)
4. Go to **Build** → **Realtime Database** → **Create Database**
5. Choose location → Start in **production mode**
6. Click **Rules** tab and replace with:
```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```
Click Publish
7. Go to **Project Settings** (gear icon) → **General tab**
8. Copy these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://YOUR_PROJECT_ID.firebaseio.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

### Step 2: Get ImgBB API Key (FREE Image Hosting)
1. Go to https://imgbb.com/
2. Click **Sign Up**
3. Create account
4. Go to https://imgbb.com/api
5. Copy your **API Key**
6. Add to `.env.local`:
```env
NEXT_PUBLIC_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
```

### Step 3: Add to `.env.local`
Create file `/vercel/share/v0-project/.env.local`:

```env
# Firebase Realtime Database
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ImgBB API (Free Image Hosting)
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

## Run Website

```bash
npm run dev
# or
pnpm dev
```

Open: http://localhost:3000

---

## Admin Setup

### First Time Setup:
1. Go to http://localhost:3000/signup
2. Email: **abc@gmail.com** (admin email)
3. Password: any password
4. Create account

### Admin Dashboard:
- Go to http://localhost:3000/admin (you'll see Admin button in navbar)
- Click "Product Management" → Add first product
- Upload image (uses ImgBB - FREE!)
- Set price, discount, category
- Click "Add Product"

### Admin Settings:
- Go to http://localhost:3000/admin/settings
- Upload banner image
- Change banner text
- Set delivery charges
- Save

---

## How ImgBB Works

✅ **FREE Forever**
✅ **No Firebase Storage fees**
✅ **Automatic image hosting**
✅ **Direct image URLs saved to Firebase**

When you upload product images:
1. Image is uploaded to ImgBB (free hosting)
2. Image URL is saved to Firebase Realtime Database
3. Image displays instantly on website

---

## Database Structure (Firebase Realtime)

```
products/
  ├── 1234567890/
  │   ├── name: "Jasmine Perfume"
  │   ├── price: 499
  │   ├── discount: 100
  │   ├── category: "Perfume"
  │   ├── image: "https://imgbb.com/..." (ImgBB URL)
  │   └── description: "..."

admin_settings/
  └── banner/
      ├── heading: "M&M Scents Collection"
      ├── subheading: "Premium Perfumes..."
      ├── buttonText: "Shop Now"
      ├── backgroundImage: "https://imgbb.com/..."
      └── deliveryCharges: 50
```

---

## Testing Flow

1. **Visit Website**: http://localhost:3000
   - See home page with banner
   - See featured products
   - NO login required yet

2. **Add to Cart**:
   - Click "Add to Cart" → Redirects to login
   - Click "Sign Up"
   - Create customer account
   - Add product to cart

3. **Checkout**:
   - Go to Cart → Proceed to Checkout
   - Fill WhatsApp number, address, quantity
   - See delivery charges applied
   - Click "Place Order"
   - See success page

4. **Admin Orders**:
   - Go to /admin/orders
   - See customer order with WhatsApp number
   - Can click contact to message customer

---

## Common Issues

### "ImgBB API key not configured"
- Solution: Add `NEXT_PUBLIC_IMGBB_API_KEY` to `.env.local`
- Restart dev server: `npm run dev`

### "Firebase configuration not valid"
- Solution: Check all env variables are correct in `.env.local`
- Make sure DATABASE_URL format is: `https://your-project.firebaseio.com`

### Images not showing
- Check ImgBB account is active
- Verify API key is correct
- Check network tab in browser console

---

## Deployment

### Deploy to Vercel
```bash
git init
git add .
git commit -m "M&M Scents E-commerce"
git push origin main
```

Then connect GitHub repo to Vercel and add env variables in Vercel Dashboard.

---

## Admin Credentials

- **Email**: abc@gmail.com
- **Password**: Your choice (set during signup)
- **Access**: http://localhost:3000/admin

---

## Features Summary

✅ **Frontend**: Home, Products, Cart, Checkout, Login/Signup
✅ **Admin**: Product Management, Order Management, Settings, Banner Editor
✅ **Images**: ImgBB free hosting (no Firebase Storage fees)
✅ **Database**: Firebase Realtime Database (fast & real-time)
✅ **Auth**: Email/Password with admin role check
✅ **Mobile**: Fully responsive design
✅ **Animations**: Smooth Framer Motion animations

---

## Next Steps

1. Add your first products
2. Upload banner image  
3. Test the checkout flow
4. Customize delivery charges
5. Deploy to Vercel

Happy selling! 🎉
