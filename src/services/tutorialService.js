/**
 * Tutorial Service
 * Handle tutorials/learning materials
 */

import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { MODULES_DATA } from '../constants/modulesData';
import authService from './authService';

// Mock tutorials - temporary fallback while backend is being fixed
const MOCK_TUTORIALS = [
  {
    id: 35363,
    title: "Penerapan AI dalam Dunia Nyata",
    content: "<h2>Penerapan AI dalam Dunia Nyata</h2><p>Mari kita mulai pembelajaran ini dengan mengenal penerapan AI di dunia nyata... </p>"
  },
  {
    id: 35368,
    title: "Pengenalan AI",
    content: "<h2>Pengenalan AI</h2><p>Artificial Intelligence (AI) adalah cabang dari ilmu komputer... </p>"
  },
  {
    id: 35373,
    title: "Taksonomi AI",
    content: "<h2>Taksonomi AI</h2><p>Taksonomi AI mencakup berbagai cabang dan subdisiplin...</p>"
  },
  {
    id: 35378,
    title: "AI Workflow",
    content: "<h2>AI Workflow</h2><p>Workflow AI adalah proses sistematis... </p>"
  },
  {
    id: 35383,
    title: "[Story] Belajar Mempermudah Pekerjaan dengan AI",
    content: "<h2>[Story] Belajar Mempermudah Pekerjaan dengan AI</h2><p>Cerita tentang bagaimana AI dapat digunakan... </p>"
  },
  {
    id: 35398,
    title: "Pengenalan Data",
    content: "<h2>Pengenalan Data</h2><p>Data adalah informasi yang diproses...</p>"
  },
  {
    id: 35403,
    title: "Kriteria Data untuk AI",
    content: "<h2>Kriteria Data untuk AI</h2><p>Data berkualitas tinggi adalah kunci kesuksesan... </p>"
  },
  {
    id: 35793,
    title: "Infrastruktur Data di Industri",
    content: "<h2>Infrastruktur Data di Industri</h2><p>Infrastruktur data modern memerlukan sistem... </p>"
  },
  {
    id: 35408,
    title: "[Story] Apa yang Diperlukan untuk Membuat AI?",
    content: "<h2>[Story] Apa yang Diperlukan untuk Membuat AI?</h2><p>Panduan lengkap tentang semua komponen...</p>"
  },
  {
    id: 35428,
    title: "Tipe-Tipe Machine Learning",
    content: "<h2>Tipe-Tipe Machine Learning</h2><p>Machine Learning dibagi menjadi beberapa tipe...</p>"
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
   * Try backend, fallback ke mock jika error
   */
  getTutorials: async (moduleId) => {
    try {
      const token = authService.getToken();
      
      if (!token) {
        console.log('No token - using mock tutorials');
        return MOCK_TUTORIALS;
      }

      const url = API_ENDPOINTS.TUTORIALS;
      console.log('Fetching tutorials from:', url);
      
      const response = await api.get(url);
      console.log('Tutorials response:', response);
      
      const tutorials = response.data?.  data?. tutorials || [];
      console. log('Tutorials extracted:', tutorials. length);
      
      if (tutorials.length > 0) {
        return tutorials;
      }
    } catch (err) {
      console.warn('Backend failed, using mock tutorials:', err. message);
    }
    
    // Fallback ke mock jika error atau kosong
    return MOCK_TUTORIALS;
  },

  /**
   * Get tutorial detail by ID
   * Cari dari tutorials list
   */
  getTutorialDetail: async (id) => {
    try {
      const tutorials = await tutorialService.getTutorials(null);
      const tutorial = tutorials. find(t => t.id == id);
      
      if (tutorial) {
        console.log('Found tutorial:', tutorial. title);
        return tutorial;
      }
      
      throw new Error(`Tutorial ${id} not found`);
    } catch (err) {
      console.error('Error fetching tutorial detail:', err. message);
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
        throw new Error('No authentication token.  Please login first.');
      }

      const url = API_ENDPOINTS.ASSESSMENT(tutorialId);
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
      const token = authService.getToken();
      if (!token) {
        throw new Error('No authentication token. Please login first.');
      }

      const url = API_ENDPOINTS. SUBMIT_ASSESSMENT(tutorialId, assessmentId);
      const response = await api.post(url, { answers });
      return response.data;
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  },
};

export default tutorialService;