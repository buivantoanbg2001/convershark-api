import { ApiProperty } from '@nestjs/swagger';

export class UpdateServerDto {
  @ApiProperty({ required: false })
  members?: string[];

  @ApiProperty({ required: false })
  chatChannels?: string[];

  @ApiProperty({ required: false })
  callChannels?: string[];
}
