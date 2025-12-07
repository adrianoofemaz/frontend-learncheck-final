import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

// Fallback dummy (hilangkan nanti saat backend siap)
const mockResult = {
  moduleName: 'Berkenalan dengan AI',
  score: '95.5%',
  status: 'Lulus',
  waktu: '1 Jam 30 Menit',
};

const mockQuestions = [
  {
    id: 1,
    title: 'Pembahasan Soal 1 dari 10',
    question: 'Self-driving car menggunakan sensor LIDAR untuk...',
    options: [
      { id: 1, text: 'Mengatur kecepatan mobil secara otomatis' },
      { id: 2, text: 'Mengonversi suara pengguna menjadi perintah' },
      { id: 3, text: 'Mengukur jarak dan memetakan objek di sekitar kendaraan' },
      { id: 4, text: 'Menghasilkan rute terbaik dengan algoritma dijkstra' },
    ],
    correctId: 3,
    userAnswerId: 3,
    explanation:
      'LIDAR memancarkan cahaya untuk mengukur jarak objek, membantu mendeteksi kendaraan lain, pejalan kaki, dan lingkungan sekitar.',
  },
  {
    id: 2,
    title: 'Pembahasan Soal 2 dari 10',
    question: 'Apa tujuan utama pengembangan AI pada masa awal tahun 1950-an?',
    options: [
      { id: 1, text: 'Menciptakan robot humanoid' },
      { id: 2, text: 'Membuat komputer yang bisa meniru kemampuan kognitif manusia' },
      { id: 3, text: 'Menggantikan semua pekerjaan manusia' },
      { id: 4, text: 'Mengembangkan media sosial berbasis AI' },
    ],
    correctId: 2,
    userAnswerId: 2,
    explanation:
      'Peneliti seperti Turing, McCarthy, dan Minsky ingin komputer menyelesaikan masalah seperti manusia—belajar, berpikir, memahami bahasa, dan mengenali pola.',
  },
  // ...tambahkan sampai 10 bila perlu
];

const statusBadge = (isCorrect) => (
  <span
    className={`inline-flex items-center gap-2 text-sm font-semibold px-2 py-1 rounded ${
      isCorrect ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
    }`}
  >
    {isCorrect ? 'Benar ✅' : 'Salah ❌'}
  </span>
);

const FinalQuizResultPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Ambil dari state jika tersedia, fallback ke dummy
  const resultData = state?.result || mockResult;
  const questions = state?.questions || mockQuestions;

  const goDashboard = () => navigate(ROUTES.DASHBOARD_MODUL);
  const goHome = () => navigate(ROUTES.HOME);
  const retryQuiz = () => navigate(ROUTES.QUIZ_FINAL);

  return (
    <div className="py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-1">Hasil Quiz Modul</h1>
              <p className="text-gray-700">Modul: {resultData.moduleName || 'Modul'}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={retryQuiz} className="cursor-pointer">
                ← Ulang Quiz
              </Button>
              <Button variant="primary" onClick={goDashboard} className="cursor-pointer">
                Lanjut ke Dashboard Modul
              </Button>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5">
            <p className="text-sm text-gray-600">Nilai Akhir</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{resultData.score || '-'}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-gray-600">Status</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{resultData.status || '-'}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-gray-600">Total Waktu</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{resultData.waktu || '-'}</p>
          </Card>
        </div>

        {/* Review Answers */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Review Jawaban</h2>
          <div className="space-y-6">
            {questions.map((q) => {
              const isCorrect = q.userAnswerId === q.correctId;
              return (
                <div key={q.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm font-semibold text-gray-800">{q.title}</p>
                    {statusBadge(isCorrect)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Soal:</p>
                    <p className="text-gray-900 font-semibold">{q.question}</p>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const selected = opt.id === q.userAnswerId;
                      const correct = opt.id === q.correctId;
                      const base =
                        'w-full text-left px-3 py-2 rounded border transition flex items-start gap-2 text-sm';
                      const stateClass = correct
                        ? 'border-green-500 bg-green-50'
                        : selected
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white';
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={`${base} ${stateClass}`}
                          disabled
                        >
                          <span className="mt-1">•</span>
                          <span className="text-gray-800">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
                      <p className="font-semibold mb-1">Penjelasan:</p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Bottom actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="primary" onClick={goDashboard} className="cursor-pointer">
            Lanjut ke Dashboard Modul
          </Button>
          <Button variant="secondary" onClick={goHome} className="cursor-pointer">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalQuizResultPage;