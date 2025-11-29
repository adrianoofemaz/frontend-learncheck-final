import React from 'react';

/*
  FeedbackDisplay
  - Menampilkan feedback setelah user menjawab soal.
  - Props:
    - isCorrect: boolean | null
    - explanation: string (opsional)
    - isTimeUp: boolean (opsional)
  - Tidak mengubah alur aplikasi, hanya presentasi.
*/
const FeedbackDisplay = ({ isCorrect = null, explanation = '', isTimeUp = false }) => {
  let statusClass = 'neutral';
  if (isTimeUp) statusClass = 'neutral';
  else if (isCorrect === true) statusClass = 'correct';
  else if (isCorrect === false) statusClass = 'incorrect';

  return (
    <div
      className={`feedback ${statusClass}`}
      role="status"
      aria-live="polite"
      tabIndex={-1} /* memungkinkan fokus programatik dari parent */
    >
      <div className="feedback-inner">
        <div className="feedback-icon" aria-hidden="true">
          {isTimeUp ? (
            // simple clock icon (svg)
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 7V12L15 14" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : isCorrect ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 6L18 18" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div>
          <div style={{ marginBottom: 6, fontWeight: 700 }}>
            {isTimeUp ? 'Waktu Habis' : isCorrect ? 'Jawaban Benar' : 'Jawaban Salah'}
          </div>

          {explanation && (
            <div style={{ color: '#374151' }}>
              {explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDisplay;