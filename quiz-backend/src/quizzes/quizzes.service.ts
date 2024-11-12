import { QuizzesSessions } from '../shared/database/quizzesSessions/quizzesSessions.model';
import { InjectModel } from "@nestjs/sequelize";
import { Quizzes } from "../shared/database/quizzes/quizzes.model";
import { Inject, Injectable } from "@nestjs/common";
import { SingleChoiceQuestions } from "../shared/database/singleChoiceQuestions/singleChoiceQuestions.model";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { QuizSessionStatuses } from "../shared/constants/quizzes";
import { UserQuizSession, UserQuizSessionKey, UserQuizSessionSubmission } from "./quizzes.interface";
import { keyBy, round } from "lodash";

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quizzes) private readonly quizzesModel: typeof Quizzes,
    @InjectModel(QuizzesSessions) private readonly quizzesParticipants: typeof QuizzesSessions,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private getUserQuizSessionKey(payload: {
    quizId: number;
    userId: number;
  }) {
    const { quizId, userId } = payload;
    return `quiz-${quizId}-user-${userId}`;
  }

  async getUserQuizSession(payload: UserQuizSessionKey): Promise<UserQuizSession> {
    const userQuizKey = this.getUserQuizSessionKey(payload)
    const cacheQuizSession = await this.cacheManager.get<string>(userQuizKey);
    if (cacheQuizSession) {
      return JSON.parse(cacheQuizSession);
    }
  }
  async getQuizById(quizId: number) {
    const quiz = await this.quizzesModel.findOne({
      nest: true,
      where: {
        id: quizId
      },
      include: [SingleChoiceQuestions]
    });

    return quiz;
  }

  async getAllQuizzes() {
    const quizzes = await this.quizzesModel.findAll({
      nest: true,
      include: [SingleChoiceQuestions]
    });

    return quizzes;
  }

  async joinQuiz(payload: UserQuizSessionKey & { nickName: string }) {
    const { quizId, userId, nickName } = payload;
    const quiz = await this.getQuizById(quizId);
    if (!quiz) {
      throw new Error(`Quiz not found`);
    }

    //Add participant
    const createdSession = await this.quizzesParticipants.findOrCreate({
      where: {
        quizId,
        userId,
        status: QuizSessionStatuses.IN_PROGRESS
      },
      defaults: {
        quizId,
        userId,
        nickName,
        totalQuestions: quiz.singleChoiceQuestions.length,
        totalCorrectAnswers: 0,
        status: QuizSessionStatuses.IN_PROGRESS,
      }
    });
    // await this.cacheManager.set(this.getUserQuizSessionKey({ quizId, userId }), JSON.stringify(joinSession));
    return createdSession;
  }

  async scoring(payload: UserQuizSessionSubmission) {
    const { quizId, userId, answers = [] } = payload;
    const userQuizSession = await this.quizzesParticipants.findOne({
      where: {
        quizId, userId, status: QuizSessionStatuses.IN_PROGRESS
      },
      include: [{
        model: Quizzes,
        include: [SingleChoiceQuestions]
      }]
    });
    if (!userQuizSession) {
      throw new Error('Invalid Quiz Session');
    }

    if (!answers.length) {
      throw new Error('No answer provided')
    }

    const singleChoiceQuestions = userQuizSession.quiz?.singleChoiceQuestions;
    const quizQuestionsMap = keyBy(singleChoiceQuestions, (q) => [q.id]);
    const totalCorrectAnswers = answers.reduce((correctAnswerCount, item) => {
      const questionAndAnswer = quizQuestionsMap[item.questionId] as any;
      if (questionAndAnswer?.correctAnswer === item.answer) {
        correctAnswerCount++;
      }
      return correctAnswerCount;
    }, 0)


    const [updatedCount, updatedSessions] = await this.quizzesParticipants.update({
      status: QuizSessionStatuses.COMPLETED,
      totalCorrectAnswers,
    }, {
      where: {
        quizId,
        userId,
        status: QuizSessionStatuses.IN_PROGRESS
      },
      returning: true
    });
    if (updatedCount <= 0) {
      throw new Error('Unable to score the quiz')
    }
    const updatedSession = updatedSessions[0].get({ plain: true });

    const leaderboardKey = `leaderboard-${quizId}`;
    const leaderboard = await this.quizzesParticipants.findAll({
      raw: true,
      nest: true,
      where: {
        quizId,
        status: QuizSessionStatuses.COMPLETED
      },
      order: [
        ['totalCorrectAnswers', 'DESC'],
        ['createdAt', 'ASC']
      ]
    })
    if (leaderboard) {
      await this.cacheManager.set(leaderboardKey, JSON.stringify({
        quizId,
        quizName: userQuizSession.quiz?.title,
        totalQuestions: userQuizSession.quiz?.singleChoiceQuestions?.length,
        participants: leaderboard
      }))
    }

    return {
      ...updatedSession,
    };
  }

  async getQuizResult(payload: UserQuizSessionKey) {
    const { quizId, userId } = payload;
    const userQuizSession = await this.quizzesParticipants.findOne({
      raw: true,
      nest: true,
      where: {
        quizId,
        userId,
        status: QuizSessionStatuses.COMPLETED
      },
      order: [
        ['createdAt', 'desc']
      ],
      include: [{
        model: Quizzes,
        include: [SingleChoiceQuestions]
      }]
    });
    return {
      ...userQuizSession,
      quizName: userQuizSession.quiz.title
    };
  }
}