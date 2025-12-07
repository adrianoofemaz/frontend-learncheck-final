import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const mockModuleName = 'Berkenalan dengan AI';
const mockSummary = {
  score: '95.5%',
  status: 'Lulus',
  waktu: '1 Jam 30 Menit',
};

// Dummy submodule scores (placeholder sebelum pakai chart)
const submoduleScores = [
  { title: 'Penerapan AI dalam Dunia Nyata', value: 95 },
  { title: 'Pengenalan AI', value: 66 },
  { title: 'Taksonomi AI', value: 33 },
  { title: 'AI Workflow', value: 100 },
  { title: '[Story] Belajar Mempermudah Pekerjaan dengan AI', value: 66 },
  { title: 'Pengenalan Data', value: 33 },
  { title: 'Kriteria Data untuk AI', value: 100 },
  { title: 'Infrastruktur Data di Industri', value: 100 },
  { title: '[Story] Apa yang Diperlukan untuk Membuat AI?', value: 66 },
  { title: 'Tipe-Tipe Machine Learning', value: 100 },
];

// Dummy heatmap data
const heatmapRows = [
  { title: 'Penerapan AI dalam Dunia Nyata', score: 100, timeSec: 50, attempts: 1 },
  { title: 'Pengenalan AI', score: 66, timeSec: 72, attempts: 1 },
  { title: 'Taksonomi AI', score: 33, timeSec: 88, attempts: 2 },
  { title: 'AI Workflow', score: 100, timeSec: 48, attempts: 1 },
  { title: '[Story] Belajar Mempermudah Pekerjaan dengan AI', score: 66, timeSec: 70, attempts: 2 },
  { title: 'Pengenalan Data', score: 33, timeSec: 85, attempts: 1 },
  { title: 'Kriteria Data untuk AI', score: 100, timeSec: 52, attempts: 1 },
  { title: 'Infrastruktur Data di Industri', score: 100, timeSec: 55, attempts: 1 },
  { title: '[Story] Apa yang Diperlukan untuk Membuat AI?', score: 66, timeSec: 68, attempts: 1 },
  { title: 'Tipe-Tipe Machine Learning', score: 100, timeSec: 47, attempts: 1 },
];

const infoNote =
  'Beberapa materi masih menunjukkan area yang perlu diperkuat, terutama Taksonomi AI, Pengenalan Data, serta dua modul story yang masing-masing memiliki nilai di bawah optimal atau membutuhkan lebih dari satu percobaan. Fokuskan peningkatan pada pemahaman konsep dasar data dan klasifikasi AI.';

// Helpers for heatmap colors
const colorByScore = (v) => (v > 75 ? 'bg-green-50' : v > 50 ? 'bg-yellow-50' : 'bg-red-50');
const colorByTime = (v) => (v < 60 ? 'bg-green-50' : v < 90 ? 'bg-yellow-50' : 'bg-red-50'); // lebih cepat lebih hijau
const colorByAttempts = (v) => (v <= 1 ? 'bg-green-50' : v === 2 ? 'bg-yellow-50' : 'bg-red-50');

const DashboardModulPage = () => {
  const navigate = useNavigate();

  const goResult = () => navigate(ROUTES.QUIZ_FINAL_RESULT);
  const goHome = () => navigate(ROUTES.HOME);

  return (
    <div className="py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-700">Modul: {mockModuleName}</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
                <Button variant="secondary" onClick={goResult} className="cursor-pointer">
                  ← Kembali ke Hasil
                </Button>
                <Button variant="primary" className="cursor-pointer">
                  Unduh Laporan PDF
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Summary cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5">
            <p className="text-sm text-gray-600">Nilai Akhir Modul</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">{mockSummary.score}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-gray-600">Status Kelulusan</p>
            <p className="text-2xl font-bold text-green-600 mt-2">{mockSummary.status}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-gray-600">Total Waktu Belajar</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{mockSummary.waktu}</p>
          </Card>
        </div>

        {/* Submodule score placeholder (bar list) */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Nilai Quiz Submodul</h2>
            <span className="text-sm text-gray-500">Grafik akan diganti chart saat backend siap</span>
          </div>
          <div className="space-y-3">
            {submoduleScores.map((s, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">Submodul {idx + 1}</div>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${s.value}%` }} />
                  </div>
                  <p className="text-sm text-gray-800 mt-1">{s.title}</p>
                </div>
                <div className="w-14 text-right font-semibold text-gray-900">{s.value}%</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Heatmap */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Heatmap</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-blue-50 text-left">
                  <th className="px-4 py-3 font-semibold text-gray-900">Materi</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Nilai</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Waktu</th>
                  <th className="px-4 py-3 font-semibold text-gray-900">Percobaan</th>
                </tr>
              </thead>
              <tbody>
                {heatmapRows.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-gray-800">{row.title}</td>
                    <td className={`px-4 py-3 font-semibold text-gray-900 ${colorByScore(row.score)}`}>
                      {row.score}%
                    </td>
                    <td className={`px-4 py-3 text-gray-800 ${colorByTime(row.timeSec)}`}>
                      {row.timeSec} detik
                    </td>
                    <td className={`px-4 py-3 text-gray-800 ${colorByAttempts(row.attempts)}`}>
                      {row.attempts}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-5">
          <div className="flex items-start gap-3">
            <div className="text-blue-500 mt-1">ℹ️</div>
            <p className="text-gray-800 text-sm leading-relaxed">{infoNote}</p>
          </div>
        </Card>

        {/* Actions bottom */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="primary" className="cursor-pointer">
            Unduh Laporan PDF
          </Button>
          <Button variant="secondary" onClick={goHome} className="cursor-pointer">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardModulPage;