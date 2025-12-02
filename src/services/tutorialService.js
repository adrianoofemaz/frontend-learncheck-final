
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.capstone.web.id',
  timeout: 10000,
});

// Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('learncheck_auth_token');
  if (token) {
    config. headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const tutorialService = {
  getTutorials: async () => {
    const response = await api.get('/tutorials');
    return response.data;
  },

  getTutorialDetail: async (id) => {
    const response = await api.get(`/tutorials/${id}`);
    return response.data;
  },

  getAssessment: async (tutorialId) => {
    const response = await api.get(`/assessment/tutorial/${tutorialId}`);
    return response.data;
  },

  submitAnswers: async (tutorialId, assessmentId, answers) => {
    const response = await api.post(
      `/submit/tutorial/${tutorialId}/assessment/${assessmentId}`,
      { answers }
    );
    return response. data;
  },
};

export default tutorialService;