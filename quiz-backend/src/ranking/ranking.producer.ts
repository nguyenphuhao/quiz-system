import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { QUIZ_RANKING } from "../shared/messageQueues/queues";
import { RankingJobData } from "./ranking.interface";

@Injectable()
export class RankingProducer {
  constructor(
    @InjectQueue(QUIZ_RANKING) private rankingQueue: Queue
  ) { }

  emitRank(jobData: RankingJobData) {
    return this.rankingQueue.add('rank-quiz-' + jobData.quizId, jobData)
  }
}