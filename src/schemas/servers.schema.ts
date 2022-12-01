import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { CallChannel } from './call_channels.schema';
import { ChatChannel } from './chat_channels.schema';
import { User } from './user.schema';

export type ServerDocument = Server & Document;

@Schema({ timestamps: true })
export class Server {
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({ required: true })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  hostId: string;

  @ApiProperty({ required: true })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ required: false })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  @Type(() => User)
  members: string[] = [];

  @ApiProperty({ required: false })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatChannel' }],
  })
  @Type(() => ChatChannel)
  chatChannels: string[] = [];

  @ApiProperty({ required: false })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CallChannel' }],
  })
  @Type(() => CallChannel)
  callChannels: string[] = [];
}
export const ServerSchema = SchemaFactory.createForClass(Server);
