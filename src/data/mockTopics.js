const mockTopics = [
  {
    id: 1,
    title: 'Berkenalan dengan AI',
    description: 'Pelajari dasar-dasar AI dan aplikasinya dalam kehidupan nyata',
    modules: [
      {
        id: 1,
        title: 'Pengenalan & Sejarah AI',
        description: 'Memahami apa itu AI dan perkembangannya',
        submodules: [
          {
            id: '1. 1',
            title: 'Penerangan AI dalam Dunia Nyata',
            isLocked: false,
            content: {
              title: 'Penerangan AI dalam Dunia Nyata',
              sections: [
                {
                  type: 'text',
                  content: 'Mari kita mulai pembelajaran ini dengan mengenal penerangan AI di dunia nyata.  Menurut laporan McKinsey yang berjudul The state of AI in 2022, rata-rata penggunaan AI di industri meningkat dari 20% pada tahun 2017 menjadi 50% pada tahun 2022.  Laporan tersebut juga menyatakan bahwa 31% industri memanfaatkan teknologi AI untuk meningkatkan kualitas produk dan layanan mereka.  Hal ini menunjukkan bahwa penerapan AI sudah ada di berbagai bidang industri saat ini. Berikut merupakan contoh-contoh industri yang sudah menerapkan AI.'
                },
                {
                  type: 'diagram',
                  content: 'ai_applications_diagram'
                },
                {
                  type: 'text',
                  content: 'Dari contoh-contoh industri di atas, kita dapat melihat bahwa AI telah menjadi bagian penting dalam berbagai sektor.  Teknologi ini membantu meningkatkan efisiensi, produktivitas, dan kualitas layanan dalam setiap industri.'
                }
              ]
            },
            quiz: {
              id: 'quiz-1-1',
              title: 'Quiz Submodul 1: Penerangan AI dalam Dunia Nyata',
              totalQuestions: 3,
              durationPerQuestion: 30
            }
          },
          {
            id: '1.2',
            title: 'Pengenalan AI',
            isLocked: true,
            content: {
              title: 'Pengenalan AI',
              sections: [
                {
                  type: 'text',
                  content: 'Artificial Intelligence (AI) atau Kecerdasan Buatan adalah kemampuan mesin untuk melakukan tugas-tugas yang biasanya memerlukan kecerdasan manusia. Kecerdasan ini mencakup pembelajaran (learning), pengenalan pola (pattern recognition), pemahaman bahasa natural, dan pengambilan keputusan.'
                },
                {
                  type: 'text',
                  content: 'AI bekerja dengan menggunakan data untuk melatih model-model yang dapat membuat prediksi atau keputusan. Semakin banyak data yang diberikan, semakin akurat model AI tersebut.'
                }
              ]
            },
            quiz: {
              id: 'quiz-1-2',
              title: 'Quiz Submodul 2: Pengenalan AI',
              totalQuestions: 3,
              durationPerQuestion: 30
            }
          },
          {
            id: '1.3',
            title: 'Taksonomi AI',
            isLocked: true,
            content: {
              title: 'Taksonomi AI',
              sections: [
                {
                  type: 'text',
                  content: 'AI dapat dikategorikan berdasarkan berbagai dimensi. Salah satu cara paling umum adalah membedakan antara Narrow AI dan General AI.'
                },
                {
                  type: 'text',
                  content: 'Narrow AI (Weak AI) adalah AI yang dirancang untuk tugas-tugas spesifik. Contohnya: chatbot, sistem rekomendasi, atau pengenalan wajah. Sedangkan General AI (Strong AI) adalah AI yang dapat melakukan berbagai tugas seperti manusia.'
                }
              ]
            },
            quiz: {
              id: 'quiz-1-3',
              title: 'Quiz Submodul 3: Taksonomi AI',
              totalQuestions: 3,
              durationPerQuestion: 30
            }
          },
          {
            id: '1.4',
            title: 'AI Workflow',
            isLocked: true,
            content: {
              title: 'AI Workflow',
              sections: [
                {
                  type: 'text',
                  content: 'Alur kerja AI melibatkan beberapa tahap penting: pengumpulan data, persiapan data, pelatihan model, evaluasi, dan deployment.'
                }
              ]
            },
            quiz: {
              id: 'quiz-1-4',
              title: 'Quiz Submodul 4: AI Workflow',
              totalQuestions: 3,
              durationPerQuestion: 30
            }
          }
        ]
      },
      {
        id: 2,
        title: 'Data untuk AI',
        description: 'Peran dan pentingnya data dalam AI',
        submodules: [
          {
            id: '2.1',
            title: 'Pengenalan Data',
            isLocked: true,
            content: {
              title: 'Pengenalan Data',
              sections: [
                {
                  type: 'text',
                  content: 'Data adalah aset paling berharga dalam pengembangan AI. Kualitas dan kuantitas data menentukan performa model AI yang akan dibangun.'
                }
              ]
            },
            quiz: {
              id: 'quiz-2-1',
              title: 'Quiz Submodul 1: Pengenalan Data',
              totalQuestions: 3,
              durationPerQuestion: 30
            }
          }
        ]
      }
    ],
    finalQuiz: {
      id: 'final-quiz-1',
      title: 'Quiz Akhir Modul: Berkenalan dengan AI',
      totalQuestions: 10,
      durationPerQuestion: 30
    }
  }
];

export default mockTopics;