import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const ScrollIndicator = ({ progress, isScrollable }) => {
  // Hide jika:
  // 1. Content tidak scrollable
  // 2. User sudah scroll > 20%
  if (!isScrollable || progress > 20) return null;

  return (
    <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div className="text-center">
        <p className="text-xs text-gray-600 mb-1">Scroll untuk melanjutkan</p>
        <ChevronDownIcon className="w-5 h-5 text-gray-400 mx-auto" />
      </div>
    </div>
  );
};

export default ScrollIndicator;