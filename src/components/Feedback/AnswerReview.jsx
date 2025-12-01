import React, { useState } from 'react';
import { ChevronDownIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const AnswerReview = ({ quiz, answers }) => {
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());

  if (!quiz || !quiz.questions) {
    return <div className="text-gray-600">No questions available</div>;
  }

  // ✨ Fungsi toggle expand/collapse dengan direct scroll
  const handleQuestionClick = (idx) => {
    // Toggle expand/collapse untuk soal ini
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx); // Jika sudah expand, tutup
      } else {
        newSet.add(idx); // Jika belum expand, buka
      }
      return newSet;
    });
    
    // Direct scroll dengan delay cukup
    setTimeout(() => {
      const questionElement = document.querySelector(`[data-question-id="${idx}"]`);
      if (questionElement) {
        const elementPosition = questionElement.getBoundingClientRect(). top + window.scrollY;
        const offsetPosition = elementPosition - 150; // Offset 150px ke atas
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300); // Delay 300ms cukup untuk render
  };

   return (
    <div className="space-y-4 [&>*:last-child]:mb-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Jawaban</h2>

      {quiz.questions.map((question, idx) => {
        const userAnswer = answers[idx];
        const isCorrect = userAnswer === question.correctAnswer;
        const isExpanded = expandedQuestions.has(idx);

        return (
          <div
            key={idx}
            data-question-id={idx}
            className="border-l-4 border-blue-500 bg-gray-50 rounded-lg overflow-hidden shadow-md"
          >
            <button
              onClick={() => handleQuestionClick(idx)}
              className="w-full text-left p-4 flex items-start justify-between hover:bg-gray-100 transition"
            >
              <div className="flex items-start gap-3 flex-1">
                {isCorrect ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-800">
                    Q{idx + 1}: {question.question}
                  </p>
                  <p className={`text-sm mt-1 font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {userAnswer}
                  </p>
                </div>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition transform ${
                  isExpanded ?  'rotate-180' : ''
                }`}
              />
            </button>

            {isExpanded && (
              <div className="border-t border-gray-200 p-6 bg-white space-y-4">
                {/* All Answer Options */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Pilihan Jawaban:</p>
                  <div className="space-y-2">
                    {question.answers.map((answer, ansIdx) => {
                      const isUserAnswer = answer === userAnswer;
                      const isCorrectAnswer = answer === question.correctAnswer;
                      
                      let bgColor = 'bg-gray-50';
                      let borderColor = 'border-gray-200';
                      let textColor = 'text-gray-700';
                      
                      if (isCorrectAnswer) {
                        bgColor = 'bg-green-50';
                        borderColor = 'border-green-300';
                        textColor = 'text-green-800';
                      } else if (isUserAnswer && !isCorrect) {
                        bgColor = 'bg-red-50';
                        borderColor = 'border-red-300';
                        textColor = 'text-red-800';
                      }

                      return (
                        <div
                          key={ansIdx}
                          className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-semibold min-w-fit">
                              {String. fromCharCode(65 + ansIdx)}. 
                            </span>
                            <span>{answer}</span>
                            {isCorrectAnswer && (
                              <span className="ml-auto">
                                <CheckCircleIcon className="w-5 h-5 text-green-600" />
                              </span>
                            )}
                            {isUserAnswer && ! isCorrect && (
                              <span className="ml-auto">
                                <XCircleIcon className="w-5 h-5 text-red-600" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Penjelasan:</p>
                  <p className="text-sm text-blue-800">{question.explanation}</p>
                </div>

                {/* Result Summary */}
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  {isCorrect ? (
                    <p className="text-sm font-semibold text-green-700">✓ Jawaban Anda Benar! </p>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-red-700 mb-2">✗ Jawaban Anda Salah</p>
                      <p className="text-sm text-red-700">
                        <span className="font-semibold">Jawaban yang benar:</span> {question.correctAnswer}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AnswerReview;  