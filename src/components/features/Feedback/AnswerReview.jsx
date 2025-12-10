import React from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Card from "../../common/Card";

const AnswerReview = ({ answers = [], questions = [] }) => {
  if (!answers.length) {
    return <p className="text-center text-gray-500">Tidak ada detail jawaban.</p>;
  }

  return (
    <div className="space-y-3">
      {answers.map((answer, index) => {
        const question = questions[index];
        const isCorrect = !!answer.correct;
        const userAnswerText = answer.user_answer || answer.answer || "";
        return (
          <Card
            key={index}
            className={`flex flex-col sm:flex-row sm:items-start gap-3 p-4 border-l-4 ${
              isCorrect ? "border-l-green-500" : "border-l-red-500"
            } shadow-sm`}
            bordered
          >
            <div className="shrink-0">
              {isCorrect ? (
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              ) : (
                <XCircleIcon className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 mb-2">Q{index + 1}: {question?.assessment || "Pertanyaan"}</p>
              {!isCorrect && (
                <p className="text-sm text-red-600 mb-2">
                  Your answer: {userAnswerText || "(tidak tersedia)"}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AnswerReview;