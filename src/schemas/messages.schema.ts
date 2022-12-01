import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  // auto gen
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ required: true })
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  ownerId: string;

  @ApiProperty({ required: true })
  @Prop()
  content: string;

  @ApiProperty({ required: false })
  @Prop({ type: mongoose.Types.ObjectId, ref: 'Message' })
  @Type(() => Message)
  replyMessageId: string;
}
export const MessageSchema = SchemaFactory.createForClass(Message);
