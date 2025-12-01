import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import loadingAnimation from '../assets/animations/loading.json';

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quiz } = location.state || {};
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return Math.min(90, prev + Math.random() * 30);
      });
    }, 500);

    const timer = setTimeout(() => {
      setProgress(100);
      navigate('/quiz', { state: { quiz } });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, quiz]);

  return (
    <div
      className="w-full -translate-y-24 flex items-center justify-center h-screen  p-4 relative overflow-hidden loading-page"
      aria-live="polite"
    >
      <div className="relative z-10 text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="w-48 h-48 bg-white rounded-2xl shadow-lg p-4">
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              autoplay={true}
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Tunggu sebentar!</h1>
        <p className="text-gray-600 text-lg mb-8">Kami sedang mempersiapkan soal untuk Anda...</p>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-500">
          Generating soal dengan AI... Jangan ditutup halaman ini!
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;