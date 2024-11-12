import { MiddlewareConsumer, Module } from "@nestjs/common";
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { REDIS } from "../constants/envs";
import { ExpressAdapter } from "@bull-board/express";
import queues from './queues';
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api";

@Module({
  imports: [BullModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const redisConfig = configService.get(REDIS);
      return {
        connection: redisConfig,
        defaultJobOptions: {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: false,
          removeOnFail: true
        }
      };
    },
    inject: [ConfigService],
  })],
})
export class MessageQueuesModule {
  private redisConfig: any;
  constructor(private readonly configService: ConfigService) {
    this.redisConfig = configService.get(REDIS);
  }
  configure(consumer: MiddlewareConsumer) {
    const basePath = '/admin/queues';
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath(basePath);

    const bullMQAdapters = queues.map((queue) => {
      return new BullMQAdapter(new Queue(queue, { connection: this.redisConfig }));
    });

    createBullBoard({
      queues: bullMQAdapters,
      serverAdapter,
    });

    consumer.apply(serverAdapter.getRouter()).forRoutes(basePath);
  }
}