import React from 'react';
import { LightBulbIcon, BookOpenIcon } from '@heroicons/react/24/solid';

const HintsSuggestions = ({ score, totalQuestions }) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const suggestions = [];

  if (percentage < 40) {
    suggestions.push({
      icon: BookOpenIcon,
      title: 'Baca Ulang Materi',
      description: 'Kembali ke halaman materi dan baca dengan lebih teliti. Fokus pada konsep-konsep utama.'
    });
  }

  if (percentage >= 40 && percentage < 70) {
    suggestions.push({
      icon: LightBulbIcon,
      title: 'Coba Lagi',
      description: 'Anda sudah memahami sebagian besar. Coba kembali dan perhatikan pertanyaan yang salah.'
    });
  }

  if (percentage >= 70 && percentage < 100) {
    suggestions.push({
      icon: BookOpenIcon,
      title: 'Lanjut ke Submodul Berikutnya',
      description: 'Bagus! Anda sudah siap untuk melanjutkan ke pembelajaran berikutnya.'
    });
  }

  if (percentage === 100) {
    suggestions. push({
      icon: LightBulbIcon,
      title: 'Sempurna!',
      description: 'Anda telah menguasai semua materi dengan sempurna. Lanjutkan ke fase berikutnya!'
    });
  }

  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, idx) => {
        const Icon = suggestion.icon;
        return (
          <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-4">
            <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900">{suggestion.title}</h3>
              <p className="text-sm text-blue-700 mt-1">{suggestion.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HintsSuggestions;