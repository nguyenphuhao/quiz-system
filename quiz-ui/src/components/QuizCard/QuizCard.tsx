type Props = {
  quizId: number;
  quizName: string;
};
export const QuizCard = (props: Props) => {
  return (
    <a
      href={`/quizzes/join?quizId=${props.quizId}`}
      className="block max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        {props.quizName}
      </h5>
    </a>
  );
};
