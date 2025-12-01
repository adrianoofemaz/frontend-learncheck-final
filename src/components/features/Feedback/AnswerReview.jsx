/**
 * AnswerReview Component
 * Review individual answers
 */

import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Card from '../../common/Card';

const AnswerReview = ({ answers = [], questions = [] }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Review Jawaban</h3>

      {answers.map((answer, index) => {
        const question = questions[index];
        const isCorrect = answer.correct;

        return (
          <Card
            key={index}
            className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
            bordered
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                {isCorrect ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                )}
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-2">
                  Pertanyaan {index + 1}
                </p>
                <p className="text-gray-700 mb-3">{question?. assessment}</p>

                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isCorrect
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isCorrect ?  '✓ Benar' : '✕ Salah'}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AnswerReview;