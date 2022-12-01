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
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import ResponseData from 'src/utils/response-data';

@ApiTags('Thông báo')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({
    summary: 'Tạo một thông mới',
    description: 'Tạo một thông báo mới',
  })
  @ApiOkResponse({ description: 'Tạo một thông báo mới thành công' })
  @ApiBadRequestResponse({ description: 'Tạo một thông báo mới thất bại' })
  @Post()
  async create(
    @Req() req,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const { _id } = req.user;
    createNotificationDto.sender = _id;
    const notification = await this.notificationsService.create(
      createNotificationDto,
    );
    return notification;
  }

  @ApiOperation({
    summary: 'Lấy ra tất cả thông báo của người dùng',
    description: 'Lấy ra tất cả thông báo của người dùng',
  })
  @ApiOkResponse({
    description: 'Lấy ra tất cả thông báo của người dùng thành công',
  })
  @ApiBadRequestResponse({
    description: 'Lấy ra tất cả thông báo của người dùng thất bại',
  })
  @Get()
  async getAllForReceiver(@Req() req) {
    const { _id } = req.user;
    return await this.notificationsService.findAllForReceiver(_id.toString());
  }

  @ApiOperation({
    summary: 'Tìm kiếm và lấy ra một thông báo theo ID, có xác thực người nhận',
    description:
      'Tìm kiếm và lấy ra một thông báo theo ID, có xác thực người nhận',
  })
  @ApiOkResponse({
    description:
      'Thành công lấy ra một thông báo theo ID, có xác thực người nhận',
  })
  @ApiBadRequestResponse({
    description: 'Lỗi khi lấy ra một thông báo theo ID, có xác thực người nhận',
  })
  @Get(':id')
  async getOnebyId(@Req() req, @Param('id') _notiId: string) {
    const { _id } = req.user;
    return await this.notificationsService.findOne(_notiId, _id.toString());
  }

  @ApiOperation({
    summary: 'Xóa một thông báo theo ID, có xác thực người nhận xóa',
    description: 'Xóa một thông báo theo ID, có xác thực người nhận xóa',
  })
  @ApiOkResponse({
    description: 'Xóa thành công',
  })
  @ApiBadRequestResponse({
    description: 'Xóa thất bại',
  })
  @Delete(':id')
  async remove(@Req() req, @Param('id') _notiId: string) {
    const { _id } = req.user;
    await this.notificationsService.remove(_notiId, _id.toString());
    return new ResponseData(
      true,
      { message: 'Xóa tin thông báo thành công' },
      null,
    );
  }
}
