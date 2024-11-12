import { InjectQueue, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Job, Queue } from "bullmq";

@Injectable()
export class LeaderboardConsumer extends WorkerHost {
  process(job: Job, token?: string): Promise<any> {
    //broadcast to web socket
    return;
  }
}