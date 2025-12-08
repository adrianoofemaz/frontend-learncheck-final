import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import { UserContext } from "../context/UserContext"; // Import UserContext

// ============ SECTION COMPONENTS ============

// HeroSection Component
const HeroSection = ({
  module,
  completionPercentage,
  onStartTutorial,
  tutorials,
}) => {
  if (!module) return null;

  const handleBelajarSekarang = () => {
    if (tutorials && tutorials.length > 0) {
      onStartTutorial(tutorials[0].id);
    }
  };

  // Ambil preferences dari context untuk tema
  const { preferences } = useContext(UserContext);

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 pt-30">
      <div
        className={`flex flex-col md:flex-row items-center mb-8 gap-10 p-8  drop-shadow-xl border-1 rounded-lg shadow-md transition-all duration-500 ease-in-out ${
          preferences.theme === "dark"
            ? "text-white bg-gray-800 border-gray-800 shadow-gray-900"
            : "text-gray-900 bg-white border-gray-200"
        }`}
      >
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
              4. 87
              <span className="text-yellow-500 text-xl ml-2">★ ★ ★ ★ ★</span>
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">{module.title}</h2>
          </div>

          <div className="space-x-3 mb-2">
            {["AI", "Machine Learning", "Data Science"].map((tag) => (
              <span
                key={tag}
                className={`py-1 px-4  rounded-2xl text-sm transition-all duration-300 ease-in-out  ${
                  preferences.theme === "dark"
                    ? "text-white bg-blue-500 hover:bg-blue-700"
                    : "text-blue-800 bg-blue-200 hover:bg-blue-400"
                }`}
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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Progres Kursus:
            </p>
            <div className="flex items-center justify-between w-full">
              <div className="w-full bg-gray-300 dark:bg-gray-700 h-1 rounded-full mr-4">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex gap-2 w-full">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {completionPercentage}% Selesai
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Waktu Belajar: 21 Jam
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={handleBelajarSekarang}
              className="bg-blue-500 text-white hover:bg-blue-600 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium cursor-pointer"
            >
              Mulai Belajar
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium cursor-pointer">
              Informasi Kelas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Benefits Section
const BenefitsSection = ({ benefits }) => {
  const { preferences } = useContext(UserContext);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        className={`text-2xl font-bold mb-8 text-center lg:text-left ${
          preferences.theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Fitur & Manfaat Kelas
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className={`flex flex-col h-full items-center text-center   backdrop-blur rounded-xl shadow-sm p-4 sm:p-5 border-1 hover:shadow-xl transform duration-500 ease-in-out hover:scale-105 ${
              preferences.theme === "dark"
                ? "text-white bg-gray-600 border-gray-700 "
                : "text-gray-900 border-gray-200 bg-white "
            }`}
          >
            <div className="w-12 h-12 mb-3 bg-blue-100 dark:bg-blue-500 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-white">
              {benefit.icon}
            </div>
            <h3
              className={`font-semibold ${
                preferences.theme === "dark" ? "text-white" : "text-gray-900"
              } mb-2 min-h-[48px] flex items-center justify-center`}
            >
              {benefit.title}
            </h3>
            <p
              className={`text-sm ${
                preferences.theme === "dark" ? "text-gray-300" : "text-gray-600"
              } leading-relaxed`}
            >
              {benefit.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Description Section
const DescriptionSection = ({ module }) => {
  const { preferences } = useContext(UserContext);

  if (!module) return null;

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 my-10">
      <h2
        className={`text-2xl font-bold mb-6 ${
          preferences.theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Tentang Kelas Ini
      </h2>

      <Card
        className={`p-8 border ${
          preferences.theme === "dark"
            ? "text-gray-200 bg-gray-700 border-gray-900 rounded-2xl"
            : "text-gray-900 bg-white border-gray-200 rounded-2xl"
        }`}
      >
        <div className={`space-y-6 text-gray-white leading-relaxed`}>
          <p className="text-lg">
            {module.description ||
              "Pelajari fundamental Artificial Intelligence dengan materi interaktif dan quiz"}
          </p>

          <div>
            <h3
              className={`text-xl font-bold  mb-2 flex items-center gap-3 ${
                preferences.theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-lg">
                ▶
              </span>
              Apa yang akan kamu pelajari?
            </h3>
            <ul className="space-y-2 ml-8">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold ">•</span>
                <span>Konsep dasar Artificial Intelligence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold ">•</span>
                <span>Machine Learning dan penerapannya</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Data Science fundamentals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Best practices dalam AI development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>Real-world use cases dan applications</span>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className={`text-xl font-bold text-gray-900 mb-2 flex items-center gap-2 ${
                preferences.theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center text-yellow-600 text-lg">
                ⚠
              </span>
              Prasyarat
            </h3>
            <p className="ml-8">
              Tidak ada prasyarat khusus. Kelas ini dirancang untuk pemula yang
              ingin belajar tentang Artificial Intelligence.
            </p>
          </div>

          <div>
            <h3
              className={`text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 ${
                preferences.theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="w-6 h-6 bg-green-100 rounded flex items-center justify-center text-green-600 text-lg">
                ✓
              </span>
              Target Peserta
            </h3>
            <p className="ml-8">
              Kelas ini cocok untuk siapa saja yang tertarik mempelajari AI,
              baik dari latar belakang teknis maupun non-teknis.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Main Component
const ClassDetailPage = () => {
  const navigate = useNavigate();
  const { modules, tutorials, loading, error, fetchModules, fetchTutorials } =
    useLearning();
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
          <Button
            onClick={() => fetchModules()}
            variant="primary"
            className="mt-4"
          >
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
      icon: "📜",
      title: "Sertifikat Kelulusan",
      desc: "Dapatkan sertifikat resmi setelah menyelesaikan kursus.",
    },
    {
      id: 2,
      icon: "💬",
      title: "Forum Diskusi",
      desc: "Berinteraksi dengan instruktur dan sesama siswa.",
    },
    {
      id: 3,
      icon: "📚",
      title: "Modul Lengkap",
      desc: "Akses materi belajar interaktif dan terstruktur.",
    },
    {
      id: 4,
      icon: "✏️",
      title: "Uji & Latihan",
      desc: "Uji pemahaman Anda dengan berbagai soal latihan.",
    },
    {
      id: 5,
      icon: "🎯",
      title: "Ujian Akhir",
      desc: "Evaluasi komprehensif untuk mengukur pencapaian materi.",
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
