export const buildSidebarItems = (tutorials, getProgress) => {
  const quizDone = (id) => {
    if (typeof window === "undefined") return false;
    try {
      return !!localStorage.getItem(`quiz-result-${id}`);
    } catch {
      return false;
    }
  };

  const items = [];
  tutorials.forEach((t, idx) => {
    const prevQuizDone = idx === 0 ? true : quizDone(tutorials[idx - 1].id);

    // Materi submodul: boleh jika quiz submodul sebelumnya sudah selesai (untuk n>0)
    items.push({
      type: "tutorial",
      id: t.id,
      label: t.title,
      desc: "Materi submodul",
      progressAllowed: idx === 0 ? true : !!prevQuizDone,
    });

    // Quiz submodul: boleh jika materinya sudah ditandai selesai
    items.push({
      type: "quiz-sub",
      id: t.id,
      label: `Quiz Submodul ${idx + 1}`,
      desc: "Quiz submodul",
      progressAllowed: !!getProgress(t.id),
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