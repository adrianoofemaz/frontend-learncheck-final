import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuizProgress } from "../hooks/useQuizProgress";
import { useQuiz } from "../hooks/useQuiz";
import { QuizCard, QuizTimer } from "../components/features/quiz";
import { Alert } from "../components/common";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";

const QuizPage = () => {
  const navigate = useNavigate();
  const { tutorialId } = useParams();
  const {
    questions,
    loading,
    error,
    assessmentId,
    fetchQuestions,
    submitAnswers,
  } = useQuiz();
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

  useEffect(() => {
    if (tutorialId) {
      fetchQuestions(parseInt(tutorialId));
      initializeQuiz();
    } else {
      setSubmitError("Tutorial ID tidak ditemukan");
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
      const answersData = Object.entries(answers).map(
        ([questionIndex, answerIndex]) => {
          const question = questions[parseInt(questionIndex)];
          const selectedOption = question?.multiple_choice[answerIndex];
          return {
            soal_id: question?.id,
            correct: selectedOption?.correct || false,
          };
        }
      );
      const result = await submitAnswers(
        parseInt(tutorialId),
        assessmentId,
        answersData
      );
      navigate("/quiz-results", { state: { result } });
    } catch (err) {
      const friendly =
        err?.raw?.details || err?.message || "Gagal mengirim jawaban";
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
          <Button
            onClick={() => navigate(-1)}
            variant="primary"
            className="mt-4"
          >
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

  return (
    <div className=" bg-white py-8 pt-30 max-w-4xl mx-auto flex items-center justify-center rounded-lg min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
            </p>
            <p className="text-sm text-gray-600">
              Dijawab: {Object.keys(answers).length}/{questions.length}
            </p>
          </div>
          <QuizTimer
            duration={30}
            isActive={true}
            onTimeUp={() => nextQuestion(questions.length)}
          />
        </div>

        <div className="mb-8 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          />
        </div>

        <QuizCard
          question={currentQuestion}
          selectedAnswer={currentAnswer}
          onSelectAnswer={(index) => recordAnswer(currentQuestionIndex, index)}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        {submitError && (
          <Alert
            type="error"
            title="Error"
            message={submitError}
            dismissible
            onClose={() => setSubmitError(null)}
          />
        )}

        <div className="mt-8 flex gap-4">
          <Button
            onClick={previousQuestion}
            variant="secondary"
            disabled={currentQuestionIndex === 0}
          >
            ← Sebelumnya
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmitQuiz}
              variant="primary"
              disabled={!allAnswered || isSubmitting}
              fullWidth
            >
              {isSubmitting ? "Mengirim..." : "✓ Selesai & Kirim"}
            </Button>
          ) : (
            <Button
              onClick={() => nextQuestion(questions.length)}
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
