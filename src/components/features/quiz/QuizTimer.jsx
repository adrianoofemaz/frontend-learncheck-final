/**
 * QuizTimer Component
 * Countdown timer untuk quiz
 */

import React, { useState, useEffect } from 'react';
import { formatTime } from '../../../utils/helpers';
import { ClockIcon } from '@heroicons/react/24/solid';

const QuizTimer = ({ duration = 30, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (! isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?. ();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const isWarning = timeLeft <= 10;

  return (
    <div className={`flex items-center gap-2 text-lg font-semibold ${
      isWarning ? 'text-red-600' : 'text-gray-900'
    }`}>
      <ClockIcon className={`w-5 h-5 ${isWarning ? 'animate-pulse' : ''}`} />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
};

export default QuizTimer;