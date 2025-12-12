import React, { useContext } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../../context/UserContext";

/**
 * items: { type: "tutorial"|"quiz-sub"|"quiz-final"|"dashboard", id, label, desc, progressAllowed }
 * currentId: id item aktif
 * currentType: tipe item aktif
 * onSelect: (item) => void
 * isOpen/onToggle: kontrol slide-in
 */
const ModuleSidebar = ({
  items,
  currentId,
  currentType = "tutorial",
  onSelect,
  isOpen,
  onToggle,
}) => {
  const { preferences } = useContext(UserContext);

  return (
    <>
      <div
        onClick={onToggle}
        className={`fixed top-24 z-200 p-2 bg-blue-900 w-8 text-2xl cursor-pointer rounded-full transition-all duration-300 ${
          isOpen ? "right-80 translate-x-4" : "-right-3 rounded-r translate-x-0"
        }`}
      >
        {isOpen ? <ChevronRightIcon color="white" /> : <ChevronLeftIcon color="white" />}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed h-full top-0 right-0 w-80 pt-32 px-6 overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out ${
          preferences?.theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } ${isOpen ? "translate-x-0" : "translate-x-120"}`}
      >
        <div className="mb-2 pt-8 lg:pt-0">
          <h3
            className={`text-lg font-bold ${
              preferences?.theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Navigasi
          </h3>
        </div>

        <div className="space-y-2 h-screen">
          {items.map((item) => {
            const isCurrent = item.type === currentType && item.id === currentId
            // Izinkan klik item dengan id yang sama (submodul yang sedang dibuka),
            // tapi tetap hormati lock untuk submodul lain
            const accessible = isCurrent || item.id === currentId ? true : item.progressAllowed;
            return (
              <div key={`${item.type}-${item.id}`}>
                <button
                  disabled={!accessible}
                  onClick={() => {
                    if (!accessible) return;
                    onSelect(item);
                    onToggle();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-blue-50 border border-blue-300"
                      : "hover:bg-gray-100 border border-transparent"
                  } ${!accessible ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">
                      {isCurrent ? "▶" : accessible ? "●" : "○"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${
                          isCurrent
                            ? preferences?.theme === "dark"
                              ? "text-blue-500"
                              : "text-blue-600"
                            : preferences?.theme === "dark"
                            ? "text-blue-300"
                            : "text-gray-900"
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ModuleSidebar;
