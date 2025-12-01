/**
 * LoginPage
 * User login page
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from '../../components/features/auth';
import Card from '../../components/common/Card';
import './auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();

  const handleLogin = async (formData, setServerError) => {
    try {
      await login(formData. username, formData.password);
      navigate('/home');
    } catch (err) {
      setServerError(err.message || 'Login gagal.  Silakan coba lagi.');
    }
  };

  return (
    <div className="auth-page min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="auth-card" shadow="lg">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LearnCheck</h1>
            <p className="text-gray-600">Masuk ke akun Anda</p>
          </div>

          {/* Auth Error */}
          {authError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {authError}
            </div>
          )}

          {/* Form */}
          <LoginForm onSubmit={handleLogin} loading={loading} />

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Belum punya akun? {' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Daftar di sini
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;