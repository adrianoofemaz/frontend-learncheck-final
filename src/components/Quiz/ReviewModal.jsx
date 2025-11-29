import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Button from '../Common/Button';

/*
  ReviewModal rendered via portal -> ensures backdrop covers full viewport
  even when parent containers create stacking/transform contexts.
*/
const ReviewModal = ({ isOpen, onClose, onConfirm, answers = {}, totalQuestions = 0 }) => {
  const modalRef = useRef(null);

  const computeHeaderOffset = () => {
    try {
      const cssHeader = getComputedStyle(document.documentElement).getPropertyValue('--header-offset');
      if (cssHeader) {
        const parsed = parseInt(cssHeader, 10);
        if (!Number.isNaN(parsed)) return parsed;
      }
    } catch (e) { /* ignore */ }
    const header = document.querySelector('header') || document.querySelector('.app-header');
    return header ? header.offsetHeight + 12 : 84;
  };

  const computeStageRaise = () => {
    try {
      const cssRaise = getComputedStyle(document.documentElement).getPropertyValue('--stage-raise');
      if (cssRaise) {
        const parsed = parseInt(cssRaise, 10);
        if (!Number.isNaN(parsed)) return parsed;
      }
    } catch (e) { /* ignore */ }
    return 0;
  };

  const scrollToStage = (selector = '.quiz-stage') => {
    const stage = document.querySelector(selector);
    if (!stage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const HEADER_OFFSET = computeHeaderOffset();
    const STAGE_RAISE = computeStageRaise();
    const rect = stage.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const target = Math.max(absoluteTop - HEADER_OFFSET - STAGE_RAISE, 0);
    window.scrollTo({ top: target, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      // scroll underlying content so quiz-stage is visible & centered
      scrollToStage('.quiz-stage');

      // focus modal container for accessibility
      if (modalRef.current && typeof modalRef.current.focus === 'function') {
        modalRef.current.setAttribute('tabindex', '-1');
        modalRef.current.focus();
      }
    }, 60);
    return () => clearTimeout(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const answeredCount = Object.keys(answers).filter(k => answers[k] !== null && answers[k] !== undefined).length;
  const unansweredCount = totalQuestions - Object.keys(answers).length;
  const explicitlyUnanswered = Object.keys(answers).filter(k => answers[k] === null).length;

  // Portal markup
  const modalContent = (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop (full viewport) */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal box */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 z-10 outline-none"
      >
        <h3 className="text-lg font-semibold mb-4">Review Jawaban</h3>

        <div className="mb-4">
          <div className="bg-sky-50 p-3 rounded">
            <div>Soal terjawab: <strong className="text-emerald-600">{answeredCount}/{totalQuestions}</strong></div>
            <div>Soal belum dijawab: <strong className="text-rose-600">{explicitlyUnanswered + Math.max(0, unansweredCount)}</strong></div>
          </div>
        </div>

        { (explicitlyUnanswered + Math.max(0, unansweredCount)) > 0 && (
          <div className="mb-4 text-sm text-amber-700">
            Jika ada soal yang belum dijawab, kamu bisa kembali untuk menyelesaikannya atau langsung selesai sekarang.
          </div>
        ) }

        <div className="flex justify-between gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1">Kembali</Button>
          <Button onClick={onConfirm} variant="primary" className="flex-1">Selesai</Button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

ReviewModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  answers: PropTypes.object,
  totalQuestions: PropTypes.number
};

export default ReviewModal;