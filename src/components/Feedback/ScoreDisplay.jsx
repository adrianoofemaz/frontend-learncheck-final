import React from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';

const ScoreDisplay = ({ score, totalQuestions, percentage, passed, durationText }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border-2 border-blue-200 shadow-lg">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          {passed ? (
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          ) : (
            <XCircleIcon className="w-10 h-10 text-red-600" />
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {passed ? 'Selesai!' : 'Coba Lagi'}
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          {passed
            ? 'Selamat!  Anda telah menyelesaikan kuis dengan baik'
            : 'Anda perlu menjawab lebih banyak pertanyaan dengan benar'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 text-center shadow-md">
          <p className="text-gray-600 font-medium text-sm mb-2">Skor Anda</p>
          <p className="text-4xl md:text-5xl font-bold text-blue-600 mb-1">
            {score}/{totalQuestions}
          </p>
          <p className="text-gray-500 text-sm">soal terjawab benar</p>
        </div>

        <div className="bg-white rounded-xl p-6 text-center shadow-md">
          <p className="text-gray-600 font-medium text-sm mb-2">Persentase</p>
          <p className="text-4xl md:text-5xl font-bold text-indigo-600 mb-1">
            {percentage}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                passed ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 text-center shadow-md">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ClockIcon className="w-5 h-5 text-orange-500" />
            <p className="text-gray-600 font-medium text-sm">Durasi</p>
          </div>
          <p className="text-4xl md:text-5xl font-bold text-orange-600 mb-1">
            {durationText}
          </p>
          <p className="text-gray-500 text-sm">waktu pengerjaan</p>
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border-2 text-center ${
          passed
            ? 'bg-green-50 border-green-300 text-green-800'
            : 'bg-red-50 border-red-300 text-red-800'
        }`}
      >
        <p className="font-semibold text-lg mb-2">
          {passed ? 'Selamat! Anda Lulus!' : 'Perlu Belajar Lebih Lanjut'}
        </p>
        <p className="text-sm">
          {passed
            ? `Anda telah menjawab ${percentage}% soal dengan benar. Bagus sekali!  Lanjutkan ke pembelajaran berikutnya.`
            : `Anda baru mencapai ${percentage}%. Coba lagi untuk mendapatkan minimal 60% untuk lulus.`}
        </p>
      </div>
    </div>
  );
};

export default ScoreDisplay;