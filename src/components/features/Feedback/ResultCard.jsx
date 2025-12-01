/**
 * ResultCard Component
 * Display quiz results
 */

import React from 'react';
import { formatScore, formatFeedbackSentiment, formatCorrectCount } from '../../../utils/formatters';
import Card from '../../common/Card';
import ProgressBar from '../../common/ProgressBar';

const ResultCard = ({ score, correct, total, duration }) => {
  const sentiment = formatFeedbackSentiment(score);
  const percentage = (correct / total) * 100;

  return (
    <Card className="text-center">
      <div className="mb-8">
        <div className="text-6xl font-bold text-blue-600 mb-2">
          {formatScore(score, 0)}
        </div>
        <p className="text-2xl font-semibold text-gray-900 mb-2">{sentiment}</p>
      </div>

      <div className="space-y-4 mb-8">
        <div>
          <label className="text-sm text-gray-600 mb-2 block">Akurasi Jawaban</label>
          <ProgressBar
            value={percentage}
            showLabel={false}
            variant={percentage >= 70 ? 'success' : 'warning'}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Jawaban Benar</p>
            <p className="text-2xl font-bold text-green-600">{correct}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Total Soal</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
        </div>

        {duration && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Waktu Mengerjakan</p>
            <p className="text-lg font-semibold text-gray-900">{duration}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResultCard;