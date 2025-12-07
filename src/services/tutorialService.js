/**
 * Tutorial Service
 * Handle tutorials/learning materials
 */
import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { MODULES_DATA } from '../constants/modulesData';
import authService from './authService';

// Mock tutorials - ONLY untuk sidebar/title references (BUKAN fallback konten)
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
   * Get all modules (static data)
   */
  getModules: async () => {
    return MODULES_DATA;
  },

  /**
   * Get module by ID (static)
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
   * Menangani struktur:
   * {
   *   tutorial: { status, message, data: { content, title? } },
   *   progress: { ... }
   * }
   * atau variasi lain.
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

      const tutorialEnvelope = response.data?.tutorial;
      const raw =
        tutorialEnvelope?.data ??
        response.data?.data ?? // fallback jika backend menaruh langsung di data
        response.data;

      // Ambil konten dari berbagai kemungkinan field yang mungkin dipakai backend
      const content =
        raw?.content ??
        raw?.material ??
        raw?.materi ??
        raw?.body ??
        raw?.text ??
        raw?.html ??
        null;

      // Fallback: jika raw adalah string/array
      const fallbackContent =
        typeof raw === 'string' ? raw : Array.isArray(raw) ? JSON.stringify(raw, null, 2) : null;

      const finalContent = content ?? fallbackContent;

      if (!finalContent) {
        console.warn(`⚠️ Tutorial ${id} tidak punya field konten yang dikenali`);
        return null;
      }

      const tutorial = {
        id,
        title:
          raw?.title ||
          tutorialEnvelope?.title ||
          tutorialService.getMockTutorialTitle(id),
        data: {
          content: finalContent,
        },
        // jika mau pakai progress dari backend:
        progress: response.data?.progress || null,
      };

      console.log('✅ Mapped tutorial:', tutorial);
      return tutorial;
    } catch (err) {
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