/**
 * QuizTimer Component
 * Countdown timer untuk quiz
 */

import React, { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/solid';

const QuizTimer = ({ duration = 30, onTimeUp, isActive = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (! isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          // ✅ Call onTimeUp AFTER state update
          setTimeout(() => {
            onTimeUp?. ();
          }, 0);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);

  const isWarning = timeLeft <= 10;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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