import React from "react";

const SilabusPage = () => {
  const syllabusData = [
    {
      id: 1,
      title: "Penerapan AI dalam Dunia Nyata",
      description:
        "Mengeksplorasi berbagai kasus penggunaan AI di berbagai industri, mulai dari kesehatan hingga keuangan, menunjukkan dampak transformatifnya.",
      icon: "✓",
      articles: 7,
      quizzes: 0,
      duration: "40 menit",
      status: "Selesai",
      statusColor: "text-blue-500",
      progress: 7,
    },
    {
      id: 2,
      title: "Pengenalan AI",
      description:
        "Memahami apa itu Kecerdasan Buatan, sejarah perkembangannya, dan mengapa AI menjadi kekuatan pendorong di era digital saat ini.",
      icon: "✓",
      articles: 6,
      quizzes: 1,
      duration: "90 menit",
      status: "Selesai",
      statusColor: "text-blue-500",
      progress: 7,
    },
    {
      id: 3,
      title: "Taksonomi AI",
      description:
        "Mempelajari klasifikasi dan kategori utama dalam dunia AI, termasuk AI sempit, AI umum, dan AI super.",
      icon: "⌛",
      articles: 5,
      quizzes: 1,
      duration: "85 menit",
      status: "Dalam Proses",
      statusColor: "text-gray-700",
      progress: 6,
    },
    {
      id: 4,
      title: "AI Workflow",
      description:
        "Memahami tahapan standar dalam pengembangan proyek AI, dari perumusan masalah hingga deployment dan pemeliharaan.",
      icon: "○",
      articles: 8,
      quizzes: 1,
      duration: "150 menit",
      status: "Belum Dimulai",
      statusColor: "text-gray-500",
      progress: 9,
    },
    {
      id: 5,
      title: "[Story] Belajar Mempermudah Pekerjaan dengan AI",
      description:
        "Studi kasus inspiratif tentang bagaimana AI dapat digunakan untuk mengotomatisasi tugas, meningkatkan efisiensi, dan menciptakan nilai tambah di tempat kerja.",
      icon: "🔒",
      articles: 7,
      quizzes: 1,
      duration: "145 menit",
      status: "Terkunci",
      statusColor: "text-gray-500",
      progress: 9,
    },
    {
      id: 6,
      title: "Pengenalan Data",
      description:
        "Mengenali berbagai jenis data, sumber data, dan pentingnya data sebagai bahan bakar utama untuk sistem AI.",
      icon: "🔒",
      articles: 1,
      quizzes: 1,
      duration: "90 menit",
      status: "Terkunci",
      statusColor: "text-gray-500",
      progress: 2,
    },
  ];

  return (
    <div className="max-w-10xl mx-auto px-20 py-12">
      <h1 className="text-2xl font-bold mb-8">Silabus Kelas</h1>

      <div className="space-y-6">
        {syllabusData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-2xl mt-1">{item.icon}</span>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                      </svg>
                      <span>{item.articles} Artikel</span>
                    </div>

                    {item.quizzes > 0 && (
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            width="8"
                            height="4"
                            x="8"
                            y="2"
                            rx="1"
                            ry="1"
                          />
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        </svg>
                        <span>{item.quizzes} Ujian</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <span
                  className={`text-sm font-medium px-3 py-1 rounded ${
                    item.status === "Selesai"
                      ? "bg-blue-50 text-blue-500"
                      : item.status === "Dalam Proses"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              {[...Array(item.progress)].map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    item.status === "Selesai"
                      ? "bg-blue-500"
                      : item.status === "Dalam Proses"
                      ? "bg-gray-400"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SilabusPage;
