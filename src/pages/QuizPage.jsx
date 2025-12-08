import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuizProgress } from '../hooks/useQuizProgress';
import { useQuiz } from '../hooks/useQuiz';
import { QuizCard, QuizTimer } from '../components/features/quiz';
import { Alert } from '../components/common';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const QuizPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const { questions, loading, error, assessmentId, fetchQuestions, submitAnswers } = useQuiz();
  const {
    currentQuestionIndex,
    answers,
    recordAnswer,
    getCurrentAnswer,
    nextQuestion,
    previousQuestion,
    initializeQuiz,
  } = useQuizProgress();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fetchedRef = useRef(false);

  // Hooks pertama, baru lalu segala kondisi render
  useEffect(() => {
    if (!tutorialId) {
      setSubmitError('Tutorial ID tidak ditemukan');
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchQuestions(parseInt(tutorialId));
    initializeQuiz();
  }, [tutorialId, fetchQuestions, initializeQuiz]);

  const handleSubmitQuiz = useCallback(async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const answersData = Object.entries(answers).map(([questionIndex, answerIndex]) => {
        const question = questions[parseInt(questionIndex)];
        const selectedOption = question?.multiple_choice[answerIndex];
        return {
          soal_id: question?.id,
          correct: selectedOption?.correct || false,
        };
      });
      const result = await submitAnswers(parseInt(tutorialId), assessmentId, answersData);
      navigate('/quiz-results', { state: { result } });
    } catch (err) {
      const friendly = err?.raw?.details || err?.message || 'Gagal mengirim jawaban';
      setSubmitError(friendly);
      setIsSubmitting(false);
    }
  }, [answers, assessmentId, navigate, questions, submitAnswers, tutorialId]);

  const handleTimeUp = useCallback(() => {
    // Kalau belum soal terakhir → next; kalau terakhir → submit
    if (currentQuestionIndex >= questions.length - 1) {
      handleSubmitQuiz();
    } else {
      nextQuestion(questions.length);
    }
  }, [currentQuestionIndex, questions.length, handleSubmitQuiz, nextQuestion]);

  // ---- Setelah semua hooks & callbacks, baru boleh conditional render ----
  if (loading) return <Loading fullScreen text="Memuat kuis..." />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <Alert type="error" title="Error" message={error} />
          <Button onClick={() => navigate(-1)} variant="primary" className="mt-4">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 mb-4">Pertanyaan tidak ditemukan</p>
          <Button onClick={() => navigate(-1)} variant="primary">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer();
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allAnswered = Object.keys(answers).length === questions.length;
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen py-14 px-4">
      <div className="max-w-4xl mx-auto space-y-5 mt-10 sm:mt-12">
        <div className="rounded-2xl bg-gradient-to-r from-[#0f5eff] to-[#0a4ed6] text-white shadow-lg p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide opacity-90">Quiz Submodul</p>
              <p className="text-base sm:text-lg font-medium opacity-90">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm sm:text-base">
              <div className="font-semibold">Sisa Waktu</div>
              <QuizTimer
                duration={30}
                isActive={true}
                onTimeUp={handleTimeUp}
                variant="light"
                resetKey={currentQuestionIndex} // reset timer tiap pindah soal
              />
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-white/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <QuizCard
            question={currentQuestion}
            selectedAnswer={currentAnswer}
            onSelectAnswer={(index) => recordAnswer(currentQuestionIndex, index)}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
          />
        </div>

        {submitError && (
          <Alert
            type="error"
            title="Error"
            message={submitError}
            dismissible
            onClose={() => setSubmitError(null)}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex-1 sm:flex-none">
            {currentQuestionIndex > 0 ? (
              <Button
                onClick={previousQuestion}
                variant="secondary"
                fullWidth
                className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              >
                ← Sebelumnya
              </Button>
            ) : (
              <div className="h-10" />
            )}
          </div>

          <div className="flex-[2]">
            {isLastQuestion ? (
              <Button
                onClick={handleSubmitQuiz}
                variant="primary"
                disabled={!allAnswered || isSubmitting}
                fullWidth
                className="bg-[#0f5eff] hover:bg-[#0d52db]"
              >
                {isSubmitting ? 'Mengirim...' : '✓ Selesai & Kirim'}
              </Button>
            ) : (
              <Button
                onClick={() => nextQuestion(questions.length)}
                variant="primary"
                disabled={currentAnswer === undefined}
                fullWidth
                className="bg-[#0f5eff] hover:bg-[#0d52db]"
              >
                Lanjut →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;