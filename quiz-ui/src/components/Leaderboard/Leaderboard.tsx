import { v4 as uuidv4 } from "uuid";
type Props = {
  quizName: number;
  totalQuestions: number;
  participants: {
    nickName: string;
    totalCorrectAnswers: number;
    userId: number;
  }[];
};
export const Leaderboard = (props: Props) => {
  const { quizName, totalQuestions, participants = [] } = props;
  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          {quizName}
        </h5>
        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
          {" "}
          <span className="font-bold">
            {participants.length} participant(s)
          </span>
        </span>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {participants.length &&
            participants.map((p) => (
              <li key={uuidv4()} className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                      {p.nickName}
                      <br />
                      <span className="text-xs font-thin italic">
                        User Id: {p.userId}
                      </span>
                    </p>
                  </div>
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400"></p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {p.totalCorrectAnswers} / {totalQuestions}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
