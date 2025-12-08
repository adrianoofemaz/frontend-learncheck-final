import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { Alert } from '../components/common';
import useFinalQuiz from '../hooks/useFinalQuiz';
import { ROUTES } from '../constants/routes';

const FinalQuizPage = () => {
  const {
    questions,
    currentIndex,
    answers,
    loading,
    error,
    submitted,
    loadQuestions,
    selectAnswer,
    next,
    prev,
    submit,
  } = useFinalQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  if (loading) return <Loading fullScreen text="Memuat soal quiz final..." />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert type="error" title="Gagal memuat" message={error} />
          <Button variant="primary" onClick={loadQuestions} className="mt-4 cursor-pointer">
            Coba lagi
          </Button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md text-center">
          <Alert
            type="warning"
            title="Soal tidak tersedia"
            message="Belum ada soal quiz final. Silakan coba lagi nanti."
          />
          <Button variant="primary" onClick={() => navigate('/home')} className="mt-4 cursor-pointer">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const selected = answers[question.id];

  const handleSubmitAndGo = () => {
    submit();
    navigate(ROUTES.QUIZ_FINAL_RESULT);
  };

  return (
    <div className="py-10">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Header dalam Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Quiz Final</h1>
              <p className="text-gray-600">10 soal • Waktu 10 menit</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/quiz-final-intro')} className="cursor-pointer">
              ← Kembali
            </Button>
          </div>

          {submitted && (
            <div className="mt-4">
              <Alert
                type="success"
                title="Quiz terkirim"
                message="Jawaban Anda telah disimpan. (Integrasi skor bisa ditambahkan saat backend siap.)"
              />
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              Soal {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-sm font-semibold text-blue-600">Quiz Final</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.assessment}</h2>

          <div className="space-y-3">
            {question.multiple_choice.map((opt) => (
              <label
                key={opt.id}
                className={`block w-full border rounded-lg px-4 py-3 cursor-pointer transition ${
                  selected === opt.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={question.id}
                    checked={selected === opt.id}
                    onChange={() => selectAnswer(question.id, opt.id)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-800">{opt.option}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button variant="secondary" onClick={prev} disabled={currentIndex === 0} className="cursor-pointer">
              Sebelumnya
            </Button>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={next}
                disabled={currentIndex === questions.length - 1}
                className="cursor-pointer"
              >
                Berikutnya
              </Button>
              {currentIndex === questions.length - 1 && (
                <Button variant="primary" onClick={handleSubmitAndGo} className="cursor-pointer">
                  Kirim Jawaban
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinalQuizPage;