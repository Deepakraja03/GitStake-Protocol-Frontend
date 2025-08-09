# GitHub Authentication with Firebase Setup Guide

This guide will help you set up GitHub authentication using Firebase in your React application.

## 🚀 Quick Start

1. **Update your environment variables** in `.env` file
2. **Set up Firebase project** and enable GitHub authentication
3. **Create GitHub OAuth App** and configure it
4. **Test the integration** using the test page

## 📋 Step-by-Step Setup

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **GitHub** and enable it
5. You'll need GitHub OAuth App credentials (next step)

### 2. GitHub OAuth App Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: Your app name
   - **Homepage URL**: `http://localhost:5173` (for development)
   - **Authorization callback URL**: `https://your-project-id.firebaseapp.com/__/auth/handler`
4. Click **"Register application"**
5. Copy the **Client ID** and **Client Secret**

### 3. Configure Firebase with GitHub

1. Back in Firebase Console → Authentication → Sign-in method → GitHub
2. Enter your GitHub **Client ID** and **Client Secret**
3. Copy the **Redirect URL** provided by Firebase
4. Go back to your GitHub OAuth App settings
5. Update the **Authorization callback URL** with the Firebase redirect URL

### 4. Update Environment Variables

Replace the placeholder values in your `.env` file:

```env
# Firebase config - Replace with your actual Firebase project values
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# GitHub OAuth App Secrets - Replace with your GitHub OAuth app values
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 5. Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/github-test` in your browser
3. Click "Connect GitHub" to test authentication
4. Run the integration tests to verify everything works

## 🔧 How It Works

### Authentication Flow

1. User clicks "Connect GitHub" button
2. Firebase opens GitHub OAuth popup
3. User authorizes your app on GitHub
4. Firebase receives the authorization code
5. Firebase exchanges it for an access token
6. User data and access token are stored in your app

### Key Components

- **`firebase.config.js`**: Firebase configuration and GitHub auth functions
- **`Github.jsx`**: GitHub authentication component
- **`useFirebaseAuth.js`**: Hook for Firebase authentication state
- **`AuthContext.jsx`**: Global authentication context
- **`GitHubProfile.jsx`**: Component to display GitHub profile data
- **`GitHubTest.jsx`**: Test page to verify integration

### Available Data

After successful authentication, you'll have access to:

- **User Profile**: Name, email, avatar, bio, location, company
- **GitHub Stats**: Public repos, followers, following, gists
- **Access Token**: For making authenticated GitHub API calls
- **User Permissions**: Based on requested scopes (user:email, read:user, repo)

## 🎯 Usage Examples

### Basic Authentication

```jsx
import GithubProvider from '../components/Github';

function MyComponent() {
  const handleSuccess = (userData) => {
    console.log('GitHub auth successful:', userData);
  };

  const handleError = (error) => {
    console.error('GitHub auth failed:', error);
  };

  return (
    <GithubProvider 
      onSuccess={handleSuccess}
      onError={handleError}
      className="w-full"
    />
  );
}
```

### Using GitHub API

```jsx
import { useAuthContext } from '../context/AuthContext';

function GitHubData() {
  const { user } = useAuthContext();

  const fetchRepos = async () => {
    if (!user?.githubAccessToken) return;

    const response = await fetch('https://api.github.com/user/repos', {
      headers: {
        'Authorization': `token ${user.githubAccessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const repos = await response.json();
    return repos;
  };

  // Use the fetchRepos function...
}
```

## 🔒 Security Notes

1. **Never expose your GitHub Client Secret** in frontend code
2. **Use environment variables** for all sensitive configuration
3. **Validate tokens** on your backend before making API calls
4. **Implement proper error handling** for authentication failures
5. **Consider token refresh** for long-lived applications

## 🐛 Troubleshooting

### Common Issues

1. **"Popup blocked"**: Ensure popups are allowed for your domain
2. **"Invalid redirect URI"**: Check Firebase redirect URL matches GitHub OAuth app
3. **"API rate limit"**: GitHub has rate limits for unauthenticated requests
4. **"Token expired"**: Implement token refresh or re-authentication

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded correctly
3. Test Firebase configuration in Firebase Console
4. Verify GitHub OAuth app settings
5. Use the `/github-test` page to run integration tests

## 📚 Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub API Documentation](https://docs.github.com/en/rest)

## 🎉 Next Steps

After successful setup, you can:

1. **Integrate with your backend** to store user data
2. **Fetch repository data** to calculate contribution scores
3. **Implement GitHub webhooks** for real-time updates
4. **Add more GitHub scopes** for additional permissions
5. **Create contribution analytics** based on GitHub activity

Happy coding! 🚀
