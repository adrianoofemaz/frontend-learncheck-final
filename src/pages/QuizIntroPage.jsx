import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardDocumentCheckIcon, ClockIcon } from '@heroicons/react/24/solid';
import Button from '../components/Common/Button';

const QuizIntroPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quiz } = location.state || {};

  if (!quiz) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600 mb-4">Quiz data tidak ditemukan</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const handleStartQuiz = () => {
    navigate('/loading', { state: { quiz } });
  };

  return (
    <div className="quiz-hero-wrapper min-h-screen w-full flex items-start justify-center p-6">
      <div className="quiz-hero w-full max-w-4xl mx-auto">
        {/* Browser-like top bar */}
        <div className="quiz-window-bar rounded-t-2xl flex items-center px-4">
          <div className="window-controls flex items-center gap-3">
            <span className="window-dot dot-red" />
            <span className="window-dot dot-yellow" />
            <span className="window-dot dot-green" />
          </div>
        </div>

        {/* Hero body */}
        <div className="quiz-hero-body bg-white rounded-b-2xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="inline-block badge-hero bg-blue-600 text-white px-6 py-2 rounded-full font-medium">
              Quiz Submodul
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">LearnCheck!</h1>
          <p className="text-lg text-gray-600 mb-8 italic">
            “Let's have some fun and test your understanding!”
          </p>

          {/* Inner info card */}
          <div className="quiz-info-card mx-auto rounded-xl p-6 mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">{quiz.title}</h2>

            <div className="flex flex-col sm:flex-row sm:justify-center gap-6 sm:gap-12">
              <div className="flex items-center gap-3">
                <div className="icon-circle bg-blue-50 text-blue-600">
                  <ClipboardDocumentCheckIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Jumlah Soal:</p>
                  <p className="text-md font-semibold text-gray-900">{quiz.totalQuestions} Soal</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="icon-circle bg-blue-50 text-blue-600">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Durasi:</p>
                  <p className="text-md font-semibold text-gray-900">{quiz.durationPerQuestion} detik/soal</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mx-auto" style={{ maxWidth: 420 }}>
            <Button
              onClick={handleStartQuiz}
              variant="primary"
              className="w-full py-3 text-base font-bold btn-hero"
            >
              Mulai Kuis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizIntroPage;