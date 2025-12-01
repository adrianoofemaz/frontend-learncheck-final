/**
 * QuizIntroPage
 * Quiz introduction/info page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardDocumentCheckIcon, ClockIcon } from '@heroicons/react/24/solid';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const QuizIntroPage = () => {
  const navigate = useNavigate();

  const quizInfo = {
    title: 'Kuis AI Basics',
    totalQuestions: 10,
    timePerQuestion: 30, // seconds
    description: 'Tes pemahaman Anda tentang materi pembelajaran yang telah dipelajari',
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{quizInfo.title}</h1>
          <p className="text-gray-600 text-lg">{quizInfo.description}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8 py-8 border-y border-gray-200">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <ClipboardDocumentCheckIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Jumlah Soal</p>
            <p className="text-2xl font-bold text-gray-900">{quizInfo.totalQuestions}</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <ClockIcon className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Waktu per Soal</p>
            <p className="text-2xl font-bold text-gray-900">{quizInfo.timePerQuestion}s</p>
          </div>
        </div>

        {/* Rules */}
        <div className="text-left mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-gray-900 mb-3">Peraturan Kuis:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Jawab semua pertanyaan sebelum submit</li>
            <li>✓ Jangan refresh halaman saat mengerjakan</li>
            <li>✓ Setiap pertanyaan hanya bisa dijawab sekali</li>
            <li>✓ Waktu tidak dapat di-pause</li>
          </ul>
        </div>

        {/* Start Button */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button onClick={() => navigate(-1)} variant="secondary" fullWidth>
            Kembali
          </Button>
          <Button onClick={handleStartQuiz} variant="primary" fullWidth>
            Mulai Kuis →
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuizIntroPage;