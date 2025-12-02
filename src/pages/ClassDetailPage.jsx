/**
 * ClassDetailPage
 * Detail page untuk satu class dengan hero & benefits
 * Route: /home (Beranda)
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { Alert } from '../components/common';

// ============ SECTION COMPONENTS ============

const HeroSection = ({ module, completionPercentage, onStartTutorial, tutorials }) => {
  if (! module) return null;

  const handleBelajarSekarang = () => {
    if (tutorials && tutorials.length > 0) {
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
              4.  87
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
              Mulai Belajar
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium">
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
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-600">
              {benefit.icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
            <p className="text-sm text-gray-600">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ✅ Description Section
const DescriptionSection = ({ module }) => {
  if (!module) return null;

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
      <h2 className="text-2xl font-bold mb-6">Tentang Kelas Ini</h2>

      <Card className="p-8">
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p className="text-lg">
            {module.description || 'Pelajari fundamental Artificial Intelligence dengan materi interaktif dan quiz'}
          </p>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-lg">▶</span>
              Apa yang akan kamu pelajari?  
            </h3>
            <ul className="space-y-2 ml-8">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Konsep dasar Artificial Intelligence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Machine Learning dan penerapannya</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Data Science fundamentals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Best practices dalam AI development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold mt-1">•</span>
                <span>Real-world use cases dan applications</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-lg">⚠</span>
              Prasyarat
            </h3>
            <p className="ml-8">
              Tidak ada prasyarat khusus.   Kelas ini dirancang untuk pemula yang ingin belajar tentang Artificial Intelligence.  
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded flex items-center justify-center text-green-600 text-lg">✓</span>
              Target Peserta
            </h3>
            <p className="ml-8">
              Kelas ini cocok untuk siapa saja yang tertarik mempelajari AI, baik dari latar belakang teknis maupun non-teknis. 
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const ClassDetailPage = () => {
  const navigate = useNavigate();
  const { modules, tutorials, loading, error, fetchModules, fetchTutorials } = useLearning();
  const { getCompletionPercentage } = useProgress();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    if (modules.length > 0) {
      fetchTutorials(modules[0].id);
    }
  }, [modules, fetchTutorials]);

  const handleStartTutorial = (tutorialId) => {
    navigate(`/learning/${tutorialId}`);
  };

  if (loading) {
    return <Loading fullScreen text="Memuat kelas..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md text-center">
          <Alert type="error" title="Error" message={error} />
          <Button onClick={() => fetchModules()} variant="primary" className="mt-4">
            Coba Lagi
          </Button>
        </Card>
      </div>
    );
  }

  const completionPercentage = getCompletionPercentage();
  const currentModule = modules[0];

  const benefits = [
    {
      id: 1,
      icon: '📜',
      title: 'Sertifikat Kelulusan',
      desc: 'Dapatkan sertifikat resmi setelah menyelesaikan kursus.',
    },
    {
      id: 2,
      icon: '💬',
      title: 'Forum Diskusi',
      desc: 'Berinteraksi dengan instruktur dan sesama siswa.',
    },
    {
      id: 3,
      icon: '📚',
      title: 'Modul Lengkap',
      desc: 'Akses materi belajar interaktif dan terstruktur.',
    },
    {
      id: 4,
      icon: '✏️',
      title: 'Uji & Latihan',
      desc: 'Uji pemahaman Anda dengan berbagai soal latihan.',
    },
    {
      id: 5,
      icon: '🎯',
      title: 'Ujian Akhir',
      desc: 'Evaluasi komprehensif untuk mengukur pencapaian materi.',
    },
  ];

  return (
    <div>
      {currentModule && (
        <>
          <HeroSection
            module={currentModule}
            completionPercentage={completionPercentage}
            onStartTutorial={handleStartTutorial}
            tutorials={tutorials}
          />

          <BenefitsSection benefits={benefits} />

          <DescriptionSection module={currentModule} />
        </>
      )}
    </div>
  );
};

export default ClassDetailPage;