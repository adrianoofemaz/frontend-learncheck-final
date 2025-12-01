/**
 * QuizPage
 * Main quiz page - display questions & handle answers
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizProgress } from '../hooks/useQuizProgress';
import { useQuiz } from '../hooks/useQuiz';
import { QuizCard, QuizTimer, AnswerOption } from '../components/features/quiz';
import { Alert } from '../components/common';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

const QuizPage = () => {
  const navigate = useNavigate();
  const { questions, loading, error, fetchQuestions, submitAnswers } = useQuiz();
  const {
    currentQuestionIndex,
    answers,
    recordAnswer,
    nextQuestion,
    previousQuestion,
    initializeQuiz,
  } = useQuizProgress();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchQuestions();
    initializeQuiz();
  }, []);

  if (loading) {
    return <Loading fullScreen text="Memuat kuis..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert type="error" title="Error" message={error} />
        <Button onClick={() => navigate(-1)} variant="primary" className="mt-4">
          Kembali
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-600 mb-4">Pertanyaan tidak ditemukan</p>
        <Button onClick={() => navigate(-1)} variant="primary">
          Kembali
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allAnswered = Object.keys(answers).length === questions.length;

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const answersData = Object.entries(answers).map(([questionIndex, answer]) => ({
        soal_id: questions[parseInt(questionIndex)]?.id,
        correct: answer !== undefined,
      }));

      const result = await submitAnswers(
        currentQuestion?. tutorial_id,
        'assessment_001',
        answersData
      );

      navigate('/quiz-results', { state: { result } });
    } catch (err) {
      setSubmitError(err.message || 'Gagal mengirim jawaban');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Timer */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </p>
            <p className="text-sm text-gray-600">
              Dijawab: {Object.keys(answers).length}/{questions.length}
            </p>
          </div>
          <QuizTimer duration={30} isActive={true} onTimeUp={nextQuestion} />
        </div>

        {/* Progress Bar */}
        <div className="mb-8 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <QuizCard
          question={currentQuestion}
          selectedAnswer={currentAnswer}
          onSelectAnswer={(index) => recordAnswer(currentQuestionIndex, index)}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {/* Error Message */}
        {submitError && (
          <Alert
            type="error"
            title="Error"
            message={submitError}
            dismissible
            onClose={() => setSubmitError(null)}
            className="mt-4"
          />
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={previousQuestion}
            variant="secondary"
            disabled={currentQuestionIndex === 0}
          >
            ← Sebelumnya
          </Button>

          {isLastQuestion ?  (
            <Button
              onClick={handleSubmitQuiz}
              variant="primary"
              disabled={! allAnswered || isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Mengirim...' : '✓ Selesai & Kirim'}
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              variant="primary"
              disabled={currentAnswer === undefined}
              fullWidth
            >
              Lanjut →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;