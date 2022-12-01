import { ApiProperty } from '@nestjs/swagger';

export class UpdateCallChannelDto {
  @ApiProperty({ required: false })
  members?: string[];

  @ApiProperty({ required: false })
  hostId?: string;
}
