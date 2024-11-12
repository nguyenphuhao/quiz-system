import { Global, Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DB } from "../constants/envs";
import { Quizzes } from "./quizzes/quizzes.model";
import { SingleChoiceQuestions } from "./singleChoiceQuestions/singleChoiceQuestions.model";
import { Users } from "./users/users.model";
import { QuizzesQuestions } from "./quizzesQuestions/quizzesQuestions.model";
import { QuizzesSessions } from "./quizzesSessions/quizzesSessions.model";

@Global()
@Module({
  imports: [SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const dbConfig = configService.get(DB);
      console.log('config', dbConfig)
      return {
        ...dbConfig,
        dialect: 'postgres',
        autoLoadModels: true,
        synchronize: true,
        models: [Quizzes, SingleChoiceQuestions, QuizzesQuestions, Users, QuizzesSessions]
      }
    },
    inject: [ConfigService],
  })],
  exports: [SequelizeModule]
})
export class DatabaseModule { }