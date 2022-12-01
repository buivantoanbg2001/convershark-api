import { ApiProperty } from '@nestjs/swagger';

export class UpdateChatChannelDto {
  @ApiProperty({ required: false })
  members?: string[];

  @ApiProperty({ required: false })
  hostId?: string;
}
