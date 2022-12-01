import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  _uid?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ default: null, required: false })
  phone?: string;

  @ApiProperty({ required: false })
  pwd?: string;

  @ApiProperty({ default: null, required: false })
  status?: string;

  @ApiProperty({ default: null, required: false })
  wallpaper?: string;

  @ApiProperty({ default: null, required: false })
  avatar?: string;

  @ApiProperty({ default: null, required: false })
  bio?: string;

  @ApiProperty({ default: null, required: false })
  servers?: string[] = [];

  @ApiProperty({ default: null, required: false })
  friends?: string[] = [];
}
