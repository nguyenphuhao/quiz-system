import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { LeaderboardService } from "./leaderboard.service";

@WebSocketGateway(4000, {
  cors: {
    origin: '*'
  }
})
export class LeaderboardGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly leaderboardService: LeaderboardService) {

  }

  @SubscribeMessage('leaderboard.update')
  async onScoreChanged(client: Socket, quizId: number) {
    const leaderboard = await this.leaderboardService.getLeaderboard(quizId);
    this.server.emit('leaderboard.changed', leaderboard);
  }
}
