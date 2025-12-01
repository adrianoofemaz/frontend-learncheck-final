/**
 * ResultsPage
 * Quiz results & feedback page
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResultCard, AnswerReview } from '../components/features/feedback';
import Alert from '../components/common/Alert';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="max-w-md mx-auto text-center">
        <p className="text-gray-600 mb-4">Data hasil tidak ditemukan</p>
        <Button onClick={() => navigate('/home')} variant="primary">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score Card */}
      <ResultCard
        score={result.score}
        correct={result.benar}
        total={result. total}
        duration={result.lama_mengerjakan}
      />

      {/* Feedback Card */}
      {result.feedback && (
        <Card className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback Anda</h2>

          {result.feedback.summary && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Ringkasan</h3>
              <p className="text-gray-700">{result.feedback.summary}</p>
            </div>
          )}

          {result.feedback.analysis && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">📊 Analisis</h3>
              <p className="text-gray-700">{result. feedback.analysis}</p>
            </div>
          )}

          {result.feedback.advice && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Saran</h3>
              <p className="text-gray-700">{result. feedback.advice}</p>
            </div>
          )}

          {result.feedback.recommendation && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2">📚 Rekomendasi</h3>
              <p className="text-gray-700">{result.feedback.recommendation}</p>
            </div>
          )}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate('/home')} variant="secondary" fullWidth>
          Kembali ke Beranda
        </Button>
        <Button onClick={() => navigate('/quiz-intro')} variant="primary" fullWidth>
          Coba Lagi
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;