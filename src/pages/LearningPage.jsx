/**
 * LearningPage
 * Tutorial/learning material display page dengan sidebar navigasi
 * Layout: Main content (left) + Sidebar modules (right)
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import { MaterialContent } from '../components/features/learning';
import { Alert } from '../components/common';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

// ============ SIDEBAR COMPONENT ============

const ModuleSidebar = ({ tutorials, currentTutorial, getTutorialProgress, onSelectTutorial }) => {
  const getStatusColor = (tutorialId, isCompleted) => {
    if (isCompleted) return 'text-green-500';
    if (currentTutorial?.id === tutorialId) return 'text-blue-600';
    return 'text-gray-400';
  };

  const getStatusIcon = (isCompleted, isCurrent) => {
    if (isCompleted) return '✓';
    if (isCurrent) return '▶';
    return '○';
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto max-h-screen sticky top-0">
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Daftar Submodul</h3>
      </div>

      <div className="space-y-2">
        {tutorials.map((tutorial, index) => {
          const isCompleted = getTutorialProgress(tutorial.id);
          const isCurrent = currentTutorial?.id === tutorial. id;

          return (
            <div key={tutorial.id}>
              <button
                onClick={() => onSelectTutorial(tutorial.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border border-blue-300'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-bold ${getStatusColor(tutorial.id, isCompleted)}`}>
                    {getStatusIcon(isCompleted, isCurrent)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      isCurrent ?  'text-blue-600' : 'text-gray-900'
                    }`}>
                      {tutorial.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isCompleted ? 'Selesai' : isCurrent ? 'Sedang Dipelajari' : 'Belum Dimulai'}
                    </p>
                  </div>
                </div>
              </button>

              <div className="ml-10 mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: isCompleted ? '100%' : '0%' }}
                />
              </div>

              {isCurrent && (
                <button
                  onClick={() => {}}
                  className="w-full text-left px-4 py-2 ml-4 mt-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                >
                  → Quiz Submodul #{index + 1}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTutorial, loading, error, selectTutorial, tutorials } = useLearning();
  const { updateTutorialProgress, getTutorialProgress } = useProgress();

  // ============ HANDLERS ============
  const handleMarkComplete = () => {
    if (currentTutorial) {
      updateTutorialProgress(currentTutorial.id, true);
    }
  };

  const handleStartQuiz = () => {
    handleMarkComplete();
    if (currentTutorial?. id) {
      navigate(`/quiz-intro/${currentTutorial.id}`);
    }
  };

  const handleSelectTutorial = (tutorialId) => {
    navigate(`/learning/${tutorialId}`);
  };

  // ============ EFFECTS ============
  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id);
      if (! isNaN(parsedId)) {
        selectTutorial(parsedId). catch((err) => {
          console.error('Error selecting tutorial:', err);
        });
      }
    }
  }, [id, selectTutorial]);

  // ============ STATE CALCULATIONS ============
  const currentIndex = tutorials.findIndex(t => t.id === currentTutorial?.id);
  const totalModules = tutorials.length;
  const progressPercentage = totalModules > 0 ? ((currentIndex + 1) / totalModules) * 100 : 0;

  const hasTutorials = tutorials.length > 0;
  const isLastModule = hasTutorials && currentIndex === tutorials.length - 1;

  // ============ RENDER - LOADING ============
  if (loading || ! currentTutorial) {
    return <Loading fullScreen text="Memuat materi..." />;
  }

  // ============ RENDER - ERROR ============
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center">
          <Alert
            type="error"
            title="Terjadi Kesalahan"
            message={error}
          />
          <Button onClick={() => navigate('/home')} variant="primary" className="mt-4">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  // ============ RENDER - SUCCESS ============
  return (
    <div className="flex h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Belajar Dasar AI</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentTutorial.title}</h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Submodul {currentIndex + 1}/{totalModules}
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 mb-6">
            Belajar / Modul / {currentTutorial.title}
          </p>

          {/* Content */}
          <MaterialContent
            title={currentTutorial.title}
            content={currentTutorial.content}
            loading={loading}
          />

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-200">
            <Button
              onClick={() => navigate('/home')}
              variant="secondary"
              className="flex items-center gap-2"
            >
              ← Beranda
            </Button>

            <div className="flex gap-4">
              {! getTutorialProgress(currentTutorial.id) && (
                <Button
                  onClick={handleMarkComplete}
                  variant="secondary"
                >
                  ✓ Tandai Selesai
                </Button>
              )}

              <Button
                onClick={handleStartQuiz}
                variant="primary"
                className="flex items-center gap-2"
              >
                ▶️ Mulai Quiz →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Module Navigation */}
      {hasTutorials && (
        <ModuleSidebar
          tutorials={tutorials}
          currentTutorial={currentTutorial}
          getTutorialProgress={getTutorialProgress}
          onSelectTutorial={handleSelectTutorial}
        />
      )}
    </div>
  );
};

export default LearningPage;