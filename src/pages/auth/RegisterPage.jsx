/**
 * RegisterPage
 * User registration page dengan split layout
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RegisterForm } from '../../components/features/auth';
import './auth.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, error: authError } = useAuth();

  const handleRegister = async (formData, setServerError) => {
    try {
      await register(formData.name, formData.username, formData.password);
      navigate('/login');
    } catch (err) {
      setServerError(err.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <div className="auth-container min-h-screen flex">
      {/* Left Side - Logo & Pattern */}
      <div className="auth-left hidden lg:flex lg:w-1/2 items-center justify-center">
        <img 
          src="/assets/images/logo-login.jpg" 
          alt="Dicoding Logo"
          className="w-64 h-auto"
        />
      </div>

      {/* Divider */}
      <div className="auth-divider"></div>

      {/* Right Side - Form */}
      <div className="auth-right w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                9
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
            <p className="text-gray-600">Buat akun baru untuk memulai</p>
          </div>

          {/* Auth Error */}
          {authError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {authError}
            </div>
          )}

          {/* Form */}
          <RegisterForm onSubmit={handleRegister} loading={loading} />

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">Or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign In */}
          <button className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <image href="/assets/images/logo_google.png" width="24" height="24" />
            </svg>
            Sign in with Google
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun? {' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;