import React from "react";

const HeaderHomePage = () => {
  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20">
      <div className="flex flex-col md:flex-row items-center mb-8 gap-10 p-8 bg-blue-50 rounded-lg shadow-md transition-all duration-500 ease-in-out">
        <div className="transition-all transform duration-500 ease-in-out hover:scale-105 w-full sm:w-120 h-auto">
          <img
            src="/public/assets/images/fotomodul.png"
            alt="Course Thumbnail"
            className="w-full h-auto sm:w-120 rounded-lg object-cover max-w-full"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div>
            <p className="font-medium text-2xs">
              4.87
              <span className="text-yellow-500 text-xl ml-2">★ ★ ★ ★ ★</span>
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold">Belajar Dasar AI</h2>
          </div>

          <div className="space-x-3 mb-2">
            <span className="py-1 px-4 bg-blue-200 rounded-2xl text-sm transition-all duration-300 ease-in-out hover:bg-blue-300">
              AI
            </span>
            <span className="py-1 px-4 bg-blue-200 rounded-2xl text-sm transition-all duration-300 ease-in-out hover:bg-blue-300">
              Machine Learning
            </span>
            <span className="py-1 px-4 bg-blue-200 rounded-2xl text-sm transition-all duration-300 ease-in-out hover:bg-blue-300">
              Data Science
            </span>
          </div>

          <span className="flex items-center space-x-2 text-sm text-gray-500 transition-all duration-300 ease-in-out">
            <img
              src="/public/assets/images/icon-study.png"
              alt="Level Icon"
              className="w-5 h-5 transition-transform duration-300 hover:scale-110"
            />
            <p>Level: Dasar</p>
          </span>

          <span className="flex items-center space-x-2 text-sm text-gray-500 transition-all duration-300 ease-in-out">
            <img
              src="/public/assets/images/icon-calender.png"
              alt="Calendar Icon"
              className="w-5 h-5 transition-transform duration-300 hover:scale-110"
            />
            <p>Estimasi Waktu Belajar: 40 Jam</p>
          </span>

          <div>
            <p className="text-sm text-gray-500">Progres Kursus:</p>
            <div className="flex items-center justify-between w-full">
              {/* Progress Bar */}
              <div className="w-full bg-gray-300 h-1 rounded-full mr-4">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: "75%" }} // Progress: 75%
                ></div>
              </div>

              {/* Teks Progres */}
              <div className="flex gap-2 w-full">
                <span className="text-xs font-semibold text-blue-600">
                  75% Selesai
                </span>
                <span className="text-xs text-gray-500">
                  Waktu Belajar: 25 Jam
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button className="bg-blue-500 text-white hover:bg-blue-600 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out">
              Belajar Sekarang
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-1.5 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out">
              Informasi Kelas
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-1.5 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out">
              Lihat Silabus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderHomePage;
