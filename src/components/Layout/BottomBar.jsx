import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/solid';

const BottomBar = ({ prevLabel, nextLabel, onPrev, onNext, nextDisabled = false }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 md:px-8 lg:px-10 py-6 bg-white border-t border-gray-200">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        {/* Left: Previous Button */}
        {prevLabel ?  (
          <button
            onClick={onPrev}
            className="group flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            <span className="inline-block group-hover:-translate-x-0.5 transition-transform">‹</span>
            <span>{prevLabel}</span>
          </button>
        ) : (
          <div />
        )}

        {/* Right: Next Button */}
        {nextLabel ? (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`group flex items-center gap-2 text-sm font-medium transition-colors ${
              nextDisabled
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:text-blue-600'
            }`}
            title={nextDisabled ? 'Selesaikan materi terlebih dahulu' : ''}
          >
            <span>{nextLabel}</span>
            <ChevronRightIcon className={`w-4 h-4 inline-block ${
              ! nextDisabled && 'group-hover:translate-x-0.5'
            } transition-transform`} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default BottomBar;