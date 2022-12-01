import { ApiProperty } from '@nestjs/swagger';

export class CreateServerDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  hostId?: string;
}
