/**
 * ClassDetailPage
 * Detail page untuk satu class dengan hero, benefits, silabus, deskripsi, rekomendasi
 * Route: /class/:classId
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLearning } from '../hooks/useLearning';
import { useProgress } from '../context/ProgressContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// ============ SECTION COMPONENTS ============

const HeroSection = ({ tutorial, completionPercentage, onStartTutorial }) => {
  if (!tutorial) return null;

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20">
      <div className="flex flex-col md:flex-row items-center mb-8 gap-10 p-8 bg-blue-50 rounded-lg shadow-md transition-all duration-500 ease-in-out">
        {/* Hero Image */}
        <div className="transition-all transform duration-500 ease-in-out hover:scale-105 w-full md:w-120 h-auto">
          <img
            src="/assets/images/fotomodul. png"
            alt="Course Thumbnail"
            className="w-full h-auto rounded-lg object-cover max-w-full"
          />
        </div>

        {/* Hero Content */}
        <div className="flex flex-col gap-2 w-full">
          {/* Rating & Title */}
          <div>
            <p className="font-medium text-sm mb-2">
              4.87
              <span className="text-yellow-500 text-xl ml-2">★ ★ ★ ★ ★</span>
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">{tutorial.title}</h2>
          </div>

          {/* Tags */}
          <div className="space-x-3 mb-2">
            {['AI', 'Machine Learning', 'Data Science']. map((tag) => (
              <span
                key={tag}
                className="py-1 px-4 bg-blue-200 rounded-2xl text-sm transition-all duration-300 ease-in-out hover:bg-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta Info */}
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

          {/* Progress Bar */}
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={() => onStartTutorial(tutorial.id)}
              className="bg-blue-500 text-white hover:bg-blue-600 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium"
            >
              Belajar Sekarang
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-1. 5 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium">
              Informasi Kelas
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-1.5 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium">
              Lihat Silabus
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

const SilabusSection = ({ tutorials, getTutorialProgress, onSelectTutorial, onRetry }) => {
  if (!tutorials || tutorials.length === 0) {
    return (
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
        <h2 className="text-2xl font-bold mb-8">Silabus Kelas</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">Belum ada materi tersedia</p>
          <Button onClick={onRetry} variant="primary">
            Muat Ulang
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
      <h2 className="text-2xl font-bold mb-8">Silabus Kelas</h2>

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
            status = 'Dalam Proses';
            statusColor = 'text-gray-700';
            icon = '⌛';
          }

          return (
            <div
              key={tutorial.id}
              onClick={() => onSelectTutorial(tutorial.id)}
              className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className={`text-2xl mt-1 flex-shrink-0 ${statusColor}`}>{icon}</span>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tutorial.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {tutorial.description || 'Pelajari topik ini'}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 19. 5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" />
                        </svg>
                        <span>7 Artikel</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>1 Ujian</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>40 menit</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex-shrink-0">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded whitespace-nowrap inline-block ${
                      status === 'Selesai'
                        ? 'bg-blue-50 text-blue-500'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {status}
                  </span>
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DescriptionSection = ({ activeTab, setActiveTab, sections }) => {
  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 py-12">
      <div className="mb-8">
        <div className="flex justify-center gap-0 bg-gray-50 rounded-lg p-1 max-w-fit mx-auto">
          {sections. map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`py-3 px-6 font-medium transition-all rounded-md ${
                activeTab === section. id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {sections.map((section) =>
          activeTab === section.id ? (
            <div key={section.id}>
              <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
              <div className="text-gray-700 space-y-4">
                {section.content}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

const CourseCard = ({ course, renderStars }) => (
  <div className="flex items-start gap-4 hover:bg-gray-50 hover:shadow-md p-4 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 group">
    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
      {course.icon}
    </div>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {course.title}
      </h3>
      <div className="flex items-center gap-3 text-sm">
        {renderStars(course.rating)}
        <span className="text-gray-600 font-medium">({course.rating})</span>
        <span className="text-gray-400">•</span>
        <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs font-medium group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          {course.level}
        </span>
      </div>
    </div>
    <svg
      xmlns="http://www.w3. org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </div>
);

const RecommendationSection = ({ recommendations, learningPaths, contributors, renderStars }) => {
  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 py-12 space-y-16">
      <section>
        <h2 className="text-2xl font-bold mb-6">Rekomendasi untuk Anda</h2>
        <div className="flex flex-col gap-4">
          {recommendations.map((course) => (
            <CourseCard key={course.id} course={course} renderStars={renderStars} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Learning Path Lainnya</h2>
        <div className="flex flex-col gap-4">
          {learningPaths.map((course) => (
            <CourseCard key={course.id} course={course} renderStars={renderStars} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Kontributor Kelas</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="flex items-center gap-4 hover:bg-gray-50 hover:shadow-md p-4 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 flex-1"
            >
              <div className="text-5xl">{contributor.avatar}</div>
              <div>
                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                  {contributor.name}
                </h3>
                <p className="text-sm text-gray-600">{contributor.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ============ MAIN COMPONENT ============

const ClassDetailPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { tutorials, loading, error, fetchTutorials } = useLearning();
  const { getCompletionPercentage, getTutorialProgress } = useProgress();
  const [activeDescTab, setActiveDescTab] = useState('deskripsi');

  useEffect(() => {
    fetchTutorials();
  }, [fetchTutorials]);

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
  const firstTutorial = tutorials?.[0];

  // ============ DYNAMIC DATA ============

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

  const descriptionSections = [
    {
      id: 'deskripsi',
      label: 'Deskripsi Kelas',
      title: 'Deskripsi',
      content: (
        <>
          <p>
            Selamat datang di kelas "Belajar Dasar AI", kursus komprehensif yang dirancang untuk
            memperkenalkan Anda pada dunia kecerdasan buatan dari nol. Kursus ini sangat cocok untuk
            pemula yang ingin memahami konsep dasar, algoritma, dan aplikasi AI modern tanpa memerlukan
            latar belakang teknis yang mendalam.
          </p>
          <p>Materi dirancang menjadi yang terstruktur, Anda akan belajar:</p>
          <ul className="list-none space-y-2 ml-4">
            <li>• Dasar-dasar Machine Learning</li>
            <li>• Memahami konsep pembelajaran terbimbing dan tanpa terbimbing</li>
            <li>• Jaringan Saraf Tiruan</li>
            <li>• Mempelajari arsitektur dasar dan cara kerja neural network</li>
            <li>• Pengolahan Bahasa Alami (NLP)</li>
            <li>• Prinsip dasar interaksi AI dengan bahasa manusia saat ini</li>
          </ul>
          <button className="text-blue-500 font-medium mt-4 flex items-center gap-2 hover:text-blue-600">
            Selengkapnya
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </>
      ),
    },
    {
      id: 'testimoni',
      label: 'Testimoni',
      title: 'Testimoni',
      content: <p className="text-gray-500">Belum ada testimoni tersedia.</p>,
    },
    {
      id: 'faq',
      label: 'FAQ',
      title: 'FAQ',
      content: <p className="text-gray-500">Belum ada FAQ tersedia.</p>,
    },
  ];

  const recommendations = [
    {
      id: 1,
      icon: '✨',
      title: 'Pengantar Data Science dengan Python',
      rating: 4.6,
      level: 'Dasar',
    },
    {
      id: 2,
      icon: '💡',
      title: 'Memulai dengan Big Data Analytics',
      rating: 4.4,
      level: 'Menengah',
    },
    {
      id: 3,
      icon: '⚗️',
      title: 'Workshop AI untuk Startup',
      rating: 4.8,
      level: 'Lanjut',
    },
    {
      id: 4,
      icon: '💬',
      title: 'Membuat Chatbot Cerdas',
      rating: 4.5,
      level: 'Menengah',
    },
  ];

  const learningPaths = [
    {
      id: 1,
      icon: '🎓',
      title: 'Machine Learning Lanjut',
      rating: 4.5,
      level: 'Menengah',
    },
    {
      id: 2,
      icon: '💻',
      title: 'Deep Learning untuk Visi Komputer',
      rating: 4.8,
      level: 'Lanjut',
    },
    {
      id: 3,
      icon: '📘',
      title: 'Pengembangan AI dengan Python',
      rating: 4.3,
      level: 'Menengah',
    },
    {
      id: 4,
      icon: '🎓',
      title: 'Etika & Filosofi AI',
      rating: 4.2,
      level: 'Dasar',
    },
  ];

  const contributors = [
    {
      id: 1,
      name: 'Dr. Rina Wijaya',
      role: 'Instruktur Utama',
      avatar: '👩‍🏫',
    },
    {
      id: 2,
      name: 'Prof. Eko Susanto',
      role: 'Reviewer Materi',
      avatar: '👨‍🎓',
    },
    {
      id: 3,
      name: 'Mira Amelia, M.Sc.',
      role: 'Asisten Instruktur',
      avatar: '👩‍💼',
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={index < Math.floor(rating) ?  'text-yellow-400 text-sm' : 'text-gray-300 text-sm'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // ============ RENDER ============

  return (
    <div className="">
      <HeroSection
        tutorial={firstTutorial}
        completionPercentage={completionPercentage}
        onStartTutorial={handleStartTutorial}
      />

      <BenefitsSection benefits={benefits} />

      <SilabusSection
        tutorials={tutorials}
        getTutorialProgress={getTutorialProgress}
        onSelectTutorial={handleStartTutorial}
        onRetry={fetchTutorials}
      />

      <DescriptionSection
        activeTab={activeDescTab}
        setActiveTab={setActiveDescTab}
        sections={descriptionSections}
      />

      <RecommendationSection
        recommendations={recommendations}
        learningPaths={learningPaths}
        contributors={contributors}
        renderStars={renderStars}
      />
    </div>
  );
};

export default ClassDetailPage;