/**
 * HomePage - SIMPLE VERSION
 * List semua classes/courses
 * Route: /
 * Click on class → ClassDetailPage
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
  }, [fetchTutorials]);

  const handleSelectClass = (classId) => {
    navigate(`/class/${classId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
          <p className="text-gray-600">Memuat kelas...</p>
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
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 py-12">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Selamat Datang di LearnCheck
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Pelajari Artificial Intelligence dengan cara yang interaktif dan menyenangkan
        </p>

        {/* Overall Progress */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progress Keseluruhan</h2>
            <span className="text-3xl font-bold text-blue-600">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Pilih Kelas untuk Memulai</h2>

        {tutorials && tutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((cls) => {
              const isCompleted = getTutorialProgress(cls.id);
              const classProgress = isCompleted ? 100 : 0;

              return (
                <div
                  key={cls.id}
                  onClick={() => handleSelectClass(cls. id)}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                >
                  {/* Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/images/fotomodul.png"
                      alt={cls.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title & Status */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 group-hover:text-blue-600 transition-colors">
                        {cls.title}
                      </h3>
                      {isCompleted && (
                        <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full flex-shrink-0">
                          <span className="text-green-600 font-bold text-sm">✓</span>
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-10">
                      {cls.description || 'Pelajari topik ini dengan materi yang komprehensif'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">
                          ★
                        </span>
                      ))}
                      <span className="text-gray-600 text-sm ml-2">(4.87)</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progres</span>
                        <span>{classProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${classProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Button */}
                    <Button
                      onClick={() => handleSelectClass(cls.id)}
                      variant={isCompleted ? 'secondary' : 'primary'}
                      fullWidth
                    >
                      {isCompleted ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">Belum ada kelas tersedia</p>
            <Button onClick={fetchTutorials} variant="primary">
              Muat Ulang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;