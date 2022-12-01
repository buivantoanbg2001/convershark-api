import { Test, TestingModule } from '@nestjs/testing';
import { CallChannelsService } from './call_channels.service';

describe('CallChannelsService', () => {
  let service: CallChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CallChannelsService],
    }).compile();

    service = module.get<CallChannelsService>(CallChannelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
