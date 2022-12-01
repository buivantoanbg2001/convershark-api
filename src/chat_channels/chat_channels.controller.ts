import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import ResponseData from 'src/utils/response-data';
import { ChatChannelsService } from './chat_channels.service';
import { CreateChatChannelDto } from './dto/create-chat_channel.dto';
import { UpdateChatChannelDto } from './dto/update-chat_channel.dto';

@Controller('chat-channels')
@ApiTags('Chat channels')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
@UseGuards(AuthGuard('jwt'))
@Controller('chat-channels')
export class ChatChannelsController {
  constructor(private readonly chatChannelsService: ChatChannelsService) {}

  @ApiOperation({
    summary: 'Tạo chat channel',
    description: 'Tạo chat channel',
  })
  @ApiOkResponse({ description: 'Tạo chat channel thành công' })
  @ApiBadRequestResponse({ description: 'Tạo chat channel thất bại' })
  @Post()
  async create(
    @Req() request,
    @Body() createChatChannelDto: CreateChatChannelDto,
  ) {
    const { _id } = request.user;
    createChatChannelDto.hostId = _id;
    await this.chatChannelsService.create(createChatChannelDto);
    return new ResponseData(
      true,
      { message: 'Tạo chat channel thành công' },
      null,
    );
  }

  @ApiOperation({
    summary: 'Cập nhật chat channel',
    description: 'Cập nhật chat channel',
  })
  @ApiOkResponse({ description: 'Cập nhật chat channel thành công' })
  @ApiBadRequestResponse({ description: 'Cập nhật chat channel thất bại' })
  @Patch(':id')
  async update(
    @Req() request,
    @Param('id') id: string,
    @Body() updateChatChannelDto: UpdateChatChannelDto,
  ) {
    const { _id: hostId } = request.user;
    await this.chatChannelsService.update(id, hostId, updateChatChannelDto);
    return new ResponseData(
      true,
      { message: 'Cập nhật chat channel thành công' },
      null,
    );
  }

  @ApiOperation({
    summary: 'Xóa chat channel',
    description: 'Xóa chat channel',
  })
  @ApiOkResponse({ description: 'Xóa chat channel thành công' })
  @ApiBadRequestResponse({ description: 'Xóa chat channel thất bại' })
  @ApiNotFoundResponse({ description: "Can't find chat channel to delete" })
  @Delete(':id')
  async remove(@Req() request, @Param('id') chatChannelId: string) {
    const { _id: hostId } = request.user;
    await this.chatChannelsService.remove(chatChannelId, hostId);
    return new ResponseData(
      true,
      { message: 'Xóa chat channel thành công' },
      null,
    );
  }
}
