/**
 * ClassDetailPage
 * Detail page untuk satu class dengan hero & benefits saja
 * Route: /class/:classId
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// ============ SECTION COMPONENTS ============

const HeroSection = ({ module, completionPercentage, onStartTutorial, tutorials }) => {
  if (!module) return null;

  const handleBelajarSekarang = () => {
    if (tutorials && tutorials.length > 0) {
      // Pass TUTORIAL ID (35363, 35368, dll), bukan MODULE ID (9)! 
      onStartTutorial(tutorials[0].id);
    }
  };

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20">
      <div className="flex flex-col md:flex-row items-center mb-8 gap-10 p-8 bg-blue-50 rounded-lg shadow-md transition-all duration-500 ease-in-out">
        <div className="transition-all transform duration-500 ease-in-out hover:scale-105 w-full md:w-120 h-auto">
          <img
            src="/assets/images/fotomodul.png"
            alt="Course Thumbnail"
            className="w-full h-auto rounded-lg object-cover max-w-full"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div>
            <p className="font-medium text-sm mb-2">
              4.87
              <span className="text-yellow-500 text-xl ml-2">★ ★ ★ ★ ★</span>
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">{module.title}</h2>
          </div>

          <div className="space-x-3 mb-2">
            {['AI', 'Machine Learning', 'Data Science'].  map((tag) => (
              <span
                key={tag}
                className="py-1 px-4 bg-blue-200 rounded-2xl text-sm transition-all duration-300 ease-in-out hover:bg-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="flex items-center space-x-2 text-sm text-gray-500 transition-all duration-300 ease-in-out">
            <img
              src="/assets/images/icon-study.png"
              alt="Level Icon"
              className="w-5 h-5 transition-transform duration-300 hover:scale-110"
            />
            <p>Level: Dasar</p>
          </span>

          <span className="flex items-center space-x-2 text-sm text-gray-500 transition-all duration-300 ease-in-out">
            <img
              src="/assets/images/icon-calender.png"
              alt="Calendar Icon"
              className="w-5 h-5 transition-transform duration-300 hover:scale-110"
            />
            <p>Estimasi Waktu Belajar: 40 Jam</p>
          </span>

          <div>
            <p className="text-sm text-gray-500">Progres Kursus:</p>
            <div className="flex items-center justify-between w-full">
              <div className="w-full bg-gray-300 h-1 rounded-full mr-4">
                <div
                  className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex gap-2 w-full">
                <span className="text-xs font-semibold text-blue-600 whitespace-nowrap">
                  {completionPercentage}% Selesai
                </span>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  Waktu Belajar: 21 Jam
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={handleBelajarSekarang}
              className="bg-blue-500 text-white hover:bg-blue-600 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium"
            >
              Belajar Sekarang
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-1. 5 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium">
              Informasi Kelas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BenefitsSection = ({ benefits }) => {
  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
      <h2 className="text-2xl font-bold mb-8">Fitur & Manfaat Kelas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="text-center">
            <div className="text-4xl mb-3">{benefit.icon}</div>
            <h3 className="font-semibold text-gray-900 mb-2">{benefit. title}</h3>
            <p className="text-sm text-gray-600">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TutorialsSection = ({ tutorials, getTutorialProgress, onSelectTutorial, loading }) => {
  if (loading) {
    return (
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
        <h2 className="text-2xl font-bold mb-8">Materi Pembelajaran</h2>
        <div className="text-center py-12">
          <p className="text-gray-600">Memuat materi... </p>
        </div>
      </div>
    );
  }

  if (! tutorials || tutorials.length === 0) {
    return (
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
        <h2 className="text-2xl font-bold mb-8">Materi Pembelajaran</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">Belum ada materi tersedia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
      <h2 className="text-2xl font-bold mb-8">Materi Pembelajaran</h2>

      <div className="space-y-4">
        {tutorials.map((tutorial, index) => {
          const isCompleted = getTutorialProgress(tutorial.id);
          let status = 'Belum Dimulai';
          let statusColor = 'text-gray-500';
          let icon = '○';

          if (isCompleted) {
            status = 'Selesai';
            statusColor = 'text-blue-500';
            icon = '✓';
          } else if (index === 0) {
            status = 'Mulai';
            statusColor = 'text-blue-700';
            icon = '▶';
          }

          return (
            <Card key={tutorial.id} className="p-6 hover:shadow-md hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className={`text-2xl mt-1 flex-shrink-0 ${statusColor}`}>{icon}</span>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tutorial.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {tutorial.content || tutorial.description || 'Pelajari topik ini'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span>📄 7 Artikel</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span>✓ 1 Ujian</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span>⏱️ 40 menit</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <Button
                    onClick={() => onSelectTutorial(tutorial. id)}
                    variant={isCompleted ? 'secondary' : 'primary'}
                    className="whitespace-nowrap"
                  >
                    {isCompleted ? 'Lanjutkan' : 'Mulai Belajar'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-1 h-1">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full h-full ${
                      i < 7
                        ? isCompleted
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const ClassDetailPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { modules, tutorials, loading, error, fetchModules, fetchTutorials } = useLearning();
  const { getCompletionPercentage, getTutorialProgress } = useProgress();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    if (classId && modules.length > 0) {
      fetchTutorials(parseInt(classId));
    }
  }, [classId, modules, fetchTutorials]);

  const handleStartTutorial = (tutorialId) => {
    navigate(`/learning/${tutorialId}`);
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
          <Button onClick={() => fetchModules()} variant="primary">
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();
  const currentModule = modules.find(m => m.id == classId);

  const benefits = [
    {
      id: 1,
      icon: '🏅',
      title: 'Sertifikat Kelulusan',
      desc: 'Dapatkan sertifikat resmi setelah menyelesaikan kursus.',
    },
    {
      id: 2,
      icon: '👥',
      title: 'Forum Diskusi Aktif',
      desc: 'Berinteraksi dengan instruktur dan sesama siswa.',
    },
    {
      id: 3,
      icon: '📖',
      title: 'Modul Tutorial Lengkap',
      desc: 'Akses materi belajar interaktif dan terstruktur.',
    },
    {
      id: 4,
      icon: '✍️',
      title: 'Uji & Latihan',
      desc: 'Uji pemahaman Anda dengan berbagai soal latihan.',
    },
    {
      id: 5,
      icon: '▶️',
      title: 'Ujian Akhir',
      desc: 'Evaluasi komprehensif untuk mengukur pencapaian materi.',
    },
  ];

  return (
    <div>
      <HeroSection
        module={currentModule}
        completionPercentage={completionPercentage}
        onStartTutorial={handleStartTutorial}
        tutorials={tutorials}
      />

      <BenefitsSection benefits={benefits} />

      <TutorialsSection
        tutorials={tutorials}
        getTutorialProgress={getTutorialProgress}
        onSelectTutorial={handleStartTutorial}
        loading={loading}
      />
    </div>
  );
};

export default ClassDetailPage;