/**
 * AuthContext
 * Manage authentication state globally
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize auth - check if user already logged in
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = authService.getToken();
        const userData = authService.getUser();

        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Handle login
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Handle register
   */
  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(email, password, name);
      setUser(response.user);
      setIsAuthenticated(true);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Register failed');
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Handle logout
   */
  const logout = useCallback(() => {
    authService. logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;