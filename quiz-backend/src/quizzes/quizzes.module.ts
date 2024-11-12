import { Module } from '@nestjs/common';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';
import { CachingModule } from '../shared/caching/caching.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Quizzes } from '../shared/database/quizzes/quizzes.model';
import { QuizzesQuestions } from '../shared/database/quizzesQuestions/quizzesQuestions.model';
import { SingleChoiceQuestions } from '../shared/database/singleChoiceQuestions/singleChoiceQuestions.model';
import { QuizzesSessions } from '../shared/database/quizzesSessions/quizzesSessions.model';

@Module({
  imports: [CachingModule, SequelizeModule.forFeature([Quizzes, QuizzesQuestions, QuizzesSessions])],
  providers: [QuizzesService],
  controllers: [QuizzesController]
})
export class QuizzesModule { }
