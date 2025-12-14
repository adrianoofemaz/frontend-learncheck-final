/**
 * LoginPage
 * User login page dengan split layout - Responsive
 */

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LoginForm } from "../../components/features/auth";
import "./auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const handleLogin = async (formData, setServerError) => {
    try {
      const response = await login(formData.username, formData.password);
      console.log("Login response:", response);

      if (response && response.token) {
        // Reload ke /home supaya state/context/storage segar untuk akun baru
        window.location.replace("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setServerError(err?.error || "Login gagal. Silakan coba lagi.");
    }
  };

  return (
    <div className="auth-container h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Left Side - Logo & Pattern - FULL */}
      <div className="auth-left hidden lg:flex flex-1 items-center justify-center">
        <img
          src="/assets/images/QuizMate.png"
          alt="Dicoding Logo"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="auth-right flex-1 bg-white w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md -translate-y-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <img
                src="/assets/images/QuizMate Icon.png"
                alt="Logo"
                className="w-52 h-52 object-contain "
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang Kembali
            </h1>
            <p className=" text-gray-600">
              Masukkan username dan password untuk login
            </p>
          </div>

          {/* Auth Error */}
          {authError && (
            <div className="mb-3 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm">
              {authError}
            </div>
          )}

          {/* Form */}
          <LoginForm onSubmit={handleLogin} loading={loading} />

          {/* Register Link */}
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
