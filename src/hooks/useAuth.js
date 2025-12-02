/**
 * useAuth Hook
 * Handle authentication logic
 */

import { useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';
import { APP_CONFIG } from '../constants/config';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(APP_CONFIG.storage.user);
    const token = localStorage.getItem(APP_CONFIG.storage.authToken);
    
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  /**
   * Register user
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
   * Login user
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
      setError(err. message || 'Login failed');
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  return {
    register,
    login,
    logout,
    isAuthenticated,
    user,
    loading,
    error,
  };
};

export default useAuth;