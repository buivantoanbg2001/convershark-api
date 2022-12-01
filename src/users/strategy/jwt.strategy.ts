import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/schemas/user.schema';
import { UsersService } from '../users.service';

@Injectable()
export class JwtStratege extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || process.env.JWT_KEY,
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.getFullUserInfoById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    const { hashedPassword, ...userWithoutPassWord } = user;
    return userWithoutPassWord;
  }
}
