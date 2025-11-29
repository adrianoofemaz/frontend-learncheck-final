import React from 'react';
import { formatTime } from '../../utils/helpers';

const QuizHeader = ({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  isWarning,
  userId,
  tutorialId
}) => {
  const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Quiz Submodul</h2>
          <p className="text-blue-100 text-sm">Soal {currentQuestion} dari {totalQuestions}</p>
        </div>
        <div className={`text-center ${isWarning ? 'animate-pulse' : ''}`}>
          <div className={`text-3xl font-bold ${isWarning ? 'text-red-300' : 'text-blue-100'}`}>
            {formatTime(timeRemaining)}
          </div>
          <p className="text-blue-100 text-xs">Sisa Waktu</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-blue-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

export default QuizHeader;