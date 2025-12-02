/**
 * useAuth Hook
 */

import { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const { user, setUser, token, setToken } = authContext;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      console.log('Calling authService.login.. .');
      
      const response = await authService. login(email, password);
      console.log('Login response:', response);

      // Extract user & token from response
      // Token bisa di: response.user.token, response. token, atau response.data.token
      const userData = response.user || response.data?. user;
      const tokenData = response.user?.token || response.token || response.data?.token;

      console.log('User data:', userData);
      console. log('Token:', tokenData);

      if (! tokenData) {
        throw new Error('Token tidak ditemukan di response');
      }

      // Save to localStorage
      localStorage.setItem('token', tokenData);
      localStorage. setItem('user', JSON.stringify(userData));

      // Save to context
      setToken(tokenData);
      setUser(userData || {});

      console.log('✓ Login successful');
      return { user: userData, token: tokenData };
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login gagal';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setToken]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  }, [setUser, setToken, navigate]);

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  };
};

export default useAuth;