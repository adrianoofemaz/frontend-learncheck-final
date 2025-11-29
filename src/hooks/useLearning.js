import { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within LearningProvider');
  }
  return context;
};

export default useLearning;