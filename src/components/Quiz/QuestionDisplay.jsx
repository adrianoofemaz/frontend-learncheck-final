import React from 'react';

const QuestionDisplay = ({ 
  question, 
  questionNumber, 
  totalQuestions 
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
          Soal {questionNumber} / {totalQuestions}
        </span>
        <span className="text-xs text-gray-500">
          {Math.round((questionNumber / totalQuestions) * 100)}% Selesai
        </span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 leading-snug">
        {question}
      </h2>
    </div>
  );
};

export default QuestionDisplay;