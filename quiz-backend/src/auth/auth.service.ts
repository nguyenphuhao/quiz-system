import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { JWT } from '../shared/constants/envs';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from '../shared/database/users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectModel(Users)
    private readonly usersModel: typeof Users
  ) { }

  async signIn(username: string, password: string) {
    const user = await this.usersModel.findOne({
      where: {
        username
      }
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    // By pass check password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException();
    // }
    const payload = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      sub: user.id
    };
    const jwtConfig = this.configService.get(JWT);
    const accessToken = this.jwtService.sign(payload, { secret: jwtConfig.secret });
    return {
      accessToken
    };
  }
}
