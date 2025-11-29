import React from 'react';
import AnswerButton from './AnswerButton';

const AnswerOptions = ({
  options,
  selectedAnswer,
  correctAnswer,
  showFeedback,
  onSelectAnswer,
  disabled
}) => {
  return (
    <div className="space-y-3 my-6">
      {options && options.map((option, index) => (
        <AnswerButton
          key={index}
          answer={option}
          isSelected={selectedAnswer === option}
          isCorrect={option === correctAnswer}
          showFeedback={showFeedback}
          disabled={disabled}
          onClick={() => ! disabled && ! showFeedback && onSelectAnswer(option)}
        />
      ))}
    </div>
  );
};

export default AnswerOptions;