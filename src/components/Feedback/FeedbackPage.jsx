import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/solid';
import ScoreDisplay from './ScoreDisplay';
import AnswerReview from './AnswerReview';
import Button from '../Common/Button';

const MOCK_STATE = {
  score: 2,
  totalQuestions: 3,
  answers: { 
    0: 'Mengaktifkan perangkat agar mulai memproses perintah pengguna', 
    1: 'Dari 20% menjadi 50%',
    2: 'Berapa persen industri yang memanfaatkan AI'
  },
  quiz: {
    questions: [
      { 
        id: 1, 
        question: 'Menurut laporan McKinsey 2022, berapa peningkatan penggunaan AI di industri dari tahun 2017 ke 2022? ', 
        correctAnswer: 'Dari 20% menjadi 50%',
        answers: [
          'Dari 10% menjadi 30%',
          'Dari 20% menjadi 50%',
          'Dari 30% menjadi 70%',
          'Dari 40% menjadi 80%'
        ],
        explanation: 'Laporan McKinsey menyebutkan bahwa penggunaan AI telah meningkat signifikan dari 20% pada 2017 menjadi 50% pada 2022.'
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
        explanation: 'Wake word digunakan untuk mengaktifkan perangkat dari mode standby agar siap menerima perintah suara.'
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
        explanation: 'Industri memanfaatkan teknologi AI untuk meningkatkan efisiensi dan kualitas layanan mereka.'
      }
    ]
  },
  startTime: new Date(Date.now() - 221000).toISOString()
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
      <div className="text-center py-12">
        <div className="bg-white/95 p-12 rounded-2xl shadow-lg max-w-md mx-auto">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Data Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-8">Silakan mulai kuis terlebih dahulu</p>
          <Button onClick={() => navigate('/')} variant="primary" className="w-full">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = score >= Math.ceil(totalQuestions * 0.6);

  const handleRetakeQuiz = () => {
    sessionStorage.removeItem('quizDuration');
    navigate('/quiz-intro', { state: { quiz } });
  };

  return (
    <div className="space-y-6">
      {/* Score Display Card with Shadow */}
      <div className="shadow-md rounded-2xl overflow-hidden">
        <ScoreDisplay
          score={score}
          totalQuestions={totalQuestions}
          percentage={percentage}
          passed={passed}
          durationText={durationText}
        />
      </div>

      {/* Action Buttons - Blue Theme */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleRetakeQuiz}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition shadow-md"
        >
          Coba Lagi
        </button>
        <button
          onClick={() => setShowReview(!showReview)}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition shadow-md"
        >
          {showReview ? 'Tutup Review' : 'Review Soal'}
        </button>
      </div>

      {/* Answer Review - With Shadow */}
      {showReview && hasQuizData && quiz.questions && (
        <div className=" rounded-2xl overflow-hidden">
          <AnswerReview
            quiz={quiz}
            answers={answers}
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;