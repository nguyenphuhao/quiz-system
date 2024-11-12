import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { CachingModule } from '../shared/caching/caching.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quizzes } from '../shared/database/quizzes/quizzes.model';
import { QuizzesQuestions } from '../shared/database/quizzesQuestions/quizzesQuestions.model';
import { QuizzesSessions } from '../shared/database/quizzesSessions/quizzesSessions.model';

@Module({
  imports: [CachingModule, SequelizeModule.forFeature([Quizzes, QuizzesQuestions, QuizzesSessions])],
  providers: [LeaderboardService],
  controllers: [LeaderboardController]
})
export class LeaderboardModule { }
