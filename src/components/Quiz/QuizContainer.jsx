import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QuizHeader from './QuizHeader';
import QuestionDisplay from './QuestionDisplay';
import AnswerOptions from './AnswerOptions';
import QuizNavigation from './QuizNavigation';
import FeedbackDisplay from './FeedbackDisplay';
import ReviewModal from './ReviewModal';
import mockQuizzes from '../../data/mockQuizzes';
import { shuffleArray } from '../../utils/helpers';
// bgPattern import kept if used elsewhere; not used for page background here
import bgPattern from '../../assets/bg-pattern.svg';

/*
  Changes in this file vs your original:
  - Added scrollToStage utility and a useEffect that scrolls the "stage" into view
    whenever we move to the next question (unless feedback is being shown).
    This makes the UI behave like "tampilan soal pertama" after next.
  - Timer and advancing use functional updaters to avoid stale closures.
  - When user clicks "Next" we immediately reset timer/showFeedback/selectedAnswer
    and then update index (functional updater). The index-change effect runs
    the scrolling logic.
  - Kept your localStorage load/save behaviour unchanged.
*/

const shuffleQuestions = (questions = [], count = 3) => {
  const shuffled = shuffleArray(questions || []);
  return shuffled.slice(0, count).map(q => {
    const originalCorrectAnswer = q.correctAnswer;
    const shuffledAnswers = shuffleArray(q.answers || []);
    return {
      ...q,
      answers: shuffledAnswers,
      originalCorrectAnswer,
      correctAnswer: originalCorrectAnswer
    };
  });
};

