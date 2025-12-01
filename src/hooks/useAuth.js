/**
 * useAuth Hook
 * Handle authentication logic
 */

import { useState, useCallback } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Register user
   */
  const register = useCallback(async (name, username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(name, username, password);
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
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(username, password);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setError(null);
  }, []);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = authService.isAuthenticated();

  /**
   * Get current user
   */
  const user = authService.getUser();

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