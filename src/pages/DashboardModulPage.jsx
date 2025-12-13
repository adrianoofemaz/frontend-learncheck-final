import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems } from "../utils/navigationChain";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import SubmoduleScoreChart from "../components/features/analytics/SubmoduleScoreCharts";

const SUBMODULE_RESULT_KEY = "submodule-results";

const SUBMODULE_TITLE_MAP = {
  35363: "Penerapan AI dalam Dunia Nyata",
  35368: "Pengenalan AI",
  35373: "Taksonomi AI",
  35378: "AI Workflow",
  35383: "[Story] Belajar Mempermudah Pekerjaan dengan AI",
  35398: "Pengenalan Data",
  35403: "Kriteria Data untuk AI",
  35793: "Infrastruktur Data di Industri",
  35408: "[Story] Apa yang Diperlukan untuk Membuat AI?",
  35428: "Tipe-Tipe Machine Learning",
};

const fmtPct = (v) =>
  v === null || v === undefined ? "-" : `${Math.round(v)}%`;
const fmtTime = (sec) => {
  if (sec === null || sec === undefined) return "-";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h} Jam ${m} Menit`;
};

const normalizeId = (val) => {
  if (val === undefined || val === null) return null;
  const s = String(val);
  const num = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(num) ? num : null;
};

const computePassStatus = ({ submodules = [], finalScore = 0 }) => {
  if (!submodules.length) return false;
  const passedSubs = submodules.filter((s) => (s.correct ?? 0) >= 2);
  const submoduleRatio = passedSubs.length / submodules.length;
  return submoduleRatio >= 0.75 && finalScore >= 60;
};

const loadLocalSubmodules = () => {
  try {
    const raw = localStorage.getItem(SUBMODULE_RESULT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getSubmoduleName = (s, i) => {
  const normId = normalizeId(s?.id);
  if (normId && SUBMODULE_TITLE_MAP[normId]) return SUBMODULE_TITLE_MAP[normId];
  if (s?.name) return s.name;
  if (s?.title) return s.title;
  if (s?.submoduleTitle) return s.submoduleTitle;
  if (s?.label) return s.label;
  return `Submodul ${i + 1}`;
};

const DashboardModulPage = ({ data }) => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [localSubs, setLocalSubs] = useState([]);

  useEffect(() => {
    setLocalSubs(loadLocalSubmodules());
  }, []);

  const payload = state?.analytics || data || {};
  const submodules = payload.submodules || localSubs || [];
  const finalScore = payload.finalScore ?? state?.score ?? 0;
  const totalLearningSeconds = payload.totalLearningSeconds ?? 5400; // fallback 1.5h
  const pass = computePassStatus({ submodules, finalScore });

  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );

  const goBackChain = () => navigate("/quiz-final-result");

  return (
    <LayoutWrapper
      embed={embed}
      contentClassName={`pt-20 pb-24 ${
        sidebarOpen ? "pr-80" : ""
      } transition-all duration-300`}
      sidePanel={
        !embed ? (
          <div className="print-hide">
            <ModuleSidebar
              items={sidebarItems}
              currentId={null}
              onSelect={(item) => {
                if (item.type === "tutorial") navigate(`/learning/${item.id}`);
                else if (item.type === "quiz-sub")
                  navigate(`/quiz-intro/${item.id}`);
                else if (item.type === "quiz-final")
                  navigate("/quiz-final-intro");
                else if (item.type === "dashboard")
                  navigate("/dashboard-modul");
              }}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen((p) => !p)}
            />
          </div>
        ) : null
      }
      bottomBar={
        !embed ? (
          <div className="print-hide">
            <BottomBarTwoActions
              leftLabel="← Kembali"
              rightLabel="Selesai"
              onLeft={goBackChain}
              onRight={() => navigate("/home")}
            />
          </div>
        ) : null
      }
    >
      {/* hanya area ini yang dicetak */}
      <div
        id="printable-analytics"
        className="max-w-6xl mx-auto py-10 space-y-6 px-4"
      >
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Modul: {payload.moduleTitle || "Berkenalan dengan AI"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              %
            </div>
            <div>
              <p className="text-sm text-gray-500">Nilai Akhir Modul</p>
              <p className="text-xl font-semibold text-gray-900">
                {fmtPct(finalScore)}
              </p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Kelulusan</p>
              <p className="text-xl font-semibold text-gray-900">
                {pass ? "Lulus" : "Belum Lulus"}
              </p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              ⏱
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Waktu Belajar</p>
              <p className="text-xl font-semibold text-gray-900">
                {fmtTime(totalLearningSeconds)}
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-3">
            Nilai Quiz Submodul
          </p>
          <SubmoduleScoreChart
            data={submodules.map((s, i) => ({
              name: getSubmoduleName(s, i),
              score: s.score ?? 0,
            }))}
          />
        </Card>

        <Card className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-4">
            Peta Kelemahan Anda
          </p>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-blue-100">
            <table className="min-w-full text-sm text-left border-collapse table-fixed">
              <colgroup>
                <col style={{ width: "38%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr className="bg-[#0f5eff] text-white text-base">
                  <th className="px-5 py-3 font-semibold">Materi</th>
                  <th className="px-5 py-3 font-semibold text-center">Nilai</th>
                  <th className="px-5 py-3 font-semibold text-center">Waktu</th>
                  <th className="px-5 py-3 font-semibold text-center">
                    Percobaan
                  </th>
                </tr>
              </thead>
              <tbody>
                {submodules.map((s, i) => {
                  const score = s.score ?? 0;
                  const dur = s.durationSec ?? 0;
                  const attempts = s.attempts ?? 1;
                  const bg =
                    score >= 85
                      ? "bg-[#e8f7f0]"
                      : score >= 70
                      ? "bg-[#eef9ff]"
                      : score >= 50
                      ? "bg-[#fff9e8]"
                      : "bg-[#ffecec]";
                  return (
                    <tr
                      key={`${s.id ?? i}`}
                      className={`${bg} border-b border-[#d9e4f5] last:border-0 text-[15px]`}
                    >
                      <td className="px-5 py-3 text-gray-800 align-top">
                        {getSubmoduleName(s, i)}
                      </td>
                      <td className="px-5 py-3 text-gray-800 text-center">
                        {fmtPct(score)}
                      </td>
                      <td className="px-5 py-3 text-gray-800 text-center">
                        {dur} detik
                      </td>
                      <td className="px-5 py-3 text-gray-800 text-center">
                        {attempts}x
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-700 leading-relaxed bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
            Beberapa materi masih menunjukkan area yang perlu diperkuat. Gunakan
            insight nilai, waktu, dan percobaan untuk fokus belajar di submodul
            dengan skor rendah atau waktu pengerjaan yang lama.
          </div>
        </Card>

        <div className="flex justify-center print-hide">
          <Button
            variant="primary"
            className="cursor-pointer bg-[#0f5eff] hover:bg-[#0d52db] px-5 py-3 rounded-xl"
            onClick={() => window.print()}
          >
            Unduh Laporan PDF
          </Button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default DashboardModulPage;
