/**
 * App Configuration
 */

export const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 'https://api.capstone. web.id';

export const APP_CONFIG = {
  api: {
    baseURL: API_BASE_URL,
    timeout: 10000,
  },
  storage: {
    authToken: 'learncheck_auth_token',
    user: 'learncheck_user',
    preferences: 'learncheck_preferences',
    progress: 'learncheck_progress',
  },
};

export default APP_CONFIG;