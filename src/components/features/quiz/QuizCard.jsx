/**
 * QuizCard Component
 * Display single quiz question
 */

import React from 'react';
import Card from '../../common/Card';

const QuizCard = ({ question, selectedAnswer, onSelectAnswer, questionNumber, totalQuestions }) => {
  if (!question) return null;

  // ✅ GET options dari multiple_choice array
  const options = question.multiple_choice || [];

  console.log('QuizCard question:', question);
  console.log('QuizCard options:', options);

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
        {options.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Tidak ada opsi tersedia</p>
        ) : (
          options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                console.log('Selected answer:', index, option);
                onSelectAnswer?.(index);
              }}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center shrink-0 ${
                    selectedAnswer === index
                      ?  'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedAnswer === index && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
                {/* ✅ GET option. option */}
                <span className="text-gray-900">{option.option}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
};

export default QuizCard;