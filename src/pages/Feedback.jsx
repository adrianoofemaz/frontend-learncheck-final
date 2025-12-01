import React from 'react';
import FeedbackPage from '../components/Feedback/FeedbackPage';

const Feedback = () => {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <FeedbackPage />
      </div>
    </div>
  );
};

export default Feedback;