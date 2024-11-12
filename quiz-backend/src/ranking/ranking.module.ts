import { Module } from "@nestjs/common";
import { CachingModule } from "../shared/caching/caching.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { Quizzes } from "../shared/database/quizzes/quizzes.model";
import { QuizzesQuestions } from "../shared/database/quizzesQuestions/quizzesQuestions.model";
import { QuizzesSessions } from "../shared/database/quizzesSessions/quizzesSessions.model";
import { RankingConsumer } from "./ranking.consumer";
import { QUIZ_RANKING } from "../shared/messageQueues/queues";
import { BullModule } from "@nestjs/bullmq";
import { RankingProducer } from "./ranking.producer";

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUIZ_RANKING,
    }),
    CachingModule,
    SequelizeModule.forFeature([Quizzes, QuizzesQuestions, QuizzesSessions])],
  providers: [RankingConsumer, RankingProducer],
  exports: [RankingProducer]
})
export class RankingModule { }