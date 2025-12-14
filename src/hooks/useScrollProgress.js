// /**
//  * useScrollProgress Hook
//  * Track scroll progress pada learning material
//  */

// import { useState, useEffect, useRef, useCallback } from 'react';

// export const useScrollProgress = (elementId) => {
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const elementRef = useRef(null);

//   const calculateProgress = useCallback(() => {
//     const element = elementId
//       ? document.getElementById(elementId)
//       : elementRef.current;

//     if (!element) return;

//     const scrollTop = window.scrollY || document.documentElement.scrollTop;
//     const docHeight = element.scrollHeight - window.innerHeight;

//     if (docHeight > 0) {
//       const progress = (scrollTop / docHeight) * 100;
//       setScrollProgress(Math.min(progress, 100));
//     }
//   }, [elementId]);

//   useEffect(() => {
//     window.addEventListener('scroll', calculateProgress);
//     return () => window.removeEventListener('scroll', calculateProgress);
//   }, [calculateProgress]);

//   return {
//     scrollProgress,
//     elementRef,
//   };
// };

// export default useScrollProgress;
