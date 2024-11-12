import { InjectQueue, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";

@Injectable()
export class ScoreConsumer extends WorkerHost {
  process(job: Job, token?: string): Promise<any> {
    //Calculate score - get quiz and answer for the question from db
    //sync score to redis session
    //add to leaderboard.sync queue
    return;
  }
}