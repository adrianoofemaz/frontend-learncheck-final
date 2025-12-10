export const buildSidebarItems = (tutorials, getProgress) => {
  const items = [];
  tutorials.forEach((t, idx) => {
    items.push({
      type: "tutorial",
      id: t.id,
      label: t.title,
      desc: "Materi submodul",
      progressAllowed: idx === 0 ? true : !!getProgress(tutorials[idx - 1].id),
    });
    items.push({
      type: "quiz-sub",
      id: t.id,
      label: `Quiz Submodul ${idx + 1}`,
      desc: "Quiz submodul",
      progressAllowed: !!getProgress(t.id),
    });
  });
  items.push({
    type: "quiz-final",
    id: "quiz-final",
    label: "Quiz Final",
    desc: "Ujian akhir",
    progressAllowed: tutorials.every((t) => getProgress(t.id)),
  });
  items.push({
    type: "dashboard",
    id: "dashboard",
    label: "Dashboard Analytic",
    desc: "Ringkasan hasil",
    progressAllowed: tutorials.every((t) => getProgress(t.id)), // atau cek flag quiz-final done jika ada
  });
  return items;
};

// Chain back/next untuk submodul
export const buildChain = (tutorials, currentId) => {
  const idx = tutorials.findIndex((t) => t.id === currentId);
  return { idx, total: tutorials.length };
};