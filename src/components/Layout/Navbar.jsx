import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../common/Button";
import { UserContext } from "../../context/UserContext";
import ThemeToggle from "../Common/ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { preferences, changeTheme, changeFontSize } = useContext(UserContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // HANDLE LOGOUT
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // HANDLE THEME TOGGLE
  const handleThemeToggle = () => {
    const newTheme = preferences.theme === "light" ? "dark" : "light";
    changeTheme(newTheme);
  };

  // HANDLE FONT SIZE CHANGE
  const handleFontSizeChange = (e) => {
    changeFontSize(e.target.value);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300  ${
        preferences.theme === "light"
          ? "bg-gray-50 text-gray-900 drop-shadow-xl drop-shadow-blue-200"
          : "bg-gray-900 text-white drop-shadow-xl drop-shadow-blue-950"
      }`}
    >
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <div className="shrink-0">
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-bold transition-colors"
            >
              LearnCheck
            </button>
          </div>

          {/* RIGHT DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">
            {/* THEME TOGGLE */}
            <ThemeToggle
              isDark={preferences.theme === "dark"}
              onToggle={handleThemeToggle}
            />

            {/* FONT SIZE SELECT */}
            <select
              value={preferences.font_size}
              onChange={handleFontSizeChange}
              className="text-sm font-medium"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>

            {/* USER */}
            {isAuthenticated ? (
              <>
                <div className="flex gap-3 item-center">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-sm">{`Halo, ${
                        user?.name || "User"
                      }`}</p>
                      <p className="text-xs text-gray-400">
                        {user?.name + "@email.com"}
                      </p>
                    </div>

                    {/* Avatar */}
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>

                  {/* gabungan profil dengan logout */}
                  <div
                    className={`border-l ${
                      preferences.theme === "light"
                        ? "border-gray-300"
                        : "border-gray-600"
                    } item-center pt-1`}
                  >
                    <Button
                      onClick={handleLogout}
                      variant="secondary"
                      size="sm"
                      className="text-red-500 text-xs border-none hover:bg-transparent bg-transparent flex items-center"
                    >
                      <img
                        src="/public/assets/images/icon-logout.png"
                        className="w-8 h-8 item-center ml-2"
                        alt=""
                      />
                      Logout
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  variant="secondary"
                  size="sm"
                >
                  Masuk
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="primary"
                  size="sm"
                >
                  Daftar
                </Button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-200 dark:text-gray-200 hover:text-gray-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU CONTENT */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* USER */}
            {isAuthenticated && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-900 dark:text-gray-200 font-semibold text-sm">
                  Halo, {user?.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {user?.name + "@email.com"}
                </p>
              </div>
            )}

            {/* THEME TOGGLE */}
            <ThemeToggle
              isDark={preferences.theme === "dark"}
              onToggle={handleThemeToggle}
            />

            {/* FONT SIZE */}
            <select
              value={preferences.font_size}
              onChange={handleFontSizeChange}
              className="px-4 py-2"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>

            {/* LOGOUT */}
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                fullWidth
                className="text-red-600 justify-center bg-red-500 hover:bg-red-600"
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
