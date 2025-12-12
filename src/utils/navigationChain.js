/**
 * Navigation Chain Utilities - FULL CODE REVISED
 * Handle sidebar items dan chain navigation logic
 */

/**
 * Helper: Check if quiz submodule is completed
 * @param {number} tutorialId - Tutorial ID
 * @returns {boolean}
 */
export const isQuizCompleted = (tutorialId) => {
  if (typeof window === "undefined") return false;
  try {
    const result = localStorage.getItem(`quiz-result-${tutorialId}`);
    return !!result;
  } catch {
    return false;
  }
};

/**
 * Helper: Check if final quiz is completed
 * @returns {boolean}
 */
export const isFinalQuizCompleted = () => {
  if (typeof window === "undefined") return false;
  try {
    const result = localStorage.getItem('quiz-result-final');
    return !!result;
  } catch {
    return false;
  }
};

/**
 * Build sidebar items dengan progress logic yang benar
 * REVISED: Quiz bisa diakses langsung tanpa perlu mark materi completed
 * @param {Array} tutorials - List of tutorials
 * @param {Function} getProgress - Function to get tutorial progress (not used anymore)
 * @returns {Array} Sidebar items
 */
export const buildSidebarItems = (tutorials, getProgress) => {
  const items = [];

  tutorials.forEach((tutorial, idx) => {
    const isFirstSubmodul = idx === 0;
    const prevTutorialId = idx > 0 ? tutorials[idx - 1].id : null;
    
    // Quiz submodul sebelumnya harus selesai (kecuali submodul pertama)
    const isPrevQuizCompleted = isFirstSubmodul || 
                                (prevTutorialId && isQuizCompleted(prevTutorialId));

    // === 1. MATERI SUBMODUL ===
    // Bisa diakses jika:
    // - Submodul 1: Selalu bisa
    // - Submodul N: Jika quiz submodul N-1 sudah selesai
    items.push({
      type: "tutorial",
      id: tutorial.id,
      label: tutorial.title,
      desc: "Materi submodul",
      progressAllowed: isPrevQuizCompleted,
      locked: !isPrevQuizCompleted,
      icon: "📖",
    });

    // === 2. QUIZ SUBMODUL ===
    // Bisa diakses jika:
    // - User sudah buka materi submodul yang sama
    // - Tidak perlu mark completed, cukup baca materi
    const isThisQuizCompleted = isQuizCompleted(tutorial.id);
    
    items.push({
      type: "quiz-sub",
      id: tutorial.id,
      label: `Quiz Submodul ${idx + 1}`,
      desc: isThisQuizCompleted ? "Sudah dikerjakan" : "Quiz submodul",
      progressAllowed: isPrevQuizCompleted, // Same as tutorial access
      locked: !isPrevQuizCompleted,
      completed: isThisQuizCompleted,
      icon: isThisQuizCompleted ? "✅" : "📝",
    });
  });

  // === 3. QUIZ FINAL ===
  // Bisa diakses jika:
  // - Semua quiz submodul sudah selesai
  const allSubmodulQuizCompleted = tutorials.every((t) => isQuizCompleted(t.id));
  const isFinalCompleted = isFinalQuizCompleted();
  
  items.push({
    type: "quiz-final",
    id: "quiz-final",
    label: "Quiz Final",
    desc: isFinalCompleted ? "Sudah dikerjakan" : "Ujian akhir",
    progressAllowed: allSubmodulQuizCompleted,
    locked: !allSubmodulQuizCompleted,
    completed: isFinalCompleted,
    icon: isFinalCompleted ? "✅" : "🎓",
  });

  // === 4. DASHBOARD ANALYTIC ===
  // Bisa diakses jika:
  // - Quiz final sudah selesai
  items.push({
    type: "dashboard",
    id: "dashboard",
    label: "Dashboard Analytic",
    desc: "Ringkasan hasil",
    progressAllowed: isFinalCompleted,
    locked: !isFinalCompleted,
    icon: "📊",
  });

  return items;
};

/**
 * Build chain untuk navigasi back/next
 * @param {Array} tutorials - List of tutorials
 * @param {number} currentId - Current tutorial ID
 * @returns {Object} { idx, total }
 */
export const buildChain = (tutorials, currentId) => {
  if (!tutorials || tutorials.length === 0) {
    return { idx: -1, total: 0 };
  }
  
  const idx = tutorials.findIndex((t) => t.id === currentId);
  return { 
    idx: idx >= 0 ? idx : 0, 
    total: tutorials.length 
  };
};

/**
 * Get next destination after completing quiz
 * @param {Array} tutorials - List of tutorials
 * @param {number} currentTutorialId - Current tutorial ID
 * @returns {Object} { type: 'learning' | 'quiz-final' | 'dashboard', id: number | string }
 */
export const getNextDestination = (tutorials, currentTutorialId) => {
  const currentIndex = tutorials.findIndex((t) => t.id === currentTutorialId);
  
  if (currentIndex === -1) {
    // Tutorial tidak ditemukan
    return { type: 'home', id: null };
  }
  
  if (currentIndex < tutorials.length - 1) {
    // Masih ada submodul berikutnya
    const nextTutorial = tutorials[currentIndex + 1];
    return { 
      type: 'learning', 
      id: nextTutorial.id 
    };
  }
  
  // Sudah submodul terakhir
  // Cek apakah semua quiz submodul selesai
  const allSubmodulQuizCompleted = tutorials.every((t) => isQuizCompleted(t.id));
  
  if (allSubmodulQuizCompleted) {
    // Semua quiz submodul selesai, lanjut ke quiz final
    const isFinalCompleted = isFinalQuizCompleted();
    
    if (isFinalCompleted) {
      // Quiz final sudah selesai, ke dashboard
      return { type: 'dashboard', id: 'dashboard' };
    } else {
      // Quiz final belum dikerjakan
      return { type: 'quiz-final', id: 'quiz-final' };
    }
  }
  
  // Fallback: kembali ke home
  return { type: 'home', id: null };
};

/**
 * Get previous destination for back navigation
 * @param {Array} tutorials - List of tutorials
 * @param {number} currentTutorialId - Current tutorial ID
 * @returns {Object} { type: 'learning' | 'quiz-result' | 'home', id: number | null }
 */
export const getPrevDestination = (tutorials, currentTutorialId) => {
  const currentIndex = tutorials.findIndex((t) => t.id === currentTutorialId);
  
  if (currentIndex <= 0) {
    // Submodul pertama, kembali ke home
    return { type: 'home', id: null };
  }
  
  // Kembali ke hasil quiz submodul sebelumnya
  const prevTutorial = tutorials[currentIndex - 1];
  return { 
    type: 'quiz-result', 
    id: prevTutorial.id 
  };
};

export default {
  buildSidebarItems,
  buildChain,
  isQuizCompleted,
  isFinalQuizCompleted,
  getNextDestination,
  getPrevDestination,
};