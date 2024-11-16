import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizzesModule } from './quizzes/quizzes.module';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import loadEnvs from './loadEnvs';
import { MessageQueuesModule } from './shared/messageQueues/messageQueues.module';
import { DatabaseModule } from './shared/database/database.module';
import { QUIZ_RANKING } from './shared/messageQueues/queues';
import { CachingModule } from './shared/caching/caching.module';
import { AuthAPIModule } from './auth/auth.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { RankingModule } from './ranking/ranking.module';
import { LeaderboardGatewayModule } from './leaderboard/leaderboardgw.module';

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
    BullBoardModule,
    AuthAPIModule,
    QuizzesModule,
    LeaderboardModule,
    LeaderboardGatewayModule,
    RankingModule

  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }, AppService],
})
export class AppModule { }
