import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId, Document } from 'mongoose';
import { CallChannel } from './call_channels.schema';
import { ChatChannel } from './chat_channels.schema';
import { Server } from './servers.schema';
import { User } from './user.schema';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  sender: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  @Type(() => User)
  receiver: string;

  @Prop({ required: true })
  type: 'FRIEND' | 'MEMBER' | 'MESSAGE';

  @Prop({ required: false, default: false })
  isResponse: boolean;

  @Prop({ required: false, default: false })
  isAccept: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Server' })
  @Type(() => Server)
  serverId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'ChatChannel' })
  @Type(() => ChatChannel)
  chatId: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'CallChannel' })
  @Type(() => CallChannel)
  callId: string;

  @Prop({ required: true })
  content: string;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
