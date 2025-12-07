/**
 * Auth Context
 */

import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user & token from sessionStorage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem(STORAGE_KEYS.authToken);
    const savedUser = sessionStorage.getItem(STORAGE_KEYS.user);

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      try {
        setUser(JSON. parse(savedUser));
      } catch (err) {
        console.error('Error parsing saved user:', err);
      }
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    setUser,
    token,
    setToken,
    loading,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;