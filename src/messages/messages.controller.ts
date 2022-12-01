import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Message } from 'src/schemas/messages.schema';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import ResponseData from 'src/utils/response-data';

@ApiTags('Tin nhắn')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
@UseGuards(AuthGuard('jwt'))
@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOperation({
    summary: 'Thêm một tin nhắn mới',
    description: 'Thêm một tin nhắn mới',
  })
  @ApiOkResponse({ description: 'Thêm một tin nhắn mới thành công' })
  @ApiBadRequestResponse({ description: 'Thêm một tin nhắn mới thất bại' })
  @Post('messages')
  async createNewMessage(
    @Req() req,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const { _id } = req.user;
    createMessageDto.ownerId = _id;
    const message = this.messagesService.create(createMessageDto);
    return message;
  }

  @ApiOperation({
    summary: 'Chủ sở hữu chỉnh sửa và cập nhật nội dung tin nhắn',
    description: 'Chủ sở hữu chỉnh sửa và cập nhật nội dung tin nhắn theo ID',
  })
  @ApiOkResponse({
    description: 'Cập nhật tin nhắn thành công',
  })
  @ApiBadRequestResponse({
    description: 'Cập nhật tin nhắn thất bại',
  })
  @Patch('messages/:id')
  async updateContentMessage(
    @Param('id') mesId: string,
    @Req() req,
    @Body() updateMesageDto: UpdateMessageDto,
  ) {
    // get the Id of user who request edit content
    const { _id } = req.user;
    await this.messagesService.update(mesId, _id, updateMesageDto);
    return new ResponseData(
      true,
      { message: 'Cập nhật nội dung tin nhắn thành công' },
      null,
    );
  }

  @ApiOperation({
    summary: 'Chủ sở hữu xóa tin nhắn theo ID',
    description: 'Chủ sở hữu xóa tin nhắn theo ID',
  })
  @ApiOkResponse({
    description: 'Chủ sở hữu xóa tin nhắn thành công',
  })
  @ApiBadRequestResponse({
    description: 'Xóa tin nhắn thất bại',
  })
  @Delete('messages/:id')
  async remove(@Param('id') mesId: string, @Req() req) {
    const { _id } = req.user;
    await this.messagesService.remove(mesId, _id);
    return new ResponseData(true, { message: 'Xóa tin nhắn thành công' }, null);
  }
}
