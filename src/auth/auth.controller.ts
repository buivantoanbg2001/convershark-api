import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserDto } from 'src/auth/dto/auth-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Đăng nhập')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập',
  })
  @ApiOkResponse({ description: 'Đăng nhập thành công' })
  @ApiBadRequestResponse({ description: 'Đăng nhập thất bại' })
  @Post('login')
  async login(@Body() authUserDto: AuthUserDto) {
    return this.authService.login(authUserDto);
  }

  @ApiOperation({
    summary: 'Đăng ký',
    description: 'Đăng ký',
  })
  @ApiOkResponse({ description: 'Đăng ký thành công' })
  @ApiBadRequestResponse({ description: 'Đăng ký thất bại' })
  @Post('register')
  async register(@Body() authUserDto: AuthUserDto) {
    return this.authService.register(authUserDto);
  }
}
