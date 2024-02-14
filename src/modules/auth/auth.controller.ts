import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { Logger } from '@/common/decorator/logger.decorator';
import { logger } from '@/common/logger';

@Logger()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDTO, @Query() query: any) {
    return await this.authService.login(body)
  }

  @Post('register')
  async register(@Body() body: RegisterDTO) {
    return await this.authService.register(body)
  }
}
