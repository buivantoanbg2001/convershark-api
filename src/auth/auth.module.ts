import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { JwtStratege } from 'src/users/strategy';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Module({
  // xac dinh model nao duoc dang ky
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService, JwtService, JwtStratege],
  exports: [AuthService],
})
export class AuthModule {}
