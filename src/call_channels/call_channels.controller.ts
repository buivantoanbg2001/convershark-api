import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
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
import { CallChannelsService } from './call_channels.service';
import { CreateCallChannelDto } from './dto/create-call_channel.dto';
import { UpdateCallChannelDto } from './dto/update-call_channel.dto';

@ApiTags('Call channels')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
@UseGuards(AuthGuard('jwt'))
@Controller('call-channels')
export class CallChannelsController {
  constructor(private readonly callChannelsService: CallChannelsService) {}

  @ApiOperation({
    summary: 'Tạo call channel',
    description: 'Tạo call channel',
  })
  @ApiOkResponse({ description: 'Tạo call channel thành công' })
  @ApiBadRequestResponse({ description: 'Tạo call channel thất bại' })
  @Post()
  async create(
    @Req() request,
    @Body() createCallChannelDto: CreateCallChannelDto,
  ) {
    const { _id } = request.user;
    createCallChannelDto.hostId = _id;
    await this.callChannelsService.create(createCallChannelDto);
    return new ResponseData(
      true,
      { message: 'Tạo call channel thành công' },
      null,
    );
  }

  @ApiOperation({
    summary: 'Cập nhật call channel',
    description: 'Cập nhật call channel',
  })
  @ApiOkResponse({ description: 'Cập nhật call channel thành công' })
  @ApiBadRequestResponse({ description: 'Cập nhật call channel thất bại' })
  @Patch(':id')
  async update(
    @Req() request,
    @Param('id') id: string,
    @Body() updateCallChannelDto: UpdateCallChannelDto,
  ) {
    const { _id: hostId } = request.user;
    await this.callChannelsService.update(id, hostId, updateCallChannelDto);
    return new ResponseData(
      true,
      { message: 'Cập nhật call channel thành công' },
      null,
    );
  }

  @ApiOperation({
    summary: 'Xóa call channel',
    description: 'Xóa call channel',
  })
  @ApiOkResponse({ description: 'Xóa call channel thành công' })
  @ApiBadRequestResponse({ description: 'Xóa call channel thất bại' })
  @ApiNotFoundResponse({ description: "Can't find call channel to delete" })
  @Delete(':id')
  async remove(@Req() request, @Param('id') callChannelId: string) {
    const { _id: hostId } = request.user;
    await this.callChannelsService.remove(callChannelId, hostId);
    return new ResponseData(
      true,
      { message: 'Xóa call channel thành công' },
      null,
    );
  }
}
