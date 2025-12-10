import React from "react";
import Card from "../../common/Card";

const ResultCard = ({ score = 0, correct = 0, total = 0, duration = "", isPass = false }) => {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const statusText = isPass ? "Lulus" : "Coba Lagi";
  const statusColor = isPass ? "text-green-600" : "text-red-600";
  const statusIcon = isPass ? "✅" : "❌";

  return (
    <Card className="overflow-hidden bg-white shadow-lg rounded-2xl p-0">
      {/* Header bar */}
      <div className="h-12 bg-gradient-to-r from-[#1e7bff] to-[#0f5eff]" />
      <div className="p-6">
        <h2 className="text-center text-2xl font-extrabold text-gray-900 mb-2">Quiz Submodul</h2>
        <p className="text-center text-gray-600 mb-4">Penerapan AI dalam Dunia Nyata</p>

        <div className="flex flex-col items-center mb-6">
          <div className={`text-3xl font-bold ${statusColor} flex items-center gap-2`}>
            <span>{statusIcon}</span>
            <span>{statusText}</span>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {isPass
              ? "Bagus, kamu sudah memenuhi ambang kelulusan."
              : "Anda perlu menjawab lebih banyak pertanyaan dengan benar"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-xl p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Skor Anda</p>
            <p className="text-2xl font-bold text-blue-700">
              {correct}/{total}
            </p>
            <p className="text-xs text-gray-500">soal terjawab benar</p>
          </div>
          <div className="border rounded-xl p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Persentase</p>
            <p className="text-2xl font-bold text-blue-700">{percentage}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <div className="border rounded-xl p-4 shadow-sm bg-white">
            <p className="text-sm text-gray-600 mb-1">Durasi</p>
            <p className="text-2xl font-bold text-orange-500">
              {duration || "-"}
            </p>
            <p className="text-xs text-gray-500">waktu pengerjaan</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;