const mockQuizzes = [
  {
    id: 1,
    title: 'Penerapan AI dalam Dunia Nyata',
    description: 'Pelajari bagaimana AI mengubah cara kita bekerja, belajar, dan hidup setiap hari.',
    durationPerQuestion: 30,
    totalQuestions: 3,
    questions: [
      {
        id: 1,
        question: 'Apa fungsi utama wake word seperti "Ok, Google!" pada smart speaker?',
        answers: [
          'Memberikan jawaban otomatis tanpa perintah',
          'Mengaktifkan perangkat agar mulai memproses perintah pengguna',
          'Mengubah suara menjadi teks secara langsung',
          'Menghasilkan audio sebagai respons'
        ],
        correctAnswer: 'Mengaktifkan perangkat agar mulai memproses perintah pengguna',
        explanation: 'Wake word dipakai untuk membangunkan sistem pendengaran agar siap menerima perintah dari pengguna.'
      },
      {
        id: 2,
        question: 'Menurut laporan McKinsey 2022, berapa peningkatan penggunaan AI di industri dari tahun 2017 ke 2022?',
        answers: [
          'Dari 10% menjadi 30%',
          'Dari 20% menjadi 50%',
          'Dari 30% menjadi 70%',
          'Dari 40% menjadi 80%'
        ],
        correctAnswer: 'Dari 20% menjadi 50%',
        explanation: 'Laporan McKinsey menyebutkan bahwa penggunaan AI meningkat dari 20% pada 2017 menjadi 50% pada 2022.'
      },
      {
        id: 3,
        question: 'Berapa persen industri yang memanfaatkan teknologi AI untuk meningkatkan kualitas produk menurut laporan tersebut?',
        answers: [
          '20%',
          '25%',
          '31%',
          '45%'
        ],
        correctAnswer: '31%',
        explanation: '31% industri memanfaatkan teknologi AI untuk meningkatkan kualitas produk dan layanan mereka.'
      }
    ]
  }
];

export default mockQuizzes;