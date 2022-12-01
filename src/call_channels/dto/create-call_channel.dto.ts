import { ApiProperty } from '@nestjs/swagger';

export class CreateCallChannelDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  hostId?: string;

  @ApiProperty({ required: false })
  serverId?: string;
}
