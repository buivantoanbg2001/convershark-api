import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Server } from './servers.schema';

import {} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export type UserDocument = User & Document;

export class ShortUserInfo {
  _id: string;
  _uid: string;
  name: string;
  avatar: string;
  wallpaper: string;
  status: string;
  bio: string;
}

@Schema({ timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  _uid: string; // nguyenvantu#1234

  @ApiProperty({ required: true })
  @Prop({ default: 'nonome' })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @ApiProperty({ required: true })
  @Prop({ unique: true, required: true })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: false })
  @Prop({ required: false })
  hashedPassword?: string;

  @ApiProperty({ required: false })
  @Prop({ default: 'Online' })
  status: 'Online' | 'Offline';

  @ApiProperty({ required: false })
  @Prop({ default: 'link image' })
  wallpaper: string;

  @ApiProperty({ required: false })
  @Prop({ default: 'link image' })
  avatar: string;

  @ApiProperty({ required: false })
  @Prop({ default: '' })
  bio: string;

  @ApiProperty({ required: false })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Server' }],
  })
  @Type(() => Server)
  servers?: string[] = [];

  @ApiProperty({ required: false })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  @Type(() => User)
  friends?: string[] = [];
}
export const UserSchema = SchemaFactory.createForClass(User);
