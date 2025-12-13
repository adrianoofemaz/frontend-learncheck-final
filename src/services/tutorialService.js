/**
 * Tutorial Service
 * Handle tutorials/learning materials
 */
import api from "./api";
import { API_ENDPOINTS } from "../constants/apiEndpoints";
import { MODULES_DATA } from "../constants/modulesData";


/**
 * Mock singkat untuk fallback (jika backend 404/down).
 * Isi konten boleh Anda ganti dengan versi lengkap kalau perlu.
 */
const MOCK_TUTORIALS = [
  { id: 35363, title: "Penerapan AI dalam Dunia Nyata", content: "<p>Konten mock.</p>" },
  { id: 35368, title: "Pengenalan AI", content: "<p>Konten mock.</p>" },
  { id: 35373, title: "Taksonomi AI", content: "<p>Konten mock.</p>" },
  { id: 35378, title: "AI Workflow", content: "<p>Konten mock.</p>" },
  { id: 35383, title: "[Story] Belajar Mempermudah Pekerjaan dengan AI", content: "<p>Konten mock.</p>" },
  { id: 35398, title: "Pengenalan Data", content: "<p>Konten mock.</p>" },
  { id: 35403, title: "Kriteria Data untuk AI", content: "<p>Konten mock.</p>" },
  { id: 35793, title: "Infrastruktur Data di Industri", content: "<p>Konten mock.</p>" },
  { id: 35408, title: "[Story] Apa yang Diperlukan untuk Membuat AI?", content: "<p>Konten mock.</p>" },
  { id: 35428, title: "Tipe-Tipe Machine Learning", content: "<p>Konten mock.</p>" },
];

const getMock = (id) => MOCK_TUTORIALS.find((t) => t.id === id) || null;

export const tutorialService = {
  getModules: async () => MODULES_DATA,
  getModule: async (id) => MODULES_DATA.find((m) => m.id == id) || null,
  getMockTutorialTitle: (id) => getMock(id)?.title || `Tutorial ${id}`,
  getMockTutorials: () => MOCK_TUTORIALS,

  getTutorialDetail: async (id) => {
    try {
      const res = await api.get(API_ENDPOINTS.TUTORIAL_DETAIL(id));

      // 🟢 Ambil konten dari envelope { tutorial: { data: {...} } }
      const envelope = res.data?.tutorial;
      const raw =
        envelope?.data ??
        res.data?.data ?? // kalau backend taruh langsung di data
        res.data ??
        null;

      const extracted =
        raw?.content ??
        raw?.material ??
        raw?.materi ??
        raw?.body ??
        raw?.text ??
        raw?.html;

      const content =
        extracted !== undefined && extracted !== null
          ? extracted // termasuk string kosong
          : typeof raw === "string"
          ? raw
          : Array.isArray(raw)
          ? JSON.stringify(raw, null, 2)
          : null;

      if (content === null) {
        const mock = getMock(id);
        return mock
          ? { id, title: mock.title, data: { content: mock.content }, progress: null }
          : null;
      }

      return {
        id,
        title: raw?.title || envelope?.title || tutorialService.getMockTutorialTitle(id),
        data: { content },
        progress: res.data?.progress || envelope?.progress || null,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        const mock = getMock(id);
        return mock
          ? { id, title: mock.title, data: { content: mock.content }, progress: null }
          : null;
      }
      throw err;
    }
  },

  getAssessment: async (tutorialId) => {
    const res = await api.get(API_ENDPOINTS.ASSESSMENT(tutorialId));
    return res.data;
  },

  submitAnswers: async (tutorialId, assessmentId, answers) => {
    const res = await api.post(API_ENDPOINTS.SUBMIT_ASSESSMENT(tutorialId, assessmentId), { answers });
    return res.data;
  },
};

export default tutorialService;