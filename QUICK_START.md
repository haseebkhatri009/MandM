# Luxe Beauty - Quick Start Guide 🚀

## तुरंत शुरुआत करने के लिए

### 1️⃣ Firebase Setup (5 मिनट)

```
Firebase Console → New Project → "Luxe Beauty"
  ↓
Authentication → Enable Email/Password
  ↓
Firestore Database → Start in Production
  ↓
Storage → Get Started
  ↓
Project Settings → Copy Firebase Config
```

### 2️⃣ Environment Setup

**`.env.local` file बनाओ** और Firebase credentials paste करो:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

### 3️⃣ Project Run करो

```bash
pnpm dev
```

Website open होगी: http://localhost:3000

---

## 🎯 Admin पहले क्या करे?

### Step 1: Admin Account बनाओ
- `/signup` पर जाओ
- Email: **abc@gmail.com**
- Any password
- Signup करो

### Step 2: Admin Dashboard Check करो
- `/admin` पर जाओ (automatically redirect होगा अगर abc@gmail.com से logged in हो)

### Step 3: कुछ Products Add करो
- `/admin/products` पर जाओ
- **Add Product** button दबाओ
- Product details fill करो:
  - Name: e.g., "Premium Perfume"
  - Category: Perfume/Facial Cream/Waxing
  - Price: ₹500
  - Discount: ₹100 (optional)
  - Image: Upload करो
- **Add Product** क्लिक करो

### Step 4: Banner Customize करो (Optional)
- `/admin/settings` पर जाओ
- Banner heading, subheading, button text change करो
- Banner image upload करो
- Delivery charges set करो (e.g., ₹50)
- **Save Settings** क्लिक करो

---

## 👤 Customer कैसे Order दे?

1. **Home** पर आओ (`/`)
2. Products देखो (login की जरूरत नहीं)
3. "Add to Cart" दबाओ → **Login करना होगा**
4. Email & password से signup करो
5. Back to home, फिर से Add to Cart दबाओ
6. **Cart** (`/cart`) में देखो
7. **Proceed to Checkout** दबाओ
8. Address, WhatsApp number fill करो
9. **Place Order (COD)** करो
10. Order confirmation मिलेगा

---

## 📱 Admin को Order Manage करने के लिए

1. `/admin/orders` पर जाओ
2. सभी customer orders दिखेंगे
3. **Green WhatsApp icon** पर click करो → direct message template भेजेगा
4. Order status change करो (pending → confirmed → shipped → delivered)

---

## 🎨 Website का Look Customize करो

### Colors बदलो (Premium Gold Theme)
**`app/globals.css`** में:
```css
--primary: #c9a87f       /* Main brand color - Gold */
--accent: #d4a574        /* Secondary - Lighter gold */
--background: #faf8f6    /* Light cream background */
--foreground: #2a2a2a    /* Dark text */
```

### Store का नाम बदलो
**`components/Navbar.tsx`** में:
```tsx
<span className="hidden sm:inline font-serif text-lg text-primary font-semibold">
  Luxe Beauty  {/* यहाँ अपना नाम दो */}
</span>
```

---

## 🔑 Important Points

### ✅ Public Access
- **Home**: कोई भी देख सकते हैं
- **Products**: बिना login भी देख सकते हैं
- **Add to Cart**: login करना पड़ेगा

### ✅ Admin Only
- **Dashboard**: सिर्फ abc@gmail.com से login करने के बाद
- **Products Management**: सिर्फ admin
- **Orders Management**: सिर्फ admin
- **Settings**: सिर्फ admin

### ✅ Database Rules
- Firestore automatically बना होगा क्योंकि हमने authenticated users को access दिया है

---

## 📊 Database Structure

```
/admin_settings
  /banner
    - heading: "Luxe Beauty Collection"
    - subheading: "Premium Products"
    - buttonText: "Shop Now"
    - backgroundImage: "url"
  
  /store
    - deliveryCharges: 50

/products
  /[productId]
    - name: "Perfume"
    - price: 500
    - discount: 100
    - category: "Perfume"
    - image: "url"
    - description: "..."

/orders
  /[orderId]
    - customerName: "John"
    - phoneNumber: "9876543210"
    - email: "john@gmail.com"
    - address: "..."
    - city: "..."
    - items: [...]
    - totalAmount: 600
    - status: "pending"
    - createdAt: timestamp

/users
  /[userId]
    - email: "..."
    - isAdmin: false
    - name: "..."
    - phone: "..."
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Products नहीं दिख रहे | Admin से `/admin/products` पर products add करो |
| "NEXT_PUBLIC_FIREBASE_API_KEY is not defined" | `.env.local` file check करो सभी variables हैं की नहीं |
| Checkout में error | Firebase Firestore rules को check करो |
| Image upload नहीं हो रहा | Firebase Storage में write permission दो |
| Admin page नहीं खुल रहा | abc@gmail.com से login करो |

---

## 🚀 Deployment को Vercel पर

```bash
# Option 1: GitHub से
git init
git add .
git commit -m "Initial commit"
git push origin main

# GitHub से Vercel को connect करो

# Option 2: Vercel CLI से
vercel
```

Deploy के बाद:
1. **Production URL** मिलेगा
2. Production में `.env.local` variables को set करो (Vercel dashboard में)
3. Website live होगी!

---

## 📞 Support Features

✅ **WhatsApp Integration**: Admin orders page से direct message भेज सकते हो
✅ **Email**: User के email से confirmation भेजेगा
✅ **Phone Number**: Customer का WhatsApp number store होता है

---

## 💡 Pro Tips

1. **Testing के लिए**: कई test users बनाओ और simulate करो
2. **Products images**: High quality images upload करो (banner और products)
3. **Regular backup**: Firebase data का backup रखो
4. **Analytics**: Orders को track करो कौन से products bestseller हैं
5. **Customer feedback**: WhatsApp से directly communication करो

---

## 🎯 Next Steps

1. ✅ Firebase setup करो
2. ✅ Website run करो (pnpm dev)
3. ✅ Admin account बनाओ (abc@gmail.com)
4. ✅ कुछ products add करो
5. ✅ Test order दो (अलग account से)
6. ✅ Admin से order manage करो
7. ✅ Vercel पर deploy करो

---

## ❤️ Built with

- **Frontend**: Next.js 16, React, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React

Happy Selling! 🛍️
