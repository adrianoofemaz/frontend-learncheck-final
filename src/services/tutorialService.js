/**
 * Tutorial Service
 * Handle tutorials/learning materials
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { MODULES_DATA } from '../constants/modulesData';
import authService from './authService';

// Mock tutorials - ONLY untuk sidebar/title references (BUKAN fallback)
const MOCK_TUTORIALS = [
  { id: 35363, title: 'Penerapan AI dalam Dunia Nyata' },
  { id: 35368, title: 'Pengenalan AI' },
  { id: 35373, title: 'Taksonomi AI' },
  { id: 35378, title: 'AI Workflow' },
  { id: 35383, title: '[Story] Belajar Mempermudah Pekerjaan dengan AI' },
  { id: 35388, title: 'Kriteria Data untuk AI' },
  { id: 35393, title: 'Pengenalan Data' },
  { id: 35398, title: 'Dataset Preparation' },
  { id: 35403, title: 'Model Training' },
  { id: 35428, title: 'Tipe-Tipe Machine Learning' },
];

export const tutorialService = {
  /**
   * Get all modules (statis data)
   */
  getModules: async () => {
    return MODULES_DATA;
  },

  /**
   * Get module by ID (statis)
   */
  getModule: async (id) => {
    const module = MODULES_DATA.find((m) => m.id == id);
    return module || null;
  },

  /**
   * Get mock tutorial title by ID
   * HANYA untuk sidebar/reference - bukan actual content
   */
  getMockTutorialTitle: (id) => {
    const tutorial = MOCK_TUTORIALS.find((t) => t.id === id);
    return tutorial?.title || `Tutorial ${id}`;
  },

  /**
   * Get tutorials list for sidebar
   * Returns mock data untuk titles/sidebar reference
   */
  getMockTutorials: () => {
    return MOCK_TUTORIALS;
  },

  /**
   * Get tutorial detail by ID from backend
   * Response: { status, message, data: { content, title, ... } }
   */
  getTutorialDetail: async (id) => {
    console.log('🔍 Fetching tutorial detail for ID:', id);
    try {
      const token = authService.getToken();

      if (!token) {
        console.log('❌ No token - user not authenticated');
        throw new Error('Silakan login terlebih dahulu');
      }

      const url = API_ENDPOINTS.TUTORIAL_DETAIL(id);
      console.log('🔗 URL:', url);

      const response = await api.get(url);
      console.log('✅ Tutorial detail response:', response);

      const tutorialData = response.data?.data;

      // Jika backend tidak mengembalikan konten, anggap tidak ditemukan
      if (!tutorialData || !tutorialData.content) {
        return null;
      }

      // Format ke struktur yang diharapkan oleh component
      const tutorial = {
        id,
        title: tutorialData.title || tutorialService.getMockTutorialTitle(id),
        data: {
          content: tutorialData.content,
        },
      };

      console.log('✅ Found tutorial:', tutorial);
      return tutorial;
    } catch (err) {
      // Jika backend balas 404, kembalikan null agar UI bisa fallback
      if (err.response?.status === 404) {
        console.warn(`⚠️ Tutorial ${id} tidak ditemukan (404)`);
        return null;
      }
      console.error('❌ Error fetching tutorial detail:', err.message);
      throw err;
    }
  },

  /**
   * Get assessment/quiz for tutorial
   */
  getAssessment: async (tutorialId) => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Silakan login terlebih dahulu');
      }

      const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
      console.log('🔗 Fetching assessment from:', url);

      const response = await api.get(url);
      console.log('✅ Assessment response:', response);

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching assessment:', error.message);
      throw error;
    }
  },

  /**
   * Submit quiz answers
   */
  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Silakan login terlebih dahulu');
      }

      const url = API_ENDPOINTS.SUBMIT_ASSESSMENT(tutorialId, assessmentId);
      console.log('🔗 Submitting answers to:', url);

      const response = await api.post(url, { answers });
      console.log('✅ Answers submitted, response:', response);

      return response.data;
    } catch (error) {
      console.error('❌ Error submitting answers:', error.message);
      throw error;
    }
  },
};

export default tutorialService;