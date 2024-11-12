import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import loadEnvs from './loadEnvs';
import { MessageQueuesModule } from './shared/messageQueues/messageQueues.module';
import { DatabaseModule } from './shared/database/database.module';
import { QUIZ_RANKING } from './shared/constants/queues';
import { CachingModule } from './shared/caching/caching.module';
import { AuthAPIModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [loadEnvs],
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env.dev'],
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),

    DatabaseModule,
    CachingModule,
    MessageQueuesModule,
    BullModule.registerQueue({
      name: QUIZ_RANKING,
    }),
    // BullModule.registerQueue({
    //   name: LEADERBOARD_SYNC,
    // }),
    AuthAPIModule,
    QuizzesModule,
    LeaderboardModule,

  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }, AppService],
})
export class AppModule { }
