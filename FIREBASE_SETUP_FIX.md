# 🔧 Firebase & WalletConnect Setup Fix

## 🚨 **Current Issues:**

1. **Firebase Error**: `auth/unauthorized-domain` - Your domain isn't authorized
2. **WalletConnect Error**: `403 Forbidden` - Invalid project ID

## 🔧 **Fix 1: Firebase Authorized Domains**

### **Step 1: Go to Firebase Console**
1. Visit: https://console.firebase.google.com
2. Select your project: `gitstake-a3807`

### **Step 2: Add Authorized Domains**
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Click **Add domain**
3. Add these domains:
   - `localhost`
   - `127.0.0.1`
   - `gitstake-a3807.firebaseapp.com` (if not already there)
   - Your production domain (if you have one)

### **Step 3: For Local Development**
Make sure these are added:
- `localhost`
- `127.0.0.1`
- `localhost:5173` (your Vite dev server)

## 🔧 **Fix 2: WalletConnect Project ID**

### **Step 1: Get WalletConnect Project ID**
1. Go to: https://cloud.walletconnect.com
2. Sign up/Login with your account
3. Create a new project or use existing
4. Copy your **Project ID**

### **Step 2: Update .env File**
Replace this line in your `.env`:
```env
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

With your actual project ID:
```env
VITE_WALLET_CONNECT_PROJECT_ID=abc123def456ghi789
```

## 🔧 **Fix 3: GitHub OAuth (if needed)**

If you're also having GitHub OAuth issues:

### **Step 1: GitHub OAuth App Settings**
1. Go to: https://github.com/settings/applications
2. Find your OAuth app
3. Update **Authorization callback URL** to:
   - `http://localhost:5173` (for development)
   - Your production domain (for production)

## 🧪 **Testing After Fixes**

### **1. Restart Your Dev Server**
```bash
npm run dev
# or
yarn dev
```

### **2. Test Firebase Auth**
- Try GitHub sign-in
- Should not show `unauthorized-domain` error

### **3. Test Wallet Connection**
- Try connecting a wallet
- Should not show 403 error from Web3Modal

## 🎯 **Expected Results**

After these fixes:
- ✅ GitHub authentication should work without domain errors
- ✅ Wallet connection should work without 403 errors
- ✅ All authentication flows should be functional

## 🚨 **If Issues Persist**

### **Firebase Issues:**
- Double-check domain spelling in Firebase console
- Make sure you're using the correct Firebase project
- Try clearing browser cache

### **WalletConnect Issues:**
- Verify the project ID is correct (no extra spaces)
- Make sure the project is active in WalletConnect Cloud
- Check if you have any usage limits

### **Still Having Problems?**
1. Check browser console for detailed error messages
2. Verify all environment variables are loaded correctly
3. Make sure your `.env` file is in the project root
4. Restart your development server after changes

## 📝 **Quick Checklist**

- [ ] Added `localhost` to Firebase authorized domains
- [ ] Added `127.0.0.1` to Firebase authorized domains  
- [ ] Got valid WalletConnect Project ID from cloud.walletconnect.com
- [ ] Updated `.env` with correct Project ID
- [ ] Restarted development server
- [ ] Tested GitHub authentication
- [ ] Tested wallet connection

Once you complete these steps, both authentication methods should work properly! 🚀
