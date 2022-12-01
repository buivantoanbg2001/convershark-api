import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import ResponseData from 'src/utils/response-data';
import { UpdateServerDto } from 'src/servers/dto/update-server.dto';

@ApiTags('Servers')
@ApiBearerAuth()
@ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
@UseGuards(AuthGuard('jwt'))
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @ApiOperation({
    summary: 'Tạo server',
    description: 'Tạo server',
  })
  @ApiOkResponse({ description: 'Tạo server thành công' })
  @ApiBadRequestResponse({ description: 'Tạo server thất bại' })
  @Post()
  create(@Req() req, @Body() createServerDto: CreateServerDto) {
    const _id = req.user;
    createServerDto.hostId = _id;
    return this.serversService.create(createServerDto);
  }

  @ApiOperation({
    summary: 'Cập nhật server',
    description: 'Cập nhật server',
  })
  @ApiOkResponse({ description: 'Cập nhật server thành công' })
  @ApiBadRequestResponse({ description: 'Cập nhật server thất bại' })
  @Patch(':id')
  async update(
    @Req() request,
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    const { _id: hostId } = request.user;
    await this.serversService.update(id, hostId, updateServerDto);
    return new ResponseData(
      true,
      { message: 'Cập nhật server thành công' },
      null,
    );
  }

  @ApiOperation({
    summary: 'Xóa server',
    description: 'Xóa server',
  })
  @ApiOkResponse({ description: 'Successfully deleted server' })
  @ApiNotFoundResponse({ description: "Can't find server to delete" })
  @Delete(':id')
  async remove(@Req() req, @Param('id') serverId: string) {
    const { _id: hostId } = req.user;
    await this.serversService.remove(serverId, hostId);
    return new ResponseData(true, { message: 'Xóa server thành công' }, null);
  }
}
