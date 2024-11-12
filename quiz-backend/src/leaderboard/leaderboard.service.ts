import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { UserQuizSession } from "../quizzes/quizzes.interface";
import { orderBy } from "lodash";

@Injectable()
export class LeaderboardService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {

  }

  async getLeaderboard(quizId: number) {
    const cacheKey = `leaderboard-${quizId}`;
    const leaderboardString = await this.cacheManager.get<string>(cacheKey);
    if (leaderboardString) {
      const leaderboard = JSON.parse(leaderboardString)
      return leaderboard;
    }
    return [];
  }
}