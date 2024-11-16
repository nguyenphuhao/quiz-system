import { Module } from "@nestjs/common";
import { LeaderboardModule } from "./leaderboard.module";
import { LeaderboardGateway } from "./leaderboard.gateway";

@Module({
  imports: [LeaderboardModule],
  providers: [LeaderboardGateway],
})
export class LeaderboardGatewayModule { }