/**
 * UserContext
 * Manage user profile & preferences
 */
import React, { createContext, useState, useCallback } from "react";
import userService from "../services/userService";
import { STORAGE_KEYS } from "../constants/config";
import { useProgress } from "./ProgressContext"; // <-- tambahkan ini

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { setProgressMap } = useProgress(); // <-- ambil setter progres
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
   * Fetch user preferences (atau profil bila API mengembalikan user+preference+progress)
   */
  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.getPreferences(); // pastikan endpoint ini mengembalikan preference (+ progress jika ada)

      // Set preference to state
      if (response.preference) {
        setPreferences(response.preference);
        sessionStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(response.preference));
      }

      // Sinkron progress bila tersedia
      if (response.progress) {
        setProgressMap(response.progress);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch preferences");
      setLoading(false);
    }
  }, [setProgressMap]);

  /**
   * Update user preferences
   */
  const updatePreferences = useCallback(
    async (newPreferences) => {
      setLoading(true);
      setError(null);

      try {
        const response = await userService.updatePreferences(newPreferences);

        if (response.preference) {
          setPreferences(response.preference);
          sessionStorage.setItem(STORAGE_KEYS.preferences, JSON.stringify(response.preference));
        }

        // Kalau API update juga mengembalikan progress, sinkronkan di sini
        if (response.progress) {
          setProgressMap(response.progress);
        }

        setLoading(false);
        return response;
      } catch (err) {
        setError(err.message || "Failed to update preferences");
        setLoading(false);
        throw err;
      }
    },
    [setProgressMap]
  );

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