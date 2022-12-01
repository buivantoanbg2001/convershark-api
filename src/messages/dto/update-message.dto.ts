import { PartialType } from '@nestjs/mapped-types';
import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class UpdateMessageDto {
  @ApiProperty({ required: true, default: 'newMessage' })
  @Prop({ required: true, default: '***' })
  content?: string;
}
