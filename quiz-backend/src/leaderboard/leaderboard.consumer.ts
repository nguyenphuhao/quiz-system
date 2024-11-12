import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Inject, Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";
import { QUIZ_RANKING } from "../shared/messageQueues/queues";
import { InjectModel } from "@nestjs/sequelize";
import { QuizzesSessions } from "../shared/database/quizzesSessions/quizzesSessions.model";
import { QuizSessionStatuses } from "../shared/constants/quizzes";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Quizzes } from "../shared/database/quizzes/quizzes.model";
import { SingleChoiceQuestions } from "../shared/database/singleChoiceQuestions/singleChoiceQuestions.model";

@Processor(QUIZ_RANKING)
export class LeaderboardConsumer extends WorkerHost {
  constructor(
    @InjectModel(Quizzes) private readonly quizzesModel: typeof Quizzes,
    @InjectModel(QuizzesSessions) private readonly quizzesParticipants: typeof QuizzesSessions,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const { quizId } = job.data;
    //broadcast to web socket
    const leaderboardKey = `leaderboard-${quizId}`;
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
    const participants = await this.quizzesParticipants.findAll({
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
    if (participants) {
      await this.cacheManager.set(leaderboardKey, JSON.stringify({
        quizId,
        quizName: quiz?.title,
        totalQuestions: quiz?.singleChoiceQuestions?.length,
        participants
      }));
    }
  }
}