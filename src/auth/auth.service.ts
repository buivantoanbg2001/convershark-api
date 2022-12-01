import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { gen_user_id } from 'src/utils/func.backup';
import { AuthUserDto } from '../auth/dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signJwtToken(
    _id: string,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: _id,
      email,
    };

    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.EXPIRES_IN,
      secret: process.env.JWT_SECRET,
    });

    return {
      accessToken: jwtString,
    };
  }

  async login(authUserDto: AuthUserDto): Promise<Object> {
    const user = await this.userModel
      .findOne({ email: authUserDto.email })
      .lean();

    if (!user) {
      throw new ForbiddenException('User with this email does not exist');
    }

    const matchedPassword = await bcrypt.compare(
      authUserDto.password,
      user.hashedPassword,
    );

    if (!matchedPassword) {
      throw new ForbiddenException('Password does not match');
    }

    return this.signJwtToken(user._id, user.email);
  }

  async register(authUserDto: AuthUserDto): Promise<Object> {
    try {
      const user = new this.userModel(authUserDto);

      // gen and store hashedPassword
      const satlOrRounds = 10;
      user.hashedPassword = await bcrypt.hash(
        authUserDto.password,
        satlOrRounds,
      );

      // create new uid
      let uid = gen_user_id(user.name);
      // if duplication, create new uid
      while (await this.userModel.findOne({ _uid: uid })) {
        uid = gen_user_id(user.name);
      }
      user._uid = uid;

      await user.save();

      return this.signJwtToken(user._id, user.email);
    } catch (err) {
      if (err.code == 11000) {
        throw new ForbiddenException('User with this email already exists');
      } else throw err.code;
    }
  }
}
