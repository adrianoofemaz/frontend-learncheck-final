import React from "react";

const RekomendasiPage = () => {
  const recommendations = [
    {
      id: 1,
      icon: "✨",
      iconColor: "text-blue-500",
      title: "Pengantar Data Science dengan Python",
      rating: 4.6,
      level: "Dasar",
    },
    {
      id: 2,
      icon: "💡",
      iconColor: "text-blue-500",
      title: "Memulai dengan Big Data Analytics",
      rating: 4.4,
      level: "Menengah",
    },
    {
      id: 3,
      icon: "⚗️",
      iconColor: "text-blue-500",
      title: "Workshop AI untuk Startup",
      rating: 4.8,
      level: "Lanjut",
    },
    {
      id: 4,
      icon: "💬",
      iconColor: "text-blue-500",
      title: "Membuat Chatbot Cerdas",
      rating: 4.5,
      level: "Menengah",
    },
  ];

  const learningPaths = [
    {
      id: 1,
      icon: "🎓",
      iconColor: "text-blue-500",
      title: "Machine Learning Lanjut",
      rating: 4.5,
      level: "Menengah",
    },
    {
      id: 2,
      icon: "💻",
      iconColor: "text-blue-500",
      title: "Deep Learning untuk Visi Komputer",
      rating: 4.8,
      level: "Lanjut",
    },
    {
      id: 3,
      icon: "📘",
      iconColor: "text-blue-500",
      title: "Pengembangan AI dengan Python",
      rating: 4.3,
      level: "Menengah",
    },
    {
      id: 4,
      icon: "🎓",
      iconColor: "text-blue-500",
      title: "Etika & Filosofi AI",
      rating: 4.2,
      level: "Dasar",
    },
  ];

  const contributors = [
    {
      id: 1,
      name: "Dr. Rina Wijaya",
      role: "Instruktur Utama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
    },
    {
      id: 2,
      name: "Prof. Eko Susanto",
      role: "Reviewer Materi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eko",
    },
    {
      id: 3,
      name: "Mira Amelia, M.Sc.",
      role: "Asisten Instruktur",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mira",
    },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={index < Math.floor(rating) ? "#FFC107" : "#E0E0E0"}
            stroke="none"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  };

  const CourseCard = ({ course }) => (
    <div className="flex items-start gap-4 hover:bg-gray-50 hover:shadow-md p-4 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 group">
      <div
        className={`text-3xl ${course.iconColor} group-hover:scale-110 transition-transform duration-300`}
      >
        {course.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <div className="flex items-center gap-3 text-sm">
          {renderStars(course.rating)}
          <span className="text-gray-600 font-medium">({course.rating})</span>
          <span className="text-gray-400">•</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-gray-700 text-xs font-medium group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            {course.level}
          </span>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );

  return (
    <div className="max-w-10xl mx-auto px-20 py-12 space-y-16">
      {/* Rekomendasi untuk Anda */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Rekomendasi untuk Anda</h2>
        <div className="flex gap-4">
          {recommendations.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Learning Path Lainnya */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Learning Path Lainnya</h2>
        <div className="flex flex-col gap-4">
          {learningPaths.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Kontributor Kelas */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Kontributor Kelas</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className="flex items-center gap-4 hover:bg-gray-50 hover:shadow-md p-4 rounded-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200 flex-1 group"
            >
              <img
                src={contributor.avatar}
                alt={contributor.name}
                className="w-16 h-16 rounded-full bg-gray-200 group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {contributor.name}
                </h3>
                <p className="text-sm text-gray-600">{contributor.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RekomendasiPage;
