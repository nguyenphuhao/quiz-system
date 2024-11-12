import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { REDIS } from "../constants/envs";
import { CacheModule, CACHE_MANAGER } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-yet";

@Global()
@Module({
  imports: [CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const redisConfig = configService.get(REDIS);
      console.log('REDIS', redisConfig)
      const store = await redisStore({
        socket: redisConfig
      })
      return {
        store,
        ttl: 0
      };
    },
    inject: [ConfigService],
  })],
  exports: [CacheModule]
})
export class CachingModule { }