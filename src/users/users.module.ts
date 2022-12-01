import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtStratege } from './strategy';

@Module({
  // xac dinh model nao duoc dang ky
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, JwtStratege],
  exports: [UsersService],
})
export class UsersModule {}
