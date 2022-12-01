import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import mongoose, { ObjectId, Document } from 'mongoose';

export type CallChannelDocument = CallChannel & Document;

@Schema({ timestamps: true })
export class CallChannel {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @ApiProperty({ required: true })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  hostId: string;

  @ApiProperty({ required: true })
  @Prop()
  name: string;

  @ApiProperty({ required: false })
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
  members: string[] = [];
}
export const CallChannelSchema = SchemaFactory.createForClass(CallChannel);
