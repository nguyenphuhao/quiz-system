type Props = {
  quizId: string;
  quizName: string;
  totalCorrectAnswers: number;
  totalQuestions: number;
};
export const QuizResult = (props: Props) => {
  return (
    <section className="bg-white dark:bg-gray-900 max-h-full">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight leading-none text-gray-900 dark:text-white">
          Congrats, you have finished
        </h1>
        <p className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 dark:text-white">
          {props.quizName}
        </p>
        <p className="mb-8 text-xl font-semibold text-gray-500 sm:px-16 lg:px-48 dark:text-gray-400">
          Your result: {props.totalCorrectAnswers}/{props.totalQuestions}
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
          <a
            href={`/leaderboard?quizId=${props.quizId}`}
            className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
          >
            Go to Leaderboard
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
