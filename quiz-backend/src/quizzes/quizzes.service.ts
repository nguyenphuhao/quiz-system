import { QuizzesSessions } from '../shared/database/quizzesSessions/quizzesSessions.model';
import { InjectModel } from "@nestjs/sequelize";
import { Quizzes } from "../shared/database/quizzes/quizzes.model";
import { Inject, Injectable } from "@nestjs/common";
import { SingleChoiceQuestions } from "../shared/database/singleChoiceQuestions/singleChoiceQuestions.model";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { QuizSessionStatuses } from "../shared/constants/quizzes";
import { UserQuizSession, UserQuizSessionKey, UserQuizSessionSubmission } from "./quizzes.interface";
import { keyBy } from "lodash";
import { RankingProducer } from '../ranking/ranking.producer';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectModel(Quizzes) private readonly quizzesModel: typeof Quizzes,
    @InjectModel(QuizzesSessions) private readonly quizzesParticipants: typeof QuizzesSessions,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private rankingProducer: RankingProducer
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
      include: [{
        model: SingleChoiceQuestions,
        required: true
      }]
    });

    return quiz;
  }

  async getAllQuizzes() {
    const quizzes = await this.quizzesModel.findAll({
      nest: true,
      include: [{
        model: SingleChoiceQuestions,
        required: true
      }]
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
        include: [{
          model: SingleChoiceQuestions,
          required: true
        }]
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

    this.rankingProducer.emitRank({ quizId });

    return updatedSession
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
        include: [{
          model: SingleChoiceQuestions,
          required: true
        }]
      }]
    });
    return {
      ...userQuizSession,
      quizName: userQuizSession.quiz.title
    };
  }
}