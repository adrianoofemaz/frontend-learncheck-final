/**
 * Tutorial Service
 * Handle tutorials/learning materials
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { MODULES_DATA } from '../constants/modulesData';

// Mock data - for tutorial details fallback
const MOCK_TUTORIALS = [
  {
    id: 35363,
    title: "Penerapan AI dalam Dunia Nyata",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    id: 35368,
    title: "Pengenalan AI",
    content: "Artificial Intelligence (AI) adalah cabang dari ilmu komputer yang berfokus pada pengembangan mesin yang dapat melakukan tugas yang biasanya memerlukan kecerdasan manusia."
  },
  {
    id: 35373,
    title: "Taksonomi AI",
    content: "Taksonomi AI mencakup berbagai cabang dan subdisiplin yang mengelompokkan berbagai jenis sistem AI berdasarkan karakteristik dan kemampuannya."
  },
  {
    id: 35378,
    title: "AI Workflow",
    content: "Workflow AI adalah proses sistematis yang digunakan untuk mengembangkan, melatih, dan menerapkan model artificial intelligence dalam aplikasi nyata."
  },
  {
    id: 35383,
    title: "[Story] Belajar Mempermudah Pekerjaan dengan AI",
    content: "Cerita tentang bagaimana AI dapat digunakan untuk mempermudah pekerjaan sehari-hari dan meningkatkan produktivitas."
  },
  {
    id: 35398,
    title: "Pengenalan Data",
    content: "Data adalah informasi yang diproses dan diinterpretasikan untuk menghasilkan insight yang bermakna bagi pengambilan keputusan."
  },
  {
    id: 35403,
    title: "Kriteria Data untuk AI",
    content: "Data berkualitas tinggi adalah kunci kesuksesan dalam pengembangan model AI yang akurat dan reliable."
  },
  {
    id: 35793,
    title: "Infrastruktur Data di Industri",
    content: "Infrastruktur data modern memerlukan sistem yang scalable, secure, dan efficient untuk menangani volume data yang besar."
  },
  {
    id: 35408,
    title: "[Story] Apa yang Diperlukan untuk Membuat AI? ",
    content: "Panduan lengkap tentang semua komponen yang diperlukan untuk membangun sistem AI yang sukses."
  },
  {
    id: 35428,
    title: "Tipe-Tipe Machine Learning",
    content: "Machine Learning dibagi menjadi beberapa tipe: supervised learning, unsupervised learning, dan reinforcement learning."
  },
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
    const module = MODULES_DATA.find(m => m.id == id);
    return module || null;
  },

  /**
   * Get tutorials/submodules for a module
   * Only "Belajar Dasar AI" (id=9) has backend submodules
   */
  getTutorials: async (moduleId) => {
    try {
      const module = await tutorialService.getModule(moduleId);
      
      // If module has backend submodules
      if (module?. hasBackendSubmodules) {
        try {
          // Try to fetch from backend first
          const response = await api. get(API_ENDPOINTS. TUTORIALS);
          return response.data?. data?. tutorials || [];
        } catch (apiError) {
          console.warn('Backend API failed, using mock data:', apiError.message);
          // Fallback to mock data
          return MOCK_TUTORIALS;
        }
      }
      
      // Other modules don't have submodules yet
      return [];
    } catch (error) {
      console.error('Error fetching tutorials:', error);
      return [];
    }
  },

  /**
   * Get tutorial detail by ID
   */
  getTutorialDetail: async (id) => {
    try {
      try {
        // Try real API first
        const url = API_ENDPOINTS.TUTORIAL_DETAIL(id);
        const response = await api.get(url);
        return response.data?.data || response.data;
      } catch (apiError) {
        console.warn('Backend API failed for detail, using mock data:', apiError.message);
        // Fallback to mock data
        const tutorial = MOCK_TUTORIALS.find(t => t.id == id);
        return tutorial || { id, title: 'Not Found', content: '' };
      }
    } catch (error) {
      console.error('Error fetching tutorial detail:', error);
      throw error;
    }
  },

  /**
   * Get assessment/quiz for tutorial
   */
  getAssessment: async (tutorialId) => {
    try {
      const url = API_ENDPOINTS. ASSESSMENT(tutorialId);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }
  },

  /**
   * Submit quiz answers
   */
  submitAnswers: async (tutorialId, assessmentId, answers) => {
    try {
      const url = API_ENDPOINTS.SUBMIT_ASSESSMENT(tutorialId, assessmentId);
      const response = await api.post(url, { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  },
};

export default tutorialService;