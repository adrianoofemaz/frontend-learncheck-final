import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircleIcon, BookOpenIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import AnswerReview from './AnswerReview';
import Button from '../Common/Button';

const MOCK_STATE = {
  score: 2,
  totalQuestions: 3,
  answers: { 
    0: 'Mengaktifkan perangkat agar mulai memproses perintah pengguna', 
    1: 'Dari 20% menjadi 50%',
    2: 'Salah jawaban'
  },
  quiz: {
    title: 'Quiz Submodul 1: Penerangan AI dalam Dunia Nyata',
    submoduleTitle: 'Penerangan AI dalam Dunia Nyata',
    questions: [
      { 
        id: 1, 
        question: 'Menurut laporan McKinsey 2022, berapa peningkatan penggunaan AI di industri dari tahun 2017 ke 2022?', 
        correctAnswer: 'Dari 20% menjadi 50%',
        answers: [
          'Dari 10% menjadi 30%',
          'Dari 20% menjadi 50%',
          'Dari 30% menjadi 70%',
          'Dari 40% menjadi 80%'
        ],
        explanation: 'Laporan McKinsey menyebutkan bahwa penggunaan AI telah meningkat signifikan dari 20% pada 2017 menjadi 50% pada 2022.',
        relatedTopic: 'Perkembangan AI di Industri'
      },
      { 
        id: 2, 
        question: 'Apa fungsi utama wake word seperti "Ok, Google!" pada smart speaker?', 
        correctAnswer: 'Mengaktifkan perangkat agar mulai memproses perintah pengguna',
        answers: [
          'Memberikan jawaban otomatis tanpa perintah',
          'Mengaktifkan perangkat agar mulai memproses perintah pengguna',
          'Mengurangi suara menjadi teks secara langsung',
          'Menghasilkan audio sebagai respons'
        ],
        explanation: 'Wake word digunakan untuk mengaktifkan perangkat dari mode standby agar siap menerima perintah suara.',
        relatedTopic: 'Wake Word dan Voice Assistant'
      },
      { 
        id: 3, 
        question: 'Apa yang dapat menjadi bukti bahwa penerapan AI sudah ada di berbagai bidang industri saat ini?', 
        correctAnswer: 'Berapa persen industri yang memanfaatkan AI',
        answers: [
          'Teknologi AI untuk meningkatkan efisiensi',
          'Berapa persen industri yang memanfaatkan AI',
          'Penggunaan AI di bidang kesehatan',
          'AI digunakan untuk otomasi'
        ],
        explanation: 'Industri memanfaatkan teknologi AI untuk meningkatkan efisiensi dan kualitas layanan mereka.',
        relatedTopic: 'Penerapan AI di Berbagai Industri'
      }
    ]
  },
  startTime: new Date(Date.now() - 30000).toISOString()
};

const FeedbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [durationText, setDurationText] = useState('0m 0s');
  const [showReview, setShowReview] = useState(false);

  const state = location.state || (window.location.pathname === '/results-test' ? MOCK_STATE : {});
  const { score = 0, totalQuestions = 0, answers = {}, quiz = null, startTime = null, endTime = null } = state;

  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.setItem('quizProgress', JSON.stringify({
      lastCompleted: 'submodule_1',
      score,
      timestamp: new Date().toISOString()
    }));

    if (startTime) {
      const savedDuration = sessionStorage.getItem('quizDuration');
      
      if (savedDuration) {
        setDurationText(savedDuration);
      } else {
        const actualEndTime = endTime ?  new Date(endTime) : new Date();
        const actualStartTime = new Date(startTime);
        const duration = Math.floor((actualEndTime - actualStartTime) / 1000);
        
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}m ${seconds}s`;
        
        sessionStorage.setItem('quizDuration', formattedDuration);
        setDurationText(formattedDuration);
      }
    }
  }, [startTime, endTime, score]);

  const hasQuizData = quiz && Array.isArray(quiz.questions) && quiz.questions.length > 0;
  const isValidScore = typeof score === 'number' && score >= 0 && ! isNaN(score);

  if (!isValidScore || totalQuestions === 0 || !hasQuizData) {
    return (
      <div className="quiz-hero-wrapper min-h-screen w-full flex items-start justify-center p-6">
        <div className="quiz-hero w-full max-w-4xl mx-auto">
          <div className="quiz-window-bar rounded-t-2xl flex items-center px-4">
            <div className="window-controls flex items-center gap-3">
              <span className="window-dot dot-red" />
              <span className="window-dot dot-yellow" />
              <span className="window-dot dot-green" />
            </div>
          </div>
          <div className="quiz-hero-body bg-white rounded-b-2xl shadow-lg p-8 text-center">
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Data Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-8">Silakan mulai kuis terlebih dahulu</p>
            <Button onClick={() => navigate('/')} variant="primary" className="w-full max-w-xs mx-auto">
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = score >= Math.ceil(totalQuestions * 0.6);

  // Get wrong answers and their related topics for recommendations
  const wrongAnswers = quiz. questions. filter((question, idx) => {
    const userAnswer = answers[idx];
    return userAnswer !== question.correctAnswer;
  });

  const handleRetakeQuiz = () => {
    sessionStorage.removeItem('quizDuration');
    navigate('/quiz-intro', { state: { quiz } });
  };

  const handleReviewClick = () => {
    setShowReview(! showReview);
    
    if (! showReview) {
      setTimeout(() => {
        const reviewSection = document.querySelector('.answer-review-section');
        if (reviewSection) {
          reviewSection. scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleBackToMaterial = () => {
    navigate('/material');
  };

  return (
    <div className="quiz-hero-wrapper min-h-screen w-full flex items-start justify-center p-6">
      <div className="quiz-hero w-full max-w-4xl mx-auto">
        {/* Browser-like top bar */}
        <div className="quiz-window-bar rounded-t-2xl flex items-center px-4">
          <div className="window-controls flex items-center gap-3">
            <span className="window-dot dot-red" />
            <span className="window-dot dot-yellow" />
            <span className="window-dot dot-green" />
          </div>
        </div>

        {/* Hero body - semua konten dalam satu card */}
        <div className="quiz-hero-body bg-white rounded-b-2xl shadow-lg p-8">
          {/* Quiz Title Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Quiz Submodul</h1>
            <p className="text-lg text-gray-600">{quiz.submoduleTitle || quiz.title || 'Penerangan AI dalam Dunia Nyata'}</p>
            
            {/* Dashed line separator */}
            <div className="mt-4">
              <div className="w-full border-t-2 border-dashed border-blue-400"></div>
            </div>
          </div>

          {/* Status Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              {passed ? (
                <CheckCircleIcon className="w-10 h-10 text-green-600" />
              ) : (
                <XCircleIcon className="w-10 h-10 text-red-600" />
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {passed ? 'Selesai!' : 'Coba Lagi'}
              </h2>
            </div>
            <p className="text-gray-600">
              {passed
                ?  'Selamat! Anda telah menyelesaikan kuis dengan baik'
                : 'Anda perlu menjawab lebih banyak pertanyaan dengan benar'}
            </p>
          </div>

          {/* Score Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100">
              <p className="text-gray-600 font-medium text-sm mb-2">Skor Anda</p>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                {score}/{totalQuestions}
              </p>
              <p className="text-gray-500 text-sm">soal terjawab benar</p>
            </div>

            <div className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100">
              <p className="text-gray-600 font-medium text-sm mb-2">Persentase</p>
              <p className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">
                {percentage}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    passed ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 text-center shadow-md border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-orange-500" />
                <p className="text-gray-600 font-medium text-sm">Durasi</p>
              </div>
              <p className="text-3xl md:text-4xl font-bold text-orange-600 mb-1">
                {durationText}
              </p>
              <p className="text-gray-500 text-sm">waktu pengerjaan</p>
            </div>
          </div>

          {/* Status Message with Recommendation */}
          <div
            className={`p-5 rounded-xl border-2 text-center mb-6 ${
              passed
                ? 'bg-green-50 border-green-300 text-green-800'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            <p className="font-semibold text-lg mb-1">
              {passed ? 'Selamat! Anda Lulus!' : 'Perlu Belajar Lebih Lanjut'}
            </p>
            <p className="text-sm mb-3">
              {passed
                ? `Anda telah menjawab ${percentage}% soal dengan benar.  Bagus sekali! Lanjutkan ke pembelajaran berikutnya.`
                : `Anda baru mencapai ${percentage}%.  Coba lagi untuk mendapatkan minimal 60% untuk lulus.`}
            </p>
            
            {/* Recommendation inside status message */}
            {wrongAnswers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <BookOpenIcon className="w-5 h-5" />
                  <span className="font-semibold">Rekomendasi:</span>
                </div>
                <p className="text-sm">
                  Pelajari kembali materi tentang{' '}
                  <span className="font-semibold">
                    "{wrongAnswers.map(q => q. relatedTopic || 'materi terkait').join('", "')}"
                  </span>
                </p>
                <button
                  onClick={handleBackToMaterial}
                  className={`mt-2 font-semibold underline ${
                    passed ?  'text-green-700 hover:text-green-900' : 'text-red-700 hover:text-red-900'
                  }`}
                >
                  Kembali ke Materi →
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetakeQuiz}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition shadow-md"
            >
              Coba Lagi
            </button>
            <button
              onClick={handleReviewClick}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition shadow-md"
            >
              {showReview ? 'Tutup Review' : 'Review Soal'}
            </button>
          </div>

          {/* Answer Review - Inside the same card */}
          {showReview && hasQuizData && quiz.questions && (
            <div className="answer-review-section mt-6">
              {/* Dashed line separator */}
              <div className="mb-6">
                <div className="w-full border-t-2 border-dashed border-blue-400"></div>
              </div>
              <AnswerReview
                quiz={quiz}
                answers={answers}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;