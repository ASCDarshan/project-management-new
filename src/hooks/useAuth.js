// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logOut } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      setError(null);
      setLoading(true);
      const user = await signInWithGoogle();
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await logOut();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return {
    currentUser,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!currentUser
  };
};