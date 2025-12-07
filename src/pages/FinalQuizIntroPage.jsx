import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const FinalQuizIntroPage = () => {
  const navigate = useNavigate();

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">Quiz Final</h1>
              <p className="text-gray-700">
                Uji pemahaman akhir Anda. Quiz ini terdiri dari <strong>10 soal</strong> yang mewakili seluruh
                modul, dengan durasi total <strong>10 menit</strong>. Pastikan koneksi stabil sebelum memulai.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/home')}
              className="cursor-pointer"
            >
              ← Kembali
            </Button>
          </div>

          <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
            <li>Jumlah soal: 10</li>
            <li>Jenis: Pilihan ganda</li>
            <li>Durasi: 10 menit</li>
            <li>Gunakan tombol <strong>Berikutnya</strong> dan <strong>Sebelumnya</strong> untuk navigasi.</li>
          </ul>

          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate('/home')} className="cursor-pointer">
              Kembali
            </Button>
            <Button variant="primary" onClick={() => navigate('/quiz-final')} className="cursor-pointer">
              Mulai Quiz Final
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinalQuizIntroPage;