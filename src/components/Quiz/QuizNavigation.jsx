import React from 'react';
import PropTypes from 'prop-types';

/*
  QuizNavigation (updated)
  - No "Sebelumnya" button anymore.
  - Shows "Berikutnya" on non-last questions.
  - Shows "Selesai & Lihat Hasil" on last question and enables it when
    either feedback has been shown (user answered) or the question timed out.
*/

const QuizNavigation = ({
  onNext,
  onSubmit,
  currentQuestion,
  totalQuestions,
  canGoForward,
  showFeedback,
  isTimeUp
}) => {
  const isLastQuestion = currentQuestion === totalQuestions;
  const canSubmit = isLastQuestion && (showFeedback || isTimeUp);

  return (
    <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
      <div className="flex gap-3">
        {!isLastQuestion ? (
          <button
            onClick={onNext}
            disabled={!canGoForward}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              !canGoForward
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Berikutnya ›
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
              !canSubmit
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Selesai & Lihat Hasil
          </button>
        )}
      </div>
    </div>
  );
};

QuizNavigation.propTypes = {
  onNext: PropTypes.func,
  onSubmit: PropTypes.func,
  currentQuestion: PropTypes.number,
  totalQuestions: PropTypes.number,
  canGoForward: PropTypes.bool,
  showFeedback: PropTypes.bool,
  isTimeUp: PropTypes.bool
};

export default QuizNavigation;