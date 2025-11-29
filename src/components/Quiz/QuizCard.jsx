import React from 'react';
import { ClipboardDocumentCheckIcon, ClockIcon } from '@heroicons/react/24/solid';
import Button from '../Common/Button';
import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  if (!quiz) return null;

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-blue-500">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">
        {quiz.title}
      </h3>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <ClipboardDocumentCheckIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-gray-600 font-medium">Jumlah Soal:</p>
            <p className="text-gray-900 font-bold text-lg">{quiz.totalQuestions} Soal</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ClockIcon className="w-6 h-6 text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-gray-600 font-medium">Durasi:</p>
            <p className="text-gray-900 font-bold text-lg">{quiz. durationPerQuestion} detik/soal</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleStartQuiz}
        variant="primary"
        className="w-full py-3 text-base font-bold text-center"
      >
        Mulai Kuis →
      </Button>
    </div>
  );
};

export default QuizCard;