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
    <>
      {/* Toggle button sidebar khusus di mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded-md border border-gray-300 shadow"
        onClick={() => setOpen(true)}
        aria-label="Buka sidebar"
      >
        <Bars3Icon className="w-6 h-6 text-blue-600" />
      </button>

      {/* Sidebar: di desktop muncul statis, di mobile drawer */}
      <aside
        className={`z-40 bg-white border-r border-gray-200 w-64 transition-transform fixed inset-y-0 left-0 overflow-y-auto duration-300 
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:static lg:block lg:translate-x-0 lg:h-[calc(100vh-64px)] lg:top-16`}
      >
        {/* Tombol tutup sidebar di mobile */}
        <div className="flex justify-end lg:hidden p-2">
          <button onClick={() => setOpen(false)} aria-label="Tutup sidebar">
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
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
      </aside>

      {/* Overlay kalau sidebar mobile terbuka */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
