import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ required: false })
  ownerId?: string;

  @ApiProperty({ required: true })
  content: string;

  @ApiProperty({ required: false })
  replyMessageId?: string; // message_id
}
