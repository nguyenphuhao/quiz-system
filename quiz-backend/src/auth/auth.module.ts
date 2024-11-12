import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { CustomJwtModule } from './jwt.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../shared/database/users/users.model';

@Module({
  imports: [
    ConfigModule,
    CustomJwtModule,
    SequelizeModule.forFeature([Users])
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthAPIModule { }
