/**
 * ResultsPage
 * Quiz results & feedback page dengan progress learning
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { Alert } from '../components/common';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tutorials, currentTutorial } = useLearning();
  const { updateTutorialProgress } = useProgress();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
      console.log('Result:', location.state.result);
    }
    setLoading(false);
  }, [location.state]);

  if (loading) {
    return <Loading fullScreen text="Memproses hasil..." />;
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center max-w-md">
          <Alert
            type="error"
            title="Hasil Tidak Ditemukan"
            message="Silakan coba kuis lagi"
          />
          <Button 
            onClick={() => navigate('/home')}
            variant="primary" 
            className="mt-4"
          >
            Kembali ke Beranda
          </Button>
        </Card>
      </div>
    );
  }

  // ✅ GET current tutorial index & next tutorial
  const currentIndex = tutorials.findIndex(t => t.id === currentTutorial?. id);
  const hasNextTutorial = currentIndex < tutorials.length - 1;
  const nextTutorial = hasNextTutorial ? tutorials[currentIndex + 1] : null;
  const isLastTutorial = currentIndex === tutorials.length - 1;

  // ✅ PARSE result data - flexible untuk berbagai format API
  const correctAnswers = result.correct_count || result.benar || 0;
  const totalQuestions = result.total_questions || result.total || 0;
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const duration = result.lama_mengerjakan || result.duration || 0;

  // ✅ GET feedback dari result
  const feedback = result.feedback || {};
  const ringkasan = feedback.summary || feedback.ringkasan || null;
  const analisis = feedback.analysis || feedback.analisis || null;
  const saran = feedback.advice || feedback.saran || null;
  const rekomendasi = feedback.recommendation || feedback.rekomendasi || null;

  // ✅ SCORE MESSAGE
  const scoreMessage = percentage >= 80 
    ? '🎉 Luar Biasa! Pemahaman Anda sangat baik!'
    : percentage >= 60
    ? '👍 Bagus! Anda sudah cukup memahami materi.'
    : '💪 Terus belajar! Coba pelajari ulang materinya.';

  // ✅ HANDLE "Coba Lagi" - ke quiz dengan tutorialId
  const handleRetry = () => {
    if (currentTutorial?. id) {
      navigate(`/quiz-intro/${currentTutorial.id}`);
    }
  };

  // ✅ HANDLE "Lanjut" - LANGSUNG ke learning berikutnya atau selesai
  const handleNext = () => {
    // Mark current sebagai selesai
    updateTutorialProgress(currentTutorial. id, true);
    
    if (hasNextTutorial && nextTutorial) {
      // Lanjut ke learning berikutnya
      navigate(`/learning/${nextTutorial.id}`);
    } else if (isLastTutorial) {
      // Selesai - ke beranda
      navigate('/home');
    }
  };

  // ✅ HANDLE "Kembali ke Beranda"
  const handleHome = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* ✅ SCORE CARD - SIMPLIFIED & FIXED */}
        <Card className="mb-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">Skor Anda</p>
            
            {/* Score Display */}
            <div className="mb-8">
              <div className="inline-flex items-baseline gap-3">
                <span className="text-7xl font-bold text-blue-600">{percentage}%</span>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Jawaban Benar</p>
                  <p className="text-3xl font-bold text-green-600">
                    {correctAnswers}/{totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            {duration > 0 && (
              <p className="text-sm text-gray-600 mb-6">
                ⏱️ Waktu Mengerjakan: <span className="font-semibold">{duration} detik</span>
              </p>
            )}

            {/* Score Message */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-lg font-semibold text-gray-900">{scoreMessage}</p>
            </div>
          </div>
        </Card>

        {/* Feedback Card */}
        {(ringkasan || analisis || saran || rekomendasi) && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Feedback Anda</h2>

            {ringkasan && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Ringkasan</h3>
                <p className="text-gray-700 leading-relaxed">{ringkasan}</p>
              </div>
            )}

            {analisis && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">📊 Analisis</h3>
                <p className="text-gray-700 leading-relaxed">{analisis}</p>
              </div>
            )}

            {saran && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Saran</h3>
                <p className="text-gray-700 leading-relaxed">{saran}</p>
              </div>
            )}

            {rekomendasi && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-2">📚 Rekomendasi</h3>
                <p className="text-gray-700 leading-relaxed">{rekomendasi}</p>
              </div>
            )}
          </Card>
        )}

        {/* Progress Info */}
        {tutorials.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Progress Pembelajaran</h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Submodul {currentIndex + 1} dari {tutorials. length}
                </span>
                <span className="text-sm font-semibold text-blue-600 max-w-xs truncate">
                  {currentTutorial?.title}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / tutorials.length) * 100}%` }}
                />
              </div>
            </div>

            {hasNextTutorial && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ <span className="font-semibold">Submodul berikutnya:</span> {nextTutorial. title}
                </p>
              </div>
            )}

            {isLastTutorial && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🎊 <span className="font-semibold">Anda telah menyelesaikan semua submodul!</span>
                </p>
              </div>
            )}
          </Card>
        )}

        {/* ✅ ACTION BUTTONS - FIXED LOGIC */}
        <div className="space-y-3">
          {/* Coba Lagi Button */}
          <Button
            onClick={handleRetry}
            variant="secondary"
            fullWidth
          >
            🔄 Coba Lagi
          </Button>

          {/* ✅ LANJUT / SELESAI - FIXED!  */}
          <Button
            onClick={handleNext}
            variant="primary"
            fullWidth
          >
            {isLastTutorial 
              ? '✅ Selesai & Kembali ke Beranda'
              : `Lanjut ke Submodul ${currentIndex + 2} →`
            }
          </Button>

          {/* Kembali ke Beranda */}
          <Button
            onClick={handleHome}
            variant="secondary"
            fullWidth
          >
            🏠 Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;