import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpenIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useProgress } from "../../context/ProgressContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCompletionPercentage } = useProgress();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Beranda", path: "/home", icon: HomeIcon },
    { label: "Materi", path: "/learning", icon: BookOpenIcon },
  ];

  const completionPercentage = getCompletionPercentage();

  return (
    <aside className="hidden lg:block w-64  bg-white border-r border-gray-200 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-6">
        {/* Progress Widget */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Progress Belajar</h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">{completionPercentage}%</div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Konten Sidebar */}
        <div className="p-6">
          {/* Progress */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Progress Belajar
            </h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {completionPercentage}%
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          {/* Menu */}
          <nav className="space-y-2">
            {menuItems.map(({ icon: Icon, label, path }) => {
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setOpen(false); // auto-close on mobile
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition 
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      </aside>
    );
};

export default Sidebar;
