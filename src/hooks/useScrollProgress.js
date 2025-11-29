import { useRef, useState, useEffect, useCallback } from 'react';

export const useScrollProgress = (threshold = 95) => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);

  const handleScroll = useCallback(() => {
    if (! containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Check if content is scrollable
    const contentHeight = scrollHeight - clientHeight;
    const canScroll = contentHeight > 50; // Minimal 50px scroll area

    setIsScrollable(canScroll);

    if (canScroll) {
      // Calculate progress based on scroll
      const newProgress = Math.min((scrollTop / contentHeight) * 100, 100);
      setProgress(newProgress);
      
      // Mark as completed if threshold reached
      if (newProgress >= threshold) {
        setIsCompleted(true);
      }
    } else {
      // Content tidak scrollable = auto complete
      setProgress(100);
      setIsCompleted(true);
    }
  }, [threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check initial state
    handleScroll();

    container.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return {
    progress,
    isCompleted,
    containerRef,
    isScrollable
  };
};