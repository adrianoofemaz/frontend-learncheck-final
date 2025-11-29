import React, { useState } from "react";

const DeskripsiPage = () => {
  const [activeTab, setActiveTab] = useState("deskripsi");

  const tabs = [
    { id: "deskripsi", label: "Deskripsi Kelas" },
    { id: "testimoni", label: "Testimoni" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <div className="max-w-10xl mx-auto px-20 py-12">
      {/* Tabs Navigation */}
      <div className="mb-8">
        <div className="flex justify-center gap-0 bg-gray-50 rounded-lg p-1 max-w-20xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-6 font-medium transition-all rounded-md ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "deskripsi" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Deskripsi</h2>
            <div className="text-gray-700 space-y-4">
              <p>
                Selamat datang di kelas "Belajar Dasar AI", kursus komprehensif
                yang dirancang untuk memperkenalkan Anda pada dunia kecerdasan
                buatan dari nol. Kursus ini sangat cocok untuk pemula yang ingin
                memahami konsep dasar, algoritma, dan aplikasi AI modern tanpa
                memerlukan latar belakang teknis yang mendalam.
              </p>
              <p>
                Materi dirancang menjadi yang terstruktur, Anda akan belajar:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li>• Dasar-dasar Machine Learning</li>
                <li>
                  • Memahami konsep pembelajaran terbimbing dan tanpa terbimbing
                </li>
                <li>• Jaringan Saraf Tiruan</li>
                <li>
                  • Mempelajari arsitektur dasar dan cara kerja neural network
                </li>
                <li>• Pengolahan Bahasa Alami (NLP)</li>
                <li>
                  • Prinsip dasar interaksi AI dengan bahasa manusia saat ini
                </li>
              </ul>

              <button className="text-blue-500 font-medium mt-4 flex items-center gap-2 hover:text-blue-600">
                Selengkapnya
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
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === "testimoni" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Testimoni</h2>
            <p className="text-gray-500">Belum ada testimoni tersedia.</p>
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">FAQ</h2>
            <p className="text-gray-500">Belum ada FAQ tersedia.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeskripsiPage;
