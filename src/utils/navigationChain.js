// Fungsi helper untuk cek quiz done
const quizDone = (id) => {
  if (typeof window === "undefined") return false;
  try {
    return !!localStorage.getItem(`quiz-result-${id}`);
  } catch {
    return false;
  }
};

/**
 * Build sidebar items - TETAP RETURN FLAT ARRAY untuk backward compatibility
 */
export const buildSidebarItems = (tutorials, getProgress) => {
  const items = [];

  tutorials.forEach((t, idx) => {
    const prevQuizDone = idx === 0 ? true : quizDone(tutorials[idx - 1].id);
    const currentQuizDone = quizDone(t.id);
    const materialProgress = !!getProgress(t.id);

    console.log(`Tutorial ${idx + 1} (ID: ${t.id}):`, {
      materialProgress,
      currentQuizDone,
      quizProgressAllowed: materialProgress || currentQuizDone,
    });

    // Materi submodul: boleh jika quiz submodul sebelumnya sudah selesai (untuk n>0)
    items.push({
      type: "tutorial",
      id: t.id,
      label: t.title,
      desc: "Materi submodul",
      progressAllowed: idx === 0 ? true : !!prevQuizDone,
    });

    // Quiz submodul: boleh jika materinya sudah selesai ATAU quiz sudah pernah dikerjakan
    items.push({
      type: "quiz-sub",
      id: t.id,
      label: `Quiz Submodul ${idx + 1}`,
      desc: "Quiz submodul",
      progressAllowed: materialProgress || currentQuizDone,
    });
  });

  // Quiz final & dashboard: semua quiz submodul harus selesai
  const allQuizDone = tutorials.every((t) => quizDone(t.id));

  items.push({
    type: "quiz-final",
    id: "quiz-final",
    label: "Quiz Final",
    desc: "Ujian akhir",
    progressAllowed: allQuizDone,
  });

  items.push({
    type: "dashboard",
    id: "dashboard",
    label: "Dashboard Analytic",
    desc: "Ringkasan hasil",
    progressAllowed: allQuizDone,
  });

  return items;
};

// Chain back/next untuk submodul
export const buildChain = (tutorials, currentId) => {
  const idx = tutorials.findIndex((t) => t.id === currentId);
  return { idx, total: tutorials.length };
};
