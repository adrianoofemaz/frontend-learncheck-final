/**
 * UserContext
 * Manage user profile & preferences
 */

import React, { createContext, useState, useCallback } from "react";
import userService from "../services/userService";
import { STORAGE_KEYS } from "../constants/config";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(
    JSON.parse(sessionStorage.getItem(STORAGE_KEYS.preferences)) || {
      theme: "light",
      font_size: "md",
      font: "sans",
      layout_width: "fluid",
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

      // Set preference to state
      setPreferences(response.preference);

      // Save to sessionStorage
      sessionStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify(response.preference)
      );

      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch preferences");
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

      // UPDATE state
      setPreferences(response.preference);

      // UPDATE session storage
      sessionStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify(response.preference)
      );

      setLoading(false);
      return response;
    } catch (err) {
      setError(err.message || "Failed to update preferences");
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Change theme
   */
  const changeTheme = useCallback(
    async (theme) => {
      return updatePreferences({ ...preferences, theme });
    },
    [preferences, updatePreferences]
  );

  /**
   * Change font size
   */
  const changeFontSize = useCallback(
    async (fontSize) => {
      return updatePreferences({ ...preferences, font_size: fontSize });
    },
    [preferences, updatePreferences]
  );

  const value = {
    preferences,
    loading,
    error,
    fetchPreferences,
    updatePreferences,
    changeTheme,
    changeFontSize,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
