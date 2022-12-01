import { Module } from '@nestjs/common';
import { CallChannelsService } from './call_channels.service';
import { CallChannelsController } from './call_channels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CallChannel,
  CallChannelSchema,
} from 'src/schemas/call_channels.schema';
import { ServersModule } from 'src/servers/servers.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CallChannel.name, schema: CallChannelSchema },
    ]),
    ServersModule,
  ],
  controllers: [CallChannelsController],
  providers: [CallChannelsService],
})
export class CallChannelsModule {}
