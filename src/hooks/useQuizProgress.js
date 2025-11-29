import { useContext } from 'react';
import { QuizContext } from '../context/QuizContext';

export const useQuizProgress = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizProgress must be used within QuizProvider');
  }
  return context;
};

export default useQuizProgress;