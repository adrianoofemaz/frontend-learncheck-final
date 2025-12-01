/**
 * QuizCard Component
 * Display single quiz question
 */

import React from 'react';
import Card from '../../common/Card';

const QuizCard = ({ question, selectedAnswer, onSelectAnswer, questionNumber, totalQuestions }) => {
  if (! question) return null;

  const options = [
    question.option_1,
    question.option_2,
    question.option_3,
    question.option_4,
  ].filter(Boolean);

  return (
    <Card>
      {/* Question Number */}
      <div className="text-sm text-gray-600 mb-4">
        Pertanyaan {questionNumber} dari {totalQuestions}
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.assessment}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer?.(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedAnswer === index && (
                  <span className="text-white text-sm font-bold">✓</span>
                )}
              </div>
              <span className="text-gray-900">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuizCard;