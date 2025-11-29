import React, { useEffect } from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import ContentReader from './ContentReader';
import ProgressBar from './ProgressBar';
import ScrollIndicator from './ScrollIndicator';
import mockTopics from '../../data/mockTopics';

const SubmoduleContent = ({ onCompletion }) => {
  const { progress, isCompleted, containerRef, isScrollable } = useScrollProgress(80);

  // Get first submodule dari mockTopics
  const submodule = mockTopics[0]?.modules?.[0]?. submodules?.[0] || null;

  useEffect(() => {
    console.log('SubmoduleContent loaded:', { progress, isCompleted, isScrollable });
    
    // Dispatch completion event
    window.dispatchEvent(new CustomEvent('material-completed', {
      detail: { isCompleted }
    }));
    
    if (onCompletion) {
      onCompletion(isCompleted);
    }
  }, [isCompleted, onCompletion]);

  if (!submodule) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Submodul tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Belajar / Modul / {submodule.title}
      </div>

      {/* Progress Bar */}
      <ProgressBar progress={progress} isCompleted={isCompleted} />

      {/* Completion Feedback */}
      {! isCompleted && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          📚 Silakan baca dan pahami materi terlebih dahulu sebelum melanjutkan ke quiz.
        </div>
      )}

      {/* Content */}
      <ContentReader 
        containerRef={containerRef}
        submodule={submodule}
        isCompleted={isCompleted}
      />

      {/* Scroll Indicator */}
      {isScrollable && (
        <ScrollIndicator progress={progress} isScrollable={isScrollable} />
      )}
    </div>
  );
};

export default SubmoduleContent;