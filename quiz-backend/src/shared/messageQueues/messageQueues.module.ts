import { Module } from "@nestjs/common";
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { REDIS } from "../constants/envs";

@Module({
  imports: [BullModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const redisConfig = configService.get(REDIS);
      console.log('REDIS', redisConfig)
      return {
        connection: redisConfig,
        defaultJobOptions: {
          attempts: 10,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: true,
          removeOnFail: true
        }
      };
    },
    inject: [ConfigService],
  })],
  exports: [BullModule]
})
export class MessageQueuesModule { }