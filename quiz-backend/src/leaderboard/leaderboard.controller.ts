import { Controller, Get, Param } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {

  }
  @Get(':quizId')
  getLeaderboard(@Param('quizId') quizId: number) {
    //Load Users who has record on redis by quizId
    return this.leaderboardService.getLeaderboard(quizId);
  }
}