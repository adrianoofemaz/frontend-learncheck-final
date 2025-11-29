import React from 'react';

const AnswerButton = ({ 
  answer, 
  isSelected, 
  isCorrect, 
  showFeedback,
  disabled,
  onClick 
}) => {
  const getBackgroundColor = () => {
    if (!showFeedback) {
      return isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-50 hover:bg-blue-100 border-blue-100 text-gray-700';
    }

    if (isCorrect) {
      return 'bg-green-100 border-green-500 text-green-900';
    }

    if (isSelected && !isCorrect) {
      return 'bg-red-100 border-red-500 text-red-900';
    }

    return 'bg-gray-100 border-gray-300 text-gray-700';
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || showFeedback}
      className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition
        ${getBackgroundColor()}
        ${(disabled || showFeedback) ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {answer}
    </button>
  );
};

export default AnswerButton;