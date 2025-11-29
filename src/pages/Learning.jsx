import React, { useEffect } from 'react';
import SubmoduleContent from '../components/Learning/SubmoduleContent';

const Learning = ({ onCompletion }) => {
  useEffect(() => {
    localStorage.setItem('lastPage', 'material');
    console.log('Material page visited');
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Card wrapper untuk materi — gunakan kelas yang sudah ada di CSS (content-box / bg-white / rounded-2xl / shadow-lg / p-8) */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-slideUp content-box">
          <SubmoduleContent onCompletion={onCompletion} />
        </div>
      </div>
    </div>
  );
};

export default Learning;