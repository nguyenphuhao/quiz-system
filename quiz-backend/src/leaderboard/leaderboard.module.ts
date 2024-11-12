import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { CachingModule } from '../shared/caching/caching.module';

@Module({
  imports: [CachingModule],
  providers: [LeaderboardService],
  controllers: [LeaderboardController]
})
export class LeaderboardModule { }
