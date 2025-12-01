/**
 * RegisterPage
 * User registration page
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { RegisterForm } from '../../components/features/auth';
import Card from '../../components/common/Card';
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
    <div className="auth-page min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="auth-card" shadow="lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LearnCheck</h1>
            <p className="text-gray-600">Buat akun baru</p>
          </div>

          {/* Auth Error */}
          {authError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {authError}
            </div>
          )}

          {/* Form */}
          <RegisterForm onSubmit={handleRegister} loading={loading} />

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Masuk di sini
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;