import { useState, useEffect } from 'react';
import { auth, onAuthStateChanged } from '../../firebase.config';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔥 Firebase Auth: Setting up listener...');

    // Initialize with current auth state immediately
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('🔥 Firebase Auth: Found existing user on init');
      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        emailVerified: currentUser.emailVerified,
        username: currentUser.reloadUserInfo?.screenName ||
                 currentUser.providerData?.[0]?.displayName?.toLowerCase().replace(/\s+/g, ''),
      };
      setUser(userData);
      setLoading(false);
    } else {
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth,
      (firebaseUser) => {
        console.log('🔥 Firebase Auth State Changed:', {
          user: !!firebaseUser,
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          timestamp: new Date().toISOString()
        });

        if (firebaseUser) {
          // User is signed in
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            // Add GitHub-specific data if available
            username: firebaseUser.reloadUserInfo?.screenName ||
                     firebaseUser.providerData?.[0]?.displayName?.toLowerCase().replace(/\s+/g, ''),
          };
          setUser(userData);
          setError(null);
        } else {
          // User is signed out
          console.log('🔥 Firebase Auth: User signed out');
          setUser(null);
        }
        setLoading(false);
      },
      (authError) => {
        console.error('🔥 Firebase Auth Error:', authError);
        setError(authError.message);
        setUser(null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('🔥 Firebase Auth: Cleaning up listener...');
      unsubscribe();
    };
  }, []);

  return { user, loading, error };
};

export default useFirebaseAuth;
