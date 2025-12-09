import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import LearningLayout from "../layouts/LearningLayout";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";

const FinalQuizIntroPage = () => {
  const navigate = useNavigate();
  const { tutorials, currentTutorial, fetchTutorials, selectTutorial } = useLearning();
  const { getTutorialProgress } = useProgress();

  useEffect(() => {
    if (tutorials.length === 0) {
      fetchTutorials(1);
    } else if (!currentTutorial && tutorials[0]) {
      selectTutorial(tutorials[0].id);
    }
  }, [tutorials, currentTutorial, fetchTutorials, selectTutorial]);

  const lastId = tutorials?.[tutorials.length - 1]?.id;
  const goToLearning = () => {
    if (lastId) navigate(`/learning/${lastId}`);
    else navigate("/home");
  };

  return (
    <LearningLayout
      tutorials={tutorials}
      currentTutorial={currentTutorial || tutorials[0]}
      getTutorialProgress={getTutorialProgress}
      onSelectTutorial={(id) => navigate(`/learning/${id}`)}
      onHome={goToLearning}
      onMarkComplete={() => {}}
      onStartQuiz={() => navigate("/quiz-final")}
      isCompleted={false}
      showSidebar
      showBottomBar
      showQuizLink={false}
    >
      <div className="py-4">
        <div className="max-w-3xl mx-auto px-0">
          <Card className="p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-blue-600 mb-2">Quiz Final</h1>
                <p className="text-gray-700">
                  Uji pemahaman akhir Anda. Quiz ini terdiri dari <strong>10 soal</strong> yang mewakili
                  seluruh modul, dengan durasi total <strong>10 menit</strong>. Pastikan koneksi stabil sebelum memulai.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={goToLearning}
                className="cursor-pointer"
              >
                ← Kembali
              </Button>
            </div>

            <ul className="list-disc list-inside text-gray-700 mb-8 space-y-2">
              <li>Jumlah soal: 10</li>
              <li>Jenis: Pilihan ganda</li>
              <li>Durasi: 10 menit</li>
              <li>Gunakan tombol <strong>Berikutnya</strong> dan <strong>Sebelumnya</strong> untuk navigasi.</li>
            </ul>

            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={goToLearning} className="cursor-pointer">
                Kembali
              </Button>
              <Button variant="primary" onClick={() => navigate("/quiz-final")} className="cursor-pointer">
                Mulai Quiz Final
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </LearningLayout>
  );
};

export default FinalQuizIntroPage;