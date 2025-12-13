import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems } from "../utils/navigationChain";
import Card from "../components/common/Card";

const DashboardModulPage = ({ data }) => {
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );

  const goBackChain = () => {
    navigate("/quiz-final-result");
  };

  return (
    <LayoutWrapper
      embed={embed}
      contentClassName={`pt-20 pb-24 ${
        sidebarOpen ? "pr-80" : ""
      } transition-all duration-300`}
      sidePanel={
        !embed ? (
          <ModuleSidebar
            items={sidebarItems}
            currentId={null}
            onSelect={(item) => {
              if (item.type === "tutorial") navigate(`/learning/${item.id}`);
              else if (item.type === "quiz-sub")
                navigate(`/quiz-intro/${item.id}`);
              else if (item.type === "quiz-final")
                navigate("/quiz-final-intro");
              else if (item.type === "dashboard") navigate("/dashboard-modul");
            }}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen((p) => !p)}
          />
        ) : null
      }
      bottomBar={
        !embed ? (
          <BottomBarTwoActions
            leftLabel="← Kembali"
            rightLabel="Selesai"
            onLeft={goBackChain}
            onRight={() => navigate("/home")}
          />
        ) : null
      }
    >
      <div className="max-w-6xl mx-auto py-10 space-y-6 px-4">
        <h1 className="text-3xl font-bold">Dashboard Analytic</h1>
        <Card>
          <p className="text-sm text-gray-600">
            Nilai akhir: {data?.score ?? "-"}
          </p>
          <p className="text-sm text-gray-600">
            Status kelulusan: {data?.status ?? "-"}
          </p>
          {/* Tambahkan grafik/heatmap/PDF ketika endpoint siap */}
        </Card>
      </div>
    </LayoutWrapper>
  );
};

export default DashboardModulPage;
