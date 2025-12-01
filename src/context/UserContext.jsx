/**
 * UserContext
 * Manage user profile & preferences
 */

import React, { createContext, useState, useCallback } from 'react';
import userService from '../services/userService';
import { APP_CONFIG } from '../constants/config';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(
    JSON.parse(localStorage.getItem(APP_CONFIG.storage.preferences)) || {
      theme: 'light',
      font_size: 'md',
      font: 'sans',
      layout_width: 'fluid',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user preferences
   */
  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getPreferences();
      setPreferences(response);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch preferences');
      setLoading(false);
    }
  }, []);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(async (newPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.updatePreferences(newPreferences);
      setPreferences(response. preference);
      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update preferences');
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Change theme
   */
  const changeTheme = useCallback(async (theme) => {
    try {
      const updated = await updatePreferences({ ... preferences, theme });
      return updated;
    } catch (err) {
      throw err;
    }
  }, [preferences, updatePreferences]);

  /**
   * Change font size
   */
  const changeFontSize = useCallback(async (fontSize) => {
    try {
      const updated = await updatePreferences({ ...preferences, font_size: fontSize });
      return updated;
    } catch (err) {
      throw err;
    }
  }, [preferences, updatePreferences]);

  const value = {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreferences,
    changeTheme,
    changeFontSize,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;