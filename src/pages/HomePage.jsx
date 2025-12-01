/**
 * HomePage
 * Main home page showing tutorials/modules
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const HomePage = () => {
  const navigate = useNavigate();
  const { tutorials, loading, error, fetchTutorials } = useLearning();
  const { getCompletionPercentage, getTutorialProgress } = useProgress();

  useEffect(() => {
    fetchTutorials();
  }, []);

  const handleStartTutorial = (tutorialId) => {
    navigate(`/learning/${tutorialId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Memuat materi... </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchTutorials} variant="primary">
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Selamat Datang di LearnCheck</h1>
        <p className="text-xl text-gray-600 mb-6">
          Pelajari Artificial Intelligence dengan cara yang interaktif dan menyenangkan
        </p>

        {/* Progress Overview */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progress Belajar Anda</h2>
            <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials. map((tutorial) => {
          const isCompleted = getTutorialProgress(tutorial.id);
          return (
            <Card key={tutorial. id} className="hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {tutorial. title}
                </h3>
                {isCompleted && (
                  <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                    <span className="text-green-600 font-bold">✓</span>
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {tutorial.description || 'Pelajari topik ini'}
              </p>

              <Button
                onClick={() => handleStartTutorial(tutorial.id)}
                variant={isCompleted ? 'secondary' : 'primary'}
                fullWidth
              >
                {isCompleted ?  'Lihat Ulang' : 'Mulai Belajar'}
              </Button>
            </Card>
          );
        })}
      </div>

      {tutorials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Belum ada materi tersedia</p>
          <Button onClick={fetchTutorials} variant="primary">
            Muat Ulang
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;