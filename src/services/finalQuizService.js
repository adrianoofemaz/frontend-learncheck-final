import api from './api';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import authService from './authService';

// Dummy 10 soal untuk render UI; ganti dengan fetch backend saat siap
const dummyQuestions = Array.from({ length: 10 }).map((_, idx) => ({
  id: `q${idx + 1}`,
  assessment: `Soal final ke-${idx + 1}: Apa jawaban yang tepat?`,
  multiple_choice: [
    { id: 1, option: 'Pilihan A' },
    { id: 2, option: 'Pilihan B' },
    { id: 3, option: 'Pilihan C' },
    { id: 4, option: 'Pilihan D' },
  ],
}));

const finalQuizService = {
  getFinalQuestions: async () => {
    const token = authService.getToken();
    if (!token) throw new Error('Silakan login terlebih dahulu');

    // TODO: aktifkan ketika backend ready
    // const res = await api.get(API_ENDPOINTS.QUESTIONS_FINAL);
    // return res.data?.data?.questions || res.data;

    return dummyQuestions;
  },
};

export default finalQuizService;