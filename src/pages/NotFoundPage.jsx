/**
 * NotFoundPage
 * 404 page
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="max-w-md text-center">
        <div className="mb-6">
          <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Halaman Tidak Ditemukan</h1>
          <p className="text-gray-600">
            Maaf, halaman yang Anda cari tidak dapat ditemukan
          </p>
        </div>

        <Button onClick={() => navigate('/')} variant="primary" fullWidth>
          Kembali ke Beranda
        </Button>
      </Card>
    </div>
  );
};

export default NotFoundPage;