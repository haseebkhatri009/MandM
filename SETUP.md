# Luxe Beauty E-Commerce Website Setup Guide

## 🎯 Project Overview

Yeh ek complete e-commerce website hai **महिला सौंदर्य उत्पादों** (perfume, facial cream, waxing) के लिए:

- **Customer Pages**: Home, Products, Cart, Checkout
- **Admin Dashboard**: Product management, Order management, Settings
- **Authentication**: Email-based auth with role-based access (Admin = abc@gmail.com)
- **Payment**: Cash on Delivery (COD)
- **Features**: Animated banner, product filtering, WhatsApp integration

---

## 📋 Firebase Setup

### Step 1: Firebase Project Create करो

1. https://console.firebase.google.com पर जाओ
2. **New Project** create करो
3. Project का नाम दो (e.g., "Luxe Beauty")
4. Google Analytics enable मत करो (optional)
5. **Create** करो

### Step 2: Authentication Setup

1. Firebase Console में जाओ
2. **Authentication** section में जाओ
3. **Sign-in method** tab खोलो
4. **Email/Password** को enable करो
5. Save करो

### Step 3: Firestore Database Setup

1. **Firestore Database** बनाओ
2. **Start in production mode** select करो
3. Location select करो (e.g., Asia-southeast1 भारत के लिए)
4. **Create Database** करो

### Step 4: Firebase Storage Setup

1. **Storage** section खोलो
2. **Get Started** करो
3. Default rules से continue करो
4. **Done** करो

### Step 5: Project Credentials प्राप्त करो

1. **Project Settings** खोलो (gear icon)
2. **General** tab में जाओ
3. नीचे scroll करो, **Your apps** section देखो
4. अगर कोई app नहीं है तो **Add app** करो
5. Web app select करो
6. **Firebase configuration** दिखेगा - इसे copy करो

---

## 🔧 Environment Variables Setup

### Step 1: `.env.local` File बनाओ

Project root में `.env.local` file create करो और Firebase credentials को paste करो:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## 🚀 Project Start करो

```bash
# Dependencies install करो (पहले ही done है)
pnpm install

# Dev server start करो
pnpm dev
```

Website खुल जाएगी: http://localhost:3000

---

## 👥 User Roles

### Admin Access
- **Email**: `abc@gmail.com`
- **Password**: कोई भी password (signup करो या login करो)
- **Access**: `/admin` पर jाकर admin dashboard देख सकते हो

### Regular Customer
- कोई भी email से signup करो
- Products देख सकते हो, cart में add कर सकते हो
- Checkout कर सकते हो

---

## 📱 Website Pages

### Customer Pages
| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Homepage with animated banner & featured products |
| Products | `/products` | सभी products with filters |
| Product Details | `/product/[id]` | Individual product page |
| Cart | `/cart` | Shopping cart |
| Checkout | `/checkout` | Order placement (WhatsApp number & address) |
| Login | `/login` | Customer login |
| Signup | `/signup` | New customer registration |

### Admin Pages
| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/admin` | Overview & statistics |
| Products | `/admin/products` | Add/Edit/Delete products |
| Orders | `/admin/orders` | View & manage orders |
| Settings | `/admin/settings` | Banner & delivery charges |

---

## ⚙️ Admin Features

### 1️⃣ Product Management (`/admin/products`)
- ✅ Add नए products
- ✅ Product का image upload करो
- ✅ Price और discount set करो
- ✅ Category (Perfume, Facial Cream, Waxing) चुनो
- ✅ Edit/Delete products

### 2️⃣ Order Management (`/admin/orders`)
- ✅ सभी customer orders देखो
- ✅ Order status update करो (pending → confirmed → shipped → delivered)
- ✅ Customer के WhatsApp number पर direct message भेजो
- ✅ Filter by status

### 3️⃣ Store Settings (`/admin/settings`)
- ✅ Homepage banner customize करो (heading, subheading, button text, image)
- ✅ Animated banner with admin control
- ✅ Delivery charges set करो (सभी orders में add होगा)

---

## 🛍️ Customer Flow

```
1. Home पर visit करो (/home को छोड़ कर सीधे /)
   ↓
2. Products देखो (login के बिना)
   ↓
3. Product पर क्लिक करो "Add to Cart"
   ↓
4. Login/Signup करना होगा
   ↓
5. Cart में जाओ (/cart)
   ↓
6. "Proceed to Checkout" क्लिक करो
   ↓
7. WhatsApp number, address, etc fill करो
   ↓
8. "Place Order (COD)" करो
   ↓
9. Admin को order मिलेगा - वो WhatsApp से contact करेगा
```

---

## 🎨 Customization

### Colors बदलो
`/vercel/share/v0-project/app/globals.css` में color variables change करो:
- `--primary`: ₹c9a87f (main brand color)
- `--accent`: #d4a574
- `--background`: #faf8f6 (light)
- `--foreground`: #2a2a2a (dark)

### Fonts बदलो
`/vercel/share/v0-project/app/layout.tsx` में fonts change करो

### Store Name बदलो
`/vercel/share/v0-project/components/Navbar.tsx` में "Luxe Beauty" को update करो

---

## 🔗 Deployment

### Vercel पर Deploy करो:
```bash
# GitHub से connect करो या Vercel से directly
vercel
```

Production URL मिलेगा

---

## ❓ FAQ

### Q: Products home page पर क्यों नहीं दिख रहे?
**A**: Firebase में products add करने चाहिए। `/admin/products` पर जाकर कुछ products add करो।

### Q: Banner customize कैसे करूं?
**A**: Admin `/admin/settings` पर जाकर banner heading, subheading, image और button text set कर सकते हो।

### Q: Delivery charges कहां set करूं?
**A**: Admin `/admin/settings` पर "Delivery Charges" field में डाल दो।

### Q: Customer को WhatsApp कैसे contact करूं?
**A**: `/admin/orders` पर order खोलो, WhatsApp icon पर क्लिक करो - automatically message template भेजेगा।

### Q: Payment Gateway integrate करनी है?
**A**: फिलहाल Cash on Delivery है। Future में Razorpay/Stripe add कर सकते हो।

---

## 📞 Key Contacts Integration

### WhatsApp Integration
- Orders में customer का WhatsApp number store होता है
- Admin orders page से directly WhatsApp message भेज सकते हो
- Link: `https://wa.me/[phone_number]?text=[message]`

---

## 🎯 Features Summary

✅ Animated homepage banner (admin से customizable)
✅ Product management (Add/Edit/Delete with images)
✅ Shopping cart (localStorage में persist)
✅ User authentication (signup/login)
✅ Role-based access (Admin dashboard)
✅ Order management (Track & update status)
✅ WhatsApp integration (Admin messaging)
✅ Mobile responsive design
✅ Smooth animations (Framer Motion)
✅ Professional UI (Premium theme)
✅ Firebase backend (Secure & scalable)

---

## 🐛 Troubleshooting

### Port 3000 already in use?
```bash
# अलग port पर run करो
pnpm dev -- -p 3001
```

### Firebase credentials error?
- `.env.local` file check करो सभी variables हैं की नहीं
- Firebase console से फिर से copy करके paste करो

### Images upload नहीं हो रहे?
- Firebase Storage rules check करो (should allow uploads)
- Browser console में error देखो

---

अब तुम ready हो! Enjoy your e-commerce store! 🚀