const QuizContainer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tutorialId = searchParams.get('tutorial_id') || '1';
  const userId = searchParams.get('user_id') || 'anonymous';

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [timeoutQuestions, setTimeoutQuestions] = useState(new Set());
  const [isCurrentTimeUp, setIsCurrentTimeUp] = useState(false);

  const quiz = mockQuizzes[0];
  const durationPerQuestion = quiz?.durationPerQuestion ?? 30;
  const totalSelectedQuestions = quiz?.totalQuestions ?? 3;

  // Utility: read CSS vars / header offset so scroll places the stage correctly
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
    if (!stage) return;
    const HEADER_OFFSET = computeHeaderOffset();
    const STAGE_RAISE = computeStageRaise();
    const rect = stage.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const target = Math.max(absoluteTop - HEADER_OFFSET - STAGE_RAISE, 0);
    window.scrollTo({ top: target, behavior: 'smooth' });
    const firstInteractive = stage.querySelector('button, [role="button"], a, input, textarea, select');
    if (firstInteractive && typeof firstInteractive.focus === 'function') {
      try { firstInteractive.focus(); } catch (e) { /* ignore */ }
    }
  };

  // Initialize quiz
  useEffect(() => {
    const storageKey = `quiz_${tutorialId}_${userId}`;
    const savedData = localStorage.getItem(storageKey);

    if (savedData) {
      try {
        const { questions, answers: savedAnswers, currentIndex, startTime: savedStartTime, timeoutQuestions: savedTimeout } = JSON.parse(savedData);
        setShuffledQuestions(questions || []);
        setAnswers(savedAnswers || {});
        setCurrentQuestionIndex(typeof currentIndex === 'number' ? currentIndex : 0);
        setStartTime(savedStartTime || new Date().toISOString());
        setTimeRemaining(durationPerQuestion);
        setTimeoutQuestions(new Set(savedTimeout || []));
        if (savedTimeout && savedTimeout.includes(currentIndex)) {
          setIsCurrentTimeUp(true);
        }
        console.log('Loaded quiz from localStorage:', storageKey);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        // fallback: start new session
        const selectedQuestions = shuffleQuestions(quiz.questions, totalSelectedQuestions);
        setShuffledQuestions(selectedQuestions);
        setStartTime(new Date().toISOString());
        setTimeRemaining(durationPerQuestion);
        setTimeoutQuestions(new Set());
        setIsCurrentTimeUp(false);
        console.log('New quiz session created (fallback)');
      }
    } else {
      const selectedQuestions = shuffleQuestions(quiz.questions, totalSelectedQuestions);
      setShuffledQuestions(selectedQuestions);
      setStartTime(new Date().toISOString());
      setTimeRemaining(durationPerQuestion);
      setTimeoutQuestions(new Set());
      setIsCurrentTimeUp(false);
      console.log('New quiz session created');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorialId, userId]);

  // Save ke localStorage
  useEffect(() => {
    if (shuffledQuestions.length > 0) {
      const storageKey = `quiz_${tutorialId}_${userId}`;
      const dataToSave = {
        questions: shuffledQuestions,
        answers,
        currentIndex: currentQuestionIndex,
        startTime,
        timeoutQuestions: Array.from(timeoutQuestions)
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [answers, currentQuestionIndex, shuffledQuestions, tutorialId, userId, startTime, timeoutQuestions]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const totalQuestions = shuffledQuestions.length;

  // Timer logic (functional updaters to avoid stale closures)
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;

    // ensure initial timer value when questions become available
    setTimeRemaining(prev => (typeof prev === 'number' && prev > 0 ? prev : durationPerQuestion));

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // mark timeout for this index
          setTimeoutQuestions(prevTimeout => {
            const next = new Set([...prevTimeout, currentQuestionIndex]);
            return next;
          });
          setIsCurrentTimeUp(true);

          // If there's a next question, advance using functional updater
          if (currentQuestionIndex < totalQuestions - 1) {
            // Use functional updater to avoid stale index
            setCurrentQuestionIndex(i => {
              const nextIndex = Math.min(i + 1, totalQuestions - 1);
              // Reset timer and UI for next question
              setTimeRemaining(durationPerQuestion);
              setShowFeedback(false);
              setSelectedAnswer(null);
              setIsCurrentTimeUp(false);
              // scroll will be handled by effect on currentQuestionIndex
              return nextIndex;
            });
            return 0;
          } else {
            // last question -> show review modal after small delay
            setTimeout(() => setShowReviewModal(true), 500);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, totalQuestions, durationPerQuestion, shuffledQuestions.length]);

  // Update selected answer / feedback when changing question
  useEffect(() => {
    if (!currentQuestion) return;

    const alreadyAnswered = answers[currentQuestionIndex];
    const isTimeout = timeoutQuestions.has(currentQuestionIndex);

    setSelectedAnswer(alreadyAnswered ?? null);

    if (alreadyAnswered !== undefined && alreadyAnswered !== null) {
      setShowFeedback(true);
      setIsCorrect(alreadyAnswered === currentQuestion.correctAnswer);
    } else {
      setShowFeedback(false);
      setIsCorrect(false);
    }

    setIsCurrentTimeUp(isTimeout);
  }, [currentQuestionIndex, answers, currentQuestion, timeoutQuestions]);

  // Scroll stage into view when currentQuestionIndex changes,
  // but skip scrolling when feedback is showing (feedback should be visible)
  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    if (!showFeedback) {
      // delay slightly so DOM renders the new question/card before scrolling
      const id = setTimeout(() => scrollToStage('.quiz-stage'), 80);
      return () => clearTimeout(id);
    }
    // if feedback is shown we do not auto-scroll away from it
    return;
  }, [currentQuestionIndex, showFeedback, shuffledQuestions.length]);

  // SCROLL TO FEEDBACK: when showFeedback true, scroll to feedback element
  useEffect(() => {
    if (!showFeedback) return;

    const id = setTimeout(() => {
      const el = document.querySelector('.feedback');
      if (!el) return;
      const HEADER_OFFSET = computeHeaderOffset();
      const STAGE_RAISE = computeStageRaise();
      const rect = el.getBoundingClientRect();
      const absoluteTop = window.scrollY + rect.top;
      const target = Math.max(absoluteTop - HEADER_OFFSET - STAGE_RAISE, 0);
      window.scrollTo({ top: target, behavior: 'smooth' });
      if (typeof el.focus === 'function') {
        try { el.setAttribute('tabindex', '-1'); el.focus(); } catch (e) { /* ignore */ }
      }
    }, 60);

    return () => clearTimeout(id);
  }, [showFeedback]);

  const handleAnswerSelect = useCallback((answer) => {
    if (!currentQuestion) return;

    if (timeoutQuestions.has(currentQuestionIndex)) {
      console.warn('Waktu soal ini sudah habis');
      return;
    }

    const alreadyAnswered = answers[currentQuestionIndex];
    if (alreadyAnswered !== undefined && alreadyAnswered !== null) {
      setShowFeedback(true);
      return;
    }

    setShowFeedback(true);
    const correct = answer === currentQuestion.correctAnswer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestionIndex]: answer
    }));
  }, [currentQuestion, currentQuestionIndex, answers, timeoutQuestions]);

  const handleNextQuestion = () => {
    const canGoNext = showFeedback || timeoutQuestions.has(currentQuestionIndex);
    if (currentQuestionIndex < totalQuestions - 1 && canGoNext) {
      // reset UI first then advance index using functional updater
      setTimeRemaining(durationPerQuestion);
      setShowFeedback(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(i => {
        const next = Math.min(i + 1, totalQuestions - 1);
        return next;
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setTimeRemaining(durationPerQuestion);
      setShowFeedback(false);
      setSelectedAnswer(null);
    }
  };

  const handleConfirmSubmit = useCallback(() => {
    let correctCount = 0;

    Object.keys(answers).forEach((idx) => {
      const questionIndex = parseInt(idx, 10);
      const userAnswer = answers[idx];
      const question = shuffledQuestions[questionIndex];

      if (question && userAnswer) {
        const isCorrectAnswer = userAnswer === question.correctAnswer;
        if (isCorrectAnswer) {
          correctCount++;
        }
      }
    });

    const storageKey = `quiz_${tutorialId}_${userId}`;
    localStorage.removeItem(storageKey);

    const navigationState = {
      score: correctCount,
      totalQuestions: totalQuestions,
      answers: answers,
      quiz: {
        ...quiz,
        questions: shuffledQuestions,
        totalQuestions: totalQuestions
      },
      startTime: startTime,
      tutorialId: tutorialId,
      userId: userId
    };

    setShowReviewModal(false);
    setTimeout(() => {
      navigate('/results', { state: navigationState });
    }, 100);
  }, [navigate, quiz, answers, shuffledQuestions, startTime, tutorialId, userId, totalQuestions]);

  const isWarning = timeRemaining < 10;
  const canGoBack = currentQuestionIndex > 0;
  const canGoForward = showFeedback || timeoutQuestions.has(currentQuestionIndex);

  if (!currentQuestion || shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen -translate-y-10  p-4 md:p-6 relative`}>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="quiz-stage">
          <QuizHeader
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            timeRemaining={timeRemaining}
            isWarning={isWarning}
            userId={userId}
            tutorialId={tutorialId}
          />

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 animate-slideUp quiz-card">
            <QuestionDisplay
              question={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />

            <AnswerOptions
              options={currentQuestion.answers}
              selectedAnswer={selectedAnswer}
              correctAnswer={currentQuestion.correctAnswer}
              showFeedback={showFeedback}
              onSelectAnswer={handleAnswerSelect}
              disabled={timeoutQuestions.has(currentQuestionIndex)}
            />

            {showFeedback && (
              <FeedbackDisplay
                isCorrect={isCorrect}
                explanation={currentQuestion.explanation}
                isTimeUp={false}
              />
            )}

            {isCurrentTimeUp && !showFeedback && (
              <div className="mt-8 p-6 rounded-xl border-l-4 bg-orange-50 border-orange-500">
                <p className="text-orange-700 font-semibold">
                  Waktu habis untuk soal ini.  Anda dapat melanjutkan ke soal berikutnya.
                </p>
              </div>
            )}

            <QuizNavigation
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onSubmit={() => setShowReviewModal(true)}
              currentQuestion={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
              canGoBack={canGoBack}
              canGoForward={canGoForward}
              selectedAnswer={selectedAnswer}
              showFeedback={showFeedback}
              isTimeUp={isCurrentTimeUp}
            />
          </div>
        </div>

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onConfirm={() => handleConfirmSubmit()}
          answers={answers}
          totalQuestions={totalQuestions}
        />
      </div>
    </div>
  );
};

export default QuizContainer;