import { QuizSessionStatuses } from "../shared/constants/quizzes";

export interface UserQuizSessionKey {
  quizId: number;
  userId: number;
}

export interface UserQuizSession extends UserQuizSessionKey {
  totalCorrectAnswers: number;
  totalQuestions: number;
  status: QuizSessionStatuses;
  createdAt: Date;
}

export interface UserQuizAnswer {
  questionId: number;
  answer: string
}
export interface UserQuizSessionSubmission extends UserQuizSessionKey {
  answers: UserQuizAnswer[];
}