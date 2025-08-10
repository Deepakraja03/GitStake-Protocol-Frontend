# GitStake Protocol - Unified Authentication System

## 🎯 Overview

This document describes the comprehensive authentication system that manages both **Wallet Connection** (via RainbowKit/Wagmi) and **GitHub Authentication** (via Firebase) in a unified, user-friendly way.

## 🏗️ Architecture

### Core Components

1. **Enhanced AuthContext** (`src/context/AuthContext.jsx`)
   - Manages both wallet and GitHub authentication states
   - Provides unified user object with all authentication data
   - Handles state synchronization and persistence

2. **Protected Routes** (`src/components/ProtectedRoute.jsx`)
   - `ProtectedRoute` - Generic protection with configurable requirements
   - `WalletProtectedRoute` - Requires wallet connection only
   - `GitHubProtectedRoute` - Requires GitHub authentication only
   - `FullyProtectedRoute` - Requires both wallet and GitHub

3. **Authentication Flow** (`src/components/AuthFlow.jsx`)
   - Guided onboarding experience
   - Step-by-step wallet and GitHub connection
   - Auto-progression and completion handling

4. **Auto-Authentication Hooks** (`src/hooks/useAutoAuth.js`)
   - `useAutoAuth` - Generic auto-authentication with configurable requirements
   - `useFullAuth` - Requires both wallet and GitHub
   - `useWalletAuth` - Requires wallet only
   - `useGitHubAuth` - Requires GitHub only

5. **Status Components**
   - `AuthStatus` - Shows current authentication status with dropdown
   - `AuthBanner` - Contextual authentication prompts
   - `AuthTest` - Comprehensive testing interface

## 🔐 Authentication States

### Primary States
- `walletConnected` - Wallet is connected via RainbowKit
- `githubConnected` - GitHub is authenticated via Firebase
- `authenticationComplete` - Both wallet and GitHub are connected
- `isAuthenticated` - General authentication state

### User Object Structure
```javascript
{
  // Firebase/GitHub data
  uid: "firebase-uid",
  email: "user@example.com",
  displayName: "User Name",
  photoURL: "avatar-url",
  username: "github-username",
  githubAccessToken: "github-token",
  
  // Wallet data
  walletAddress: "0x...",
  walletConnected: true,
  chainId: 43113,
  chainName: "Avalanche Fuji",
  
  // Additional data
  isNewUser: false
}
```

## 🛡️ Route Protection

### Implementation
Routes are protected using wrapper components that check authentication requirements:

```jsx
// Requires both wallet and GitHub
<FullyProtectedRoute>
  <Dashboard />
</FullyProtectedRoute>

// Requires wallet only
<WalletProtectedRoute>
  <Stake />
</WalletProtectedRoute>

// Requires GitHub only
<GitHubProtectedRoute>
  <Challenges />
</GitHubProtectedRoute>
```

### Current Route Configuration
- **Public Routes**: Landing, Leaderboard
- **Wallet Required**: Stake, Quests
- **GitHub Required**: Challenges
- **Both Required**: Dashboard, Profile, Contributions

## 🔄 Auto-Authentication Flow

### 1. Application Startup
- Check existing authentication state
- Restore user session from localStorage
- Initialize authentication prompts if needed

### 2. Partial Authentication Detection
- If wallet connected but GitHub missing → Show GitHub prompt
- If GitHub connected but wallet missing → Show wallet prompt
- Auto-redirect to auth flow for protected routes

### 3. Session Persistence
- Store authentication data in localStorage
- Maintain session across browser refreshes
- Auto-cleanup on logout

## 🎨 User Experience

### Authentication Flow
1. **Landing Page**: Shows auth banner if partially authenticated
2. **Auth Flow Page**: Guided step-by-step authentication
3. **Protected Routes**: Auto-redirect or show auth prompt
4. **Header Status**: Always visible authentication status

### Visual Indicators
- 🟢 Green: Fully authenticated
- 🟡 Yellow: Partially authenticated
- 🔴 Red: Not authenticated

## 🧪 Testing

### Test Page (`/auth-test`)
Comprehensive testing interface that verifies:
- Authentication state management
- Route protection
- Auto-authentication hooks
- Data persistence
- Context synchronization

### Test Scenarios
1. **Fresh User**: No authentication
2. **Wallet Only**: Wallet connected, no GitHub
3. **GitHub Only**: GitHub connected, no wallet
4. **Full Auth**: Both connected
5. **Session Restore**: Refresh browser, maintain state

## 🔧 API Integration

### Context Methods
```javascript
const {
  // States
  walletConnected,
  githubConnected,
  authenticationComplete,
  user,
  
  // Actions
  disconnectWallet,
  disconnectGitHub,
  disconnectAll,
  
  // Helpers
  getAuthStatus,
  getMissingAuth,
  requiresWallet,
  requiresGitHub,
  requiresBoth
} = useAuthContext();
```

### Auto-Auth Hooks
```javascript
// Full authentication required
const { isAuthenticated, redirectToAuth } = useFullAuth();

// Wallet only
const { hasRequiredWallet } = useWalletAuth();

// GitHub only
const { hasRequiredGitHub } = useGitHubAuth();
```

## 📱 Components Usage

### AuthStatus Component
```jsx
// Compact status
<AuthStatus />

// Detailed dropdown
<AuthStatus showDetails={true} />
```

### AuthBanner Component
```jsx
// Show when both required
<AuthBanner requireBoth={true} />

// Dismissible banner
<AuthBanner requireWallet={true} dismissible={true} />
```

### Protected Routes
```jsx
// Custom requirements
<ProtectedRoute 
  requireWallet={true}
  requireGitHub={true}
  redirectTo="/custom-auth"
>
  <MyComponent />
</ProtectedRoute>
```

## 🚀 Getting Started

### 1. Environment Setup
Ensure your `.env` file has:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other Firebase config

# GitHub OAuth
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Test the System
1. Visit `/auth-test` to run comprehensive tests
2. Try accessing protected routes without authentication
3. Test the complete authentication flow at `/auth-flow`
4. Verify session persistence by refreshing the browser

### 3. Integration
The system is already integrated into your app. Key pages:
- **Landing** (`/`): Shows auth prompts for partial authentication
- **Dashboard** (`/dashboard`): Requires full authentication
- **Stake** (`/stake`): Requires wallet connection
- **Challenges** (`/challenges`): requires GitHub authentication

## 🔍 Troubleshooting

### Common Issues
1. **Firebase not configured**: Check environment variables
2. **GitHub OAuth not working**: Verify client ID/secret and callback URLs
3. **Wallet not connecting**: Check RainbowKit configuration
4. **Routes not protecting**: Verify ProtectedRoute wrapper usage

### Debug Tools
- Use `/auth-test` page for comprehensive debugging
- Check browser console for authentication errors
- Inspect localStorage for persisted data
- Use AuthStatus component to monitor real-time state

## 🎉 Features

✅ **Unified Authentication**: Single context manages both wallet and GitHub  
✅ **Route Protection**: Flexible protection with different requirements  
✅ **Auto-Authentication**: Smart prompts and redirects  
✅ **Session Persistence**: Maintains state across browser sessions  
✅ **User Experience**: Guided onboarding and clear status indicators  
✅ **Testing Suite**: Comprehensive testing and debugging tools  
✅ **Type Safety**: Full TypeScript support (if using TypeScript)  
✅ **Mobile Responsive**: Works on all device sizes  

The authentication system is now fully implemented and ready for production use! 🚀
