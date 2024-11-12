import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JWT } from "../shared/constants/envs";

@Module({
  imports: [JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => configService.get(JWT),
    inject: [ConfigService],
  })],
  exports: [JwtModule]
})
export class CustomJwtModule { }
