/**
 * LearningPage
 * Tutorial/learning material display page
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import { MaterialContent } from '../components/features/learning';
import { Alert } from '../components/common';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTutorial, loading, error, selectTutorial, tutorials } = useLearning();
  const { updateTutorialProgress } = useProgress();

  useEffect(() => {
    if (id && tutorials. length > 0) {
      // Select dari tutorials array yang sudah ada
      selectTutorial(parseInt(id));
    }
  }, [id, tutorials, selectTutorial]);

  const handleMarkComplete = () => {
    if (currentTutorial) {
      updateTutorialProgress(currentTutorial.id, true);
    }
  };

  const handleNextTutorial = () => {
    handleMarkComplete();
    
    const currentIndex = tutorials.findIndex(t => t.id === currentTutorial. id);
    if (currentIndex < tutorials.length - 1) {
      const nextTutorial = tutorials[currentIndex + 1];
      navigate(`/learning/${nextTutorial.id}`);
    }
  };

  const canGoPrevious = tutorials.length > 0 && tutorials. findIndex(t => t.id === currentTutorial?.id) > 0;
  const canGoNext = tutorials.length > 0 && tutorials.findIndex(t => t.id === currentTutorial?.id) < tutorials. length - 1;

  if (loading) {
    return <Loading fullScreen text="Memuat materi..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Alert
          type="error"
          title="Terjadi Kesalahan"
          message={error}
        />
        <Button onClick={() => navigate('/home')} variant="primary" className="mt-4">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  if (!currentTutorial) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600 mb-4">Materi tidak ditemukan</p>
        <Button onClick={() => navigate('/home')} variant="primary">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentTutorial.title}</h1>
        <p className="text-gray-600">Pelajari materi dengan seksama sebelum melanjutkan</p>
      </div>

      {/* Content */}
      <MaterialContent
        title={currentTutorial.title}
        content={currentTutorial.content}
        loading={loading}
      />

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4">
          {canGoPrevious && (
            <Button
              onClick={() => {
                const currentIndex = tutorials. findIndex(t => t.id === currentTutorial.id);
                const prevTutorial = tutorials[currentIndex - 1];
                navigate(`/learning/${prevTutorial.id}`);
              }}
              variant="secondary"
            >
              ← Materi Sebelumnya
            </Button>
          )}
          <Button onClick={() => navigate('/home')} variant="secondary">
            Kembali ke Beranda
          </Button>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleMarkComplete} variant="secondary">
            ✓ Tandai Selesai
          </Button>
          {canGoNext ?  (
            <Button onClick={handleNextTutorial} variant="primary">
              Lanjut ke Materi Berikutnya →
            </Button>
          ) : (
            <Button onClick={() => navigate('/quiz-intro')} variant="primary">
              Mulai Quiz →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;