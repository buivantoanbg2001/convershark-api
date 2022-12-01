import { Test, TestingModule } from '@nestjs/testing';
import { CallChannelsController } from './call_channels.controller';
import { CallChannelsService } from './call_channels.service';

describe('CallChannelsController', () => {
  let controller: CallChannelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallChannelsController],
      providers: [CallChannelsService],
    }).compile();

    controller = module.get<CallChannelsController>(CallChannelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
