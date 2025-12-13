/**
 * Loading Component
 * Loading spinner
 */

import React from 'react';

const Loading = ({
  size = 'md', // sm, md, lg
  text = 'Memuat...',
  fullScreen = false,
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${sizes[size] || sizes.md}`} />
      {text && <p className="text-gray-600 text-center">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-40">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loading;