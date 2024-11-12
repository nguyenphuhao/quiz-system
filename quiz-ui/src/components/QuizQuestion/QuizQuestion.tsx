import { useState } from "react";

type QuizQuestionProps = {
  questionNumber: number;
  question: string;
  answers: string[];
  onSelect: (questionNumber: number, answer: string) => void;
};
export const QuizQuestion = ({
  questionNumber,
  question,
  answers,
  onSelect,
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const handleSelect = (questionNumber: number, answer: string) => {
    setSelectedAnswer(answer);
    onSelect(questionNumber, answer);
  };

  return (
    <div className="mb-3">
      <div className="m-3 text-2xl">
        {questionNumber}. {question}
      </div>
      {answers.length &&
        answers.map((answer) => (
          <div
            key={`${questionNumber}-${answer}`}
            onClick={() => handleSelect(questionNumber, answer)}
            className={`flex items-center mb-4 block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-blue-100 ${
              answer === selectedAnswer
                ? "dark:bg-blue-700"
                : "dark:bg-gray-800"
            } dark:border-gray-700 dark:hover:bg-blue-700`}
          >
            <input
              checked={answer === selectedAnswer}
              onChange={() => handleSelect(questionNumber, answer)}
              type="radio"
              name={`question-${questionNumber}`}
              className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-radio-1"
              className="ms-2 text-lg font-medium text-gray-900 dark:text-gray-300 "
            >
              <h5 className="p-1 font-bold tracking-tight">{answer}</h5>
            </label>
          </div>
        ))}
    </div>
  );
};
