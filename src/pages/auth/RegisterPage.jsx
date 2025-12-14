/**
 * RegisterPage
 * User registration page dengan split layout
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import { RegisterForm } from "../../components/features/auth";
import "./auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData, setServerError) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Register attempt:", formData);

      const response = await authService.register(
        formData.username,
        formData.password,
        formData.name
      );

      console.log("Register response:", response);

      // ✓ Registration success
      alert("✓ Registrasi berhasil!  Silakan login.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);

      // Handle error
      const errorMessage =
        err?.message || "Registrasi gagal. Silakan coba lagi.";
      setError(errorMessage);
      if (setServerError) {
        setServerError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* Left Side - Logo & Pattern */}
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
            <div className="flex items-center justify-center ">
              <img
                src="/assets/images/QuizMate Icon.png"
                alt="Number 9"
                className="w-32 h-32 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang
            </h1>
            <p className="text-gray-600">Buat akun baru untuk memulai</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <RegisterForm onSubmit={handleRegister} loading={loading} />

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Login di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
